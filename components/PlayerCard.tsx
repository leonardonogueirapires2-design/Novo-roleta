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
        relative flex flex-col items-center justify-center p-2 md:p-5 rounded-xl md:rounded-3xl transition-all duration-300 border backdrop-blur-md
        ${isActive 
            ? 'bg-white/90 border-yellow-400 scale-100 md:scale-105 z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
            : 'bg-white/10 border-white/20 scale-95 md:scale-100 hover:bg-white/20'
        }
      `}
    >
      {/* Icon Circle - Hidden on very small screens, small on mobile */}
      <div className={`
        hidden md:flex p-2 md:p-4 rounded-full mb-1 md:mb-3 shadow-lg border-2 border-white
        ${isActive ? 'bg-coke-red text-white' : 'bg-black/30 text-white/70'}
      `}>
        <User size={20} className="md:w-7 md:h-7" />
      </div>
      
      <h3 className={`font-bold text-xs md:text-lg mb-0 md:mb-1 tracking-wide uppercase truncate w-full text-center ${isActive ? 'text-coke-red' : 'text-white'}`}>
        {player.name}
      </h3>
      
      {/* Score Display */}
      <div className={`text-xl md:text-4xl font-black font-mono tracking-tighter drop-shadow-md ${isActive ? 'text-coke-black' : 'text-white'}`}>
        {player.score}
      </div>

      {isActive && (
        <>
            <div className="absolute -top-2 -right-1 md:-top-3 md:-right-3 bg-yellow-400 text-coke-red text-[8px] md:text-xs font-black px-2 py-0.5 rounded-full shadow-lg animate-bounce border border-white">
            VEZ
            </div>
            {/* Active Glow */}
            <div className="absolute inset-0 rounded-xl md:rounded-3xl ring-2 md:ring-4 ring-yellow-400/30 pointer-events-none"></div>
        </>
      )}
    </div>
  );
};