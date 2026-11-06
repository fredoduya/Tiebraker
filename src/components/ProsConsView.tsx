import React, { useState } from 'react';
import { Option, OptionProsCons, ProConItem } from '../types/decision';
import { Plus, Check, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';

interface ProsConsViewProps {
  options: Option[];
  prosCons: Record<string, OptionProsCons>;
  onAddProCon: (optionId: string, type: 'pros' | 'cons', item: ProConItem) => void;
  onDeleteProCon: (optionId: string, type: 'pros' | 'cons', itemId: string) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  options,
  prosCons,
  onAddProCon,
  onDeleteProCon,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || 'opt_1');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // New item modal/inline state
  const [showAddModal, setShowAddModal] = useState<{ optionId: string; type: 'pros' | 'cons' } | null>(null);
  const [newText, setNewText] = useState('');
  const [newImpact, setNewImpact] = useState<ProConItem['impact']>('high');

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddModal || !newText.trim()) return;

    const item: ProConItem = {
      id: `item_${Date.now()}`,
      text: newText.trim(),
      impact: newImpact,
    };

    onAddProCon(showAddModal.optionId, showAddModal.type, item);
    setNewText('');
    setNewImpact('high');
    setShowAddModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Option Selector segmented buttons if multiple options */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Pros & Cons Breakdown
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Deep qualitative analysis of upsides and trade-offs for each path.
          </p>
        </div>

        {/* Option Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedOptionId === opt.id
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Pros and Cons for Selected Option */}
      {(() => {
        const currentData = prosCons[selectedOptionId] || { pros: [], cons: [] };
        const currentOption = options.find((o) => o.id === selectedOptionId);

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros Column */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Strengths & Pros ({currentData.pros.length})
                    </h4>
                    <span className="text-[11px] text-neutral-500">Key advantages for {currentOption?.name}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddModal({ optionId: selectedOptionId, type: 'pros' })}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Pro</span>
                </button>
              </div>

              {currentData.pros.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-4 text-center">No pros added yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {currentData.pros.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`group p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                          isChecked
                            ? 'bg-neutral-50/50 dark:bg-neutral-800/20 border-neutral-200 dark:border-neutral-800 opacity-60'
                            : 'bg-neutral-50/80 dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-800'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <button
                            onClick={() => toggleCheck(item.id)}
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-neutral-300 dark:border-neutral-600 hover:border-emerald-500'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>

                          <div className="flex-1">
                            <p
                              className={`text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed ${
                                isChecked ? 'line-through text-neutral-400 dark:text-neutral-500' : ''
                              }`}
                            >
                              {item.text}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                              <span className="capitalize">{item.impact} impact</span>
                              {item.category && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>{item.category}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteProCon(selectedOptionId, 'pros', item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cons Column */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <ThumbsDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Risks & Cons ({currentData.cons.length})
                    </h4>
                    <span className="text-[11px] text-neutral-500">Known liabilities & downsides</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddModal({ optionId: selectedOptionId, type: 'cons' })}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Con</span>
                </button>
              </div>

              {currentData.cons.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-4 text-center">No cons added yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {currentData.cons.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`group p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                          isChecked
                            ? 'bg-neutral-50/50 dark:bg-neutral-800/20 border-neutral-200 dark:border-neutral-800 opacity-60'
                            : 'bg-neutral-50/80 dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-rose-800'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <button
                            onClick={() => toggleCheck(item.id)}
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                              isChecked
                                ? 'bg-rose-600 border-rose-600 text-white'
                                : 'border-neutral-300 dark:border-neutral-600 hover:border-rose-500'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>

                          <div className="flex-1">
                            <p
                              className={`text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed ${
                                isChecked ? 'line-through text-neutral-400 dark:text-neutral-500' : ''
                              }`}
                            >
                              {item.text}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                              <span className="capitalize">{item.impact} impact</span>
                              {item.category && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>{item.category}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteProCon(selectedOptionId, 'cons', item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Add Pro / Con Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-3">
              Add {showAddModal.type === 'pros' ? 'Pro' : 'Con'}
            </h3>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={`Describe the specific ${showAddModal.type === 'pros' ? 'benefit or upside' : 'risk or drawback'}...`}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Impact Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map((imp) => (
                    <button
                      key={imp}
                      type="button"
                      onClick={() => setNewImpact(imp)}
                      className={`py-1.5 text-xs font-medium capitalize rounded-md border ${
                        newImpact === imp
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                          : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {imp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
