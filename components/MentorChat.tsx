
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, BrainCircuit, Lightbulb, Image as ImageIcon, Brain, Volume2, Loader2, X, MessageCircle, HelpCircle, Code, Zap } from 'lucide-react';
import { getMentorAdviceStream, generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';
import { Message, StudentProfile } from '../types';
import { Loading } from './ui/circle-unique-load';
import { CopyButton } from './ui/copy-button';

interface MentorChatProps {
  profile: StudentProfile;
}

const MentorChat: React.FC<MentorChatProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Greetings, ${profile.name.split(' ')[0]}. I'm Architect Lumina. I can analyze diagrams, explain complex math, or help you brainstorm projects. What's on your mind?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const neuralShortcuts = [
    { label: "Explain simply", icon: HelpCircle, prompt: "Can you explain this like I'm 5?" },
    { label: "Give an example", icon: Lightbulb, prompt: "Can you provide a real-world example of this concept?" },
    { label: "Analyze my logic", icon: Brain, prompt: "I'm thinking about it this way: [Your Thought]. Is my logic sound?" },
    { label: "Code snippet", icon: Code, prompt: "Can you provide a simple code example for this?" }
  ];

  const handleShortcut = (prompt: string) => {
    setInput(prompt);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const speakText = async (text: string) => {
    if (speaking === text) return;
    try {
      setSpeaking(text);
      const audioB64 = await generateSpeech(text);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = await decodeAudioData(decodeBase64(audioB64), ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setSpeaking(null);
      source.start();
    } catch (err) {
      console.error(err);
      setSpeaking(null);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() && !selectedImage) return;
    if (loading) return;

    const b64 = selectedImage ? selectedImage.split(',')[1] : undefined;
    const userMsg: Message = { role: 'user', content: messageText || "Analyze this image." };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'model', content: '' }]);
      
      const stream = getMentorAdviceStream(userMsg.content, profile, b64, isThinking);
      let fullResponse = "";

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = { role: 'model', content: fullResponse };
          return updated;
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Sync failed. Retry required." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col glass-effect dark:bg-slate-900/60 rounded-[50px] shadow-3xl overflow-hidden border border-white dark:border-slate-800 border-opacity-40 relative">
      <div className="bg-white/60 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center shadow-2xl shadow-indigo-200">
            <BrainCircuit className="text-white w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">Architect Lumina</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Link v3.0</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsThinking(!isThinking)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isThinking ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            <Brain className="w-4 h-4" /> {isThinking ? 'Deep Thinking ON' : 'Thinking Off'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
            }`}>
              {msg.role === 'user' ? <User className="text-white w-6 h-6" /> : <Bot className="text-indigo-600 w-6 h-6" />}
            </div>
            <div className={`max-w-[80%] p-6 rounded-[32px] shadow-sm text-sm leading-relaxed font-medium group relative ${
              msg.role === 'user' 
              ? 'bg-slate-900 text-white rounded-tr-none' 
              : 'bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none min-h-[50px]'
            }`}>
              {msg.content === "" && msg.role === "model" ? (
                <div className="scale-50 origin-left">
                  <Loading screenHFull={false} />
                </div>
              ) : (
                msg.content
              )}
              {msg.role === 'model' && msg.content !== "" && (
                <div className="absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => speakText(msg.content)}
                    className={`p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition-colors ${speaking === msg.content ? 'text-indigo-600' : 'text-slate-300'}`}
                  >
                    <Volume2 className={`w-4 h-4 ${speaking === msg.content ? 'animate-pulse' : ''}`} />
                  </button>
                  <CopyButton text={msg.content} className="bg-white dark:bg-slate-800" />
                </div>
              )}
              {msg.role === 'user' && (
                <CopyButton text={msg.content} className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800" />
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-8 bg-white/40 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 backdrop-blur-md">
        {messages.length === 1 && (
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 animate-in slide-in-from-bottom-4 duration-500">
            {neuralShortcuts.map((shortcut, i) => (
              <button 
                key={i}
                onClick={() => handleShortcut(shortcut.prompt)}
                className="p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 text-left hover:border-indigo-600 dark:hover:border-indigo-500 hover:shadow-lg transition-all group"
              >
                <shortcut.icon className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{shortcut.label}</span>
              </button>
            ))}
          </div>
        )}

        {selectedImage && (
          <div className="mb-4 relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
             <img src={selectedImage} className="w-full h-full object-cover" />
             <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full"><X className="w-4 h-4" /></button>
          </div>
        )}
        
        <div className="relative flex items-center gap-4 max-w-3xl mx-auto">
          <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageSelect} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-[22px] flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-inner"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <input 
            type="text" 
            placeholder={isThinking ? "Consulting all available knowledge..." : "Type your query or use a Neural Shortcut..."}
            className="flex-1 pl-8 pr-16 py-6 rounded-[32px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all font-bold text-slate-700 dark:text-slate-200 shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || loading}
            className="absolute right-2 w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 disabled:opacity-50 active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
