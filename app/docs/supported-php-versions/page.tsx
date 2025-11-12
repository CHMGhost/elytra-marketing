import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Supported PHP versions | Elytracloud",
  description: "Find the PHP versions we support across Shell, Wing, and Apex plans and how upgrades are scheduled.",
  openGraph: {
    title: "Supported PHP versions | Elytracloud",
    description:
      "Find the PHP versions we support across Shell, Wing, and Apex plans and how upgrades are scheduled.",
    url: "https://elytracloud.com/docs/supported-php-versions",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud PHP support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Supported PHP versions | Elytracloud",
    description:
      "Find the PHP versions we support across Shell, Wing, and Apex plans and how upgrades are scheduled.",
    images: ["/og-default.png"],
  },
};

export default function SupportedPHPVersionsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="max-w-3xl space-y-4">
          <Link href="/docs" className="text-sm text-blue-300 hover:text-blue-200">
            &larr; Back to knowledge base
          </Link>
          <h1 className="text-4xl font-bold">Supported PHP versions</h1>
          <p className="text-neutral-300 text-lg">
            Modern PHP keeps your WordPress site secure and fast. Elytracloud standardizes on the versions below so you always
            know what is running in production.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl space-y-8">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">Current versions</h2>
            <ul className="list-disc space-y-2 pl-6 text-neutral-300">
              <li>Shell: PHP 8.2</li>
              <li>Wing: PHP 8.2 (8.3 available on request)</li>
              <li>Apex: PHP 8.3 with dedicated FPM pool tuning</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">Upgrade policy</h2>
            <p className="text-neutral-300">
              We track official PHP release cycles. Minor upgrades (for example 8.2.x) are applied automatically after staging
              validation. Major upgrades (8.2 to 8.3) run through staging with your plugins enabled and we only promote to
              production once you sign off.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-50">Requesting an older version</h2>
            <p className="text-neutral-300">
              We recommend staying current, but legacy projects sometimes require an older runtime. Shell and Wing can pin to
              PHP 8.1 for up to 12 months. Apex customers can request a dedicated legacy container for long-term support.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6 space-y-3">
            <h2 className="text-xl font-semibold text-neutral-100">Planning a major upgrade?</h2>
            <p className="text-neutral-200">
              Tell us what plugins or custom code you are concerned about. We will spin up a staging clone, test for
              compatibility, and share the findings before we schedule production changes.
            </p>
          </div>
        </div>
      </section>

      <ContactSection type="support" />
    </main>
  );
}
