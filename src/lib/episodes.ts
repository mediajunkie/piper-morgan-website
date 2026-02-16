/**
 * Episode/Cluster Definitions
 *
 * 15 narrative episodes organizing the development journey
 *
 * Note: Episodes represent thematic workstreams that often ran in parallel,
 * not sequential time blocks. Date ranges may overlap across episodes.
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
    slug: 'foundation-building',
    name: 'Episode 1: Foundation Building',
    shortName: 'Foundation Building',
    description: 'Building core infrastructure, GitHub integration, testing foundations',
    startDate: '2025-05-27',
    endDate: '2025-06-24',
    theme: 'Research question → working prototype, Infrastructure, Testing, Integration work'
  },
  {
    slug: 'genesis-architecture',
    name: 'Episode 2: Genesis & Architecture',
    shortName: 'Genesis & Architecture',
    description: 'Initial prototype, architectural reckoning, foundational decisions',
    startDate: '2025-05-28',
    endDate: '2025-06-27',
    theme: 'Initial prototype, Architectural decisions, RAG integration, Taking stock'
  },
  {
    slug: 'complexity-reckoning',
    name: 'Episode 3: The Complexity Reckoning',
    shortName: 'Complexity Reckoning',
    description: 'Confronting technical debt, AI drift issues, architectural challenges',
    startDate: '2025-05-29',
    endDate: '2025-06-26',
    theme: 'Technical debt, Complexity, Multiple AI coordination, Successful prototype syndrome'
  },
  {
    slug: 'first-production-tests',
    name: 'Episode 4: First Production Tests',
    shortName: 'First Production Tests',
    description: 'Moving from prototype to first production tests, early deployment reality check',
    startDate: '2025-05-30',
    endDate: '2025-06-29',
    theme: 'Early deployment, Documentation needs, Pattern recognition, Battle-testing begins'
  },
  {
    slug: 'the-debugging-marathon',
    name: 'Episode 5: The Debugging Marathon',
    shortName: 'The Debugging Marathon',
    description: 'Intensive debugging sprint, UI bugs emerge, coordination challenges',
    startDate: '2025-07-01',
    endDate: '2025-07-11',
    theme: 'UI bugs surface, Debugging cascades, Coordination tax, Integration hell'
  },
  {
    slug: 'test-suite-recovery',
    name: 'Episode 6: Test Suite Recovery',
    shortName: 'Test Suite Recovery',
    description: 'From 2% to 87% test coverage, architecture cleanup, production-ready',
    startDate: '2025-07-12',
    endDate: '2025-07-24',
    theme: 'Test recovery, Architecture cleanup, 642x performance, Production declaration'
  },
  {
    slug: 'methodology-refinement',
    name: 'Episode 7: Methodology Refinement',
    shortName: 'Methodology Refinement',
    description: 'Systematic methodology development, documentation breakthroughs',
    startDate: '2025-06-14',
    endDate: '2025-08-08',
    theme: 'Demo infrastructure, Documentation, Session logs, Reliable workflows'
  },
  {
    slug: 'enhanced-capabilities',
    name: 'Episode 8: Enhanced Capabilities',
    shortName: 'Enhanced Capabilities',
    description: 'Enhanced prompting, nervous system development, AI coordination maturity',
    startDate: '2025-07-03',
    endDate: '2025-08-23',
    theme: 'MCP integration, Enhanced prompting, MVP nervous system, AI coordination'
  },
  {
    slug: 'orchestration-verification',
    name: 'Episode 9: Orchestration & Verification',
    shortName: 'Orchestration & Verification',
    description: 'Organic to orchestrated, AI self-verification, methodology infrastructure',
    startDate: '2025-07-06',
    endDate: '2025-08-31',
    theme: 'Orchestration, AI lies detection, Verification theater, Methodology cascade'
  },
  {
    slug: 'infrastructure-sprint',
    name: 'Episode 10: Infrastructure Sprint',
    shortName: 'Infrastructure Sprint',
    description: 'Major infrastructure victories, archaeological discoveries, convergence',
    startDate: '2025-06-27',
    endDate: '2025-08-15',
    theme: '28K-line foundation, Archaeological mystery, Convergence, Everything clicked'
  },
  {
    slug: 'strategic-pause',
    name: 'Episode 11: Strategic Pause',
    shortName: 'Strategic Pause',
    description: 'Explicit strategic pause, inchworm mode, methodology validation',
    startDate: '2025-07-15',
    endDate: '2025-09-14',
    theme: 'Strategic pause, Inchworm mode, Methodology under fire, Vision clarity'
  },
  {
    slug: 'meta-development',
    name: 'Episode 12: Meta-Development',
    shortName: 'Meta-Development',
    description: 'Architecture that builds itself, framework validation, meta-learning',
    startDate: '2025-07-07',
    endDate: '2025-09-08',
    theme: 'Self-building architecture, Framework catches cheating, Fractal edge, AI personality'
  },
  {
    slug: 'discipline-completion',
    name: 'Episode 13: Discipline & Completion',
    shortName: 'Discipline & Completion',
    description: 'Discipline of finishing, 24-hour test, teaching machines, building cathedral',
    startDate: '2025-07-22',
    endDate: '2025-09-27',
    theme: 'The Great Refactor, Discipline, Finishing, Teaching machines, Cathedral building'
  },
  {
    slug: 'reflection-evolution',
    name: 'Episode 14: Reflection & Evolution',
    shortName: 'Reflection & Evolution',
    description: 'Post-completion reflection, new patterns, orchestration insights',
    startDate: '2025-08-05',
    endDate: '2025-10-04',
    theme: 'Dropped balls analysis, Time lord thinking, UX orchestration, Systemic kindness'
  },
  {
    slug: 'alpha-milestone',
    name: 'Episode 15: Alpha Milestone',
    shortName: 'Alpha Milestone',
    description: 'Great Refactor completion, alpha readiness, tester onboarding',
    startDate: '2025-10-05',
    endDate: '2025-11-30',
    theme: 'Refactor completion, Quality validation, Alpha readiness, First users'
  }
];

/**
 * Get episode by slug
 */
export function getEpisode(slug: string): Episode | undefined {
  return EPISODES.find(ep => ep.slug === slug);
}

/**
 * Get episode number (1-15) by slug
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
