import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components";

export const metadata: Metadata = {
  title: "Page Not Found - Piper Morgan",
  description: "The page you're looking for doesn't exist. Explore our AI product management methodology and building-in-public journey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl pt-16 md:pt-24 pb-8 md:pb-12 px-4 text-center">
        {/* 404 Header */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-primary-teal-text mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-dark mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-text-light leading-relaxed max-w-2xl mx-auto">
            Looks like this page got lost in the AI training data. 
            Don't worry – even the best algorithms make mistakes sometimes.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-text-dark mb-6">
            Where would you like to go instead?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Primary Options */}
            <div className="space-y-4">
              <Link 
                href="/"
                className="block p-4 bg-surface rounded-card hover:bg-gray-50 transition-colors group"
              >
                <h4 className="font-semibold text-text-dark group-hover:text-primary-teal-text">
                  🏠 Homepage
                </h4>
                <p className="text-sm text-text-light mt-1">
                  Start from the beginning of our AI PM journey
                </p>
              </Link>
              
              <Link 
                href="/how-it-works"
                className="block p-4 bg-surface rounded-card hover:bg-gray-50 transition-colors group"
              >
                <h4 className="font-semibold text-text-dark group-hover:text-primary-teal-text">
                  ⚙️ How It Works
                </h4>
                <p className="text-sm text-text-light mt-1">
                  Discover our AI-powered product management methodology
                </p>
              </Link>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/what-weve-learned"
                className="block p-4 bg-surface rounded-card hover:bg-gray-50 transition-colors group"
              >
                <h4 className="font-semibold text-text-dark group-hover:text-primary-teal-text">
                  💡 What We've Learned
                </h4>
                <p className="text-sm text-text-light mt-1">
                  Building-in-public insights and breakthroughs
                </p>
              </Link>
              
              <Link 
                href="/get-involved"
                className="block p-4 bg-surface rounded-card hover:bg-gray-50 transition-colors group"
              >
                <h4 className="font-semibold text-text-dark group-hover:text-primary-teal-text">
                  🚀 Get Involved
                </h4>
                <p className="text-sm text-text-light mt-1">
                  Join our community and stay updated
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-text-light mb-6">
            Still can't find what you're looking for?
          </p>
          <CTAButton
            href="/get-involved"
            variant="primary"
            size="lg"
          >
            Get Help & Stay Updated
          </CTAButton>
        </div>

        {/* Fun AI-themed message */}
        <div className="mt-12 p-6 bg-gray-50 rounded-card max-w-lg mx-auto">
          <p className="text-sm text-text-light italic">
            💬 <strong>Piper Morgan says:</strong> "Even the most sophisticated 
            neural networks occasionally return null. Let's navigate back to 
            more productive paths together!"
          </p>
        </div>
      </div>
    </div>
  );
}