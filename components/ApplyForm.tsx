"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const tiers = [
  { value: "shell", label: "Shell" },
  { value: "wing", label: "Wing" },
  { value: "apex", label: "Apex" },
];

export function ApplyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      router.push("/apply/success");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-neutral-200">Name</span>
          <input
            type="text"
            name="name"
            required
            className="rounded-lg border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-neutral-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-neutral-200">Email</span>
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-neutral-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-neutral-200">WordPress site URL</span>
          <input
            type="url"
            name="siteUrl"
            required
            placeholder="https://example.com"
            className="rounded-lg border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-neutral-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-neutral-200">Current host</span>
          <input
            type="text"
            name="currentHost"
            required
            className="rounded-lg border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-neutral-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-neutral-200">Approx. monthly visits</span>
          <input
            type="number"
            name="monthlyVisits"
            min={0}
            required
            className="rounded-lg border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-neutral-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-neutral-200">Tier</legend>
          <div className="flex flex-wrap gap-4">
            {tiers.map((tier) => (
              <label key={tier.value} className="inline-flex items-center gap-2 text-neutral-300">
                <input
                  type="radio"
                  name="tier"
                  value={tier.value}
                  required
                  className="h-4 w-4 accent-blue-500"
                />
                {tier.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-neutral-200">Notes / special requirements</span>
        <textarea
          name="notes"
          rows={4}
          className="rounded-lg border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-neutral-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Apply for Elytracloud"}
      </button>

      <p className="text-sm text-neutral-500">
        Typical onboarding takes less than a day once we confirm your fit.
      </p>

      <p className="text-sm text-neutral-500 mt-4">
        Need to talk it through first?{" "}
        <a
          href="mailto:hello@elytracloud.com?subject=Elytracloud%20Beta%20Question&body=Hi%20Elytracloud%20team%2C%0A%0AI%20had%20a%20question%20before%20completing%20my%20application.%20Here%27s%20what%20I%27m%20working%20on%3A%0A-%20Current%20WordPress%20host%3A%20%5Bfill%20in%5D%0A-%20Traffic%2Fscale%20notes%3A%20%5Bfill%20in%5D%0A-%20Plan%20I%27m%20considering%3A%20Shell%20%2F%20Wing%20%2F%20Apex%0A%0AThanks!"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Email us directly
        </a>
        .
      </p>
    </form>
  );
}
