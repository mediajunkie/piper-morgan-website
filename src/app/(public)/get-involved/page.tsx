import type { Metadata } from "next";
import Link from "next/link";
import { generateSEOMetadata } from "@/lib/domain-utils";
import { Hero, CTAButton } from "@/components";

const seoData = generateSEOMetadata(
  "Get Involved - Help Build Piper Morgan",
  "Piper Morgan is an open project. The code is public. The methodology is documented. Join alpha testing, contribute code, or share your expertise.",
  { canonical: "https://pipermorgan.ai/get-involved" }
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

export default function GetInvolvedPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="Help build Piper Morgan"
        subheadline={
          <p className="text-lg md:text-xl">
            Piper Morgan is an open project. The code is public. The methodology is documented.
            And we&apos;re actively looking for people who want to contribute.
          </p>
        }
        background="gradient"
        align="center"
      />

      {/* Ways to Get Involved */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white mb-12">
              Ways to get involved
            </h2>

            <div className="space-y-12">
              {/* Test and give feedback */}
              <div>
                <h3 className="text-xl font-bold text-text-dark dark:text-white mb-4">
                  Test and give feedback
                </h3>
                <p className="text-lg text-text-light dark:text-gray-400 mb-4">
                  The most valuable contribution is using Piper and telling us what works and what doesn&apos;t.
                  Join the alpha if you&apos;re ready to dive in.
                </p>
                <CTAButton href="/try/alpha" variant="outline">
                  Join the alpha →
                </CTAButton>
              </div>

              {/* Contribute code */}
              <div>
                <h3 className="text-xl font-bold text-text-dark dark:text-white mb-4">
                  Contribute code
                </h3>
                <p className="text-lg text-text-light dark:text-gray-400 mb-4">
                  Piper is built in Python with a FastAPI backend. Check out the repository and our
                  contribution guidelines on pmorgan.tech.
                </p>
                <div className="flex flex-wrap gap-4">
                  <CTAButton href="https://github.com/mediajunkie" variant="outline" external>
                    View on GitHub →
                  </CTAButton>
                  <CTAButton href="https://pmorgan.tech" variant="outline" external>
                    Read the docs →
                  </CTAButton>
                </div>
              </div>

              {/* Share your expertise */}
              <div>
                <h3 className="text-xl font-bold text-text-dark dark:text-white mb-4">
                  Share your expertise
                </h3>
                <p className="text-lg text-text-light dark:text-gray-400 mb-4">
                  We&apos;re especially interested in hearing from PMs, UX designers, and AI ethics practitioners.
                  If you have perspective to share, we&apos;d love to talk.
                </p>
                <CTAButton href="mailto:contribute@pipermorgan.ai" variant="outline">
                  Email us →
                </CTAButton>
              </div>

              {/* Follow the journey */}
              <div>
                <h3 className="text-xl font-bold text-text-dark dark:text-white mb-4">
                  Follow the journey
                </h3>
                <p className="text-lg text-text-light dark:text-gray-400 mb-4">
                  Not ready to contribute yet? Follow along. Subscribe to the blog, star the repo,
                  or just check in from time to time.
                </p>
                <CTAButton href="/blog" variant="outline">
                  Read the blog →
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contribute */}
      <section className="py-16 md:py-24 bg-surface dark:bg-gray-900">
        <div className="site-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white mb-12">
              Why contribute to Piper Morgan?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-text-dark dark:text-white mb-4">
                  Shape something early
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  This isn&apos;t a mature product looking for free labor. It&apos;s an active experiment
                  in human-AI collaboration, and your input genuinely influences direction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-text-dark dark:text-white mb-4">
                  Learn in public
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  Our development methodology is documented in detail. Contributing means learning how we
                  approach systematic AI development — and helping refine it.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-text-dark dark:text-white mb-4">
                  Build your portfolio
                </h3>
                <p className="text-text-light dark:text-gray-400">
                  Open source contributions you can point to. Blog posts about what you learned.
                  A project with a public track record.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white mb-6">
              Questions?
            </h2>
            <p className="text-lg text-text-light dark:text-gray-400 mb-8">
              Reach out at{" "}
              <a
                href="mailto:contribute@pipermorgan.ai"
                className="text-primary-teal-text hover:underline"
              >
                contribute@pipermorgan.ai
              </a>
              {" "}— we&apos;re friendly.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <section className="py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="site-container">
          <div className="flex justify-between items-center text-sm">
            <Link
              href="/about"
              className="text-text-light dark:text-gray-500 hover:text-primary-teal-text dark:hover:text-primary-teal"
            >
              ← About the project
            </Link>
            <Link
              href="/try"
              className="text-text-light dark:text-gray-500 hover:text-primary-teal-text dark:hover:text-primary-teal"
            >
              Try Piper →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
