import React, { useCallback } from 'react';
import { CHARACTER_LIMIT_SINGLE, CHARACTER_LIMIT_THREAD } from '../constants';
import { RewriteMode } from '../types';
import { Layers, MessageCircle } from 'lucide-react';

interface TweetInputProps {
  value: string;
  onChange: (value: string) => void;
  mode: RewriteMode;
  onModeChange: (mode: RewriteMode) => void;
  isLoading: boolean;
}

export const TweetInput: React.FC<TweetInputProps> = ({ 
  value, 
  onChange, 
  mode, 
  onModeChange,
  isLoading 
}) => {
  const limit = mode === 'single' ? CHARACTER_LIMIT_SINGLE : CHARACTER_LIMIT_THREAD;
  const charCount = value.length;
  const isOverLimit = charCount > limit;
  
  const handleModeSwitch = useCallback((newMode: RewriteMode) => {
    onModeChange(newMode);
  }, [onModeChange]);

  return (
    <div className="relative group">
      {/* Glowing border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-30 dark:group-focus-within:opacity-50 transition duration-500 blur-md"></div>
      
      <div className="relative bg-solarized-base2 dark:bg-zinc-900 rounded-2xl border border-solarized-base00/30 dark:border-zinc-800 shadow-sm transition-all overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-solarized-base00/10 dark:border-zinc-800/50 bg-solarized-base1/10 dark:bg-zinc-900/80 backdrop-blur-sm">
            <div className="flex p-1 bg-white/50 dark:bg-zinc-800/80 rounded-xl border border-solarized-base00/10 dark:border-zinc-700/50">
              <button
                onClick={() => handleModeSwitch('single')}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                  ${mode === 'single' 
                    ? 'bg-white dark:bg-zinc-700 text-brand-600 dark:text-white shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-zinc-700/50'
                  }
                `}
              >
                <MessageCircle size={12} />
                Single
              </button>
              <button
                onClick={() => handleModeSwitch('thread')}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                  ${mode === 'thread' 
                    ? 'bg-white dark:bg-zinc-700 text-brand-600 dark:text-white shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-zinc-700/50'
                  }
                `}
              >
                <Layers size={12} />
                Thread
              </button>
            </div>
            
            <span className={`text-xs font-medium transition-colors px-2 py-1 rounded-md ${isOverLimit ? 'text-red-600 bg-red-100 dark:bg-red-900/20' : 'text-slate-600 dark:text-slate-400'}`}>
              {charCount}/{limit}
            </span>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={mode === 'single' 
            ? "Paste your draft here..." 
            : "Paste your long thoughts here..."
          }
          className={`
            w-full min-h-[160px] p-5 bg-transparent text-lg text-black dark:text-slate-100 placeholder-solarized-base00/70 dark:placeholder-zinc-600
            focus:outline-none resize-none leading-relaxed selection:bg-brand-100 dark:selection:bg-brand-900
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};