import React, { useState } from 'react';
import { Puzzle } from '../types';
import { X, Plus, Trash2, PlayCircle, Play, RotateCcw } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  upcomingPuzzles: Puzzle[];
  onAddPuzzle: (puzzle: Puzzle) => void;
  onLoadPuzzle: (id: string) => void;
  onDeletePuzzle: (id: string) => void;
  onClearQueue: () => void;
  onStartGame: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  upcomingPuzzles,
  onAddPuzzle,
  onLoadPuzzle,
  onDeletePuzzle,
  onClearQueue,
  onStartGame
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // New Puzzle State
  const [category, setCategory] = useState('');
  const [phrase, setPhrase] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !phrase) return;
    
    const newPuzzle: Puzzle = {
      id: Date.now().toString(),
      category: category.toUpperCase(),
      phrase: phrase.toUpperCase()
    };
    
    onAddPuzzle(newPuzzle);
    setCategory('');
    setPhrase('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-coke-black text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Painel de Controle</h2>
          <button onClick={onClose} className="hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-gray-800">
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
              <div className="text-center text-gray-500 mb-2">Digite a senha de administrador</div>
              <input
                type="password"
                placeholder="Senha"
                className="border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-coke-red"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="bg-coke-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                ACESSAR
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Add New */}
              <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-coke-red flex items-center gap-2">
                  <Plus size={20} /> Nova Palavra
                </h3>
                <form onSubmit={handleAdd} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Categoria (ex: FILME, FRUTA)"
                    className="border border-gray-300 rounded-md p-2 outline-none focus:border-coke-red"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Palavra ou Frase Secreta"
                    className="border border-gray-300 rounded-md p-2 outline-none focus:border-coke-red"
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                  />
                  <button className="bg-coke-black text-white py-2 rounded-md font-bold hover:bg-gray-800 transition-colors">
                    ADICIONAR À FILA
                  </button>
                </form>
              </section>

              {/* List */}
              <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-700">Fila de Palavras ({upcomingPuzzles.length})</h3>
                    {upcomingPuzzles.length > 0 && (
                        <button 
                            onClick={onClearQueue}
                            className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                        >
                            <RotateCcw size={14} /> LIMPAR FILA
                        </button>
                    )}
                </div>
                
                <div className="bg-gray-100 rounded-xl p-2 min-h-[100px] max-h-[300px] overflow-y-auto mb-4 border border-gray-200">
                    {upcomingPuzzles.length === 0 ? (
                    <div className="text-center text-gray-400 py-8 italic">
                        Fila vazia. Adicione palavras acima.
                    </div>
                    ) : (
                    <ul className="space-y-2">
                        {upcomingPuzzles.map((p, index) => (
                        <li key={p.id} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="bg-gray-200 text-gray-600 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                                    {index + 1}
                                </span>
                                <div>
                                    <div className="text-xs font-bold text-coke-red">{p.category}</div>
                                    <div className="font-medium text-gray-800 text-sm">{p.phrase}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                            <button 
                                onClick={() => {
                                    onLoadPuzzle(p.id);
                                    onClose();
                                }}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Carregar Apenas Esta"
                            >
                                <PlayCircle size={18} />
                            </button>
                            <button 
                                onClick={() => onDeletePuzzle(p.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Remover"
                            >
                                <Trash2 size={18} />
                            </button>
                            </div>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>

                <button 
                    onClick={onStartGame}
                    disabled={upcomingPuzzles.length === 0}
                    className={`
                        w-full py-4 rounded-xl font-black text-xl shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95
                        ${upcomingPuzzles.length === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-900/30'
                        }
                    `}
                >
                    <Play size={24} fill="currentColor" /> INICIAR JOGO COM A FILA
                </button>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};