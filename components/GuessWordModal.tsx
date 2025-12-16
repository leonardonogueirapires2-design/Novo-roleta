import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface GuessWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (guess: string) => void;
  category: string;
}

export const GuessWordModal: React.FC<GuessWordModalProps> = ({ isOpen, onClose, onConfirm, category }) => {
  const [guess, setGuess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onConfirm(guess);
      setGuess('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform scale-100">
        <div className="bg-coke-red text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
             CHUTAR PALAVRA
          </h2>
          <button onClick={onClose} className="hover:text-yellow-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-2 text-sm text-center">
             Tema: <span className="font-bold text-coke-black">{category}</span>
          </p>
          <p className="text-red-500 mb-6 text-xs text-center font-bold">
             CUIDADO: Se errar, você perde a vez!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              autoFocus
              placeholder="Digite a resposta completa..."
              className="border-4 border-gray-200 rounded-xl p-4 text-center text-2xl font-bold uppercase outline-none focus:border-coke-red text-coke-black placeholder:text-gray-300 placeholder:text-lg"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-3 mt-2">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    CANCELAR
                </button>
                <button 
                    type="submit"
                    className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    <Check size={20} /> CONFIRMAR
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};