import React from 'react';

interface KeyboardProps {
  guessedLetters: Set<string>;
  onGuess: (letter: string) => void;
  disabled: boolean;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const Keyboard: React.FC<KeyboardProps> = ({ guessedLetters, onGuess, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1 md:gap-2 max-w-4xl mx-auto p-1 md:p-4">
      {LETTERS.map((letter) => {
        const isUsed = guessedLetters.has(letter);
        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={isUsed || disabled}
            className={`
              w-8 h-10 md:w-12 md:h-12 rounded-lg font-bold text-base md:text-xl shadow-sm transition-all
              ${isUsed 
                ? 'bg-coke-black/20 text-white/40 cursor-not-allowed' 
                : 'bg-white text-coke-red hover:bg-gray-100 hover:shadow-md hover:-translate-y-1 active:translate-y-0'
              }
              ${disabled && !isUsed ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};