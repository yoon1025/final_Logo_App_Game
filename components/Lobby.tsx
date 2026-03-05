import React, { useState } from 'react';
import { Play, Sparkles, Smartphone, Zap, Trophy, Clock } from 'lucide-react';
import { Player } from '../types';

interface LobbyProps {
  onStartGame: (name: string) => void;
  onResetLeaderboard: () => void;
  leaderboard: Player[];
  currentPlayer?: Player | null;
}

const Lobby: React.FC<LobbyProps> = ({ onStartGame, onResetLeaderboard, leaderboard, currentPlayer }) => {
  const [nickname, setNickname] = useState('');

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed) {
      onStartGame(trimmed);
    }
  };

  const currentPlayerRank = leaderboard.findIndex(p => p.id === currentPlayer?.id) + 1;

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-4 mb-10 flex flex-col md:flex-row items-start justify-center gap-6 animate-pop-in h-full">
      
      {/* 화려한 배경 Blob 효과 */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 -right-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-16 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* 명예의 전당 (리더보드) 카드 - 왼쪽 배치 (GameBoard 사이드바와 동일 규격) */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-auto md:h-[600px] shrink-0 flex flex-col bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 overflow-hidden z-10">
        {/* Header */}
        <div className="bg-indigo-500 py-4 px-4 text-white flex items-center justify-center shadow-md shrink-0">
          <h2 className="text-lg font-black flex items-center gap-2 tracking-tight">
            <Trophy size={22} className="text-yellow-300" /> 
            명예의 전당 (TOP 10)
          </h2>
        </div>
        
        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-3 space-y-2">
          {/* My Score section */}
          {currentPlayer && (
            <div className="bg-indigo-50 rounded-2xl border-2 border-indigo-200 p-3 shrink-0 shadow-sm relative overflow-hidden mb-3">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10">내 최고 기록</div>
              <div className="flex items-center mt-1">
                {/* 순위 */}
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white shrink-0 shadow-md text-xs mr-3">
                  {currentPlayerRank > 0 ? `${currentPlayerRank}위` : '-'}
                </div>
                
                {/* 닉네임 (왼쪽) */}
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-indigo-900 truncate block">{currentPlayer.name}</span>
                </div>

                {/* 시간 (중앙) */}
                <div className="px-2 shrink-0">
                  <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-0.5 bg-white/50 px-2 py-1 rounded-lg border border-indigo-100">
                    <Clock size={10} /> {currentPlayer.time}초
                  </span>
                </div>

                {/* 점수 (오른쪽) */}
                <div className="shrink-0 ml-2 text-right min-w-[50px]">
                  <span className="font-black text-xl text-indigo-600">{currentPlayer.score}점</span>
                </div>
              </div>
            </div>
          )}

          {leaderboard.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
              <Trophy size={64} className="opacity-10 mb-4" />
              <p className="font-bold text-base">기록이 없습니다.</p>
              <p className="text-xs mt-1">첫 번째 주인공이 되어보세요!</p>
            </div>
          ) : (
            leaderboard.map((player, index) => (
              <div key={player.id} className="flex items-center p-3 rounded-2xl transition-all border bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 group">
                {/* 순위 */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm mr-3 ${
                  index === 0 ? 'bg-yellow-400 text-yellow-900' :
                  index === 1 ? 'bg-slate-300 text-slate-800' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {index + 1}
                </div>
                
                {/* 닉네임 (왼쪽) */}
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-slate-700 truncate block group-hover:text-indigo-600 transition-colors">
                    {player.name}
                  </span>
                </div>

                {/* 시간 (중앙) */}
                <div className="px-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <Clock size={10} /> {player.time}초
                  </span>
                </div>

                {/* 점수 (오른쪽) */}
                <div className="shrink-0 ml-2 text-right min-w-[50px]">
                  <span className={`font-black text-base ${index < 3 ? 'text-amber-500' : 'text-slate-600'}`}>
                    {player.score}점
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Decorative Bar */}
        <div className="p-4 bg-slate-100 shrink-0 border-t border-slate-200 relative group flex flex-col items-center justify-center gap-1">
          <div className="w-full py-1 flex items-center justify-center gap-2 text-slate-400 font-bold text-xs">
            <Sparkles size={14} className="text-amber-400" />
            실시간 랭킹 업데이트 중
          </div>
          {/* Hidden Admin Reset Button - More visible on hover and positioned below */}
          <button 
            onClick={onResetLeaderboard}
            className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-all text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded hover:bg-slate-200"
          >
            Admin Reset
          </button>
        </div>
      </div>

      {/* 메인 게임 시작 카드 - 오른쪽 배치 (GameBoard와 동일하게 flex-1) */}
      <div className="relative flex-1 w-full bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center self-stretch h-auto min-h-[400px] md:h-[600px]">
        
        {/* 아이콘 영역 */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 animate-pulse rounded-full"></div>
          <div className="relative bg-gradient-to-tr from-indigo-600 to-purple-500 p-5 rounded-[2rem] shadow-lg transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <Smartphone size={48} className="text-white" />
            <Sparkles size={20} className="text-yellow-300 absolute -top-3 -right-3 animate-wiggle" />
          </div>
        </div>

        {/* 타이틀 영역 */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 drop-shadow-sm tracking-tight leading-tight">
            앱 로고 맞추기
          </h1>
          <p className="text-slate-600 font-bold text-base md:text-lg lg:text-xl bg-white/50 inline-block px-6 py-1.5 rounded-full shadow-sm border border-white">
            화면 뒤에 숨겨진 앱은 무엇일까요?
          </p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleStart} className="w-full max-w-sm flex flex-col gap-4 relative z-10">
          <div className="relative group">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="참가자 닉네임 입력"
              maxLength={10}
              autoFocus
              lang="ko"
              spellCheck={false}
              autoComplete="off"
              style={{ imeMode: 'active' } as React.CSSProperties}
              className="w-full px-6 py-4 bg-white shadow-inner border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all text-xl text-center font-bold placeholder:text-slate-300 placeholder:font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
              <Zap size={20} className={nickname.trim() ? "text-amber-400 animate-pulse" : ""} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!nickname.trim()}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-xl font-black text-white shadow-[0_6px_0_rgb(67,56,202)] transition-all active:translate-y-1.5 active:shadow-[0_0px_0_rgb(67,56,202)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[0_6px_0_rgb(67,56,202)] flex justify-center items-center gap-3"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <Play size={24} className="group-hover:animate-bounce relative z-10" fill="currentColor" />
            <span className="relative z-10 tracking-wider">게임 시작!</span>
          </button>
        </form>

        <p className="mt-6 text-slate-400 font-bold text-xs animate-pulse">
          Press Enter to start
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Lobby;
