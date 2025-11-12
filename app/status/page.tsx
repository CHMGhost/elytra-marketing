import type { Metadata } from "next";
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { PlatformStatusCard } from "@/components/PlatformStatusCard";

export const metadata: Metadata = {
  title: "Platform Status | Elytracloud",
  description:
    "Real-time status and health information for the Elytracloud hosting platform.",
};

export default function StatusPage() {
  const lastUpdatedCopy = "Updated moments ago";

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <div className="max-w-2xl mx-auto py-16 px-4 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Elytracloud Platform Status</h1>
          <p className="text-neutral-400">
            Real-time health updates and infrastructure transparency.
          </p>
        </div>

        <PlatformStatusCard />
        <p className="text-xs text-neutral-500 text-center">{lastUpdatedCopy}</p>
        <p className="text-xs text-neutral-500 text-center">
          Updates automatically every few minutes.
        </p>

        <div className="space-y-4 text-sm">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4 space-y-2">
            <h2 className="font-semibold text-neutral-200">About This Status Page</h2>
            <p className="text-neutral-400">
              This page reflects overall platform health. Individual client environments
              are continuously monitored by our internal automation and alerting system.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4 space-y-3">
            <h2 className="font-semibold text-neutral-200">Status Indicators</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-neutral-300">Operational</span>
                <span className="text-neutral-500">– All systems functioning normally</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-neutral-300">Degraded</span>
                <span className="text-neutral-500">– Minor performance issues detected</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-neutral-300">Outage</span>
                <span className="text-neutral-500">– Service disruption in progress</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <span className="text-neutral-300">Unknown</span>
                <span className="text-neutral-500">– Status information unavailable</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 space-y-3">
            <p className="text-xs text-neutral-500">
              Questions about platform status?{" "}
              <a
                href="mailto:support@elytracloud.com"
                className="text-neutral-400 hover:text-neutral-200 underline"
              >
                Contact our team
              </a>
            </p>
            <a
              href="/uptime"
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              View uptime history (coming soon)
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
