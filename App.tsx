import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { INITIAL_PUZZLES } from './constants';
import { GamePhase, Player, Puzzle, WheelSector, WheelSectorType } from './types';
import { soundManager } from './utils/SoundManager';

// Components
import { PlayerCard } from './components/PlayerCard';
import { PuzzleBoard } from './components/PuzzleBoard';
import { WheelComponent } from './components/WheelComponent';
import { Keyboard } from './components/Keyboard';
import { AdminPanel } from './components/AdminPanel';
import { GuessWordModal } from './components/GuessWordModal';
import { TurnNotification, NotificationType } from './components/TurnNotification';

const INITIAL_PLAYERS: Player[] = [
  { id: 1, name: 'Jog. 1', score: 0 },
  { id: 2, name: 'Jog. 2', score: 0 },
  { id: 3, name: 'Jog. 3', score: 0 },
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
      // Audio
      soundManager.play('BANKRUPT');

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
      // Audio
      soundManager.play('BANKRUPT'); // Reusing fail sound or could be separate

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
      soundManager.play('CORRECT');

      const points = (currentWheelValue || 0) * count;
      handleScoreUpdate(activePlayer.id, points);
      setLastWheelAction(`Acertou! Letra ${letter} apareceu ${count}x (+${points}). Gire novamente ou chute.`);
      
      // Check Win
      const distinctLetters = new Set(phrase.replace(/[^A-Z]/g, '').split(''));
      const allGuessed = Array.from(distinctLetters).every(l => newGuessed.has(l));
      
      if (allGuessed) {
        soundManager.play('WIN');
        setGamePhase(GamePhase.SOLVED);
        setLastWheelAction(`PARABÉNS! ${activePlayer.name} resolveu a palavra!`);
      } else {
        setGamePhase(GamePhase.SPINNING); // Keep turn
      }

    } else {
      // Incorrect Letter
      soundManager.play('WRONG');
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
        soundManager.play('WIN');
        
        // 1. Reveal all letters
        const allLetters = new Set(normalizedPhrase.split('').filter(c => /[A-Z]/.test(c)));
        setGuessedLetters(allLetters);
        
        // 2. Set State
        setGamePhase(GamePhase.SOLVED);
        setLastWheelAction(`INCRÍVEL! ${activePlayer.name} acertou a palavra inteira!`);
    } else {
        // Incorrect Word Guess
        soundManager.play('WRONG');
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
    soundManager.play('CLICK');
    setPuzzleQueue([...puzzleQueue, p]);
  };

  const handleAdminDeletePuzzle = (id: string) => {
    soundManager.play('CLICK');
    setPuzzleQueue(prev => prev.filter(p => p.id !== id));
  };
  
  const handleAdminClearQueue = () => {
    soundManager.play('CLICK');
    setPuzzleQueue([]);
  };

  const handleStartGameQueue = () => {
    soundManager.play('CLICK');
    if (puzzleQueue.length > 0) {
        loadPuzzle(puzzleQueue[0].id);
        setIsAdminOpen(false);
    }
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden flex flex-col relative pb-10">
      {/* Background Bubbles */}
      <div className="bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      {/* Header */}
      <header className="relative z-40 bg-coke-darkRed/80 backdrop-blur-md shadow-2xl pt-2 pb-4 md:pt-4 md:pb-6">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-gray-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-dashed border-coke-red bg-coke-red flex items-center justify-center">
                         <span className="text-white font-serif italic font-bold text-[8px] md:text-xs">Coke</span>
                    </div>
                </div>
                <div className="flex flex-col leading-tight">
                    <h1 className="text-xl md:text-4xl font-black italic tracking-tighter text-white drop-shadow-md">
                        RODA COCA-COLA
                    </h1>
                    <span className="hidden md:block text-white/80 text-sm font-bold tracking-widest uppercase">Sabor Real. Magia Real.</span>
                </div>
            </div>
            <button 
            onClick={() => {
                soundManager.play('CLICK');
                setIsAdminOpen(true);
            }}
            className="p-2 md:p-3 bg-black/20 hover:bg-black/40 rounded-full transition-all text-white border border-white/20 shadow-inner"
            >
            <Settings size={20} className="md:w-6 md:h-6" />
            </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-2 md:p-6 flex flex-col gap-6 relative z-10">
        
        {/* Horizontal Layout Container for Large Screens */}
        <div className="flex flex-col xl:flex-row gap-6 items-center xl:items-start">
          
          {/* LEFT: Wheel Section (Fixed Width on Desktop) */}
          <div className="flex flex-col items-center gap-4 xl:sticky xl:top-6 shrink-0">
             
             {/* Wheel Container */}
             <div className="relative">
                 <WheelComponent 
                    onSpinEnd={handleSpinEnd} 
                    isSpinning={isWheelSpinning}
                    disabled={gamePhase !== GamePhase.SPINNING} 
                 />
             </div>
             
             {/* Controls Container - Responsive Width */}
             <div className="flex flex-row xl:flex-col gap-2 w-full max-w-[320px] md:max-w-md xl:max-w-xs relative z-20">
                {/* Spin Button */}
                <button
                    onClick={handleSpinStart}
                    disabled={gamePhase !== GamePhase.SPINNING || isWheelSpinning}
                    className={`
                        flex-1 py-3 md:py-4 rounded-xl font-black text-lg md:text-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 border-2 md:border-4
                        ${gamePhase === GamePhase.SPINNING && !isWheelSpinning
                            ? 'bg-yellow-400 text-coke-red border-white hover:bg-yellow-300 cursor-pointer ring-2 ring-yellow-500/30'
                            : 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed opacity-50 grayscale'
                        }
                    `}
                >
                    {isWheelSpinning ? '...' : 'GIRAR'}
                </button>
                
                {/* Guess Button */}
                <button
                    onClick={() => {
                        soundManager.play('CLICK');
                        setIsGuessModalOpen(true);
                    }}
                    disabled={gamePhase === GamePhase.SOLVED || isWheelSpinning}
                    className={`
                        flex-1 py-3 rounded-xl font-bold text-xs md:text-sm shadow-lg transition-all border-2 backdrop-blur-sm
                        ${gamePhase !== GamePhase.SOLVED && !isWheelSpinning
                             ? 'bg-white/90 text-coke-red border-white hover:bg-white'
                             : 'bg-black/20 text-white/40 border-white/10 cursor-not-allowed'
                        }
                    `}
                >
                    CHUTAR TUDO
                </button>
             </div>

             {/* Action Status Panel (Glass) */}
             <div className="glass-panel text-white px-4 py-3 rounded-xl text-center font-bold shadow-2xl max-w-[90vw] w-full min-h-[3.5rem] flex items-center justify-center border-t border-l border-white/40">
                <span className="text-sm md:text-xl drop-shadow-md leading-tight">{lastWheelAction}</span>
             </div>
          </div>

          {/* RIGHT: Board, Players, Keyboard (Takes remaining space) */}
          <div className="flex-1 w-full flex flex-col gap-4 md:gap-8">
            
            {/* 1. Puzzle Board */}
            <PuzzleBoard puzzle={currentPuzzle} guessedLetters={guessedLetters} />

            {/* 2. Players (Row on all screens now to save vertical space) */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {players.map((player, idx) => (
                    <PlayerCard 
                        key={player.id} 
                        player={player} 
                        isActive={idx === activePlayerIdx && gamePhase !== GamePhase.SOLVED}
                        onUpdateScore={handleScoreUpdate}
                    />
                ))}
            </div>

            {/* 3. Keyboard */}
            <div className="glass-panel rounded-3xl p-3 md:p-6 shadow-xl">
                <div className="flex justify-between items-center mb-2 md:mb-4 px-2">
                    <h3 className="font-black text-sm md:text-xl italic text-white drop-shadow-md">TECLADO</h3>
                    {gamePhase === GamePhase.GUESSING && (
                        <span className="bg-yellow-400 text-coke-red text-[10px] md:text-xs font-black px-2 py-1 rounded-full shadow-lg animate-pulse border border-white">SUA VEZ</span>
                    )}
                </div>
                <Keyboard 
                    guessedLetters={guessedLetters} 
                    onGuess={(l) => {
                        soundManager.play('CLICK');
                        handleGuess(l);
                    }} 
                    disabled={gamePhase !== GamePhase.GUESSING}
                />
            </div>
            
            {gamePhase === GamePhase.SOLVED && (
                <div className="text-center animate-bounce mt-2 md:mt-4">
                    <button 
                        onClick={() => {
                            soundManager.play('CLICK');
                            const currIdx = puzzleQueue.findIndex(p => p.id === currentPuzzle?.id);
                            if (currIdx >= 0 && currIdx < puzzleQueue.length - 1) {
                                loadPuzzle(puzzleQueue[currIdx+1].id);
                            } else {
                                alert("Fim da fila! Adicione mais no Admin.");
                            }
                        }}
                        className="bg-white text-coke-red font-black text-lg md:text-2xl px-8 py-4 rounded-full shadow-2xl hover:bg-gray-100 transition-transform hover:scale-105 border-4 border-coke-red ring-4 ring-white/50"
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
        onClearQueue={handleAdminClearQueue}
        onStartGame={handleStartGameQueue}
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