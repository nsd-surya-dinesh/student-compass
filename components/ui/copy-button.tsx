
"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton = ({ text, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "p-2 rounded-xl border transition-all duration-200",
        copied 
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
          : "bg-slate-500/5 border-slate-500/10 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/5 hover:border-indigo-500/20",
        className
      )}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};
