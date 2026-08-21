/**
 * Era Definitions
 *
 * 7 chronological eras organizing the development journey.
 * Replaces the original 15-episode system (which was never connected to post data).
 *
 * Each era covers a non-overlapping time period from May 2025 onward.
 * The most recent era's endDate is null while it is still running.
 */

export interface Era {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  startDate: string;
  endDate: string | null;
  theme: string;
}

// Backward compatibility
export type Episode = Era;

export const ERAS: Era[] = [
  {
    slug: 'the-build',
    name: 'Era 1: The Build',
    shortName: 'The Build',
    description: 'Prototype to production: daily building, debugging marathons, test recovery',
    startDate: '2025-05-01',
    endDate: '2025-07-31',
    theme: 'Foundation building, first production tests, debugging marathon, test suite recovery',
  },
  {
    slug: 'the-methodology',
    name: 'Era 2: The Methodology',
    shortName: 'The Methodology',
    description: 'From organic to orchestrated: infrastructure sprints, methodology crystallizes',
    startDate: '2025-08-01',
    endDate: '2025-09-30',
    theme: 'Methodology refinement, enhanced capabilities, orchestration, infrastructure sprint',
  },
  {
    slug: 'the-reflection',
    name: 'Era 3: The Reflection',
    shortName: 'The Reflection',
    description: 'Alpha prep, the Great Refactor, patterns named and documented',
    startDate: '2025-10-01',
    endDate: '2025-11-30',
    theme: 'Strategic pause, meta-development, discipline, reflection, alpha milestone',
  },
  {
    slug: 'the-foundation',
    name: 'Era 4: The Foundation',
    shortName: 'The Foundation',
    description: 'Strategic resets, completion discipline, MVP planning',
    startDate: '2025-12-01',
    endDate: '2026-01-31',
    theme: 'Strategic reset, completion discipline, MVP scoping, foundation solidification',
  },
  {
    slug: 'the-sprint',
    name: 'Era 5: The Sprint',
    shortName: 'The Sprint',
    description: 'M0 ships, M1 sprint, multi-agent maturity, blog-first publishing',
    startDate: '2026-02-01',
    endDate: '2026-03-31',
    theme: 'M0 launch, M1 sprint, multi-agent coordination, blog-first publishing pipeline',
  },
  {
    slug: 'the-mechanism',
    name: 'Era 6: The Mechanism',
    shortName: 'The Mechanism',
    description: 'Rules become architecture: duty-cycle autonomy, the connector rebuild, production catches up to development',
    startDate: '2026-04-01',
    endDate: '2026-07-31',
    theme: 'Autonomous duty-cycle operation scales cohort-wide, RECONNECT rebuilds the connector substrate, first production deploy since March, contracts (ADRs, portfolios) replace memory as the team\'s primary discipline',
  },
  {
    slug: 'the-alpha',
    name: 'Era 7: The Alpha',
    shortName: 'The Alpha',
    description: 'Durable infrastructure lands, hosted alpha opens to outside testers, verification culture hardens',
    startDate: '2026-08-01',
    endDate: null,
    theme: 'The team moves to always-on infrastructure, the beta-readiness gate proves itself against real defects, first external testers admitted, beta target extended for quality',
  },
];

// Backward compatibility alias
export const EPISODES = ERAS;

/**
 * Get era by slug
 */
export function getEra(slug: string): Era | undefined {
  return ERAS.find(era => era.slug === slug);
}

/**
 * Get era number (1-5) by slug
 */
export function getEraNumber(slug: string): number {
  const index = ERAS.findIndex(era => era.slug === slug);
  return index >= 0 ? index + 1 : 0;
}

/**
 * Get post count for each era
 */
export function getEraCounts(posts: Array<{ cluster?: string }>): Record<string, number> {
  const counts: Record<string, number> = {};

  ERAS.forEach(era => {
    counts[era.slug] = 0;
  });

  posts.forEach(post => {
    if (post.cluster && counts.hasOwnProperty(post.cluster)) {
      counts[post.cluster]++;
    }
  });

  return counts;
}

// Backward compatibility aliases
export const getEpisode = getEra;
export const getEpisodeNumber = getEraNumber;
export const getEpisodeCounts = getEraCounts;
