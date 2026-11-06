import React, { useState } from 'react';
import { DecisionRecord } from '../types/decision';
import { ScoreAnalysis } from '../utils/scoring';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: DecisionRecord;
  scoreAnalysis: ScoreAnalysis;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  decision,
  scoreAnalysis,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# The Tiebreaker: Decision Analysis Brief\n`;
    md += `**Dilemma**: ${decision.title}\n`;
    if (decision.context) md += `**Context**: ${decision.context}\n`;
    md += `**Date**: ${new Date(decision.createdAt).toLocaleDateString()}\n\n`;

    md += `## 🏆 Final Scoring & Leader\n`;
    scoreAnalysis.results.forEach((r) => {
      md += `- **${r.optionName}**: ${r.normalizedPercentage}% (${r.totalPoints} / ${r.maxPossiblePoints} pts · ${r.averageScore}/10 avg)\n`;
    });
    if (scoreAnalysis.winner) {
      md += `\n**Score Leader**: ${scoreAnalysis.winner.optionName} (Margin: +${scoreAnalysis.scoreGap}%)\n\n`;
    }

    md += `## ⚖️ Executive Verdict\n`;
    md += `**${decision.verdict.headline}**\n\n`;
    md += `${decision.verdict.verdictSummary}\n\n`;

    md += `### Rules of Thumb\n`;
    decision.verdict.ruleOfThumbDecisionPointers.forEach((p) => {
      const opt = decision.options.find((o) => o.id === p.optionId);
      md += `- **${opt ? opt.name : 'Option'}**: ${p.triggerCondition}\n`;
    });
    md += `\n`;

    md += `## 📊 Decision Factor Matrix\n`;
    md += `| Factor | Category | ${decision.options.map((o) => o.name).join(' | ')} |\n`;
    md += `| --- | --- | ${decision.options.map(() => '---').join(' | ')} |\n`;
    decision.factors.forEach((f) => {
      const scoresCols = decision.options.map((o) => `${f.scores[o.id]?.score ?? 5}/10`).join(' | ');
      md += `| ${f.name} | ${f.category} | ${scoresCols} |\n`;
    });
    md += `\n`;

    md += `## 🔍 Key Pros & Cons\n`;
    decision.options.forEach((opt) => {
      md += `### ${opt.name}\n`;
      const pc = decision.prosCons[opt.id] || { pros: [], cons: [] };
      md += `**Pros:**\n`;
      pc.pros.forEach((p) => (md += `- [x] ${p.text} (${p.impact} impact)\n`));
      md += `**Cons:**\n`;
      pc.cons.forEach((c) => (md += `- [ ] ${c.text} (${c.impact} impact)\n`));
      md += `\n`;
    });

    md += `## ⚡ Devil's Advocate Questions\n`;
    decision.verdict.devilsAdvocateQuestions.forEach((q) => {
      md += `- ${q}\n`;
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const markdownText = generateMarkdown();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Export Decision Brief
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text Preview */}
        <div className="flex-1 overflow-y-auto py-4">
          <textarea
            readOnly
            value={markdownText}
            className="w-full h-80 font-mono text-xs p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Formatted in standard Markdown for Notion, Obsidian, Slack, or Docs.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
