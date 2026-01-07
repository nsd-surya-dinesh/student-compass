
import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, Lock, ArrowRight, ShieldAlert, CircleDot } from 'lucide-react';
import { generateLearningPath } from '../services/geminiService';
import { LearningPath, Milestone, StudentProfile } from '../types';

interface PathBuilderProps {
  profile: StudentProfile;
  currentPath: LearningPath | null;
  setCurrentPath: (path: LearningPath) => void;
}

const PathBuilder: React.FC<PathBuilderProps> = ({ profile, currentPath, setCurrentPath }) => {
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const path = await generateLearningPath(subject, profile);
      setCurrentPath(path);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentPath) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center animate-in zoom-in-95 duration-500">
        <div className="inline-flex p-5 bg-green-100 rounded-[40px] mb-8">
          <Sparkles className="text-green-600 w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Stage-Aware Planning</h2>
        <p className="text-slate-500 mb-12 max-w-lg mx-auto text-lg">
          Lumina creates different guidance for each student based on your <b>{profile.stage}</b> stage and <b>{profile.skillLevel}</b> skills.
        </p>
        
        <div className="bg-white p-10 rounded-[50px] shadow-2xl shadow-slate-200 border border-slate-100 max-w-xl mx-auto space-y-8">
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Topic of Focus</label>
            <input 
              type="text" 
              placeholder="e.g. User Experience Design" 
              className="w-full px-6 py-5 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-green-500 transition-all text-lg font-medium"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading || !subject}
            className="w-full bg-green-600 text-white font-black py-5 rounded-[30px] hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-6 h-6" />}
            {loading ? 'Designing Your Path...' : 'Generate Roadmap'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-12 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-bold uppercase tracking-widest">Personalized Path: {profile.stage}</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{currentPath.subject}</h2>
        </div>
        <button 
          onClick={() => {if(confirm('Clear current path?')) setCurrentPath(null as any)}}
          className="text-xs font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
        >
          Reset Path
        </button>
      </header>

      <div className="space-y-8 relative">
        {currentPath.milestones.map((m, idx) => (
          <ActionMilestoneCard key={m.id} milestone={m} index={idx} total={currentPath.milestones.length} />
        ))}
      </div>
    </div>
  );
};

interface ActionMilestoneCardProps {
  milestone: Milestone;
  index: number;
  total: number;
}

// Fixed: Explicitly define props interface and use React.FC to handle special props like 'key' correctly in TypeScript
const ActionMilestoneCard: React.FC<ActionMilestoneCardProps> = ({ milestone, index, total }) => {
  const isCurrent = milestone.status === 'current';
  const isCompleted = milestone.status === 'completed';
  const isLocked = milestone.status === 'locked';

  return (
    <div className={`flex gap-8 group ${isLocked ? 'opacity-40 grayscale' : ''}`}>
      <div className="flex flex-col items-center">
        <div className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all duration-500 ${
          isCompleted ? 'bg-green-500 text-white' : 
          isCurrent ? 'bg-slate-900 text-white scale-110 shadow-xl' : 
          'bg-slate-100 text-slate-400'
        }`}>
          {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : 
           isCurrent ? <CircleDot className="w-8 h-8 animate-pulse" /> : 
           <Lock className="w-6 h-6" />}
        </div>
        {index < total - 1 && <div className="w-1 h-24 bg-slate-100 my-4 rounded-full"></div>}
      </div>

      <div className={`flex-1 p-8 rounded-[40px] transition-all duration-500 ${
        isCurrent ? 'bg-white border-2 border-slate-900 shadow-2xl' : 'bg-slate-50 border-2 border-transparent'
      }`}>
        <h3 className="text-2xl font-black text-slate-900 mb-2">{milestone.title}</h3>
        <p className="text-slate-500 mb-6 leading-relaxed">{milestone.description}</p>

        {isCurrent && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            {/* Simple & Action-Oriented Flow */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Practical Action Steps</p>
              {milestone.practicalActions.map((action, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-100">{i+1}</div>
                  <span className="text-sm font-bold text-slate-700">{action}</span>
                </div>
              ))}
            </div>

            {/* Preventive Guidance System */}
            {milestone.preventiveAdvice && (
              <div className="bg-rose-50 p-6 rounded-[30px] border border-rose-100 flex gap-4">
                <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
                <div>
                  <p className="text-xs font-black text-rose-900 uppercase tracking-widest mb-1">Preventive Insight</p>
                  <p className="text-sm text-rose-800 leading-relaxed font-medium">{milestone.preventiveAdvice}</p>
                </div>
              </div>
            )}

            <button className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
              Complete Action Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PathBuilder;
