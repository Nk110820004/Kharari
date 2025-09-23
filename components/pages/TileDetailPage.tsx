import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoadmapTile } from '../../lib/gemini';
import { ArrowLeft, Book, Code, Youtube, FileQuestion } from 'lucide-react';
import { fetchYouTubeVideos, type YouTubeVideo } from '../../lib/youtube';

interface TileDetailPageProps {
  tile: RoadmapTile;
  tileNumber: number;
  onTakeQuiz: () => void;
  onBackToRoadmap: () => void;
  onLogTime: (timeSpent: number, tileCompleted: boolean) => void;
}

const TileDetailPage: React.FC<TileDetailPageProps> = ({ tile, tileNumber, onTakeQuiz, onBackToRoadmap, onLogTime }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000); // time in seconds
      onLogTime(timeSpent, false); // Log time, but tile is not completed yet
    };
  }, [onLogTime]);

  useEffect(() => {
    const getVideos = async () => {
      setIsLoadingVideos(true);
      const { default: i18n } = await import('../../i18n');
      const lang = i18n.language || 'en';
      const fetchedVideos = await fetchYouTubeVideos(tile.youtubeSearchQuery, lang);
      setVideos(fetchedVideos);
      setIsLoadingVideos(false);
    };
    getVideos();
  }, [tile.youtubeSearchQuery]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={onBackToRoadmap} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Roadmap</span>
          </button>
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-bold text-white hidden sm:block">{tile.title}</h1>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-blue-400 font-semibold">Step {tileNumber}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2">{tile.title}</h1>
          <p className="text-lg text-neutral-400 mt-4 max-w-3xl">{tile.description}</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Concepts */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Code size={24} className="text-blue-500"/> Key Concepts</h2>
            <div className="space-y-4">
              {tile.concepts.map((concept, index) => (
                <div key={index} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                  <p className="text-neutral-200">{concept}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={onTakeQuiz}
              className="w-full mt-8 bg-blue-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors text-lg"
            >
              <FileQuestion size={20} />
              <span>Take Quiz to Proceed</span>
            </button>
          </motion.div>

          {/* Right Column: Videos */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Youtube size={24} className="text-red-500"/> Recommended Videos</h2>
            <div className="space-y-6">
              {isLoadingVideos ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-40 h-24 bg-neutral-800 rounded-lg flex-shrink-0"></div>
                        <div className="flex-grow space-y-3 pt-2">
                            <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                            <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
                            <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                        </div>
                    </div>
                ))
              ) : (
                videos.map((video) => (
                  <a key={video.id} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="flex gap-4 bg-neutral-900 border border-transparent hover:border-blue-500 p-3 rounded-lg transition-colors group">
                    <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className="w-40 h-24 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-grow">
                      <h3 className="text-md font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors">{video.title}</h3>
                      <p className="text-sm text-neutral-400 mt-1">{video.channel}</p>
                      <p className="text-xs text-neutral-500 mt-2">{video.views} &bull; {video.duration}</p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TileDetailPage;
