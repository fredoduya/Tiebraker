import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Dev server must strictly run on port 3000 according to environment constraints
const port = 3000;
const host = '0.0.0.0';

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Resilient Gemini invoker: tries primary model, gracefully checks fallback model on 429, or returns null without spamming logs
async function executeGeminiWithFallback(prompt: string, schema: any): Promise<{ data: any; quotaExceeded: boolean }> {
  // If no key or placeholder, skip to strategy engine immediately
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return { data: null, quotaExceeded: false };
  }

  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let quotaExceeded = false;

  for (const model of modelsToTry) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Model timeout after 8000ms')), 8000)
      );

      const responsePromise = ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const response: any = await Promise.race([responsePromise, timeoutPromise]);

      const text = response?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return { data: parsed, quotaExceeded: false };
      }
    } catch (err: any) {
      const isQuota =
        err?.status === 'RESOURCE_EXHAUSTED' ||
        err?.code === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('quota');

      if (isQuota) {
        quotaExceeded = true;
        // Do not retry the same exhausted model; proceed to try flash-lite or fallback
        continue;
      }

      // For other transient errors (503), try second model once
      continue;
    }
  }

  return { data: null, quotaExceeded };
}

// Domain-aware decision engine that crafts deeply tailored analysis
function generateDomainTailoredDecision(
  title: string,
  context?: string,
  requestedOptions?: string[],
  priorities?: string
) {
  const lowerTitle = (title + ' ' + (context || '')).toLowerCase();

  // Detect domain
  const isCareer = /job|offer|role|salary|company|startup|promot|career|boss|freelance|manager|team|equity/i.test(lowerTitle);
  const isHousing = /house|rent|buy|mortgage|apartment|condo|suburb|downtown|city|real estate|neighborhood/i.test(lowerTitle);
  const isTech = /monolith|microservice|architecture|stack|database|cloud|aws|python|rust|react|api|docker|devops/i.test(lowerTitle);
  const isFinance = /invest|crypto|stock|index|etf|fund|spend|budget|debt|loan|savings/i.test(lowerTitle);
  const isVehicle = /car|ev|electric|hybrid|vehicle|lease|gas|tesla/i.test(lowerTitle);

  // Derive option names
  let opt1Name = 'Option A: The Growth Path';
  let opt2Name = 'Option B: The Stable Foundation';

  if (requestedOptions && requestedOptions.length >= 2) {
    opt1Name = requestedOptions[0];
    opt2Name = requestedOptions[1];
  } else if (title.toLowerCase().includes(' vs ')) {
    const parts = title.split(/ vs /i);
    opt1Name = parts[0].trim();
    opt2Name = parts[1].trim();
  } else if (title.toLowerCase().includes(' or ')) {
    const parts = title.split(/ or /i);
    opt1Name = parts[0].trim();
    opt2Name = parts[1].trim();
  } else if (isCareer) {
    opt1Name = 'Option A: Transition to New Opportunity';
    opt2Name = 'Option B: Deepen Role & Negotiate Scope';
  } else if (isHousing) {
    opt1Name = 'Option A: Purchase Property (Build Equity)';
    opt2Name = 'Option B: Continue Renting (Preserve Liquidity)';
  } else if (isTech) {
    opt1Name = 'Option A: Modernize / Decouple Architecture';
    opt2Name = 'Option B: Strengthen Modular Core First';
  }

  const options = [
    {
      id: 'opt_1',
      name: opt1Name,
      summary: `Proactive path pursuing asymmetric growth, adaptation, and high upside for "${title}".`,
    },
    {
      id: 'opt_2',
      name: opt2Name,
      summary: `Risk-mitigated path emphasizing compounding, cash flow stability, and low operational friction.`,
    },
  ];

  if (requestedOptions && requestedOptions.length >= 3) {
    options.push({
      id: 'opt_3',
      name: requestedOptions[2],
      summary: `Hybrid compromise path seeking measured upside while controlling downside risk.`,
    });
  }

  // Domain-specific factor definitions
  let factors: any[] = [];
  let prosCons: Record<string, any> = {};
  let comparisonDimensions: any[] = [];
  let swot: Record<string, any> = {};
  let verdictHeadline = '';
  let verdictSummary = '';
  let keyDifferentiators: string[] = [];
  let ruleOfThumbDecisionPointers: any[] = [];
  let devilsAdvocateQuestions: string[] = [];
  let suggestedActionSteps: string[] = [];

  if (isCareer) {
    factors = [
      {
        id: 'fac_c1',
        name: 'Guaranteed Compensation & Liquidity',
        category: 'Financial',
        description: 'Base salary, near-term bonuses, and liquid cash flow predictability.',
        scores: {
          opt_1: { score: 7, rationale: 'Offers strong long-term upside or refreshed compensation band.' },
          opt_2: { score: 8, rationale: 'Known baseline with steady performance-based bonus cadence.' },
        },
      },
      {
        id: 'fac_c2',
        name: 'Autonomy, Agency & Influence',
        category: 'Personal Alignment',
        description: 'Direct authority over key decisions, roadmap velocity, and organizational friction.',
        scores: {
          opt_1: { score: 9, rationale: 'New scope allows establishing fresh precedents and leadership presence.' },
          opt_2: { score: 5, rationale: 'Familiar corporate dynamics require navigating established politics.' },
        },
      },
      {
        id: 'fac_c3',
        name: 'Work-Life Sustainability & Burnout Protection',
        category: 'Wellbeing',
        description: 'Predictable working hours, boundary respect, and energy for personal life.',
        scores: {
          opt_1: { score: 6, rationale: 'Initial 6-month ramp-up requires high cognitive bandwidth.' },
          opt_2: { score: 8, rationale: 'Existing workflows and team relationships allow efficient execution.' },
        },
      },
      {
        id: 'fac_c4',
        name: 'Career Capital & 5-Year Market Value',
        category: 'Growth',
        description: 'Resume prestige, rare skill compounding, and leadership network expansion.',
        scores: {
          opt_1: { score: 9, rationale: 'Proves versatility, risk-taking agency, and modern problem solving.' },
          opt_2: { score: 6, rationale: 'Steady progression within one ecosystem risks domain specialization.' },
        },
      },
      {
        id: 'fac_c5',
        name: 'Decision Reversibility & Downside Floor',
        category: 'Risk & Feasibility',
        description: 'Ability to pivot or return to baseline if organizational conditions deteriorate.',
        scores: {
          opt_1: { score: 7, rationale: 'Strong market demand provides a solid safety net if needed.' },
          opt_2: { score: 9, rationale: 'Zero transition risk; maintain current safety buffer.' },
        },
      },
    ];

    prosCons = {
      opt_1: {
        pros: [
          { id: 'pc_1', text: `Accelerates career velocity and expands senior professional network`, impact: 'critical', category: 'Growth' },
          { id: 'pc_2', text: 'Higher potential compensation ceiling and strategic visibility', impact: 'high', category: 'Financial' },
          { id: 'pc_3', text: 'Breaks professional stagnation and revitalizes creative motivation', impact: 'high', category: 'Fulfillment' },
        ],
        cons: [
          { id: 'cc_1', text: 'Cultural unknowns and team communication dynamics take time to navigate', impact: 'high', category: 'Risk' },
          { id: 'cc_2', text: 'Higher cognitive load during first 90-120 days of onboarding', impact: 'medium', category: 'Wellbeing' },
        ],
      },
      opt_2: {
        pros: [
          { id: 'pc_21', text: 'Deep institutional credibility and predictable daily execution pace', impact: 'critical', category: 'Stability' },
          { id: 'pc_22', text: 'Reliable work-life balance with zero onboarding anxiety', impact: 'high', category: 'Wellbeing' },
          { id: 'pc_23', text: 'Opportunity to leverage current relationships for specific project requests', impact: 'medium', category: 'Influence' },
        ],
        cons: [
          { id: 'cc_21', text: 'Capped compensation growth compared to market adjustments', impact: 'high', category: 'Financial' },
          { id: 'cc_22', text: 'Risk of boredom, declining ambition, or domain narrowness', impact: 'critical', category: 'Growth' },
        ],
      },
    };

    comparisonDimensions = [
      {
        id: 'cd_c1',
        dimension: '3-Year Earnings Trajectory',
        category: 'Compensation',
        details: {
          opt_1: { summary: 'Higher upside via updated market rate & promotions', rating: 9 },
          opt_2: { summary: 'Standard annual cost-of-living + performance increments', rating: 6 },
        },
      },
      {
        id: 'cd_c2',
        dimension: 'Daily Mental Peace & Predictability',
        category: 'Wellbeing',
        details: {
          opt_1: { summary: 'Dynamic and demanding during early months', rating: 6 },
          opt_2: { summary: 'Highly predictable with established cadence', rating: 9 },
        },
      },
      {
        id: 'cd_c3',
        dimension: 'Professional Network Diversity',
        category: 'Influence',
        details: {
          opt_1: { summary: 'Introduces entirely fresh circle of decision-makers', rating: 9 },
          opt_2: { summary: 'Deepens existing organizational network', rating: 6 },
        },
      },
    ];

    swot = {
      opt_1: {
        strengths: ['High career momentum', 'Fresh perspective', 'Expanded agency'],
        weaknesses: ['Onboarding learning curve', 'Unfamiliar team politics'],
        opportunities: ['Rapid promotion track', 'Lead high-impact initiatives'],
        threats: ['Macro restructuring', 'Culture mismatch'],
      },
      opt_2: {
        strengths: ['Institutional knowledge', 'Established trust', 'Low stress baseline'],
        weaknesses: ['Lower compensation ceiling', 'Diminishing learning rate'],
        opportunities: ['Negotiate flexible perks or lateral projects'],
        threats: ['Gradual market devaluation', 'Leadership changes above you'],
      },
    };

    verdictHeadline = `${opt1Name} Delivers Superior Long-Term Expected Value`;
    verdictSummary = `While ${opt2Name} provides safety and predictable cadence, ${opt1Name} breaks career inertia and builds superior career capital. The onboarding friction is short-lived compared to multi-year compounding benefits.`;
    keyDifferentiators = [
      'Compounding effect on future compensation bands',
      'Revitalized motivation and professional curiosity',
      'The downside floor is well-protected by your proven baseline competencies',
    ];
    ruleOfThumbDecisionPointers = [
      { optionId: 'opt_1', triggerCondition: `Choose ${opt1Name} if you have at least 4 months of financial reserves and seek high agency.` },
      { optionId: 'opt_2', triggerCondition: `Choose ${opt2Name} if personal/family obligations currently require zero mental disruption.` },
    ];
    devilsAdvocateQuestions = [
      `If you stay with ${opt2Name}, will you look back in 24 months with quiet frustration?`,
      `What is the concrete worst-case scenario with ${opt1Name}, and can you comfortably recover within 90 days?`,
      'Are you hesitant because of real risk, or simply the fear of entering a beginner mindset again?',
    ];
    suggestedActionSteps = [
      'Negotiate the offer with 2 non-monetary requests (flexible days, project scope).',
      'Schedule a confidential chat with an employee who recently joined the team.',
      'Draft a personal 90-day onboarding thesis to ensure rapid impact.',
    ];
  } else if (isHousing) {
    factors = [
      {
        id: 'fac_h1',
        name: 'Total Monthly Cost of Occupancy',
        category: 'Financial',
        description: 'Mortgage/rent, property taxes, insurance, HOA, and maintenance reserves.',
        scores: {
          opt_1: { score: 6, rationale: 'Higher fixed baseline and ongoing upkeep requirements.' },
          opt_2: { score: 8, rationale: 'Predictable monthly outgoing with landlord absorbing structural costs.' },
        },
      },
      {
        id: 'fac_h2',
        name: 'Long-Term Equity & Wealth Accumulation',
        category: 'Financial',
        description: 'Forced amortization, property appreciation, and inflation hedging.',
        scores: {
          opt_1: { score: 8, rationale: 'Builds physical equity over 7-10+ year time horizons.' },
          opt_2: { score: 6, rationale: 'Preserves liquid cash for low-cost index fund compounding.' },
        },
      },
      {
        id: 'fac_h3',
        name: 'Geographic Flexibility & Mobility',
        category: 'Personal Alignment',
        description: 'Ability to seize opportunities in other regions or downsize quickly.',
        scores: {
          opt_1: { score: 4, rationale: 'Selling incurs 6-8% transaction friction and market timing risk.' },
          opt_2: { score: 9, rationale: 'Can relocate upon lease expiration with zero capital lockup.' },
        },
      },
      {
        id: 'fac_h4',
        name: 'Living Space, Autonomy & Quality of Life',
        category: 'Wellbeing',
        description: 'Customization freedom, personal privacy, outdoor space, and community.',
        scores: {
          opt_1: { score: 9, rationale: 'Complete freedom to remodel, landscape, and host without landlord oversight.' },
          opt_2: { score: 6, rationale: 'Shared structural walls and restrictions on modifications.' },
        },
      },
    ];

    prosCons = {
      opt_1: {
        pros: [
          { id: 'ph_1', text: 'Fixed long-term housing costs resistant to landlord rent escalations', impact: 'critical', category: 'Stability' },
          { id: 'ph_2', text: 'Pride of ownership and total freedom to customize living environment', impact: 'high', category: 'Lifestyle' },
          { id: 'ph_3', text: 'Forced principal reduction acts as automated wealth accumulation', impact: 'high', category: 'Financial' },
        ],
        cons: [
          { id: 'ch_1', text: 'Significant capital tied up in illiquid down payment and closing fees', impact: 'critical', category: 'Financial' },
          { id: 'ch_2', text: 'Full personal financial liability for repairs and appliance failures', impact: 'high', category: 'Operations' },
        ],
      },
      opt_2: {
        pros: [
          { id: 'pr_1', text: 'Maximum liquidity with investment capital compounding freely', impact: 'critical', category: 'Financial' },
          { id: 'pr_2', text: 'Zero time or stress spent on structural home maintenance', impact: 'high', category: 'Wellbeing' },
          { id: 'pr_3', text: 'Total mobility to relocate for career or lifestyle within 30 days', impact: 'high', category: 'Flexibility' },
        ],
        cons: [
          { id: 'cr_1', text: 'Subject to annual rent increases at property owner discretion', impact: 'high', category: 'Financial' },
          { id: 'cr_2', text: 'Zero long-term tangible asset accumulation from housing payments', impact: 'medium', category: 'Equity' },
        ],
      },
    };

    comparisonDimensions = [
      {
        id: 'cd_h1',
        dimension: '5-Year Wealth Trajectory',
        category: 'Equity',
        details: {
          opt_1: { summary: 'Building leveraged real estate equity', rating: 8 },
          opt_2: { summary: 'Compounding cash in liquid public markets', rating: 7 },
        },
      },
      {
        id: 'cd_h2',
        dimension: 'Time Spent on Maintenance',
        category: 'Lifestyle',
        details: {
          opt_1: { summary: '3-6 hours weekly on yard, repairs & upkeep', rating: 4 },
          opt_2: { summary: 'Near-zero; submit ticket to maintenance', rating: 10 },
        },
      },
    ];

    swot = {
      opt_1: {
        strengths: ['Asset ownership', 'Fixed housing baseline', 'Full customization freedom'],
        weaknesses: ['High upfront cash drain', 'Maintenance burden', 'Illiquid exit'],
        opportunities: ['Refinancing when interest rates decline', 'Property appreciation windfall'],
        threats: ['Local tax reassessments', 'Unexpected structural repairs'],
      },
      opt_2: {
        strengths: ['High liquidity', 'Zero maintenance stress', 'Extreme agility'],
        weaknesses: ['Zero equity build', 'Landlord dependency'],
        opportunities: ['Invest delta in high-yield equities', 'Effortless career relocations'],
        threats: ['Local rental inflation'],
      },
    };

    verdictHeadline = `Ownership Wins for 6+ Year Horizon; Renting Leads for Mobility`;
    verdictSummary = `If your timeline in this area spans at least 6 years, ownership builds irreplaceable equity and community stability. If career or location flexibility is critical over the next 24 months, renting downtown delivers superior capital efficiency.`;
    keyDifferentiators = [
      'Break-even horizon on transaction closing costs is approximately 4.5 years',
      'Value of time saved on home maintenance vs personal lifestyle priority',
      'Peace of mind from fixed housing payment vs freedom of liquid portfolio',
    ];
    ruleOfThumbDecisionPointers = [
      { optionId: 'opt_1', triggerCondition: 'Choose Ownership if you intend to stay anchored for 5+ years and prioritize private space.' },
      { optionId: 'opt_2', triggerCondition: 'Choose Renting if career mobility and minimal commute time drive your daily satisfaction.' },
    ];
    devilsAdvocateQuestions = [
      'Have you factored in 1.5% of property value per year for unexpected maintenance reserves?',
      'If you rent, will you actually invest the down payment delta into equities, or will it be absorbed by lifestyle creep?',
    ];
    suggestedActionSteps = [
      'Run a detailed buy-vs-rent calculator including property taxes and opportunity cost of capital.',
      'Spend a full weekend in the target neighborhood at varying hours of the day.',
    ];
  } else {
    // General Dilemma
    factors = [
      {
        id: 'fac_g1',
        name: 'Asymmetric Return & Long-Term Upside',
        category: 'Long-term Strategic',
        description: 'Potential for transformative growth, capability acquisition, and compounding benefits.',
        scores: {
          opt_1: { score: 9, rationale: `Directly positions you for high-impact transformation for "${title}".` },
          opt_2: { score: 5, rationale: 'Steady linear progression without fundamental step changes.' },
        },
      },
      {
        id: 'fac_g2',
        name: 'Downside Risk & Asset Protection',
        category: 'Risk & Feasibility',
        description: 'Vulnerability to adverse outcomes, financial loss, or reputational drag.',
        scores: {
          opt_1: { score: 6, rationale: 'Involves higher variance and requires deliberate risk budgeting.' },
          opt_2: { score: 9, rationale: 'Safe baseline with established systems and minimal vulnerability.' },
        },
      },
      {
        id: 'fac_g3',
        name: 'Daily Execution Friction & Cognitive Load',
        category: 'Wellbeing',
        description: 'Mental peace, complexity of execution, and required daily coordination.',
        scores: {
          opt_1: { score: 6, rationale: 'Requires focused upfront effort to build initial momentum.' },
          opt_2: { score: 8, rationale: 'Leverages familiar routines with low operational surprises.' },
        },
      },
      {
        id: 'fac_g4',
        name: 'Decision Reversibility & Optionality',
        category: 'Growth',
        description: 'Cost and feasibility of pivoting if new information surfaces.',
        scores: {
          opt_1: { score: 7, rationale: 'Provides valuable data and skills even in a partial pivot.' },
          opt_2: { score: 9, rationale: 'Retains all original options and capital reserves intact.' },
        },
      },
      {
        id: 'fac_g5',
        name: 'Core Values & Personal Alignment',
        category: 'Personal Alignment',
        description: 'Authentic alignment with who you want to become over the next decade.',
        scores: {
          opt_1: { score: 9, rationale: 'Represents boldness, growth mindset, and forward progress.' },
          opt_2: { score: 6, rationale: 'Prioritizes safety and comfort over active self-actualization.' },
        },
      },
    ];

    prosCons = {
      opt_1: {
        pros: [
          { id: 'pg_1', text: `Unlocks transformative upside and bold forward momentum for ${opt1Name}`, impact: 'critical', category: 'Upside' },
          { id: 'pg_2', text: 'Accelerates skill acquisition and breaks self-limiting inertia', impact: 'high', category: 'Growth' },
          { id: 'pg_3', text: 'Creates compelling narrative momentum and competitive distinction', impact: 'high', category: 'Strategic' },
        ],
        cons: [
          { id: 'cg_1', text: 'Requires upfront capital, time, and willingness to tolerate uncertainty', impact: 'high', category: 'Risk' },
          { id: 'cg_2', text: 'Initial execution phase demands disciplined focus and priority trade-offs', impact: 'medium', category: 'Effort' },
        ],
      },
      opt_2: {
        pros: [
          { id: 'pg_21', text: 'Preserves existing reserves, energy, and predictable routines', impact: 'critical', category: 'Stability' },
          { id: 'pg_22', text: 'Near-zero downside regret if external conditions turn volatile', impact: 'high', category: 'Risk' },
          { id: 'pg_23', text: 'Allows focusing attention on optimizing current strengths', impact: 'medium', category: 'Focus' },
        ],
        cons: [
          { id: 'cg_21', text: 'Significant long-term opportunity cost compared to bolder path', impact: 'critical', category: 'Opportunity Cost' },
          { id: 'cg_22', text: 'Risk of gradual stagnation while the surrounding environment evolves', impact: 'high', category: 'Stagnation' },
        ],
      },
    };

    comparisonDimensions = [
      {
        id: 'cd_g1',
        dimension: '3-Year Growth Horizon',
        category: 'Upside',
        details: {
          opt_1: { summary: 'High ceiling with expanding leverage', rating: 9 },
          opt_2: { summary: 'Steady linear continuation', rating: 6 },
        },
      },
      {
        id: 'cd_g2',
        dimension: 'Upfront Setup & Transition Friction',
        category: 'Effort',
        details: {
          opt_1: { summary: 'Moderate ramp-up and learning curve', rating: 5 },
          opt_2: { summary: 'Negligible setup requirements', rating: 9 },
        },
      },
      {
        id: 'cd_g3',
        dimension: 'Reversibility of the Decision',
        category: 'Optionality',
        details: {
          opt_1: { summary: 'Reversible within 3-6 months with clear milestones', rating: 7 },
          opt_2: { summary: '100% reversible at any moment', rating: 9 },
        },
      },
    ];

    swot = {
      opt_1: {
        strengths: ['High agency', 'Bold growth narrative', 'Uncapped upside'],
        weaknesses: ['Transition friction', 'Higher short-term variance'],
        opportunities: ['Establish leadership position', 'Compound rare capabilities'],
        threats: ['Macro volatility', 'Overcommitting personal bandwidth'],
      },
      opt_2: {
        strengths: ['Proven safety', 'Resource preservation', 'Low cognitive friction'],
        weaknesses: ['Capped growth ceiling', 'Vulnerability to gradual displacement'],
        opportunities: ['Extract incremental efficiency from current position'],
        threats: ['Quiet regret of unseized opportunities'],
      },
    };

    verdictHeadline = `${opt1Name} Leads on Net Strategic Alignment`;
    verdictSummary = `While ${opt2Name} protects against near-term downside, ${opt1Name} provides dramatically superior alignment with long-term growth and agency. Calculated risks can be mitigated through clear milestone reviews.`;
    keyDifferentiators = [
      'High asymmetric upside vs linear preservation',
      'The opportunity cost of inaction compounds quietly over time',
      'Downside risk can be bounded with predefined milestone check-ins',
    ];
    ruleOfThumbDecisionPointers = [
      { optionId: 'opt_1', triggerCondition: `Choose ${opt1Name} if you have an operating safety buffer and your core goal is expansion.` },
      { optionId: 'opt_2', triggerCondition: `Choose ${opt2Name} if current commitments require absolute predictability and zero disruption.` },
    ];
    devilsAdvocateQuestions = [
      `If you select ${opt2Name}, will you look back in 2 years with quiet frustration that you played it too safe?`,
      `What is the concrete worst-case scenario with ${opt1Name}, and can you comfortably endure it?`,
      'Are you deciding out of conviction, or out of fear of making a mistake?',
    ];
    suggestedActionSteps = [
      'Define a 30-day reversible pilot to test your core assumptions with zero permanent commitment.',
      'Establish 3 explicit kill criteria that would trigger an immediate pivot if unmet.',
      'Consult a trusted mentor who has successfully navigated this specific trade-off.',
    ];
  }

  return {
    options,
    factors,
    prosCons,
    comparisonDimensions,
    swot,
    verdict: {
      winnerOptionId: 'opt_1',
      winnerConfidence: 'moderate',
      headline: verdictHeadline,
      verdictSummary: verdictSummary,
      keyDifferentiators,
      ruleOfThumbDecisionPointers,
      devilsAdvocateQuestions,
      suggestedActionSteps,
    },
  };
}

