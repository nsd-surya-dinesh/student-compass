
import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, Lock, ArrowRight, ShieldAlert, CircleDot, BookOpen, ExternalLink, Video, FileText, Share2, Globe, Trash2, ArrowLeft, PlusCircle, Check, Layers, Map, Archive, Activity, RefreshCcw, Orbit, Compass } from 'lucide-react';
import { generateLearningPath, simplifyTopic } from '../services/geminiService';
import { LearningPath, Milestone, StudentProfile, SimplifiedMaterial } from '../types';
import { Loading } from './ui/circle-unique-load';
import RadialOrbitalTimeline from './ui/radial-orbital-timeline';

interface PathBuilderProps {
  profile: StudentProfile;
  paths: LearningPath[];
  activePathId: string | null;
  setPaths: (paths: LearningPath[]) => void;
  setActivePathId: (id: string | null) => void;
  onCompleteMilestone: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'info') => void;
}

const PathBuilder: React.FC<PathBuilderProps> = ({ profile, paths, activePathId, setPaths, setActivePathId, onCompleteMilestone, onNotify }) => {
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showTopology, setShowTopology] = useState(false);
  const [tab, setTab] = useState<'active' | 'archived'>('active');

  const currentPath = paths.find(p => p.id === activePathId) || null;

  const setCurrentPath = (path: LearningPath) => {
    setPaths(paths.map(p => p.id === path.id ? path : p));
  };

  const activePaths = paths.filter(p => !p.isArchived);
  const archivedPaths = paths.filter(p => p.isArchived);

  const handleGenerate = async (mode: 'add' | 'archive_replace' | 'hard_reset') => {
    if (!subject.trim()) {
      onNotify("Subject required.", "info");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const path = await generateLearningPath(subject, profile);
      let updatedPaths = [...paths];
      if (mode === 'hard_reset') updatedPaths = [path];
      else if (mode === 'archive_replace') {
        updatedPaths = paths.map(p => ({ ...p, isArchived: true }));
        updatedPaths.push(path);
      } else updatedPaths.push(path);

      setPaths(updatedPaths);
      setActivePathId(path.id);
      setShowGenerator(false);
      setTab('active');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleArchive = (id: string) => {
    const newPaths = paths.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p);
    setPaths(newPaths);
  };

  const deletePath = (id: string) => {
    if (confirm('Permanently discard roadmap?')) {
      const newPaths = paths.filter(p => p.id !== id);
      setPaths(newPaths);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center">
        <Loading />
        <p className="font-black text-slate-400 dark:text-slate-500 mt-6 animate-pulse uppercase tracking-[0.2em] text-xs">Synthesizing Trajectory...</p>
      </div>
    );
  }

  if (currentPath && showTopology) {
    const timelineItems = currentPath.milestones.map((m, i) => ({
      id: i,
      title: m.title,
      date: `Phase ${i + 1}`,
      content: m.description,
      category: m.status,
      icon: m.status === 'completed' ? CheckCircle2 : m.status === 'current' ? Orbit : Lock,
      relatedIds: i > 0 ? [i - 1] : [],
      status: m.status === 'completed' ? 'completed' : m.status === 'current' ? 'in-progress' : 'pending',
      energy: m.status === 'completed' ? 100 : m.status === 'current' ? 60 : 10
    }));

    return (
      <div className="fixed inset-0 z-50 bg-black animate-in fade-in duration-500">
        <div className="absolute top-10 left-10 z-[60] flex items-center gap-4">
          <button 
            onClick={() => setShowTopology(false)}
            className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-white text-2xl font-black tracking-tighter">Strategic Topology</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{currentPath.subject}</p>
          </div>
        </div>
        <RadialOrbitalTimeline timelineData={timelineItems as any} />
      </div>
    );
  }

  if (!currentPath || showGenerator) {
    return (
      <div className="max-w-4xl mx-auto py-10 animate-in fade-in duration-700">
        {paths.length > 0 && !showGenerator && (
          <>
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Hub</h2>
                <div className="flex gap-4 mt-4">
                  <button onClick={() => setTab('active')} className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'active' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>Active</button>
                  <button onClick={() => setTab('archived')} className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'archived' ? 'bg-slate-900 dark:bg-slate-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>Archived</button>
                </div>
              </div>
              <button 
                onClick={() => setShowGenerator(true)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl"
              >
                <PlusCircle className="w-4 h-4 mr-2 inline" /> New Roadmap
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(tab === 'active' ? activePaths : archivedPaths).map(p => (
                <div key={p.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-10 rounded-[40px] border border-white dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer group" onClick={() => setActivePathId(p.id)}>
                   <div className="flex items-center justify-between mb-8">
                      <Map className="text-indigo-400" />
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleArchive(p.id); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Archive className="w-4 h-4 text-slate-400" /></button>
                        <button onClick={(e) => { e.stopPropagation(); deletePath(p.id); }} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"><Trash2 className="w-4 h-4 text-rose-300" /></button>
                      </div>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{p.subject}</h3>
                   <div className="flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Open Track <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></div>
                </div>
              ))}
            </div>
          </>
        )}

        {(showGenerator || paths.length === 0) && (
          <div className="max-w-2xl mx-auto py-20 text-center">
            <div className="inline-block p-10 bg-indigo-600 rounded-[50px] mb-10 shadow-3xl shadow-indigo-100 dark:shadow-indigo-900/20">
               <Compass className="text-white w-12 h-12" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Strategic Mapping</h2>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl space-y-8 border border-slate-100 dark:border-slate-800">
               <input 
                 type="text" 
                 placeholder="Subject to Master..." 
                 className="w-full px-8 py-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none font-black text-2xl dark:text-white dark:placeholder-slate-500"
                 value={subject}
                 onChange={e => setSubject(e.target.value)}
               />
               <button 
                 onClick={() => handleGenerate('add')}
                 disabled={loading || !subject.trim()}
                 className="w-full bg-indigo-600 text-white font-black py-6 rounded-[30px] hover:bg-indigo-700 transition-all shadow-xl text-lg"
               >
                 Initialize Path
               </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 px-4">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-slate-800 pb-12">
        <div className="flex-1">
          <button onClick={() => setActivePathId(null)} className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors"><ArrowLeft className="w-3 h-3" /> Hub</button>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{currentPath.subject}</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowTopology(true)}
            className="p-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all shadow-xl"
          >
            <Orbit className="w-5 h-5" /> Topology
          </button>
          <button onClick={() => setShowGenerator(true)} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg"><PlusCircle className="w-6 h-6" /></button>
        </div>
      </header>

      <div className="space-y-16">
        {currentPath.milestones.map((m, idx) => (
          <MilestoneCard 
            key={m.id} 
            milestone={m} 
            index={idx} 
            profile={profile}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            onComplete={() => onCompleteMilestone(m.id)}
            onNotify={onNotify}
          />
        ))}
      </div>
    </div>
  );
};

const MilestoneCard = ({ milestone, index, profile, currentPath, setCurrentPath, onComplete, onNotify }: any) => {
  const [loadingMat, setLoadingMat] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const isCurrent = milestone.status === 'current';
  const isCompleted = milestone.status === 'completed';
  const isLocked = milestone.status === 'locked';

  const fetchSummary = async () => {
    if (milestone.materials) { setShowSummary(!showSummary); return; }
    setLoadingMat(true);
    try {
      const simplified = await simplifyTopic(milestone.title, profile.stage);
      const updatedMilestones = currentPath.milestones.map((m: any) => 
        m.id === milestone.id ? { ...m, materials: simplified } : m
      );
      setCurrentPath({ ...currentPath, milestones: updatedMilestones });
      setShowSummary(true);
    } catch (err) {
      onNotify("Sync Error", 'info');
    } finally {
      setLoadingMat(false);
    }
  };

  return (
    <div className={`flex gap-8 relative ${isLocked ? 'opacity-30 grayscale' : ''}`}>
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-16 h-16 rounded-[25px] flex items-center justify-center shadow-xl relative z-10 transition-all ${
          isCompleted ? 'bg-emerald-500 text-white' : 
          isCurrent ? 'bg-slate-900 dark:bg-indigo-600 text-white scale-110 ring-8 ring-indigo-50 dark:ring-indigo-900/20' : 
          'bg-white dark:bg-slate-800 text-slate-200 dark:text-slate-600 border border-slate-100 dark:border-slate-700'
        }`}>
          {isCompleted ? <CheckCircle2 /> : isCurrent ? <CircleDot className="animate-pulse" /> : <Lock />}
        </div>
        <div className="w-1 h-full bg-slate-100 dark:bg-slate-800 mt-2"></div>
      </div>
      <div className={`flex-1 p-10 rounded-[45px] transition-all bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white dark:border-slate-800 ${isCurrent ? 'shadow-2xl border-indigo-100 dark:border-indigo-900 ring-2 ring-indigo-50 dark:ring-indigo-900/10' : 'shadow-sm'}`}>
        <div className="flex justify-between items-start gap-4 mb-6">
           <div className="flex-1">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 block">Phase 0{index + 1}</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{milestone.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{milestone.description}</p>
           </div>
           {isCurrent && (
              <button onClick={fetchSummary} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                {loadingMat ? <Loader2 className="animate-spin" /> : <BookOpen />}
              </button>
           )}
        </div>
        {isCurrent && showSummary && milestone.materials && (
           <div className="mb-10 p-8 bg-indigo-600 text-white rounded-[35px] animate-in zoom-in-95 shadow-xl">
              <p className="text-xl font-black mb-6 italic">"{milestone.materials.summary}"</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {milestone.materials.keyConcepts.map((c: string, i: number) => (
                    <div key={i} className="bg-white/10 p-4 rounded-2xl text-sm font-bold">{c}</div>
                 ))}
              </div>
           </div>
        )}
        {isCurrent && (
           <div className="space-y-4">
              {milestone.practicalActions.map((a: string, i: number) => (
                 <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-[25px] border border-slate-100 dark:border-slate-700 group hover:border-indigo-600 dark:hover:border-indigo-400 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center font-black group-hover:text-indigo-600 dark:group-hover:text-indigo-400 dark:text-white">{i+1}</div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{a}</span>
                 </div>
              ))}
              <button onClick={onComplete} className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black py-6 rounded-[30px] shadow-2xl hover:bg-emerald-600 dark:hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                 Evolve Phase <ArrowRight />
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default PathBuilder;
