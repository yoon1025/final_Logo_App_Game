import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, AppInfo } from './types';
import { APPS_DATA } from './constants';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import Podium from './components/Podium';
import { io, Socket } from 'socket.io-client';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameApps, setGameApps] = useState<AppInfo[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const socketRef = useRef<Socket | null>(null);

  // Socket.io 연결 설정
  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.on('leaderboardUpdate', (updatedBoard: Player[]) => {
      setLeaderboard(updatedBoard);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleStartGame = useCallback((playerName: string) => {
    const newPlayer: Player = { 
      id: crypto.randomUUID(), 
      name: playerName, 
      score: 0,
      time: 0 
    };
    setCurrentPlayer(newPlayer);
    
    // 전체 앱 중에서 무작위로 섞습니다.
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

  const handleNextRound = useCallback(() => {
    if (currentRoundIndex + 1 < gameApps.length) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      const endTime = Date.now();
      const totalTime = Math.floor((endTime - startTime) / 1000);
      
      setCurrentPlayer(prev => {
        if (!prev) return prev;
        const finalPlayer = { ...prev, time: totalTime };
        
        // 서버에 최종 점수와 시간 제출
        if (socketRef.current) {
          socketRef.current.emit('submitScore', finalPlayer);
        }
        
        return finalPlayer;
      });
      
      setGameState('ENDED');
    }
  }, [currentRoundIndex, gameApps.length, startTime]);

  const handleRestart = useCallback(() => {
    setGameState('LOBBY');
  }, []);

  // 화면에 표시할 플레이어 목록: Top 10 + (순위권에 없는 현재 플레이어)
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
