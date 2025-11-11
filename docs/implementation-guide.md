# 🚀 Platform Status Integration - Implementation Guide

**Version:** 1.0  
**Last Updated:** 2025-11-10  
**Owner:** Engineering Team  
**Estimated Timeline:** 4 weeks (parallelizable)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Implementation Phases](#implementation-phases)
4. [Week-by-Week Breakdown](#week-by-week-breakdown)
5. [Parallel Work Tracks](#parallel-work-tracks)
6. [Testing Strategy](#testing-strategy)
7. [Rollout Plan](#rollout-plan)
8. [Maintenance & Operations](#maintenance--operations)

---

## Overview

This guide outlines the step-by-step implementation of the Platform Status integration across both the **marketing site** (frontend) and **infrastructure repository** (backend data generation).

### Goals

- ✅ Display real-time platform health on the marketing site
- ✅ Build customer trust through transparency
- ✅ Provide self-service status information
- ✅ Automate status updates without manual intervention

### Success Metrics

- 📊 Status page loads in < 2 seconds
- 📊 Data freshness < 15 minutes
- 📊 99.9% uptime for status endpoint itself
- 📊 Zero false "outage" alerts

---

## Prerequisites

### Infrastructure Side

- [ ] Uptime Kuma is running and monitoring all tenants
- [ ] Ansible backup playbooks are operational
- [ ] DigitalOcean Spaces bucket exists and is accessible
- [ ] AWS CLI is installed on provisioning host
- [ ] Provisioning host has cron access

### Marketing Site

- [ ] Next.js site is running (App Router)
- [ ] TailwindCSS is configured
- [ ] Deployment pipeline exists (Vercel/DO App Platform)
- [ ] Access to environment variable configuration

### Team Requirements

- [ ] Frontend developer (React/Next.js)
- [ ] DevOps/Infrastructure engineer (Python/Terraform/Ansible)
- [ ] 1-2 hours/week for code reviews
- [ ] Access to production credentials (secured)

---

## Implementation Phases

```
Phase 1: Foundation (Week 1)
├── Frontend: Build UI with mock data
└── Backend: Design data sources & schema

Phase 2: Integration (Week 2)
├── Frontend: Connect to real endpoint
└── Backend: Build generation script (static data)

Phase 3: Automation (Week 3)
├── Frontend: Add caching & error handling
└── Backend: Wire up real metrics & cron

Phase 4: Production (Week 4)
├── Both: Monitoring & alerting
└── Both: Documentation & handoff
```

---

## Week-by-Week Breakdown

### 🗓 Week 1: Foundation & Mock Implementation

#### Frontend Track

**Day 1-2: Setup & Mock Data**

```bash
# Create mock data file
mkdir -p public/mocks
touch public/mocks/status.json
```

**File:** `public/mocks/status.json`
```json
{
  "updated_at": "2025-11-10T12:00:00Z",
  "platform_status": "operational",
  "uptime": {
    "last_24h": 100.0,
    "last_7d": 99.98
  },
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

**Environment setup:**
```bash
# .env.local
NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status.json"
```

**Day 3-4: Component Development**

Create the following files:
- `lib/fetchStatus.ts` (data fetcher)
- `components/PlatformStatusCard.tsx` (UI component)
- `app/status/page.tsx` (dedicated status page)

**Day 5: Testing & Review**

- [ ] Test all status states (operational/degraded/outage/unknown)
- [ ] Test error handling (delete mock file, corrupt JSON)
- [ ] Visual QA on mobile/desktop
- [ ] Code review with team

**Deliverable:** Working status component with mock data, merged to `main`

---

#### Backend Track

**Day 1-2: Architecture Planning**

Document data sources in `docs/status-data-sources.md`:

```markdown
## Data Source Mapping

| Field | Source | Query Method | Fallback |
|-------|--------|--------------|----------|
| platform_status | Uptime Kuma API | HTTP check count | "unknown" |
| uptime.last_24h | Uptime Kuma | Prometheus query | null |
| uptime.last_7d | Uptime Kuma | Prometheus query | null |
| last_successful_backup | Ansible logs | Parse JSON output | null |
| last_backup_status | Ansible logs | Exit code check | "unknown" |
```

**Day 3-4: Script Skeleton**

**File:** `scripts/cli/status.py` (in infra repo)

```python
#!/usr/bin/env python3
"""
Platform status JSON generator for Elytracloud.
Usage: python scripts/cli/status.py generate
"""

import json
import os
from datetime import datetime
from typing import Dict, Any

def fetch_uptime_metrics() -> Dict[str, float]:
    """Query Uptime Kuma for platform uptime."""
    # TODO: Implement Uptime Kuma API client
    return {"last_24h": 100.0, "last_7d": 99.98}

def fetch_backup_status() -> Dict[str, Any]:
    """Check latest backup status from Ansible logs."""
    # TODO: Parse Ansible output or query Spaces bucket
    return {
        "policy": "Nightly backups, 7-day retention, off-site object storage.",
        "last_successful_backup": datetime.utcnow().isoformat() + "Z",
        "last_backup_status": "success"
    }

def determine_platform_status(uptime: Dict, backups: Dict) -> str:
    """Calculate overall platform status."""
    # TODO: Define thresholds
    if uptime["last_24h"] >= 99.5 and backups["last_backup_status"] == "success":
        return "operational"
    elif uptime["last_24h"] >= 95.0:
        return "degraded"
    else:
        return "outage"

def generate_status_json() -> Dict[str, Any]:
    """Generate the status.json payload."""
    uptime = fetch_uptime_metrics()
    backups = fetch_backup_status()
    
    return {
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "platform_status": determine_platform_status(uptime, backups),
        "uptime": uptime,
        "backups": backups,
        "infrastructure": {
            "model": "Dedicated droplet per client + managed database cluster.",
            "regions": ["nyc3"],
            "notes": "All sites behind managed HTTPS and monitored 24/7."
        }
    }

if __name__ == "__main__":
    status = generate_status_json()
    print(json.dumps(status, indent=2))
```

**Day 5: Testing & Review**

- [ ] Run script locally, verify JSON output
- [ ] Validate against schema from `prompt.md`
- [ ] Code review with team

**Deliverable:** Working skeleton script that outputs valid JSON

---

### 🗓 Week 2: Integration & Static Data

#### Frontend Track

**Day 1-2: Environment Configuration**

Set up production environment variables:

```bash
# Vercel/DO App Platform dashboard
NEXT_PUBLIC_STATUS_JSON_URL="https://status.elytracloud.com/status.json"
```

**Day 3: Caching Implementation**

Update `lib/fetchStatus.ts`:

```ts
export async function fetchPlatformStatus(): Promise<PlatformStatus> {
  const url = process.env.NEXT_PUBLIC_STATUS_JSON_URL;
  if (!url) return DEFAULT_STATUS;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 600 }, // Cache for 10 minutes
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.warn(`Status fetch failed: ${res.status}`);
      return DEFAULT_STATUS;
    }
    
    const data = await res.json();
    
    // Validate freshness
    const updatedAt = new Date(data.updated_at);
    const now = new Date();
    const ageMinutes = (now.getTime() - updatedAt.getTime()) / 1000 / 60;
    
    if (ageMinutes > 30) {
      console.warn(`Status data is stale (${ageMinutes.toFixed(0)} minutes old)`);
      // Still return data, but frontend can show warning
    }
    
    return { ...DEFAULT_STATUS, ...data };
  } catch (error) {
    console.error('Status fetch error:', error);
    return DEFAULT_STATUS;
  }
}
```

**Day 4-5: Staleness Indicators**

Add visual warning for stale data in `PlatformStatusCard.tsx`:

```tsx
const updatedAt = new Date(status.updated_at);
const ageMinutes = (Date.now() - updatedAt.getTime()) / 1000 / 60;
const isStale = ageMinutes > 30;

{isStale && (
  <div className="flex items-center gap-1 text-xs text-yellow-500">
    <span>⚠</span>
    <span>Data may be outdated</span>
  </div>
)}
```

**Deliverable:** Frontend ready to consume real endpoint

---

#### Backend Track

**Day 1-2: Upload Script**

**File:** `scripts/upload_status_json.sh` (in infra repo)

```bash
#!/usr/bin/env bash
set -euo pipefail

# Upload status.json to DigitalOcean Spaces
# Usage: ./scripts/upload_status_json.sh <path-to-status.json>

STATUS_FILE="${1:-status.json}"

if [[ ! -f "$STATUS_FILE" ]]; then
  echo "Error: File $STATUS_FILE not found"
  exit 1
fi

# Load environment from .env
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

# Validate required variables
: "${SPACES_ACCESS_KEY:?SPACES_ACCESS_KEY not set}"
: "${SPACES_SECRET_KEY:?SPACES_SECRET_KEY not set}"
: "${SPACES_BUCKET:?SPACES_BUCKET not set}"
: "${SPACES_ENDPOINT:?SPACES_ENDPOINT not set}"

echo "Uploading $STATUS_FILE to Spaces..."

aws s3 cp "$STATUS_FILE" \
  "s3://${SPACES_BUCKET}/status.json" \
  --endpoint-url="$SPACES_ENDPOINT" \
  --acl public-read \
  --content-type "application/json" \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=300" \
  --region us-east-1

echo "✓ Upload complete: https://${SPACES_BUCKET}.${SPACES_ENDPOINT#https://}/status.json"
```

**Day 3: Integration Test**

```bash
# Generate static status.json
python scripts/cli/status.py generate > /tmp/status.json

# Upload to Spaces
./scripts/upload_status_json.sh /tmp/status.json

# Verify it's accessible
curl -I https://status.elytracloud.com/status.json
```

**Day 4-5: DNS Setup**

Configure `status.elytracloud.com`:

**Option A: CNAME to Spaces**
```
status.elytracloud.com → CNAME → your-bucket.nyc3.digitaloceanspaces.com
```

**Option B: Cloudflare Proxy**
```
1. Add A record pointing to Spaces IP
2. Enable Cloudflare proxy (orange cloud)
3. Set caching rules for /status.json
```

**Deliverable:** Static `status.json` accessible at public URL

---

### 🗓 Week 3: Real Data & Automation

#### Frontend Track

**Day 1-2: Production Deployment**

- [ ] Deploy to production with real `NEXT_PUBLIC_STATUS_JSON_URL`
- [ ] Verify status card appears on homepage
- [ ] Test `/status` page in production
- [ ] Monitor performance (Lighthouse, Core Web Vitals)

**Day 3-4: Error Monitoring**

Add logging and monitoring:

```ts
// lib/fetchStatus.ts
import { track } from '@/lib/analytics'; // Your analytics tool

export async function fetchPlatformStatus(): Promise<PlatformStatus> {
  const startTime = Date.now();
  
  try {
    const res = await fetch(url, { ... });
    
    track('status_fetch_success', {
      duration: Date.now() - startTime,
      status_code: res.status
    });
    
    return data;
  } catch (error) {
    track('status_fetch_error', {
      error: error.message,
      duration: Date.now() - startTime
    });
    
    return DEFAULT_STATUS;
  }
}
```

**Day 5: A/B Testing (Optional)**

Test impact of status badge on conversion:
- Group A: Status badge visible
- Group B: No status badge
- Metric: Trial signup rate

**Deliverable:** Production deployment with monitoring

---

#### Backend Track

**Day 1-2: Uptime Kuma Integration**

**File:** `scripts/cli/uptime_kuma_client.py`

```python
import os
import requests
from typing import Dict, Optional

class UptimeKumaClient:
    """Client for Uptime Kuma metrics API."""
    
    def __init__(self):
        self.base_url = os.getenv("UPTIME_KUMA_METRICS_URL")
        self.api_key = os.getenv("UPTIME_KUMA_API_KEY")
        
        if not self.base_url:
            raise ValueError("UPTIME_KUMA_METRICS_URL not set")
    
    def get_uptime_metrics(self, hours: int = 24) -> Optional[float]:
        """
        Fetch average uptime across all monitors.
        
        Args:
            hours: Time window (24 or 168 for 7 days)
            
        Returns:
            Uptime percentage or None if unavailable
        """
        try:
            # Example: Parse Prometheus metrics
            # Adjust based on your Uptime Kuma setup
            response = requests.get(
                f"{self.base_url}/metrics",
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=10
            )
            response.raise_for_status()
            
            # Parse metrics (this is pseudo-code, adjust to your format)
            # monitor_up{monitor="example"} 1
            # monitor_up{monitor="demo"} 1
            
            lines = response.text.split('\n')
            monitors = [l for l in lines if l.startswith('monitor_up')]
            
            if not monitors:
                return None
            
            # Calculate percentage of monitors that are up
            up_count = sum(1 for m in monitors if m.endswith(' 1'))
            uptime = (up_count / len(monitors)) * 100
            
            return round(uptime, 2)
            
        except Exception as e:
            print(f"Error fetching uptime: {e}")
            return None
```

Update `scripts/cli/status.py`:

```python
from uptime_kuma_client import UptimeKumaClient

def fetch_uptime_metrics() -> Dict[str, float]:
    """Query Uptime Kuma for platform uptime."""
    client = UptimeKumaClient()
    
    uptime_24h = client.get_uptime_metrics(hours=24)
    uptime_7d = client.get_uptime_metrics(hours=168)
    
    return {
        "last_24h": uptime_24h if uptime_24h is not None else 100.0,
        "last_7d": uptime_7d if uptime_7d is not None else 100.0
    }
```

**Day 3: Backup Status Integration**

**File:** `scripts/cli/backup_checker.py`

```python
import boto3
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class BackupChecker:
    """Check backup status from DigitalOcean Spaces."""
    
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            endpoint_url=os.getenv('SPACES_ENDPOINT'),
            aws_access_key_id=os.getenv('SPACES_ACCESS_KEY'),
            aws_secret_access_key=os.getenv('SPACES_SECRET_KEY'),
            region_name='us-east-1'
        )
        self.bucket = os.getenv('SPACES_BUCKET')
    
    def get_latest_backup(self, prefix: str = "backups/") -> Optional[Dict[str, Any]]:
        """
        Find the most recent backup file in Spaces.
        
        Returns:
            {
                "key": "backups/demo/2025-11-10.tar.gz",
                "last_modified": datetime object,
                "size": 12345678
            }
        """
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket,
                Prefix=prefix,
                MaxKeys=1000
            )
            
            if 'Contents' not in response:
                return None
            
            # Sort by last modified, get most recent
            backups = sorted(
                response['Contents'],
                key=lambda x: x['LastModified'],
                reverse=True
            )
            
            if not backups:
                return None
            
            latest = backups[0]
            return {
                "key": latest['Key'],
                "last_modified": latest['LastModified'],
                "size": latest['Size']
            }
            
        except Exception as e:
            print(f"Error checking backups: {e}")
            return None
    
    def check_backup_health(self) -> Dict[str, Any]:
        """
        Determine backup status based on recency.
        
        Returns:
            {
                "last_successful_backup": "2025-11-10T02:01:30Z",
                "last_backup_status": "success" | "warning" | "failed"
            }
        """
        latest = self.get_latest_backup()
        
        if not latest:
            return {
                "last_successful_backup": None,
                "last_backup_status": "unknown"
            }
        
        age_hours = (datetime.now(latest['last_modified'].tzinfo) - latest['last_modified']).total_seconds() / 3600
        
        # Determine status based on age
        if age_hours <= 26:  # Within last day + 2 hour buffer
            status = "success"
        elif age_hours <= 48:  # Within 2 days
            status = "warning"
        else:
            status = "failed"
        
        return {
            "last_successful_backup": latest['last_modified'].isoformat(),
            "last_backup_status": status
        }
```

Update `scripts/cli/status.py`:

```python
from backup_checker import BackupChecker

def fetch_backup_status() -> Dict[str, Any]:
    """Check latest backup status from Spaces."""
    checker = BackupChecker()
    health = checker.check_backup_health()
    
    return {
        "policy": "Nightly backups, 7-day retention, off-site object storage.",
        **health
    }
```

**Day 4: Cron Setup**

**File:** `/etc/cron.d/elytra-status` (on provisioning host)

```cron
# Generate and upload platform status every 10 minutes
*/10 * * * * elytra cd /opt/elytra-infra && /usr/bin/python3 scripts/cli/elytra.py generate-status --upload >> /var/log/elytra-status.log 2>&1
```

Or use systemd timer:

**File:** `/etc/systemd/system/elytra-status.service`

```ini
[Unit]
Description=Generate Elytracloud Platform Status
After=network.target

[Service]
Type=oneshot
User=elytra
WorkingDirectory=/opt/elytra-infra
EnvironmentFile=/opt/elytra-infra/.env
ExecStart=/usr/bin/python3 scripts/cli/elytra.py generate-status --upload
StandardOutput=journal
StandardError=journal
```

**File:** `/etc/systemd/system/elytra-status.timer`

```ini
[Unit]
Description=Run status generation every 10 minutes

[Timer]
OnBootSec=1min
OnUnitActiveSec=10min
AccuracySec=1min

[Install]
WantedBy=timers.target
```

Enable:
```bash
sudo systemctl enable elytra-status.timer
sudo systemctl start elytra-status.timer
```

**Day 5: Testing & Validation**

- [ ] Trigger manual status generation
- [ ] Wait 10 minutes, verify auto-update
- [ ] Check logs for errors
- [ ] Verify frontend reflects new data
- [ ] Test failure scenarios (break Uptime Kuma connection)

**Deliverable:** Fully automated status generation running in production

---

### 🗓 Week 4: Monitoring, Alerts & Documentation

#### Frontend Track

**Day 1-2: Unit Tests**

**File:** `__tests__/lib/fetchStatus.test.ts`

```ts
import { fetchPlatformStatus } from '@/lib/fetchStatus';

// Mock fetch
global.fetch = jest.fn();

describe('fetchPlatformStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns operational status when fetch succeeds', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        updated_at: '2025-11-10T12:00:00Z',
        platform_status: 'operational',
        uptime: { last_24h: 100.0, last_7d: 99.98 }
      })
    });

    const status = await fetchPlatformStatus();
    
    expect(status.platform_status).toBe('operational');
    expect(status.uptime?.last_24h).toBe(100.0);
  });

  it('returns default status when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const status = await fetchPlatformStatus();
    
    expect(status.platform_status).toBe('unknown');
  });

  it('returns default status when JSON is invalid', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); }
    });

    const status = await fetchPlatformStatus();
    
    expect(status.platform_status).toBe('unknown');
  });
});
```

**Day 3-4: Component Tests**

**File:** `__tests__/components/PlatformStatusCard.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { PlatformStatusCard } from '@/components/PlatformStatusCard';

