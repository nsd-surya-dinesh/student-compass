
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  MessageSquare, 
  Calendar, 
  Compass,
  Beaker,
  LogOut,
  ChevronLeft,
  Flame,
  BookMarked,
  Activity,
  ShieldCheck,
  Zap,
  Layout,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import PathBuilder from './components/PathBuilder';
import MentorChat from './components/MentorChat';
import Planner from './components/Planner';
import ProjectLab from './components/ProjectLab';
import StudyArena from './components/StudyArena';
import MonkMode from './components/MonkMode';
import { BackgroundPaths } from './components/ui/background-paths';
import { SparklesCore } from './components/ui/sparkles';
import { generateLearningPath } from './services/geminiService';
import { LearningPath, StudentProfile, StudentStage, SkillLevel, Milestone, Task, ProjectIdea } from './types';

const GoogleAuthGate: React.FC<{ 
  onAuth: (profile: StudentProfile | null) => void, 
  existingProfile: StudentProfile | null 
}> = ({ onAuth, existingProfile }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onAuth(existingProfile);
      setLoading(false);
    }, 1200);
  };

  const displayName = existingProfile ? `Welcome, ${existingProfile.name.split(' ')[0]}` : "Student Compass";

  return (
    <BackgroundPaths>
      <div className="flex flex-col items-center justify-center w-full max-w-4xl px-4 animate-in fade-in duration-1000">
        <div className="relative w-full flex flex-col items-center justify-center overflow-hidden">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-center text-slate-900 dark:text-white relative z-20 tracking-tighter leading-tight">
            {displayName}
          </h1>
          
          <div className="w-full max-w-[40rem] h-20 relative">
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1.2}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#6366f1"
            />
            <div className="absolute inset-0 w-full h-full bg-transparent [mask-image:radial-gradient(350px_100px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>

        <div className="relative z-30 mt-8 flex flex-col items-center gap-6">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="group relative bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black py-5 px-12 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-2xl overflow-hidden min-w-[280px]"
          >
            <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white">
              {loading ? (
                <>Booting Neural Core <Zap className="w-5 h-5 animate-pulse" /></>
              ) : (
                <>Enter Compass Terminal <Compass className="w-5 h-5" /></>
              )}
            </span>
          </button>
        </div>
      </div>
    </BackgroundPaths>
  );
};

const OnboardingArchitect: React.FC<{ onComplete: (profile: StudentProfile, initialPath: LearningPath) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    stage: 'Freshman' as StudentStage,
    skillLevel: 'Beginner' as SkillLevel,
    goal: ''
  });

  const isNameValid = formData.name.trim().length >= 7;

  const handleFinalize = async () => {
    if (!isNameValid || !formData.goal.trim()) return;
    setLoading(true);
    try {
      const profile: StudentProfile = {
        user_id: `user_${Math.random().toString(36).substring(2, 11)}`,
        name: formData.name.trim(),
        email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@compass.ai`,
        stage: formData.stage,
        skillLevel: formData.skillLevel,
        primaryGoal: formData.goal
      };
      const path = await generateLearningPath(formData.goal, profile);
      onComplete(profile, path);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const GateTransition = ({ children, title }: { children?: React.ReactNode, title: string }) => (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="relative w-full flex flex-col items-center justify-center overflow-hidden mb-8">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-center text-slate-900 dark:text-white relative z-20 tracking-tighter leading-tight">
          {title}
        </h1>
        <div className="w-full max-w-[30rem] h-12 relative">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.0}
            particleDensity={600}
            className="w-full h-full"
            particleColor="#6366f1"
          />
          <div className="absolute inset-0 w-full h-full bg-transparent [mask-image:radial-gradient(250px_60px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
      <div className="w-full max-w-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 lg:p-12 rounded-[50px] shadow-3xl border border-white dark:border-slate-800 z-30">
        {children}
      </div>
    </div>
  );

  return (
    <BackgroundPaths>
      {step === 1 && (
        <GateTransition title="Identify Yourself">
          <div className="space-y-8">
            <input 
              autoFocus
              type="text" 
              placeholder="Full Academic Name" 
              className="w-full px-8 py-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600 outline-none font-black text-2xl transition-all dark:text-white dark:placeholder-slate-500 shadow-inner"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <button 
              onClick={() => setStep(2)} 
              disabled={!isNameValid}
              className="group relative w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black py-6 rounded-3xl transition-all active:scale-95 disabled:opacity-30 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white uppercase tracking-widest text-sm">
                Next Vector <ChevronRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        </GateTransition>
      )}

      {step === 2 && (
        <GateTransition title="Context Selection">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Career Changer'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFormData({...formData, stage: s as StudentStage})}
                  className={`p-5 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${formData.stage === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-[1.02]' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-indigo-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ChevronLeft /></button>
              <button 
                onClick={() => setStep(3)} 
                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black py-6 rounded-3xl shadow-2xl uppercase tracking-widest text-sm"
              >
                Finalize Strategy
              </button>
            </div>
          </div>
        </GateTransition>
      )}

      {step === 3 && (
        <GateTransition title="Define Mastery">
          <div className="space-y-8">
            <textarea 
              autoFocus
              dir="ltr"
              spellCheck={false}
              placeholder="What are we building? (e.g. Distributed Systems Engineer)" 
              className="w-full h-40 px-8 py-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600 outline-none font-black text-xl text-left resize-none dark:text-white dark:placeholder-slate-500 shadow-inner"
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
            />
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ChevronLeft /></button>
              <button 
                onClick={handleFinalize} 
                disabled={loading || !formData.goal.trim()} 
                className="group relative flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black py-6 rounded-3xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white uppercase tracking-widest text-sm">
                  {loading ? 'Synthesizing...' : 'Enter Compass Terminal'} <Compass className="w-5 h-5" />
                </span>
              </button>
            </div>
          </div>
        </GateTransition>
      )}
    </BackgroundPaths>
  );
};

