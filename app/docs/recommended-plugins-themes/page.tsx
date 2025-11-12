import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Recommended plugins and themes | Elytracloud",
  description:
    "Opinionated list of WordPress plugins and themes that pair well with Elytracloud for speed, security, and maintainability.",
  openGraph: {
    title: "Recommended plugins and themes | Elytracloud",
    description:
      "Opinionated list of WordPress plugins and themes that pair well with Elytracloud for speed, security, and maintainability.",
    url: "https://elytracloud.com/docs/recommended-plugins-themes",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud recommended plugins",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recommended plugins and themes | Elytracloud",
    description:
      "Opinionated list of WordPress plugins and themes that pair well with Elytracloud for speed, security, and maintainability.",
    images: ["/og-default.png"],
  },
};

const categories = [
  {
    title: "Performance",
    items: [
      {
        name: "WP Rocket",
        note: "Great for page caching, file optimization, and CDN control. We help dial in the settings for your stack.",
      },
      {
        name: "Perfmatters",
        note: "Lightweight script and asset manager if you do not need a full caching plugin.",
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        name: "Wordfence (Apex)",
        note: "We deploy it with tuned firewall rules on Apex plans for extra signal beyond the network layer.",
      },
      {
        name: "Two Factor",
        note: "Adds TOTP/Email 2FA for WordPress logins with minimal overhead.",
      },
    ],
  },
  {
    title: "Backups & workflow",
    items: [
      {
        name: "UpdraftPlus",
        note: "Wing and Apex plans include UpdraftPlus preconfigured. Shell customers can request it any time.",
      },
      {
        name: "WP Migrate",
        note: "Useful for local-to-cloud pushes if you want a DIY workflow alongside our managed migrations.",
      },
    ],
  },
  {
    title: "Themes",
    items: [
      {
        name: "Block-based (FSE) themes",
        note: "We like Frost, Ollie, or purely custom block themes for clean markup and easy modifications.",
      },
      {
        name: "GeneratePress",
        note: "A classic choice that stays fast, especially paired with our caching and CDN defaults.",
      },
    ],
  },
];

export default function RecommendedPluginsThemesPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="max-w-3xl space-y-4">
          <Link href="/docs" className="text-sm text-blue-300 hover:text-blue-200">
            &larr; Back to knowledge base
          </Link>
          <h1 className="text-4xl font-bold">Recommended plugins & themes</h1>
          <p className="text-neutral-300 text-lg">
            These are the tools we use across customer environments. They are reliable, well-supported, and stay performant on
            Elytracloud.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl space-y-8">
          {categories.map((category) => (
            <div key={category.title} className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-50">{category.title}</h2>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li key={item.name} className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4">
                    <p className="text-lg font-semibold text-neutral-100">{item.name}</p>
                    <p className="text-sm text-neutral-300">{item.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <ContactSection type="general" />
    </main>
  );
}
