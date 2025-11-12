import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Elytracloud - Enterprise WordPress Hosting",
  description: "Dedicated infrastructure, automated backups, and 24/7 monitoring for WordPress sites.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 antialiased min-h-screen">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