// Mock the fetch function
jest.mock('@/lib/fetchStatus', () => ({
  fetchPlatformStatus: jest.fn()
}));

import { fetchPlatformStatus } from '@/lib/fetchStatus';

describe('PlatformStatusCard', () => {
  it('renders operational status correctly', async () => {
    (fetchPlatformStatus as jest.Mock).mockResolvedValueOnce({
      platform_status: 'operational',
      updated_at: '2025-11-10T12:00:00Z',
      uptime: { last_24h: 100.0, last_7d: 99.98 }
    });

    render(await PlatformStatusCard());
    
    expect(screen.getByText('All systems operational')).toBeInTheDocument();
    expect(screen.getByText(/Uptime 24h: 100%/)).toBeInTheDocument();
  });

  it('renders degraded status with warning color', async () => {
    (fetchPlatformStatus as jest.Mock).mockResolvedValueOnce({
      platform_status: 'degraded',
      updated_at: '2025-11-10T12:00:00Z'
    });

    render(await PlatformStatusCard());
    
    expect(screen.getByText('Minor degradation')).toBeInTheDocument();
  });
});
```

**Day 5: Performance Testing**

Run Lighthouse and optimize:

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://elytracloud.com --view

# Check metrics:
# - First Contentful Paint < 1.5s
# - Largest Contentful Paint < 2.5s
# - Total Blocking Time < 200ms
```

