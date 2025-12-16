import React from 'react';
import { Puzzle } from '../types';

interface PuzzleBoardProps {
  puzzle: Puzzle | null;
  guessedLetters: Set<string>;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ puzzle, guessedLetters }) => {
  if (!puzzle) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-black/20 rounded-3xl border-2 border-white/20 backdrop-blur-md shadow-inner">
        <span className="text-white text-2xl font-bold tracking-widest italic animate-pulse">AGUARDANDO RODADA...</span>
      </div>
    );
  }

  const words = puzzle.phrase.toUpperCase().split(' ');

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gradient-to-b from-coke-red to-coke-darkRed border-4 border-white/50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        
        {/* Metallic Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
        
        {/* Vending Machine Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '100% 4px' }}>
        </div>

      <div className="bg-black/80 text-white border-2 border-white/50 px-8 py-2 rounded-full font-black text-xl mb-10 shadow-lg z-10 tracking-widest uppercase flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        TEMA: <span className="text-yellow-400">{puzzle.category}</span>
      </div>

      <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 z-10 w-full">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="flex gap-2 flex-wrap justify-center">
            {word.split('').map((char, charIndex) => {
              const isGuessed = guessedLetters.has(char);
              const isLetter = /[A-Z]/.test(char);

              if (!isLetter) {
                return (
                    <div key={`${wordIndex}-${charIndex}`} className="w-10 h-14 md:w-16 md:h-20 flex items-center justify-center">
                         <span className="text-white font-black text-5xl drop-shadow-md">{char}</span>
                    </div>
                )
              }

              return (
                <div
                  key={`${wordIndex}-${charIndex}`}
                  className={`
                    w-12 h-16 md:w-16 md:h-24 flex items-center justify-center 
                    rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-all duration-700 transform perspective-1000
                    ${isGuessed ? 'bg-white rotate-y-180' : 'bg-gradient-to-br from-white/90 to-gray-300'} 
                  `}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* The Tile (Front/Back) handled via conditional rendering for simplicity in this stack, but styled to look 3D */}
                    {isGuessed ? (
                         <span className="text-coke-red font-black text-4xl md:text-6xl animate-in zoom-in duration-300 drop-shadow-sm">
                             {char}
                         </span>
                    ) : (
                        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                             {/* Empty Tile Texture */}
                             <div className="w-full h-full bg-gradient-to-br from-white via-gray-100 to-gray-300 opacity-50"></div>
                        </div>
                    )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};