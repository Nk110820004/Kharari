import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, PlusCircle, Flame } from 'lucide-react';
import { StudyGroup } from '../../data/groups';
import StudyGroupCard from '../community/StudyGroupCard';
import CreateGroupModal from '../community/CreateGroupModal';
import { User as UserType } from '../../App';

interface CommunityPageProps {
  onBack: () => void;
  allGroups: StudyGroup[];
  joinedGroupIds: Set<string>;
  onJoinGroup: (groupId: string) => void;
  onCreateGroup: (groupData: Omit<StudyGroup, 'id' | 'members'>) => void;
  user: UserType | null;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onBack, allGroups, joinedGroupIds, onJoinGroup, onCreateGroup, user }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const myGroups = allGroups.filter(group => joinedGroupIds.has(group.id));
  const findGroups = allGroups.filter(group => !joinedGroupIds.has(group.id));

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Community Hub</h1>
          </div>
          <div className="flex items-center gap-4">
             {user && (
                 <div className="flex items-center gap-2 text-orange-400 font-bold bg-neutral-800/50 px-3 py-1.5 rounded-full">
                    <Flame size={16} />
                    <span className="text-sm">{user.currentStreak}</span>
                 </div>
              )}
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
              <ArrowLeft size={16} />
              <span>Back to Learning</span>
            </button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
                 <h2 className="text-4xl font-extrabold text-white">Find Your Community</h2>
                 <p className="text-neutral-400 mt-2">Connect, collaborate, and learn with others.</p>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                <PlusCircle size={18} />
                <span>Create a Study Group</span>
            </button>
        </motion.div>
        
        <div className="space-y-12">
            {/* My Study Groups */}
            <section>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Users className="text-blue-400" /> My Study Groups</h3>
                {myGroups.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myGroups.map(group => (
                             <StudyGroupCard key={group.id} group={group} isJoined={true} onJoin={() => {}} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-neutral-900 border border-neutral-800 rounded-xl">
                        <p className="text-neutral-400">You haven't joined any study groups yet.</p>
                    </div>
                )}
            </section>
            
             {/* Find Study Groups */}
            <section>
                <h3 className="text-2xl font-bold text-white mb-6">Find Study Groups</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {findGroups.map(group => (
                         <StudyGroupCard key={group.id} group={group} isJoined={false} onJoin={onJoinGroup} />
                    ))}
                </div>
            </section>
        </div>
      </main>
      
      {showCreateModal && (
        <CreateGroupModal 
            onClose={() => setShowCreateModal(false)}
            onCreate={onCreateGroup}
        />
      )}
    </div>
  );
};

export default CommunityPage;