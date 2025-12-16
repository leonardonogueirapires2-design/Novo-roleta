import React from 'react';
import { Player } from '../types';
import { User, Plus, Minus } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  onUpdateScore: (id: number, delta: number) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive, onUpdateScore }) => {
  return (
    <div 
      className={`
        relative flex flex-col items-center justify-between p-4 rounded-2xl shadow-lg transition-all duration-300 border-4
        ${isActive ? 'bg-white border-yellow-400 scale-105 z-10' : 'bg-white/90 border-transparent opacity-80'}
      `}
    >
      <div className="bg-coke-red text-white p-3 rounded-full mb-2 shadow-md">
        <User size={24} />
      </div>
      
      <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-coke-red' : 'text-gray-600'}`}>
        {player.name}
      </h3>
      
      <div className="text-3xl font-black text-coke-black mb-4 font-mono">
        {player.score}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onUpdateScore(player.id, -100)}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          title="-100"
        >
          <Minus size={16} />
        </button>
        <button 
          onClick={() => onUpdateScore(player.id, 100)}
          className="p-1 rounded-full bg-coke-red hover:bg-red-700 text-white transition-colors"
          title="+100"
        >
          <Plus size={16} />
        </button>
      </div>

      {isActive && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-coke-red text-xs font-bold px-2 py-1 rounded-full shadow animate-bounce">
          SUA VEZ
        </div>
      )}
    </div>
  );
};
