import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/domain-utils";
import { Hero } from "@/components";
import { MethodologyDiagram } from "@/components/molecules/MethodologyDiagram";

const seoData = generateSEOMetadata(
  "How It Works - Systematic AI Collaboration Methodology",
  "Learn the Excellence Flywheel methodology for AI-human collaboration. Five proven patterns for systematic AI adoption with 15-minute ADR migrations and zero architectural drift.",
  { canonical: "https://pipermorgan.ai/how-it-works" }
);

export const metadata: Metadata = {
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  openGraph: seoData.openGraph,
  twitter: seoData.twitter,
  alternates: {
    canonical: seoData.canonical,
  },
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        headline="How It Works"
        subheadline="The methodology behind building Piper Morgan - and how you can apply these patterns to your own AI work"
        background="gradient"
        align="center"
        showLogo={true}
      />

      {/* Core Insight */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              The Core Insight
            </h2>
            <div className="prose max-w-none text-lg text-text-light space-y-6">
              <p>
                Most AI adoption fails because people treat it like magic
                instead of like a tool that requires systematic thinking. The
                patterns we've discovered while building Piper Morgan work
                because they respect both human judgment and AI capabilities -
                without confusion about which is which.
              </p>
              <p>
                Here's how we think about human-AI collaboration, and why it's
                working.
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

                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      The Problem
                    </h4>
                    <p className="text-text-light mb-6">
                      AI output looks authoritative even when it's wrong. Most
                      people either trust AI completely or reject it entirely.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      Our Pattern
                    </h4>
                    <p className="text-text-light">
                      Systematic verification before action, not random checking
                      after problems emerge.
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <MethodologyDiagram
                      pattern="verification"
                      className="mb-4"
                    />
                    <p className="text-sm text-text-light text-center">
                      Always verify AI suggestions before acting
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      How It Works in Practice
                    </h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>
                        • <strong>Before accepting AI suggestions</strong>: Ask
                        "How can I verify this is correct?"
                      </li>
                      <li>
                        • <strong>During implementation</strong>: Build in
                        checkpoints, not just at the end
                      </li>
                      <li>
                        • <strong>After completion</strong>: Document what
                        verification methods actually caught issues
                      </li>
                    </ul>

                    <div className="bg-primary-teal/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">
                        Practical Framework
                      </h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>
                          • <strong>Technical claims</strong>: Can I test this
                          quickly?
                        </li>
                        <li>
                          • <strong>Strategic recommendations</strong>: Does
                          this align with what I know about the context?
                        </li>
                        <li>
                          • <strong>Implementation suggestions</strong>: What
                          would go wrong if this is incorrect?
                        </li>
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
                      Multi-Agent Coordination: Different Tools for Different
                      Jobs
                    </h3>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      The Problem
                    </h4>
                    <p className="text-text-light mb-6">
                      Most people try to use ChatGPT (or Claude, or whatever)
                      for everything and get frustrated when it doesn't excel at
                      all tasks.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      Our Pattern
                    </h4>
                    <p className="text-text-light">
                      Strategic deployment of different AI tools based on their
                      specific strengths, with clear handoff protocols.
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <MethodologyDiagram
                      pattern="multi-agent"
                      className="mb-4"
                    />
                    <p className="text-sm text-text-light text-center">
                      Coordinate specialized AI tools through clear handoffs
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      How It Works in Practice
                    </h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>
                        • <strong>Analysis and strategy</strong>: One tool for
                        thinking through problems
                      </li>
                      <li>
                        • <strong>Implementation and execution</strong>:
                        Different tool for getting things done
                      </li>
                      <li>
                        • <strong>Review and refinement</strong>: Third approach
                        for quality assurance
                      </li>
                      <li>
                        • <strong>Clear handoffs</strong>: Explicit
                        documentation of what each tool should focus on
                      </li>
                    </ul>

                    <div className="bg-primary-orange/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">
                        Practical Framework
                      </h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>
                          • <strong>Map your workflow</strong>: What are the
                          distinct types of thinking you need?
                        </li>
                        <li>
                          • <strong>Match tools to strengths</strong>: Which AI
                          tools excel at which types of work?
                        </li>
                        <li>
                          • <strong>Design handoffs</strong>: How do you
                          transfer context between tools/sessions?
                        </li>
                        <li>
                          • <strong>Track what works</strong>: Which
                          combinations produce the best results?
                        </li>
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
                      Excellence Flywheel: Quality and Speed Reinforce Each
                      Other
                    </h3>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      The Problem
                    </h4>
                    <p className="text-text-light mb-6">
                      Most people think AI means choosing between speed and
                      quality. Move fast and break things, or slow down and get
                      it right.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      Our Pattern
                    </h4>
                    <p className="text-text-light">
                      Systematic approaches that make quality faster, not
                      slower.
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <MethodologyDiagram pattern="excellence" className="mb-4" />
                    <p className="text-sm text-text-light text-center">
                      Quality systems create a reinforcing cycle of speed and
                      reliability
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      How It Works in Practice
                    </h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>
                        • <strong>Good systems reduce debugging time</strong>:
                        Verification catches issues early
                      </li>
                      <li>
                        • <strong>Quality patterns speed up future work</strong>
                        : Doing it right once creates reusable approaches
                      </li>
                      <li>
                        • <strong>Documentation accelerates iteration</strong>:
                        Clear records prevent re-solving solved problems
                      </li>
                      <li>
                        •{" "}
                        <strong>
                          Systematic thinking prevents AI rabbit holes
                        </strong>
                        : Clear objectives keep sessions focused
                      </li>
                    </ul>

                    <div className="bg-primary-teal/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">
                        Practical Framework
                      </h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>
                          • <strong>Start with clear objectives</strong>: What
                          specific outcome do you need?
                        </li>
                        <li>
                          •{" "}
                          <strong>
                            Design your verification approach first
                          </strong>
                          : How will you know if the AI delivered what you need?
                        </li>
                        <li>
                          • <strong>Document patterns that work</strong>: What
                          AI prompting/workflow approaches consistently deliver
                          quality?
                        </li>
                        <li>
                          •{" "}
                          <strong>
                            Iterate the system, not just the output
                          </strong>
                          : Improve your process, not just individual results
                        </li>
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

                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      The Problem
                    </h4>
                    <p className="text-text-light mb-6">
                      Most AI advice is generic. But the best PM/UX decisions
                      are highly contextual - same situation, different
                      approaches based on specific constraints and goals.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      Our Pattern
                    </h4>
                    <p className="text-text-light">
                      Systematic frameworks for adapting AI approaches based on
                      specific context and requirements.
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <MethodologyDiagram pattern="context" className="mb-4" />
                    <p className="text-sm text-text-light text-center">
                      Adapt AI approach based on stakes, timeline, and audience
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      How It Works in Practice
                    </h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>
                        • <strong>Assess the stakes</strong>: High-risk vs.
                        low-risk decisions need different AI approaches
                      </li>
                      <li>
                        • <strong>Consider the timeline</strong>: Quick
                        exploration vs. thorough analysis require different
                        strategies
                      </li>
                      <li>
                        • <strong>Match the audience</strong>: Technical
                        implementation vs. strategic communication need
                        different AI assistance
                      </li>
                      <li>
                        • <strong>Evaluate the constraints</strong>: What
                        limitations should guide the AI approach?
                      </li>
                    </ul>

                    <div className="bg-primary-orange/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">
                        Practical Framework
                      </h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>
                          • <strong>Stakes assessment</strong>: What happens if
                          this is wrong? (Influences verification level)
                        </li>
                        <li>
                          • <strong>Timeline constraints</strong>: How much time
                          do you have? (Influences depth vs. speed trade-offs)
                        </li>
                        <li>
                          • <strong>Audience considerations</strong>: Who will
                          use/evaluate this output? (Influences communication
                          approach)
                        </li>
                        <li>
                          • <strong>Resource constraints</strong>: What
                          tools/information are available? (Influences AI tool
                          selection)
                        </li>
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
                      Risk-Based Evaluation: Strategic Framework for AI
                      Decisions
                    </h3>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      The Problem
                    </h4>
                    <p className="text-text-light mb-6">
                      Most AI adoption happens ad hoc - people try tools
                      randomly without systematic evaluation of what could go
                      wrong or right.
                    </p>

                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      Our Pattern
                    </h4>
                    <p className="text-text-light">
                      Structured approach to evaluating AI implementations
                      across technical, business, and human dimensions.
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <MethodologyDiagram pattern="risk" className="mb-4" />
                    <p className="text-sm text-text-light text-center">
                      Evaluate AI implementations across technical, business,
                      and human dimensions
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-text-dark mb-3">
                      How It Works in Practice
                    </h4>
                    <ul className="space-y-2 text-text-light mb-6">
                      <li>
                        • <strong>Technical risks</strong>: What could break?
                        How would you know? How would you fix it?
                      </li>
                      <li>
                        • <strong>Business risks</strong>: What are the
                        opportunity costs? Resource implications? Strategic
                        alignment?
                      </li>
                      <li>
                        • <strong>Human risks</strong>: How does this change
                        work patterns? What skills need development?
                      </li>
                      <li>
                        • <strong>Integration risks</strong>: How does this fit
                        with existing tools and processes?
                      </li>
                    </ul>

                    <div className="bg-primary-teal/10 p-4 rounded-lg">
                      <h5 className="font-semibold text-text-dark mb-2">
                        Practical Framework
                      </h5>
                      <ul className="text-sm text-text-light space-y-1">
                        <li>
                          • <strong>Technical evaluation</strong>: Reliability,
                          integration complexity, maintenance requirements
                        </li>
                        <li>
                          • <strong>Business evaluation</strong>: ROI timeline,
                          resource requirements, strategic fit
                        </li>
                        <li>
                          • <strong>Human evaluation</strong>: Learning curve,
                          change management, skill development needs
                        </li>
                        <li>
                          • <strong>Risk mitigation</strong>: What safeguards
                          reduce downside while preserving upside?
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excellence Flywheel Methodology Deep Dive */}
      <section className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-text-dark mb-8 text-center">
              The Excellence Flywheel Methodology
            </h2>
            <p className="text-xl text-text-light mb-12 text-center max-w-4xl mx-auto">
              Our breakthrough methodology turns each implementation into
              accelerated future work. Through systematic verification,
              multi-agent coordination, and transparent development, we've
              achieved implementation speeds that seemed impossible while
              maintaining 100% quality standards.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-white p-8 rounded-card shadow-component">
                <h3 className="text-2xl font-semibold text-text-dark mb-6">
                  The Four Pillars
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      1. Systematic Verification First
                    </h4>
                    <p className="text-text-light text-sm">
                      Always check existing patterns before implementing. This
                      single practice delivers 300-500% speed improvements by
                      eliminating assumption debugging.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      2. Test-Driven Development
                    </h4>
                    <p className="text-text-light text-sm">
                      Tests drive architecture decisions. 100% coverage
                      maintained even during rapid development cycles, ensuring
                      reliability at scale.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      3. Multi-Agent Coordination
                    </h4>
                    <p className="text-text-light text-sm">
                      Strategic deployment of specialized AI agents with clear
                      handoff protocols. Building value systematically rather
                      than working in isolation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      4. GitHub-First Tracking
                    </h4>
                    <p className="text-text-light text-sm">
                      Every decision tracked with clear acceptance criteria and
                      systematic documentation. Zero architectural drift through
                      explicit decision-making.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-card shadow-component">
                <h3 className="text-2xl font-semibold text-text-dark mb-6">
                  Proven Breakthrough Results
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary-teal pl-4">
                    <p className="font-semibold text-text-dark">
                      15-minute ADR migrations
                    </p>
                    <p className="text-text-light text-sm">
                      Previously required 2+ hours of manual work
                    </p>
                  </div>
                  <div className="border-l-4 border-primary-orange pl-4">
                    <p className="font-semibold text-text-dark">
                      Zero architectural drift
                    </p>
                    <p className="text-text-light text-sm">
                      Across 50+ complex implementations
                    </p>
                  </div>
                  <div className="border-l-4 border-primary-teal pl-4">
                    <p className="font-semibold text-text-dark">
                      642x performance improvements
                    </p>
                    <p className="text-text-light text-sm">
                      Through systematic optimization patterns
                    </p>
                  </div>
                  <div className="border-l-4 border-primary-orange pl-4">
                    <p className="font-semibold text-text-dark">
                      100% test success rates
                    </p>
                    <p className="text-text-light text-sm">
                      Maintained during rapid feature development
                    </p>
                  </div>
                  <div className="border-l-4 border-primary-teal pl-4">
                    <p className="font-semibold text-text-dark">
                      Ethics-first architecture
                    </p>
                    <p className="text-text-light text-sm">
                      Makes violations technically impossible
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 p-8 rounded-card">
              <h3 className="text-2xl font-semibold text-text-dark mb-4 text-center">
                The Compound Effect
              </h3>
              <p className="text-text-light text-lg text-center max-w-4xl mx-auto">
                Each verified pattern becomes a reusable asset. Each test
                becomes future confidence. Each documentation update becomes
                team knowledge. This creates a flywheel where every
                implementation makes the next one faster and more reliable.
              </p>
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
                    <h4 className="font-semibold text-text-dark mb-2">
                      Human strengths
                    </h4>
                    <p className="text-text-light text-sm">
                      Strategic thinking, contextual judgment, stakeholder
                      relationships, ethical reasoning
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      AI strengths
                    </h4>
                    <p className="text-text-light text-sm">
                      Pattern recognition, rapid iteration, comprehensive
                      analysis, consistent execution
                    </p>
                  </div>
                </div>
                <p className="text-text-dark font-medium mt-4">
                  <strong>The integration</strong>: Humans set direction and
                  make judgments; AI accelerates systematic execution
                </p>
              </div>

              <div className="bg-primary-orange/10 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  It Scales From Individual Tasks to Complex Projects
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li>
                    • <strong>15-minute tasks</strong>: Quick verification,
                    single-agent approach, minimal documentation
                  </li>
                  <li>
                    • <strong>Multi-week projects</strong>: Full pattern
                    integration, multi-agent coordination, comprehensive
                    documentation
                  </li>
                  <li>
                    • <strong>Organizational initiatives</strong>: Strategic
                    frameworks, risk evaluation, change management
                  </li>
                </ul>
              </div>

              <div className="bg-primary-teal/10 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  It Builds Confidence Through Transparency
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li>
                    • <strong>Every step documented</strong>: No black box AI
                    magic - you can see how decisions were made
                  </li>
                  <li>
                    • <strong>Verification built in</strong>: You know when to
                    trust the output and when to dig deeper
                  </li>
                  <li>
                    • <strong>Patterns emerge</strong>: You get better at AI
                    collaboration over time because you can see what works
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Getting Started */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
              Implementing These Patterns in Your Work
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-card shadow-component">
                <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-4 text-center">
                  If You're New to AI Collaboration
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li>
                    • Start with Verification-First for one AI tool and task
                    type
                  </li>
                  <li>
                    • Document what prompts and approaches work consistently
                  </li>
                  <li>
                    • Build systematic checking habits before expanding scope
                  </li>
                  <li>
                    • Focus on quality patterns over quantity of AI interactions
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-card shadow-component">
                <div className="w-12 h-12 bg-primary-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-4 text-center">
                  If You're Already Using AI Tools
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li>
                    • Audit current approaches against these five patterns
                  </li>
                  <li>
                    • Systematize informal habits into explicit frameworks
                  </li>
                  <li>• Address gaps in verification and coordination</li>
                  <li>
                    • Test Excellence Flywheel approach with current projects
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-card shadow-component">
                <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-4 text-center">
                  If You're Leading AI Adoption
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li>• Use Risk-Based Evaluation for systematic assessment</li>
                  <li>
                    • Pilot Excellence Flywheel to test quality-speed
                    integration
                  </li>
                  <li>
                    • Build organizational competence in human-AI collaboration
                  </li>
                  <li>• Invest in process design alongside tool deployment</li>
                </ul>
              </div>
            </div>

            <div className="bg-surface p-8 rounded-card">
              <h3 className="text-2xl font-semibold text-text-dark mb-6 text-center">
                What We're Still Learning
              </h3>
              <p className="text-text-light mb-6 text-center max-w-4xl mx-auto">
                This methodology emerges from building Piper Morgan, but the
                patterns appear to apply beyond product management and software
                development. We're continuing to test these approaches and
                document what works.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-text-dark mb-3">
                    Current areas of exploration
                  </h4>
                  <ul className="space-y-1 text-text-light">
                    <li>
                      • How patterns apply across different roles and industries
                    </li>
                    <li>
                      • Most effective verification approaches for different AI
                      output types
                    </li>
                    <li>
                      • Scaling multi-agent coordination across larger teams
                    </li>
                    <li>
                      • Integration with existing product development workflows
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-3">
                    Get involved in methodology development
                  </h4>
                  <ul className="space-y-1 text-text-light">
                    <li>
                      • Follow the{" "}
                      <a
                        href="https://medium.com/building-piper-morgan"
                        className="text-primary-teal hover:underline"
                      >
                        Building Piper Morgan series
                      </a>
                    </li>
                    <li>• Test patterns in your own work and share results</li>
                    <li>
                      • Join 635+ PM professionals learning systematic AI
                      collaboration
                    </li>
                    <li>
                      • Contribute perspectives from your professional context
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="/get-involved"
                  className="inline-block bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                >
                  Follow the Methodology Development
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Documentation Link */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary-teal/10 p-8 rounded-card text-center">
              <h3 className="text-2xl font-semibold text-text-dark mb-4">
                Technical Implementation Details
              </h3>
              <p className="text-text-light mb-6 max-w-2xl mx-auto">
                For developers and technical leaders who want to understand the
                architectural decisions, code patterns, and systematic
                development methodology behind these frameworks.
              </p>
              <a
                href="https://pmorgan.tech"
                className="inline-block bg-primary-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Technical Documentation →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
