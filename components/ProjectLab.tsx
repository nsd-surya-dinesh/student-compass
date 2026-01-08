
import React, { useState } from 'react';
import { Beaker, Sparkles, Rocket, Loader2, ArrowRight, Lightbulb, Trash2 } from 'lucide-react';
import { generateProjectIdeas } from '../services/geminiService';
import { ProjectIdea, StudentProfile, LearningPath } from '../types';
import { Loading } from './ui/circle-unique-load';
import { PulseBeams } from './ui/pulse-beams';
import { CopyButton } from './ui/copy-button';

const loadingBeams = [
  {
    path: "M100 200 H758",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "0%" },
      animate: { 
        x1: ["0%", "100%"], 
        x2: ["-20%", "80%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"]
      },
      transition: { duration: 2, repeat: Infinity, ease: "linear" }
    }
  },
  {
    path: "M429 50 V384",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "0%" },
      animate: { 
        x1: ["0%", "0%"],
        x2: ["0%", "0%"],
        y1: ["0%", "100%"], 
        y2: ["-20%", "80%"] 
      },
      transition: { duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }
    }
  }
];

interface ProjectLabProps {
  profile: StudentProfile;
  currentPath: LearningPath | null;
  ideas: ProjectIdea[];
  setIdeas: (ideas: ProjectIdea[]) => void;
}

const ProjectLab: React.FC<ProjectLabProps> = ({ profile, currentPath, ideas, setIdeas }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!currentPath) return;
    setLoading(true);
    setError(null);
    try {
      const generated = await generateProjectIdeas(profile, currentPath.subject);
      setIdeas(generated);
    } catch (err: any) {
      setError("AI Engine busy. Please retry in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  const clearIdeas = () => {
    if (confirm('Discard current lab suggestions?')) {
      setIdeas([]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto h-[600px] flex flex-col items-center justify-center animate-in fade-in duration-500 relative">
        <div className="absolute inset-0 z-0">
          <PulseBeams 
            beams={loadingBeams as any} 
            className="bg-transparent" 
            gradientColors={{start: "#ec4899", middle: "#8b5cf6", end: "#6366f1"}}
            baseColor="rgba(236,72,153,0.1)"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <Loading />
          <p className="text-center font-black text-slate-400 uppercase tracking-[0.3em] mt-10 animate-pulse">Ideating Practical Frameworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-32">
      <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 text-rose-500 mb-3">
            <Beaker className="w-7 h-7" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Project Simulation Lab</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Practical Synthesis</h1>
        </div>
        {ideas.length > 0 && (
          <button onClick={clearIdeas} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-500 px-6 py-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all">
            <Trash2 className="w-4 h-4" /> Discard Prototypes
          </button>
        )}
      </header>

      {ideas.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-16 lg:p-24 rounded-[70px] border border-white dark:border-slate-800 text-center max-w-3xl mx-auto shadow-3xl relative overflow-hidden">
           <div className="w-28 h-28 bg-rose-50 dark:bg-rose-900/20 rounded-[45px] flex items-center justify-center mx-auto mb-10 shadow-inner relative z-10">
              <Rocket className="text-rose-500 w-14 h-14" />
           </div>
           <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight relative z-10">Theory is just a draft.</h2>
           <p className="text-slate-500 dark:text-slate-400 mb-12 text-xl leading-relaxed font-medium relative z-10 px-8">
             Lumina will architect 3 practical projects strictly aligned with your current path in <span className="text-rose-600 font-black">{currentPath?.subject || 'the chosen domain'}</span>.
           </p>
           <button 
             onClick={handleGenerate}
             disabled={loading || !currentPath}
             className="bg-slate-900 dark:bg-indigo-600 text-white font-black py-6 px-16 rounded-[35px] shadow-2xl hover:bg-rose-600 transition-all flex items-center justify-center gap-4 mx-auto disabled:opacity-50 active:scale-95 text-lg relative z-10"
           >
             <Sparkles className="w-6 h-6 text-amber-300" />
             Synthesize Lab Modules
           </button>
           {!currentPath && (
             <div className="mt-10 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-100 dark:border-amber-500/30 inline-block">
               Initialization required: Activate a Learning Path
             </div>
           )}
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-50 dark:bg-rose-900 rounded-full blur-3xl opacity-50 dark:opacity-10"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {ideas.map((idea, i) => (
             <div key={i} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-10 rounded-[55px] border border-white dark:border-slate-800 flex flex-col h-full hover:border-rose-300 hover:shadow-2xl hover:shadow-rose-100/30 transition-all group animate-in slide-in-from-bottom-8 duration-700 relative" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex items-center justify-between mb-10">
                   <div className="flex gap-2 items-center">
                     <span className="px-5 py-2 bg-rose-50 dark:bg-rose-900/20 text-[10px] font-black text-rose-600 rounded-2xl uppercase tracking-[0.2em] border border-rose-100 dark:border-rose-500/20">{idea.difficulty}</span>
                     <CopyButton text={`${idea.title}\n\n${idea.description}`} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform"><Lightbulb className="w-6 h-6 text-amber-500" /></div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight group-hover:text-rose-600 transition-colors tracking-tighter">{idea.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 flex-1 leading-relaxed text-lg">{idea.description}</p>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[35px] mb-10 border border-slate-100 dark:border-slate-800 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Mentor Context</p>
                   <p className="text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed italic">"{idea.whyThis}"</p>
                </div>

                <button 
                  onClick={() => alert(`Lab Module "${idea.title}" initialized in Workspace.`)}
                  className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black py-5 rounded-[28px] flex items-center justify-center gap-3 hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-rose-100/20"
                >
                   Execute Project <ArrowRight className="w-5 h-5" />
                </button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default ProjectLab;
