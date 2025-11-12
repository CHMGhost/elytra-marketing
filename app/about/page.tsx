import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "About Elytracloud",
  description:
    "The story behind Elytracloud, why it exists, and how Minor Keith runs a managed WordPress platform with care and transparency.",
  openGraph: {
    title: "About Elytracloud",
    description:
      "The story behind Elytracloud, why it exists, and how Minor Keith runs a managed WordPress platform with care and transparency.",
    url: "https://elytracloud.com/about",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "About Elytracloud",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Elytracloud",
    description:
      "The story behind Elytracloud, why it exists, and how Minor Keith runs a managed WordPress platform with care and transparency.",
    images: ["/og-default.png"],
  },
};

const values = [
  {
    title: "Why I built Elytracloud",
    body:
      "Agencies kept asking for a host that felt like a teammate, not a ticket queue. I started Elytracloud so teams who rely on WordPress could have dedicated infrastructure and an engineer who actually watches it.",
  },
  {
    title: "What I believe about managed hosting",
    body:
      "Managed should mean proactive security, honest communication, and zero surprises on invoice day. If I cannot explain a change in plain language, it does not ship.",
  },
  {
    title: "How I operate",
    body:
      "I work with a limited number of customers so I can keep eyes on every dashboard. Transparency beats promises—expect clear timelines, real monitoring data, and direct access to me when you need it.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-300">
            <span>Founder Story</span>
            <span>Built by Minor Keith</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">A managed WordPress platform run by the person who built it</h1>
          <p className="text-lg text-neutral-300">
            Elytracloud exists because reliable hosting needs more than dashboards. I keep the customer list short, stay on-call
            for incidents, and ship infrastructure improvements the moment I see a new pattern.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
              <h2 className="text-2xl font-semibold text-neutral-50">{value.title}</h2>
              <p className="text-neutral-300 leading-relaxed">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-10">
          <h2 className="text-3xl font-bold text-neutral-50">What you can expect from me</h2>
          <ul className="list-disc space-y-3 pl-5 text-neutral-300">
            <li>Infrastructure decisions explained in plain English, including trade-offs and timelines.</li>
            <li>Monitoring and incident alerts that go to me first—then to you with context.</li>
            <li>No surprise invoices. Every plan is flat-rate with clear upgrade paths.</li>
          </ul>
        </div>
      </section>

      <ContactSection type="general" />
    </main>
  );
}