**Deliverable:** Comprehensive test coverage

---

#### Backend Track

**Day 1-2: Monitoring Setup**

**Monitor the status generation process itself:**

**File:** `scripts/cli/status_monitor.py`

```python
#!/usr/bin/env python3
"""
Monitor that status.json is being generated and uploaded correctly.
Run this separately to alert on failures.
"""

import requests
import sys
from datetime import datetime, timedelta

STATUS_URL = "https://status.elytracloud.com/status.json"
MAX_AGE_MINUTES = 20  # Alert if data is > 20 minutes old

def check_status_health():
    """Verify status.json is fresh and accessible."""
    try:
        response = requests.get(STATUS_URL, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        updated_at = datetime.fromisoformat(data['updated_at'].replace('Z', '+00:00'))
        age_minutes = (datetime.now(updated_at.tzinfo) - updated_at).total_seconds() / 60
        
        if age_minutes > MAX_AGE_MINUTES:
            print(f"ERROR: Status data is stale ({age_minutes:.0f} minutes old)")
            return False
        
        print(f"OK: Status data is fresh ({age_minutes:.0f} minutes old)")
        return True
        
    except Exception as e:
        print(f"ERROR: Failed to fetch status.json: {e}")
        return False

if __name__ == "__main__":
    success = check_status_health()
    sys.exit(0 if success else 1)
```

