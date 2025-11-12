import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Calendar, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Application Received | Elytracloud",
  description:
    "Your Elytracloud application is in motion. Choose your next step: book a provisioning sync or join the customer Discord to stay close to updates.",
};

export default function ApplySuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100">
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400" aria-hidden />
          <h1 className="text-4xl md:text-5xl font-bold">
            We’re provisioning your environment
          </h1>
          <p className="text-lg text-neutral-300">
            Look out for an email from the Elytracloud team in the next 30 minutes. In the meantime, pick how you’d like to continue.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
          <Link
            href="https://calendly.com/elytracloud/provisioning"
            className="group rounded-2xl border border-neutral-800 bg-neutral-950/70 p-8 transition hover:border-blue-500/60 hover:bg-neutral-900/80"
          >
            <Calendar className="w-10 h-10 text-blue-300" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold">Book a provisioning sync</h2>
            <p className="mt-2 text-neutral-300">
              Reserve a 25-minute slot with our provisioning lead to review migration steps and confirm benchmarks.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 group-hover:text-blue-200">
              <span>Open Calendly</span>
            </span>
          </Link>

          <Link
            href="https://discord.gg/elytracloud"
            className="group rounded-2xl border border-neutral-800 bg-neutral-950/70 p-8 transition hover:border-emerald-500/60 hover:bg-neutral-900/80"
          >
            <MessageCircle className="w-10 h-10 text-emerald-300" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold">Join the customer Discord</h2>
            <p className="mt-2 text-neutral-300">
              Drop into the private server for environment updates, launch alerts, and direct support from the engineers behind Elytracloud.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 group-hover:text-emerald-200">
              <span>Join Discord</span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
