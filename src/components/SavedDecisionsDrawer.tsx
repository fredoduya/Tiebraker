import React from 'react';
import { DecisionRecord } from '../types/decision';
import { X, Trash2, Calendar, Trophy, ArrowRight, Bookmark } from 'lucide-react';

interface SavedDecisionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionRecord[];
  currentDecisionId: string;
  onSelectDecision: (decision: DecisionRecord) => void;
  onDeleteDecision: (id: string) => void;
}

export const SavedDecisionsDrawer: React.FC<SavedDecisionsDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  currentDecisionId,
  onSelectDecision,
  onDeleteDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-full p-6 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Saved Decisions ({savedDecisions.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Decisions List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-400">
              No saved decisions yet. Create a new decision to save your analysis.
            </div>
          ) : (
            savedDecisions.map((item) => {
              const isCurrent = item.id === currentDecisionId;
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all text-left relative group ${
                    isCurrent
                      ? 'bg-neutral-50 dark:bg-neutral-800/80 border-neutral-900 dark:border-white shadow-sm'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    {item.verdict && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <Trophy className="w-3 h-3" />
                        {item.options.find((o) => o.id === item.verdict.winnerOptionId)?.name || 'Verdict Ready'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h4>

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                    <span>{item.options.map((o) => o.name).join(' vs ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.factors.length} factors</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-white hover:underline"
                    >
                      <span>Load Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteDecision(item.id)}
                      title="Delete decision"
                      className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
