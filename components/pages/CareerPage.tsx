import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Briefcase, Users, Flame } from 'lucide-react';
import { Job } from '../../data/jobs';
import ResumeBuilder from '../resume/ResumeBuilder';
import JobBoard from '../jobs/JobBoard';
import JobDetailModal from '../jobs/JobDetailModal';
import { cn } from '../../lib/utils';
import { User as UserType } from '../../App';

interface CareerPageProps {
  onBack: () => void;
  onCommunityClick: () => void;
  availableJobs: Job[];
  appliedJobs: Job[];
  onApplyJob: (jobId: string) => void;
  user: UserType | null;
}

type CareerTab = 'resume' | 'jobs';

const CareerPage: React.FC<CareerPageProps> = ({ onBack, onCommunityClick, availableJobs, appliedJobs, onApplyJob, user }) => {
  const [activeTab, setActiveTab] = useState<CareerTab>('resume');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApply = (jobId: string) => {
    onApplyJob(jobId);
    setSelectedJob(null); // Close modal on apply
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Career Hub</h1>
          </div>
           <div className="flex items-center gap-4">
              {user && (
                 <div className="flex items-center gap-2 text-orange-400 font-bold bg-neutral-800/50 px-3 py-1.5 rounded-full">
                    <Flame size={16} />
                    <span className="text-sm">{user.currentStreak}</span>
                 </div>
              )}
              <button onClick={onBack} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
                <ArrowLeft size={16} />
                <span>Learning</span>
              </button>
               <button onClick={onCommunityClick} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
                <Users size={16} />
                <span>Community</span>
              </button>
           </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-12">
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-8">
            <div className="bg-neutral-800 p-1 rounded-lg flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('resume')} 
                className={cn("w-full px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2", activeTab === 'resume' ? 'bg-blue-600 text-white' : 'text-neutral-300 hover:bg-neutral-700/50')}
              >
                <FileText size={16} /> Resume Builder
              </button>
              <button 
                onClick={() => setActiveTab('jobs')} 
                className={cn("w-full px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2", activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'text-neutral-300 hover:bg-neutral-700/50')}
              >
                <Briefcase size={16} /> Job Board
              </button>
            </div>
          </div>

          {activeTab === 'resume' && <ResumeBuilder />}
          {activeTab === 'jobs' && (
            <JobBoard
              availableJobs={availableJobs}
              appliedJobs={appliedJobs}
              onViewJob={handleViewJob}
            />
          )}
        </motion.div>
      </main>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}
    </div>
  );
};

export default CareerPage;