import { DecisionRecord } from '../types/decision';

export const PRESET_DECISIONS: DecisionRecord[] = [
  {
    id: 'preset_career_pivot',
    title: 'Accept Tech Giant Staff Role vs Join Early-Stage AI Startup',
    context: 'Evaluating two competitive offers. Tech Giant offers stable high compensation and work-life balance; AI Startup offers equity upside, autonomy, but 60hr weeks and runway risk.',
    createdAt: 1730000000000,
    updatedAt: 1730000000000,
    options: [
      {
        id: 'opt_1',
        name: 'Enterprise Tech Giant',
        summary: 'High-visibility Staff Engineer role with $380k total comp, mature tooling, predictable 40-hr pace, but bureaucratic approvals.',
      },
      {
        id: 'opt_2',
        name: 'AI Seed Startup (Founding Team)',
        summary: '$180k cash + 1.8% equity, direct product ownership, rapid release cycles, but 18-month runway and erratic schedule.',
      },
    ],
    factors: [
      {
        id: 'fac_1',
        name: 'Guaranteed Financial Compensation',
        category: 'Financial',
        description: 'Base salary, annual bonus, and liquid stock options over the next 24 months.',
        scores: {
          opt_1: { score: 9, rationale: 'Public liquid RSU package with top-tier retirement 401(k) match.' },
          opt_2: { score: 4, rationale: 'Below-market base cash; equity value remains illiquid and high-risk.' },
        },
      },
      {
        id: 'fac_2',
        name: 'Equity Upside & Asymmetric Return',
        category: 'Financial',
        description: 'Potential for life-changing wealth creation in a 5-7 year exit scenario.',
        scores: {
          opt_1: { score: 3, rationale: 'Stable mature stock, unlikely to 5x-10x in current market climate.' },
          opt_2: { score: 9, rationale: '1.8% founding equity in a fast-growing generative AI infra sector.' },
        },
      },
      {
        id: 'fac_3',
        name: 'Velocity, Ownership & Autonomy',
        category: 'Personal Alignment',
        description: 'Speed from idea to production deployment without layers of committee signoffs.',
        scores: {
          opt_1: { score: 4, rationale: 'Architecture reviews and cross-functional alignment take months.' },
          opt_2: { score: 10, rationale: 'Ship daily to production, build architecture from scratch.' },
        },
      },
      {
        id: 'fac_4',
        name: 'Work-Life Harmony & Burnout Risk',
        category: 'Wellbeing',
        description: 'Sustainable hours, predictable weekends, and mental energy for family/health.',
        scores: {
          opt_1: { score: 8, rationale: 'Strict 40-hour boundaries, generous PTO, established on-call rotations.' },
          opt_2: { score: 3, rationale: 'Frequent fire drills, sprint crunches, and off-hours emergency triage.' },
        },
      },
      {
        id: 'fac_5',
        name: 'Career Capital & Resume Moat',
        category: 'Growth',
        description: 'Market reputation gained for next 10 years of leadership opportunities.',
        scores: {
          opt_1: { score: 7, rationale: 'Prestigious brand name validation on CV.' },
          opt_2: { score: 8, rationale: 'Proven 0-to-1 building track record attracts future VC and VP roles.' },
        },
      },
      {
        id: 'fac_6',
        name: 'Downside Risk & Job Security',
        category: 'Risk & Feasibility',
        description: 'Vulnerability to layoff rounds, market pivots, or funding depletion.',
        scores: {
          opt_1: { score: 8, rationale: 'Solid corporate balance sheet, low immediate liquidation risk.' },
          opt_2: { score: 4, rationale: 'Dependent on next Series A closing within 14 months.' },
        },
      },
    ],
    prosCons: {
      opt_1: {
        pros: [
          { id: 'p1_1', text: 'Total compensation provides financial peace of mind and liquid savings', impact: 'critical', category: 'Financial' },
          { id: 'p1_2', text: 'Predictable work schedule leaves evening bandwidth for family and wellness', impact: 'high', category: 'Wellbeing' },
          { id: 'p1_3', text: 'World-class internal infrastructure, tooling, and dedicated ops teams', impact: 'medium', category: 'Infrastructure' },
          { id: 'p1_4', text: 'Respected corporate tier validation on future executive applications', impact: 'medium', category: 'Career' },
        ],
        cons: [
          { id: 'c1_1', text: 'Significant political friction and slow consensus-driven roadmap changes', impact: 'high', category: 'Autonomy' },
          { id: 'c1_2', text: 'Individual contribution impact is diluted across tens of thousands of staff', impact: 'medium', category: 'Fulfillment' },
          { id: 'c1_3', text: 'Capped equity ceiling with standard modest annual stock refreshes', impact: 'medium', category: 'Financial' },
        ],
      },
      opt_2: {
        pros: [
          { id: 'p2_1', text: 'Complete architectural ownership of core platform and tech decisions', impact: 'critical', category: 'Autonomy' },
          { id: 'p2_2', text: 'Uncapped upside if company hits product-market fit and scales', impact: 'critical', category: 'Financial' },
          { id: 'p2_3', text: 'Direct mentorship and daily working proximity with top founders and investors', impact: 'high', category: 'Growth' },
          { id: 'p2_4', text: 'Accelerated skill acquisition across product, hiring, and system design', impact: 'high', category: 'Learning' },
        ],
        cons: [
          { id: 'c2_1', text: '18-month cash runway before requiring external venture recapitalization', impact: 'critical', category: 'Risk' },
          { id: 'c2_2', text: 'Substantial opportunity cost on guaranteed annual cash compensation', impact: 'high', category: 'Financial' },
          { id: 'c2_3', text: 'High risk of chronic stress, scope creep, and irregular on-call hours', impact: 'high', category: 'Wellbeing' },
        ],
      },
    },
    comparisonDimensions: [
      {
        id: 'cd_1',
        dimension: 'Day-to-Day Execution Speed',
        category: 'Agility',
        details: {
          opt_1: { summary: 'Slow; 2-4 week sprint planning and compliance gates', rating: 4 },
          opt_2: { summary: 'Extreme; ideas turn into deployed features within 24 hours', rating: 10 },
        },
      },
      {
        id: 'cd_2',
        dimension: '2-Year Guaranteed Earnings',
        category: 'Compensation',
        details: {
          opt_1: { summary: '~$760k total realized liquid earnings', rating: 10 },
          opt_2: { summary: '~$360k cash base with paper equity', rating: 5 },
        },
      },
      {
        id: 'cd_3',
        dimension: 'Mental Load & Stress Level',
        category: 'Health',
        details: {
          opt_1: { summary: 'Low-to-medium; clear boundaries at 5 PM', rating: 8 },
          opt_2: { summary: 'High; existential ownership and unpredictable bugs', rating: 3 },
        },
      },
      {
        id: 'cd_4',
        dimension: 'Reversibility of the Choice',
        category: 'Flexibility',
        details: {
          opt_1: { summary: 'High; large company engineers can jump to startups anytime', rating: 8 },
          opt_2: { summary: 'High; startup builders are sought-after by big tech if company folds', rating: 8 },
        },
      },
      {
        id: 'cd_5',
        dimension: 'Professional Network Expansion',
        category: 'Relationships',
        details: {
          opt_1: { summary: 'Large internal corporate network', rating: 6 },
          opt_2: { summary: 'Dense founder, VC, and early adopter connections', rating: 9 },
        },
      },
    ],
    swot: {
      opt_1: {
        strengths: [
          'Unshakable financial compensation and comprehensive benefits',
          'Established engineering guardrails and multi-region redundancy',
          'Generous paid time off and protected personal time',
        ],
        weaknesses: [
          'Heavy bureaucratic layers and multi-tiered approval chains',
          'Narrowed scope of influence as team counts grow',
          'Lower emotional engagement in corporate objectives',
        ],
        opportunities: [
          'Lateral movement into Principal / VP paths over a 4-year horizon',
          'Accumulate significant liquid net worth to self-fund future ventures',
          'Internal incubation and patent filing credits',
        ],
        threats: [
          'Potential strategic reorganization or corporate re-indexing',
          'Skills stagnation if working on proprietary internal legacy frameworks',
        ],
      },
      opt_2: {
        strengths: [
          'Direct stake in primary business metrics and company valuation',
          'Nimble decision-making without committee gridlock',
          'High agency and accelerated creative problem solving',
        ],
        weaknesses: [
          'Zero safety net if runway ends without new capital injection',
          'Limited technical mentorship from more senior engineers',
          'Heavy multitasking across DevOps, support, and sales engineering',
        ],
        opportunities: [
          'Become Head of Engineering / VP as the engineering org triples',
          'Equity liquidity event if acquired or reaching Series B/C valuations',
          'Establish thought leadership in cutting-edge AI architecture',
        ],
        threats: [
          'Competitor with $50M seed round commoditizing the product tier',
          'Founder burnout or co-founder divergence in vision',
        ],
      },
    },
    verdict: {
      winnerOptionId: 'opt_1',
      winnerConfidence: 'marginal_call',
      headline: 'Tech Giant Leads on Net Expected Value, But Startup Wins on Agency',
      verdictSummary: 'When factoring in current macroeconomic realities and personal wellbeing, the Tech Giant provides a stronger risk-adjusted foundation. However, this is a marginal call driven primarily by personal risk appetite.',
      keyDifferentiators: [
        '$400k+ guaranteed liquidity differential over two years',
        '30+ weekly hours of preserved mental energy and personal bandwidth',
        'Autonomy deficit at big tech can be partially mitigated through open-source or side projects',
      ],
      ruleOfThumbDecisionPointers: [
        {
          optionId: 'opt_1',
          triggerCondition: 'Choose Enterprise Tech Giant if you have financial obligations (mortgage, dependent care) or need bandwidth for health/family in the next 18 months.',
        },
        {
          optionId: 'opt_2',
          triggerCondition: 'Choose AI Startup if you have 12+ months of emergency savings and your primary career frustration is slow corporate bureaucracy.',
        },
      ],
      devilsAdvocateQuestions: [
        'If you join the startup and it shuts down in 14 months with zero equity payout, will you still celebrate what you learned?',
        'If you take the Tech Giant role, will you realistically maintain your ambition or fall into comfortable inertia within 9 months?',
        'What specific dollar amount or title would make you regret either choice 3 years from today?',
      ],
      suggestedActionSteps: [
        'Counter-offer the startup for an accelerated 6-month equity cliff or higher severance guarantee.',
        'Backchannel with 2 former engineers who left the startup within the last 12 months.',
        'Negotiate specific project scope and team placement in writing with the Tech Giant hiring manager.',
      ],
    },
  },
  {
    id: 'preset_housing_decision',
    title: 'Purchase Suburban Single-Family Home vs Continue Renting Urban Condo',
    context: 'Deciding whether to lock in a 30-year mortgage on a 4-bedroom house with a yard 40 minutes away, or keep renting a 2-bedroom walk-to-work apartment in the city center.',
    createdAt: 1730005000000,
    updatedAt: 1730005000000,
    options: [
      {
        id: 'opt_home',
        name: 'Buy Suburban 4-Bed Home',
        summary: 'Fixed equity asset, private yard, quiet neighborhood, top school district, but $85k down payment and 45-min daily commute.',
      },
      {
        id: 'opt_rent',
        name: 'Rent Prime City Center Condo',
        summary: 'Zero maintenance overhead, walk to restaurants/work, flexibility to relocate in 30 days, but zero home equity build.',
      },
    ],
    factors: [
      {
        id: 'f_h1',
        name: 'Long-Term Wealth & Forced Savings',
        category: 'Financial',
        description: 'Equity accumulation, property appreciation, and inflation hedge.',
        scores: {
          opt_home: { score: 7, rationale: 'Builds physical equity over 10-15 years, though interest and property tax erode early returns.' },
          opt_rent: { score: 6, rationale: 'Down payment invested in low-cost index funds can historically outpace real estate returns.' },
        },
      },
      {
        id: 'f_h2',
        name: 'Daily Commute & Time Economy',
        category: 'Wellbeing',
        description: 'Hours spent in transit vs leisure and personal projects.',
        scores: {
          opt_home: { score: 4, rationale: '1.5 hours daily lost to highway traffic and parking logistics.' },
          opt_rent: { score: 9, rationale: '12-minute pedestrian walk to office, gym, and urban parks.' },
        },
      },
      {
        id: 'f_h3',
        name: 'Living Space & Privacy',
        category: 'Personal Alignment',
        description: 'Square footage, private outdoor garden, home office separation.',
        scores: {
          opt_home: { score: 9, rationale: '2,600 sq ft, private fenced yard, double garage, and guest suite.' },
          opt_rent: { score: 5, rationale: '1,050 sq ft, shared elevator, shared walls, and balcony only.' },
        },
      },
      {
        id: 'f_h4',
        name: 'Maintenance Overhead & Stress',
        category: 'Risk & Feasibility',
        description: 'Unexpected repair costs, lawn maintenance, roof/plumbing liability.',
        scores: {
          opt_home: { score: 4, rationale: 'Full responsibility for HVAC, landscaping, roof, and HOA compliance.' },
          opt_rent: { score: 9, rationale: 'Landlord handles all appliance failures and structural maintenance.' },
        },
      },
      {
        id: 'f_h5',
        name: 'Geographic Mobility & Freedom',
        category: 'Long-term Strategic',
        description: 'Ability to seize job opportunities in another city or country.',
        scores: {
          opt_home: { score: 3, rationale: 'Selling incurs 6-8% closing fees and requires months on market.' },
          opt_rent: { score: 9, rationale: 'Can break or finish lease with 60-day notice and zero selling costs.' },
        },
      },
    ],
    prosCons: {
      opt_home: {
        pros: [
          { id: 'ph_1', text: 'Total autonomy to renovate, landscape, paint, and customize living space', impact: 'high', category: 'Space' },
          { id: 'ph_2', text: 'Predictable fixed monthly mortgage principal and interest payment', impact: 'high', category: 'Financial' },
          { id: 'ph_3', text: 'Private outdoor space for dogs, gardening, and entertaining guests', impact: 'medium', category: 'Lifestyle' },
        ],
        cons: [
          { id: 'ch_1', text: 'Liquid savings drained by down payment, closing fees, and emergency reserves', impact: 'critical', category: 'Financial' },
          { id: 'ch_2', text: 'Daily transit drain degrades weeknight leisure and spontaneous dining', impact: 'high', category: 'Wellbeing' },
        ],
      },
      opt_rent: {
        pros: [
          { id: 'pr_1', text: 'Vibrant cultural and dining life within immediate walking radius', impact: 'high', category: 'Lifestyle' },
          { id: 'pr_2', text: 'Maximum liquidity with capital compounding in globally diversified equities', impact: 'critical', category: 'Financial' },
          { id: 'pr_3', text: 'Zero unexpected thousands spent on water heaters or roof leaks', impact: 'high', category: 'Peace of Mind' },
        ],
        cons: [
          { id: 'cr_1', text: 'Subject to annual rent increases at landlord discretion', impact: 'high', category: 'Financial' },
          { id: 'cr_2', text: 'Space constraints make having multiple remote workers or growing kids tight', impact: 'medium', category: 'Space' },
        ],
      },
    },
    comparisonDimensions: [
      {
        id: 'cd_h1',
        dimension: 'Total Monthly Outflow (PITI vs Rent)',
        category: 'Cost',
        details: {
          opt_home: { summary: '$3,400/mo (Mortgage, Tax, Insurance, Maintenance)', rating: 6 },
          opt_rent: { summary: '$2,450/mo (Rent + Renters Insurance)', rating: 8 },
        },
      },
      {
        id: 'cd_h2',
        dimension: 'Weekly Commute Hours',
        category: 'Time',
        details: {
          opt_home: { summary: '~7.5 hours per week in car', rating: 3 },
          opt_rent: { summary: '~1.5 hours per week on foot', rating: 9 },
        },
      },
    ],
    swot: {
      opt_home: {
        strengths: ['Large footprint', 'Community roots', 'Asset ownership'],
        weaknesses: ['Illiquidity', 'Commute friction', 'Upkeep obligations'],
        opportunities: ['Refinancing when interest rates drop', 'Appreciation windfall'],
        threats: ['Local property tax spikes', 'Climate insurance premium increases'],
      },
      opt_rent: {
        strengths: ['Extreme mobility', 'Time abundance', 'High cash liquidity'],
        weaknesses: ['No property equity', 'Smaller space', 'Landlord dependency'],
        opportunities: ['Invest difference in high-yield assets', 'Move cities effortlessly'],
        threats: ['Sharp local market rental inflation'],
      },
    },
    verdict: {
      winnerOptionId: 'opt_rent',
      winnerConfidence: 'moderate',
      headline: 'Renting City Center Wins on Time Economy & Opportunity Cost',
      verdictSummary: 'At current mortgage interest rates and commute penalties, renting downtown and investing the down payment delta generates superior life satisfaction and equivalent wealth creation unless staying for 8+ years.',
      keyDifferentiators: [
        '300+ commuting hours saved per year returned to your life',
        'Liquid portfolio flexibility during economic uncertainty',
        'Homeownership maintenance drag is underestimated by first-time buyers',
      ],
      ruleOfThumbDecisionPointers: [
        {
          optionId: 'opt_home',
          triggerCondition: 'Choose Suburban Home if you plan to stay anchored for 7+ years and private yard/school district is your #1 family priority.',
        },
        {
          optionId: 'opt_rent',
          triggerCondition: 'Choose Renting Condo if career mobility and minimal commute time drive your daily happiness.',
        },
      ],
      devilsAdvocateQuestions: [
        'Have you test-driven the exact suburban morning commute on a rainy Tuesday at 8:00 AM?',
        'Will you actually invest the $85k down payment delta diligently, or will it be absorbed by lifestyle creep?',
      ],
      suggestedActionSteps: [
        'Rent an Airbnb in the suburban neighborhood for 4 days to test the real commute schedule.',
        'Run an exact amortization calculator factoring in 1.5% annual home maintenance reserve.',
      ],
    },
  },
];
