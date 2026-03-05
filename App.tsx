import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Player, AppInfo } from './types';
import { APPS_DATA } from './constants';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import Podium from './components/Podium';
import { db } from './firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  setDoc, 
  doc, 
  getDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameApps, setGameApps] = useState<AppInfo[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);

  // Firestore 실시간 리더보드 구독
  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('score', 'desc'),
      orderBy('time', 'asc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const players: Player[] = [];
      snapshot.forEach((doc) => {
        players.push(doc.data() as Player);
      });
      setLeaderboard(players);
    });

    return () => unsubscribe();
  }, []);

  const handleResetLeaderboard = useCallback(async () => {
    const password = prompt("리더보드 초기화를 위해 비밀번호를 입력하세요:");
    if (password === "reset1234") { // 비밀번호 설정
      if (confirm("정말로 모든 순위 기록을 삭제하시겠습니까?")) {
        try {
          // 현재 리더보드에 있는 모든 문서를 삭제 (실제로는 전체 컬렉션을 삭제해야 하지만 클라이언트에서는 루프 필요)
          // 여기서는 현재 로드된 10개뿐만 아니라 전체를 삭제하려면 더 복잡하지만, 
          // 간단하게 현재 보이는 것들을 삭제하는 방식으로 구현하거나 
          // 관리자용 별도 로직을 구성할 수 있습니다.
          for (const player of leaderboard) {
            const docId = player.name.toLowerCase().replace(/\s/g, '');
            await deleteDoc(doc(db, 'leaderboard', docId));
          }
          alert("리더보드가 초기화되었습니다.");
        } catch (error) {
          console.error("Error resetting leaderboard:", error);
          alert("초기화 중 오류가 발생했습니다.");
        }
      }
    } else if (password !== null) {
      alert("비밀번호가 틀렸습니다.");
    }
  }, [leaderboard]);

  const handleStartGame = useCallback((playerName: string) => {
    const newPlayer: Player = { 
      id: crypto.randomUUID(), 
      name: playerName, 
      score: 0,
      time: 0 
    };
    setCurrentPlayer(newPlayer);
    
    const shuffledApps = [...APPS_DATA];
    for (let i = shuffledApps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledApps[i], shuffledApps[j]] = [shuffledApps[j], shuffledApps[i]];
    }
    
    setGameApps(shuffledApps.slice(0, 7)); 
    setCurrentRoundIndex(0);
    setStartTime(Date.now());
    setGameState('PLAYING');
  }, []);

  const handleCorrectAnswer = useCallback((playerId: string, points: number) => {
    setCurrentPlayer(prev => {
      if (!prev || prev.id !== playerId) return prev;
      const updated = { ...prev, score: prev.score + points };
      return updated;
    });
  }, []);

  const handleNextRound = useCallback(async () => {
    if (currentRoundIndex + 1 < gameApps.length) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      const endTime = Date.now();
      const totalTime = Math.floor((endTime - startTime) / 1000);
      
      if (currentPlayer) {
        const finalPlayer = { ...currentPlayer, time: totalTime };
        setCurrentPlayer(finalPlayer);
        
        // Firestore에 점수 제출
        try {
          const docId = finalPlayer.name.toLowerCase().replace(/\s/g, '');
          const docRef = doc(db, 'leaderboard', docId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const existingData = docSnap.data() as Player;
            // 최고 기록일 때만 업데이트
            if (finalPlayer.score > existingData.score || 
               (finalPlayer.score === existingData.score && finalPlayer.time < existingData.time)) {
              await setDoc(docRef, {
                ...finalPlayer,
                updatedAt: serverTimestamp()
              });
            }
          } else {
            await setDoc(docRef, {
              ...finalPlayer,
              updatedAt: serverTimestamp()
            });
          }
        } catch (error) {
          console.error("Error submitting score to Firestore:", error);
        }
      }
      
      setGameState('ENDED');
    }
  }, [currentRoundIndex, gameApps.length, startTime, currentPlayer]);

  const handleRestart = useCallback(() => {
    setGameState('LOBBY');
  }, []);

  const displayPlayers = [...leaderboard];
  if (currentPlayer && !displayPlayers.some(p => p.id === currentPlayer.id)) {
    displayPlayers.push(currentPlayer);
  }

  return (
    <div className="min-h-screen py-4 px-4 flex flex-col items-center justify-center">
      {gameState === 'LOBBY' && (
        <Lobby 
          onStartGame={handleStartGame} 
          onResetLeaderboard={handleResetLeaderboard}
          leaderboard={leaderboard}
          currentPlayer={currentPlayer}
        />
      )}
      
      {gameState === 'PLAYING' && gameApps.length > 0 && (
        <div className="w-full max-w-6xl animate-pop-in">
          <GameBoard 
            key={currentRoundIndex}
            currentApp={gameApps[currentRoundIndex]}
            roundIndex={currentRoundIndex}
            totalRounds={7} 
            players={displayPlayers}
            selectedPlayerId={currentPlayer?.id || null}
            onCorrectAnswer={handleCorrectAnswer}
            onNextRound={handleNextRound}
          />
        </div>
      )}

      {gameState === 'ENDED' && (
        <div className="w-full animate-pop-in flex justify-center items-center h-[calc(100vh-2rem)]">
           <Podium 
             players={displayPlayers} 
             currentPlayerId={currentPlayer?.id} 
             onRestart={handleRestart} 
           />
        </div>
      )}
    </div>
  );
};

export default App;
