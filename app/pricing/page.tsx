import type { Metadata } from "next";
import {
  Check,
  Minus,
  Feather,
  Mountain,
  Shield,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing Plans | Elytracloud - Shell, Wing, Apex",
  description:
    "Shell, Wing, and Apex managed WordPress plans that scale protection, performance, and control as you grow.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-100">
            Shell, Wing, Apex — managed WordPress that grows with you
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Elytracloud layers protection, performance, and control just like an elytra shields a wing.
            Start with Shell’s hardened foundation, add Wing for lift, and reach Apex when uptime is revenue.
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg border border-blue-600/40 bg-blue-600/15 px-4 py-3 text-sm text-blue-200">
            <Sparkles className="h-4 w-4" />
            <span>Founding beta pricing — limited to the first 10 teams.</span>
          </div>
          <p className="text-xs text-neutral-500">Annual plans save 2 months.</p>
        </div>

        <p className="mt-12 max-w-3xl mx-auto text-center text-neutral-400">
          Elytracloud grows with you — from <span className="font-semibold text-emerald-300">Shell</span>{" "}
          to <span className="font-semibold text-blue-300">Wing</span>{" "}
          to <span className="font-semibold text-indigo-300">Apex</span>. Each layer adds more protection,
          performance, and direct control over your WordPress environment.
        </p>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 max-w-6xl mx-auto md:grid-cols-3">
          {/* Shell Plan */}
          <div className="flex flex-col rounded-xl border border-emerald-500/20 bg-neutral-950/60 p-8">
            <div className="space-y-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-100">Shell</h3>
              <p className="text-sm italic text-neutral-400">Your foundation of protection.</p>
              <p className="text-neutral-400">
                Managed WordPress for teams that want a hardened baseline without taking on ops. Ideal for
                production sites graduating from shared hosting.
              </p>
            </div>

            <div className="mt-6 border-t border-neutral-800 pt-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-neutral-100">$39</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <p className="mt-1 text-neutral-500">or $390/year (save $78)</p>
              <div className="mt-3 text-center text-xs text-neutral-500">
                Founding beta pricing • limited to the first 10 teams
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
                Layer highlights
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-emerald-400" />
                  <span>Isolated droplet with tuned nginx + PHP-FPM</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-emerald-400" />
                  <span>Cloudflare WAF, automatic SSL, and login hardening pre-configured</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-emerald-400" />
                  <span>50 GB NVMe storage and unmetered bandwidth</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-emerald-400" />
                  <span>Daily off-site backups with 7-day retention</span>
                </li>
              </ul>
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
                Managed for you
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-emerald-400" />
                  <span>WordPress core + plugin updates and security patches</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-emerald-400" />
                  <span>Email deliverability setup (SendGrid)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-emerald-400" />
                  <span>24/7 monitoring with incident response when alerts fire</span>
                </li>
              </ul>
            </div>

            <button className="mt-auto w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Apply for Beta
            </button>
          </div>

          {/* Wing Plan */}
          <div className="relative flex flex-col rounded-xl border-2 border-blue-500/40 bg-neutral-950/70 p-8 shadow-lg shadow-blue-900/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                Most Popular
              </span>
            </div>

            <div className="space-y-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300">
                <Feather className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-100">Wing</h3>
              <p className="text-sm italic text-neutral-400">Performance that lifts your site higher.</p>
              <p className="text-neutral-400">
                Perfect for agencies and growing brands that need staging, tuned caching, and priority access to the
                engineer running your platform.
              </p>
            </div>

            <div className="mt-6 border-t border-neutral-800 pt-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-neutral-100">$79</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <p className="mt-1 text-neutral-500">or $790/year (save $158)</p>
              <div className="mt-3 text-center text-xs text-neutral-500">
                Founding beta pricing • limited to the first 10 teams
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
                Everything in Shell, plus
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-blue-400" />
                  <span>2× compute resources (~150K visits) and 100 GB NVMe storage</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-blue-400" />
                  <span>Dedicated staging environment with guided deploys</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-blue-400" />
                  <span>Enhanced caching and performance tuning baked in</span>
                </li>
              </ul>
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
                Managed for growth
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-blue-400" />
                  <span>Self-service backup + restore with UpdraftPlus configured</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-blue-400" />
                  <span>14-day backup retention with on-demand snapshots</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-blue-400" />
                  <span>Priority email support (target 12 hours)</span>
                </li>
              </ul>
            </div>

            <button className="mt-auto w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Apply for Beta
            </button>
          </div>

          {/* Apex Plan */}
          <div className="flex flex-col rounded-xl border border-indigo-500/20 bg-neutral-950/60 p-8">
            <div className="space-y-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300">
                <Mountain className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-100">Apex</h3>
              <p className="text-sm italic text-neutral-400">Engineered for altitude.</p>
              <p className="text-neutral-400">
                Built for mission-critical WordPress — revenue-driving storefronts, membership platforms, and complex
                integrations that demand direct engineer access.
              </p>
            </div>

            <div className="mt-6 border-t border-neutral-800 pt-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-neutral-100">$149</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <p className="mt-1 text-neutral-500">or $1,490/year (save $298)</p>
              <div className="mt-3 text-center text-xs text-neutral-500">
                Founding beta pricing • limited to the first 10 teams
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
                Everything in Wing, plus
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-indigo-400" />
                  <span>4× compute resources (500K+ visits) with dedicated database cluster</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-indigo-400" />
                  <span>200 GB NVMe storage and traffic burst planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-indigo-400" />
                  <span>Custom Nginx/PHP tuning for launches and campaigns</span>
                </li>
              </ul>
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
                White-glove ops
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-indigo-400" />
                  <span>30-day backup retention + proactive restore drills</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-indigo-400" />
                  <span>Advanced malware scanning and security playbooks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 text-indigo-400" />
                  <span>Direct Slack access to the engineer running your stack (4h target response)</span>
                </li>
              </ul>
            </div>

            <button className="mt-auto w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Apply for Beta
            </button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-100 text-center mb-12">
            Detailed Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-4 px-4 text-neutral-300 font-semibold">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 text-neutral-300 font-semibold">
                    Shell
                  </th>
                  <th className="text-center py-4 px-4 text-neutral-300 font-semibold">
                    Wing
                  </th>
                  <th className="text-center py-4 px-4 text-neutral-300 font-semibold">
                    Apex
                  </th>
                </tr>
              </thead>
              <tbody className="text-neutral-400">
                {/* Infrastructure */}
                <tr className="border-b border-neutral-800">
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-neutral-200 font-semibold bg-neutral-900/50"
                  >
                    Infrastructure
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Ideal For</td>
                  <td className="text-center py-3 px-4 text-neutral-300">Blogs & small businesses</td>
                  <td className="text-center py-3 px-4 text-neutral-300">Agencies & growing brands</td>
                  <td className="text-center py-3 px-4 text-neutral-300">High-traffic / e-commerce</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">CPU</td>
                  <td className="text-center py-3 px-4">1 vCPU</td>
                  <td className="text-center py-3 px-4">2 vCPU</td>
                  <td className="text-center py-3 px-4">4 vCPU</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">RAM</td>
                  <td className="text-center py-3 px-4">2GB</td>
                  <td className="text-center py-3 px-4">4GB</td>
                  <td className="text-center py-3 px-4">8GB</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Storage</td>
                  <td className="text-center py-3 px-4">50GB SSD</td>
                  <td className="text-center py-3 px-4">100GB SSD</td>
                  <td className="text-center py-3 px-4">200GB SSD</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Bandwidth</td>
                  <td className="text-center py-3 px-4">Unmetered</td>
                  <td className="text-center py-3 px-4">Unmetered</td>
                  <td className="text-center py-3 px-4">Unmetered</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Database</td>
                  <td className="text-center py-3 px-4">Managed MySQL (shared cluster)</td>
                  <td className="text-center py-3 px-4">Managed MySQL (HA cluster)</td>
                  <td className="text-center py-3 px-4">Dedicated MySQL 8.0</td>
                </tr>

                {/* WordPress */}
                <tr className="border-b border-neutral-800">
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-neutral-200 font-semibold bg-neutral-900/50"
                  >
                    WordPress Platform
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">WordPress Version</td>
                  <td className="text-center py-3 px-4 text-green-500">6.8</td>
                  <td className="text-center py-3 px-4 text-green-500">6.8</td>
                  <td className="text-center py-3 px-4 text-green-500">6.8</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">PHP Version</td>
                  <td className="text-center py-3 px-4 text-green-500">8.2</td>
                  <td className="text-center py-3 px-4 text-green-500">8.2</td>
                  <td className="text-center py-3 px-4 text-green-500">8.2</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Automatic Updates</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">WP-CLI Access</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">SSH Access</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>

                {/* Security */}
                <tr className="border-b border-neutral-800">
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-neutral-200 font-semibold bg-neutral-900/50"
                  >
                    Security
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Automatic SSL (managed & auto-renewed)</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Cloudflare WAF + DDoS</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Login Protection</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Wordfence hardening</td>
                  <td className="text-center py-3 px-4">
                    <Minus className="mx-auto h-4 w-4 text-neutral-600" />
                  </td>
                  <td className="text-center py-3 px-4 text-yellow-500">Configured on request</td>
                  <td className="text-center py-3 px-4 text-green-500">Configured & tuned</td>
                </tr>

                {/* Performance */}
                <tr className="border-b border-neutral-800">
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-neutral-200 font-semibold bg-neutral-900/50"
                  >
                    Performance
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Cloudflare CDN</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">nginx FastCGI Cache</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Brotli Compression</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>

                {/* Backups */}
                <tr className="border-b border-neutral-800">
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-neutral-200 font-semibold bg-neutral-900/50"
                  >
                    Backups & Recovery
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Automated Backups</td>
                  <td className="text-center py-3 px-4 text-green-500">
                    Daily
                  </td>
                  <td className="text-center py-3 px-4 text-green-500">
                    Daily
                  </td>
                  <td className="text-center py-3 px-4 text-green-500">
                    Daily
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Retention Period</td>
                  <td className="text-center py-3 px-4">7 days</td>
                  <td className="text-center py-3 px-4">14 days</td>
                  <td className="text-center py-3 px-4">30 days</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">UpdraftPlus</td>
                  <td className="text-center py-3 px-4 text-yellow-500">Available on request</td>
                  <td className="text-center py-3 px-4 text-green-500">Configured for you</td>
                  <td className="text-center py-3 px-4 text-green-500">Configured & monitored</td>
                </tr>

                {/* Support */}
                <tr className="border-b border-neutral-800">
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-neutral-200 font-semibold bg-neutral-900/50"
                  >
                    Support
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">24/7 Monitoring</td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Email Support Response</td>
                  <td className="text-center py-3 px-4">24-48h</td>
                  <td className="text-center py-3 px-4">12h</td>
                  <td className="text-center py-3 px-4">4h</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Direct Developer Access</td>
                  <td className="text-center py-3 px-4">
                    <Minus className="mx-auto h-4 w-4 text-neutral-600" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Minus className="mx-auto h-4 w-4 text-neutral-600" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Staging Environment</td>
                  <td className="text-center py-3 px-4">
                    <Minus className="mx-auto h-4 w-4 text-neutral-600" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-100 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                What does "early access pricing" mean?
              </h3>
              <p className="text-neutral-400">
                The first 10 customers lock in these rates as long as they stay subscribed.
                After that, new customers will see pricing that reflects sustainable public tiers.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                What's actually "managed"?
              </h3>
              <p className="text-neutral-400">
                Security patches, WordPress core and plugin updates, daily backups, uptime monitoring,
                SSL renewal, email configuration, and performance tuning. Each site lives on its own
                isolated infrastructure, so we can troubleshoot fast while you focus on content.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                How does annual billing work?
              </h3>
              <p className="text-neutral-400">
                Pay for 10 months, get 12. For example: Shell is $39/month or $390/year (save $78).
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-neutral-400">
                We accept all major credit cards, PayPal, and wire transfers for
                annual plans. Contact us for custom payment arrangements.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-neutral-400">
                Yes, you can change your plan at any time. Upgrades take effect
                immediately, and downgrades at the end of your billing cycle.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                What happens if I exceed my traffic limits?
              </h3>
              <p className="text-neutral-400">
                Traffic estimates are guidelines. Your site will continue to run
                smoothly, and we'll reach out to discuss upgrading to a higher
                tier if needed.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                Do you offer money-back guarantees?
              </h3>
              <p className="text-neutral-400">
                Yes, we offer a 30-day money-back guarantee. If you're not
                satisfied, we'll refund your payment, no questions asked.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                Can I host multiple sites on one plan?
              </h3>
              <p className="text-neutral-400">
                Each plan includes one fully managed WordPress site on its own isolated server. Need multiple sites?
                Add additional plans or reach out and we can bundle an agency package.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                How quickly can I get set up?
              </h3>
              <p className="text-neutral-400">
                Once we approve your beta application, provisioning takes a few minutes. We configure WordPress,
                SSL, backups, and monitoring, then send credentials so you can start building right away.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 max-w-4xl mx-auto text-center space-y-6 border border-neutral-800 rounded-xl p-12 bg-neutral-950/60">
          <h2 className="text-3xl font-bold text-neutral-100">
            Questions about hosting?
          </h2>
          <p className="text-xl text-neutral-400">
            Get in touch directly — built and maintained by a solo developer who
            actually answers emails.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="mailto:hello@elytracloud.com"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Get in Touch
            </a>
            <a
              href="/status"
              className="px-8 py-4 border border-neutral-700 hover:border-neutral-600 text-neutral-200 font-semibold rounded-lg transition"
            >
              View Platform Status
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
