import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';

const seoData = generateSEOMetadata(
  'Terms - Piper Morgan',
  'What you are agreeing to when you use the Piper Morgan beta: who owns your work, who sees it, how your key is handled, and how to leave.',
  { canonical: 'https://pipermorgan.ai/terms' }
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

const sections: Array<[string, string]> = [
  [`Your work is yours`, `What you put into Piper stays yours. We use it to run Piper for you. Your messages, uploaded files, AI provider key and connected-account access are encrypted when stored. Your to-dos, projects, lists and account details are stored but not encrypted by the app. It all lives on our hosting provider, Fly.io, in San Jose, California.`],
  [`Who sees it`, `Piper sends your messages, and anything they add from the tools you connect (such as calendar or GitHub items you ask about), to Anthropic under your own key. From there, Anthropic's own terms and privacy policy apply. Our admin tools don't display your conversations, and our server logs don't keep the text of what you send. The app has no analytics or ad tracking.`],
  [`Your key`, `Piper runs on your own Anthropic key. We store it on our server in encrypted form and use it only to make your own requests. We hold the key that unlocks it, so in principle we could read it. Please use a key with a spending limit you're comfortable with. We don't read it on purpose. You can remove your key in Settings at any time, and that deletes it from our live database. Our encrypted backups can keep it for up to about five days. To cut off access completely, also revoke the key in Anthropic's console, so it stops working for Piper too.`],
  [`When Piper acts for you`, `Piper checks with you before making most changes. If you tell them directly to do something, such as "Create a GitHub issue," Piper will do it right away, treating a plain instruction as the go. Piper always asks before deleting something of yours. There's no undo yet, so take that question seriously!`],
  [`When something breaks`, `We expect you'll hit rough edges. We'll include a short list of the most egregious known issues with your invitation. When you find something new, send feedback from the left-hand menu once you're in the app, or email support@pipermorgan.ai. Either way the message will be read by the team, including by me (xian), the human who owns this particular loop.`],
  [`Brief restarts`, `Piper may restart briefly when we ship an update, usually at a quiet moment. You'll stay signed in, and your conversation will still be there. If a message gets no reply around the time of a restart, just send it again.`],
  [`If the database stops`, `Recovery is automatic and usually takes 15 to 30 minutes. The alert reaches me either way.`],
  [`Leaving`, `You can download your uploaded files, and what Piper has learned about how you work. Exporting your conversations and to-dos is the goal, and isn't built yet. There's no delete-account button yet either. If you'd like to delete your account, just email support@pipermorgan.ai and we'll delete your account and everything in it within 14 days. Deleting a single conversation inside Piper isn't possible yet. The roadmap includes the ability to put things in trash and to empty it for good yourself, so we hope to get there before too long.`],
  [`Your invite code`, `Your code works once, for one account. Please don't share it. If it leaks before you use it, tell us and we'll cancel it. Once used, it can't be taken back, because the account exists. We won't publish who our testers are, and we won't quote you without asking first.`],
  [`What this beta is`, `Expect errors, and go carefully. Using your real work is OK.`],
  [``, `Before Production, we'll add deleting a conversation for good, deleting your account in the app, exporting your conversations and to-dos, and undo. Today, the sections above describe what's true.`],
  [`Who it's for`, `Piper Morgan is an assistant who gets it for product managers and for people making products who need the support of a product manager and don't have a human one at hand.`],
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="site-container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-dark mb-8">
            Terms
          </h1>

          <div className="prose prose-lg max-w-none space-y-8 text-text-light">
            <div className="bg-primary-teal/10 p-6 rounded-lg mb-8">
              <p className="text-text-dark font-medium mb-2">
                <strong>Last updated:</strong> October 30, 2026
              </p>
              <p className="text-text-dark">
                For how we handle personal information on this website, see our <a href="/privacy/" className="text-primary-teal-text hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-text-dark mb-4">
              What you&apos;re agreeing to, in plain language
            </h2>

            {sections.map(([heading, body]) => (
              <section key={heading || body}>
                {heading && (
                  <h3 className="text-xl font-semibold text-text-dark mb-3">{heading}</h3>
                )}
                <p className="mb-6">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