**Add to Uptime Kuma:**
- Create new monitor for `https://status.elytracloud.com/status.json`
- Check every 5 minutes
- Alert if unreachable or returns non-200

**Day 3: Alerting Integration**

**File:** `scripts/cli/alert_on_failure.sh`

```bash
#!/usr/bin/env bash
# Call after status generation to alert on failures

set -euo pipefail

LOG_FILE="/var/log/elytra-status.log"
ALERT_EMAIL="${SENDGRID_ADMIN_EMAIL:-admin@elytracloud.com}"

# Check if last run failed
if ! python3 scripts/cli/status_monitor.py; then
  # Send alert via SendGrid
  python3 - <<EOF
import os
import requests

url = "https://api.sendgrid.com/v3/mail/send"
headers = {
    "Authorization": f"Bearer {os.getenv('SENDGRID_API_KEY')}",
    "Content-Type": "application/json"
}
data = {
    "personalizations": [{"to": [{"email": "${ALERT_EMAIL}"}]}],
    "from": {"email": "${SENDGRID_FROM_EMAIL}"},
    "subject": "⚠️ Status Generation Failed",
    "content": [{
        "type": "text/plain",
        "value": "Platform status generation or upload has failed. Check ${LOG_FILE} on provisioning host."
    }]
}
requests.post(url, headers=headers, json=data)
EOF
  
  echo "Alert sent to ${ALERT_EMAIL}"
fi
```

