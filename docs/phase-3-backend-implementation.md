# Phase 3: Backend Implementation Guide

**Status:** Ready for Implementation  
**Timeline:** Week 3 (Backend Development & Deployment)  
**Repository:** `elytra-infra` (separate from marketing site)

## Overview

Phase 3 implements the backend automation system that generates and uploads `status.json` every 10 minutes. This involves:
- Integrating with Uptime Kuma API for platform monitoring
- Checking backup status from DigitalOcean Spaces
- Generating status.json matching frontend schema
- Uploading to public S3 bucket
- Automating with cron jobs

---

## Prerequisites

### Required Services
- ✅ Uptime Kuma instance running (for platform monitoring)
- ✅ DigitalOcean Spaces bucket (for status.json hosting)
- ✅ DigitalOcean Spaces bucket (for backup storage)
- ⚠️ Server/VM for running cron jobs (Ubuntu/Debian recommended)

### Required Credentials
- Uptime Kuma API URL and API Key
- DigitalOcean Spaces Access Key and Secret Key
- DigitalOcean Spaces Endpoint (e.g., `nyc3.digitaloceanspaces.com`)
- Bucket names (status hosting + backup storage)

### Python Dependencies
```bash
pip install requests python-dotenv boto3
```

---

## Repository Setup

### 1. Create Infrastructure Repository

```bash
# Navigate to parent directory
cd ~/projects

# Create new repository
mkdir elytra-infra
cd elytra-infra
git init

# Create directory structure
mkdir -p scripts/cli
mkdir -p config
mkdir -p logs
```

### 2. Initialize Python Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install requests python-dotenv boto3

# Save requirements
pip freeze > requirements.txt
```

---

## Implementation Files

### File Structure
```
elytra-infra/
├── scripts/
│   ├── cli/
│   │   ├── status.py                  # Main status generator
│   │   ├── uptime_kuma_client.py      # Uptime Kuma API wrapper
│   │   └── backup_checker.py          # Backup status checker
│   ├── upload_status_json.sh          # Upload automation
│   └── generate_and_upload.sh         # Combined script for cron
├── config/
│   ├── .env.example                   # Environment template
│   └── .env                           # Actual credentials (gitignored)
├── logs/
│   └── status-updates.log             # Execution logs
├── requirements.txt                   # Python dependencies
├── .gitignore                         # Ignore .env and logs
└── README.md                          # Setup instructions
```

---

## Core Components

### 1. Uptime Kuma API Client (`scripts/cli/uptime_kuma_client.py`)

**Purpose:** Fetch monitor status and uptime metrics from Uptime Kuma.

**Key Features:**
- Authenticate with API key
- Fetch all monitors or specific monitor by ID
- Calculate uptime percentages (24h, 7d, 30d)
- Determine overall platform status based on monitor states

**API Endpoints:**
- `GET /api/status-page/{slug}` - Public status page (if available)
- `GET /api/monitor` - List all monitors (requires auth)
- `GET /api/monitor/{id}/heartbeat` - Get heartbeat history

**Status Logic:**
```python
def calculate_platform_status(monitors):
    """
    Determine overall status from monitor states.
    - All UP → "operational"
    - Any DOWN → "outage"
    - Any PENDING/WARN → "degraded"
    """
    if any(m['status'] == 0 for m in monitors):  # 0 = DOWN
        return "outage"
    elif any(m['status'] == 2 for m in monitors):  # 2 = PENDING
        return "degraded"
    elif all(m['status'] == 1 for m in monitors):  # 1 = UP
        return "operational"
    else:
        return "unknown"
```

### 2. Backup Checker (`scripts/cli/backup_checker.py`)

**Purpose:** Verify latest backup exists and is recent.

**Key Features:**
- List objects in DigitalOcean Spaces backup bucket
- Find most recent backup file
- Check if backup is within acceptable age (e.g., < 25 hours for daily backups)
- Return backup metadata (timestamp, size, status)

**S3 API Usage:**
```python
import boto3

s3 = boto3.client('s3',
    endpoint_url=f'https://{SPACES_ENDPOINT}',
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY
)

response = s3.list_objects_v2(Bucket=BACKUP_BUCKET, Prefix='backups/')
latest_backup = max(response['Contents'], key=lambda x: x['LastModified'])
```

**Status Logic:**
```python
def check_backup_status():
    """
    Determine backup health.
    - Latest backup < 25h old → "success"
    - Latest backup 25-48h old → "warning"
    - Latest backup > 48h old → "failed"
    """
    age_hours = (now - latest_backup_time).total_seconds() / 3600
    
    if age_hours < 25:
        return "success"
    elif age_hours < 48:
        return "warning"
    else:
        return "failed"
```

### 3. Status Generator (`scripts/cli/status.py`)

**Purpose:** Orchestrate data collection and generate status.json.

**Workflow:**
```python
1. Fetch monitor data from Uptime Kuma
2. Calculate uptime percentages (24h, 7d, 30d)
3. Check backup status from Spaces
4. Determine overall platform status
5. Generate status.json with schema:
   {
     "updated_at": "2025-11-10T15:30:00Z",
     "platform_status": "operational",
     "uptime": {
       "last_24h": 100.0,
       "last_7d": 99.98,
       "last_30d": 99.95
     },
     "backups": {
       "last_backup_status": "success",
       "last_backup_time": "2025-11-10T02:00:00Z"
     }
   }
