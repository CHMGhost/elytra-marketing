# 🏗️ System Architecture - Platform Status Monitoring

**Complete end-to-end data flow from monitoring to user display**

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          INFRASTRUCTURE LAYER                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐      ┌─────────────────┐
│  Uptime Kuma    │        │  WordPress      │      │  DigitalOcean   │
│  Monitoring     │        │  Instances      │      │  Spaces         │
│                 │        │                 │      │  (Backups)      │
│  - API Server   │        │  - Web Servers  │      │                 │
│  - Monitor IDs  │        │  - Databases    │      │  - Backup files │
│  - Heartbeats   │        │  - Services     │      │  - Timestamps   │
└─────────────────┘        └─────────────────┘      └─────────────────┘
         │                          │                          │
         │ API Call                 │ Monitor                  │ S3 List
         │ (every 10m)              │                          │ (every 10m)
         │                          │                          │
         └──────────────┬───────────┘                          │
                        │                                      │
                        ▼                                      │
┌─────────────────────────────────────────────────────────────┼──────────┐
│                       BACKEND AUTOMATION                     │          │
│                   (Infrastructure Server)                    │          │
│                                                              │          │
│  ┌──────────────────────────────────────────────────────────┼────────┐ │
│  │  Cron Job (every 10 minutes)                             │        │ │
│  │  */10 * * * * cd /opt/elytra-infra && ./generate.sh      │        │ │
│  └──────────────────────────────────────────────────────────┼────────┘ │
│                              │                               │          │
│                              ▼                               │          │
│  ┌──────────────────────────────────────────────────────────┼────────┐ │
│  │  scripts/cli/status.py (Main Orchestrator)               │        │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  1. Load environment config (.env)                         │  │ │
│  │  │  2. Call uptime_kuma_client.py ──────────────────────────┐ │  │ │
│  │  │     - Fetch monitor status                              │ │  │ │
│  │  │     - Calculate uptime % (24h, 7d, 30d)                 │ │  │ │
│  │  │     - Determine platform status                         │ │  │ │
│  │  │  3. Call backup_checker.py ───────────────────────────┐ │ │  │ │
│  │  │     - List backups in Spaces                          │ │ │  │ │
│  │  │     - Find latest backup                              │ │ │  │ │
│  │  │     - Calculate age and health                        │ │ │  │ │
│  │  │  4. Generate status.json                              │ │ │  │ │
│  │  │     {                                                  │ │ │  │ │
│  │  │       "updated_at": "2025-11-10T15:30:00Z",           │ │ │  │ │
│  │  │       "platform_status": "operational",               │ │ │  │ │
│  │  │       "uptime": { "last_24h": 100.0, ... },          │ │ │  │ │
│  │  │       "backups": { "last_backup_status": "success" }  │ │ │  │ │
│  │  │     }                                                  │ │ │  │ │
│  │  │  5. Save to /tmp/status.json                          │ │ │  │ │
│  │  └────────────────────────────────────────────────────────┘ │ │  │ │
│  └────────────────────────────────────────────────────────────┘ │  │ │
│                              │                                   │  │ │
│                              ▼                                   │  │ │
│  ┌──────────────────────────────────────────────────────────────┘  │ │
│  │  scripts/upload_status_json.sh                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │  aws s3 cp /tmp/status.json \                            │  │ │
│  │  │    s3://elytra-status/status.json \                      │  │ │
│  │  │    --endpoint-url https://nyc3.digitaloceanspaces.com \  │  │ │
│  │  │    --acl public-read \                                   │  │ │
│  │  │    --content-type "application/json" \                   │  │ │
│  │  │    --cache-control "public, max-age=300"                 │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               │ Upload (S3 API)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STORAGE & CDN LAYER                                  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  DigitalOcean Spaces (S3-compatible)                            │    │
│  │  Bucket: elytra-status                                          │    │
│  │  Endpoint: https://elytra-status.nyc3.digitaloceanspaces.com    │    │
│  │                                                                  │    │
│  │  File: status.json                                              │    │
│  │  ACL: public-read                                               │    │
│  │  Cache-Control: public, max-age=300 (5 minutes)                │    │
│  │  CORS: Enabled for elytracloud.com                             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Cloudflare CDN (Optional)                                      │    │
│  │  CNAME: status.elytracloud.com                                  │    │
│  │  Proxy: Enabled (orange cloud)                                  │    │
│  │  Edge Cache TTL: 5 minutes                                      │    │
│  │  Cache Level: Cache Everything                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
└──────────────────────────────┼───────────────────────────────────────────┘
                               │
                               │ HTTPS GET
                               │ (every 10 min, cached)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                                    │
