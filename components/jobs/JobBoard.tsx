import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Job } from '../../data/jobs';
import { Search, Briefcase, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface JobBoardProps {
  availableJobs: Job[];
  appliedJobs: Job[];
  onViewJob: (job: Job) => void;
}

const JobCard: React.FC<{ job: Job; onClick: () => void; isApplied?: boolean }> = ({ job, onClick, isApplied = false }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={cn(
        "bg-neutral-800/50 border border-neutral-800 p-4 rounded-lg",
        !isApplied && "hover:border-blue-500 hover:bg-neutral-800 cursor-pointer transition-colors"
    )}
    onClick={!isApplied ? onClick : undefined}
  >
    <div className="flex items-center gap-4">
        <img src={job.companyLogo} alt={`${job.company} logo`} className="w-12 h-12 rounded-md bg-white p-1" />
        <div>
            <h4 className="font-semibold text-white">{job.title}</h4>
            <p className="text-sm text-neutral-400">{job.company} &bull; {job.location}</p>
        </div>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">{skill}</span>
        ))}
    </div>
    {isApplied && (
        <div className="mt-3 text-sm text-green-400 flex items-center gap-2">
            <CheckCircle size={16} /> Applied
        </div>
    )}
  </motion.div>
);

const JobBoard: React.FC<JobBoardProps> = ({ availableJobs, appliedJobs, onViewJob }) => {
  const [filter, setFilter] = useState('');

  const filteredJobs = availableJobs.filter(job => 
    job.title.toLowerCase().includes(filter.toLowerCase()) ||
    job.company.toLowerCase().includes(filter.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
    >
      {/* Available Jobs */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Briefcase /> Available Jobs</h2>
            <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"/>
                <input 
                    type="text"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    placeholder="Filter by title, company, skill..."
                    className="w-full sm:w-72 bg-neutral-800 border border-neutral-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => onViewJob(job)} />
          ))}
        </div>
        {filteredJobs.length === 0 && <p className="text-neutral-400 text-center py-8">No matching jobs found.</p>}
      </div>

      {/* Applied Jobs */}
      {appliedJobs.length > 0 && (
         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><CheckCircle className="text-green-500" /> Applied Jobs</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appliedJobs.map(job => (
                <JobCard key={job.id} job={job} onClick={() => {}} isApplied={true} />
              ))}
            </div>
        </div>
      )}
    </motion.div>
  );
};

export default JobBoard;