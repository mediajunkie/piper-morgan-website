import type { Metadata } from "next";
import Link from "next/link";
import { generateSEOMetadata } from "@/lib/domain-utils";
import { Hero, CTAButton } from "@/components";

const seoData = generateSEOMetadata(
  "Piper Morgan - Think Bigger",
  "Piper holds the threads so you can focus on the decision. An AI-powered product management assistant built for how work actually works.",
  { canonical: "https://pipermorgan.ai" }
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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        showLogo={true}
        headline="THINK BIGGER"
        subheadline={
          <p className="text-xl md:text-2xl">
            Piper holds the threads so you can focus on the decision.
          </p>
        }
        primaryCTA={{
          text: "Try Piper Morgan",
          href: "/try",
        }}
        background="gradient"
        align="center"
      />

      {/* Positioning Section */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg md:text-xl text-text-light dark:text-gray-400 leading-relaxed">
              Task managers assume work is items in lists. But your work is connections —
              between people, projects, and priorities at every scale. Decisions ripple.
              Timelines interlock.
            </p>
            <p className="text-xl md:text-2xl font-semibold text-text-dark dark:text-white mt-6">
              Piper is built for that reality.
            </p>
          </div>
        </div>
      </section>

      {/* What Piper Does */}
      <section className="py-16 md:py-24 bg-surface dark:bg-gray-900">
        <div className="site-container">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-dark dark:text-white">
                  Your morning, synthesized
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  Piper pulls together what happened overnight — GitHub activity, calendar shifts,
                  Slack threads — and surfaces what actually matters for your day. Not a firehose. A briefing.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-dark dark:text-white">
                  Decisions with full context
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  When you&apos;re weighing a tradeoff, Piper brings the relevant history: past decisions,
                  stakeholder concerns, timeline impacts. The background you&apos;d have if you could remember everything.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-dark dark:text-white">
                  Tools that talk to each other
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  Piper connects to where your work already lives — GitHub, Notion, Slack, Google Calendar —
                  and sees the relationships between them. No migration required.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-dark dark:text-white">
                  Learning your world
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  Over time, Piper learns your projects, your patterns, your priorities.
                  Not by reading your documents — by understanding how things connect.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-dark dark:text-white">
                  Built in public, from day one
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  Every breakthrough and setback documented. 160+ blog posts. Weekly progress reports.
                  No marketing polish — just the real story of building AI that works.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-dark dark:text-white">
                  Ethics as architecture
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  We don&apos;t just have policies about responsible AI. We built ethical constraints
                  directly into Piper&apos;s foundation. Some behaviors aren&apos;t discouraged — they&apos;re impossible.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-dark dark:text-white">
                  Methodology you can see
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  Our development approach is documented, tested, and open. We call it the Excellence Flywheel.
                  You can read exactly how we work.
                </p>
                <Link
                  href="/methodology"
                  className="inline-block text-primary-teal-text hover:underline font-medium"
                >
                  Learn how we work →
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer CTAs */}
      <section className="py-16 md:py-24 bg-surface dark:bg-gray-900">
        <div className="site-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/get-involved" variant="outline">
                Help shape what Piper becomes
              </CTAButton>
              <CTAButton href="/blog" variant="outline">
                Follow along as we build
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
