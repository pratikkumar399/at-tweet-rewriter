import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { MoodSelector } from './components/MoodSelector';
import { TweetInput } from './components/TweetInput';
import { ResultCard } from './components/ResultCard';
import { Mood, RewriteMode, GeneratedContent } from './types';
import { rewriteSingleTweet, rewriteThread } from './services/geminiService';
import { Wand2, Loader2, AlertCircle, Trash2, Sparkles } from 'lucide-react';
import { MOOD_OPTIONS } from './constants';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>(Mood.FUNNY);
  const [mode, setMode] = useState<RewriteMode>('single');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mouse tracking for spotlight effect
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Theme Management
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (result) setResult(null);
  };

  const handleMoodChange = (mood: Mood) => {
    setSelectedMood(mood);
    if (result) setResult(null);
  };

  const handleModeChange = (newMode: RewriteMode) => {
    setMode(newMode);
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const generateRewrite = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to rewrite.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let rewrittenContent: string | string[];
      
      if (mode === 'single') {
        rewrittenContent = await rewriteSingleTweet(inputText, selectedMood);
      } else {
        rewrittenContent = await rewriteThread(inputText, selectedMood);
      }

      setResult({
        original: inputText,
        rewritten: rewrittenContent,
        mood: selectedMood,
        isThread: mode === 'thread',
        timestamp: Date.now()
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedMood, mode]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full bg-solarized-base3 dark:bg-black relative overflow-x-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500"
      style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
    >
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Mouse Spotlight */}
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: theme === 'dark' 
              ? `radial-gradient(600px circle at var(--x) var(--y), rgba(99, 102, 241, 0.15), transparent 40%)`
              : `radial-gradient(600px circle at var(--x) var(--y), rgba(238, 232, 213, 0.8), transparent 40%)`
          }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.3]"
          style={{
            backgroundImage: theme === 'dark'
              ? `linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)`
              : `linear-gradient(to right, #93a1a1 1px, transparent 1px), linear-gradient(to bottom, #93a1a1 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)"
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Input Column */}
            <div className="lg:col-span-5 space-y-8 sticky top-24">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Rewrite your narrative.
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  Select a mood, paste your thought, and let AI handle the vibe check.
                </p>
              </div>

              <div className="space-y-6">
                <MoodSelector 
                  selectedMood={selectedMood} 
                  onSelect={handleMoodChange} 
                />
                
                <TweetInput 
                  value={inputText}
                  onChange={handleInputChange}
                  mode={mode}
                  onModeChange={handleModeChange}
                  isLoading={isLoading}
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={generateRewrite}
                    disabled={isLoading || !inputText.trim()}
                    className={`
                      group relative flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-white transition-all duration-300 overflow-hidden
                      ${isLoading || !inputText.trim() 
                        ? 'bg-solarized-base2 dark:bg-zinc-800 cursor-not-allowed text-slate-400 dark:text-slate-500' 
                        : 'bg-gradient-to-br from-brand-600 to-indigo-700 hover:from-brand-500 hover:to-indigo-600 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ring-1 ring-white/20'
                      }
                    `}
                  >
                    {/* Button shine effect */}
                    {!isLoading && inputText.trim() && (
                       <div className="absolute inset-0 flex translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    )}

                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Rewriting...
                      </>
                    ) : (
                      <>
                        <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                        Generate {mode === 'single' ? 'Tweet' : 'Thread'}
                      </>
                    )}
                  </button>

                  {inputText && (
                      <button 
                          onClick={handleClear}
                          className="p-4 rounded-full bg-white dark:bg-zinc-900 border border-solarized-base00/20 dark:border-zinc-800 text-slate-600 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900 hover:text-red-600 dark:hover:text-red-400 transition-all hover:rotate-6 active:scale-90 shadow-sm"
                          title="Clear"
                      >
                          <Trash2 size={20} />
                      </button>
                  )}
                </div>

                {error && (
                  <div className="animate-in fade-in slide-in-from-top-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
                    <AlertCircle size={18} className="shrink-0" />
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Output Column */}
            <div className="lg:col-span-7 space-y-6">
              {result ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500">Result</h3>
                      <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full border border-brand-200 dark:border-brand-800/50">
                         <Sparkles size={12} />
                         {MOOD_OPTIONS.find(m => m.id === result.mood)?.label} Vibe
                      </span>
                   </div>

                  {Array.isArray(result.rewritten) ? (
                    // Thread View
                    <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-8 before:bottom-8 before:w-0.5 before:bg-solarized-base1 dark:before:bg-zinc-800">
                        {result.rewritten.map((tweet, idx) => (
                          <div key={idx} className="relative animate-in slide-in-from-bottom-4 fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                             {/* Connector */}
                             <div className="absolute -left-[21px] top-8 w-3 h-3 rounded-full bg-slate-400 dark:bg-zinc-600 ring-4 ring-solarized-base3 dark:ring-black z-10"></div>
                             <ResultCard 
                               content={tweet} 
                               mood={result.mood} 
                               index={idx} 
                               total={(result.rewritten as string[]).length}
                             />
                          </div>
                        ))}
                    </div>
                  ) : (
                    // Single Tweet View
                    <ResultCard content={result.rewritten} mood={result.mood} />
                  )}
                </div>
              ) : (
                // Empty State
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-solarized-base00/30 dark:border-zinc-800 bg-solarized-base2 dark:bg-zinc-900/20 text-center p-8 transition-colors group">
                   <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-full shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-solarized-base00/10">
                      <Sparkles className="text-brand-400 dark:text-brand-600 opacity-50" size={40} />
                   </div>
                   <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-300 mb-2">Ready to transform?</h3>
                   <p className="text-slate-600 dark:text-slate-500 max-w-xs mx-auto">
                     Your reimagined tweets will appear here, formatted and ready to post.
                   </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;