6. Save to /tmp/status.json
7. Log execution details
```

**Error Handling:**
- If Uptime Kuma API fails → set `platform_status: "unknown"`
- If backup check fails → set `last_backup_status: "unknown"`
- Always generate valid JSON (never fail silently)

### 4. Upload Script (`scripts/upload_status_json.sh`)

**Purpose:** Upload status.json to public Spaces bucket with proper headers.

**Key Requirements:**
- Set `Content-Type: application/json`
- Set `Cache-Control: public, max-age=300` (5 min cache)
- Set ACL to `public-read`
- Verify upload success

**Implementation:**
```bash
#!/bin/bash

SOURCE_FILE="/tmp/status.json"
BUCKET="elytra-status"
KEY="status.json"
ENDPOINT="nyc3.digitaloceanspaces.com"

# Upload with AWS CLI (or s3cmd)
aws s3 cp "$SOURCE_FILE" \
  "s3://${BUCKET}/${KEY}" \
  --endpoint-url "https://${ENDPOINT}" \
  --acl public-read \
  --content-type "application/json" \
  --cache-control "public, max-age=300" \
  --metadata-directive REPLACE

if [ $? -eq 0 ]; then
  echo "✅ Upload successful: https://${BUCKET}.${ENDPOINT}/${KEY}"
else
  echo "❌ Upload failed"
  exit 1
fi
```

---

## Environment Configuration

### `.env.example`
```bash
# Uptime Kuma Configuration
UPTIME_KUMA_URL=https://uptime.yourdomain.com
UPTIME_KUMA_API_KEY=uk1_xxxxxxxxxxxxxxxxxxxxxxxxxx

# DigitalOcean Spaces (Status Hosting)
SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
SPACES_ACCESS_KEY=DO00XXXXXXXXXXXXX
SPACES_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STATUS_BUCKET=elytra-status
STATUS_BUCKET_KEY=status.json

# DigitalOcean Spaces (Backup Storage)
BACKUP_BUCKET=elytra-backups
BACKUP_PREFIX=backups/

# Monitoring Configuration
BACKUP_MAX_AGE_HOURS=25
MONITOR_IDS=1,2,3,4  # Comma-separated list of monitor IDs to check

# Logging
LOG_FILE=/opt/elytra-infra/logs/status-updates.log
LOG_LEVEL=INFO
```

---

## Deployment Steps

### 1. Server Setup

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
cd /opt
sudo git clone https://github.com/yourusername/elytra-infra.git
cd elytra-infra

# Set up Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp config/.env.example config/.env
nano config/.env  # Add your credentials

# Make scripts executable
chmod +x scripts/*.sh
chmod +x scripts/cli/*.py
```

### 2. Install AWS CLI (for Spaces uploads)

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure set aws_access_key_id "DO00XXXXXXXXXXXXX"
aws configure set aws_secret_access_key "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
aws configure set default.region us-east-1
```

### 3. Test Scripts Manually

```bash
# Test status generation
cd /opt/elytra-infra
source venv/bin/activate
python scripts/cli/status.py

# Verify output
cat /tmp/status.json

# Test upload
./scripts/upload_status_json.sh

# Verify public URL
curl https://elytra-status.nyc3.digitaloceanspaces.com/status.json
```

### 4. Set Up Cron Job

```bash
# Edit crontab
crontab -e

# Add job to run every 10 minutes
*/10 * * * * cd /opt/elytra-infra && ./scripts/generate_and_upload.sh >> logs/status-updates.log 2>&1
```

**Combined Script (`scripts/generate_and_upload.sh`):**
```bash
#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Activate virtual environment
source venv/bin/activate

# Load environment variables
export $(cat config/.env | grep -v '^#' | xargs)

# Generate status.json
echo "[$(date)] Generating status.json..."
python scripts/cli/status.py

# Upload to Spaces
echo "[$(date)] Uploading to DigitalOcean Spaces..."
./scripts/upload_status_json.sh

echo "[$(date)] ✅ Status update complete"
```

### 5. Configure DNS (Subdomain for Status Endpoint)

**Option A: CNAME to Spaces (Recommended)**
```
Type: CNAME
Name: status
Value: elytra-status.nyc3.digitaloceanspaces.com
TTL: 300 (5 minutes)
```

**Option B: Cloudflare CDN Proxy**
```
1. Add CNAME: status.elytracloud.com → elytra-status.nyc3.digitaloceanspaces.com
2. Enable Cloudflare proxy (orange cloud)
3. Set Page Rule: Cache Level = Cache Everything, Edge Cache TTL = 5 minutes
```

**Verify:**
```bash
curl https://status.elytracloud.com/status.json
```

---

## Testing Procedures

### Unit Tests

**Test Uptime Kuma Client:**
```bash
python -m pytest tests/test_uptime_kuma_client.py -v
```

**Test Backup Checker:**
```bash
python -m pytest tests/test_backup_checker.py -v
```

### Integration Tests

**Test Full Pipeline:**
```bash
# Generate and upload
./scripts/generate_and_upload.sh

