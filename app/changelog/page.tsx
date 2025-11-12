import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Changelog | Elytracloud",
  description:
    "Follow the cadence of Elytracloud launches, infrastructure upgrades, and product polish as we move through the private beta.",
  openGraph: {
    title: "Changelog | Elytracloud",
    description:
      "Follow the cadence of Elytracloud launches, infrastructure upgrades, and product polish as we move through the private beta.",
    url: "https://elytracloud.com/changelog",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud changelog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog | Elytracloud",
    description:
      "Follow the cadence of Elytracloud launches, infrastructure upgrades, and product polish as we move through the private beta.",
    images: ["/og-default.png"],
  },
};

const releases = [
  {
    version: "0.3.0",
    dateLabel: "Nov 10, 2025",
    dateISO: "2025-11-10",
    title: "Phase 3 complete",
    summary:
      "Stood up the backend automation that powers the public status page, including Uptime Kuma integration, backup verification, and automated Spaces publishing.",
    highlights: [
      "Added Python CLI for status generation and DigitalOcean Spaces uploads",
      "Documented backend setup, deployment steps, and troubleshooting",
      "Wired daily backup health checks into the monitoring flow",
    ],
  },
  {
    version: "0.2.0",
    dateLabel: "Nov 10, 2025",
    dateISO: "2025-11-10",
    title: "Phase 2 complete",
    summary:
      "Refined the marketing site status experience with caching, analytics, and production deploy configs so the public status page feels dependable.",
    highlights: [
      "Introduced 10 minute revalidation for status data and stale alerts",
      "Added analytics events for success, error, and stale responses",
      "Published deployment guide and platform configuration for Vercel",
    ],
  },
  {
    version: "0.1.0",
    dateLabel: "Nov 10, 2025",
    dateISO: "2025-11-10",
    title: "Phase 1 complete",
    summary:
      "Launched the first version of the Elytracloud marketing experience with the status card, hero story, and foundational documentation.",
    highlights: [
      "Shipped Next.js 14 app router foundation with Tailwind styling",
      "Created reusable platform status component with mock scenarios",
      "Documented testing matrix and implementation guide for the team",
    ],
  },
];

const upcoming = [
  {
    title: "Phase 4: Production rollout",
    detail:
      "Deploy the marketing site, wire uptime monitors, and begin collecting beta feedback across Shell, Wing, and Apex tenants.",
  },
  {
    title: "Client onboarding polish",
    detail:
      "Capture early beta testimonials, publish onboarding guide refinements, and surface trusted logos on the homepage.",
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="max-w-3xl space-y-4">
          <Link href="/" className="text-sm text-blue-300 hover:text-blue-200">
            &larr; Back to home
          </Link>
          <h1 className="text-4xl font-bold">Changelog</h1>
          <p className="text-neutral-300 text-lg">
            Tracking the commits that matter to customers. Every entry reflects the product work that moves Elytracloud closer to
            public beta and the sites we safeguard.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl space-y-8">
          {releases.map((release) => (
            <article
              key={release.version}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
                    {release.version}
                  </span>
                  <span className="text-sm text-neutral-400">{release.title}</span>
                </div>
                <time className="text-sm text-neutral-500" dateTime={release.dateISO}>
                  {release.dateLabel}
                </time>
              </div>
              <p className="text-neutral-200">{release.summary}</p>
              <ul className="list-disc space-y-2 pl-6 text-neutral-300">
                {release.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}

          <section className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6 space-y-3">
            <h2 className="text-xl font-semibold text-neutral-100">Up next</h2>
            <ul className="space-y-2 text-neutral-200">
              {upcoming.map((item) => (
                <li key={item.title}>
                  <span className="font-semibold text-neutral-100">{item.title}:</span> {item.detail}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <ContactSection type="general" />
    </main>
  );
}