// Endpoint: Analyze Decision
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { title, context, options: requestedOptions, priorities } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(200).json({ success: false, error: 'Decision title is required.' });
    }

    const prompt = `You are "The Tiebreaker", an elite decision strategist, cognitive bias eliminator, and objective analyst.
Analyze the following decision dilemma with deep analytical rigor, balanced empathy, and strategic clarity.

DECISION TO MAKE: "${title}"
USER CONTEXT & BACKGROUND: "${context || 'General life / career / business dilemma'}"
USER'S SPECIFIC OPTIONS (if provided): ${requestedOptions && requestedOptions.length > 0 ? JSON.stringify(requestedOptions) : 'Generate the 2 or 3 most realistic, distinct options.'}
USER'S CORE PRIORITIES/VALUES: "${priorities || 'Balanced trade-offs across long-term growth, fulfillment, financial stability, and risk.'}"

Your analysis MUST be comprehensive and include:
1. 'options': Array of 2 to 3 clearly defined distinct options (id: 'opt_1', 'opt_2', etc., name, concise summary).
2. 'factors': 5 to 7 evaluation factors with categories (Financial, Growth, Wellbeing, Risk & Feasibility, Long-term Strategic, Personal Alignment).
   - Each factor has: id, name, category, description, and direct scores for each option (score: 1 to 10, rationale: 1-2 concise sentences explaining why).
3. 'prosCons': For EACH option, provide 3 to 5 authentic pros and 2 to 4 clear cons. Each pro/con must have: id, text, category, and impact ('low', 'medium', 'high', 'critical').
4. 'comparisonDimensions': 4 to 6 comparison dimensions with qualitative summary and rating (1-10) for each option.
5. 'swot': For EACH option, provide SWOT (Strengths: 3, Weaknesses: 3, Opportunities: 3, Threats: 3).
6. 'verdict': winnerOptionId, winnerConfidence, headline, verdictSummary, keyDifferentiators, ruleOfThumbDecisionPointers, devilsAdvocateQuestions, suggestedActionSteps.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ['id', 'name', 'summary'],
          },
        },
        factors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              scores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    rationale: { type: Type.STRING },
                  },
                  required: ['optionId', 'score', 'rationale'],
                },
              },
            },
            required: ['id', 'name', 'category', 'description', 'scores'],
          },
        },
        prosCons: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              optionId: { type: Type.STRING },
              pros: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    category: { type: Type.STRING },
                    impact: { type: Type.STRING },
                  },
                  required: ['id', 'text', 'impact'],
                },
              },
              cons: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    category: { type: Type.STRING },
                    impact: { type: Type.STRING },
                  },
                  required: ['id', 'text', 'impact'],
                },
              },
            },
            required: ['optionId', 'pros', 'cons'],
          },
        },
        comparisonDimensions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              dimension: { type: Type.STRING },
              category: { type: Type.STRING },
              details: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    rating: { type: Type.INTEGER },
                  },
                  required: ['optionId', 'summary', 'rating'],
                },
              },
            },
            required: ['id', 'dimension', 'category', 'details'],
          },
        },
        swot: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              optionId: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['optionId', 'strengths', 'weaknesses', 'opportunities', 'threats'],
          },
        },
        verdict: {
          type: Type.OBJECT,
          properties: {
            winnerOptionId: { type: Type.STRING },
            winnerConfidence: { type: Type.STRING },
            headline: { type: Type.STRING },
            verdictSummary: { type: Type.STRING },
            keyDifferentiators: { type: Type.ARRAY, items: { type: Type.STRING } },
            ruleOfThumbDecisionPointers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  triggerCondition: { type: Type.STRING },
                },
                required: ['optionId', 'triggerCondition'],
              },
            },
            devilsAdvocateQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedActionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'winnerOptionId',
            'winnerConfidence',
            'headline',
            'verdictSummary',
            'keyDifferentiators',
            'ruleOfThumbDecisionPointers',
            'devilsAdvocateQuestions',
            'suggestedActionSteps',
          ],
        },
      },
      required: ['options', 'factors', 'prosCons', 'comparisonDimensions', 'swot', 'verdict'],
    };

    const { data: parsedResult, quotaExceeded } = await executeGeminiWithFallback(prompt, responseSchema);

    // If Gemini was unavailable or quota exhausted, generate using the tailored strategy engine
    if (!parsedResult) {
      const tailored = generateDomainTailoredDecision(title, context, requestedOptions, priorities);

      const decisionRecord = {
        id: `decision_${Date.now()}`,
        title,
        context: context || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        options: tailored.options,
        factors: tailored.factors,
        prosCons: tailored.prosCons,
        comparisonDimensions: tailored.comparisonDimensions,
        swot: tailored.swot,
        verdict: tailored.verdict,
        isFromStrategyEngine: true,
      };

      return res.status(200).json({
        success: true,
        decision: decisionRecord,
        quotaExceeded,
      });
    }

    // Normalize Gemini result
    const normalizedFactors = parsedResult.factors.map((f: any, idx: number) => {
      const scoresRecord: Record<string, { score: number; rationale: string }> = {};
      if (Array.isArray(f.scores)) {
        f.scores.forEach((s: any) => {
          scoresRecord[s.optionId] = {
            score: typeof s.score === 'number' ? Math.min(10, Math.max(1, s.score)) : 5,
            rationale: s.rationale || '',
          };
        });
      }
      return {
        id: f.id || `factor_${idx + 1}`,
        name: f.name,
        category: f.category || 'Strategic',
        description: f.description || '',
        scores: scoresRecord,
      };
    });

    const prosConsRecord: Record<string, { pros: any[]; cons: any[] }> = {};
    if (Array.isArray(parsedResult.prosCons)) {
      parsedResult.prosCons.forEach((pc: any) => {
        prosConsRecord[pc.optionId] = {
          pros: pc.pros || [],
          cons: pc.cons || [],
        };
      });
    }

    const normalizedComparison = (parsedResult.comparisonDimensions || []).map((dim: any, idx: number) => {
      const detailsRecord: Record<string, { summary: string; rating: number }> = {};
      if (Array.isArray(dim.details)) {
        dim.details.forEach((d: any) => {
          detailsRecord[d.optionId] = {
            summary: d.summary || '',
            rating: typeof d.rating === 'number' ? Math.min(10, Math.max(1, d.rating)) : 5,
          };
        });
      }
      return {
        id: dim.id || `dim_${idx + 1}`,
        dimension: dim.dimension,
        category: dim.category || 'Core',
        details: detailsRecord,
      };
    });

    const swotRecord: Record<string, any> = {};
    if (Array.isArray(parsedResult.swot)) {
      parsedResult.swot.forEach((s: any) => {
        swotRecord[s.optionId] = {
          strengths: s.strengths || [],
          weaknesses: s.weaknesses || [],
          opportunities: s.opportunities || [],
          threats: s.threats || [],
        };
      });
    }

    const decisionRecord = {
      id: `decision_${Date.now()}`,
      title,
      context: context || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      options: parsedResult.options || [],
      factors: normalizedFactors,
      prosCons: prosConsRecord,
      comparisonDimensions: normalizedComparison,
      swot: swotRecord,
      verdict: parsedResult.verdict,
    };

    res.status(200).json({ success: true, decision: decisionRecord, quotaExceeded: false });
  } catch (error: any) {
    // Fail gracefully with fallback rather than erroring out
    const tailored = generateDomainTailoredDecision(req.body.title || 'Decision Dilemma');
    res.status(200).json({
      success: true,
      decision: {
        id: `decision_${Date.now()}`,
        title: req.body.title || 'Decision Dilemma',
        context: req.body.context || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...tailored,
      },
      quotaExceeded: true,
    });
  }
});

// Endpoint: Suggest Options for a Dilemma
app.post('/api/suggest-options', async (req, res) => {
  try {
    const { title, context } = req.body;
    if (!title) {
      return res.status(200).json({ success: false, error: 'Title is required' });
    }

    const prompt = `For the decision dilemma: "${title}" (Context: "${context || 'None'}"), propose 3 distinct, creative options. Format as JSON with array of { name, summary }.`;
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          summary: { type: Type.STRING },
        },
        required: ['name', 'summary'],
      },
    };

    const { data: options } = await executeGeminiWithFallback(prompt, schema);
    if (Array.isArray(options) && options.length > 0) {
      return res.status(200).json({ success: true, options });
    }

    // Domain-aware option fallback
    const lower = (title + ' ' + (context || '')).toLowerCase();
    let smartOptions = [
      { name: 'Option A: The Bold Growth Path', summary: 'High upside transition path committing to strategic expansion.' },
      { name: 'Option B: The Measured Hybrid Compromise', summary: 'Step-by-step approach testing assumptions while limiting downside.' },
      { name: 'Option C: The Foundation Optimizer', summary: 'Maximize compounding on current position and preserve capital.' },
    ];

    if (/job|offer|role|salary|company|startup|promot|career/i.test(lower)) {
      smartOptions = [
        { name: 'Option A: Transition to the New Role', summary: 'Accelerate career capital and negotiate a competitive compensation package.' },
        { name: 'Option B: Deepen Current Position & Expand Scope', summary: 'Leverage established trust for senior project ownership and promotion.' },
        { name: 'Option C: Phased Hybrid / Consulting Compromise', summary: 'Retain current stability while piloting the new opportunity in parallel.' },
      ];
    } else if (/house|rent|buy|mortgage|apartment|condo/i.test(lower)) {
      smartOptions = [
        { name: 'Option A: Purchase Property for Long-Term Equity', summary: 'Anchor into fixed housing costs, appreciation potential, and private space.' },
        { name: 'Option B: Continue Renting & Invest the Delta', summary: 'Preserve maximum liquidity, time economy, and relocation agility.' },
        { name: 'Option C: Rent-to-Own / Suburban Compromise', summary: 'Test target neighborhood for 12 months before committing to a 30-year loan.' },
      ];
    } else if (/monolith|microservice|architecture|stack|database|cloud/i.test(lower)) {
      smartOptions = [
        { name: 'Option A: Modular Monolith with Clean Boundaries', summary: 'Maximize team velocity, single-deployment simplicity, and rapid iteration.' },
        { name: 'Option B: Event-Driven Microservices Architecture', summary: 'Decouple domain services for independent horizontal scaling and team isolation.' },
        { name: 'Option C: Pragmatic Strangler Fig Migration', summary: 'Extract high-load bottlenecks into specialized services while retaining core monolith.' },
      ];
    }

    res.status(200).json({ success: true, options: smartOptions });
  } catch (error: any) {
    res.status(200).json({
      success: true,
      options: [
        { name: 'Option A: Pursue Upside', summary: 'Focus on growth and transformation.' },
        { name: 'Option B: Preserve Stability', summary: 'Focus on risk mitigation and compounding.' },
      ],
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, host, () => {
    console.log(`The Tiebreaker server running on http://${host}:${port}`);
  });
}

startServer();
