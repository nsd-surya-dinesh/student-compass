
import React from 'react';
import { Globe, ArrowUpRight, Search, Users, ExternalLink, Sparkles } from 'lucide-react';
import { StudentProfile, LearningPath } from '../types';
import { useNavigate } from 'react-router-dom';

interface CommunityProps {
  profile: StudentProfile;
  setCurrentPath: (path: LearningPath) => void;
}

const Community: React.FC<CommunityProps> = ({ profile, setCurrentPath }) => {
  const navigate = useNavigate();
  const posts = [
    { id: '1', author: 'Sarah J.', stage: 'Senior', topic: 'Ethical Hacking Foundations', progress: 85, tags: ['Cybersecurity', 'Python'] },
    { id: '2', author: 'Mark T.', stage: 'Sophomore', topic: 'UX/UI for EdTech', progress: 30, tags: ['Design', 'Case Study'] },
    { id: '3', author: 'Elena R.', stage: 'Career Changer', topic: 'Data Analytics with SQL', progress: 60, tags: ['Data', 'Career'] },
    { id: '4', author: 'Jamie K.', stage: 'Junior', topic: 'Mobile App with React Native', progress: 45, tags: ['Mobile', 'JS'] },
  ];

  const adoptRoadmap = (topic: string) => {
    // Generate a mock roadmap for the community topic
    const mockPath: LearningPath = {
      id: Math.random().toString(36).substr(2, 9),
      subject: topic,
      goal: "Community inspired goal",
      stage: profile.stage,
      isPublic: true,
      milestones: [
        { id: 'm1', title: 'Community Intro', description: 'Start with peer-recommended basics', status: 'current', practicalActions: ['Review shared notes', 'Join Discord group'] },
        { id: 'm2', title: 'Deep Dive', description: 'Advanced concepts shared by the author', status: 'locked', practicalActions: ['Follow Github repo'] }
      ]
    };
    setCurrentPath(mockPath);
    navigate('/path');
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-indigo-600 mb-2">
          <Globe className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Global Inspiration Feed</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Discover What Others Learn</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input type="text" placeholder="Search topics (e.g. AI, Music, Dev)" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
           </div>
           <div className="flex gap-2">
             <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">All Levels</button>
             <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Similar Stages</button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="glass-effect p-8 rounded-[40px] border border-slate-100 hover:translate-y-[-4px] transition-all group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-100/20">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-black text-indigo-600">{post.author[0]}</div>
                   <div>
                      <p className="text-sm font-black text-slate-800 leading-none mb-1">{post.author}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.stage}</p>
                   </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
             </div>
             
             <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{post.topic}</h3>
             
             <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-lg uppercase tracking-widest">#{tag}</span>
                ))}
             </div>

             <div className="space-y-2 mb-8">
                <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                   <span>Author Progress</span>
                   <span>{post.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${post.progress}%` }}></div>
                </div>
             </div>

             <button 
               onClick={(e) => { e.stopPropagation(); adoptRoadmap(post.topic); }}
               className="w-full mt-auto bg-slate-50 text-slate-600 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all group/btn active:scale-95"
             >
                Adopt Roadmap <Sparkles className="w-4 h-4" />
             </button>
          </div>
        ))}

        <div className="bg-slate-900 p-8 rounded-[40px] flex flex-col justify-center text-white relative overflow-hidden">
           <Users className="w-12 h-12 text-indigo-400 mb-4" />
           <h3 className="text-2xl font-black mb-4 tracking-tight">Your growth, shared.</h3>
           <p className="text-slate-400 text-sm leading-relaxed mb-6">Once you complete a milestone in your path, use the "Share Progress" button to inspire others.</p>
           <button 
             onClick={() => navigate('/path')}
             className="bg-white text-slate-900 font-bold py-3 px-6 rounded-2xl self-start hover:scale-105 transition-transform active:scale-95"
           >
             Share My Progress
           </button>
           <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-600/20 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Community;
