import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin } from 'lucide-react';
import { Job } from '../../data/jobs';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onApply: (jobId: string) => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onApply }) => {
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
          className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-2xl m-4 relative flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="p-6 border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                 <img src={job.companyLogo} alt={`${job.company} logo`} className="w-16 h-16 rounded-md bg-white p-1" />
                 <div>
                    <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                    <p className="text-neutral-300">{job.company}</p>
                    <p className="text-sm text-neutral-400 mt-1 flex items-center gap-2"><MapPin size={14}/> {job.location}</p>
                 </div>
              </div>
              <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
             <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">{skill}</span>
                ))}
            </div>
          </header>

          <main className="p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="font-semibold text-lg text-white mb-2">Job Description</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">{job.description}</p>
            </div>
             <div>
                <h3 className="font-semibold text-lg text-white mb-2">Responsibilities</h3>
                <ul className="text-neutral-300 text-sm leading-relaxed space-y-2 list-disc pl-5">
                    {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg text-white mb-2">Qualifications</h3>
                <ul className="text-neutral-300 text-sm leading-relaxed space-y-2 list-disc pl-5">
                    {job.qualifications.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
          </main>

          <footer className="p-6 border-t border-neutral-800 flex-shrink-0">
             <button 
                onClick={() => onApply(job.id)}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors text-lg"
             >
                <Briefcase size={20} /> Apply Now
             </button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobDetailModal;