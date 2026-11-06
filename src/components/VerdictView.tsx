import React, { useState } from 'react';
import { TiebreakerVerdict, Option } from '../types/decision';
import { ScoreAnalysis } from '../utils/scoring';
import { Scale, Compass, HelpCircle, CheckSquare, Sparkles, Coins } from 'lucide-react';

interface VerdictViewProps {
  verdict: TiebreakerVerdict;
  options: Option[];
  scoreAnalysis: ScoreAnalysis;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  verdict,
  options,
  scoreAnalysis,
}) => {
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const winningOption = options.find((o) => o.id === verdict.winnerOptionId) || scoreAnalysis.winner;

  const handleFlipCoin = () => {
    if (options.length < 2) return;
    setIsFlipping(true);
    setCoinResult(null);

    setTimeout(() => {
      const picked = options[Math.floor(Math.random() * options.length)];
      setCoinResult(picked.name);
      setIsFlipping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Executive Verdict Card */}
      <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 dark:text-neutral-600 mb-2">
          <Scale className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>The Tiebreaker Synthesis</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{verdict.winnerConfidence.replace('_', ' ')} Confidence</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
          {verdict.headline}
        </h3>

        <p className="text-sm text-neutral-300 dark:text-neutral-700 mt-3 leading-relaxed max-w-3xl">
          {verdict.verdictSummary}
        </p>

        {/* Key Differentiators */}
        <div className="mt-6 pt-6 border-t border-neutral-800 dark:border-neutral-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
            Core Decisive Drivers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {verdict.keyDifferentiators.map((diff, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-neutral-800/80 dark:bg-neutral-100 text-xs text-neutral-200 dark:text-neutral-800 leading-snug border border-neutral-700/60 dark:border-neutral-200"
              >
                {diff}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules of Thumb: When to Choose Which Option */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            Conditional Decision Rules
          </h4>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Clear trigger conditions that dictate which path to execute based on your personal constraints.
        </p>

        <div className="space-y-3 pt-1">
          {verdict.ruleOfThumbDecisionPointers.map((rule, idx) => {
            const opt = options.find((o) => o.id === rule.optionId);
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
              >
                <span className="font-semibold text-xs text-neutral-900 dark:text-white whitespace-nowrap min-w-[140px]">
                  {opt ? opt.name : `Option ${idx + 1}`}
                </span>
                <span className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {rule.triggerCondition}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Devil's Advocate & De-risking Action Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Devil's Advocate Hard Questions */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Devil's Advocate Stress Test
            </h4>
          </div>
          <p className="text-xs text-neutral-500">
            Uncomfortable questions designed to dismantle confirmation bias.
          </p>

          <div className="space-y-2.5 pt-1">
            {verdict.devilsAdvocateQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed"
              >
                {q}
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Next Actions */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <CheckSquare className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              De-risking Action Protocol
            </h4>
          </div>
          <p className="text-xs text-neutral-500">
            Low-cost tests to validate assumptions before committing permanently.
          </p>

          <div className="space-y-2.5 pt-1">
            {verdict.suggestedActionSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed flex items-start gap-2.5"
              >
                <span className="font-mono font-bold text-[11px] text-neutral-400 mt-0.5">
                  0{idx + 1}.
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Psychological Tiebreaker: The Coin Toss Resonance Check */}
      <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            Psychological Gut-Check: The Coin Test
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-xl">
            When you flip a coin, you often realize which side you were hoping for while it is still in the air.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {coinResult && (
            <div className="text-xs font-semibold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 animate-fade-in">
              Landed on: <span className="font-bold underline">{coinResult}</span>
              <span className="block text-[10px] font-normal text-neutral-500">
                Did you feel relieved or disappointed?
              </span>
            </div>
          )}

          <button
            onClick={handleFlipCoin}
            disabled={isFlipping}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg transition-colors whitespace-nowrap"
          >
            {isFlipping ? 'Flipping...' : 'Flip Virtual Coin'}
          </button>
        </div>
      </div>
    </div>
  );
};
