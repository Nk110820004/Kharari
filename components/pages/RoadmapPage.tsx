import React from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, Book, Code, Sparkles, ArrowRight, CheckCircle, Lock, User, Briefcase, Users, Dices, Flame } from 'lucide-react';
import { Roadmap } from '../../lib/gemini';
import { cn } from '../../lib/utils';
import { User as UserType } from '../../App';

interface RoadmapPageProps {
  topic: string;
  roadmapData: Roadmap | null;
  furtherTopics: string[];
  isLoading: boolean;
  error: string;
  onGoHome: () => void;
  onSelectTile: (index: number) => void;
  completedTiles: boolean[];
  onProfileClick: () => void;
  onCareerClick: () => void;
  onCommunityClick: () => void;
  onPlayMiniGame: (tileIndex: number) => void;
  miniGameAttempts: number;
  userDiamonds: number;
  user: UserType | null;
  onStartOnboarding: () => void;
  onRequireAuth: () => void;
  isLoggedIn: boolean;
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <h2 className="text-2xl font-bold text-white mt-4">Crafting Your Learning Path...</h2>
    <p className="text-neutral-300 max-w-sm">Our AI is analyzing the best way for you to learn. This might take a moment.</p>
  </div>
);

const RoadmapPage: React.FC<RoadmapPageProps> = ({
    topic, roadmapData, furtherTopics, isLoading, error, onGoHome, onSelectTile,
    completedTiles, onProfileClick, onCareerClick, onCommunityClick,
    onPlayMiniGame, miniGameAttempts, userDiamonds, user, onStartOnboarding, onRequireAuth, isLoggedIn
}) => {
  return (
    <div className="min-h-screen bg-black">
       <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={onGoHome} className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Kalari</h1>
          </button>
          <div className="flex items-center gap-4">
             {user && (
                 <div className="flex items-center gap-2 text-orange-400 font-bold bg-neutral-800/50 px-3 py-1.5 rounded-full">
                    <Flame size={16} />
                    <span className="text-sm">{user.currentStreak}</span>
                 </div>
             )}
             <button onClick={onGoHome} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
                <Home size={16} />
                <span>Home</span>
             </button>
              <button onClick={onCommunityClick} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
                <Users size={16} />
                <span>Community</span>
             </button>
             <button onClick={onCareerClick} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
                <Briefcase size={16} />
                <span>Career</span>
             </button>
             <button onClick={onProfileClick} className="w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
                <User size={20} />
             </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        {isLoading && <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>}
        
        {error && <div className="min-h-[60vh] flex flex-col items-center justify-center text-center text-red-400">
            <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
            <p>{error}</p>
            <button onClick={onGoHome} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Try again</button>
        </div>}

        {roadmapData && !isLoading && !error && (
          <>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <p className="text-blue-400 font-semibold">Your AI-Generated Roadmap</p>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 capitalize">{topic}</h1>
            </motion.div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {roadmapData.tiles.map((tile, index) => {
                const isCompleted = completedTiles[index];
                const isUnlocked = index === 0 || completedTiles[index - 1];
                const isLocked = !isUnlocked;
                const canAffordSkip = userDiamonds >= 20;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                  >
                    <div
                      className={cn(
                        "w-full bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl shadow-lg transition-all duration-300",
                        isLocked && "opacity-60",
                        isCompleted && "border-green-500/50 bg-green-900/20"
                      )}
                    >
                      <button
                        onClick={() => !isLocked && onSelectTile(index)}
                        disabled={isLocked}
                        className={cn(
                          "w-full text-left",
                          isUnlocked && !isCompleted && "group"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn("p-3 rounded-full transition-colors", 
                                isCompleted ? "bg-green-600/20 text-green-400" :
                                isUnlocked ? "bg-blue-600/20 text-blue-400 group-hover:bg-blue-500/30" : "bg-neutral-700/50 text-neutral-400"
                            )}>
                              <Book size={24} />
                            </div>
                            <div>
                                <span className="text-sm font-bold text-neutral-400">Step {index + 1}</span>
                                <h3 className={cn("text-xl font-semibold text-white transition-colors", isUnlocked && !isCompleted && "group-hover:text-blue-300")}>{tile.title}</h3>
                            </div>
                          </div>
                          {isCompleted && <CheckCircle className="text-green-400" size={24}/>}
                          {isLocked && <Lock className="text-neutral-400" size={20} />}
                          {isUnlocked && !isCompleted && <ArrowRight className="text-neutral-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" size={20}/>}
                        </div>
                      </button>

                      {isLocked && (
                          <div className="mt-4 pt-4 border-t border-neutral-800/50 text-center">
                              <button 
                                onClick={() => onPlayMiniGame(index)}
                                disabled={miniGameAttempts >= 3 && !canAffordSkip}
                                className="px-5 py-2 text-sm bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto disabled:bg-neutral-700 disabled:cursor-not-allowed"
                              >
                                  <Dices size={16}/>
                                  <span>Skip with Game</span>
                                  <span className="bg-purple-800/50 text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {miniGameAttempts < 3 ? `${3 - miniGameAttempts} free` : `💎 20`}
                                  </span>
                              </button>
                          </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {furtherTopics.length > 0 && (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: roadmapData.tiles.length * 0.15 + 0.5 }}
                    className="mt-20 text-center max-w-4xl mx-auto"
                >
                    <div className="flex items-center justify-center gap-3">
                        <Sparkles className="text-blue-400"/>
                        <h2 className="text-3xl font-bold text-white">Continue Your Journey</h2>
                    </div>
                    <p className="text-neutral-400 mt-3 mb-8">Here are some related topics you can explore next.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {furtherTopics.map((nextTopic, i) => (
                            <button key={i} className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg text-left hover:border-blue-500 hover:bg-neutral-700/50 transition-all group">
                                <h3 className="text-lg font-semibold text-white">{nextTopic}</h3>
                                <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                                    <span>Start Learning</span>
                                    <ArrowRight size={16}/>
                                </div>
                            </button>
                        ))}
                    </div>
                 </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default RoadmapPage;
