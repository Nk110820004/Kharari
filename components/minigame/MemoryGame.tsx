import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Timer, Puzzle } from 'lucide-react';
import MemoryGameCard from './MemoryGameCard';
import { cn } from '../../lib/utils';

interface MemoryGameProps {
  onGameEnd: (won: boolean) => void;
}

const icons = ['⚛️', '🧬', '🔬', '💻', '🚀', '💡', '📚', '📈', '🧠', '⚙️', '🌍', '⚡️', '🔗', '🎯', '🔑', '📈', '📊', '🛰️', '🧭', '🔭', '🧪', '⚗️', '🧮', '✒️', '📏', '📐', '📎', '📌', '📍', '📖'];

const generateCards = () => {
  const cardIcons = [...icons, ...icons]; // 30 pairs = 60 cards
  return cardIcons.sort(() => Math.random() - 0.5).map((icon, index) => ({
    id: index,
    icon,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryGame: React.FC<MemoryGameProps> = ({ onGameEnd }) => {
  const [cards, setCards] = useState(generateCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('lost');
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        // Match
        const newCards = cards.map(card => 
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, isMatched: true }
            : card
        );
        setCards(newCards);
        setFlippedCards([]);

        if (newCards.every(card => card.isMatched)) {
            setGameState('won');
        }

      } else {
        // No match
        setTimeout(() => {
          const newCards = cards.map(card => 
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length >= 2 || cards[id].isFlipped) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    const newCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
        onClick={() => onGameEnd(false)}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-4xl relative flex flex-col max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex items-center justify-between mb-4 flex-shrink-0">
             <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Puzzle size={24}/> Memory Challenge</h2>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xl font-mono font-semibold text-red-400">
                    <Timer size={20}/>
                    <span>{formatTime(timeLeft)}</span>
                </div>
                <button onClick={() => onGameEnd(false)} className="text-neutral-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
             </div>
          </header>
          
          <main className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-10 gap-2">
                {cards.map(card => (
                    <MemoryGameCard 
                        key={card.id}
                        card={card}
                        onClick={handleCardClick}
                    />
                ))}
            </div>
          </main>
           <AnimatePresence>
            {gameState !== 'playing' && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col z-20"
                >
                    <motion.div initial={{ scale: 0.5, opacity: 0}} animate={{ scale: 1, opacity: 1}}>
                        {gameState === 'won' ? (
                            <Trophy size={80} className="text-yellow-400"/>
                        ) : (
                            <X size={80} className="text-red-400"/>
                        )}
                        <h3 className="text-4xl font-bold mt-4">{gameState === 'won' ? 'You Won!' : 'Time\'s Up!'}</h3>
                        <p className="text-neutral-300 mt-2">{gameState === 'won' ? 'You have unlocked the next step.' : 'Better luck next time.'}</p>
                        <button 
                            onClick={() => onGameEnd(gameState === 'won')}
                            className={cn("mt-6 px-8 py-3 rounded-lg font-semibold transition-colors text-lg",
                                gameState === 'won' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'
                            )}
                        >
                            Continue
                        </button>
                    </motion.div>
                </motion.div>
            )}
           </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemoryGame;