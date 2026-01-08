
import React, { useState } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon, Maximize, Layout } from 'lucide-react';
import { generateVisionImage } from '../services/geminiService';

const Visualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ratios = ["1:1", "16:9", "9:16", "4:3", "3:4", "2:3", "3:2", "21:9"];

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const url = await generateVisionImage(prompt, aspectRatio);
      setImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-amber-500 mb-2">
          <Sparkles className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Goal Visualization Engine</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Manifest Your Future</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-slate-100 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vision Description</label>
              <textarea 
                className="w-full h-32 p-6 rounded-[30px] bg-slate-50 border-none font-bold text-slate-700 resize-none outline-none focus:ring-4 focus:ring-amber-500/5 transition-all"
                placeholder="e.g. A futuristic workspace where I'm mastering quantum computing..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Layout className="w-3 h-3" /> Cinematic Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-3">
                {ratios.map(r => (
                  <button 
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`py-3 rounded-2xl font-black text-[10px] border transition-all ${aspectRatio === r ? 'bg-amber-500 text-white border-amber-400 shadow-lg' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full bg-slate-900 text-white font-black py-6 rounded-[30px] shadow-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 text-amber-400" />}
              {loading ? 'Manifesting Image...' : 'Synthesize Vision'}
            </button>
          </div>
        </div>

        <div className="relative">
          {image ? (
            <div className="group relative rounded-[50px] overflow-hidden shadow-3xl border-8 border-white animate-in zoom-in-95 duration-700">
               <img src={image} className="w-full h-auto object-cover" />
               <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={image} download="vision.png" className="bg-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform"><Download className="w-6 h-6 text-slate-900" /></a>
                  <button onClick={() => window.open(image)} className="bg-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform"><Maximize className="w-6 h-6 text-slate-900" /></button>
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-4 border-dashed border-slate-200 rounded-[60px] flex flex-col items-center justify-center text-slate-300 gap-4">
               <ImageIcon className="w-16 h-16 opacity-20" />
               <p className="font-black text-xs uppercase tracking-widest">Awaiting Manifestation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
