"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
  { href: "/status", label: "Status" },
  { href: "/docs", label: "Docs" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900/80 bg-neutral-950/70 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Elytracloud logo"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="font-semibold tracking-tight text-neutral-100">Elytracloud</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-300">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-neutral-100 ${
                  isActive ? "text-neutral-100" : "text-neutral-300"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/pricing"
            className="hidden rounded-lg border border-blue-500/60 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:border-blue-400 hover:text-blue-200 sm:inline-flex"
          >
            View Plans
          </Link>
        </nav>
      </div>
    </header>
  );
}
