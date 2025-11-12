import type { Metadata } from "next";
import Link from "next/link";
import { Activity, HardDrive, Server } from "lucide-react";
import { PlatformStatusCard } from "@/components/PlatformStatusCard";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Elytracloud - Enterprise WordPress Hosting",
  description:
    "Dedicated infrastructure, automated backups, and 24/7 monitoring for serious WordPress sites.",
  openGraph: {
    title: "Elytracloud - Enterprise WordPress Hosting",
    description:
      "Dedicated infrastructure, automated backups, and 24/7 monitoring.",
    url: "https://elytracloud.com",
    siteName: "Elytracloud",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud managed WordPress hosting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elytracloud - Enterprise WordPress Hosting",
    description: "Dedicated infrastructure, automated backups, and 24/7 monitoring.",
    images: ["/og-default.png"],
  },
};

/**
 * Homepage
 * Main landing page for Elytracloud marketing site
 */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-100">
            Managed WordPress, Purpose-Built for Reliability
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Fully managed WordPress on isolated, dedicated infrastructure. We handle updates,
            security, backups, and uptime — you focus on your content, clients, and product.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/pricing"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Explore Managed Plans
            </Link>
            <a
              href="mailto:hello@elytracloud.com?subject=Elytracloud%20Question"
              className="px-6 py-3 border border-neutral-700 hover:border-neutral-600 text-neutral-200 font-semibold rounded-lg transition"
            >
              Contact Support
            </a>
            <Link
              href="/status"
              className="px-6 py-3 border border-neutral-800/80 hover:border-neutral-600 text-neutral-400 text-sm font-medium rounded-lg transition hidden md:inline-flex"
            >
              Platform Status
            </Link>
          </div>
          <div className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-blue-300 bg-blue-600/10 border border-blue-600/30 px-4 py-2 rounded-lg mx-auto">
            <span className="font-semibold">Founding Member Beta</span>
            <span>Limited seats · Locked founding pricing · White-glove onboarding</span>
          </div>
        </div>

        {/* Platform Status Card */}
        <div className="mt-12 max-w-xl mx-auto">
          <PlatformStatusCard />
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-100 text-center mb-12">
            Why Choose Elytracloud?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/40">
                <Server className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Dedicated Environments
              </h3>
              <p className="text-neutral-400">
                Every site runs on its own isolated compute stack. No noisy neighbors,
                predictable performance, and clean security boundaries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/40">
                <HardDrive className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Automated Backups
              </h3>
              <p className="text-neutral-400">
                Nightly off-site backups stored in object storage, with guided restore
                support if an update or deploy goes sideways.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/40">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-100">
                24/7 Monitoring
              </h3>
              <p className="text-neutral-400">
                Continuous uptime monitoring and alerting. If something looks off, we see
                it quickly and act—backed by a public status page for full transparency.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 max-w-3xl mx-auto text-center text-neutral-400">
          <p>
            Built for agencies, SaaS products, and businesses that have
            outgrown cheap shared hosting and want dedicated, managed WordPress
            without hiring an in-house SRE.
          </p>
        </div>
      </div>

      <ContactSection type="general" />

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8">
        <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
          <p>&copy; 2025 Elytracloud. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/pricing" className="hover:text-neutral-300 transition">
              Pricing
            </Link>
            <span>·</span>
            <Link href="/features" className="hover:text-neutral-300 transition">
              Features
            </Link>
            <span>·</span>
            <Link href="/status" className="hover:text-neutral-300 transition">
              Status
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-neutral-300 transition">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-neutral-300 transition">
              Terms
            </Link>
            <span>·</span>
            <Link href="/refund" className="hover:text-neutral-300 transition">
              Refunds
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

