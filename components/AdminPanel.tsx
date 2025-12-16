import React, { useState } from 'react';
import { Puzzle } from '../types';
import { X, Plus, Trash2, PlayCircle } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  upcomingPuzzles: Puzzle[];
  onAddPuzzle: (puzzle: Puzzle) => void;
  onLoadPuzzle: (id: string) => void;
  onDeletePuzzle: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  upcomingPuzzles,
  onAddPuzzle,
  onLoadPuzzle,
  onDeletePuzzle
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
                <h3 className="font-bold text-lg mb-4 text-gray-700">Fila de Palavras</h3>
                {upcomingPuzzles.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 italic">Nenhuma palavra na fila.</div>
                ) : (
                  <ul className="space-y-3">
                    {upcomingPuzzles.map(p => (
                      <li key={p.id} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                        <div>
                          <div className="text-xs font-bold text-coke-red">{p.category}</div>
                          <div className="font-medium text-gray-800">{p.phrase}</div>
                        </div>
                        <div className="flex gap-2">
                           <button 
                            onClick={() => {
                                onLoadPuzzle(p.id);
                                onClose();
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="Carregar Agora"
                           >
                            <PlayCircle size={20} />
                           </button>
                           <button 
                            onClick={() => onDeletePuzzle(p.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                            title="Remover"
                           >
                            <Trash2 size={20} />
                           </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
