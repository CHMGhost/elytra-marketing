import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Layers, RefreshCw, Puzzle, Cpu } from "lucide-react";
import { ContactSection } from "@/components/ContactSection";

const articles = [
  {
    slug: "how-provisioning-works",
    title: "How provisioning works",
    description: "See the exact steps we take from intake to your environment being online.",
    icon: Layers,
  },
  {
    slug: "request-migration",
    title: "How to request migration",
    description: "Share credentials securely and schedule a move with our team in under 10 minutes.",
    icon: Mail,
  },
  {
    slug: "restoring-backups",
    title: "Restoring backups",
    description: "Learn how to request or self-initiate a restore using our managed backups.",
    icon: RefreshCw,
  },
  {
    slug: "recommended-plugins-themes",
    title: "Recommended plugins & themes",
    description: "Opinionated list of plugins and themes that stay fast and play nicely with Elytracloud.",
    icon: Puzzle,
  },
  {
    slug: "supported-php-versions",
    title: "Supported PHP versions",
    description: "Understand the PHP versions we run today and how upgrades are handled.",
    icon: Cpu,
  },
];

export const metadata: Metadata = {
  title: "Knowledge Base | Elytracloud",
  description:
    "Elytracloud knowledge base covering provisioning, migrations, backups, recommended plugins, and supported PHP versions.",
  openGraph: {
    title: "Knowledge Base | Elytracloud",
    description:
      "Elytracloud knowledge base covering provisioning, migrations, backups, recommended plugins, and supported PHP versions.",
    url: "https://elytracloud.com/docs",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud knowledge base",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Knowledge Base | Elytracloud",
    description:
      "Elytracloud knowledge base covering provisioning, migrations, backups, recommended plugins, and supported PHP versions.",
    images: ["/og-default.png"],
  },
};

export default function DocsIndexPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 bg-blue-600/10 border border-blue-600/30 px-4 py-2 rounded-full">
            <span>Knowledge Base</span>
            <span>Early support portal</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">Answers before you ask</h1>
          <p className="text-lg text-neutral-300">
            Short, practical guides that explain how Elytracloud handles provisioning, migrations, backups, and best
            practices so you never feel stuck.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const Icon = article.icon;
            return (
              <Link
                key={article.slug}
                href={`/docs/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 transition hover:-translate-y-1 hover:border-blue-500/60 hover:bg-neutral-900/70"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/15 text-blue-200">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-neutral-50">{article.title}</h2>
                <p className="mt-3 text-sm text-neutral-400">{article.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-300 group-hover:text-blue-200">
                  <span>Read guide</span>
                  <span aria-hidden>&rarr;</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <ContactSection type="general" />
    </main>
  );
}