# Verify uploaded file
curl https://status.elytracloud.com/status.json | jq .

# Check marketing site (after frontend deployment)
curl https://elytracloud.com | grep -A 5 "platform-status"
```

### Failure Scenarios

**Test Uptime Kuma Outage:**
```bash
# Temporarily set invalid API key
export UPTIME_KUMA_API_KEY="invalid"
python scripts/cli/status.py

# Expected: status.json with platform_status: "unknown"
```

**Test Backup Failure:**
```bash
# Temporarily set invalid backup bucket
export BACKUP_BUCKET="nonexistent-bucket"
python scripts/cli/status.py

# Expected: status.json with last_backup_status: "unknown"
```

**Test Upload Failure:**
```bash
# Temporarily set invalid Spaces credentials
export SPACES_ACCESS_KEY="invalid"
./scripts/upload_status_json.sh

# Expected: Error message, non-zero exit code
```

---

## Monitoring & Alerting

### Log Monitoring

**Check recent logs:**
```bash
tail -f /opt/elytra-infra/logs/status-updates.log
```

**Check for errors:**
```bash
grep -i error /opt/elytra-infra/logs/status-updates.log
```

### Uptime Monitoring

**Monitor the status endpoint itself:**
- Add `https://status.elytracloud.com/status.json` to Uptime Kuma
- Alert if endpoint returns 404 or invalid JSON
- Alert if `updated_at` timestamp is > 15 minutes old

### Email Alerts (Optional)

**Add to `status.py`:**
```python
import smtplib
from datetime import datetime, timedelta

def send_alert_email(subject, message):
    # Use SendGrid API or SMTP
    pass

# After generating status.json
if status['platform_status'] == 'outage':
    send_alert_email(
        subject="🚨 Platform Outage Detected",
        message=f"Platform status: {status['platform_status']}\n"
                f"Time: {status['updated_at']}"
    )
```

---

## Acceptance Criteria

### ✅ Phase 3 Complete When:

1. **Backend Scripts:**
   - ✅ `status.py` generates valid JSON matching frontend schema
   - ✅ `uptime_kuma_client.py` successfully fetches monitor data
   - ✅ `backup_checker.py` correctly identifies backup status
   - ✅ Scripts handle errors gracefully (no crashes)

2. **Automation:**
   - ✅ Cron job runs every 10 minutes without failures
   - ✅ `status.json` uploads to DigitalOcean Spaces successfully
   - ✅ Public URL `https://status.elytracloud.com/status.json` returns valid data

3. **DNS Configuration:**
   - ✅ `status.elytracloud.com` resolves to Spaces bucket
   - ✅ CORS headers allow frontend to fetch data
   - ✅ Cache headers set to `max-age=300`

4. **Testing:**
   - ✅ Manual test: Generate → Upload → Verify URL works
   - ✅ Cron test: Wait 10 minutes, verify `updated_at` timestamp updates
   - ✅ Failure test: Verify graceful degradation when APIs fail

5. **Documentation:**
   - ✅ README.md with setup instructions
   - ✅ Environment configuration documented
   - ✅ Troubleshooting guide for common issues

---

## Timeline Estimate

- **Day 1-2:** Write Python scripts (status.py, clients)
- **Day 3:** Write upload script, test locally
- **Day 4:** Deploy to server, configure environment
- **Day 5:** Set up cron job, configure DNS
- **Day 6-7:** Testing, monitoring, documentation

**Total:** ~7 days for full backend implementation

---

## Next Steps

After Phase 3 completion:
1. Update `NEXT_PUBLIC_STATUS_JSON_URL` in marketing site `.env.production`
2. Redeploy marketing site to Vercel/DigitalOcean
3. Verify end-to-end: Uptime Kuma → status.json → Marketing Site
4. Monitor logs for first 24 hours
5. Set up alerting for failures

---

## Troubleshooting

### Common Issues

**Issue:** "ModuleNotFoundError: No module named 'requests'"
```bash
# Solution: Ensure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

**Issue:** "Access Denied" when uploading to Spaces
```bash
# Solution: Verify credentials and bucket ACL
aws s3 ls s3://elytra-status --endpoint-url https://nyc3.digitaloceanspaces.com
```

**Issue:** Cron job not running
```bash
# Solution: Check cron logs
grep CRON /var/log/syslog
# Ensure script has absolute paths and is executable
```

**Issue:** "CORS policy blocked" in browser
```bash
# Solution: Add CORS policy to Spaces bucket
aws s3api put-bucket-cors --bucket elytra-status \
  --cors-configuration file://cors.json \
  --endpoint-url https://nyc3.digitaloceanspaces.com
```

**cors.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://elytracloud.com", "http://localhost:3000"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

---

**Phase 3 Status:** Ready to implement 🚀
