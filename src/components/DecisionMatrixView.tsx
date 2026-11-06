import React, { useState } from 'react';
import { CriteriaFactor, Option } from '../types/decision';
import { ScoreAnalysis } from '../utils/scoring';
import { Sliders, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface DecisionMatrixViewProps {
  options: Option[];
  factors: CriteriaFactor[];
  scoreAnalysis: ScoreAnalysis;
  onUpdateFactorScore: (factorId: string, optionId: string, newScore: number) => void;
  onAddFactor: (factor: CriteriaFactor) => void;
  onDeleteFactor: (factorId: string) => void;
}

export const DecisionMatrixView: React.FC<DecisionMatrixViewProps> = ({
  options,
  factors,
  scoreAnalysis,
  onUpdateFactorScore,
  onAddFactor,
  onDeleteFactor,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedRationale, setExpandedRationale] = useState<Record<string, boolean>>({});

  // New factor form state
  const [newFactorName, setNewFactorName] = useState('');
  const [newFactorCategory, setNewFactorCategory] = useState<CriteriaFactor['category']>('Personal Alignment');
  const [newFactorDesc, setNewFactorDesc] = useState('');
  const [newFactorScores, setNewFactorScores] = useState<Record<string, number>>({});

  const toggleRationale = (factorId: string) => {
    setExpandedRationale((prev) => ({ ...prev, [factorId]: !prev[factorId] }));
  };

  const handleCreateFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactorName.trim()) return;

    const scoresRecord: Record<string, { score: number; rationale: string }> = {};
    options.forEach((opt) => {
      scoresRecord[opt.id] = {
        score: newFactorScores[opt.id] || 5,
        rationale: 'User added custom factor',
      };
    });

    const newFactor: CriteriaFactor = {
      id: `factor_custom_${Date.now()}`,
      name: newFactorName.trim(),
      category: newFactorCategory,
      description: newFactorDesc.trim() || 'Custom factor defined by user.',
      scores: scoresRecord,
    };

    onAddFactor(newFactor);
    setNewFactorName('');
    setNewFactorDesc('');
    setNewFactorScores({});
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Action / Explanation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            Decision Factor Matrix
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Evaluate each factor on a 1–10 scale. Cumulative points and leaders update in real-time.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Factor</span>
        </button>
      </div>

      {/* Factors Table / Cards */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {factors.map((factor) => {
            const isExpanded = !!expandedRationale[factor.id];

            return (
              <div
                key={factor.id}
                className="p-4 sm:p-5 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Factor Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{factor.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Evaluation Factor</span>
                    </div>

                    <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {factor.name}
                    </h4>

                    {factor.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl leading-relaxed">
                        {factor.description}
                      </p>
                    )}
                  </div>

                  {/* Option Scores for this Factor */}
                  <div className="lg:w-[480px] shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800">
                    {options.map((opt) => {
                      const scoreData = factor.scores[opt.id] || { score: 5, rationale: '' };

                      return (
                        <div
                          key={opt.id}
                          className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate pr-1">
                              {opt.name}
                            </span>
                            <span className="font-mono tabular-nums text-xs font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
                              {scoreData.score} <span className="font-normal text-[10px] text-neutral-500">/ 10</span>
                            </span>
                          </div>

                          {/* Interactive Range & Number */}
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              step="1"
                              value={scoreData.score}
                              onChange={(e) =>
                                onUpdateFactorScore(factor.id, opt.id, parseInt(e.target.value, 10))
                              }
                              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white"
                            />
                            <span className="w-8 text-right font-mono tabular-nums text-xs font-bold text-neutral-900 dark:text-neutral-100">
                              {scoreData.score}/10
                            </span>
                          </div>

                          {scoreData.rationale && isExpanded && (
                            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700 leading-snug">
                              {scoreData.rationale}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions: Toggle Rationale & Delete */}
                  <div className="flex items-center lg:flex-col gap-2 shrink-0 self-end lg:self-start">
                    <button
                      onClick={() => toggleRationale(factor.id)}
                      title={isExpanded ? 'Hide AI rationale' : 'View AI rationale'}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onDeleteFactor(factor.id)}
                      title="Delete this factor"
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Factor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-lg w-full shadow-xl">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Add Evaluation Factor
            </h3>

            <form onSubmit={handleCreateFactor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Factor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Relocation Requirement, Learning Curve"
                  value={newFactorName}
                  onChange={(e) => setNewFactorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Category
                </label>
                <select
                  value={newFactorCategory}
                  onChange={(e) => setNewFactorCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  <option value="Financial">Financial</option>
                  <option value="Growth">Growth</option>
                  <option value="Wellbeing">Wellbeing</option>
                  <option value="Risk & Feasibility">Risk & Feasibility</option>
                  <option value="Long-term Strategic">Long-term Strategic</option>
                  <option value="Personal Alignment">Personal Alignment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe what this factor evaluates..."
                  value={newFactorDesc}
                  onChange={(e) => setNewFactorDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Initial Factor Scores (1–10)
                </label>
                {options.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {opt.name}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newFactorScores[opt.id] ?? 5}
                      onChange={(e) =>
                        setNewFactorScores({
                          ...newFactorScores,
                          [opt.id]: Math.min(10, Math.max(1, parseInt(e.target.value) || 5)),
                        })
                      }
                      className="w-16 px-2 py-1 text-center font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                >
                  Save Factor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
