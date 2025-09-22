import React from 'react';
import { ActivityLog } from '../../App';
import { cn } from '../../lib/utils';

interface BarGraphProps {
  activityLog: ActivityLog[];
}

const BarGraph: React.FC<BarGraphProps> = ({ activityLog }) => {
  const last7DaysData: { label: string; time: number }[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

    const logEntry = activityLog.find(log => log.date === dateString);
    last7DaysData.push({
      label: dayLabel,
      time: logEntry ? logEntry.timeSpent : 0,
    });
  }

  const maxTime = Math.max(...last7DaysData.map(d => d.time), 600); // at least 10 minutes max height

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <div className="h-64 flex items-end justify-between gap-2 p-4 bg-neutral-800/50 rounded-lg">
      {last7DaysData.map((data, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="relative w-full h-full flex items-end">
             <div 
               className="w-full bg-blue-600 rounded-t-md transition-all duration-300 group-hover:bg-blue-500"
               style={{ height: `${(data.time / maxTime) * 100}%` }}
             >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-neutral-900 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTime(data.time)}
                </span>
             </div>
          </div>
          <span className="text-xs text-neutral-400">{data.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarGraph;
