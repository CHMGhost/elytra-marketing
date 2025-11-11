import { fetchPlatformStatus, isStatusStale } from "@/lib/fetchStatus";

/**
 * Platform Status Card Component
 * Displays real-time platform health information
 * Server Component - fetches fresh data on each render
 */
export async function PlatformStatusCard() {
  const status = await fetchPlatformStatus();
  const stale = isStatusStale(status);

  // Calculate age in minutes for display
  const getDataAge = (): number | null => {
    if (!status.updated_at) return null;
    const updatedAt = new Date(status.updated_at);
    const now = new Date();
    return Math.floor((now.getTime() - updatedAt.getTime()) / 1000 / 60);
  };

  const dataAgeMinutes = getDataAge();

  const STATUS_CONFIG = {
    operational: {
      color: "bg-green-500",
      label: "All systems operational",
    },
    degraded: {
      color: "bg-yellow-500",
      label: "Minor degradation",
    },
    outage: {
      color: "bg-red-500",
      label: "Service disruption",
    },
    unknown: {
      color: "bg-gray-500",
      label: "Status unavailable",
    },
  } as const;

  const { color, label } = STATUS_CONFIG[status.platform_status as keyof typeof STATUS_CONFIG];

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-2">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color} animate-pulse`} />
        <h2 className="text-sm font-semibold text-neutral-100">
          Platform Status
        </h2>
      </div>

      {/* Status label */}
      <p className="text-sm text-neutral-200">{label}</p>

      {/* Last updated timestamp */}
      <div className="flex items-center gap-2">
        <p className="text-xs text-neutral-500">
          Updated:{" "}
          {status.updated_at ? (
            <>
              {new Date(status.updated_at).toLocaleString()}
              {dataAgeMinutes !== null && (
                <span className="ml-1 text-neutral-600">
                  ({dataAgeMinutes < 60 
                    ? `${dataAgeMinutes}m ago` 
                    : `${Math.floor(dataAgeMinutes / 60)}h ago`})
                </span>
              )}
            </>
          ) : (
            "N/A"
          )}
        </p>
      </div>

      {/* Staleness warning with severity levels */}
      {stale && status.updated_at && (
        <div className={`flex items-center gap-1.5 text-xs ${
          dataAgeMinutes && dataAgeMinutes > 60 
            ? 'text-orange-500' 
            : 'text-yellow-500'
        }`}>
          <span className="text-base">⚠</span>
          <span>
            {dataAgeMinutes && dataAgeMinutes > 60
              ? "Data significantly outdated - may not reflect current status"
              : "Data may be outdated"}
          </span>
        </div>
      )}

      {/* Uptime metrics */}
      {status.uptime && (
        <p className="text-xs text-neutral-500">
          Uptime 24h: {status.uptime.last_24h ?? "N/A"}% · 7d:{" "}
          {status.uptime.last_7d ?? "N/A"}%
        </p>
      )}

      {/* Backup information */}
      {status.backups && (
        <div className="text-xs text-neutral-500 space-y-1">
          <p>{status.backups.policy}</p>
          {status.backups.last_successful_backup && (
            <p>
              Last backup:{" "}
              {new Date(status.backups.last_successful_backup).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Infrastructure details */}
      {status.infrastructure && (
        <p className="text-xs text-neutral-500">
          {status.infrastructure.model}
        </p>
      )}
    </section>
  );
}
