
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Sparkles, Target, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { LearningPath, StudentProfile } from '../types';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', growth: 10 }, { name: 'Tue', growth: 25 }, { name: 'Wed', growth: 22 },
  { name: 'Thu', growth: 40 }, { name: 'Fri', growth: 45 }, { name: 'Sat', growth: 60 },
  { name: 'Sun', growth: 70 },
];

interface DashboardProps {
  profile: StudentProfile;
  currentPath: LearningPath | null;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, currentPath }) => {
  const currentMilestone = currentPath?.milestones.find(m => m.status === 'current');

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10">
        <div className="flex items-center gap-3 text-indigo-600 mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Comparison-Free Guidance</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hello, {profile.name.split(' ')[0]}</h1>
        <p className="text-slate-500 text-lg mt-1">Here is your clarity-first overview for your {profile.stage} year.</p>
      </header>

      {/* Main Feature: Decision Fatigue Reduction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          {/* THE NEXT BEST STEP - Clarity-First */}
          <section className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest opacity-80">The Next Best Step</span>
              </div>
              
              {currentMilestone ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">{currentMilestone.title}</h2>
                  <p className="text-indigo-100 text-lg mb-8 max-w-lg leading-relaxed">{currentMilestone.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {currentMilestone.practicalActions.slice(0, 2).map((action, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                        <span className="text-sm font-medium">{action}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/path" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-transform">
                    Action Center <ArrowRight className="w-5 h-5" />
                  </Link>
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-xl font-bold mb-6">No active path. Let's build your direction.</p>
                  <Link to="/path" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold">Start Personalized Path</Link>
                </div>
              )}
            </div>
            <Sparkles className="absolute -right-8 -bottom-8 w-64 h-64 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
          </section>

          {/* Personal Growth Tracker - Comparison-Free */}
          <section className="glass-effect p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Personal Growth Trend</h3>
                  <p className="text-sm text-slate-400">Focusing on your own progress, zero comparison.</p>
                </div>
             </div>
             <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Area 
                      type="monotone" 
                      dataKey="growth" 
                      stroke="#4f46e5" 
                      strokeWidth={4} 
                      fill="url(#colorGrowth)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </section>
        </div>

        {/* Sidebar: Preventive Guidance & Stats */}
        <div className="space-y-8">
          {/* Preventive Advice */}
          <section className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] relative overflow-hidden">
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4 text-amber-700">
                 <ShieldCheck className="w-5 h-5" />
                 <span className="text-xs font-bold uppercase tracking-widest">Preventive Guidance</span>
               </div>
               <h4 className="text-lg font-bold text-amber-900 mb-2">Before You Move Forward...</h4>
               <p className="text-amber-800 text-sm leading-relaxed italic">
                 {currentMilestone?.preventiveAdvice || "Identify your core learning style before committing to a heavy 10-week curriculum. This prevents 'burnout cycles' common in your stage."}
               </p>
             </div>
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl"></div>
          </section>

          {/* Simple Metrics */}
          <div className="space-y-4">
             <MetricCard icon={<Zap className="text-indigo-600" />} label="Consistency" value="12 Days" />
             <MetricCard icon={<Clock className="text-slate-600" />} label="Focus Time" value="14.2 hrs" />
          </div>

          <Link to="/mentor" className="block p-6 bg-slate-900 rounded-[32px] text-white hover:bg-slate-800 transition-colors">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Decision Support</p>
            <h5 className="font-bold flex items-center justify-between">
              Ask Lumina Mentor <ArrowRight className="w-4 h-4" />
            </h5>
          </Link>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="glass-effect p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">{icon}</div>
      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-lg font-black text-slate-800">{value}</span>
  </div>
);

export default Dashboard;
