import { PlatformStatusCard } from "@/components/PlatformStatusCard";

/**
 * Dedicated Platform Status Page
 * Provides expanded view of platform health and reliability
 */
export default function StatusPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-100">
          Elytracloud Platform Status
        </h1>
        <p className="text-neutral-400">
          Real-time platform health and infrastructure information
        </p>
      </div>

      <PlatformStatusCard />

      <div className="space-y-4 text-sm">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4 space-y-2">
          <h2 className="font-semibold text-neutral-200">
            About This Status Page
          </h2>
          <p className="text-neutral-400">
            This page reflects overall platform health. Individual client
            environments are continuously monitored by our internal automation.
          </p>
          <p className="text-xs text-neutral-500">
            Data updates every 10–15 minutes from our managed infrastructure.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4 space-y-3">
          <h2 className="font-semibold text-neutral-200">Status Indicators</h2>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-neutral-300">Operational</span>
              <span className="text-neutral-500">
                - All systems functioning normally
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <span className="text-neutral-300">Degraded</span>
              <span className="text-neutral-500">
                - Minor performance issues detected
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-neutral-300">Outage</span>
              <span className="text-neutral-500">
                - Service disruption in progress
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />
              <span className="text-neutral-300">Unknown</span>
              <span className="text-neutral-500">
                - Status information unavailable
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4 space-y-2">
          <h2 className="font-semibold text-neutral-200">
            Infrastructure Details
          </h2>
          <ul className="space-y-1 text-neutral-400 list-disc list-inside">
            <li>Dedicated droplet per client environment</li>
            <li>Managed database cluster with automatic failover</li>
            <li>Nightly backups with 7-day retention</li>
            <li>Off-site storage in DigitalOcean Spaces</li>
            <li>HTTPS via Cloudflare with origin certificates</li>
            <li>24/7 automated monitoring via Uptime Kuma</li>
          </ul>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-neutral-500">
            Questions about platform status?{" "}
            <a
              href="mailto:support@elytracloud.com"
              className="text-neutral-400 hover:text-neutral-200 underline"
            >
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Platform Status - Elytracloud",
  description:
    "Real-time status and health information for the Elytracloud hosting platform",
};
