import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';

const seoData = generateSEOMetadata(
  'How It Works - Systematic AI Collaboration',
  'The methodology behind building Piper Morgan and how you can apply these patterns to your own AI work',
  { canonical: 'https://pipermorgan.ai/how-it-works' }
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

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-teal/10 to-primary-orange/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
              How It Works
            </h1>
            <p className="text-xl text-text-light mb-8">
              The methodology behind building Piper Morgan - and how you can apply these patterns to your own AI work
            </p>
          </div>
        </div>
      </section>

      {/* Core Insight */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              The Core Insight
            </h2>
            <div className="prose max-w-none text-lg text-text-light space-y-6">
              <p>
                Most AI adoption fails because people treat it like magic instead of like a tool that requires systematic thinking. The patterns we've discovered while building Piper Morgan work because they respect both human judgment and AI capabilities - without confusion about which is which.
              </p>
              <p>
                Here's how we think about human-AI collaboration, and why it's working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Five Patterns */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
              The Five Patterns That Make It Work
            </h2>

            <div className="space-y-16">
              {/* Pattern 1: Verification-First */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-start mb-6">
                  <div className="bg-primary-teal text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-text-dark mb-4">
                      Verification-First: Trust But Always Verify
                    </h3>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">The Problem</h4>
                    <p className="text-text-light mb-6">
                      AI output looks authoritative even when it's wrong. Most people either trust AI completely or reject it entirely.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">Our Pattern</h4>
                    <p className="text-text-light">
                      Systematic verification before action, not random checking after problems emerge.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">How It Works in Practice</h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>• <strong>Before accepting AI suggestions</strong>: Ask "How can I verify this is correct?"</li>
                      <li>• <strong>During implementation</strong>: Build in checkpoints, not just at the end</li>
                      <li>• <strong>After completion</strong>: Document what verification methods actually caught issues</li>
                    </ul>

                    <div className="bg-primary-teal/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">Practical Framework</h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>• <strong>Technical claims</strong>: Can I test this quickly?</li>
                        <li>• <strong>Strategic recommendations</strong>: Does this align with what I know about the context?</li>
                        <li>• <strong>Implementation suggestions</strong>: What would go wrong if this is incorrect?</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pattern 2: Multi-Agent Coordination */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-start mb-6">
                  <div className="bg-primary-orange text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-text-dark mb-4">
                      Multi-Agent Coordination: Different Tools for Different Jobs
                    </h3>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">The Problem</h4>
                    <p className="text-text-light mb-6">
                      Most people try to use ChatGPT (or Claude, or whatever) for everything and get frustrated when it doesn't excel at all tasks.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">Our Pattern</h4>
                    <p className="text-text-light">
                      Strategic deployment of different AI tools based on their specific strengths, with clear handoff protocols.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">How It Works in Practice</h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>• <strong>Analysis and strategy</strong>: One tool for thinking through problems</li>
                      <li>• <strong>Implementation and execution</strong>: Different tool for getting things done</li>
                      <li>• <strong>Review and refinement</strong>: Third approach for quality assurance</li>
                      <li>• <strong>Clear handoffs</strong>: Explicit documentation of what each tool should focus on</li>
                    </ul>

                    <div className="bg-primary-orange/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">Practical Framework</h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>• <strong>Map your workflow</strong>: What are the distinct types of thinking you need?</li>
                        <li>• <strong>Match tools to strengths</strong>: Which AI tools excel at which types of work?</li>
                        <li>• <strong>Design handoffs</strong>: How do you transfer context between tools/sessions?</li>
                        <li>• <strong>Track what works</strong>: Which combinations produce the best results?</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pattern 3: Excellence Flywheel */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-start mb-6">
                  <div className="bg-primary-teal text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-text-dark mb-4">
                      Excellence Flywheel: Quality and Speed Reinforce Each Other
                    </h3>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">The Problem</h4>
                    <p className="text-text-light mb-6">
                      Most people think AI means choosing between speed and quality. Move fast and break things, or slow down and get it right.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">Our Pattern</h4>
                    <p className="text-text-light">
                      Systematic approaches that make quality faster, not slower.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">How It Works in Practice</h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>• <strong>Good systems reduce debugging time</strong>: Verification catches issues early</li>
                      <li>• <strong>Quality patterns speed up future work</strong>: Doing it right once creates reusable approaches</li>
                      <li>• <strong>Documentation accelerates iteration</strong>: Clear records prevent re-solving solved problems</li>
                      <li>• <strong>Systematic thinking prevents AI rabbit holes</strong>: Clear objectives keep sessions focused</li>
                    </ul>

                    <div className="bg-primary-teal/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">Practical Framework</h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>• <strong>Start with clear objectives</strong>: What specific outcome do you need?</li>
                        <li>• <strong>Design your verification approach first</strong>: How will you know if the AI delivered what you need?</li>
                        <li>• <strong>Document patterns that work</strong>: What AI prompting/workflow approaches consistently deliver quality?</li>
                        <li>• <strong>Iterate the system, not just the output</strong>: Improve your process, not just individual results</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pattern 4: Context-Driven Decisions */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-start mb-6">
                  <div className="bg-primary-orange text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-text-dark mb-4">
                      Context-Driven Decisions: "It Depends" Made Systematic
                    </h3>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">The Problem</h4>
                    <p className="text-text-light mb-6">
                      Most AI advice is generic. But the best PM/UX decisions are highly contextual - same situation, different approaches based on specific constraints and goals.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">Our Pattern</h4>
                    <p className="text-text-light">
                      Systematic frameworks for adapting AI approaches based on specific context and requirements.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">How It Works in Practice</h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>• <strong>Assess the stakes</strong>: High-risk vs. low-risk decisions need different AI approaches</li>
                      <li>• <strong>Consider the timeline</strong>: Quick exploration vs. thorough analysis require different strategies</li>
                      <li>• <strong>Match the audience</strong>: Technical implementation vs. strategic communication need different AI assistance</li>
                      <li>• <strong>Evaluate the constraints</strong>: What limitations should guide the AI approach?</li>
                    </ul>

                    <div className="bg-primary-orange/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">Practical Framework</h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>• <strong>Stakes assessment</strong>: What happens if this is wrong? (Influences verification level)</li>
                        <li>• <strong>Timeline constraints</strong>: How much time do you have? (Influences depth vs. speed trade-offs)</li>
                        <li>• <strong>Audience considerations</strong>: Who will use/evaluate this output? (Influences communication approach)</li>
                        <li>• <strong>Resource constraints</strong>: What tools/information are available? (Influences AI tool selection)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pattern 5: Risk-Based Evaluation */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-start mb-6">
                  <div className="bg-primary-teal text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-text-dark mb-4">
                      Risk-Based Evaluation: Strategic Framework for AI Decisions
                    </h3>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">The Problem</h4>
                    <p className="text-text-light mb-6">
                      Most AI adoption happens ad hoc - people try tools randomly without systematic evaluation of what could go wrong or right.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">Our Pattern</h4>
                    <p className="text-text-light">
                      Structured approach to evaluating AI implementations across technical, business, and human dimensions.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">How It Works in Practice</h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>• <strong>Technical risks</strong>: What could break? How would you know? How would you fix it?</li>
                      <li>• <strong>Business risks</strong>: What are the opportunity costs? Resource implications? Strategic alignment?</li>
                      <li>• <strong>Human risks</strong>: How does this change work patterns? What skills need development?</li>
                      <li>• <strong>Integration risks</strong>: How does this fit with existing tools and processes?</li>
                    </ul>

                    <div className="bg-primary-teal/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">Practical Framework</h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>• <strong>Technical evaluation</strong>: Reliability, integration complexity, maintenance requirements</li>
                        <li>• <strong>Business evaluation</strong>: ROI timeline, resource requirements, strategic fit</li>
                        <li>• <strong>Human evaluation</strong>: Learning curve, change management, skill development needs</li>
                        <li>• <strong>Risk mitigation</strong>: What safeguards reduce downside while preserving upside?</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Approach Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Why This Approach Works
            </h2>

            <div className="space-y-8">
              <div className="bg-primary-teal/10 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  It Respects Both Human and AI Capabilities
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">Human strengths</h4>
                    <p className="text-text-light text-sm">Strategic thinking, contextual judgment, stakeholder relationships, ethical reasoning</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">AI strengths</h4>
                    <p className="text-text-light text-sm">Pattern recognition, rapid iteration, comprehensive analysis, consistent execution</p>
                  </div>
                </div>
                <p className="text-text-dark font-medium mt-4">
                  <strong>The integration</strong>: Humans set direction and make judgments; AI accelerates systematic execution
                </p>
              </div>

              <div className="bg-primary-orange/10 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  It Scales From Individual Tasks to Complex Projects
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li>• <strong>15-minute tasks</strong>: Quick verification, single-agent approach, minimal documentation</li>
                  <li>• <strong>Multi-week projects</strong>: Full pattern integration, multi-agent coordination, comprehensive documentation</li>
                  <li>• <strong>Organizational initiatives</strong>: Strategic frameworks, risk evaluation, change management</li>
                </ul>
              </div>

              <div className="bg-primary-teal/10 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  It Builds Confidence Through Transparency
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li>• <strong>Every step documented</strong>: No black box AI magic - you can see how decisions were made</li>
                  <li>• <strong>Verification built in</strong>: You know when to trust the output and when to dig deeper</li>
                  <li>• <strong>Patterns emerge</strong>: You get better at AI collaboration over time because you can see what works</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
              Getting Started
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  If You're New to AI Collaboration
                </h3>
                <ol className="space-y-3 text-text-light">
                  <li><strong>1. Start with Verification-First</strong>: Pick one AI tool and one type of task. Build systematic checking habits before expanding.</li>
                  <li><strong>2. Document what works</strong>: Keep notes on which prompts, approaches, and verification methods produce good results.</li>
                  <li><strong>3. Expand gradually</strong>: Add new tools or new types of tasks only after you've established good patterns with current ones.</li>
                </ol>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  If You're Already Using AI Tools
                </h3>
                <ol className="space-y-3 text-text-light">
                  <li><strong>1. Audit your current approach</strong>: Which of these patterns are you already using informally?</li>
                  <li><strong>2. Systematize what's working</strong>: Turn informal habits into explicit frameworks you can teach others.</li>
                  <li><strong>3. Address the gaps</strong>: Which patterns would help with your current AI collaboration challenges?</li>
                </ol>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  If You're Evaluating AI for Your Organization
                </h3>
                <ol className="space-y-3 text-text-light">
                  <li><strong>1. Start with Risk-Based Evaluation</strong>: Use the framework to assess potential AI implementations systematically.</li>
                  <li><strong>2. Pilot with Excellence Flywheel</strong>: Test whether quality-first approaches actually accelerate results.</li>
                  <li><strong>3. Build capability systematically</strong>: Focus on developing organizational competence in human-AI collaboration, not just tool adoption.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Still Learning */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              What We're Still Learning
            </h2>
            <div className="prose max-w-none text-lg text-text-light space-y-6">
              <p>
                This methodology emerges from building Piper Morgan, but the patterns appear to apply beyond product management and software development. We're continuing to test these approaches and document what works.
              </p>

              <div className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-text-dark mb-4">Current areas of exploration</h3>
                <ul className="space-y-2 text-text-light">
                  <li>• How these patterns apply to different roles and industries</li>
                  <li>• Which verification approaches are most effective for different types of AI output</li>
                  <li>• How to scale multi-agent coordination across larger teams</li>
                  <li>• Integration with existing product development and design workflows</li>
                </ul>
              </div>

              <div className="text-center pt-8">
                <p className="mb-6">
                  <strong>Want to follow along?</strong> The <a href="https://medium.com/building-piper-morgan" className="text-primary-teal hover:underline" target="_blank" rel="noopener noreferrer">Building Piper Morgan blog series</a> documents our ongoing discoveries, including the failures and course corrections.
                </p>
                <p>
                  <strong>Interested in testing these patterns?</strong> <a href="/get-involved" className="text-primary-teal hover:underline">Get involved</a> - we're always looking for perspectives from other practitioners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}