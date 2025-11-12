import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { FloatingContactButton } from "@/components/FloatingContactButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://elytracloud.com"),
  title: {
    default: "Elytracloud - Enterprise WordPress Hosting",
    template: "%s | Elytracloud",
  },
  description: "Dedicated infrastructure, automated backups, and 24/7 monitoring for WordPress sites.",
  openGraph: {
    title: "Elytracloud - Enterprise WordPress Hosting",
    description: "Dedicated infrastructure, automated backups, and 24/7 monitoring for WordPress sites.",
    url: "https://elytracloud.com",
    siteName: "Elytracloud",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Elytracloud managed WordPress hosting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elytracloud - Enterprise WordPress Hosting",
    description: "Dedicated infrastructure, automated backups, and 24/7 monitoring for WordPress sites.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
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
  <FloatingContactButton />
      </body>
    </html>
  );
}
