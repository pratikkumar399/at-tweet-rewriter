import { Mood, MoodOption } from './types';

export const MOOD_OPTIONS: MoodOption[] = [
  { 
    id: Mood.PROFESSIONAL, 
    label: 'Professional', 
    emoji: '💼', 
    description: 'Polite, corporate, and clean.',
    color: 'bg-white text-solarized-base01 border-solarized-base00/40 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
  },
  { 
    id: Mood.FUNNY, 
    label: 'Funny', 
    emoji: '😂', 
    description: 'Witty, humorous, and engaging.',
    color: 'bg-white text-solarized-yellow border-solarized-yellow/40 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700/50'
  },
  { 
    id: Mood.ANGRY, 
    label: 'Angry', 
    emoji: '😤', 
    description: 'Furious, ranting, and intense.',
    color: 'bg-white text-solarized-red border-solarized-red/40 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50'
  },
  { 
    id: Mood.WHOLESOME, 
    label: 'Wholesome', 
    emoji: '🥰', 
    description: 'Kind, uplifting, and positive.',
    color: 'bg-white text-solarized-green border-solarized-green/40 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50'
  },
  { 
    id: Mood.SARCASTIC, 
    label: 'Sarcastic', 
    emoji: '😒', 
    description: 'Dry, biting, and ironic.',
    color: 'bg-white text-solarized-violet border-solarized-violet/40 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700/50'
  },
  { 
    id: Mood.GEN_Z, 
    label: 'Gen Z', 
    emoji: '💀', 
    description: 'Slang, lowercase, and vibes.',
    color: 'bg-white text-solarized-magenta border-solarized-magenta/40 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-700/50'
  },
  { 
    id: Mood.PIRATE, 
    label: 'Pirate', 
    emoji: '🏴‍☠️', 
    description: 'Yarrr, matey!',
    color: 'bg-white text-solarized-orange border-solarized-orange/40 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50'
  },
  { 
    id: Mood.POETIC, 
    label: 'Poetic', 
    emoji: '📜', 
    description: 'Flowery, rhyming, and deep.',
    color: 'bg-white text-solarized-cyan border-solarized-cyan/40 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-700/50'
  }
];

export const CHARACTER_LIMIT_SINGLE = 280;
export const CHARACTER_LIMIT_THREAD = 2000; // Arbitrary limit for inputting a full thread draft