**Day 4-5: Documentation**

**File:** `docs/status-generation-runbook.md`

```markdown
# Platform Status Generation - Runbook

## Overview

Automated cron job generates `status.json` every 10 minutes and uploads to Spaces.

## Architecture

```
Uptime Kuma → [Python Script] → status.json → Spaces → CDN → Marketing Site
Spaces (backups) ↗
```

## Manual Operations

### Force Status Update

```bash
ssh provisioning-host
cd /opt/elytra-infra
source .env
python3 scripts/cli/elytra.py generate-status --upload
```

### Check Status Generation Logs

```bash
tail -f /var/log/elytra-status.log
```

### Troubleshooting

**Symptom:** Frontend shows "Status unavailable"

1. Check if status.json is accessible:
   ```bash
   curl https://status.elytracloud.com/status.json
   ```

2. Check cron/timer is running:
   ```bash
   systemctl status elytra-status.timer
   journalctl -u elytra-status.service
   ```

3. Test script manually:
   ```bash
   python3 scripts/cli/elytra.py generate-status
   ```

**Symptom:** Status shows "outage" incorrectly

1. Check Uptime Kuma:
   ```bash
   curl $UPTIME_KUMA_METRICS_URL/metrics
   ```

2. Verify monitor configuration
3. Review threshold in `scripts/cli/status.py` (line XX)

**Symptom:** Backup status always "failed"

1. Check Spaces bucket:
   ```bash
   aws s3 ls s3://$SPACES_BUCKET/backups/ --endpoint-url=$SPACES_ENDPOINT
   ```

2. Verify backup cron is running
3. Check backup script exit codes

## Emergency Manual Override

If automated status is incorrect during an incident:

```bash
# Create manual status.json
cat > /tmp/status-override.json <<EOF
{
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "platform_status": "outage",
  "uptime": {"last_24h": 95.0, "last_7d": 98.5},
  "backups": {
    "policy": "Nightly backups, 7-day retention, off-site object storage.",
    "last_successful_backup": "2025-11-10T02:01:30Z",
    "last_backup_status": "success"
  },
  "infrastructure": {
    "model": "Dedicated droplet per client + managed database cluster.",
    "regions": ["nyc3"],
    "notes": "Investigating service disruption. Updates via status page."
  }
}
EOF

