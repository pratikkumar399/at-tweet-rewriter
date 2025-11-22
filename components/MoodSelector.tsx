import React from 'react';
import { Mood } from '../types';
import { MOOD_OPTIONS } from '../constants';

interface MoodSelectorProps {
  selectedMood: Mood;
  onSelect: (mood: Mood) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-400">
          Choose your Vibe
        </label>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {MOOD_OPTIONS.map((option) => {
          const isSelected = selectedMood === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`
                group relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out border
                ${isSelected 
                  ? 'bg-solarized-base03 border-solarized-base03 text-white dark:bg-white dark:border-white dark:text-black shadow-lg shadow-solarized-base03/20 dark:shadow-white/10 scale-105 ring-2 ring-offset-2 ring-brand-500/50 dark:ring-offset-black' 
                  : 'bg-solarized-base2 dark:bg-zinc-900/50 border-solarized-base00/30 dark:border-zinc-800 text-slate-900 dark:text-slate-300 hover:border-solarized-base00 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:scale-[1.02] shadow-sm'
                }
              `}
            >
              <span className={`text-base transition-transform duration-300 ${isSelected ? 'scale-110 rotate-6' : 'group-hover:scale-125'}`}>
                {option.emoji}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};