
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, BrainCircuit, Lightbulb } from 'lucide-react';
import { getMentorAdvice } from '../services/geminiService';
import { Message, StudentProfile } from '../types';

interface MentorChatProps {
  profile: StudentProfile;
}

const MentorChat: React.FC<MentorChatProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Welcome, ${profile.name.split(' ')[0]}. As your mentor for your ${profile.stage} stage, I'm here to remove the "What should I do?" confusion. Ask me for a single clear direction.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getMentorAdvice(messages.map(m => ({role: m.role, content: m.content})), input, profile);
      setMessages(prev => [...prev, { role: 'model', content: response || "I'm analyzing the best next step for your stage." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "Connection lost. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col glass-effect rounded-[50px] shadow-2xl shadow-slate-200 overflow-hidden border border-white border-opacity-40">
      {/* Header - Stage Aware & Decision Support */}
      <div className="bg-white/60 border-b border-slate-100 p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-100">
            <BrainCircuit className="text-white w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">Mentor Lumina</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{profile.stage} Guidance System</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end">
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Current Principle</span>
           <div className="flex items-center gap-2 text-slate-900 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
             <Lightbulb className="w-4 h-4 text-amber-500" />
             <span>Decision Fatigue Reduction</span>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-slate-900' : 'bg-white border border-slate-100'
            }`}>
              {msg.role === 'user' ? <User className="text-white w-6 h-6" /> : <Bot className="text-indigo-600 w-6 h-6" />}
            </div>
            <div className={`max-w-[75%] p-6 rounded-[30px] shadow-sm text-sm leading-relaxed font-medium ${
              msg.role === 'user' 
              ? 'bg-slate-900 text-white rounded-tr-none' 
              : 'bg-white border border-slate-50 text-slate-800 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-5">
            <div className="w-12 h-12 rounded-[18px] bg-white border border-slate-100 flex items-center justify-center shrink-0">
              <Bot className="text-indigo-600 w-6 h-6" />
            </div>
            <div className="bg-white border border-slate-50 p-6 rounded-[30px] rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white/40 border-t border-slate-100 backdrop-blur-md">
        <div className="relative flex items-center max-w-3xl mx-auto">
          <input 
            type="text" 
            placeholder="Ask for the 'next best step'..." 
            className="w-full pl-8 pr-16 py-6 rounded-[30px] bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
