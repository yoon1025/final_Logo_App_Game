import React from 'react';
import { Player } from '../types';
import { Trophy, RotateCcw, Sparkles, Clock } from 'lucide-react';

interface PodiumProps {
  players: Player[];
  currentPlayerId?: string;
  onRestart: () => void;
}

const Podium: React.FC<PodiumProps> = ({ players, currentPlayerId, onRestart }) => {
  // 정렬: 1순위 점수(내림차순), 2순위 시간(오름차순)
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.time - b.time;
  });
  
  const top3 = sortedPlayers.slice(0, 3);
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const currentPlayerRank = sortedPlayers.findIndex(p => p.id === currentPlayerId) + 1;

  const getPodiumHeight = (index: number) => {
    switch(index) {
      case 0: return "h-[60%] min-h-[150px]";
      case 1: return "h-[45%] min-h-[110px]";
      case 2: return "h-[30%] min-h-[70px]";
      default: return "h-0";
    }
  };

  const displayOrder = [
    { player: top3[1], rank: 1 },
    { player: top3[0], rank: 0 },
    { player: top3[2], rank: 2 }
  ];

  return (
    <div className="flex flex-row w-full h-full max-w-6xl mx-auto gap-4 lg:gap-6 items-stretch justify-center relative">
      
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-wrap justify-around items-start pt-10 gap-10 overflow-hidden z-0">
        {Array.from({length: 20}).map((_, i) => (
          <div key={i} className={`text-4xl animate-float`} style={{ animationDelay: `${Math.random() * 2}s` }}>
            {['🎉', '✨', '🏆', '🎊', '🎈'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Left Column: Hall of Fame & Restart Button */}
      <div className="w-[300px] shrink-0 flex flex-col bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-10">
        {/* Header */}
        <div className="bg-indigo-400 py-3 px-4 text-white flex items-center justify-center shadow-md shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy size={20} className="text-yellow-300" /> 
            명예의 전당 (TOP 10)
          </h2>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-3 space-y-2">
          {/* My Score section */}
          {currentPlayer && (
            <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-3 shrink-0 shadow-sm relative overflow-hidden mb-2">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10">내 점수</div>
              <div className="flex items-center mt-1">
                {/* 순위 */}
                <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-900 shrink-0 shadow-inner text-xs mr-3">
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
                  <span className="font-black text-lg text-indigo-600">{currentPlayer.score}점</span>
                </div>
              </div>
            </div>
          )}

          {/* Top 10 List */}
          {players.length === 0 ? (
            <p className="text-center text-slate-400 py-10 text-sm font-medium">기록이 없습니다.</p>
          ) : (
            sortedPlayers.slice(0, 10).map((entry, idx) => {
              const isCurrent = entry.id === currentPlayerId;
              return (
                <div key={entry.id} className={`flex items-center p-3 rounded-xl transition-all border ${
                  isCurrent 
                    ? 'bg-white border-indigo-300 shadow-sm' 
                    : 'bg-white border-slate-100 shadow-sm'
                }`}>
                  {/* 순위 */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mr-3 ${
                    idx === 0 ? 'bg-yellow-400 text-yellow-900 shadow-inner' :
                    idx === 1 ? 'bg-slate-300 text-slate-800 shadow-inner' :
                    idx === 2 ? 'bg-amber-600 text-white shadow-inner' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* 닉네임 (왼쪽) */}
                  <div className="flex-1 min-w-0">
                    <span className={`font-bold text-sm truncate block ${isCurrent ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {entry.name}
                    </span>
                  </div>

                  {/* 시간 (중앙) */}
                  <div className="px-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Clock size={10} /> {entry.time}초
                    </span>
                  </div>

                  {/* 점수 (오른쪽) */}
                  <div className="shrink-0 ml-2 text-right min-w-[50px]">
                    <span className={`font-bold text-sm ${idx < 3 ? 'text-amber-500' : 'text-slate-600'}`}>
                      {entry.score}점
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Restart Button (Bottom Fixed in Left Column) */}
        <div className="p-3 bg-slate-600 shrink-0 cursor-pointer hover:bg-slate-700 transition-colors" onClick={onRestart}>
          <div className="w-full py-2 flex items-center justify-center gap-2 text-white font-bold text-base">
            <RotateCcw size={18} />
            다시 도전하기
          </div>
        </div>
      </div>

      {/* Right Column: Podium */}
      <div className="flex-1 flex flex-col bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-6 relative overflow-hidden z-10">
        
        {/* Title */}
        <div className="text-center z-10 flex flex-col items-center shrink-0 mb-6 mt-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 drop-shadow-sm flex items-center justify-center gap-3">
            <Sparkles className="text-indigo-400 shrink-0" size={24} />
            <span className="truncate">최종우승자 발표</span>
            <Sparkles className="text-purple-400 shrink-0" size={24} />
          </h1>
        </div>

        {/* Podium Display */}
        {players.length > 0 && (
          <div className="flex items-end justify-center gap-4 lg:gap-8 w-full flex-1 z-10 pb-4">
            {displayOrder.map((item, idx) => {
              if (!item.player) return <div key={idx} className="w-1/3 max-w-[140px]" />; 
              
              const isFirst = item.rank === 0;
              const isCurrent = item.player.id === currentPlayerId;
              return (
                <div key={item.player.id} className="w-24 md:w-32 lg:w-40 flex flex-col items-center justify-end h-full animate-pop-in" style={{ animationDelay: `${(2 - item.rank) * 0.3}s` }}>
                  <div className="flex flex-col items-center mb-3 relative w-full px-1">
                    <div className={`bg-white px-2 py-3 rounded-2xl shadow-lg border-2 text-center relative z-10 w-full ${isCurrent ? 'border-indigo-400 bg-indigo-50' : 'border-slate-100'}`}>
                      {isCurrent && <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">ME</div>}
                      <div className="font-black text-sm md:text-base lg:text-lg text-slate-800 truncate">{item.player.name}</div>
                      <div className="font-bold text-xs lg:text-sm text-indigo-500 mt-1">{item.player.score}점</div>
                      <div className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-0.5 mt-1"><Clock size={10} /> {item.player.time}초</div>
                    </div>
                    {isFirst && <Trophy size={40} className="text-yellow-400 drop-shadow-md absolute -top-12 z-20 animate-bounce" />}
                  </div>
                  <div className={`w-full bg-gradient-to-t ${
                    isFirst ? 'from-indigo-500 to-indigo-400' : 
                    item.rank === 1 ? 'from-slate-400 to-slate-300' : 
                    'from-amber-500 to-amber-400'
                  } rounded-t-xl shadow-inner border-t-2 border-white/40 flex items-start justify-center pt-4 ${getPodiumHeight(item.rank)} transition-all duration-1000 ease-out relative overflow-hidden shrink-0`}>
                    <div className="absolute inset-0 bg-white/10 flex items-start justify-center pt-3">
                      <span className="text-4xl lg:text-6xl font-black text-white/50">{item.rank + 1}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Podium;
