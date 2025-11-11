
# 🟢 Elytracloud – Public Platform Status Integration

**Version:** v1.3
**Audience:** Infrastructure & Frontend Teams
**Purpose:** Public status reporting for marketing transparency
**Status Endpoint:** `https://status.elytracloud.com/status.json`

---

## 🧭 Overview

Elytracloud’s platform status system is a **two-part architecture**:

| Layer                        | Responsibility                                                   | Owner    |
| ---------------------------- | ---------------------------------------------------------------- | -------- |
| **Infra (CLI + Cron)**       | Generates and publishes sanitized `status.json` every 10 minutes | DevOps   |
| **Marketing Site (Next.js)** | Consumes `status.json`, displays live platform health            | Frontend |

This setup ensures **zero cross-repo coupling**, **no secret sharing**, and **safe public visibility**.

---

## 🔒 Security & Design Principles

1. **Public-by-Design:** `status.json` is intentionally public, but stripped of sensitive data.
2. **Read-Only Contract:** Marketing site never writes; only fetches.
3. **Defense in Depth:** CLI sanitizes output, script validates, meta-monitor watches endpoint freshness.
4. **Graceful Degradation:** If anything breaks, marketing site displays safe fallback.

---

# Part I – Infrastructure Implementation

*(Repository: `elytra-infra`)*

---

## 1. Data Flow Diagram

```
Elytra CLI  ──► generate_status_json.sh (cron)
                   │
                   ▼
            status.json (sanitized)
                   │
                   ▼
    DigitalOcean Spaces (public-read)
                   │
                   ▼
https://status.elytracloud.com/status.json
                   │
                   ▼
         Marketing Site (Next.js fetch)
```

---

## 2. CLI Implementation

The `elytra` CLI (installed on the management host) must output a sanitized platform-wide status in JSON.

### Command

```bash
elytra status summary --json
```

### Expected Output Schema

```json
{
  "platform_status": "operational",
  "uptime": {
    "last_24h": 100.0,
    "last_7d": 99.97
  },
  "backups": {
    "last_successful_backup": "2025-11-10T02:01:30Z",
    "last_backup_status": "success"
  },
  "infrastructure": {
    "model": "Dedicated droplet per client + managed database cluster.",
    "regions": ["nyc3"],
    "notes": "All sites behind managed HTTPS and monitored 24/7."
  }
}
```

### Internals

Each data point may be pulled from internal systems:

| Field             | Source                                | Example                          |
| ----------------- | ------------------------------------- | -------------------------------- |
| `platform_status` | Aggregate uptime monitors             | `"operational"` if >99.9% uptime |
| `uptime`          | Uptime Kuma / Better Stack API        | 24h/7d windows                   |
| `backups`         | Parse backup logs or Spaces manifests | Use timestamps of last success   |
| `infrastructure`  | Static metadata                       | Text description only            |

### Example CLI Stub (Python)

```python
#!/usr/bin/env python3
import json, datetime

def main():
    # (replace with real monitor API logic)
    data = {
        "platform_status": "operational",
        "uptime": {"last_24h": 100.0, "last_7d": 99.98},
        "backups": {
            "last_successful_backup": datetime.datetime.utcnow().isoformat() + "Z",
            "last_backup_status": "success"
        },
        "infrastructure": {
            "model": "Dedicated droplet per client + managed database cluster.",
            "regions": ["nyc3"],
            "notes": "All sites behind managed HTTPS and monitored 24/7."
        }
    }
    print(json.dumps(data))

if __name__ == "__main__":
    main()
```

Save as `/usr/local/bin/elytra-status-summary` or integrate into existing Go/Python CLI.

---

## 3. `generate_status_json.sh`

**Location:** `/opt/elytra/scripts/generate_status_json.sh`
**Permissions:** root or service account
**Runs every 10 minutes via cron**

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== Configuration =====
CLI="/usr/local/bin/elytra status summary --json"
OUTPUT_FILE="/tmp/status.json"
SPACES_BUCKET="elytracloud-status"
SPACES_PATH="status.json"
LOG_FILE="/var/log/elytra-status.log"

# ===== Step 1: Run CLI =====
echo "$(date -u) [INFO] Generating platform status..." >> "$LOG_FILE"
SUMMARY_JSON=$($CLI)

# ===== Step 2: Add updated_at =====
UPDATED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "$SUMMARY_JSON" | jq --arg updated_at "$UPDATED_AT" \
  '. + {updated_at: $updated_at}' > "$OUTPUT_FILE"

# ===== Step 3: Validate output =====
if grep -Eqi 'password|secret|ip|bucket|s3://' "$OUTPUT_FILE"; then
  echo "$(date -u) [WARN] Potential secret detected, aborting upload" >> "$LOG_FILE"
  exit 1
