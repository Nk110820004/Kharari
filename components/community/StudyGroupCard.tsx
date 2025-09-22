import React from 'react';
import { motion } from 'framer-motion';
import { Users, Book } from 'lucide-react';
import { StudyGroup } from '../../data/groups';
import { cn } from '../../lib/utils';

interface StudyGroupCardProps {
  group: StudyGroup;
  isJoined: boolean;
  onJoin: (groupId: string) => void;
}

const StudyGroupCard: React.FC<StudyGroupCardProps> = ({ group, isJoined, onJoin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <Book size={16} className="text-blue-400"/>
        <p className="text-sm font-semibold text-blue-400">{group.topic}</p>
      </div>
      <h4 className="text-xl font-bold text-white flex-grow">{group.name}</h4>
      <p className="text-neutral-400 text-sm mt-2 mb-4 flex-grow">{group.description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Users size={16} />
            <span>{group.members} Members</span>
        </div>
        <button 
            onClick={() => onJoin(group.id)}
            disabled={isJoined}
            className={cn(
                "px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                isJoined ? "bg-neutral-700 text-neutral-400 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"
            )}
        >
            {isJoined ? 'Joined' : 'Join'}
        </button>
      </div>
    </motion.div>
  );
};

export default StudyGroupCard;