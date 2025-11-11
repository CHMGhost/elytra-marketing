import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
