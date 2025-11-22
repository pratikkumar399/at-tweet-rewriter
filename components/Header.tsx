import React from 'react';
import { Twitter, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 pointer-events-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 backdrop-blur-xl bg-white/70 dark:bg-black/40 p-2 pr-5 rounded-full border border-solarized-base00/20 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
          <div className="bg-brand-600 p-2 rounded-full text-white shadow-lg shadow-brand-500/30">
            <Twitter size={20} fill="currentColor" className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-solarized-base02 dark:text-white">
            MoodTweet
          </h1>
        </div>
        
        <button
          onClick={toggleTheme}
          className="group p-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-solarized-base00/20 dark:border-zinc-800 text-solarized-base01 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-900 hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md hover:shadow-brand-500/10"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun size={20} className="transition-transform duration-500 rotate-0 group-hover:rotate-90" />
          ) : (
            <Moon size={20} className="transition-transform duration-500 rotate-0 group-hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
};