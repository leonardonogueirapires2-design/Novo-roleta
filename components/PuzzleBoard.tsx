import React from 'react';
import { Puzzle } from '../types';

interface PuzzleBoardProps {
  puzzle: Puzzle | null;
  guessedLetters: Set<string>;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ puzzle, guessedLetters }) => {
  if (!puzzle) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-coke-black/20 rounded-xl border-2 border-white/30 backdrop-blur-sm">
        <span className="text-white text-xl font-medium tracking-wide">Aguardando rodada...</span>
      </div>
    );
  }

  const words = puzzle.phrase.toUpperCase().split(' ');

  return (
    <div className="flex flex-col items-center justify-center w-full bg-coke-red border-4 border-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)',
            backgroundSize: '20px 20px'
        }}></div>

      <div className="bg-white text-coke-red px-6 py-2 rounded-full font-bold text-lg mb-8 shadow-md z-10 border-2 border-coke-red">
        TEMA: {puzzle.category}
      </div>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 z-10">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="flex gap-1 flex-wrap justify-center">
            {word.split('').map((char, charIndex) => {
              const isGuessed = guessedLetters.has(char);
              const isLetter = /[A-Z]/.test(char);

              if (!isLetter) {
                // Non-letter characters (hyphens, apostrophes) are always shown directly transparently
                return (
                    <div key={`${wordIndex}-${charIndex}`} className="w-10 h-14 md:w-14 md:h-20 flex items-center justify-center">
                         <span className="text-white font-bold text-4xl">{char}</span>
                    </div>
                )
              }

              return (
                <div
                  key={`${wordIndex}-${charIndex}`}
                  className={`
                    w-10 h-14 md:w-14 md:h-20 flex items-center justify-center 
                    border-2 border-white shadow-md rounded-md transition-all duration-500 transform
                    ${isGuessed ? 'bg-white rotate-y-180' : 'bg-white'} 
                  `}
                >
                    {/* The White Box is the cover. If guessed, we show the letter. */}
                    {isGuessed ? (
                         <span className="text-coke-black font-bold text-3xl md:text-5xl animate-in fade-in zoom-in duration-300">
                             {char}
                         </span>
                    ) : (
                        <div className="w-full h-full bg-white rounded-sm"></div>
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
