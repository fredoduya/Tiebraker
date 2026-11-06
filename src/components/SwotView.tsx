import React, { useState } from 'react';
import { Option, SWOTData } from '../types/decision';
import { Shield, AlertTriangle, TrendingUp, Skull, Plus, Check } from 'lucide-react';

interface SwotViewProps {
  options: Option[];
  swot: Record<string, SWOTData>;
  onAddSwotItem: (optionId: string, section: keyof SWOTData, text: string) => void;
}

export const SwotView: React.FC<SwotViewProps> = ({ options, swot, onAddSwotItem }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || 'opt_1');
  const [addingTo, setAddingTo] = useState<keyof SWOTData | null>(null);
  const [newItemText, setNewItemText] = useState('');

  const currentOption = options.find((o) => o.id === selectedOptionId);
  const currentSwot: SWOTData = swot[selectedOptionId] || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

  const handleAdd = (section: keyof SWOTData) => {
    if (!newItemText.trim()) return;
    onAddSwotItem(selectedOptionId, section, newItemText.trim());
    setNewItemText('');
    setAddingTo(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Option Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            SWOT Strategic Matrix
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Internal strengths & weaknesses alongside external opportunities & threats.
          </p>
        </div>

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

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths (Internal Positive) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Strengths</h4>
                <span className="text-[11px] text-neutral-500">Internal inherent advantages</span>
              </div>
            </div>

            <button
              onClick={() => setAddingTo(addingTo === 'strengths' ? null : 'strengths')}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {addingTo === 'strengths' && (
            <div className="flex gap-2 pt-1 pb-2">
              <input
                type="text"
                autoFocus
                placeholder="Add strength..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('strengths')}
                className="flex-1 px-2.5 py-1 text-xs rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
              <button
                onClick={() => handleAdd('strengths')}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded"
              >
                Add
              </button>
            </div>
          )}

          <ul className="space-y-2">
            {currentSwot.strengths.map((s, idx) => (
              <li
                key={idx}
                className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses (Internal Negative) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Weaknesses</h4>
                <span className="text-[11px] text-neutral-500">Internal liabilities & limitations</span>
              </div>
            </div>

            <button
              onClick={() => setAddingTo(addingTo === 'weaknesses' ? null : 'weaknesses')}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {addingTo === 'weaknesses' && (
            <div className="flex gap-2 pt-1 pb-2">
              <input
                type="text"
                autoFocus
                placeholder="Add weakness..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('weaknesses')}
                className="flex-1 px-2.5 py-1 text-xs rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
              <button
                onClick={() => handleAdd('weaknesses')}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded"
              >
                Add
              </button>
            </div>
          )}

          <ul className="space-y-2">
            {currentSwot.weaknesses.map((w, idx) => (
              <li
                key={idx}
                className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities (External Positive) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Opportunities</h4>
                <span className="text-[11px] text-neutral-500">External upside & growth catalysts</span>
              </div>
            </div>

            <button
              onClick={() => setAddingTo(addingTo === 'opportunities' ? null : 'opportunities')}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {addingTo === 'opportunities' && (
            <div className="flex gap-2 pt-1 pb-2">
              <input
                type="text"
                autoFocus
                placeholder="Add opportunity..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('opportunities')}
                className="flex-1 px-2.5 py-1 text-xs rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
              <button
                onClick={() => handleAdd('opportunities')}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded"
              >
                Add
              </button>
            </div>
          )}

          <ul className="space-y-2">
            {currentSwot.opportunities.map((o, idx) => (
              <li
                key={idx}
                className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats (External Negative) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Skull className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Threats</h4>
                <span className="text-[11px] text-neutral-500">External disruptions & vulnerabilities</span>
              </div>
            </div>

            <button
              onClick={() => setAddingTo(addingTo === 'threats' ? null : 'threats')}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {addingTo === 'threats' && (
            <div className="flex gap-2 pt-1 pb-2">
              <input
                type="text"
                autoFocus
                placeholder="Add threat..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('threats')}
                className="flex-1 px-2.5 py-1 text-xs rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
              <button
                onClick={() => handleAdd('threats')}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded"
              >
                Add
              </button>
            </div>
          )}

          <ul className="space-y-2">
            {currentSwot.threats.map((t, idx) => (
              <li
                key={idx}
                className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
