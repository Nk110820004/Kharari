import React from 'react';
import { ActivityLog } from '../../App';
import { cn } from '../../lib/utils';

interface HeatmapProps {
  startDate: Date;
  activityLog: ActivityLog[];
}

const Heatmap: React.FC<HeatmapProps> = ({ startDate, activityLog }) => {
  const activityMap = new Map<string, number>();
  activityLog.forEach(log => {
    if(log.completed) {
      const count = activityMap.get(log.date) || 0;
      activityMap.set(log.date, count + 1);
    }
  });

  const getDaysArray = (start: Date, end: Date) => {
    const arr = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };
  
  const today = new Date();
  const days = getDaysArray(startDate, today);
  const firstDay = startDate.getDay();

  const getColor = (count: number) => {
    if (count === 0) return 'bg-neutral-800';
    if (count === 1) return 'bg-blue-800';
    if (count <= 3) return 'bg-blue-600';
    return 'bg-blue-400';
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex gap-3 text-xs text-neutral-400">
        <div className="flex flex-col justify-between pt-5">
            {dayLabels.map((day, i) => i % 2 !== 0 ? <div key={day}>{day}</div> : <div key={day}></div> )}
        </div>
        <div className="overflow-x-auto">
            <div className="grid grid-flow-col grid-rows-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="w-4 h-4" />)}
                {days.map((day, index) => {
                    const dateString = day.toISOString().split('T')[0];
                    const count = activityMap.get(dateString) || 0;
                    return (
                        <div
                            key={index}
                            className={cn('w-4 h-4 rounded-sm', getColor(count))}
                            title={`${dateString}: ${count} section${count === 1 ? '' : 's'} completed`}
                        />
                    );
                })}
            </div>
             <div className="flex gap-1 mt-1">
                {monthLabels.map(month => (
                    <div key={month} className="w-16 text-center">{month}</div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Heatmap;
