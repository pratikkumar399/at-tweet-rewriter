export enum Mood {
  PROFESSIONAL = 'Professional',
  FUNNY = 'Funny',
  ANGRY = 'Angry',
  WHOLESOME = 'Wholesome',
  SARCASTIC = 'Sarcastic',
  GEN_Z = 'Gen Z',
  PIRATE = 'Pirate',
  POETIC = 'Poetic'
}

export interface GeneratedContent {
  original: string;
  rewritten: string | string[]; // String for single, array for thread ok
  mood: Mood;
  isThread: boolean;
  timestamp: number;
}

export type RewriteMode = 'single' | 'thread';

export interface MoodOption {
  id: Mood;
  label: string;
  emoji: string;
  description: string;
  color: string;
}