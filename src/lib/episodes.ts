/**
 * Episode/Cluster Definitions
 *
 * 12 narrative episodes organizing the development journey
 */

export interface Episode {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  startDate: string;
  endDate: string;
  theme: string;
}

export const EPISODES: Episode[] = [
  {
    slug: 'genesis-architecture',
    name: 'Episode 1: Genesis & Architecture',
    shortName: 'Genesis & Architecture',
    description: 'Initial prototype, architectural reckoning, foundational decisions',
    startDate: '2025-06-27',
    endDate: '2025-07-06',
    theme: 'Initial prototype, Architectural decisions, RAG integration, Taking stock'
  },
  {
    slug: 'foundation-building',
    name: 'Episode 2: Foundation Building',
    shortName: 'Foundation Building',
    description: 'Building core infrastructure, GitHub integration, testing foundations',
    startDate: '2025-07-07',
    endDate: '2025-07-21',
    theme: 'Infrastructure, Testing, Integration work, Day Zero'
  },
  {
    slug: 'complexity-reckoning',
    name: 'Episode 3: The Complexity Reckoning',
    shortName: 'Complexity Reckoning',
    description: 'Confronting technical debt, AI drift issues, architectural challenges',
    startDate: '2025-07-22',
    endDate: '2025-07-28',
    theme: 'Technical debt, Complexity, Multiple AI coordination, Successful prototype syndrome'
  },
  {
    slug: 'production-transformation',
    name: 'Episode 4: Production Transformation',
    shortName: 'Production Transformation',
    description: 'From prototype to production tool, methodology crystallization',
    startDate: '2025-07-29',
    endDate: '2025-08-08',
    theme: 'Production readiness, Methodology, Test architecture, Crisis to methodology'
  },
  {
    slug: 'methodology-refinement',
    name: 'Episode 5: Methodology Refinement',
    shortName: 'Methodology Refinement',
    description: 'Systematic methodology development, documentation breakthroughs',
    startDate: '2025-08-09',
    endDate: '2025-08-16',
    theme: 'Demo infrastructure, Documentation, Session logs, Reliable workflows'
  },
  {
    slug: 'infrastructure-sprint',
    name: 'Episode 6: Infrastructure Sprint',
    shortName: 'Infrastructure Sprint',
    description: 'Major infrastructure victories, archaeological discoveries, convergence',
    startDate: '2025-08-17',
    endDate: '2025-08-23',
    theme: '28K-line foundation, Archaeological mystery, Convergence, Everything clicked'
  },
  {
    slug: 'enhanced-capabilities',
    name: 'Episode 7: Enhanced Capabilities',
    shortName: 'Enhanced Capabilities',
    description: 'Enhanced prompting, nervous system development, AI coordination maturity',
    startDate: '2025-08-24',
    endDate: '2025-08-31',
    theme: 'Enhanced prompting, MVP nervous system, Good habits, AI coordination'
  },
  {
    slug: 'orchestration-verification',
    name: 'Episode 8: Orchestration & Verification',
    shortName: 'Orchestration & Verification',
    description: 'Organic to orchestrated, AI self-verification, methodology infrastructure',
    startDate: '2025-09-01',
    endDate: '2025-09-08',
    theme: 'Orchestration, AI lies detection, Verification theater, Methodology cascade'
  },
  {
    slug: 'meta-development',
    name: 'Episode 9: Meta-Development',
    shortName: 'Meta-Development',
    description: 'Architecture that builds itself, framework validation, meta-learning',
    startDate: '2025-09-09',
    endDate: '2025-09-15',
    theme: 'Self-building architecture, Framework catches cheating, Fractal edge, AI personality'
  },
  {
    slug: 'strategic-pause',
    name: 'Episode 10: Strategic Pause',
    shortName: 'Strategic Pause',
    description: 'Explicit strategic pause, inchworm mode, methodology validation',
    startDate: '2025-09-16',
    endDate: '2025-09-22',
    theme: 'Strategic pause, Inchworm mode, Methodology under fire, Vision clarity'
  },
  {
    slug: 'discipline-completion',
    name: 'Episode 11: Discipline & Completion',
    shortName: 'Discipline & Completion',
    description: 'Discipline of finishing, 24-hour test, teaching machines, building cathedral',
    startDate: '2025-09-23',
    endDate: '2025-10-03',
    theme: 'Discipline, Finishing, 24-hour test, Teaching machines, Cathedral'
  },
  {
    slug: 'reflection-evolution',
    name: 'Episode 12: Reflection & Evolution',
    shortName: 'Reflection & Evolution',
    description: 'Post-completion reflection, new patterns, orchestration insights',
    startDate: '2025-10-04',
    endDate: '2025-10-12',
    theme: 'Dropped balls analysis, Time lord thinking, UX orchestration, Systemic kindness'
  }
];

/**
 * Get episode by slug
 */
export function getEpisode(slug: string): Episode | undefined {
  return EPISODES.find(ep => ep.slug === slug);
}

/**
 * Get episode number (1-12) by slug
 */
export function getEpisodeNumber(slug: string): number {
  const index = EPISODES.findIndex(ep => ep.slug === slug);
  return index >= 0 ? index + 1 : 0;
}

/**
 * Get post count for each episode
 */
export function getEpisodeCounts(posts: any[]): Record<string, number> {
  const counts: Record<string, number> = {};

  EPISODES.forEach(ep => {
    counts[ep.slug] = 0;
  });

  posts.forEach(post => {
    if (post.cluster && counts.hasOwnProperty(post.cluster)) {
      counts[post.cluster]++;
    }
  });

  return counts;
}
