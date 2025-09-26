import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Edit, MapPin, Save, Globe, Briefcase, Flame, Gem } from 'lucide-react';
import { User, ActivityLog } from '../../App';
import Heatmap from '../profile/Heatmap';
import BarGraph from '../profile/BarGraph';
import { languages } from '../../data/languages';
import { Job } from '../../data/jobs';
import DiamondStore from '../profile/DiamondStore';

interface ProfilePageProps {
  user: User;
  activityLog: ActivityLog[];
  onBack: () => void;
  onUpdateProfile: (updatedProfile: User) => void;
  appliedJobs: Job[];
  onBuyDiamonds: (amount: number) => void;
}

const NearbyLearners: React.FC = () => {
    const [locationState, setLocationState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleFindLearners = () => {
        setLocationState('loading');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => setTimeout(() => setLocationState('success'), 1500),
                () => setLocationState('error'),
                { timeout: 5000 }
            );
        } else {
            setLocationState('error');
        }
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><MapPin size={20} className="text-blue-500"/> Nearby Learners</h3>
            {locationState === 'idle' && (
                <div className="text-center">
                    <p className="text-neutral-400 mb-4">Discover the learning community around you.</p>
                    <button onClick={handleFindLearners} className="px-5 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Find Learners</button>
                </div>
            )}
             {locationState === 'loading' && <p className="text-neutral-400 text-center">Searching for learners near you...</p>}
             {locationState === 'error' && <p className="text-red-400 text-center">Could not find nearby users. Please enable location services and try again.</p>}
             {locationState === 'success' && (
                <div>
                     <p className="text-neutral-300 mb-4">Here's the average activity heatmap for learners in your area:</p>
                     <div className="bg-neutral-800 p-4 rounded-lg text-sm text-neutral-400 text-center">
                        Mock Average Heatmap Displayed Here
                    </div>
                </div>
            )}
        </div>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ user, activityLog, onBack, onUpdateProfile, appliedJobs, onBuyDiamonds }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [language, setLanguage] = useState(user.language);

  const handleSave = async () => {
    onUpdateProfile({ ...user, bio, language });
    try {
      const { default: i18n } = await import('../../i18n');
      const map: Record<string, 'en' | 'hi' | 'ta' | 'ml'> = {
        English: 'en', Hindi: 'hi', Tamil: 'ta', Malayalam: 'ml'
      } as const;
      await i18n.changeLanguage(map[language] ?? 'en');
    } catch {}
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 space-y-8"
            >
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl text-center">
                    <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.name}`} alt="avatar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"/>
                    <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                    <p className="text-neutral-400 text-sm">Joined on {user.accountCreated.toLocaleDateString()}</p>
                    
                    <div className="mt-6 flex justify-center gap-6">
                        <div className="text-center">
                             <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-400">
                                <Flame size={20}/> {user.currentStreak}
                             </div>
                             <p className="text-xs text-neutral-400">Current Streak</p>
                        </div>
                         <div className="text-center">
                             <div className="flex items-center justify-center gap-1 text-2xl font-bold text-cyan-400">
                                <Gem size={18}/> {user.diamonds}
                             </div>
                             <p className="text-xs text-neutral-400">Diamonds</p>
                        </div>
                    </div>
                    
                    {isEditing ? (
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mt-6 bg-neutral-800 border border-neutral-600 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
                    ) : (
                        <p className="text-neutral-300 mt-6 text-sm">{bio}</p>
                    )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Globe size={20} className="text-blue-500"/> Language</h3>
                    {isEditing ? (
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-neutral-800 border border-neutral-600 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                           {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>
                    ) : (
                        <p className="text-neutral-300">{language}</p>
                    )}
                    <div className="mt-6 text-center">
                        {isEditing ? (
                             <button onClick={handleSave} className="px-5 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto">
                                <Save size={16}/> Save Changes
                             </button>
                        ) : (
                             <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-neutral-700 rounded-lg font-semibold hover:bg-neutral-600 transition-colors flex items-center gap-2 mx-auto">
                                <Edit size={16}/> Edit Profile
                             </button>
                        )}
                    </div>
                </div>

                 <NearbyLearners />
            </motion.div>

            <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 }}
                 className="lg:col-span-2 space-y-8"
            >
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Learning Activity</h3>
                        <p className="text-sm text-neutral-400">Highest Streak: <span className="font-bold text-orange-400">{user.highestStreak} days</span></p>
                     </div>
                     <Heatmap startDate={user.accountCreated} activityLog={activityLog} />
                </div>
                 <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                     <h3 className="text-xl font-bold text-white mb-4">Time Spent (Last 7 Days)</h3>
                     <BarGraph activityLog={activityLog} />
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Briefcase size={20} className="text-blue-500"/> My Applications</h3>
                    {appliedJobs.length > 0 ? (
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {appliedJobs.map(job => (
                                <div key={job.id} className="bg-neutral-800 p-3 rounded-lg">
                                    <p className="font-semibold text-white">{job.title}</p>
                                    <p className="text-sm text-neutral-400">{job.company}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-400 text-sm">You haven't applied for any jobs yet through Kalari.</p>
                    )}
                </div>
                 <DiamondStore onBuyDiamonds={onBuyDiamonds} user={user} />
            </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
