import Link from "next/link";
import type { Metadata } from "next";
import {
  Activity,
  Headset,
  Server,
  ShieldCheck,
  HardDrive,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Why Elytracloud | Managed WordPress Features",
  description:
    "Discover why agencies and growing businesses choose Elytracloud: isolated WordPress environments, layered security, reliable backups, proactive monitoring, and direct access to the engineer running your stack.",
  openGraph: {
    title: "Why Elytracloud | Managed WordPress Features",
    description:
      "Isolated hosting environments, layered security, daily backups, real-time monitoring, and hands-on support from the person who built the platform.",
    url: "https://elytracloud.com/features",
    siteName: "Elytracloud",
    type: "website",
  },
};

const pillars = [
  {
    title: "Dedicated, Isolated Environments",
    description:
      "Every client runs on its own hardened stack. No noisy neighbors, predictable resource allocation, and clean security boundaries by default.",
  highlight: "Diagram: one site per isolated stack (dedicated resources)",
    icon: Server,
  },
  {
    title: "Layered Security from Day One",
    description:
      "Cloudflare WAF, automatic SSL, IP throttling, and Wordfence hardening ship configured. You get production-ready security without touching a dashboard.",
  highlight: "Diagram: Cloudflare → Elytracloud → WordPress hardening",
    icon: ShieldCheck,
  },
  {
    title: "Resilient Backups & Fast Restores",
    description:
      "Nightly off-site backups land in object storage, with fast, operator-guided restores when you need them. We test the restore path so rollbacks are calm, not chaotic.",
    highlight: "Diagram: nightly backup timeline with restore assist",
    icon: HardDrive,
  },
  {
    title: "Monitoring & Transparency",
    description:
      "Uptime Kuma watches every site, alerting us quickly when something is off. Pair that with our public status page and you always know what we know.",
    highlight: "Screenshot: Uptime dashboard + status.elytracloud.com",
    icon: Activity,
  },
  {
    title: "Talk to the Builder, Not a Bot",
    description:
      "You get direct access to the engineer maintaining your infrastructure. Incident response, performance tuning, and sane WordPress guidance are part of the deal.",
  highlight: "Screenshot: personal support touch / inbox snippet",
    icon: Headset,
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Apply for Beta",
    description:
      "Tell us about your site and current stack. We confirm fit and schedule your migration window.",
    duration: "~5 minutes",
  },
  {
    step: "02",
    title: "Provision & Harden",
    description:
      "We spin up your dedicated environment, wire in Cloudflare, SSL, backups, and monitoring.",
    duration: "2-3 minutes to provision",
  },
  {
    step: "03",
    title: "Content Migration",
    description:
      "We migrate your WordPress content or hand you staging access if you prefer to DIY.",
    duration: "Same day",
  },
  {
    step: "04",
    title: "Go Live & Check-In",
    description:
      "Cut over DNS, watch the monitors, and do a day-30 optimization call to make sure everything feels fast.",
    duration: "Launch + follow-up",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 bg-blue-600/10 border border-blue-600/30 px-4 py-2 rounded-full">
            <span>Why Elytracloud</span>
            <span>Built for agencies & product teams</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">
            Why agencies and growing brands choose Elytracloud over DIY hosting
          </h1>
          <p className="text-lg md:text-xl text-neutral-300">
            You run the WordPress experience. We own the infrastructure, security, monitoring, and on-call response—so you never have to think about servers again.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              View Plans & Lock Beta Pricing
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

      {/* Pillars */}
      <section className="container mx-auto px-4 pb-16 space-y-12">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center rounded-2xl border border-neutral-800 bg-neutral-950/60 p-8 transition duration-300 hover:border-blue-600/60 hover:bg-neutral-900/70"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-600/10 border border-blue-600/40">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-neutral-50">
                  {pillar.title}
                </h2>
                <p className="text-neutral-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div className="relative h-48 md:h-56 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 flex items-center justify-center text-sm text-neutral-500">
                <span>{pillar.highlight}</span>
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />
              </div>
            </div>
          );
        })}
      </section>

      {/* Who it's for */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto text-center text-neutral-300">
          <p>
            Elytracloud is built for agencies, SaaS products, and businesses that have outgrown cheap shared hosting and want dedicated, managed WordPress without hiring an in-house SRE.
          </p>
        </div>
      </section>

      {/* Onboarding timeline */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How onboarding works</h2>
          <p className="text-neutral-300">
            A clear, human onboarding flow so you know exactly what happens after you apply for the beta.
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

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-10">
          <h2 className="text-3xl font-bold text-neutral-50">
            Ready to see the managed difference?
          </h2>
          <p className="text-neutral-300 text-lg">
            Founding member beta spots are limited. Lock in founding member pricing and get white-glove onboarding tailored to your WordPress stack.
          </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              View Plans & Apply for Beta
            </Link>
        </div>
      </section>
    </main>
  );
}
