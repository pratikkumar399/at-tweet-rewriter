import React, { useState } from 'react';
import { Copy, Check, Share2, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { Mood } from '../types';

interface ResultCardProps {
  content: string;
  mood: Mood;
  index?: number; // If part of a thread
  total?: number; // Total tweets in thread
}

export const ResultCard: React.FC<ResultCardProps> = ({ content, mood, index, total }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isThreadPart = index !== undefined && total !== undefined;
  const randomLikes = Math.floor(Math.random() * 500) + 10;
  const randomRetweets = Math.floor(Math.random() * 50) + 1;

  return (
    <div className="group relative bg-solarized-base2 dark:bg-zinc-900 rounded-2xl border border-solarized-base00/30 dark:border-zinc-800 shadow-sm hover:shadow-md dark:hover:shadow-zinc-900/50 hover:border-solarized-base00/50 dark:hover:border-zinc-700 transition-all duration-300 overflow-hidden">
      
      {/* Copy Button overlay - visible on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button 
          onClick={handleCopy}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all shadow-sm
            ${copied 
              ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20' 
              : 'bg-white/60 dark:bg-black/50 text-slate-800 dark:text-slate-300 border border-solarized-base00/20 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800'
            }
          `}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-zinc-700 dark:to-zinc-600 flex-shrink-0 overflow-hidden ring-2 ring-white dark:ring-black border border-solarized-base00/10">
             <img src={`https://picsum.photos/seed/${mood}/200/200`} alt="Avatar" className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-black dark:text-white text-[15px]">You</span>
              <span className="text-slate-600 dark:text-slate-500 text-sm truncate">@{mood.toLowerCase().replace(/\s/g, '')}_mode</span>
              {isThreadPart && (
                <span className="ml-auto text-[10px] font-bold tracking-wide text-slate-600 dark:text-slate-600 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded-md border border-solarized-base00/10 dark:border-transparent">
                   {index! + 1} / {total}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-[16px] leading-relaxed text-slate-900 dark:text-slate-200 whitespace-pre-wrap font-normal">
          {content}
        </p>

        {/* Footer Metrics (Fake) */}
        <div className="mt-4 pt-4 border-t border-solarized-base00/10 dark:border-zinc-800/50 flex items-center justify-between text-slate-600 dark:text-zinc-600">
          <button className="flex items-center gap-1.5 group/icon hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
            <MessageCircle size={18} className="group-hover/icon:bg-blue-500/10 p-0.5 rounded-full box-content" />
            <span className="text-xs">{Math.floor(randomRetweets / 2)}</span>
          </button>
          <button className="flex items-center gap-1.5 group/icon hover:text-green-600 dark:hover:text-green-500 transition-colors">
            <Repeat2 size={18} className="group-hover/icon:bg-green-500/10 p-0.5 rounded-full box-content" />
            <span className="text-xs">{randomRetweets}</span>
          </button>
          <button className="flex items-center gap-1.5 group/icon hover:text-pink-600 dark:hover:text-pink-500 transition-colors">
            <Heart size={18} className="group-hover/icon:bg-pink-500/10 p-0.5 rounded-full box-content" />
            <span className="text-xs">{randomLikes}</span>
          </button>
          <button className="flex items-center gap-1.5 group/icon hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <Share2 size={18} className="group-hover/icon:bg-blue-400/10 p-0.5 rounded-full box-content" />
          </button>
        </div>
      </div>
    </div>
  );
};