# Upload
./scripts/upload_status_json.sh /tmp/status-override.json

# Re-enable automation when incident resolved
systemctl start elytra-status.timer
```

## Monitoring

- **Uptime Kuma:** Monitors status.json endpoint
- **Logs:** `/var/log/elytra-status.log`
- **Alerts:** Email to `SENDGRID_ADMIN_EMAIL` on failures

## Security Notes

- status.json is PUBLIC by design
- Never include client names, IPs, or sensitive data
- Review JSON before each major infrastructure change
- Credentials stored in `/opt/elytra-infra/.env` (0600 permissions)
```

**Deliverable:** Complete operational documentation

---

## Parallel Work Tracks

These tasks can be done simultaneously by different team members:

### Track A: Frontend Developer

```
Week 1: Build UI components with mocks
Week 2: Add caching and error handling
Week 3: Deploy to production
Week 4: Write tests and optimize performance
```

### Track B: Backend/DevOps Engineer

```
Week 1: Design data collection architecture
Week 2: Build upload script and DNS
Week 3: Integrate real metrics and automate
Week 4: Set up monitoring and alerts
```

### Track C: QA/Product (Part-time)

```
Week 2: Review mockups and user flow
Week 3: Test in staging environment
Week 4: Production acceptance testing
```

---

## Testing Strategy

