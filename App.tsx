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
