import React from 'react';
import { Player } from '../types';
import { User, Trophy } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  selectedPlayerId: string | null;
  onSelectPlayer?: (id: string) => void;
  interactive?: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, selectedPlayerId, onSelectPlayer, interactive = false }) => {
  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border-2 border-slate-100 overflow-hidden">
      <div className="bg-indigo-500 p-4 text-white flex items-center justify-between shadow-md z-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User size={24} /> 참가자 정보
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
        {sortedPlayers.length === 0 ? (
          <div className="text-center text-slate-400 py-10 flex flex-col items-center">
            <User size={48} className="mb-2 opacity-20" />
            <p>참가자 정보가 없습니다.</p>
          </div>
        ) : (
          sortedPlayers.map((player, index) => {
            const isSelected = selectedPlayerId === player.id;
            return (
              <div
                key={player.id}
                onClick={() => interactive && onSelectPlayer && onSelectPlayer(player.id)}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                  interactive ? 'cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-md' : ''
                } ${
                  isSelected 
                    ? 'bg-indigo-100 border-2 border-indigo-400 transform scale-[1.02]' 
                    : 'bg-white border-2 border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${
                    index === 0 && player.score > 0 ? 'bg-yellow-400 text-yellow-900' : 
                    index === 1 && player.score > 0 ? 'bg-slate-300 text-slate-800' :
                    index === 2 && player.score > 0 ? 'bg-amber-600 text-white' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`font-medium truncate ${isSelected ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>
                    {player.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                  <Trophy size={14} className={player.score > 0 ? "text-yellow-500" : "text-slate-400"} />
                  <span className="font-bold text-slate-700">{player.score}점</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlayerList;