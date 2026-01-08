
import React, { useState, useEffect } from 'react';
import { BookMarked, Sparkles, Brain, FileText, CheckCircle, ChevronRight, Loader2, AlertCircle, HelpCircle, RefreshCcw, ArrowRight, PlayCircle } from 'lucide-react';
import { LearningPath, StudentProfile, Milestone } from '../types';
import { generatePracticeExam, generateCustomNotes, generateMindMap } from '../services/geminiService';
import { CopyButton } from './ui/copy-button';

interface StudyArenaProps {
  profile: StudentProfile;
  currentPath: LearningPath | null;
  onUpdateMilestone: (pathId: string, milestoneId: string, updates: Partial<Milestone>) => void;
}

const StudyArena: React.FC<StudyArenaProps> = ({ profile, currentPath, onUpdateMilestone }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'exam' | 'map'>('notes');
  const [loading, setLoading] = useState(false);
  
  const currentMilestone = currentPath?.milestones?.find(m => m.status === 'current');
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setSelectedAnswers({});
    setShowResults(false);
    // Auto-detect the best next step based on what's missing
    if (currentMilestone) {
      if (!currentMilestone.notes) setActiveTab('notes');
      else if (!currentMilestone.mindMap) setActiveTab('map');
      else setActiveTab('exam');
    }
  }, [currentMilestone?.id]);

  const handleAction = async (type: typeof activeTab) => {
    if (!currentMilestone || !currentPath) return;
    setLoading(true);
    try {
      if (type === 'exam') {
        const res = await generatePracticeExam(currentMilestone.title);
        onUpdateMilestone(currentPath.id, currentMilestone.id, { exam: res });
      } else if (type === 'notes') {
        const res = await generateCustomNotes(currentMilestone.title, profile);
        onUpdateMilestone(currentPath.id, currentMilestone.id, { notes: res });
      } else if (type === 'map') {
        const res = await generateMindMap(currentMilestone.title);
        onUpdateMilestone(currentPath.id, currentMilestone.id, { mindMap: res });
      }
    } catch (e) {
      console.error(e);
      alert("Neural link interrupted. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  if (!currentPath || !currentMilestone) return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[40px] flex items-center justify-center mb-8 shadow-inner">
        <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Arena Locked</h2>
      <p className="text-slate-500 max-w-sm font-medium leading-relaxed">Activate a learning roadmap and set a phase to 'Current' to enable the neural study tools.</p>
    </div>
  );

  const steps = [
    { id: 'notes', label: '1. Digest', icon: FileText, completed: !!currentMilestone.notes },
    { id: 'map', label: '2. Visualize', icon: Brain, completed: !!currentMilestone.mindMap },
    { id: 'exam', label: '3. Validate', icon: HelpCircle, completed: !!currentMilestone.exam },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Learning Circuit v2.0</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Study Arena</h1>
          <p className="text-slate-500 font-bold text-lg mt-2">Active Phase: <span className="text-indigo-600 dark:text-indigo-400">{currentMilestone.title}</span></p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-inner">
          {steps.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-6 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive 
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xl' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${t.completed && !isActive ? 'text-emerald-500' : ''}`} /> 
                {t.label}
                {t.completed && <CheckCircle className="w-3 h-3 text-emerald-500 ml-1" />}
              </button>
            )
          })}
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-[60px] p-8 lg:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl min-h-[600px] relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
            <div className="relative mb-8">
              <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <p className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.4em] animate-pulse">Consulting Neural Core...</p>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'notes' && (
            <div className="max-w-4xl mx-auto">
              {!currentMilestone.notes ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[40px] flex items-center justify-center mx-auto mb-8">
                    <FileText className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Step 1: Digest the Concepts</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                    Lumina will synthesize a high-density summary specifically for your level.
                  </p>
                  <button onClick={() => handleAction('notes')} className="group bg-indigo-600 text-white px-12 py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto">
                    Start Synthesis <PlayCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-10">
                    <div className="space-y-4">
                      <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{currentMilestone.notes.title}</h2>
                      <div className="flex flex-wrap gap-3">
                        {currentMilestone.notes.concepts?.map(c => (
                          <span key={c} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CopyButton text={`${currentMilestone.notes.title}\n\n${currentMilestone.notes.content}`} className="p-4" />
                      <button onClick={() => handleAction('notes')} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all" title="Regenerate"><RefreshCcw className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="prose prose-slate dark:prose-invert prose-xl max-w-none">
                    <div className="text-slate-800 dark:text-slate-200 font-medium leading-[1.8] whitespace-pre-wrap font-serif text-xl tracking-tight">
                      {currentMilestone.notes.content}
                    </div>
                  </div>
                  <div className="pt-12 flex justify-center">
                    <button 
                      onClick={() => setActiveTab('map')}
                      className="flex items-center gap-3 bg-slate-900 dark:bg-indigo-600 text-white font-black px-12 py-6 rounded-[32px] shadow-2xl hover:scale-105 transition-all"
                    >
                      Continue to Visualization <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'map' && (
            <div className="max-w-5xl mx-auto">
              {!currentMilestone.mindMap ? (
                 <div className="text-center py-20">
                  <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-[40px] flex items-center justify-center mx-auto mb-8">
                    <Brain className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Step 2: Map the Logic</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                    Convert raw information into a mental model of dependencies.
                  </p>
                  <button onClick={() => handleAction('map')} className="group bg-purple-600 text-white px-12 py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto">
                    Generate Map <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="py-10">
                  <div className="flex justify-between items-center mb-16">
                     <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Knowledge Topology</h2>
                     <button onClick={() => handleAction('map')} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm"><RefreshCcw className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-col items-center gap-20 relative mb-12">
                     <div className="absolute top-20 bottom-0 w-1 bg-gradient-to-b from-slate-200 via-slate-100 to-transparent dark:from-slate-700 dark:via-slate-800 dark:to-transparent left-1/2 -translate-x-1/2 -z-10 rounded-full"></div>
                     <div className="bg-slate-900 dark:bg-indigo-600 text-white px-16 py-10 rounded-[50px] font-black text-3xl shadow-3xl relative z-10 border-8 border-white dark:border-slate-800 ring-4 ring-indigo-50 dark:ring-indigo-900/20">
                        {currentMilestone.mindMap.label}
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
                        {currentMilestone.mindMap.children?.map((child, i) => (
                           <div key={i} className="flex flex-col gap-8 items-center animate-in zoom-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                              <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-8 rounded-[40px] font-black text-xl text-center shadow-2xl relative w-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group dark:text-white">
                                 {child.label}
                                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-12 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                              </div>
                              <div className="flex flex-col gap-4 w-[90%]">
                                 {child.children?.map((sub, si) => (
                                    <div key={si} className="bg-slate-50 dark:bg-slate-800 p-5 rounded-[24px] text-xs font-black text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-300 hover:shadow-xl transition-all text-center">
                                       {sub.label}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="pt-12 flex justify-center">
                    <button 
                      onClick={() => setActiveTab('exam')}
                      className="flex items-center gap-3 bg-slate-900 dark:bg-indigo-600 text-white font-black px-12 py-6 rounded-[32px] shadow-2xl hover:scale-105 transition-all"
                    >
                      Final Proficiency Test <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'exam' && (
            <div className="max-w-3xl mx-auto">
              {!currentMilestone.exam ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-[40px] flex items-center justify-center mx-auto mb-8">
                    <HelpCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Step 3: Prove Proficiency</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium text-lg">
                    Check your comprehension with AI-generated pressure-tests.
                  </p>
                  <button onClick={() => handleAction('exam')} className="group bg-emerald-600 text-white px-12 py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto">
                    Start Assessment <CheckCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-16 pb-10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Diagnostic Session</h3>
                    <button onClick={() => handleAction('exam')} className="text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Reset Exam</button>
                  </div>
                  {currentMilestone.exam.map((q, idx) => (
                    <div key={idx} className="space-y-8 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="flex items-start gap-6">
                        <span className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-lg">0{idx+1}</span>
                        <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight">{q.question}</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-4 pl-16">
                        {q.options?.map((opt, oIdx) => (
                          <button 
                            key={oIdx}
                            onClick={() => !showResults && setSelectedAnswers({...selectedAnswers, [idx]: oIdx})}
                            className={`p-6 rounded-[32px] text-left font-bold transition-all border-2 text-lg ${
                              showResults 
                              ? oIdx === q.correctAnswer 
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-md scale-[1.02]' 
                                : selectedAnswers[idx] === oIdx 
                                  ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-900 dark:text-rose-300 opacity-80' 
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50 grayscale scale-[0.98]'
                              : selectedAnswers[idx] === oIdx 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl translate-x-2' 
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 translate-x-0 dark:text-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {showResults && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[40px] border border-slate-200 dark:border-slate-700 ml-16 text-sm font-bold text-slate-600 dark:text-slate-400 animate-in zoom-in-95 duration-500 group relative">
                           <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <CopyButton text={q.explanation} />
                           </div>
                           <p className="text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-widest text-[10px] font-black flex items-center gap-2"><Sparkles className="w-4 h-4" /> Neural Analysis</p>
                           <p className="text-lg leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {!showResults ? (
                    <button 
                      onClick={() => setShowResults(true)}
                      className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-8 rounded-[40px] font-black text-xl shadow-2xl active:scale-95 transition-all mt-10 uppercase tracking-tighter"
                    >
                      Check My Logic
                    </button>
                  ) : (
                    <div className="text-center pt-8">
                       <p className="text-slate-500 font-bold mb-6 italic">Simulation Complete. You've processed all neural checkpoints for this phase.</p>
                       <button onClick={() => setActiveTab('notes')} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Review Synthesis</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyArena;
