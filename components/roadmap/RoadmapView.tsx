
// This component is no longer used and is replaced by RoadmapPage.tsx
// Kept for reference or future use if needed.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Code } from 'lucide-react';

interface RoadmapData {
  tiles: {
    title: string;
    description: string;
    concepts: string[];
  }[];
}

interface RoadmapViewProps {
  onClose: () => void;
  roadmapData: RoadmapData | null;
  isLoading: boolean;
  error: string;
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-neutral-300">Generating your personalized learning path...</p>
    <p className="text-sm text-neutral-500">This might take a moment.</p>
  </div>
);

const RoadmapView: React.FC<RoadmapViewProps> = ({ onClose, roadmapData, isLoading, error }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 w-full max-w-3xl m-4 relative max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors z-20">
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Learning Roadmap</h2>
          
          <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            {isLoading && <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}
            {error && <div className="h-full flex items-center justify-center text-red-400">{error}</div>}
            {roadmapData && (
              <div className="space-y-6">
                {roadmapData.tiles.map((tile, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-neutral-800/50 border border-neutral-700 p-6 rounded-lg"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-full">
                        <Book size={20} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{index + 1}. {tile.title}</h3>
                    </div>
                    <p className="text-neutral-300 mb-4 ml-12">{tile.description}</p>
                    <div className="ml-12">
                        <h4 className="font-semibold text-neutral-200 mb-2">Key Concepts:</h4>
                        <ul className="space-y-2">
                            {tile.concepts.map((concept, cIndex) => (
                                <li key={cIndex} className="flex items-center gap-2 text-sm text-neutral-400">
                                    <Code size={14} className="text-blue-500" />
                                    <span>{concept}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoadmapView;
