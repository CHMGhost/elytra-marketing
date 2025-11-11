/**
 * Platform Status Data Fetcher
 * Fetches and validates platform status from the public JSON endpoint
 */

import { track } from "./analytics";

export type PlatformStatus = {
  updated_at: string;
  platform_status: "operational" | "degraded" | "outage" | "unknown";
  uptime?: {
    last_24h?: number;
    last_7d?: number;
  };
  backups?: {
    policy?: string;
    last_successful_backup?: string;
    last_backup_status?: "success" | "warning" | "failed" | "unknown";
  };
  infrastructure?: {
    model?: string;
    regions?: string[];
    notes?: string;
  };
};

const DEFAULT_STATUS: PlatformStatus = {
  updated_at: "",
  platform_status: "unknown",
};

/**
 * Fetches the current platform status from the configured endpoint.
 * Returns default status on error to ensure graceful degradation.
 * 
 * Caching strategy:
 * - Revalidates every 10 minutes (600 seconds)
 * - Matches backend update frequency
 * - Reduces load on status endpoint
 */
export async function fetchPlatformStatus(): Promise<PlatformStatus> {
  const url = process.env.NEXT_PUBLIC_STATUS_JSON_URL;
  const startTime = Date.now();
  
  if (!url) {
    console.warn("[Status] NEXT_PUBLIC_STATUS_JSON_URL not configured");
    return DEFAULT_STATUS;
  }

  try {
    const res = await fetch(url, {
      next: { 
        revalidate: 600, // Cache for 10 minutes (matches status update frequency)
        tags: ['platform-status'] // Enable on-demand revalidation if needed
      },
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache", // Prevent additional browser caching
      },
    });

    const duration = Date.now() - startTime;

    if (!res.ok) {
      console.warn(
        `[Status] Fetch failed: ${res.status} ${res.statusText} (${duration}ms)`
      );
      
      // Track error
      track("status_fetch_error", {
        status_code: res.status,
        duration,
      });
      
      return DEFAULT_STATUS;
    }

    const data = await res.json();

    // Validate freshness (warn if data is stale)
    if (data.updated_at) {
      const updatedAt = new Date(data.updated_at);
      const now = new Date();
      const ageMinutes = (now.getTime() - updatedAt.getTime()) / 1000 / 60;

      if (ageMinutes > 30) {
        console.warn(
          `[Status] Data is stale (${ageMinutes.toFixed(0)} minutes old)`
        );
        
        // Track stale data
        track("status_stale_data", {
          age_minutes: Math.floor(ageMinutes),
          duration,
        });
      } else {
        console.log(
          `[Status] Fetched successfully (${duration}ms, ${ageMinutes.toFixed(1)} min old)`
        );
        
        // Track success
        track("status_fetch_success", {
          duration,
          age_minutes: Math.floor(ageMinutes),
        });
      }
    }

    // Track unknown status
    if (data.platform_status === "unknown") {
      track("status_unknown", { duration });
    }

    return { ...DEFAULT_STATUS, ...data };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[Status] Fetch error after ${duration}ms:`,
      error instanceof Error ? error.message : error
    );
    
    // Track error
    track("status_fetch_error", {
      duration,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    
    return DEFAULT_STATUS;
  }
}

/**
 * Utility to check if status data is stale (> 30 minutes old)
 */
export function isStatusStale(status: PlatformStatus): boolean {
  if (!status.updated_at) return true;

  const updatedAt = new Date(status.updated_at);
  const now = new Date();
  const ageMinutes = (now.getTime() - updatedAt.getTime()) / 1000 / 60;

  return ageMinutes > 30;
}
