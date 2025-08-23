import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { Hero, NewsletterSignup } from '@/components';

const seoData = generateSEOMetadata(
  'Piper Morgan - Intelligent Product Management Assistant,
  'What started as curiosity about AI-powered product management became a systematic methodology for human-AI collaboration. Follow Christian Crumlish documenting every breakthrough and failure in building-in-public transparency.',
  { canonical: 'https://pipermorgan.ai' }
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

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        headline="Started Out Vibe Coding, Soon Hit the Harder Stuff"
        subheadline={
          <div className="space-y-4">
            <p>
              What started as a curiosity about AI-powered product management has turned into something unexpected: a systematic methodology for human-AI collaboration that actually works.
            </p>
            <p>
              I&apos;m Christian Crumlish (you can also call me <code>xian</code>), and I&apos;ve been documenting every breakthrough, every failure, and every &apos;streamlist command not found&apos; moment of building Piper Morgan—an AI assistant that aims not to replace PM judgment but to amplify it through transparent, systematic collaboration.
            </p>
            <p>
              <strong>This isn&apos;t another AI tool promising to automate your job away.</strong> It&apos;s a learning journey shared in real-time, with all the technical debt and environment setup comedy included.
            </p>
          </div>
        }
        showLogo={true}
        background="gradient"
        align="center"
      />

      {/* What You're Following Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              What we’re doing
            </h2>
            <h3 className="text-2xl font-semibold text-text-dark mb-6">
              Building in public
            </h3>
            <div className="prose max-w-none text-lg text-text-light space-y-6">
              <p>
                When I started this project in May 2025, I had a simple question: Could AI actually help product managers work more systematically, or was this all just hype cycle noise?
              </p>
              <p>
                Within a week I was able to use my prototype to accomplish a simple but meaningful task in my workplace (refining a task description and writing a comment explaining the changes).
              </p>
              <p>
                Turns out, the answer depends entirely on how you approach the collaboration. Skip the systematic thinking, and you get ChatGPT with extra steps. Embrace verification-first development and transparent documentation, and something genuinely useful starts to emerge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We've Discovered Section */}
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-12">
              Discovered so far…
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Excellence Flywheel methodology
                </h3>
                <p className="text-text-light">
                  A <a href="/how-it-works" className="text-primary-teal hover:underline">systematic approach to AI-human collaboration that scales</a> from 15-minute task automation to complex architectural decisions.</a>
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Multi-agent coordination
                </h3>
                <p className="text-text-light">
                  Strategic deployment of specialized AI tools (Claude Code, Cursor, Opus) assigned focused roles with clear separation of concerns and crisp handoff protocols to overcome the “seam” in available tooling today. No more prompt chaos or minimal context loss.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Verification before implementation
                </h3>
                <p className="text-text-light">
                  Every pattern gets tested, every assumption gets checked. Sounds slow, actually accelerates development once you stop debugging assumptions.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  GitHub-first tracking and transparency
                </h3>
                <p className="text-text-light">
                  All work tracked with clear acceptance criteria. Zero architectural drift across 50+ implementations because the process forces explicit decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Reality Check Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Current reality check
            </h2>
            <div className="bg-primary-teal/10 p-8 rounded-lg mb-8">
              <h3 className="text-2xl font-bold text-text-dark mb-4">
                Where we actually are
              </h3>
              <p className="text-lg text-text-light mb-4">
                <strong>This is a learning project that has grown wings.</strong> We're not a startup, we're not taking funding, and we're definitely not claiming to have solved product management.
              </p>
              <p className="text-lg text-text-light">
                What we <em>have</em> done is discover repeatable patterns for AI-augmented PM work that maintain human judgment while systematically capturing and sharing what works.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-text-dark">Recent breakthroughs include:</h4>
              <ul className="text-lg text-text-light space-y-2 pl-6">
                <li>• Multi-agent orchestration baked into workflows with negligible overhead</li>                 <li>• Integration of systematic verification into rapid development cycles</li>
                <li>• Agent coordination patterns that prevent the usual AI collaboration chaos <em>and feed recursively into Piper’s education</em></li>
              </ul>
              <p className="text-lg text-text-light mt-6">
                <strong>What's next:</strong> Continuing to build in public, sharing what we learn, and discovering whether these patterns scale beyond one learning PM and his robot programming assistants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Follow This Journey Section */}
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-12">
              Why follow this journey?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  For founders, senior product people, and UX designers and strategists
                </h3>
                <p className="text-text-light mb-4">
                  If you're curious about AI augmentation that respects human expertise rather than trying to replace it, this project documents patterns you can adapt to your own context.
                </p>
                <ul className="text-sm text-text-light space-y-1">
                  <li>• Real implementation decisions with full context</li>
                  <li>• Failures and course corrections, not just success stories</li>
                  <li>• Systematic approaches to human-AI collaboration</li>
                  <li>• How to maintain quality when everything moves faster</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  For architects, lead developers, unicorns, and other makers
                </h3>
                <p className="text-text-light mb-4">
                  We're documenting not just what we build, but how we think about building it. Every session logged, every architectural decision explained, every comedy-of-errors shared. We also routinely survey our logs to detect new patterns emerging, and we continually experiment with context management and methodology reinforcement <em>and enforcement</em> (checking your work).
                </p>
                <ul className="text-sm text-text-light space-y-1">
                  <li>• Transparent process documentation</li>
                  <li>• Decision frameworks for AI tool selection</li>
                  <li>• Patterns for maintaining systematic excellence under pressure</li>
                  <li>• Evidence that environment setup struggles are universal</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  For other AI-curious professionals
                </h3>
                <p className="text-text-light">
                  Watch how systematic thinking translates AI potential into practical value, without the usual hype cycle noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Get involved
            </h2>
            
            <h3 className="text-2xl font-semibold text-text-dark mb-6">
              Follow the learning
            </h3>
            
            <div className="space-y-6 mb-8">
              <div>
                <p className="text-lg text-text-light mb-4">
                  <strong>Building Piper Morgan</strong> (LinkedIn Newsletter): Daily blog posts narrating the development and architectural design process blow by blow with updates on discoveries, breakthroughs, and the occasional technical debt confessional. (Blog posts lag behind development work by about six weeks now and growing.) Weekly Ships updating progress in real time. Plus, announcements. <a href="https://www.linkedin.com/newsletters/building-piper-morgan-7346158338541305856/" className="text-primary-teal hover:underline" target="_blank" rel="noopener noreferrer">Read or (subscribe to) the newsletter</a>
                 </p>
              </div>
              
              <div>
                <p className="text-lg text-text-light mb-4">
                  <strong>Building Piper Morgan</strong> (Medium Publication): For the impatient, blog posts appear on Medium roughly a week after development and a good six weeks before they make it to LinkedIn (currently), with the last 20 and all process or insight posts always free to read. <a href="https://medium.com/building-piper-morgan" className="text-primary-teal hover:underline" target="_blank" rel="noopener noreferrer">Read the series</a>
                </p>
              </div>

              <div>
                <p className="text-lg text-text-light mb-4">
                  <strong>The Pygmalion Effect</strong> (Rosenverse): A free talk I gave in August 2025 (requires signup) for a primary audience of mid-level and senior UX practitioners, covering the seductive appeal of vibe coding, information architecture saves everything, the Excellence Flywheel, multi-agent coordination patterns, your role isn't disappearing—it's evolving, IA principles for AI system design, from "should designers code?" to systematic AI assistance, the human advocacy imperative, the Bootstrap Moment ahead, what this means for your career, and systematic kindness. <a href="https://rosenverse.rosenfeldmedia.com/videos/the-pygmalion-effect-in-which-a-vibe-coding-experiment-becomes-a-million-lines" className="text-primary-teal hover:underline" target="_blank" rel="noopener noreferrer">Read the series</a>
                </p>
              </div>
              
              <div>
                <p className="text-lg text-text-light">
                  <strong>This Site:</strong> Methodology documentation, pattern catalog, and the occasional deep dive into what we&apos;re learning. For those for whom the blog is a mite too technical (too much Python code!), a new serial we’re working on coming soon: Growing Piper Morgan, with more broadly applicable insights about effectively working with LLMs today on the <strong>orchestration frontier</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

<!-- redundant with the signups above but may be useful when the Growing Piper series starts on this site or when we host the canonical version of the blog series here and do our own newsletter off of LinkedIn?

      {/* Newsletter Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-text-dark mb-6">
              Newsletter: Learning Along
            </h3>
            <p className="text-lg text-text-light mb-8">
              Join other professionals following this building-in-public experiment. Get weekly insights into systematic AI collaboration, delivered with the same transparency as everything else in this project.
            </p>
            
            <div className="bg-surface p-8 rounded-lg mb-8">
              <h4 className="text-xl font-semibold text-text-dark mb-4">What you&apos;ll get:</h4>
              <ul className="space-y-2 text-text-light mb-6">
                <li>• Real discoveries from ongoing development work</li>
                <li>• Patterns you can adapt to your own AI experiments</li>
                <li>• Honest assessments of what works and what doesn&apos;t</li>
                <li>• Early access to methodology documentation</li>
              </ul>
              
              <div className="max-w-md">
                <NewsletterSignup
                  title=""
                  description=""
                  benefits={[]}
                  background="default"
                  compact={true}
                  privacyNotice="No spam, no overselling, no claiming we&apos;ve solved everything. Just sharing what we&apos;re learning as we learn it."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

—>

      {/* Questions Section */}
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Questions?
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-text-light">
                This is an experiment in transparent development and systematic learning. If you&apos;re curious about specific patterns, want to share similar experiences, or just want to follow along, the best way to stay connected is through the newsletter.
              </p>
              <p className="text-lg text-text-light">
                We&apos;re learning in public because the best discoveries happen when smart people share what actually works.
              </p>
              <p className="text-sm text-text-light italic">
                Want to dig deeper? Check out <a href="/how-it-works" className="text-primary-teal hover:underline">How It Works</a> or follow along with the blog..
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
