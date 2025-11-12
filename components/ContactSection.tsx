import React from "react";

type ContactType = "general" | "support" | "billing";

interface ContactSectionProps {
  type?: ContactType;
  title?: string;
  subtitle?: string;
}

export function ContactSection({
  type = "general",
  title,
  subtitle,
}: ContactSectionProps) {
  const email =
    type === "support"
      ? "support@elytracloud.com"
      : type === "billing"
      ? "billing@elytracloud.com"
      : "hello@elytracloud.com";

  const subject =
    type === "support"
      ? "Elytracloud%20Support%20Request"
      : type === "billing"
      ? "Elytracloud%20Billing%20Inquiry"
      : "Elytracloud%20General%20Inquiry";

  const defaultTitle =
    title ||
    (type === "support"
      ? "Need help with your site?"
      : type === "billing"
      ? "Questions about your invoice or plan?"
      : "Have questions before you join?");

  const defaultSubtitle =
    subtitle ||
    (type === "support"
      ? "Our engineering team monitors this inbox 7 days a week."
      : type === "billing"
      ? "We can help with receipts, upgrades, and refunds within 1 business day."
      : "I personally handle every onboarding email — you’ll get a reply within a day.");

  return (
    <section className="container mx-auto px-4 pb-24">
      <div className="max-w-3xl mx-auto text-center space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-10">
        <h2 className="text-3xl font-bold text-neutral-50">{defaultTitle}</h2>
        <p className="text-neutral-300 text-lg">{defaultSubtitle}</p>
        <a
          href={`mailto:${email}?subject=${subject}&body=Hi%20Minor%2C%0A%0AI'm%20reaching%20out%20about%20${type}%20support.%20Here%27s%20a%20bit%20about%20my%20site%3A%0A%0ASite%3A%20%0ATier%3A%20Shell%20%7C%20Wing%20%7C%20Apex%0A%0AThanks!`}
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Email {email}
        </a>
      </div>
    </section>
  );
}
