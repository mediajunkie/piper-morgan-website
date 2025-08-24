import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { NewsletterSignup } from '@/components';

const seoData = generateSEOMetadata(
  'Get Involved - Building Systematic AI Collaboration',
  'Follow the building-in-public journey, get weekly insights, and join early access to new patterns for systematic AI collaboration',
  { canonical: 'https://pipermorgan.ai/get-involved' }
);

export const metadata: Metadata = {
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  openGraph: seoData.openGraph,
  twitter: seoData.twitter,
  alternates: {
    canonical: seoData.canonical
  }
};

export default function GetInvolvedPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-teal/10 to-primary-orange/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
              Get Involved
            </h1>
            <p className="text-xl text-text-light mb-8">
              Follow the building-in-public journey and join other professionals discovering systematic approaches to AI collaboration
            </p>
          </div>
        </div>
      </section>

      {/* Follow the Learning */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Follow the Learning
            </h2>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-primary-teal">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Building Piper Morgan (LinkedIn Newsletter)
                </h3>
                <p className="text-text-light mb-6">
                  Daily blog posts narrating the development and architectural design process blow by blow with updates on discoveries, breakthroughs, and the occasional technical debt confessional. (Blog posts lag behind development work by about six weeks now and growing.) Weekly Ships updating progress in real time. Plus, announcements.
                </p>
                <a
                  href="https://www.linkedin.com/newsletters/building-piper-morgan-7346158338541305856/"
                  className="inline-block bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read or Subscribe to the Newsletter →
                </a>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-primary-orange">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Building Piper Morgan (Medium Publication)
                </h3>
                <p className="text-text-light mb-6">
                  For the impatient, blog posts appear on Medium roughly a week after development and a good six weeks before they make it to LinkedIn (currently), with the last 20 and all process or insight posts always free to read.
                </p>
                <a
                  href="https://medium.com/building-piper-morgan"
                  className="inline-block bg-primary-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the Series →
                </a>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-primary-teal">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  The Pygmalion Effect (Rosenverse)
                </h3>
                <p className="text-text-light mb-6">
                  A free talk I gave in August 2025 (requires signup) for a primary audience of mid-level and senior UX practitioners, covering the seductive appeal of vibe coding, information architecture saves everything, the Excellence Flywheel, multi-agent coordination patterns, your role isn't disappearing—it's evolving, IA principles for AI system design, from "should designers code?" to systematic AI assistance, the human advocacy imperative, the Bootstrap Moment ahead, what this means for your career, and systematic kindness.
                </p>
                <a
                  href="https://rosenverse.rosenfeldmedia.com/videos/the-pygmalion-effect-in-which-a-vibe-coding-experiment-becomes-a-million-lines"
                  className="inline-block bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See the Talk →
                </a>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-primary-orange">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  This Site: Pattern Documentation
                </h3>
                <p className="text-text-light mb-6">
                  Methodology documentation, pattern catalog, and the occasional deep dive into what we're learning. For those for whom the blog is a mite too technical (too much Python code!), a new serial we're working on coming soon: Growing Piper Morgan, with more broadly applicable insights about effectively working with LLMs today on the <strong>orchestration frontier</strong>.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="/how-it-works"
                    className="inline-block bg-primary-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    How It Works →
                  </a>
                  <a
                    href="/what-weve-learned"
                    className="inline-block border border-primary-orange text-primary-orange px-6 py-3 rounded-lg font-medium hover:bg-primary-orange hover:text-white transition-colors"
                  >
                    What We've Learned →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Interest Capture */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
              Get Early Access
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-text-dark mb-4">
                  Growing Piper Morgan Series
                </h3>
                <p className="text-text-light mb-6">
                  Be the first to know when we launch our new series focused on broadly applicable insights about working with LLMs on the orchestration frontier. Less technical implementation details, more strategic patterns you can apply regardless of your role.
                </p>
                <div className="bg-primary-teal/10 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-text-dark mb-2">What you'll get</h4>
                  <ul className="text-text-light text-sm space-y-1">
                    <li>• Strategic patterns for AI-human collaboration</li>
                    <li>• Orchestration principles that scale across roles</li>
                    <li>• Decision frameworks for AI tool selection</li>
                    <li>• Systematic approaches to quality assurance</li>
                  </ul>
                </div>
                <button className="w-full bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                  Notify Me When Available
                </button>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-text-dark mb-4">
                  Alpha Testing Interest
                </h3>
                <p className="text-text-light mb-6">
                  Interested in getting early access to test systematic AI collaboration patterns in your own work? Join our alpha testing interest list to be notified when we're ready for broader experimentation.
                </p>
                <div className="bg-primary-orange/10 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-text-dark mb-2">Alpha testing includes</h4>
                  <ul className="text-text-light text-sm space-y-1">
                    <li>• Early access to methodology frameworks</li>
                    <li>• Guided implementation of patterns</li>
                    <li>• Direct feedback channel with the team</li>
                    <li>• Case study participation opportunities</li>
                  </ul>
                </div>
                <button className="w-full bg-primary-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Join Alpha Interest List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <NewsletterSignup
              title="Stay Connected"
              description="Get occasional updates about major breakthroughs, new content series, and opportunities to get involved. No spam, no overselling, no claiming we've solved everything. Just sharing what we're learning as we learn it."
              benefits={[
                "Major methodology breakthroughs and discoveries",
                "New content series and documentation releases", 
                "Alpha testing opportunities and early access",
                "Community insights from other practitioners"
              ]}
              background="surface"
              compact={false}
              privacyNotice="Low volume updates only. Unsubscribe anytime. We're building in public because the best discoveries happen when smart people share what actually works."
            />
          </div>
        </div>
      </section>

      {/* Community Questions */}
      <section className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Questions About Getting Involved?
            </h2>
            <div className="prose max-w-none text-lg text-text-light space-y-6">
              <p>
                This is an experiment in transparent development and systematic learning. If you're curious about specific patterns, want to share similar experiences, or just want to follow along, we're building multiple pathways for different levels of engagement.
              </p>
              <p>
                We're learning in public because the best discoveries happen when smart people share what actually works.
              </p>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="https://www.linkedin.com/in/christiancrumlish"
                className="inline-block bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
              <a
                href="https://twitter.com/mediajunkie"
                className="inline-block border border-primary-teal text-primary-teal px-6 py-3 rounded-lg font-medium hover:bg-primary-teal hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on Twitter
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}