const NavLink: React.FC<{ item: any }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;
  return (
    <Link to={item.path} className={`flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-xl translate-x-1' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'}`}>
      <Icon className="w-5 h-5" /><span className="font-bold text-sm">{item.label}</span>
    </Link>
  );
};

const App: React.FC = () => {
  const [sessionActive, setSessionActive] = useState(() => localStorage.getItem('compass_session') === 'true');
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('compass_profile_v1');
    return saved ? JSON.parse(saved) : null;
  });
  const [paths, setPaths] = useState<LearningPath[]>(() => {
    const saved = localStorage.getItem('compass_paths_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [activePathId, setActivePathId] = useState<string | null>(() => localStorage.getItem('compass_active_id'));
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('compass_tasks_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [labIdeas, setLabIdeas] = useState<ProjectIdea[]>(() => {
    const saved = localStorage.getItem('compass_lab_ideas_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('compass_theme') as 'light' | 'dark') || 'light';
  });

  const currentPath = paths.find(p => p.id === activePathId) || null;

  useEffect(() => {
    if (profile) localStorage.setItem('compass_profile_v1', JSON.stringify(profile));
    localStorage.setItem('compass_paths_v1', JSON.stringify(paths));
    if (activePathId) localStorage.setItem('compass_active_id', activePathId);
    localStorage.setItem('compass_session', sessionActive.toString());
    localStorage.setItem('compass_tasks_v1', JSON.stringify(tasks));
    localStorage.setItem('compass_lab_ideas_v1', JSON.stringify(labIdeas));
    localStorage.setItem('compass_theme', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile, paths, activePathId, sessionActive, tasks, labIdeas, theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleUpdateMilestone = (pathId: string, milestoneId: string, updates: Partial<Milestone>) => {
    setPaths(prev => prev.map(path => {
      if (path.id !== pathId) return path;
      return {
        ...path,
        milestones: path.milestones.map(m => 
          m.id === milestoneId ? { ...m, ...updates } : m
        )
      };
    }));
  };

  const handleCompleteMilestone = (milestoneId: string) => {
    if (!currentPath) return;
    const milestoneIndex = currentPath.milestones.findIndex(m => m.id === milestoneId);
    if (milestoneIndex === -1) return;

    const updatedMilestones = currentPath.milestones.map((m, idx) => {
      if (m.id === milestoneId) return { ...m, status: 'completed' as const };
      if (idx === milestoneIndex + 1) return { ...m, status: 'current' as const };
      return m;
    });

    setPaths(prev => prev.map(p => p.id === currentPath.id ? { ...p, milestones: updatedMilestones } : p));
  };

  if (!sessionActive) {
    return (
      <GoogleAuthGate 
        onAuth={(existing) => {
          if (existing) {
            setSessionActive(true);
          } else {
            setProfile(null);
            setSessionActive(true);
          }
        }} 
        existingProfile={profile} 
      />
    );
  }

  if (!profile) {
    return (
      <OnboardingArchitect 
        onComplete={(p, path) => {
          setProfile(p);
          setPaths([path]);
          setActivePathId(path.id);
        }} 
      />
    );
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <nav className="w-64 h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col p-6 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg transition-transform hover:rotate-6">
              <Compass className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-950 dark:text-white tracking-tighter">Compass</span>
          </div>
          
          <div className="flex-1 space-y-2">
            {[
              { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
              { path: '/arena', icon: BookMarked, label: 'Study Arena' },
              { path: '/focus', icon: Flame, label: 'Monk Mode' },
              { path: '/path', icon: Map, label: 'Path Hub' },
              { path: '/lab', icon: Beaker, label: 'Project Lab' },
              { path: '/mentor', icon: MessageSquare, label: 'Mentor' },
              { path: '/planner', icon: Calendar, label: 'Schedule' },
            ].map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" /> : <Sun className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
              <span className="font-bold text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                {profile.name[0]}
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate max-w-[80px]">{profile.name.split(' ')[0]}</p>
            </div>
            <button onClick={() => setSessionActive(false)} className="text-slate-400 hover:text-rose-500 transition-all p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </nav>
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-10 pb-32">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} currentPath={currentPath} />} />
            <Route path="/arena" element={<StudyArena profile={profile} currentPath={currentPath} onUpdateMilestone={handleUpdateMilestone} />} />
            <Route path="/focus" element={<MonkMode />} />
            <Route path="/path" element={<PathBuilder 
              profile={profile} 
              paths={paths} 
              activePathId={activePathId} 
              setPaths={setPaths} 
              setActivePathId={setActivePathId} 
              onCompleteMilestone={handleCompleteMilestone} 
              onNotify={(msg) => console.log(msg)} 
            />} />
            <Route path="/lab" element={<ProjectLab profile={profile} currentPath={currentPath} ideas={labIdeas} setIdeas={setLabIdeas} />} />
            <Route path="/mentor" element={<MentorChat profile={profile} />} />
            <Route path="/planner" element={<Planner tasks={tasks} setTasks={setTasks} onNotify={() => {}} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
