
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, BrainCircuit, Loader2, Volume2, X } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { StudentProfile } from '../types';
import { encodeBase64, decodeBase64, decodeAudioData } from '../services/geminiService';

const LiveConversation: React.FC<{ profile: StudentProfile, onClose: () => void }> = ({ profile, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const startSession = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encodeBase64(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setLoading(false);
            setIsActive(true);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioB64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioB64) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioB64), outputCtx);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
                sourcesRef.current.delete(s);
              });
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => {
            console.error("Live API Error:", e);
            setLoading(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are Lumina. A real-time voice mentor for ${profile.name}. Stage: ${profile.stage}. Be human, quick, and conversational.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      sessionRef.current?.close();
      sourcesRef.current.forEach(s => {
        try { s.stop(); } catch (e) {}
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full glass-effect bg-white/10 border-white/20 p-12 rounded-[60px] text-center relative overflow-hidden shadow-3xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X className="w-8 h-8" /></button>
        
        <div className={`w-32 h-32 rounded-[50px] mx-auto mb-10 flex items-center justify-center shadow-3xl transition-all duration-700 ${isActive ? 'bg-indigo-600 scale-110 shadow-indigo-500/50' : 'bg-white/10'}`}>
          {loading ? <Loader2 className="w-12 h-12 text-white animate-spin" /> : 
           isActive ? <Volume2 className="w-12 h-12 text-white animate-bounce" /> : 
           <BrainCircuit className="w-12 h-12 text-white/40" />}
        </div>

        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Voice Sync Session</h2>
        <p className="text-white/60 mb-10 font-medium">Have a natural, low-latency conversation with Lumina. Perfect for deep conceptual brainstorming.</p>

        {!isActive ? (
          <button 
            onClick={startSession}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-black py-6 rounded-[30px] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            <Mic className="w-6 h-6" /> Initialize Audio Sync
          </button>
        ) : (
          <button 
            onClick={() => { sessionRef.current?.close(); onClose(); }}
            className="w-full bg-rose-600 text-white font-black py-6 rounded-[30px] shadow-2xl hover:bg-rose-700 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <MicOff className="w-6 h-6" /> End Sync Session
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveConversation;