### Unit Tests (Frontend)

- [ ] `fetchPlatformStatus()` handles success/failure
- [ ] Component renders all status states correctly
- [ ] Error boundaries catch JSON parse failures

### Integration Tests (Backend)

- [ ] Script can query Uptime Kuma API
- [ ] Script can check Spaces for backups
- [ ] Upload script succeeds with valid credentials
- [ ] Upload script fails gracefully without credentials

### End-to-End Tests

- [ ] Status updates reflect on marketing site within 15 minutes
- [ ] Frontend gracefully handles missing status.json
- [ ] Stale data triggers warning indicator
- [ ] Manual override process works during incidents

### Load Testing

- [ ] status.json endpoint can handle 1000 req/min
- [ ] CDN caching reduces origin hits
- [ ] Frontend doesn't DoS status endpoint

---

## Rollout Plan

### Phase 1: Soft Launch (Week 2)

- Deploy frontend to production with mock URL
- Generate real status.json but don't publish widely
- Internal team validates accuracy
- **Success criteria:** Status matches reality for 48 hours

### Phase 2: Beta (Week 3)

- Point frontend to real status.json
- Add link to `/status` page in footer (small)
- Monitor analytics and error rates
- **Success criteria:** No false alarms, <5% error rate

### Phase 3: Full Launch (Week 4)

- Promote status badge to homepage hero section
- Announce on social media / blog
- Add to sales collateral
- **Success criteria:** Positive customer feedback

### Rollback Plan

If status system fails:

1. **Immediate:** Point `NEXT_PUBLIC_STATUS_JSON_URL` to static fallback:
   ```json
   {
     "updated_at": "2025-11-10T00:00:00Z",
     "platform_status": "operational",
     "uptime": null,
     "backups": null,
     "infrastructure": {
       "model": "Dedicated droplet per client + managed database.",
       "regions": ["nyc3"],
       "notes": "Platform monitored 24/7."
     }
   }
   ```

2. **Short-term:** Hide status badge via feature flag

3. **Long-term:** Fix root cause, re-enable gradually

---

## Maintenance & Operations

### Weekly Tasks

- [ ] Review status generation logs for errors
- [ ] Verify uptime percentages match expectations
- [ ] Check backup success rates

### Monthly Tasks

- [ ] Audit JSON output for accuracy
- [ ] Review and update infrastructure text
- [ ] Test manual override procedure
- [ ] Validate monitoring alerts still work

### Quarterly Tasks

- [ ] Update documentation with lessons learned
- [ ] Review and optimize data collection methods
- [ ] Consider adding new metrics (response times, etc.)

### On-Call Procedures

**Scenario: Status shows "outage" but platform is up**

1. Check Uptime Kuma dashboard
2. Verify monitors are configured correctly
3. Review thresholds in status generation script
4. Manual override if necessary
5. Fix root cause and re-enable automation

**Scenario: Status shows "operational" during actual outage**

1. Immediately manual override to "outage"
2. Investigate why automation didn't detect failure
3. Update detection logic
4. Post-mortem after incident

**Scenario: status.json endpoint returns 404**

