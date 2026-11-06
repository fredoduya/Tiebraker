import React from 'react';
import { ScoreAnalysis } from '../utils/scoring';
import { Trophy, AlertCircle, ArrowRight, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoreGaugeProps {
  scoreAnalysis: ScoreAnalysis;
  onFocusFactor?: (factorId: string) => void;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ scoreAnalysis, onFocusFactor }) => {
  const { results, winner, isTie, scoreGap, topDifferentiatingFactor, factorCount } = scoreAnalysis;

  if (results.length === 0) return null;

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0ea5e9', '#10b981', '#f59e0b', '#6366f1'],
    });
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Overall Status & Winner Callout */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            {isTie ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Tiebreaker Deadlock Detected (Margin &lt; 0.5%)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Trophy className="w-3.5 h-3.5" />
                Current Score Leader (+{scoreGap}% margin)
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            {isTie ? (
              'Deadlock: Both Options Scored Evenly'
            ) : (
              <>
                <span>{winner?.optionName}</span>
                <button
                  onClick={handleCelebrate}
                  title="Celebrate winning outcome"
                  className="p-1 text-neutral-400 hover:text-amber-500 transition-colors"
                >
                  <PartyPopper className="w-4 h-4" />
                </button>
              </>
            )}
          </h2>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            {isTie
              ? 'Scores are virtually tied across criteria. Adjust factor scores below or review the qualitative trade-offs to break the deadlock.'
              : `Based on your evaluation across ${factorCount} criteria factors, ${winner?.optionName} achieves the highest overall rating.`}
          </p>
        </div>

        {/* Right: Key Differentiating Factor quick insight */}
        {topDifferentiatingFactor && (
          <div className="lg:max-w-xs shrink-0 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Differentiating Factor</span>
            </div>
            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {topDifferentiatingFactor.factor.name}
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
              {topDifferentiatingFactor.impactDescription}
            </p>
          </div>
        )}
      </div>

      {/* Progress Bars for Each Option */}
      <div className="mt-5 space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        {results.map((res, index) => {
          const isCurrentWinner = !isTie && winner?.optionId === res.optionId;
          return (
            <div key={res.optionId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  {res.optionName}
                  {isCurrentWinner && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 ml-1">
                      Leader
                    </span>
                  )}
                </span>
                <span className="font-mono tabular-nums text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {res.normalizedPercentage}%
                  <span className="text-[11px] font-normal text-neutral-500 ml-1.5">
                    ({res.averageScore}/10 avg · {res.totalPoints}/{res.maxPossiblePoints} pts)
                  </span>
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isCurrentWinner
                      ? 'bg-neutral-900 dark:bg-white'
                      : 'bg-neutral-400 dark:bg-neutral-600'
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, res.normalizedPercentage))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
