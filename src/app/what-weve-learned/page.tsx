import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/domain-utils";
import { Hero } from "@/components";

const seoData = generateSEOMetadata(
  "What We've Learned - AI Development Insights by Christian Crumlish",
  "Discoveries from three months of systematic AI development that counter conventional wisdom. Practical insights for PM and UX leaders from building-in-public methodology development.",
  { canonical: "https://pipermorgan.ai/what-weve-learned" }
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

export default function WhatWeveLearnedPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        headline="What We've Learned:"
        highlightText="Building AI Systems That Actually Work"
        subheadline="Insights from three months of intensive AI development by Christian Crumlish - discoveries that counter conventional AI wisdom and demonstrate systematic human-AI collaboration."
        primaryCTA={{
          text: "See How Our Methodology Works",
          href: "/how-it-works",
        }}
        secondaryCTA={{
          text: "Follow the Journey",
          href: "/get-involved",
        }}
        background="gradient"
        align="center"
        showLogo={true}
      />

      {/* Meet Christian - Credibility Context */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-8 rounded-card mb-16">
              <h2 className="text-3xl font-bold text-text-dark mb-6">
                Meet Christian: The Context Behind These Discoveries
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg text-text-light mb-6">
                    Christian Crumlish is a product management professional with
                    deep expertise in civic technology, systematic methodology
                    development, and AI integration. Through building Piper
                    Morgan, he's demonstrating how AI can systematically enhance
                    rather than replace human PM expertise.
                  </p>
                  <ul className="space-y-2 text-text-light">
                    <li>
                      •{" "}
                      <strong className="text-text-dark">
                        Director of Product Management
                      </strong>{" "}
                      with civic technology focus at Kind Systems
                    </li>
                    <li>
                      •{" "}
                      <strong className="text-text-dark">
                        AI Integration Pioneer
                      </strong>{" "}
                      developing practical human-AI collaboration patterns
                    </li>
                    <li>
                      •{" "}
                      <strong className="text-text-dark">
                        Systematic Excellence Advocate
                      </strong>{" "}
                      proving rigorous methodology accelerates development
                    </li>
                    <li>
                      •{" "}
                      <strong className="text-text-dark">
                        Building-in-Public Practitioner
                      </strong>{" "}
                      sharing every decision and lesson learned
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-3">
                    Vision for PM × AI
                  </h4>
                  <p className="text-text-light mb-4">
                    "AI doesn't replace PM judgment—it amplifies it
                    systematically. Through transparent methodology development
                    and ethical-first architecture, we're proving that human-AI
                    collaboration can achieve capabilities neither could reach
                    alone."
                  </p>
                  <p className="text-text-light">
                    <strong>Current Mission:</strong> Demonstrate that
                    AI-augmented product management, done with systematic
                    excellence, creates compound value that transforms strategic
                    work.
                  </p>
                </div>
              </div>

              <div className="bg-white/50 p-6 rounded-lg mt-8">
                <h4 className="font-semibold text-text-dark mb-3">
                  Why This Context Matters
                </h4>
                <p className="text-text-light">
                  The insights shared below come from hands-on experience
                  building an AI system systematically while maintaining PM
                  judgment and strategic thinking. This isn't theoretical AI
                  advice—it's battle-tested patterns from actual development
                  work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Integration */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="bg-white p-6 rounded-card shadow-sm max-w-md mx-auto">
              <p className="text-text-dark font-semibold mb-2">
                Building-in-Public Community
              </p>
              <p className="text-2xl font-bold text-primary-teal">635+</p>
              <p className="text-text-light">
                PM professionals following this systematic methodology
                development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Biggest Surprise */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              The Biggest Surprise: Verification Accelerates Rather Than Slows
              Development
            </h2>

            <div className="bg-primary-teal/10 p-8 rounded-lg mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-text-dark mb-3">
                    What everyone assumes
                  </h3>
                  <p className="text-text-light mb-4">
                    Checking AI work takes extra time and slows down the "AI
                    speed advantage."
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-dark mb-3">
                    What we discovered
                  </h3>
                  <p className="text-text-light mb-4">
                    Systematic verification actually makes AI development
                    faster, not slower.
                  </p>
                </div>
              </div>

              <div className="border-t border-primary-teal/20 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-text-dark mb-3">
                  The evidence
                </h3>
                <p className="text-text-light mb-4">
                  Our 15-minute ADR (Architecture Decision Record) migration
                  pattern became our most reliable development accelerator.
                  Instead of debugging mysterious failures hours later, we catch
                  misalignment immediately and course-correct in real time.
                </p>

                <div className="bg-white p-4 rounded-lg mt-4">
                  <p className="text-text-dark font-medium">
                    <strong>Strategic insight for leaders</strong>: AI tools
                    that encourage verification aren't slower - they're more
                    sustainable. Budget for systematic checking up front, save
                    time on debugging later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Insights Grid */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 space-y-0">
              {/* Context Problem */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-text-dark mb-6">
                  The Context Problem: AI Memory vs. AI Understanding
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What everyone assumes
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      AI tools with longer context windows solve the "AI forgets
                      what we were doing" problem.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What we discovered
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      Context length doesn't solve context quality. AI can
                      "remember" everything and still misunderstand what you're
                      trying to accomplish.
                    </p>
                  </div>

                  <div className="bg-primary-teal/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-text-dark mb-2">
                      Strategic insight
                    </h4>
                    <p className="text-text-light text-sm">
                      When evaluating AI tools, ask about role clarity and
                      handoff protocols, not just context window size. A focused
                      AI assistant beats a confused AI encyclopedia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Skill Evolution */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-text-dark mb-6">
                  The Skill Evolution Reality: "I Am Not a Programmer" Still
                  True
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What everyone assumes
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      Using AI for development means you need to become
                      technical or AI will replace non-technical roles.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What we discovered
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      The most valuable skill is systematic thinking about
                      problems, not technical implementation. Six months of
                      AI-assisted development and I'm still fundamentally a PM
                      orchestrating intelligent tools.
                    </p>
                  </div>

                  <div className="bg-primary-orange/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-text-dark mb-2">
                      Strategic insight
                    </h4>
                    <p className="text-text-light text-sm">
                      Invest in systematic thinking skills and process clarity,
                      not just AI tool training. The professionals who thrive
                      with AI are the ones who can clearly define what success
                      looks like.
                    </p>
                  </div>
                </div>
              </div>

              {/* Integration Paradox */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-text-dark mb-6">
                  The Integration Paradox: Simple Tools, Complex Orchestration
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What everyone assumes
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      AI will simplify workflows by replacing multiple tools
                      with one intelligent assistant.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What we discovered
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      The most powerful AI applications use multiple specialized
                      tools with sophisticated coordination, not one
                      general-purpose tool.
                    </p>
                  </div>

                  <div className="bg-primary-teal/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-text-dark mb-2">
                      Strategic insight
                    </h4>
                    <p className="text-text-light text-sm">
                      Plan for AI tool portfolios, not AI tool replacement. The
                      organizations that win with AI will be those that excel at
                      multi-tool coordination, not those that find the one
                      perfect AI solution.
                    </p>
                  </div>
                </div>
              </div>

              {/* Documentation Discovery */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-text-dark mb-6">
                  The Documentation Discovery: AI Changes What's Worth Capturing
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What everyone assumes
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      AI eliminates the need for documentation because AI can
                      figure things out.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What we discovered
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      AI makes certain types of documentation incredibly
                      valuable and other types obsolete. The skill is knowing
                      which is which.
                    </p>
                  </div>

                  <div className="bg-primary-orange/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-text-dark mb-2">
                      Strategic insight
                    </h4>
                    <p className="text-text-light text-sm">
                      Invest in decision documentation and pattern capture, not
                      detailed process manuals. AI can recreate the "how" if
                      you've clearly documented the "what" and "why."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Key Insights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Quality Paradox */}
            <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-text-dark mb-6">
                The Quality Paradox: Higher Standards, Faster Delivery
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    What everyone assumes
                  </h4>
                  <p className="text-text-light text-sm">
                    AI development means accepting "good enough" quality in
                    exchange for speed.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    What we discovered
                  </h4>
                  <p className="text-text-light text-sm">
                    AI enables higher quality standards because systematic
                    approaches scale better than manual approaches.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    Strategic insight
                  </h4>
                  <p className="text-text-light text-sm">
                    Use AI adoption as an opportunity to raise quality
                    standards, not lower them. Organizations with strong
                    systematic practices will see the biggest AI benefits.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-text-light">
                  <strong>The evidence</strong>: Our test-driven development
                  patterns work better with AI than without because AI excels at
                  systematic implementation of clear specifications. We catch
                  more edge cases and handle more scenarios because AI doesn't
                  get bored with thoroughness.
                </p>
              </div>
            </div>

            {/* Human Factor */}
            <div className="bg-gradient-to-r from-primary-orange/5 to-primary-teal/5 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-text-dark mb-6">
                The Human Factor: AI Makes Soft Skills More Important, Not Less
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    What everyone assumes
                  </h4>
                  <p className="text-text-light text-sm">
                    AI reduces the importance of communication, stakeholder
                    management, and other "soft skills" because AI handles more
                    of the technical work.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    What we discovered
                  </h4>
                  <p className="text-text-light text-sm">
                    AI amplifies the impact of human judgment, strategic
                    thinking, and relationship skills. Technical execution
                    becomes easier; strategic alignment becomes more critical.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    Strategic insight
                  </h4>
                  <p className="text-text-light text-sm">
                    AI adoption requires investment in strategic thinking and
                    communication skills, not just technical training. The
                    bottleneck shifts from implementation capacity to alignment
                    quality.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-text-light">
                  <strong>The evidence</strong>: Our biggest project risks come
                  from misaligned objectives or unclear requirements, not
                  technical implementation failures. AI makes it easier to build
                  the wrong thing efficiently.
                </p>
              </div>
            </div>

            {/* Iteration Insight */}
            <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-text-dark mb-6">
                The Iteration Insight: AI Changes How You Learn From Mistakes
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    What everyone assumes
                  </h4>
                  <p className="text-text-light text-sm">
                    AI reduces the importance of learning from mistakes because
                    AI handles more of the error-prone work.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    What we discovered
                  </h4>
                  <p className="text-text-light text-sm">
                    AI changes what types of mistakes you make and how quickly
                    you can learn from them. Pattern recognition becomes more
                    valuable than error prevention.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    Strategic insight
                  </h4>
                  <p className="text-text-light text-sm">
                    Build organizational capabilities for rapid iteration and
                    course correction, not just careful planning. AI
                    environments reward adaptive learning over comprehensive
                    foresight.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-text-light">
                  <strong>The evidence</strong>: We make different mistakes now
                  - more strategic misalignment, fewer technical bugs. But we
                  catch and correct strategic mistakes much faster because AI
                  enables rapid iteration on approach, not just implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Scale */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Transparency Advantage */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-text-dark mb-6">
                  The Transparency Advantage: Showing Your Work Builds
                  Confidence
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What everyone assumes
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      AI development should hide the complexity and present
                      clean final results.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What we discovered
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      Transparent AI development processes build more
                      stakeholder confidence than polished presentations of AI
                      output.
                    </p>
                  </div>

                  <div className="bg-primary-teal/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-text-dark mb-2">
                      The evidence
                    </h4>
                    <p className="text-text-light text-sm mb-3">
                      Our building-in-public approach generated more
                      professional interest and credibility than traditional
                      product development approaches. People trust AI-augmented
                      work more when they can see the systematic thinking behind
                      it.
                    </p>
                    <p className="text-text-dark font-medium text-sm">
                      <strong>Strategic insight</strong>: Invest in process
                      transparency and documentation systems. The ability to
                      show how AI-augmented decisions were made becomes a
                      strategic differentiator.
                    </p>
                  </div>
                </div>
              </div>

              {/* Scale Reality */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-text-dark mb-6">
                  The Scale Reality: Patterns That Work at Small Scale Need
                  Conscious Design to Scale
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What everyone assumes
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      AI patterns that work for individual contributors
                      automatically scale to teams and organizations.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-dark mb-2">
                      What we discovered
                    </h4>
                    <p className="text-text-light text-sm mb-4">
                      Scaling AI collaboration requires explicit coordination
                      design, not just tool deployment. The patterns that work
                      for one PM need systematic adaptation for teams.
                    </p>
                  </div>

                  <div className="bg-primary-orange/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-text-dark mb-2">
                      The evidence
                    </h4>
                    <p className="text-text-light text-sm mb-3">
                      Our multi-agent coordination patterns work well for
                      individual development but require additional handoff
                      protocols and alignment mechanisms when multiple people
                      are involved.
                    </p>
                    <p className="text-text-dark font-medium text-sm">
                      <strong>Strategic insight</strong>: Plan for AI
                      coordination systems, not just AI tool rollouts. The
                      organizations that scale AI successfully will be those
                      that invest in collaboration design, not just capability
                      deployment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What This Means */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
              What This Means for Your AI Strategy
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-primary-teal/10 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  If You're Just Getting Started
                </h3>
                <ul className="space-y-3 text-text-light">
                  <li>
                    <strong>Start with verification habits</strong>: Build
                    systematic checking into your AI workflow from day one.
                    Quality-first approaches pay dividends immediately.
                  </li>
                  <li>
                    <strong>Focus on problem definition</strong>: The biggest AI
                    wins come from clear specifications, not clever prompting.
                    Invest in requirements thinking.
                  </li>
                  <li>
                    <strong>Plan for coordination</strong>: Even if you're
                    working individually, design your AI workflow for eventual
                    team collaboration.
                  </li>
                </ul>
              </div>

              <div className="bg-primary-orange/10 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  If You're Already Using AI
                </h3>
                <ul className="space-y-3 text-text-light">
                  <li>
                    <strong>Audit for systematic approaches</strong>: Which of
                    your current AI uses follow repeatable patterns? Which are
                    ad hoc? Systematize what's working.
                  </li>
                  <li>
                    <strong>Evaluate your tool portfolio</strong>: Are you
                    trying to make one AI tool do everything, or are you
                    strategically deploying different tools for different tasks?
                  </li>
                  <li>
                    <strong>Document strategic decisions</strong>: Capture the
                    "why" behind AI approaches, not just the "how." Future you
                    (and your team) will thank you.
                  </li>
                </ul>
              </div>

              <div className="bg-primary-teal/10 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  If You're Leading AI Adoption
                </h3>
                <ul className="space-y-3 text-text-light">
                  <li>
                    <strong>Invest in process design</strong>: The biggest AI
                    ROI comes from systematic approaches to AI collaboration,
                    not just tool deployment.
                  </li>
                  <li>
                    <strong>Plan for skill evolution</strong>: Budget for
                    strategic thinking development, not just AI tool training.
                    The bottleneck is alignment quality, not implementation
                    capacity.
                  </li>
                  <li>
                    <strong>Build transparency systems</strong>: Stakeholder
                    confidence in AI-augmented work comes from visible
                    systematic processes, not just impressive outputs.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Line */}
      <section className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              The Bottom Line
            </h2>
            <div className="prose max-w-none text-lg text-text-light space-y-6">
              <p>
                Three months of intensive AI development taught us that the
                future isn't human vs. AI or even human + AI. It's{" "}
                <strong>
                  systematic human intelligence orchestrating systematic AI
                  capabilities
                </strong>
                .
              </p>
              <p>
                The professionals and organizations that understand this
                distinction will build sustainable competitive advantages while
                others cycle through AI tools looking for magic solutions.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              <p className="text-lg text-text-light">
                <strong>
                  Want to see how these insights apply in practice?
                </strong>{" "}
                Follow the{" "}
                <a
                  href="https://medium.com/building-piper-morgan"
                  className="text-primary-teal hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Building Piper Morgan series
                </a>{" "}
                where we document ongoing discoveries - including the inevitable
                mistakes and course corrections.
              </p>
              <p className="text-lg text-text-light">
                <strong>Ready to test these patterns in your own work?</strong>{" "}
                <a
                  href="/get-involved"
                  className="text-primary-teal hover:underline"
                >
                  Get involved
                </a>{" "}
                - we're always looking for perspectives from other practitioners
                who are building systematically with AI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