fi

# ===== Step 4: Upload to Spaces =====
s3cmd put \
  --acl-public \
  --mime-type="application/json" \
  --add-header="Cache-Control: public,max-age=60" \
  "$OUTPUT_FILE" "s3://${SPACES_BUCKET}/${SPACES_PATH}"

echo "$(date -u) [INFO] Uploaded status.json successfully." >> "$LOG_FILE"
```

---

## 4. Cron Configuration

Edit crontab:

```bash
*/10 * * * * /opt/elytra/scripts/generate_status_json.sh >> /var/log/elytra-status.log 2>&1
```

* Runs every 10 minutes.
* Writes logs to `/var/log/elytra-status.log`.
* Replaces CI/CD or Actions (simpler, more reliable).

---

## 5. DNS & Hosting

1. **Create bucket:** `elytracloud-status` (DigitalOcean Spaces)

   * Make public.
   * Uploads from script go here.

2. **Configure domain:**

   * `status.elytracloud.com` → CNAME to Spaces endpoint (e.g. `elytracloud-status.nyc3.digitaloceanspaces.com`).

3. **CORS Policy:**
   Add a permissive JSON CORS header so browsers can fetch it:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>300</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

---

## 6. Meta-Monitoring (Self-Health)

Add a separate uptime monitor for `status.json` itself.

| Check           | Value                                        |
| --------------- | -------------------------------------------- |
| URL             | `https://status.elytracloud.com/status.json` |
| Method          | GET                                          |
| Expected Status | 200                                          |
| Content Match   | `"platform_status"`                          |
| Frequency       | Every 5 min                                  |
| Alert           | If `updated_at` older than 30 min            |

**Optional enhancement:**
Use a simple Python check in cron:

```bash
#!/usr/bin/env python3
import json, urllib.request, datetime

url = "https://status.elytracloud.com/status.json"
data = json.load(urllib.request.urlopen(url))
updated = datetime.datetime.fromisoformat(data["updated_at"].replace("Z",""))
age = (datetime.datetime.utcnow() - updated).total_seconds()
if age > 1800:
    print("Status JSON stale (>30min)")
    exit(1)
```

Hook to alert system / Slack / email.

---

## 7. Infra Acceptance Criteria

* [x] `elytra status summary --json` implemented & tested
* [x] `generate_status_json.sh` deployed & executable
* [x] Cron running every 10 minutes
* [x] `status.json` uploaded successfully to Spaces
* [x] JSON schema matches contract
* [x] No sensitive data present
* [x] `status.elytracloud.com` resolves & returns valid JSON
* [x] Monitor in place for uptime & freshness

---

# Part II – Marketing Site Integration

*(Repository: `elytra-site`)*

---

## 1. Environment Configuration

```bash
NEXT_PUBLIC_STATUS_JSON_URL="https://status.elytracloud.com/status.json"
```

Add this in Vercel or DO App Platform environment variables.

---

## 2. Data Fetcher (`lib/fetchStatus.ts`)

```ts
export type PlatformStatus = {
  updated_at: string;
  platform_status: "operational" | "degraded" | "outage" | "unknown";
  uptime?: { last_24h?: number; last_7d?: number };
  backups?: {
    policy?: string;
    last_successful_backup?: string;
    last_backup_status?: "success" | "warning" | "failed" | "unknown";
  };
  infrastructure?: { model?: string; regions?: string[]; notes?: string };
};

const DEFAULT: PlatformStatus = {
  updated_at: "",
  platform_status: "unknown"
};

function isStale(updated: string): boolean {
  if (!updated) return true;
  const ts = new Date(updated).getTime();
  return Number.isNaN(ts) || (Date.now() - ts) > 30 * 60 * 1000;
}

export async function fetchPlatformStatus(): Promise<{
  data: PlatformStatus;
  error: boolean;
  stale: boolean;
}> {
  const url = process.env.NEXT_PUBLIC_STATUS_JSON_URL;
  if (!url) return { data: DEFAULT, error: true, stale: true };
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return { data: DEFAULT, error: true, stale: true };
    const json = (await res.json()) as PlatformStatus;
    return { data: json, error: false, stale: isStale(json.updated_at) };
  } catch {
    return { data: DEFAULT, error: true, stale: true };
  }
}
```

---

## 3. Status Card Component

