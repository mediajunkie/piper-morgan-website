import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { NewsletterSignup } from '@/components';

const seoData = generateSEOMetadata(
  'Get Involved - Follow the Journey, Shape the Future',
  'Multiple ways to engage with the Piper Morgan project, wherever you are in your AI collaboration journey',
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
              Get Involved - Follow the Journey, Shape the Future
            </h1>
            <p className="text-xl text-text-light mb-8">
              Multiple ways to engage with the Piper Morgan project, wherever you are in your AI collaboration journey
            </p>
          </div>
        </div>
      </section>

      {/* Follow the Building-in-Public Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Follow the Building-in-Public Story
            </h2>

            <h3 className="text-2xl font-semibold text-text-dark mb-8">
              Current Content Streams
            </h3>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-primary-teal">
                <h4 className="text-xl font-semibold text-text-dark mb-4">
                  Building Piper Morgan (LinkedIn Newsletter)
                </h4>
                <p className="text-text-light mb-6">
                  The daily narrative of development and architectural design, told blow by blow with updates on discoveries, breakthroughs, and the occasional technical debt confessional. Blog posts currently lag about six weeks behind live development (and growing), plus weekly Ships with real-time progress updates and announcements.
                </p>
                <a
                  href="https://www.linkedin.com/newsletters/building-piper-morgan-7346158338541305856/"
                  className="inline-flex items-center text-primary-teal font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  → Subscribe to the LinkedIn Newsletter
                </a>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-primary-orange">
                <h4 className="text-xl font-semibold text-text-dark mb-4">
                  Building Piper Morgan (Medium Publication)
                </h4>
                <p className="text-text-light mb-6">
                  For the impatient: blog posts appear on Medium roughly a week after development work and about five weeks before they reach LinkedIn. The last 20 posts plus all process and methodology insights are always free to read.
                </p>
                <a
                  href="https://medium.com/building-piper-morgan"
                  className="inline-flex items-center text-primary-orange font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  → Read the Medium Series
                </a>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-primary-teal">
                <h4 className="text-xl font-semibold text-text-dark mb-4">
                  The Pygmalion Effect (Rosenverse Talk)
                </h4>
                <p className="text-text-light mb-6">
                  A comprehensive talk given in August 2025 for UX practitioners covering the seductive appeal of vibe coding, information architecture principles for AI systems, the Excellence Flywheel methodology, multi-agent coordination patterns, and the human advocacy imperative. Free with signup.
                </p>
                <a
                  href="https://rosenverse.rosenfeldmedia.com/videos/the-pygmalion-effect-in-which-a-vibe-coding-experiment-becomes-a-million-lines"
                  className="inline-flex items-center text-primary-teal font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  → Watch the Talk
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Coming: Growing Piper Morgan */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              What's Coming: Growing Piper Morgan
            </h2>

            <h3 className="text-2xl font-semibold text-text-dark mb-6">
              A New Series for the Broader Community
            </h3>

            <div className="prose max-w-none text-lg text-text-light space-y-6 mb-8">
              <p>
                The Building Piper Morgan series documents the technical journey with full code, architectural decisions, and implementation details. Great if you're hands-on with AI development, less accessible if you're more interested in the strategic and methodological insights.
              </p>
              <p>
                <strong>Growing Piper Morgan</strong> will translate the same discoveries into broader applicability - systematic AI collaboration principles without requiring you to supervise coding agents or debug environment setup.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
              <h4 className="text-xl font-semibold text-text-dark mb-4">What to expect</h4>
              <ul className="space-y-2 text-text-light">
                <li>• The Excellence Flywheel methodology adapted for different roles and contexts</li>
                <li>• Verification-first patterns for any type of AI collaboration</li>
                <li>• Multi-agent coordination principles for teams and organizations</li>
                <li>• Risk-based frameworks for AI evaluation and adoption</li>
                <li>• Context-driven decision patterns for strategic AI use</li>
              </ul>
              
              <p className="text-text-light mt-6 mb-4">
                <strong>Timeline</strong>: Early development, no firm launch date yet. This will be hosted on this site when ready.
              </p>
              
              <p className="text-text-dark font-medium mb-6">
                Want to be notified when it launches?
              </p>
              
              <button className="bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                Notify me about Growing Piper Morgan
              </button>
              <p className="text-sm text-text-light mt-2">
                Email address capture with clear privacy notice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For AI-Curious Professionals and Leaders */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              For AI-Curious Professionals and Leaders
            </h2>

            <h3 className="text-2xl font-semibold text-text-dark mb-6">
              Test These Patterns in Your Own Work
            </h3>

            <div className="prose max-w-none text-lg text-text-light space-y-6 mb-8">
              <p>
                The methodologies we're developing aren't specific to product management or software development. The patterns appear to apply wherever systematic thinking meets AI collaboration.
              </p>
              <p>
                <strong>If you're experimenting with these approaches</strong>:
              </p>
              <ul className="space-y-2">
                <li>• We'd love to hear about your experiences - what works, what doesn't, what needs adaptation</li>
                <li>• Perspectives from different roles and industries help us understand which patterns are universal vs. context-specific</li>
                <li>• Real-world testing helps us refine the frameworks before wider publication</li>
              </ul>
            </div>

            <div className="bg-primary-teal/10 p-8 rounded-lg mb-8">
              <h4 className="text-xl font-semibold text-text-dark mb-4">
                Current areas where we're seeking feedback
              </h4>
              <ul className="space-y-2 text-text-light">
                <li>• How verification-first patterns apply in UX research and design work</li>
                <li>• Multi-agent coordination for non-technical teams</li>
                <li>• Risk-based AI evaluation frameworks for different organization sizes</li>
                <li>• Strategic AI adoption patterns beyond individual contributor use</li>
              </ul>
              
              <div className="mt-6">
                <button className="bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                  Share your AI collaboration experiences
                </button>
                <p className="text-sm text-text-light mt-2">
                  Simple form for professional exchanges and pattern testing feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Potential Alpha Testers */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              For Potential Alpha Testers
            </h2>

            <h3 className="text-2xl font-semibold text-text-dark mb-6">
              When Piper Morgan Is Ready for Broader Testing
            </h3>

            <div className="prose max-w-none text-lg text-text-light space-y-6 mb-8">
              <p>
                Right now, Piper Morgan is a learning project focused on methodology development and systematic AI collaboration patterns. The "product" is the methodology more than the technology.
              </p>
              <p>
                Eventually - timeline uncertain - there may be opportunities for others to test Piper Morgan directly. This would involve:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-text-dark mb-4">
                  What alpha testing might look like
                </h4>
                <ul className="space-y-2 text-text-light text-sm">
                  <li>• Testing AI-assisted product management workflows</li>
                  <li>• Providing feedback on multi-agent coordination approaches</li>
                  <li>• Helping refine the human-AI collaboration patterns</li>
                  <li>• Contributing to understanding of how these methodologies scale beyond individual use</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-text-dark mb-4">
                  What we'd be looking for in alpha testers
                </h4>
                <ul className="space-y-2 text-text-light text-sm">
                  <li>• Senior PMs, UX leaders, or strategic practitioners with AI collaboration experience</li>
                  <li>• Interest in systematic approaches over quick wins</li>
                  <li>• Willingness to document what works and what doesn't</li>
                  <li>• Professional context where methodological insights could be valuable</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary-orange/10 p-8 rounded-lg">
              <p className="text-text-dark font-medium mb-4">
                <strong>Current status</strong>: Not ready for alpha testing yet. We're still building foundational capabilities and refining core methodologies.
              </p>
              <p className="text-text-dark font-medium mb-6">
                If you're interested in future alpha opportunities:
              </p>
              <button className="bg-primary-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Interest in alpha testing
              </button>
              <p className="text-sm text-text-light mt-2">
                Capture professional background and AI collaboration experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Organizations and Teams */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              For Organizations and Teams
            </h2>

            <h3 className="text-2xl font-semibold text-text-dark mb-6">
              Strategic AI Collaboration Consulting
            </h3>

            <div className="prose max-w-none text-lg text-text-light space-y-6 mb-8">
              <p>
                The patterns we're discovering through building Piper Morgan appear to have broad applicability for teams and organizations adopting AI tools systematically.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-8 rounded-lg mb-8">
              <h4 className="text-xl font-semibold text-text-dark mb-4">
                Potential areas of collaboration
              </h4>
              <ul className="space-y-2 text-text-light">
                <li>• Strategic AI adoption planning using risk-based evaluation frameworks</li>
                <li>• Team coordination patterns for multi-agent AI workflows</li>
                <li>• Quality assurance approaches for AI-augmented work</li>
                <li>• Change management strategies for systematic AI integration</li>
                <li>• Training and capability development for human-AI collaboration</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <p className="text-text-dark font-medium mb-4">
                <strong>Current availability</strong>: Limited. The primary focus remains methodology development through building Piper Morgan.
              </p>
              <p className="text-text-dark font-medium mb-6">
                If your organization is interested in strategic AI collaboration consulting:
              </p>
              <button className="bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                Organizational AI collaboration inquiry
              </button>
              <p className="text-sm text-text-light mt-2">
                Professional inquiry form with organization context
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For the AI and Product Management Community */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              For the AI and Product Management Community
            </h2>

            <h3 className="text-2xl font-semibold text-text-dark mb-6">
              Contribute to the Pattern Development
            </h3>

            <div className="prose max-w-none text-lg text-text-light space-y-6 mb-8">
              <p>
                This work benefits from diverse perspectives and real-world testing. The most valuable contributions come from practitioners who are also building systematically with AI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-text-dark mb-4">
                  Ways to contribute
                </h4>
                <ul className="space-y-2 text-text-light text-sm">
                  <li>• <strong>Pattern testing</strong>: Try these methodologies in your own context and share results</li>
                  <li>• <strong>Cross-industry insights</strong>: Help us understand which patterns are universal vs. domain-specific</li>
                  <li>• <strong>Scale challenges</strong>: Share experiences with team and organizational AI adoption</li>
                  <li>• <strong>Methodology refinement</strong>: Suggest improvements to frameworks based on practical application</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-text-dark mb-4">
                  What we can offer in return
                </h4>
                <ul className="space-y-2 text-text-light text-sm">
                  <li>• Early access to methodology documentation and pattern updates</li>
                  <li>• Attribution for insights that improve the frameworks</li>
                  <li>• Professional network connections with other systematic AI practitioners</li>
                  <li>• Potential collaboration opportunities on methodology development</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary-teal/10 p-8 rounded-lg">
              <h4 className="text-xl font-semibold text-text-dark mb-4">
                Current collaboration areas
              </h4>
              <ul className="space-y-2 text-text-light mb-6">
                <li>• Excellence Flywheel methodology validation across different roles</li>
                <li>• Multi-agent coordination patterns for various team structures</li>
                <li>• Verification-first approaches for different types of AI output</li>
                <li>• Risk-based decision frameworks for different organizational contexts</li>
              </ul>
              
              <button className="bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                Collaborate on methodology development
              </button>
              <p className="text-sm text-text-light mt-2">
                For serious practitioners interested in systematic AI collaboration pattern development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Questions About Getting Involved */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Questions About Getting Involved?
            </h2>

            <div className="prose max-w-none text-lg text-text-light space-y-6 mb-8">
              <p>
                This is an experiment in building AI systems systematically while sharing the methodology development process in real time. There are many ways to engage depending on your interests and professional context.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-semibold text-text-dark mb-6">Most common questions</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    "What's the best way to follow along if I'm new to AI collaboration?"
                  </h4>
                  <p className="text-text-light text-sm">
                    Start with the Medium series, which provides the most comprehensive view of the methodology development. The LinkedIn newsletter is great for real-time updates but assumes more context.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    "I'm interested in testing these patterns but don't know where to start."
                  </h4>
                  <p className="text-text-light text-sm">
                    Begin with the verification-first pattern in your current AI work - it's the most immediately applicable. Document what works and what doesn't, then expand to other patterns gradually.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    "When will Piper Morgan be available for broader use?"
                  </h4>
                  <p className="text-text-light text-sm">
                    No timeline yet. The focus is methodology development, not product launch. The patterns and frameworks will likely be available before any direct access to Piper Morgan itself.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    "Can these approaches work for non-technical teams?"
                  </h4>
                  <p className="text-text-light text-sm">
                    That's one of the key questions we're exploring. Early evidence suggests yes, but we need more real-world testing across different roles and contexts.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    "Is this going to become a commercial product?"
                  </h4>
                  <p className="text-text-light text-sm">
                    Currently building as a learning project with public methodology sharing. Future decisions about commercialization, open source, or other models will be made transparently as part of the building-in-public approach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Bottom Line */}
      <section className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8 text-center">
              The Bottom Line
            </h2>
            <div className="prose max-w-none text-lg text-text-light space-y-6 text-center mb-8">
              <p>
                We're learning in public because the best discoveries happen when smart people share what actually works. Whether you follow along casually or contribute actively, you're part of developing better approaches to human-AI collaboration.
              </p>
              <p>
                The most valuable engagement is authentic - share what you're genuinely curious about, test what seems applicable to your work, contribute insights from your own systematic AI experiments.
              </p>
              <p>
                Ready to get involved? Pick the level that fits your interest and professional context. The methodology benefits from diverse perspectives and real-world application.
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-text-light italic">
                Questions about any of these options?{' '}
                <a href="mailto:info@pipermorgan.ai" className="text-primary-teal hover:underline">
                  Contact Christian directly
                </a>
                {' '}— this is still a personal project with direct communication.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}