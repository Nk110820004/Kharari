import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Book, FileText } from 'lucide-react';
import { StudyGroup } from '../../data/groups';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: (groupData: Omit<StudyGroup, 'id' | 'members'>) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && topic.trim() && description.trim()) {
      onCreate({ name, topic, description });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Create a New Study Group</h2>
            <p className="text-neutral-400 mb-6">Start a community around your favorite topic.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Group Name (e.g., ML Pioneers)" className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            </div>
             <div className="relative">
              <Book size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Main Topic (e.g., Machine Learning)" className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            </div>
             <div className="relative">
              <FileText size={16} className="absolute left-4 top-3 text-neutral-400"/>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of the group..." className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} required/>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Create Group
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateGroupModal;