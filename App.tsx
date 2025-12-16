import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { INITIAL_PUZZLES } from './constants';
import { GamePhase, Player, Puzzle, WheelSector, WheelSectorType } from './types';

// Components
import { PlayerCard } from './components/PlayerCard';
import { PuzzleBoard } from './components/PuzzleBoard';
import { WheelComponent } from './components/WheelComponent';
import { Keyboard } from './components/Keyboard';
import { AdminPanel } from './components/AdminPanel';
import { GuessWordModal } from './components/GuessWordModal';
import { TurnNotification, NotificationType } from './components/TurnNotification';

const INITIAL_PLAYERS: Player[] = [
  { id: 1, name: 'Jogador 1', score: 0 },
  { id: 2, name: 'Jogador 2', score: 0 },
  { id: 3, name: 'Jogador 3', score: 0 },
];

export default function App() {
  // Game State
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzleQueue, setPuzzleQueue] = useState<Puzzle[]>(INITIAL_PUZZLES);
  
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SPINNING);
  const [currentWheelValue, setCurrentWheelValue] = useState<number | null>(null);
  const [lastWheelAction, setLastWheelAction] = useState<string>('Gire a roda para começar!');
  
  // UI State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  
  // Notification State
  const [notification, setNotification] = useState<{ isOpen: boolean; type: NotificationType; message: string }>({ 
    isOpen: false, 
    type: null, 
    message: '' 
  });

  // Initialize
  useEffect(() => {
    if (puzzleQueue.length > 0 && !currentPuzzle) {
        loadPuzzle(puzzleQueue[0].id);
    }
  }, []);

  const activePlayer = players[activePlayerIdx];

  // Logic
  const loadPuzzle = (id: string) => {
    const puzzle = puzzleQueue.find(p => p.id === id);
    if (puzzle) {
      setCurrentPuzzle(puzzle);
      setGuessedLetters(new Set());
      setGamePhase(GamePhase.SPINNING);
      setLastWheelAction(`Nova rodada: ${puzzle.category}`);
      setCurrentWheelValue(null);
    }
  };

  const handleNextTurn = () => {
    setActivePlayerIdx((prev) => (prev + 1) % players.length);
    setGamePhase(GamePhase.SPINNING);
    setCurrentWheelValue(null);
    setLastWheelAction('Próximo jogador!');
  };

  const handleScoreUpdate = (playerId: number, delta: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, score: Math.max(0, p.score + delta) } : p
    ));
  };

  const handleSpinStart = () => {
    if (gamePhase !== GamePhase.SPINNING || isWheelSpinning) return;
    setIsWheelSpinning(true);
    setLastWheelAction('Rodando...');
  };

  const handleSpinEnd = (sector: WheelSector) => {
    setIsWheelSpinning(false);

    if (sector.type === WheelSectorType.BANKRUPT) {
      // 1. Reset Score
      setPlayers(prev => prev.map(p => 
        p.id === activePlayer.id ? { ...p, score: 0 } : p
      ));
      
      // 2. Show Notification
      setNotification({
        isOpen: true,
        type: 'BANKRUPT',
        message: `Que pena, ${activePlayer.name}! Você perdeu seus pontos.`
      });

      // 3. Wait 5s
      setTimeout(() => {
        setNotification(prev => ({ ...prev, isOpen: false }));
        handleNextTurn();
      }, 5000);

    } else if (sector.type === WheelSectorType.PASS) {
      // 1. Show Notification
      setNotification({
        isOpen: true,
        type: 'PASS',
        message: `A vez passou para o próximo jogador.`
      });

      // 2. Wait 5s
      setTimeout(() => {
         setNotification(prev => ({ ...prev, isOpen: false }));
         handleNextTurn();
      }, 5000);

    } else {
      // Points logic (Normal)
      setCurrentWheelValue(sector.value);
      setLastWheelAction(`Valendo ${sector.value}! Escolha uma letra.`);
      setGamePhase(GamePhase.GUESSING);
    }
  };

  const handleGuess = (letter: string) => {
    if (!currentPuzzle) return;
    
    // Add to guessed
    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    // Count occurrences
    const phrase = currentPuzzle.phrase.toUpperCase();
    const count = phrase.split('').filter(char => char === letter).length;

    if (count > 0) {
      // Correct
      const points = (currentWheelValue || 0) * count;
      handleScoreUpdate(activePlayer.id, points);
      setLastWheelAction(`Acertou! Letra ${letter} apareceu ${count}x (+${points}). Gire novamente ou chute.`);
      
      // Check Win
      const distinctLetters = new Set(phrase.replace(/[^A-Z]/g, '').split(''));
      const allGuessed = Array.from(distinctLetters).every(l => newGuessed.has(l));
      
      if (allGuessed) {
        setGamePhase(GamePhase.SOLVED);
        setLastWheelAction(`PARABÉNS! ${activePlayer.name} resolveu a palavra!`);
      } else {
        setGamePhase(GamePhase.SPINNING); // Keep turn
      }

    } else {
      // Incorrect Letter
      setLastWheelAction(`Letra ${letter} não existe.`);
      
      setNotification({
        isOpen: true,
        type: 'WRONG_GUESS',
        message: `A letra ${letter} não existe na palavra.`
      });

      setTimeout(() => {
        setNotification(prev => ({ ...prev, isOpen: false }));
        handleNextTurn();
      }, 5000);
    }
  };

  // Logic for solving the entire word
  const handleSolveAttempt = (guess: string) => {
    setIsGuessModalOpen(false);
    if (!currentPuzzle) return;

    const normalizedGuess = guess.toUpperCase().trim();
    const normalizedPhrase = currentPuzzle.phrase.toUpperCase().trim();

    if (normalizedGuess === normalizedPhrase) {
        // Correct Guess
        // 1. Reveal all letters
        const allLetters = new Set(normalizedPhrase.split('').filter(c => /[A-Z]/.test(c)));
        setGuessedLetters(allLetters);
        
        // 2. Set State
        setGamePhase(GamePhase.SOLVED);
        setLastWheelAction(`INCRÍVEL! ${activePlayer.name} acertou a palavra inteira!`);
    } else {
        // Incorrect Word Guess
        setLastWheelAction(`"${guess}" está errado!`);
        
        setNotification({
            isOpen: true,
            type: 'WRONG_GUESS',
            message: `"${guess}" não é a resposta correta.`
        });

        setTimeout(() => {
            setNotification(prev => ({ ...prev, isOpen: false }));
            handleNextTurn();
        }, 5000);
    }
  };

  const handleAdminAddPuzzle = (p: Puzzle) => {
    setPuzzleQueue([...puzzleQueue, p]);
  };

  const handleAdminDeletePuzzle = (id: string) => {
    setPuzzleQueue(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-coke-red text-white font-sans overflow-x-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
            <div className="bg-white text-coke-red w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white">
                R
            </div>
            <h1 className="text-2xl font-black tracking-tighter italic hidden md:block">RODA COCA-COLA</h1>
        </div>
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
        >
          <Settings size={24} />
        </button>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 flex flex-col gap-8">
        
        {/* Top Section: Puzzle & Wheel */}
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          
          {/* Wheel Section (Left on Desktop) */}
          <div className="flex flex-col items-center gap-4">
             <WheelComponent 
                onSpinEnd={handleSpinEnd} 
                isSpinning={isWheelSpinning}
                disabled={gamePhase !== GamePhase.SPINNING} 
             />
             
             <div className="flex flex-col gap-3 w-full max-w-xs">
                {/* Spin Button */}
                <button
                    onClick={handleSpinStart}
                    disabled={gamePhase !== GamePhase.SPINNING || isWheelSpinning}
                    className={`
                        w-full py-3 rounded-full font-black text-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 border-4
                        ${gamePhase === GamePhase.SPINNING && !isWheelSpinning
                            ? 'bg-yellow-400 text-coke-red border-white hover:bg-yellow-300 cursor-pointer'
                            : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed opacity-50'
                        }
                    `}
                >
                    {isWheelSpinning ? 'RODANDO...' : 'GIRAR RODA'}
                </button>
                
                {/* Guess Button - Available during Spinning or Guessing phase if not solved */}
                <button
                    onClick={() => setIsGuessModalOpen(true)}
                    disabled={gamePhase === GamePhase.SOLVED || isWheelSpinning}
                    className={`
                        w-full py-2 rounded-full font-bold text-sm shadow-md transition-all border-2
                        ${gamePhase !== GamePhase.SOLVED && !isWheelSpinning
                             ? 'bg-white text-coke-red border-white hover:bg-gray-100'
                             : 'bg-black/20 text-white/40 border-transparent cursor-not-allowed'
                        }
                    `}
                >
                    CHUTAR TUDO
                </button>
             </div>

             {/* Action Status */}
             <div className="bg-white/90 text-coke-red px-6 py-2 rounded-xl text-center font-bold shadow-md max-w-xs w-full min-h-[3rem] flex items-center justify-center">
                {lastWheelAction}
             </div>
          </div>

          {/* Puzzle & Score Section (Right on Desktop) */}
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Puzzle Board */}
            <PuzzleBoard puzzle={currentPuzzle} guessedLetters={guessedLetters} />

            {/* Players */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {players.map((player, idx) => (
                    <PlayerCard 
                        key={player.id} 
                        player={player} 
                        isActive={idx === activePlayerIdx && gamePhase !== GamePhase.SOLVED}
                        onUpdateScore={handleScoreUpdate}
                    />
                ))}
            </div>

            {/* Controls / Keyboard */}
            <div className="mt-4 bg-black/10 rounded-3xl p-4 md:p-6 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4 px-2">
                    <h3 className="font-bold text-white/80">TECLADO</h3>
                    {gamePhase === GamePhase.GUESSING && (
                        <span className="bg-yellow-400 text-coke-red text-xs font-bold px-2 py-1 rounded">ESCOLHA UMA LETRA</span>
                    )}
                </div>
                <Keyboard 
                    guessedLetters={guessedLetters} 
                    onGuess={handleGuess} 
                    disabled={gamePhase !== GamePhase.GUESSING}
                />
            </div>
            
            {gamePhase === GamePhase.SOLVED && (
                <div className="text-center animate-bounce">
                    <button 
                        onClick={() => {
                            // Find next puzzle index
                            const currIdx = puzzleQueue.findIndex(p => p.id === currentPuzzle?.id);
                            if (currIdx >= 0 && currIdx < puzzleQueue.length - 1) {
                                loadPuzzle(puzzleQueue[currIdx+1].id);
                            } else {
                                alert("Fim da fila! Adicione mais no Admin.");
                            }
                        }}
                        className="bg-white text-coke-red font-black text-2xl px-8 py-4 rounded-full shadow-2xl hover:bg-gray-100 transition-transform"
                    >
                        PRÓXIMA PALAVRA
                    </button>
                </div>
            )}

          </div>
        </div>
      </main>

      {/* Admin Overlay */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)}
        upcomingPuzzles={puzzleQueue}
        onAddPuzzle={handleAdminAddPuzzle}
        onLoadPuzzle={loadPuzzle}
        onDeletePuzzle={handleAdminDeletePuzzle}
      />

      {/* Guess Word Overlay */}
      <GuessWordModal 
        isOpen={isGuessModalOpen}
        onClose={() => setIsGuessModalOpen(false)}
        onConfirm={handleSolveAttempt}
        category={currentPuzzle?.category || ''}
      />

      {/* Turn Notification (Bankrupt/Pass) */}
      <TurnNotification 
        isOpen={notification.isOpen}
        type={notification.type}
        message={notification.message}
      />
    </div>
  );
}