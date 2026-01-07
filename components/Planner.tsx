
import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Planner: React.FC = () => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const schedule = [
    { day: 'Mon', start: 9, end: 11, title: 'Deep Work: React Foundations', color: 'bg-indigo-500' },
    { day: 'Mon', start: 14, end: 15, title: 'AI Mentor Sync', color: 'bg-amber-500' },
    { day: 'Wed', start: 10, end: 12, title: 'Project: Portfolio Build', color: 'bg-emerald-500' },
    { day: 'Fri', start: 16, end: 18, title: 'Weekly Review', color: 'bg-rose-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Intelligent Planner</h2>
          <p className="text-slate-500">Lumina manages your cognitive load by scheduling deep work sessions.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
            <span className="px-4 font-bold text-slate-800">Oct 2023</span>
            <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
          </div>
          <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Plus className="w-5 h-5" /> Add Task
          </button>
        </div>
      </header>

      <div className="glass-effect rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-slate-100">
          <div className="p-4"></div>
          {days.map(day => (
            <div key={day} className="p-4 text-center font-bold text-slate-500 text-sm uppercase tracking-widest">{day}</div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] h-[600px] overflow-y-auto relative bg-white/50">
          {/* Time Gutter */}
          <div className="flex flex-col">
            {hours.map(h => (
              <div key={h} className="h-20 border-r border-slate-50 flex items-start justify-center p-2">
                <span className="text-xs font-bold text-slate-300">{h}:00</span>
              </div>
            ))}
          </div>

          {/* Grid Columns */}
          {days.map(day => (
            <div key={day} className="border-r border-slate-50 relative flex flex-col group hover:bg-indigo-50/10 transition-colors">
               {hours.map(h => (
                 <div key={h} className="h-20 border-b border-slate-50"></div>
               ))}
               
               {/* Render Scheduled Tasks */}
               {schedule.filter(s => s.day === day).map((task, i) => (
                 <div 
                   key={i}
                   className={`absolute left-1 right-1 rounded-xl p-3 shadow-sm text-white text-xs font-bold ${task.color} overflow-hidden`}
                   style={{
                     top: `${(task.start - 8) * 5}rem`,
                     height: `${(task.end - task.start) * 5}rem`
                   }}
                 >
                   <div className="flex flex-col h-full justify-between">
                     <p className="line-clamp-2">{task.title}</p>
                     <div className="flex items-center gap-1 opacity-80">
                        <Clock className="w-3 h-3" />
                        <span>{task.start}:00 - {task.end}:00</span>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planner;
