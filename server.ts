import express from "express";
import { createServer as createHttpServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import { Player } from "./types";
import fs from "fs/promises";
import path from "path";
import admin from "firebase-admin";

const DB_PATH = path.join(process.cwd(), "leaderboard.json");

// Firebase Initialization
let db: admin.firestore.Firestore | null = null;
const initFirebase = () => {
  if (db) return db;
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
      db = admin.firestore();
      console.log("Firebase Firestore initialized successfully.");
      return db;
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      return null;
    }
  }
  return null;
};

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // 데이터베이스 초기화 (파일에서 읽기 - 로컬 백업용)
  let leaderboard: Player[] = [];
  
  // Firebase에서 초기 데이터 가져오기 시도
  const syncFromFirestore = async () => {
    const firestore = initFirebase();
    if (firestore) {
      try {
        const snapshot = await firestore.collection("leaderboard")
          .orderBy("score", "desc")
          .orderBy("time", "asc")
          .limit(10)
          .get();
        
        const remoteData: Player[] = [];
        snapshot.forEach(doc => {
          remoteData.push(doc.data() as Player);
        });
        
        if (remoteData.length > 0) {
          leaderboard = remoteData;
          console.log("Synced leaderboard from Firestore.");
        }
      } catch (error) {
        console.error("Failed to sync from Firestore:", error);
      }
    }
  };

  // 초기 실행 시 싱크
  await syncFromFirestore();

  // 로컬 백업 파일 읽기 (Firebase 실패 시 대비)
  if (leaderboard.length === 0) {
    try {
      const data = await fs.readFile(DB_PATH, "utf-8");
      leaderboard = JSON.parse(data);
    } catch (e) {
      leaderboard = [];
    }
  }

  const saveLeaderboard = async (player: Player) => {
    // 1. Firebase 저장
    const firestore = initFirebase();
    if (firestore) {
      try {
        // 닉네임 기준 문서 ID 생성 (공백 제거 및 소문자화)
        const docId = player.name.toLowerCase().replace(/\s/g, '');
        const docRef = firestore.collection("leaderboard").doc(docId);
        
        const doc = await docRef.get();
        if (doc.exists) {
          const current = doc.data() as Player;
          // 점수가 더 높거나, 점수는 같고 시간이 더 짧은 경우에만 업데이트
          if (player.score > current.score || (player.score === current.score && player.time < current.time)) {
            await docRef.set({ ...player, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
          }
        } else {
          await docRef.set({ ...player, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        }
      } catch (error) {
        console.error("Firestore save failed:", error);
      }
    }

    // 2. 로컬 메모리 업데이트 및 브로드캐스트를 위해 정렬된 Top 10 유지
    const existingIdx = leaderboard.findIndex(p => p.name === player.name);
    if (existingIdx >= 0) {
      const current = leaderboard[existingIdx];
      if (player.score > current.score || (player.score === current.score && player.time < current.time)) {
        leaderboard[existingIdx] = player;
      }
    } else {
      leaderboard.push(player);
    }

    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.time - b.time;
    });

    leaderboard = leaderboard.slice(0, 10);

    // 3. 로컬 파일 백업
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(leaderboard, null, 2));
    } catch (e) {
      console.error("Failed to save local leaderboard backup:", e);
    }
  };

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.emit("leaderboardUpdate", leaderboard);

    socket.on("submitScore", async (player: Player) => {
      console.log("Score submitted:", player);
      await saveLeaderboard(player);
      io.emit("leaderboardUpdate", leaderboard);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
