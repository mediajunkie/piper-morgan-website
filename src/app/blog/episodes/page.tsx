import type { Metadata } from 'next';
import { EPISODES, getEpisodeCounts } from '@/lib/episodes';
import mediumPosts from '@/data/medium-posts.json';
import { CTAButton } from '@/components';

export const metadata: Metadata = {
  title: 'Development Episodes - Building Piper Morgan',
  description: '12 narrative episodes chronicling the journey of building Piper Morgan, from initial prototype to production-ready AI-augmented product management tool.',
  openGraph: {
    title: 'Development Episodes - Building Piper Morgan',
    description: '12 narrative episodes chronicling the journey of building Piper Morgan',
    type: 'website'
  }
};

export default function EpisodesPage() {
  const episodeCounts = getEpisodeCounts(mediumPosts);

  return (
    <main className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-teal/10 to-primary-orange/10 py-20">
        <div className="site-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-text-dark mb-6">
              Development Episodes
            </h1>
            <p className="text-xl text-text-light mb-8">
              The complete journey of building Piper Morgan, organized into 12 narrative episodes spanning June - October 2025. Each episode captures key themes, breakthroughs, and lessons learned in our transparent building-in-public approach.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <CTAButton href="/blog" variant="primary" size="lg">
                View All Posts
              </CTAButton>
              <CTAButton href="/how-it-works" variant="outline" size="lg">
                Our Methodology
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="py-16">
        <div className="site-container">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {EPISODES.map((episode, index) => {
                const postCount = episodeCounts[episode.slug] || 0;
                const episodeNumber = index + 1;

                return (
                  <article
                    key={episode.slug}
                    className="bg-white dark:bg-gray-800 rounded-card shadow-card hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    {/* Episode Header */}
                    <div className="bg-gradient-to-r from-primary-teal to-primary-orange p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-primary-teal-text font-semibold rounded-full text-sm mb-2">
                            Episode {episodeNumber}
                          </span>
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {episode.shortName}
                          </h2>
                        </div>
                        <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-text-dark font-medium rounded-full text-sm">
                          {postCount} {postCount === 1 ? 'post' : 'posts'}
                        </span>
                      </div>
                    </div>

                    {/* Episode Content */}
                    <div className="p-6">
                      <p className="text-text-light mb-4">
                        {episode.description}
                      </p>

                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-text-dark mb-2">Key Themes:</h3>
                        <p className="text-sm text-text-light">
                          {episode.theme}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {new Date(episode.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' - '}
                          {new Date(episode.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {postCount > 0 ? (
                        <CTAButton
                          href={`/blog?episode=${episode.slug}`}
                          variant="outline"
                          size="sm"
                        >
                          View {postCount} {postCount === 1 ? 'Post' : 'Posts'}
                        </CTAButton>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No posts yet</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Timeline Summary */}
            <div className="mt-16 p-8 bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 rounded-card">
              <h2 className="text-2xl font-bold text-text-dark mb-4">
                Journey Timeline
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-teal-text mb-2">
                    {EPISODES.length}
                  </div>
                  <div className="text-text-light">Episodes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-orange-text mb-2">
                    {mediumPosts.filter(p => p.cluster).length}
                  </div>
                  <div className="text-text-light">Posts with Episodes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-teal-text mb-2">
                    {(() => {
                      const start = new Date(EPISODES[0].startDate);
                      const end = new Date(EPISODES[EPISODES.length - 1].endDate);
                      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                      return days;
                    })()}
                  </div>
                  <div className="text-text-light">Days of Development</div>
                </div>
              </div>
            </div>

            {/* Navigation CTA */}
            <div className="mt-12 text-center">
              <p className="text-text-light mb-6">
                Explore the complete collection of building-in-public updates, methodology insights, and development breakthroughs.
              </p>
              <CTAButton href="/blog" variant="primary" size="lg">
                View All Blog Posts
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
