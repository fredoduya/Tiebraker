import React, { useState } from 'react';
import { ComparisonDimension, Option } from '../types/decision';
import { Table, Plus, Trash2 } from 'lucide-react';

interface ComparisonTableViewProps {
  options: Option[];
  dimensions: ComparisonDimension[];
  onAddDimension: (dimension: ComparisonDimension) => void;
  onDeleteDimension: (dimId: string) => void;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  options,
  dimensions,
  onAddDimension,
  onDeleteDimension,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDimName, setNewDimName] = useState('');
  const [newDimCategory, setNewDimCategory] = useState('Strategic');
  const [newDimValues, setNewDimValues] = useState<Record<string, { summary: string; rating: number }>>({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDimName.trim()) return;

    const detailsRecord: Record<string, { summary: string; rating: number }> = {};
    options.forEach((opt) => {
      detailsRecord[opt.id] = newDimValues[opt.id] || {
        summary: 'Direct user evaluation',
        rating: 5,
      };
    });

    onAddDimension({
      id: `dim_${Date.now()}`,
      dimension: newDimName.trim(),
      category: newDimCategory,
      details: detailsRecord,
    });

    setNewDimName('');
    setNewDimValues({});
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            Side-by-Side Comparison Matrix
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Compare key dimensions, trade-offs, and estimated ratings across all paths.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Dimension</span>
        </button>
      </div>

      {/* High-Density Data Grid */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/50">
                <th className="py-3.5 px-4 font-semibold text-neutral-700 dark:text-neutral-300 w-1/4 min-w-[180px]">
                  Evaluation Dimension
                </th>
                {options.map((opt) => (
                  <th
                    key={opt.id}
                    className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-white min-w-[240px]"
                  >
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">{opt.name}</div>
                    <div className="text-[11px] font-normal text-neutral-500 line-clamp-1">{opt.summary}</div>
                  </th>
                ))}
                <th className="py-3.5 px-3 w-10 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {dimensions.map((dim) => (
                <tr
                  key={dim.id}
                  className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors group"
                >
                  {/* Dimension Name & Category */}
                  <td className="py-4 px-4 align-top">
                    <span className="font-semibold text-neutral-900 dark:text-white block text-sm">
                      {dim.dimension}
                    </span>
                    <span className="text-[11px] text-neutral-500">{dim.category}</span>
                  </td>

                  {/* Options Values */}
                  {options.map((opt) => {
                    const detail = dim.details[opt.id] || { summary: '—', rating: 5 };
                    const rating = Math.min(10, Math.max(1, detail.rating));

                    return (
                      <td key={opt.id} className="py-4 px-4 align-top">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                              {detail.summary}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden max-w-[140px]">
                              <div
                                className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all"
                                style={{ width: `${rating * 10}%` }}
                              />
                            </div>
                            <span className="font-mono tabular-nums text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
                              {rating}/10
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}

                  <td className="py-4 px-3 align-top text-right">
                    <button
                      onClick={() => onDeleteDimension(dim.id)}
                      title="Delete row"
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-lg w-full shadow-xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">
              Add Comparison Dimension
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Dimension Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exit Reversibility, Family Impact, Monthly Burn"
                  value={newDimName}
                  onChange={(e) => setNewDimName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Speed, Finance, Operations"
                  value={newDimCategory}
                  onChange={(e) => setNewDimCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Assessments for Each Option
                </label>
                {options.map((opt) => (
                  <div key={opt.id} className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg space-y-2">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {opt.name}
                    </span>
                    <input
                      type="text"
                      placeholder="Qualitative summary..."
                      value={newDimValues[opt.id]?.summary || ''}
                      onChange={(e) =>
                        setNewDimValues({
                          ...newDimValues,
                          [opt.id]: {
                            summary: e.target.value,
                            rating: newDimValues[opt.id]?.rating || 5,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-500">Rating (1-10):</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={newDimValues[opt.id]?.rating || 5}
                        onChange={(e) =>
                          setNewDimValues({
                            ...newDimValues,
                            [opt.id]: {
                              summary: newDimValues[opt.id]?.summary || '',
                              rating: parseInt(e.target.value) || 5,
                            },
                          })
                        }
                        className="w-16 px-2 py-1 text-xs font-mono text-center rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100"
                >
                  Save Dimension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
