import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, X, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { AnalysisRequest } from '../types/decision';

interface NewDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AnalysisRequest) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_DILEMMAS = [
  {
    title: 'Accept Big Tech Offer vs Stay at Fast-Growing Startup',
    context: '$50k pay increase and stability vs existing team loyalty, autonomy, and early equity vesting.',
    priorities: 'Long-term wealth, engineering autonomy, work-life sustainability.',
    options: ['Big Tech Offer', 'Stay at Current Startup'],
  },
  {
    title: 'Buy Electric Vehicle (EV) vs Reliable Hybrid',
    context: 'Daily 30-mile commute, occasional 400-mile road trips. Home garage charging is available.',
    priorities: 'Total cost of ownership over 5 years, convenience, reliability.',
    options: ['Pure Electric (EV)', 'Plug-in Hybrid (PHEV)'],
  },
  {
    title: 'Monolithic Backend Architecture vs Microservices',
    context: 'Team of 6 software engineers scaling an e-commerce platform from 10k to 500k monthly active users.',
    priorities: 'Team velocity, deployment simplicity, system debuggability, infrastructure cost.',
    options: ['Modular Monolith', 'Event-Driven Microservices'],
  },
  {
    title: 'Purchase 3-Bed Suburban House vs Rent City Center Apartment',
    context: 'Young couple planning for kids in 2 years. $90k liquid down payment currently saved in index funds.',
    priorities: 'Commute time, home equity growth, living space, maintenance peace of mind.',
    options: ['Buy Suburban Home', 'Rent City Center'],
  },
];

export const NewDecisionModal: React.FC<NewDecisionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [priorities, setPriorities] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isSuggestingOptions, setIsSuggestingOptions] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOptionField = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const removeOptionField = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const applySample = (sample: typeof SAMPLE_DILEMMAS[0]) => {
    setTitle(sample.title);
    setContext(sample.context);
    setPriorities(sample.priorities);
    setOptions(sample.options);
    setErrorMsg(null);
  };

  const handleSuggestOptions = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a decision title first.');
      return;
    }
    setErrorMsg(null);
    setIsSuggestingOptions(true);

    try {
      const res = await fetch('/api/suggest-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ title, context }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.options && Array.isArray(data.options)) {
          setOptions(data.options.map((o: any) => o.name));
        }
      } else {
        // Fallback default options
        setOptions(['Option A: Proactive Transformation', 'Option B: Stable Optimization']);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not fetch suggestions. You can manually enter your options.');
    } finally {
      setIsSuggestingOptions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a decision question.');
      return;
    }

    const filteredOptions = options.map((o) => o.trim()).filter(Boolean);

    setErrorMsg(null);
    try {
      await onSubmit({
        title: title.trim(),
        context: context.trim(),
        priorities: priorities.trim(),
        options: filteredOptions.length >= 2 ? filteredOptions : undefined,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze decision.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Decision Framing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Formulate Your Dilemma
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            The Tiebreaker will generate a comprehensive factor scoring matrix, pros & cons, comparison tables, and a SWOT analysis.
          </p>
        </div>

        {/* Quick Inspiration Presets */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Or try a realistic sample dilemma:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_DILEMMAS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applySample(sample)}
                className="px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors text-left truncate max-w-xs"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Decision Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              What decision do you need to make? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Should I accept the senior role or launch my agency? Buy EV vs Hybrid?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          {/* Context & Constraints */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Context, Constraints & Background <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Budget is $45k, timeline is 3 months, risk tolerance is moderate, family considerations..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          {/* Specific Options */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Options to Compare <span className="text-neutral-400 font-normal">(Leave blank to let AI generate)</span>
              </label>

              <button
                type="button"
                onClick={handleSuggestOptions}
                disabled={isSuggestingOptions || !title.trim()}
                className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white disabled:opacity-50"
              >
                {isSuggestingOptions ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-500" />
                )}
                <span>AI Propose Options</span>
              </button>
            </div>

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-center font-mono text-xs font-bold text-neutral-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + idx)} name...`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOptionField(idx)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 4 && (
              <button
                type="button"
                onClick={addOptionField}
                className="mt-2 flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add another option</span>
              </button>
            )}
          </div>

          {/* Core Priorities */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Your Primary Values / Priorities <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Autonomy & low stress matter twice as much as pure cash"
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Decision Matrix...</span>
                </>
              ) : (
                <>
                  <span>Analyze with The Tiebreaker</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
