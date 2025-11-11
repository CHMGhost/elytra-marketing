import { PlatformStatusCard } from "@/components/PlatformStatusCard";

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
            Enterprise WordPress Hosting
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Dedicated infrastructure, automated backups, and 24/7 monitoring.
            Built for agencies and businesses that demand reliability.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <a
              href="#contact"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Get Started
            </a>
            <a
              href="/status"
              className="px-6 py-3 border border-neutral-700 hover:border-neutral-600 text-neutral-200 font-semibold rounded-lg transition"
            >
              Platform Status
            </a>
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
              <div className="text-3xl">🚀</div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Dedicated Resources
              </h3>
              <p className="text-neutral-400">
                Each client gets their own DigitalOcean droplet. No shared
                hosting, no performance bottlenecks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-3">
              <div className="text-3xl">💾</div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Automated Backups
              </h3>
              <p className="text-neutral-400">
                Nightly backups with 7-day retention, stored securely in
                off-site object storage.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-3">
              <div className="text-3xl">📊</div>
              <h3 className="text-xl font-semibold text-neutral-100">
                24/7 Monitoring
              </h3>
              <p className="text-neutral-400">
                Automated uptime monitoring and instant alerts. We know about
                issues before you do.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8">
        <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
          <p>&copy; 2025 Elytracloud. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/status" className="hover:text-neutral-300 transition">
              Status
            </a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-300 transition">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-300 transition">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export const metadata = {
  title: "Elytracloud - Enterprise WordPress Hosting",
  description:
    "Dedicated infrastructure, automated backups, and 24/7 monitoring for WordPress sites.",
};