```tsx
import { fetchPlatformStatus } from "@/lib/fetchStatus";

export async function PlatformStatusCard() {
  const { data, error, stale } = await fetchPlatformStatus();

  const color =
    data.platform_status === "operational"
      ? "bg-green-500"
      : data.platform_status === "degraded"
      ? "bg-yellow-500"
      : data.platform_status === "outage"
      ? "bg-red-500"
      : "bg-gray-500";

  const labelMap: Record<string, string> = {
    operational: "All systems operational",
    degraded: "Minor degradation",
    outage: "Service disruption",
    unknown: "Status unavailable"
  };

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <h2 className="text-sm font-semibold text-neutral-100">Platform Status</h2>
      </div>
      <p className="text-sm text-neutral-200">
        {labelMap[data.platform_status]}{" "}
        {stale && <span className="text-[10px] text-yellow-400">(slightly stale)</span>}
      </p>
      <p className="text-[10px] text-neutral-500">
        Updated: {data.updated_at ? new Date(data.updated_at).toLocaleString() : "N/A"}
      </p>
      {error && (
        <p className="text-[10px] text-red-400">
          Unable to fetch live status. Monitoring continues internally.
        </p>
      )}
      {!error && data.uptime && (
        <p className="text-[10px] text-neutral-500">
          Uptime 24h: {data.uptime.last_24h ?? "N/A"}% · 7d: {data.uptime.last_7d ?? "N/A"}%
        </p>
      )}
      {!error && data.backups && (
        <p className="text-[10px] text-neutral-500">
          Backups: {data.backups.policy || "Policy available on request."} · Last:{" "}
          {data.backups.last_successful_backup ?? "N/A"}
        </p>
      )}
      {!error && data.infrastructure && (
        <p className="text-[10px] text-neutral-500">{data.infrastructure.model}</p>
      )}
    </section>
  );
}
```

---

## 4. Homepage Integration

**File:** `app/page.tsx`

```tsx
import { PlatformStatusCard } from "@/components/PlatformStatusCard";

export default async function HomePage() {
  return (
    <main>
      {/* Hero / intro */}
      <div className="mt-8 max-w-xl">
        <PlatformStatusCard />
      </div>
    </main>
  );
}
```

---

## 5. Optional `/status` Page

```tsx
import { PlatformStatusCard } from "@/components/PlatformStatusCard";

export default function StatusPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold text-neutral-100">
        Elytracloud Platform Status
      </h1>
      <PlatformStatusCard />
      <p className="text-sm text-neutral-400">
        This page reflects platform health and uptime for all managed WordPress
        environments.
      </p>
      <p className="text-xs text-neutral-500">
        Data updates automatically every 10 minutes.
      </p>
    </main>
  );
}
```

---

## 6. Mock Data for Local Dev

**File:** `public/status.json`

```json
{
  "updated_at": "2025-11-10T12:00:00Z",
  "platform_status": "operational",
  "uptime": { "last_24h": 100.0, "last_7d": 99.95 },
  "backups": {
    "policy": "Nightly backups, 7-day retention, off-site object storage.",
    "last_successful_backup": "2025-11-10T02:01:30Z",
    "last_backup_status": "success"
  },
  "infrastructure": {
    "model": "Dedicated droplet per client + managed database cluster.",
    "regions": ["nyc3"],
    "notes": "All sites behind managed HTTPS and monitored 24/7."
  }
}
```

Local `.env.local`:

```bash
NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/status.json"
```

---

## 7. Testing Guidance

**Unit tests:**

* Mock fetch returning valid, invalid, stale, and error responses.
* Validate fallback logic.

**Visual regression:**

* States: operational, degraded, outage, error, stale.
* Use Storybook or Playwright snapshots.

**Example Jest stub:**

```ts
test("returns data on success", async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      updated_at: new Date().toISOString(),
      platform_status: "operational"
    })
  });
  const { data, error } = await fetchPlatformStatus();
  expect(error).toBe(false);
  expect(data.platform_status).toBe("operational");
});
```

---

## 8. Frontend Acceptance Criteria

* [x] Homepage shows live status card
* [x] `/status` page optional but consistent
* [x] Works locally with mock JSON
* [x] Fallback & stale states render gracefully
* [x] No client or infra data leaked
* [x] Revalidation = 600 seconds
* [x] Tests cover success/error/stale scenarios

---

## ✅ Summary Table

| Layer       | Task                                         | Tool              | Owner    |
| ----------- | -------------------------------------------- | ----------------- | -------- |
| CLI         | `elytra status summary --json`               | Go/Python/Node    | Infra    |
| Generation  | `generate_status_json.sh`                    | Bash + jq + s3cmd | Infra    |
| Automation  | Cron (`*/10 * * * *`)                        | Linux cron        | Infra    |
| Storage     | DigitalOcean Spaces                          | S3 public-read    | Infra    |
| DNS         | `status.elytracloud.com`                     | Cloudflare/DO     | Infra    |
| Monitoring  | JSON uptime + freshness check                | Uptime Kuma       | Infra    |
| Consumption | `fetchPlatformStatus` + `PlatformStatusCard` | Next.js           | Frontend |
| Display     | Homepage + `/status`                         | Next.js/Tailwind  | Frontend |
