/**
 * Analytics and Monitoring Utilities
 * Simple event tracking for platform status monitoring
 */

type AnalyticsEvent = 
  | "status_fetch_success"
  | "status_fetch_error"
  | "status_stale_data"
  | "status_unknown";

interface EventData {
  duration?: number;
  status_code?: number;
  error?: string;
  age_minutes?: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track analytics events
 * Can be integrated with Google Analytics, Plausible, or custom analytics
 */
export function track(event: AnalyticsEvent, data?: EventData): void {
  // For development, just log to console
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, data);
    return;
  }

  // Production: Send to analytics service
  try {
    // Example: Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, data);
    }

    // Example: Plausible
    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible(event, { props: data });
    }

    // Example: Custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
      }).catch((error) => {
        console.warn("[Analytics] Failed to send event:", error);
      });
    }
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.warn("[Analytics] Error tracking event:", error);
  }
}

/**
 * Track page views
 */
export function trackPageView(path: string): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: path,
    });
  }
}

/**
 * Initialize analytics (call in root layout or _app)
 */
export function initAnalytics(): void {
  if (process.env.NODE_ENV === "production") {
    console.log("[Analytics] Initialized");
  }
}
