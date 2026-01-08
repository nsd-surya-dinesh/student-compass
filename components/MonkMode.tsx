
import React, { useState, useEffect } from 'react';
import { Flame, X, Shield, Clock, Timer, BellOff, VolumeX, Ghost } from 'lucide-react';
import { PulseBeams } from './ui/pulse-beams';

const beams = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["0%", "0%", "200%"], x2: ["0%", "0%", "180%"], y1: ["80%", "0%", "0%"], y2: ["100%", "20%", "20%"] },
      transition: { duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1, delay: 0.5 }
    },
    connectionPoints: [{ cx: 6.5, cy: 398.5, r: 6 }, { cx: 269, cy: 220.5, r: 6 }]
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["20%", "100%", "100%"], x2: ["0%", "90%", "90%"], y1: ["80%", "80%", "-20%"], y2: ["100%", "100%", "0%"] },
      transition: { duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2, delay: 1 }
    },
    connectionPoints: [{ cx: 851, cy: 34, r: 6.5 }, { cx: 568, cy: 200, r: 6 }]
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: { x1: ["40%", "0%", "0%"], x2: ["10%", "0%", "0%"], y1: ["0%", "0%", "180%"], y2: ["20%", "20%", "200%"] },
      transition: { duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 3, delay: 1.5 }
    },
    connectionPoints: [{ cx: 420.5, cy: 6.5, r: 6 }, { cx: 380, cy: 168, r: 6 }]
  }
];

const MonkMode: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    let timer: any;
    if (isActive && !isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("Session Complete. Take a short rest.");
    }
    return () => clearInterval(timer);
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isActive) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-10 animate-in fade-in duration-1000">
        <div className="absolute inset-0 z-0">
          <PulseBeams beams={beams} className="bg-transparent" />
        </div>

        <div className="absolute top-10 left-10 z-10 flex items-center gap-2 text-white/20 uppercase tracking-[0.4em] font-black text-[10px]">
           <Shield className="w-4 h-4" /> Distraction Shield Active
        </div>
        
        <div className="relative z-10 text-[180px] lg:text-[250px] font-black text-white/10 tracking-tighter tabular-nums select-none leading-none">
          {formatTime(timeLeft)}
        </div>

        <div className="relative z-10 space-y-12 text-center mt-[-100px] lg:mt-[-150px]">
           <div className="space-y-4">
             <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter">Deep Flow</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Focus strictly on execution. Distractions are void.</p>
           </div>
           
           <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isPaused ? 'bg-white text-slate-950 scale-110 shadow-2xl shadow-white/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isPaused ? <Timer className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
              </button>
              <button 
                onClick={() => { setIsActive(false); setIsPaused(true); }}
                className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
              >
                <X className="w-8 h-8" />
              </button>
           </div>
        </div>

        <div className="fixed bottom-10 z-10 flex gap-10 opacity-20 group hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
              <BellOff className="w-4 h-4" /> Notifications Void
           </div>
           <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
              <VolumeX className="w-4 h-4" /> Audio Silence
           </div>
           <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
              <Ghost className="w-4 h-4" /> Monk Mode
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 text-center animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-orange-100 rounded-[35px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-orange-100">
        <Flame className="w-12 h-12 text-orange-600" />
      </div>
      <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tighter">Eliminate Distraction</h1>
      <p className="text-slate-500 max-w-lg mx-auto text-xl leading-relaxed mb-16 font-medium">
        Monk Mode activates a minimalist focus chamber. All UI noise is hidden, and your task becomes your entire world.
      </p>

      <div className="bg-white p-10 lg:p-16 rounded-[60px] shadow-3xl border border-slate-100 max-w-xl mx-auto space-y-12">
         <div className="grid grid-cols-2 gap-6">
            <button onClick={() => { setTimeLeft(25*60); setIsActive(true); setIsPaused(false); }} className="p-8 bg-slate-50 rounded-[40px] border-2 border-transparent hover:border-orange-500 hover:bg-white transition-all group">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 group-hover:text-orange-600">Short Deep Focus</span>
               <span className="text-4xl font-black text-slate-900">25:00</span>
            </button>
            <button onClick={() => { setTimeLeft(50*60); setIsActive(true); setIsPaused(false); }} className="p-8 bg-slate-50 rounded-[40px] border-2 border-transparent hover:border-indigo-500 hover:bg-white transition-all group">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 group-hover:text-indigo-600">Heavy Cognitive Load</span>
               <span className="text-4xl font-black text-slate-900">50:00</span>
            </button>
         </div>

         <div className="flex items-center gap-4 p-6 bg-slate-900 text-white rounded-[32px] shadow-2xl">
            <Shield className="w-10 h-10 text-orange-400 shrink-0" />
            <div className="text-left">
               <p className="font-black text-sm mb-1 uppercase tracking-tight">Focus Logic Enabled</p>
               <p className="text-xs text-slate-400 font-bold leading-relaxed">Once active, all Lumina dashboards are hidden to maximize your cognitive bandwidth.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MonkMode;
