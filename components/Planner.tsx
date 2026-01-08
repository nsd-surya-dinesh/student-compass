
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Mail, ToggleLeft, ToggleRight, Trash2, X, Check, Info, Bell, BellOff } from 'lucide-react';
import { Task } from '../types';

interface PlannerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onNotify: (msg: string, type?: 'success' | 'info') => void;
}

const Planner: React.FC<PlannerProps> = ({ tasks, setTasks, onNotify }) => {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', day: 'Mon', start: 9, reminder: true });

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); 
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleReminders = () => {
    setRemindersEnabled(!remindersEnabled);
    onNotify(!remindersEnabled ? "Global alerts on" : "Global alerts off", !remindersEnabled ? 'success' : 'info');
  };

  const toggleTaskReminder = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, reminderActive: !t.reminderActive } : t
    ));
    onNotify("Task reminder updated");
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      day: newTask.day,
      start: newTask.start,
      end: newTask.start + 2,
      title: newTask.title,
      color: ['bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-500'][Math.floor(Math.random() * 4)],
      notified: false,
      reminderActive: newTask.reminder
    };
    
    setTasks([...tasks, task]);
    setIsAdding(false);
    setNewTask({ title: '', day: 'Mon', start: 9, reminder: true });
    onNotify("Focus block synced!", 'success');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(s => s.id !== id));
    onNotify("Block removed", 'info');
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Schedule Architecture</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Focus Planner</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-[28px] border border-slate-100 shadow-sm">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Master Alerts</span>
                <span className={`text-xs font-black ${remindersEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {remindersEnabled ? 'ON' : 'OFF'}
                </span>
             </div>
             <button onClick={toggleReminders} className="text-indigo-600 transition-all hover:scale-110 active:scale-95 outline-none">
                {remindersEnabled ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
             </button>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-slate-900 text-white font-black py-4 px-8 rounded-[28px] flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
          >
            <Plus className="w-5 h-5" /> Schedule Focus
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="mb-10 p-8 lg:p-12 bg-white border-4 border-indigo-50 rounded-[50px] shadow-3xl animate-in slide-in-from-top-8 duration-500 relative">
           <button onClick={() => setIsAdding(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
           
           <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
             <Info className="w-6 h-6 text-indigo-600" /> 
             Plan Focus Block
           </h3>
           
           <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1 space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                 <input 
                   required
                   type="text" 
                   autoFocus
                   className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800" 
                   value={newTask.title}
                   onChange={e => setNewTask({...newTask, title: e.target.value})}
                   placeholder="e.g. Logic Review" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Day</label>
                 <select 
                   className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800 appearance-none"
                   value={newTask.day}
                   onChange={e => setNewTask({...newTask, day: e.target.value})}
                 >
                   {days.map(d => <option key={d}>{d}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Set Reminder?</label>
                 <div className="flex items-center gap-4 py-3">
                    <button 
                      type="button"
                      onClick={() => setNewTask({...newTask, reminder: !newTask.reminder})}
                      className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${newTask.reminder ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {newTask.reminder ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                      {newTask.reminder ? "YES" : "NO"}
                    </button>
                 </div>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                 <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[24px] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <Check className="w-5 h-5" /> Save Plan
                 </button>
              </div>
           </form>
        </div>
      )}

      <div className="glass-effect rounded-[60px] shadow-3xl border border-white overflow-hidden mb-12">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] lg:grid-cols-[120px_repeat(7,1fr)] border-b border-slate-100 bg-white/40">
          <div className="p-4 lg:p-8"></div>
          {days.map(day => (
            <div key={day} className="p-4 lg:p-8 text-center font-black text-slate-400 text-[10px] lg:text-xs uppercase tracking-[0.2em]">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-[80px_repeat(7,1fr)] lg:grid-cols-[120px_repeat(7,1fr)] h-[700px] overflow-y-auto relative bg-white/10 backdrop-blur-sm scrollbar-hide">
          <div className="flex flex-col border-r border-slate-100 bg-slate-50/50">
            {hours.map(h => (
              <div key={h} className="h-28 flex items-start justify-center pt-6">
                <span className="text-[10px] font-black text-slate-300">{h}:00</span>
              </div>
            ))}
          </div>

          {days.map(day => (
            <div key={day} className="border-r border-slate-100/50 relative flex flex-col group hover:bg-indigo-50/10 transition-colors">
               {hours.map(h => (
                 <div key={h} className="h-28 border-b border-slate-100/50"></div>
               ))}
               
               {tasks.filter(s => s.day === day).map((task) => (
                 <div 
                   key={task.id}
                   className={`absolute left-1 right-1 lg:left-3 lg:right-3 rounded-[32px] p-4 lg:p-6 shadow-2xl text-white overflow-hidden group/task hover:scale-[1.02] transition-all cursor-pointer ${task.color}`}
                   style={{
                     top: `${(task.start - 8) * 7}rem`,
                     height: `${(task.end - task.start) * 7}rem`
                   }}
                 >
                   <div className="flex flex-col h-full relative z-10">
                     <div className="flex justify-between items-start mb-2">
                        <p className="font-black text-xs lg:text-sm leading-tight line-clamp-2 uppercase tracking-tight">{task.title}</p>
                        <div className="flex items-center gap-1">
                           <button 
                             onClick={(e) => { e.stopPropagation(); toggleTaskReminder(task.id); }} 
                             className={`p-1.5 rounded-lg transition-colors ${task.reminderActive ? 'bg-white/20' : 'bg-transparent text-white/40'}`}
                             title={task.reminderActive ? "Reminder Set" : "Reminder Off"}
                           >
                              {task.reminderActive ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); removeTask(task.id); }} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover/task:opacity-100">
                              <Trash2 className="w-3.5 h-3.5 text-white" />
                           </button>
                        </div>
                     </div>
                     <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/20">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-90">
                           <Clock className="w-3 h-3" />
                           <span>{task.start}:00</span>
                        </div>
                     </div>
                   </div>
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
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
