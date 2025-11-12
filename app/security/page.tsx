import type { Metadata } from "next";
import { Shield, Cloud, Database, Server } from "lucide-react";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Security at Elytracloud",
  description:
    "See how Elytracloud secures managed WordPress hosting with Cloudflare WAF, hardened droplets, managed MySQL, and off-site backups.",
  openGraph: {
    title: "Security at Elytracloud",
    description:
      "See how Elytracloud secures managed WordPress hosting with Cloudflare WAF, hardened droplets, managed MySQL, and off-site backups.",
    url: "https://elytracloud.com/security",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud security architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security at Elytracloud",
    description:
      "See how Elytracloud secures managed WordPress hosting with Cloudflare WAF, hardened droplets, managed MySQL, and off-site backups.",
    images: ["/og-default.png"],
  },
};

const stack = [
  {
    title: "Cloudflare Edge",
    description: "WAF, DDoS protection, bot filtering, and SSL termination with automatic renewals.",
    icon: Cloud,
  },
  {
    title: "Elytracloud Droplet",
    description: "Hardened Ubuntu, fail2ban, tuned nginx/PHP-FPM, and limited SSH access with keys only.",
    icon: Server,
  },
  {
    title: "Managed MySQL",
    description: "Dedicated database clusters with daily backups, encryption at rest, and per-site credentials.",
    icon: Database,
  },
  {
    title: "Object Storage Backups",
    description: "Nightly off-site backups to DigitalOcean Spaces with optional customer-owned copies.",
    icon: Shield,
  },
];

const practices = [
  "Automatic SSL with HSTS and certificate monitoring",
  "Cloudflare WAF rulesets plus rate limiting tuned for WordPress",
  "24/7 infrastructure monitoring with PagerDuty-style escalation",
  "Immutable off-site backups with retention policies per tier",
  "Security patches applied on a weekly cadence with emergency windows as needed",
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            <span>Security-first infrastructure</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">Security isn’t an afterthought—it’s the core of our infrastructure</h1>
          <p className="text-lg text-neutral-300">
            Every Elytracloud environment layers edge protection, hardened compute, managed databases, and off-site backups so
            you can focus on your product instead of patching servers.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {stack.map((layer) => {
            const Icon = layer.icon;
            return (
              <div key={layer.title} className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/15 text-blue-200">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-50">{layer.title}</h2>
                <p className="text-neutral-300 leading-relaxed">{layer.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-10">
          <h2 className="text-3xl font-bold text-neutral-50">Operational practices</h2>
          <ul className="list-disc space-y-3 pl-5 text-neutral-300">
            {practices.map((practice) => (
              <li key={practice}>{practice}</li>
            ))}
          </ul>
        </div>
      </section>

      <ContactSection type="support" />
    </main>
  );
}