│                   (Next.js Marketing Site)                               │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  lib/fetchStatus.ts                                             │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │  fetch("https://status.elytracloud.com/status.json", {    │  │    │
│  │  │    next: { revalidate: 600, tags: ['platform-status'] }   │  │    │
│  │  │  })                                                        │  │    │
│  │  │  - ISR caching (10 minutes)                               │  │    │
│  │  │  - On-demand revalidation support                         │  │    │
│  │  │  - Analytics tracking                                     │  │    │
│  │  │  - Error handling (fallback to "unknown")                 │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  components/PlatformStatusCard.tsx                              │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │  - Display status indicator (green/yellow/red/gray)       │  │    │
│  │  │  - Show uptime metrics (24h, 7d, 30d)                     │  │    │
│  │  │  - Show backup status                                     │  │    │
│  │  │  - Staleness warning (if data > 30 min old)              │  │    │
│  │  │  - Animated pulse on status dot                          │  │    │
│  │  │  - Data age display ("5m ago", "2h ago")                 │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Pages (Server Components)                                      │    │
│  │  - app/page.tsx (Homepage with status card)                     │    │
│  │  - app/status/page.tsx (Dedicated status page)                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
└──────────────────────────────┼───────────────────────────────────────────┘
                               │
                               │ HTML Render
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                     │
│                                                                           │
│  https://elytracloud.com                                                 │
│  https://elytracloud.com/status                                          │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Platform Status Card                                           │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │  🟢 Platform Status: Operational                          │  │    │
│  │  │                                                            │  │    │
│  │  │  Uptime:                                                   │  │    │
│  │  │    Last 24h: 100.0%                                       │  │    │
│  │  │    Last 7d:  99.98%                                       │  │    │
│  │  │    Last 30d: 99.95%                                       │  │    │
│  │  │                                                            │  │    │
│  │  │  Backups: ✅ Success (2h ago)                            │  │    │
│  │  │                                                            │  │    │
│  │  │  Updated: 5 minutes ago                                   │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Timeline

```
Time: 00:00 ──────────────────────────────────────────────────────────────
              │
              │ (Cron triggers every 10 minutes)
              ▼
Time: 00:00   Backend: Fetch Uptime Kuma data                    [2s]
Time: 00:02   Backend: Check backup status                       [1s]
Time: 00:03   Backend: Generate status.json                      [<1s]
Time: 00:03   Backend: Upload to Spaces                          [1s]
Time: 00:04   ✅ status.json available on CDN
              │
              │ (User visits website)
              ▼
Time: 00:05   Frontend: Fetch status.json from CDN              [100ms]
Time: 00:05   Frontend: Render PlatformStatusCard               [<50ms]
Time: 00:05   ✅ User sees current platform status
              │
              │ (ISR cache hit for next 10 minutes)
              ▼
Time: 00:06   User #2 visits → Served from cache (no fetch)     [0ms]
Time: 00:07   User #3 visits → Served from cache (no fetch)     [0ms]
Time: 00:14   User #N visits → Served from cache (no fetch)     [0ms]
              │
              │ (Cache expires after 10 minutes)
              ▼
Time: 00:15   User visits → Background revalidation             [100ms]
Time: 00:15   Frontend: Fetch fresh status.json                 [100ms]
Time: 00:15   ✅ User sees updated status
              │
              │ (Next cron cycle)
              ▼
Time: 10:00   Backend: Generate new status.json                 [5s]
Time: 10:05   ✅ New data available on CDN
              │
              └──> Cycle repeats...
```

---

## Component Responsibilities

### Infrastructure Layer
**Uptime Kuma:**
- Monitor WordPress instances, databases, services
- Provide API endpoint for monitor status
- Track heartbeat history

**WordPress Instances:**
- Production web servers being monitored
- Database servers
- Critical services (Redis, etc.)

**DigitalOcean Spaces (Backups):**
- Store database backups
- Store file backups
- Provide S3 API for verification

### Backend Automation Layer
**status.py (Main Orchestrator):**
- Coordinate data collection
- Generate status.json
- Handle errors gracefully
- Log execution details

**uptime_kuma_client.py:**
- Fetch monitor status via API
- Calculate uptime percentages
- Determine platform status

**backup_checker.py:**
- List backups in S3 bucket
- Find most recent backup
- Calculate backup age
- Determine backup health

**upload_status_json.sh:**
- Upload JSON to Spaces
- Set proper HTTP headers
- Verify upload success

### Storage & CDN Layer
**DigitalOcean Spaces (Status Hosting):**
- Host status.json publicly
- Serve via HTTPS
- Apply CORS headers
- Cache for 5 minutes

