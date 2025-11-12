import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Restoring backups | Elytracloud",
  description:
    "How Elytracloud backups work, how to request a restore, and how to self-restore when UpdraftPlus is enabled.",
  openGraph: {
    title: "Restoring backups | Elytracloud",
    description:
      "How Elytracloud backups work, how to request a restore, and how to self-restore when UpdraftPlus is enabled.",
    url: "https://elytracloud.com/docs/restoring-backups",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud backup restore guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restoring backups | Elytracloud",
    description:
      "How Elytracloud backups work, how to request a restore, and how to self-restore when UpdraftPlus is enabled.",
    images: ["/og-default.png"],
  },
};

export default function RestoringBackupsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="max-w-3xl space-y-4">
          <Link href="/docs" className="text-sm text-blue-300 hover:text-blue-200">
            &larr; Back to knowledge base
          </Link>
          <h1 className="text-4xl font-bold">Restoring backups</h1>
          <p className="text-neutral-300 text-lg">
            Nightly off-site backups are included on every plan. Use the steps below to get help from us or run a self-restore
            if you are on Wing or Apex.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl space-y-8">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">When we handle the restore</h2>
            <ul className="list-disc space-y-2 pl-6 text-neutral-300">
              <li>Email <a href="mailto:support@elytracloud.com" className="text-blue-300 hover:text-blue-200">support@elytracloud.com</a> with the incident summary.</li>
              <li>Tell us the restore point you need (time and day). Shell retains 7 days, Wing 14 days, Apex 30 days.</li>
              <li>We restore to staging first so you can confirm, then promote to production or swap DNS when you are ready.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">Self-restore with UpdraftPlus (Wing & Apex)</h2>
            <ol className="list-decimal space-y-2 pl-6 text-neutral-300">
              <li>Log in to WordPress and open <strong>Settings &gt; UpdraftPlus Backups</strong>.</li>
              <li>Choose the snapshot you want and select the components (files, database, plugins) you need to restore.</li>
              <li>Click <strong>Restore</strong> and wait for the confirmation notice. We keep the staging environment available if you want a dry run first.</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6 space-y-3">
            <h2 className="text-xl font-semibold text-neutral-100">Need a custom backup schedule?</h2>
            <p className="text-neutral-200">
              We can increase frequency, add long-term archival storage, or wire in a customer-owned S3 bucket. Reach out and we will propose the right backup policy for your workload.
            </p>
          </div>
        </div>
      </section>

      <ContactSection type="support" />
    </main>
  );
}
