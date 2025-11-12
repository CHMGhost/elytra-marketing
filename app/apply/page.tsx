import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Elytracloud | Founding Member Beta",
  description:
    "Join the Elytracloud Founding Member Beta and secure lifetime managed WordPress pricing with dedicated infrastructure.",
  openGraph: {
    title: "Apply for Elytracloud | Founding Member Beta",
    description:
      "Join the Elytracloud Founding Member Beta and secure lifetime managed WordPress pricing with dedicated infrastructure.",
    url: "https://elytracloud.com/apply",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Apply for Elytracloud",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for Elytracloud | Founding Member Beta",
    description:
      "Join the Elytracloud Founding Member Beta and secure lifetime managed WordPress pricing with dedicated infrastructure.",
    images: ["/og-default.png"],
  },
};

const timeline = [
  {
    title: "Share what you’re running",
    copy: "Send a quick email with your site URL, traffic profile, and why you’re exploring managed hosting.",
  },
  {
    title: "Provisioning begins",
    copy: "I spin up your isolated environment, wire in SSL, monitoring, and backups, then send a Loom walkthrough.",
  },
  {
    title: "Migration window",
    copy: "We schedule a migration or hand you staging access—whatever keeps your launch comfortable.",
  },
  {
    title: "Go live & observe",
    copy: "Switch DNS, watch the monitors, and review results together. I stay close the entire time.",
  },
];

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 bg-blue-600/10 border border-blue-600/30 px-4 py-2 rounded-full">
            <span>Founding Member Beta</span>
            <span>Limited to 10 teams</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">Join the Elytracloud Founding Member Beta</h1>
          <p className="text-lg text-neutral-300">
            Apply in under five minutes. I personally review every application, provision your environment, and guide the
            migration—no forms, no waiting rooms.
          </p>
          <a
            href="mailto:hello@elytracloud.com?subject=Elytracloud%20Beta%20Application"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Apply via Email
          </a>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          {timeline.map((item, index) => (
            <div key={item.title} className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-3">
              <div className="text-xs font-semibold tracking-widest text-neutral-500">STEP {index + 1}</div>
              <h2 className="text-2xl font-semibold text-neutral-50">{item.title}</h2>
              <p className="text-neutral-300 leading-relaxed">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
