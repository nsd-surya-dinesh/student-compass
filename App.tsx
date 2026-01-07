
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  MessageSquare, 
  Calendar, 
  UserCircle,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PathBuilder from './components/PathBuilder';
import MentorChat from './components/MentorChat';
import Planner from './components/Planner';
import { LearningPath, StudentProfile } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('lumina_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(() => {
    const saved = localStorage.getItem('lumina_path');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (profile) localStorage.setItem('lumina_profile', JSON.stringify(profile));
    if (currentPath) localStorage.setItem('lumina_path', JSON.stringify(currentPath));
  }, [profile, currentPath]);

  const Onboarding = () => {
    const [name, setName] = useState('');
    const [stage, setStage] = useState('Freshman');
    const [skill, setSkill] = useState('Beginner');

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full glass-effect p-10 rounded-[40px] shadow-2xl border border-white">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-100">
              <BrainCircuit className="text-white w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">Setup Lumina</h1>
          <p className="text-slate-500 text-center mb-8">Let's tailor your guidance to your current stage.</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="How should I address you?"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Stage</label>
              <select 
                value={stage} onChange={(e) => setStage(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
                <option>Career Changer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Skill Level</label>
              <select 
                value={skill} onChange={(e) => setSkill(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <button 
              onClick={() => name && setProfile({ name, stage: stage as any, skillLevel: skill as any, primaryGoal: '' })}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4"
            >
              Begin Journey <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Navigation = () => {
    const location = useLocation();
    const navItems = [
      { path: '/', icon: LayoutDashboard, label: 'Clarity Board' },
      { path: '/path', icon: Map, label: 'Growth Path' },
      { path: '/mentor', icon: MessageSquare, label: 'Mentor' },
      { path: '/planner', icon: Calendar, label: 'Focus Planner' },
    ];

    return (
      <nav className="w-64 h-screen glass-effect fixed left-0 top-0 border-r border-slate-200 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-indigo-950 tracking-tight">Lumina</span>
        </div>
        
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-200">
          <div className="bg-slate-100 p-4 rounded-2xl flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-slate-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{profile?.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{profile?.stage}</p>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  if (!profile) return <Onboarding />;

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Navigation />
        <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} currentPath={currentPath} />} />
            <Route path="/path" element={<PathBuilder profile={profile} currentPath={currentPath} setCurrentPath={setCurrentPath} />} />
            <Route path="/mentor" element={<MentorChat profile={profile} />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