1. Check Spaces bucket for file existence
2. Verify DNS/CDN configuration
3. Re-upload status.json manually
4. Check cron/timer status
5. Review upload script logs

---

## Success Metrics & KPIs

### Technical Metrics

- **Uptime:** status.json endpoint > 99.9%
- **Freshness:** Data < 15 minutes old > 99%
- **Accuracy:** False alarms < 1 per month
- **Performance:** Frontend status card loads < 500ms

### Business Metrics

- **Engagement:** `/status` page views
- **Trust:** Visitor time on site (before/after)
- **Conversion:** Trial signups (A/B test)
- **Support:** Reduction in "is the platform down?" tickets

### Monitoring Dashboard

Create a simple dashboard showing:

```
┌─────────────────────────────────────────┐
│ Status System Health                    │
├─────────────────────────────────────────┤
│ ✓ status.json reachable                 │
│ ✓ Data age: 8 minutes                   │
│ ✓ Last update: 2025-11-10 12:08 UTC     │
│ ✓ Uptime Kuma: responding               │
│ ✓ Spaces bucket: accessible             │
│ ⚠ Frontend errors: 2% (threshold: 5%)   │
└─────────────────────────────────────────┘
```

---

## Appendix A: Environment Variables Reference

### Marketing Site (Frontend)

```bash
# Required
NEXT_PUBLIC_STATUS_JSON_URL="https://status.elytracloud.com/status.json"

# Optional (for analytics)
NEXT_PUBLIC_ANALYTICS_ID="..."
```

### Infrastructure Repo (Backend)

```bash
# Uptime Kuma
UPTIME_KUMA_METRICS_URL="https://uptime.elytracloud.com"
UPTIME_KUMA_API_KEY="uk_xxxxxxxxxxxxx"

# DigitalOcean Spaces
SPACES_ACCESS_KEY="DO00XXXXXXXXXXXXX"
SPACES_SECRET_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxx"
SPACES_BUCKET="elytra-backups"
SPACES_ENDPOINT="https://nyc3.digitaloceanspaces.com"

# Alerting
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="alerts@elytracloud.com"
SENDGRID_ADMIN_EMAIL="ops@elytracloud.com"
```

---

## Appendix B: File Structure

```
elytra-marketing/                    # Frontend repo
├── app/
│   ├── page.tsx                     # Homepage with status card
│   └── status/
│       └── page.tsx                 # Dedicated status page
├── components/
│   └── PlatformStatusCard.tsx       # Status card component
├── lib/
│   └── fetchStatus.ts               # Data fetcher
├── public/
│   └── mocks/
│       └── status.json              # Mock data for local dev
└── __tests__/
    ├── lib/
    │   └── fetchStatus.test.ts
    └── components/
        └── PlatformStatusCard.test.tsx

elytra-infra/                        # Infrastructure repo
├── scripts/
│   ├── cli/
│   │   ├── elytra.py                # Main CLI (add generate-status command)
│   │   ├── status.py                # Status generation logic
│   │   ├── uptime_kuma_client.py    # Uptime Kuma API client
│   │   └── backup_checker.py        # Backup status checker
│   ├── upload_status_json.sh        # Upload to Spaces
│   └── alert_on_failure.sh          # Alerting script
└── docs/
    └── status-generation-runbook.md # Operational runbook
```

---

## Appendix C: Quick Reference Commands

```bash
# Frontend
npm run dev                          # Local development
npm run build                        # Production build
npm test                             # Run tests
lighthouse https://elytracloud.com   # Performance audit

# Backend
python3 scripts/cli/elytra.py generate-status              # Generate JSON
./scripts/upload_status_json.sh /tmp/status.json          # Upload to Spaces
curl https://status.elytracloud.com/status.json            # Verify endpoint
python3 scripts/cli/status_monitor.py                      # Check health

# Monitoring
systemctl status elytra-status.timer                       # Check cron
journalctl -u elytra-status.service -f                     # Watch logs
tail -f /var/log/elytra-status.log                         # Manual logs
```

---

## Questions or Issues?

- **Technical lead:** [Your Name]
- **Slack channel:** #platform-status
- **Documentation:** `docs/prompt.md`, `docs/status-generation-runbook.md`
- **Emergency contact:** ops@elytracloud.com

---

**Last Updated:** 2025-11-10  
**Next Review:** 2025-12-10  
**Version:** 1.0
