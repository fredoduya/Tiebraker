import { CriteriaFactor, Option } from '../types/decision';

export interface OptionScoreResult {
  optionId: string;
  optionName: string;
  totalPoints: number;
  maxPossiblePoints: number;
  averageScore: number; // e.g. 7.8 out of 10
  normalizedPercentage: number; // 0 - 100
  categoryScores: Record<string, { earned: number; possible: number; pct: number }>;
}

export interface ScoreAnalysis {
  results: OptionScoreResult[];
  winner: OptionScoreResult | null;
  runnerUp: OptionScoreResult | null;
  isTie: boolean;
  scoreGap: number; // difference in normalized percentage points
  factorCount: number;
  topDifferentiatingFactor: {
    factor: CriteriaFactor;
    impactDescription: string;
  } | null;
}

export function calculateScores(options: Option[], factors: CriteriaFactor[]): ScoreAnalysis {
  if (!options || options.length === 0 || !factors || factors.length === 0) {
    return {
      results: [],
      winner: null,
      runnerUp: null,
      isTie: false,
      scoreGap: 0,
      factorCount: 0,
      topDifferentiatingFactor: null,
    };
  }

  const factorCount = factors.length;
  const maxPossiblePoints = factorCount * 10;

  const results: OptionScoreResult[] = options.map((opt) => {
    let totalPoints = 0;
    const categoryScores: Record<string, { earned: number; possible: number; pct: number }> = {};

    factors.forEach((f) => {
      const scoreData = f.scores[opt.id];
      const score = scoreData ? scoreData.score : 5; // default 5/10

      totalPoints += score;

      const cat = f.category || 'General';
      if (!categoryScores[cat]) {
        categoryScores[cat] = { earned: 0, possible: 0, pct: 0 };
      }
      categoryScores[cat].earned += score;
      categoryScores[cat].possible += 10;
    });

    Object.keys(categoryScores).forEach((cat) => {
      const c = categoryScores[cat];
      c.pct = c.possible > 0 ? Math.round((c.earned / c.possible) * 100) : 0;
    });

    const averageScore = factorCount > 0 ? Number((totalPoints / factorCount).toFixed(1)) : 0;
    const normalizedPercentage = maxPossiblePoints > 0
      ? Number(((totalPoints / maxPossiblePoints) * 100).toFixed(1))
      : 0;

    return {
      optionId: opt.id,
      optionName: opt.name,
      totalPoints,
      maxPossiblePoints,
      averageScore,
      normalizedPercentage,
      categoryScores,
    };
  });

  // Sort descending by score
  const sorted = [...results].sort((a, b) => b.normalizedPercentage - a.normalizedPercentage);
  const winner = sorted[0] || null;
  const runnerUp = sorted[1] || null;

  const scoreGap = winner && runnerUp
    ? Number((winner.normalizedPercentage - runnerUp.normalizedPercentage).toFixed(1))
    : 0;

  const isTie = scoreGap < 0.5 && options.length > 1;

  // Identify top differentiating factor (highest score divergence between top options)
  let topDifferentiatingFactor: { factor: CriteriaFactor; impactDescription: string } | null = null;
  if (factors.length > 0 && options.length >= 2) {
    let maxVariance = -1;
    let selectedFactor: CriteriaFactor | null = null;

    factors.forEach((f) => {
      const scores = options.map((o) => f.scores[o.id]?.score ?? 5);
      const minS = Math.min(...scores);
      const maxS = Math.max(...scores);
      const variance = maxS - minS;
      if (variance > maxVariance) {
        maxVariance = variance;
        selectedFactor = f;
      }
    });

    if (selectedFactor && maxVariance > 0) {
      const f: CriteriaFactor = selectedFactor;
      const opt1Score = f.scores[options[0].id]?.score ?? 5;
      const opt2Score = f.scores[options[1].id]?.score ?? 5;
      topDifferentiatingFactor = {
        factor: f,
        impactDescription: `${Math.abs(opt1Score - opt2Score)} point difference (${opt1Score}/10 vs ${opt2Score}/10)`,
      };
    }
  }

  return {
    results,
    winner,
    runnerUp,
    isTie,
    scoreGap,
    factorCount,
    topDifferentiatingFactor,
  };
}