**Cloudflare CDN (Optional):**
- Global edge caching
- DDoS protection
- SSL termination
- 5-minute cache TTL

### Frontend Layer
**fetchStatus.ts:**
- Fetch status.json from CDN
- Cache for 10 minutes (ISR)
- Track analytics events
- Handle fetch errors

**PlatformStatusCard.tsx:**
- Display status visually
- Show uptime metrics
- Show backup status
- Warn if data is stale

**Pages:**
- Homepage: Embed status card in hero
- /status: Dedicated status page with details

### User Browser
- Render HTML/CSS/JS
- Execute client-side code
- Display platform status
- Cache static assets

---

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│  Caching Layers (from backend to user)                      │
└─────────────────────────────────────────────────────────────┘

1. Backend Generation: 10 minutes
   └─> Cron runs every 10 minutes
       └─> New status.json generated

2. S3 Cache-Control: 5 minutes
   └─> Cache-Control: public, max-age=300
       └─> CDN/browser can cache for 5 minutes

3. Cloudflare Edge Cache: 5 minutes (optional)
   └─> Edge Cache TTL: 5 minutes
       └─> Globally distributed cache

4. Next.js ISR: 10 minutes
   └─> next: { revalidate: 600 }
       └─> Server-side cache in Next.js

5. Browser Cache: 5 minutes
   └─> Respects Cache-Control header
       └─> Client-side caching

Total latency reduction:
- Without cache: ~100-200ms per request to S3
- With cache: ~0-10ms (served from Next.js cache)
- Cache hit rate: ~99% (assuming moderate traffic)
```

---

## Failure Modes & Handling

### Scenario 1: Uptime Kuma API Unreachable
```
Backend: uptime_kuma_client.py catches exception
    └─> Returns platform_status: "unknown"
    └─> Returns uptime: { last_24h: 0.0, ... }
    └─> Logs error
    └─> Continues execution (doesn't crash)

Result: status.json generated with unknown status
Frontend: Displays gray dot + "Unable to determine status"
```

### Scenario 2: Backup Bucket Inaccessible
```
Backend: backup_checker.py catches exception
    └─> Returns last_backup_status: "unknown"
    └─> Returns last_backup_time: null
    └─> Logs error
    └─> Continues execution

Result: status.json generated with unknown backup status
Frontend: Displays "Backup status unavailable"
```

### Scenario 3: Upload to Spaces Fails
```
Backend: upload_status_json.sh detects error
    └─> Logs error message
    └─> Returns exit code 1
    └─> Cron logs the failure

Result: Old status.json remains on CDN
Frontend: Continues serving cached data
    └─> Staleness warning appears after 30 minutes
```

### Scenario 4: Frontend Can't Fetch status.json
```
Frontend: fetchStatus.ts catches fetch error
    └─> Tracks analytics event: status_fetch_error
    └─> Returns DEFAULT_STATUS with platform_status: "unknown"
    └─> Logs error to console

Result: Gray status indicator displayed
User sees: "Unable to fetch platform status"
```

---

## Security Considerations

### Backend
- ✅ API keys stored in .env (gitignored)
- ✅ No hardcoded credentials
- ✅ Read-only access to Uptime Kuma API
- ✅ Minimal S3 permissions (upload to specific bucket)
- ✅ Virtual environment isolation
- ✅ Log files exclude sensitive data

### Storage
- ✅ Status bucket: public-read (status.json only)
- ✅ Backup bucket: private (no public access)
- ✅ CORS restricted to specific origins
- ✅ SSL/TLS enforced (HTTPS only)

### Frontend
- ✅ Public data only (no sensitive info in status.json)
- ✅ CSP headers via vercel.json
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff

---

## Monitoring & Observability

### Backend Logs
```bash
/opt/elytra-infra/logs/status-updates.log

[2025-11-10 15:30:00] Starting status update cycle
[2025-11-10 15:30:01] Platform status: operational
[2025-11-10 15:30:02] Backup status: success
[2025-11-10 15:30:03] Upload successful
```

### Frontend Analytics
```javascript
track("status_fetch_success", { 
  duration: 123, 
  age_minutes: 5 
});

track("status_stale_data", { 
  age_minutes: 45 
});
```

### Uptime Monitoring
- Monitor: https://status.elytracloud.com/status.json
- Check: HTTP 200 response
- Check: Valid JSON structure
- Check: updated_at timestamp < 15 minutes old

---

**System Architecture Complete** ✅

All components designed, implemented, and documented.  
Ready for production deployment.
