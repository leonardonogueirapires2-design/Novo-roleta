import React from 'react';
import { Player } from '../types';
import { User } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  onUpdateScore: (id: number, delta: number) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
  return (
    <div 
      className={`
        relative flex flex-col items-center justify-between p-5 rounded-3xl transition-all duration-500 border-2 backdrop-blur-md
        ${isActive 
            ? 'bg-white/90 border-yellow-400 scale-105 z-10 shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
            : 'bg-white/10 border-white/20 scale-100 hover:bg-white/20'
        }
      `}
    >
      {/* Icon Circle */}
      <div className={`
        p-4 rounded-full mb-3 shadow-lg border-2 border-white
        ${isActive ? 'bg-coke-red text-white' : 'bg-black/30 text-white/70'}
      `}>
        <User size={28} />
      </div>
      
      <h3 className={`font-bold text-lg mb-1 tracking-wide uppercase ${isActive ? 'text-coke-red' : 'text-white'}`}>
        {player.name}
      </h3>
      
      {/* Score Display (Digital Clock style or clear text) */}
      <div className={`text-4xl font-black mb-2 font-mono tracking-tighter drop-shadow-md ${isActive ? 'text-coke-black' : 'text-white'}`}>
        {player.score}
      </div>

      {isActive && (
        <>
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-coke-red text-xs font-black px-3 py-1 rounded-full shadow-lg animate-bounce border-2 border-white">
            SUA VEZ!
            </div>
            {/* Active Glow */}
            <div className="absolute inset-0 rounded-3xl ring-4 ring-yellow-400/30 pointer-events-none"></div>
        </>
      )}
      
      {/* Water Drops (Decoration) */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-white/40 rounded-full blur-[1px]"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-white/30 rounded-full blur-[1px]"></div>
    </div>
  );
};