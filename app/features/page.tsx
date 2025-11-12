import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import {
  Activity,
  Feather,
  LifeBuoy,
  Lock,
  Mountain,
  Server,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Why Elytracloud | Managed WordPress Features",
  description:
    "Why agencies and growing businesses choose Elytracloud: isolated environments, layered security, reliable backups, proactive monitoring, and direct access to the engineer running your stack.",
  openGraph: {
    title: "Why Elytracloud | Managed WordPress Features",
    description:
      "Isolated hosting environments, layered security, daily backups, real-time monitoring, and hands-on support from the person who built the platform.",
    url: "https://elytracloud.com/features",
    siteName: "Elytracloud",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud managed WordPress features",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Elytracloud | Managed WordPress Features",
    description:
      "Isolated hosting environments, layered security, daily backups, real-time monitoring, and hands-on support from the person who built the platform.",
    images: ["/og-default.png"],
  },
};

const pillars = [
  {
    icon: Server,
    title: "Dedicated, Isolated Environments",
    description:
      "Every site runs on its own hardened stack. No noisy neighbors, predictable performance, and clean security boundaries by design.",
    highlight: "Each plan starts with its own isolated environment — not shared cPanel.",
  },
  {
    icon: Lock,
    title: "Layered Security from Day One",
    description:
      "Cloudflare edge protection, automatic SSL, sane defaults, and WordPress hardening applied for you. No copy-pasting guides, no guessing.",
    highlight: "Security is treated as part of the platform, not an add-on plugin list.",
  },
  {
    icon: Activity,
    title: "Backups, Monitoring & Recovery",
    description:
      "Nightly off-site backups, uptime monitoring, and clear restore paths if an update or deploy goes sideways.",
    highlight: "If something breaks, we can help you get back quickly and safely.",
  },
  {
    icon: LifeBuoy,
    title: "Talk to the Builder, Not a Bot",
    description:
      "Direct access to the engineer running your stack. Incident help, performance tuning, and practical WordPress guidance are part of the relationship.",
    highlight: "You’re never shouting into a ticket void.",
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Apply for Beta",
    description:
      "Tell us about your site and current hosting. We confirm fit, answer questions, and schedule your migration window.",
    duration: "~5 minutes",
  },
  {
    step: "02",
    title: "Provision & Harden",
    description:
      "We spin up your dedicated environment and wire in SSL, backups, monitoring, and edge protections following our standard playbook.",
    duration: "Ready within minutes once accepted",
  },
  {
    step: "03",
    title: "Content Migration",
    description:
      "We migrate your WordPress content for you or hand you staging access if you prefer to DIY with our guidance.",
    duration: "Typically same day",
  },
  {
    step: "04",
    title: "Go Live & Check-In",
    description:
      "Switch DNS, watch the monitors, and optionally review performance and caching with us once traffic has settled.",
    duration: "Launch + follow-up",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 bg-blue-600/10 border border-blue-600/30 px-4 py-2 rounded-full">
            <span>Why Elytracloud</span>
            <span>Purpose-built managed WordPress</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">
            We run the infrastructure so your WordPress never has to be “DIY” again
          </h1>
          <p className="text-lg md:text-xl text-neutral-300">
            Elytracloud is an opinionated, engineer-led platform: isolated environments,
            layered security, real monitoring, and direct access to the person who built it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              View Shell / Wing / Apex Plans
            </Link>
            <Link
              href="/status"
              className="px-6 py-3 border border-neutral-700 hover:border-neutral-600 text-neutral-200 font-semibold rounded-lg transition"
            >
              View Platform Status
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-50">
            Layers of protection and performance, not just bigger servers
          </h2>
          <p className="text-neutral-400">
            Elytracloud grows with you — from <span className="text-blue-400 font-semibold">Shell</span>{" "}
            to <span className="text-blue-400 font-semibold">Wing</span>{" "}
            to <span className="text-blue-400 font-semibold">Apex</span>. Each layer adds more isolation, tuning,
            and access to engineering support, so your hosting evolves with your workload.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 space-y-2">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-400/40">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-neutral-100">Shell</h3>
            <p className="text-xs text-neutral-400">
              Your foundation of protection — dedicated environment, sane defaults, and managed backups for smaller but serious sites.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 space-y-2">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-500/10 border border-blue-400/40">
              <Feather className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-semibold text-neutral-100">Wing</h3>
            <p className="text-xs text-neutral-400">
              Performance that lifts your site higher — staging, tuned caching, and faster support for agencies and growing brands.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 space-y-2">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-400/40">
              <Mountain className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-neutral-100">Apex</h3>
            <p className="text-xs text-neutral-400">
              Engineered for altitude — dedicated database, advanced tuning, and direct access to the engineer running your stack.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 space-y-12">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center rounded-2xl border border-neutral-800 bg-neutral-950/60 p-8 transition duration-300 hover:border-blue-600/60 hover:bg-neutral-900/70"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-500/10 border border-blue-400/30">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-neutral-50">
                    {pillar.title}
                  </h2>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div className="relative h-40 md:h-44 rounded-xl border border-dashed border-neutral-800 bg-neutral-950/70 flex items-center justify-center px-4 text-sm text-neutral-500 text-center">
                <span>{pillar.highlight}</span>
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />
              </div>
            </div>
          );
        })}
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto text-center text-neutral-300">
          <p>
            Elytracloud is built for agencies, SaaS products, and businesses that have outgrown cheap shared hosting and want a dedicated, managed WordPress stack run by someone who actually reads logs and watches uptime.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How onboarding works</h2>
          <p className="text-neutral-300">
            A straightforward, human onboarding flow so you know exactly what happens after you raise your hand.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {onboardingSteps.map((step) => (
            <div
              key={step.step}
              className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-600/50"
            >
              <div className="text-xs font-semibold tracking-widest text-neutral-500">
                STEP {step.step}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-neutral-50">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                {step.description}
              </p>
              <p className="mt-4 text-xs font-medium text-blue-300 uppercase">
                {step.duration}
              </p>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-10">
          <h2 className="text-3xl font-bold text-neutral-50">
            Ready to move off DIY hosting?
          </h2>
          <p className="text-neutral-300 text-lg">
            Founding member beta spots are limited. Choose Shell, Wing, or Apex and get white-glove onboarding directly from the engineer who runs Elytracloud.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            View Plans & Apply for Beta
          </Link>
        </div>
      </section>

      <ContactSection type="general" />
    </main>
  );
}
