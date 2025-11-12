import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "How to request a migration | Elytracloud",
  description:
    "Step-by-step guide for requesting a managed migration to Elytracloud, including credential handoff and scheduling.",
  openGraph: {
    title: "How to request a migration | Elytracloud",
    description:
      "Step-by-step guide for requesting a managed migration to Elytracloud, including credential handoff and scheduling.",
    url: "https://elytracloud.com/docs/request-migration",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud migration request guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to request a migration | Elytracloud",
    description:
      "Step-by-step guide for requesting a managed migration to Elytracloud, including credential handoff and scheduling.",
    images: ["/og-default.png"],
  },
};

export default function RequestMigrationPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="max-w-3xl space-y-4">
          <Link href="/docs" className="text-sm text-blue-300 hover:text-blue-200">
            &larr; Back to knowledge base
          </Link>
          <h1 className="text-4xl font-bold">How to request a migration</h1>
          <p className="text-neutral-300 text-lg">
            We handle the heavy lifting. Follow these steps so we can move your WordPress site safely and with minimal downtime.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl space-y-8">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">1. Confirm your migration window</h2>
            <p className="text-neutral-300">
              Reply to your onboarding email with the date and time range that works best. We can move during business hours or
              overnight depending on your traffic profile.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">2. Share credentials securely</h2>
            <p className="text-neutral-300">
              We provide a one-time secure form for sending hosting control panel, SFTP, database, and WordPress admin access.
              If you prefer, GPG encrypted email or 1Password share links work too.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">3. Decide how you want DNS handled</h2>
            <p className="text-neutral-300">
              You can update DNS yourself once we give the go-ahead, or we can do it for you with temporary access. We always
              validate SSL and monitoring before any switch.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">4. Review the post-migration checklist</h2>
            <p className="text-neutral-300">
              After the move we send a quick checklist: login validation, mission-critical form tests, staging link for
              comparison, and performance notes. Nothing is closed out until you confirm.
            </p>
          </div>
        </div>
      </section>

      <ContactSection type="general" />
    </main>
  );
}
