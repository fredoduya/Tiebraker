import React, { useState, useEffect, useMemo } from 'react';
import { DecisionRecord, CriteriaFactor, OptionProsCons, ProConItem, ComparisonDimension, SWOTData, AnalysisRequest } from './types/decision';
import { PRESET_DECISIONS } from './utils/presets';
import { calculateScores } from './utils/scoring';
import { TopNav } from './components/TopNav';
import { ScoreGauge } from './components/ScoreGauge';
import { DecisionMatrixView } from './components/DecisionMatrixView';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotView } from './components/SwotView';
import { VerdictView } from './components/VerdictView';
import { NewDecisionModal } from './components/NewDecisionModal';
import { SavedDecisionsDrawer } from './components/SavedDecisionsDrawer';
import { ExportSummaryModal } from './components/ExportSummaryModal';
import {
  Sliders,
  ThumbsUp,
  Table,
  Grid2X2,
  Scale,
  Share2,
  Calendar,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions';
const THEME_KEY = 'the_tiebreaker_theme';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [darkMode]);

  // Saved decisions in localStorage
  const [savedDecisions, setSavedDecisions] = useState<DecisionRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (err) {
        console.error('Failed to parse stored decisions', err);
      }
    }
    return PRESET_DECISIONS;
  });

  // Current active decision
  const [currentDecision, setCurrentDecision] = useState<DecisionRecord>(() => {
    return savedDecisions[0] || PRESET_DECISIONS[0];
  });

  // Active perspective tab
  type TabType = 'matrix' | 'proscons' | 'comparison' | 'swot' | 'verdict';
  const [activeTab, setActiveTab] = useState<TabType>('matrix');

  // Modals & Drawers state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [quotaNotice, setQuotaNotice] = useState<boolean>(false);

  // Sync current decision changes back to savedDecisions and localStorage
  const updateCurrentDecision = (updated: DecisionRecord) => {
    setCurrentDecision(updated);
    setSavedDecisions((prev) => {
      const idx = prev.findIndex((d) => d.id === updated.id);
      let nextList: DecisionRecord[];
      if (idx >= 0) {
        nextList = [...prev];
        nextList[idx] = updated;
      } else {
        nextList = [updated, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return nextList;
    });
  };

  // Live scoring engine
  const scoreAnalysis = useMemo(() => {
    return calculateScores(currentDecision.options, currentDecision.factors);
  }, [currentDecision.options, currentDecision.factors]);

  // Factor Score handler
  const handleUpdateFactorScore = (factorId: string, optionId: string, newScore: number) => {
    const updatedFactors = currentDecision.factors.map((f) => {
      if (f.id === factorId) {
        return {
          ...f,
          scores: {
            ...f.scores,
            [optionId]: {
              ...(f.scores[optionId] || { rationale: '' }),
              score: newScore,
            },
          },
        };
      }
      return f;
    });
    updateCurrentDecision({
      ...currentDecision,
      factors: updatedFactors,
      updatedAt: Date.now(),
    });
  };

  // Add factor handler
  const handleAddFactor = (newFactor: CriteriaFactor) => {
    updateCurrentDecision({
      ...currentDecision,
      factors: [...currentDecision.factors, newFactor],
      updatedAt: Date.now(),
    });
  };

  // Delete factor handler
  const handleDeleteFactor = (factorId: string) => {
    if (currentDecision.factors.length <= 1) return;
    updateCurrentDecision({
      ...currentDecision,
      factors: currentDecision.factors.filter((f) => f.id !== factorId),
      updatedAt: Date.now(),
    });
  };

  // Add Pro/Con handler
  const handleAddProCon = (optionId: string, type: 'pros' | 'cons', item: ProConItem) => {
    const existing = currentDecision.prosCons[optionId] || { pros: [], cons: [] };
    const updatedProsCons: Record<string, OptionProsCons> = {
      ...currentDecision.prosCons,
      [optionId]: {
        ...existing,
        [type]: [...existing[type], item],
      },
    };
    updateCurrentDecision({
      ...currentDecision,
      prosCons: updatedProsCons,
      updatedAt: Date.now(),
    });
  };

  // Delete Pro/Con handler
  const handleDeleteProCon = (optionId: string, type: 'pros' | 'cons', itemId: string) => {
    const existing = currentDecision.prosCons[optionId];
    if (!existing) return;
    const updatedProsCons: Record<string, OptionProsCons> = {
      ...currentDecision.prosCons,
      [optionId]: {
        ...existing,
        [type]: existing[type].filter((i) => i.id !== itemId),
      },
    };
    updateCurrentDecision({
      ...currentDecision,
      prosCons: updatedProsCons,
      updatedAt: Date.now(),
    });
  };

  // Add comparison dimension handler
  const handleAddDimension = (dimension: ComparisonDimension) => {
    updateCurrentDecision({
      ...currentDecision,
      comparisonDimensions: [...currentDecision.comparisonDimensions, dimension],
      updatedAt: Date.now(),
    });
  };

  // Delete comparison dimension
  const handleDeleteDimension = (dimId: string) => {
    updateCurrentDecision({
      ...currentDecision,
      comparisonDimensions: currentDecision.comparisonDimensions.filter((d) => d.id !== dimId),
      updatedAt: Date.now(),
    });
  };

  // Add SWOT item handler
  const handleAddSwotItem = (optionId: string, section: keyof SWOTData, text: string) => {
    const existing = currentDecision.swot[optionId] || {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    };
    const updatedSwot: Record<string, SWOTData> = {
      ...currentDecision.swot,
      [optionId]: {
        ...existing,
        [section]: [...existing[section], text],
      },
    };
    updateCurrentDecision({
      ...currentDecision,
      swot: updatedSwot,
      updatedAt: Date.now(),
    });
  };

  // Submit AI Decision Analysis
  const handleAnalyzeDecision = async (request: AnalysisRequest) => {
    setIsAnalyzing(true);
    setErrorBanner(null);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(request),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Non-JSON response received:', text.slice(0, 120));
        throw new Error('The server is currently initializing or warming up. Please try again in a few moments.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete analysis.');
      }

      if (data.quotaExceeded) {
        setQuotaNotice(true);
      } else {
        setQuotaNotice(false);
      }

      const newRecord: DecisionRecord = data.decision;
      updateCurrentDecision(newRecord);
      setIsNewModalOpen(false);
      setActiveTab('matrix');
    } catch (err: any) {
      console.error('Analysis error:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Delete saved decision
  const handleDeleteDecision = (id: string) => {
    const updated = savedDecisions.filter((d) => d.id !== id);
    setSavedDecisions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (currentDecision.id === id) {
      if (updated.length > 0) {
        setCurrentDecision(updated[0]);
      } else {
        setCurrentDecision(PRESET_DECISIONS[0]);
      }
    }
  };

  // Cycle preset
  const handleLoadNextPreset = () => {
    const currentIndex = PRESET_DECISIONS.findIndex((p) => p.id === currentDecision.id);
    const nextIndex = (currentIndex + 1) % PRESET_DECISIONS.length;
    const nextPreset = PRESET_DECISIONS[nextIndex];
    updateCurrentDecision(nextPreset);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar navigation */}
      <TopNav
        onNewDecision={() => setIsNewModalOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        savedCount={savedDecisions.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onLoadPreset={handleLoadNextPreset}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error notification if any */}
        {errorBanner && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center justify-between">
            <span>{errorBanner}</span>
            <button onClick={() => setErrorBanner(null)} className="font-bold underline ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Quota limit informational banner */}
        {quotaNotice && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Note:</span>
              <span>
                Gemini free-tier daily quota was reached. This analysis was synthesized using The Tiebreaker Decision Engine. To enable real-time Gemini generation, you can select a billing-enabled key in the <strong>Settings &gt; Secrets</strong> panel.
              </span>
            </div>
            <button
              onClick={() => setQuotaNotice(false)}
              className="text-amber-700 dark:text-amber-300 hover:underline shrink-0 text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Decision Title Header Strip */}
        <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Unboxed metadata line with typographic bullet separators */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Active Dilemma</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(currentDecision.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentDecision.factors.length} Evaluation Criteria</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
              {currentDecision.title}
            </h1>

            {currentDecision.context && (
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-4xl leading-relaxed">
                {currentDecision.context}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export Brief</span>
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>New Dilemma</span>
            </button>
          </div>
        </div>

        {/* Live Score Gauge Banner */}
        <ScoreGauge scoreAnalysis={scoreAnalysis} />

        {/* Perspective View Segmented Tabs */}
        <div className="mb-6 flex items-center justify-between overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Decision Matrix</span>
              <span className="font-mono text-[10px] opacity-70">({currentDecision.factors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('proscons')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'proscons'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Pros & Cons</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'comparison'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Comparison Table</span>
              <span className="font-mono text-[10px] opacity-70">
                ({currentDecision.comparisonDimensions.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('swot')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'swot'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>SWOT Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('verdict')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'verdict'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              <span>The Tiebreaker Verdict</span>
            </button>
          </div>
        </div>

        {/* Tab View Viewports */}
        {activeTab === 'matrix' && (
          <DecisionMatrixView
            options={currentDecision.options}
            factors={currentDecision.factors}
            scoreAnalysis={scoreAnalysis}
            onUpdateFactorScore={handleUpdateFactorScore}
            onAddFactor={handleAddFactor}
            onDeleteFactor={handleDeleteFactor}
          />
        )}

        {activeTab === 'proscons' && (
          <ProsConsView
            options={currentDecision.options}
            prosCons={currentDecision.prosCons}
            onAddProCon={handleAddProCon}
            onDeleteProCon={handleDeleteProCon}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonTableView
            options={currentDecision.options}
            dimensions={currentDecision.comparisonDimensions}
            onAddDimension={handleAddDimension}
            onDeleteDimension={handleDeleteDimension}
          />
        )}

        {activeTab === 'swot' && (
          <SwotView
            options={currentDecision.options}
            swot={currentDecision.swot}
            onAddSwotItem={handleAddSwotItem}
          />
        )}

        {activeTab === 'verdict' && (
          <VerdictView
            verdict={currentDecision.verdict}
            options={currentDecision.options}
            scoreAnalysis={scoreAnalysis}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 mt-12 bg-white/50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">The Tiebreaker</span>
            <span aria-hidden="true">·</span>
            <span>Objective Decision Analysis Matrix</span>
          </div>
          <div>
            <span>Adjust factor scores to eliminate cognitive bias & break ties.</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <NewDecisionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleAnalyzeDecision}
        isLoading={isAnalyzing}
      />

      <SavedDecisionsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedDecisions={savedDecisions}
        currentDecisionId={currentDecision.id}
        onSelectDecision={(d) => setCurrentDecision(d)}
        onDeleteDecision={handleDeleteDecision}
      />

      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        decision={currentDecision}
        scoreAnalysis={scoreAnalysis}
      />
    </div>
  );
}
