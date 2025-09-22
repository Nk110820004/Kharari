import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameCardProps {
  card: Card;
  onClick: (id: number) => void;
}

const MemoryGameCard: React.FC<MemoryGameCardProps> = ({ card, onClick }) => {
  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div 
      className="aspect-square cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full bg-blue-600 rounded-lg flex items-center justify-center"
             style={{ backfaceVisibility: 'hidden' }}
        >
        </div>

        {/* Card Front */}
        <div className={cn(
            "absolute w-full h-full rounded-lg flex items-center justify-center",
            card.isMatched ? "bg-green-600" : "bg-neutral-700"
        )}
             style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-3xl md:text-4xl">{card.icon}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default MemoryGameCard;