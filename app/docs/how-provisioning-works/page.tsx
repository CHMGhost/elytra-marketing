import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "How provisioning works | Elytracloud",
  description:
    "Understand each step of Elytracloud provisioning from intake to hardened, isolated WordPress environments coming online.",
  openGraph: {
    title: "How provisioning works | Elytracloud",
    description:
      "Understand each step of Elytracloud provisioning from intake to hardened, isolated WordPress environments coming online.",
    url: "https://elytracloud.com/docs/how-provisioning-works",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud provisioning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How provisioning works | Elytracloud",
    description:
      "Understand each step of Elytracloud provisioning from intake to hardened, isolated WordPress environments coming online.",
    images: ["/og-default.png"],
  },
};

const steps = [
  {
    title: "Application review",
    detail:
      "We read every application manually. You will get an email from Minor confirming fit, clarifying goals, and sharing the secure form for credentials if we move forward.",
  },
  {
    title: "Environment creation",
    detail:
      "We spin up your dedicated droplet, configure managed MySQL, wire in Cloudflare, and apply the hardened baseline (SSH keys, fail2ban, automatic SSL, object storage backups).",
  },
  {
    title: "Baseline verification",
    detail:
      "Before we hand over access we verify uptime monitors, log shipping, and daily backup jobs are all returning green signals.",
  },
  {
    title: "Access delivery",
    detail:
      "You receive staging and production URLs, SFTP and SSH keys, WordPress admin credentials, and a short Loom so nothing feels mysterious.",
  },
];

export default function HowProvisioningWorksPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="max-w-3xl space-y-4">
          <Link href="/docs" className="text-sm text-blue-300 hover:text-blue-200">
            &larr; Back to knowledge base
          </Link>
          <h1 className="text-4xl font-bold">How provisioning works</h1>
          <p className="text-neutral-300 text-lg">
            Elytracloud provisioning is a playbook we have refined over dozens of launches. Here is the exact sequence so you
            know what is happening behind the curtain.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3"
            >
              <div className="text-xs uppercase tracking-widest text-blue-300">Step {String(index + 1).padStart(2, "0")}</div>
              <h2 className="text-2xl font-semibold text-neutral-50">{step.title}</h2>
              <p className="text-neutral-300 leading-relaxed">{step.detail}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6 space-y-3">
            <h2 className="text-xl font-semibold text-neutral-100">Provisioning timeline</h2>
            <p className="text-neutral-200">
              Standard provisioning takes less than 30 minutes once we have credentials. If you need to coordinate around a
              release or marketing push, reply to the intake email and we will schedule the window together.
            </p>
          </div>
        </div>
      </section>

      <ContactSection type="general" />
    </main>
  );
}
