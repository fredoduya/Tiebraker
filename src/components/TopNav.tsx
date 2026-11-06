import React from 'react';
import { Scale, Plus, Moon, Sun, Bookmark, Sparkles } from 'lucide-react';

interface TopNavProps {
  onNewDecision: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLoadPreset: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onNewDecision,
  onOpenSaved,
  savedCount,
  darkMode,
  onToggleDarkMode,
  onLoadPreset,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 shadow-sm">
            <Scale className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
              The Tiebreaker
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation / Quick Presets */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <button
            onClick={onLoadPreset}
            className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Sample Dilemmas</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Bookmark className="w-4 h-4 text-neutral-500" />
            <span>Saved Decisions</span>
            {savedCount > 0 && (
              <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onNewDecision}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
