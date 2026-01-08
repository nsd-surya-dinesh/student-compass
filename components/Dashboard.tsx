
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Sparkles, Target, Zap, Clock, ShieldCheck, 
  ArrowRight, Layers, Compass, Orbit, Beaker,
  Activity, ZapOff, TrendingUp, ChevronRight
} from 'lucide-react';
import { LearningPath, StudentProfile } from '../types';
import { Link } from 'react-router-dom';
import { SparklesCore } from './ui/sparkles';
import { CopyButton } from './ui/copy-button';

interface DashboardProps {
  profile: StudentProfile;
  currentPath: LearningPath | null;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, currentPath }) => {
  const currentMilestone = currentPath?.milestones?.find(m => m.status === 'current');
  const completedCount = currentPath?.milestones?.filter(m => m.status === 'completed').length || 0;
  
  const growthData = useMemo(() => [
    { name: 'S1', progress: 0 },
    { name: 'S2', progress: completedCount >= 1 ? 25 : 8 },
    { name: 'S3', progress: completedCount >= 2 ? 50 : 15 },
    { name: 'S4', progress: completedCount >= 3 ? 75 : 22 },
    { name: 'S5', progress: completedCount >= 4 ? 90 : 28 },
    { name: 'S6', progress: completedCount >= 5 ? 100 : 35 },
  ], [completedCount]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Command Header */}
      <div className="relative mb-12 rounded-[60px] overflow-hidden bg-slate-900 dark:bg-indigo-950/20 p-12 lg:p-16 text-white border border-slate-800 dark:border-indigo-500/20">
        <div className="absolute inset-0 z-0 opacity-40">
           <SparklesCore
             id="dashboard-particles"
             background="transparent"
             minSize={0.6}
             maxSize={1.4}
             particleDensity={100}
             className="w-full h-full"
             particleColor="#6366f1"
             speed={0.5}
           />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Sync
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
              Strategic Status, <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-200">
                {profile?.name?.split(' ')[0]}
              </span>
            </h1>
            <p className="text-slate-400 text-xl font-medium italic max-w-xl">
              Currently navigating the <span className="text-indigo-300 font-bold">{currentPath?.subject || 'Undefined Sector'}</span> roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/mentor" className="group bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-10 py-6 rounded-[30px] font-black text-sm uppercase tracking-widest shadow-3xl transition-all flex items-center justify-center gap-3">
               Summon Mentor <Zap className="w-5 h-5 group-hover:fill-current" />
            </Link>
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-[30px] border border-white/10 flex flex-col items-center justify-center min-w-[140px]">
               <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">XP Level</span>
               <span className="text-3xl font-black">{completedCount * 1250}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-[50px] p-10 lg:p-12 border border-white dark:border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                    <Target className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Objective</h3>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Deployment Phase 0{completedCount + 1}</p>
                 </div>
              </div>
            </div>

            {currentMilestone ? (
              <div className="space-y-8">
                <div>
                   <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-tight">
                     {currentMilestone.title}
                   </h2>
                   <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
                     {currentMilestone.description}
                   </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link to="/path" className="flex items-center gap-3 bg-slate-900 dark:bg-indigo-600 text-white font-black px-10 py-5 rounded-[28px] hover:scale-105 transition-all shadow-xl active:scale-95 group">
                    Initialize Phase <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                 <ZapOff className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                 <p className="text-2xl font-black text-slate-300 uppercase tracking-tighter italic">Roadmap Logic Offline. Please select a path.</p>
              </div>
            )}
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl p-10 lg:p-12 rounded-[50px] border border-white dark:border-slate-800 shadow-xl">
             <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                     Mastery Velocity <TrendingUp className="text-indigo-500 w-6 h-6" />
                   </h3>
                   <p className="text-sm font-bold text-slate-400 mt-1">AI-Projected progression curve for current semester.</p>
                </div>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 11}} 
                        dy={15}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '24px', 
                          border: 'none', 
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          padding: '15px'
                        }} 
                        itemStyle={{fontWeight: '900', color: '#6366f1'}}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="progress" 
                        stroke="#6366f1" 
                        strokeWidth={6} 
                        fill="url(#velocityGrad)" 
                        animationDuration={2500}
                        dot={{ r: 6, fill: '#6366f1', strokeWidth: 4, stroke: '#fff' }}
                        activeDot={{ r: 10, strokeWidth: 0 }}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-indigo-600 dark:bg-indigo-600/10 border border-indigo-500 p-10 rounded-[45px] shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <ShieldCheck className="text-white dark:text-indigo-400 w-10 h-10" />
                  <CopyButton text={currentMilestone?.preventiveAdvice || 'Trajectory clear.'} className="text-white border-white/20 hover:text-white" />
                </div>
                <h4 className="text-2xl font-black text-white dark:text-indigo-100 mb-3 tracking-tight">Guardian Advice</h4>
                <p className="text-indigo-100 dark:text-indigo-300 text-lg font-bold leading-relaxed italic">
                   {currentMilestone?.preventiveAdvice || 'Trajectory clear. Maintain focus on foundational logic before scaling complexity.'}
                </p>
             </div>
             <Orbit className="absolute -right-10 -bottom-10 w-48 h-48 opacity-20 text-white animate-spin-slow" />
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-[40px] border border-white dark:border-slate-800 shadow-xl flex items-center justify-between group hover:border-indigo-500 transition-colors">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                      <Activity className="w-7 h-7" />
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Momentum</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">Active</p>
                   </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300" />
             </div>
             
             <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-[40px] border border-white dark:border-slate-800 shadow-xl flex items-center justify-between group hover:border-indigo-500 transition-colors">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-900 dark:text-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                      <Clock className="w-7 h-7" />
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Deep Focus</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">12.4h</p>
                   </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300" />
             </div>
          </div>

          <Link to="/lab" className="block p-12 bg-slate-900 dark:bg-indigo-600 rounded-[50px] text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all shadow-3xl relative overflow-hidden group">
             <div className="flex justify-between items-start mb-10">
                <Beaker className="w-12 h-12 text-rose-400 group-hover:rotate-12 transition-transform" />
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
             </div>
             <h5 className="text-3xl font-black tracking-tighter mb-2">Project Synthesis</h5>
             <p className="text-slate-400 dark:text-indigo-200 font-bold">3 active prototypes ready for development.</p>
             
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-rose-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
          </Link>
        </div>
      </div>
      
      {/* Bottom Floating Stats */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl px-10 py-5 rounded-[30px] border border-white/40 dark:border-slate-800 shadow-3xl flex items-center gap-12 z-50">
         <div className="flex items-center gap-3">
            <Layers className="text-indigo-500 w-5 h-5" />
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Global Path: 42%</span>
         </div>
         <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
         <div className="flex items-center gap-3">
            <Activity className="text-emerald-500 w-5 h-5" />
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Daily Streak: 04</span>
         </div>
         <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
         <div className="flex items-center gap-3">
            <Compass className="text-rose-500 w-5 h-5" />
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Next Phase in 2d</span>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
