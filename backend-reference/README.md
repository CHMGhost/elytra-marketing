# Elytra Infrastructure - Backend Status Generator

**Automated platform status monitoring and reporting system**

This repository contains the backend automation for the Elytra Cloud platform status system. It monitors infrastructure health via Uptime Kuma, checks backup status, generates `status.json`, and uploads it to DigitalOcean Spaces for consumption by the marketing website.

---

## 🎯 Overview

**What it does:**
- Fetches platform monitoring data from Uptime Kuma API
- Checks backup status from DigitalOcean Spaces
- Generates `status.json` with uptime metrics and health indicators
- Uploads to public S3 bucket every 10 minutes (via cron)
- Powers the real-time status display on https://elytracloud.com

**Architecture:**
```
┌─────────────────┐
│  Uptime Kuma    │ ──── Monitor platform services
│  (Monitoring)   │
└─────────────────┘
         │
         ↓
┌─────────────────┐
│  Status Script  │ ──── Generate status.json
│  (Python)       │       (this repo)
└─────────────────┘
         │
         ↓
┌─────────────────┐
│ DigitalOcean    │ ──── Host status.json publicly
│ Spaces (S3)     │
└─────────────────┘
         │
         ↓
┌─────────────────┐
│  Marketing Site │ ──── Display status to users
│  (Next.js)      │
└─────────────────┘
```

---

## 📁 Project Structure

```
elytra-infra/
├── scripts/
│   ├── cli/
│   │   ├── status.py                  # Main status generator
│   │   ├── uptime_kuma_client.py      # Uptime Kuma API wrapper
│   │   └── backup_checker.py          # Backup status checker
│   ├── upload_status_json.sh          # Upload script (AWS CLI)
│   └── generate_and_upload.sh         # Combined script for cron
├── config/
│   ├── .env.example                   # Environment template
│   └── .env                           # Your credentials (gitignored)
├── logs/
│   └── status-updates.log             # Execution logs
├── requirements.txt                   # Python dependencies
├── .gitignore                         # Ignore sensitive files
└── README.md                          # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** installed
- **AWS CLI** installed (for Spaces uploads)
- **Uptime Kuma** instance running with API access
- **DigitalOcean Spaces** buckets created:
  - Public bucket for status.json hosting
  - Private bucket for backups
- **Server/VM** for running cron jobs (Ubuntu/Debian recommended)

### Installation

```bash
# 1. Clone repository
cd /opt
sudo git clone https://github.com/yourusername/elytra-infra.git
cd elytra-infra

# 2. Set up Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp config/.env.example config/.env
nano config/.env  # Add your credentials

# 5. Install AWS CLI (if not already installed)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 6. Configure AWS CLI for Spaces
aws configure set aws_access_key_id "YOUR_SPACES_ACCESS_KEY"
aws configure set aws_secret_access_key "YOUR_SPACES_SECRET_KEY"
aws configure set default.region us-east-1

# 7. Make scripts executable
chmod +x scripts/*.sh
chmod +x scripts/cli/*.py

# 8. Test the setup
source venv/bin/activate
python scripts/cli/status.py
./scripts/upload_status_json.sh
```

---

## ⚙️ Configuration

### Environment Variables

Edit `config/.env` with your credentials:

```bash
# Uptime Kuma
UPTIME_KUMA_URL=https://uptime.yourdomain.com
UPTIME_KUMA_API_KEY=uk1_xxxxxxxxxxxxxxxxxxxxxxxxxx
MONITOR_IDS=1,2,3,4  # Optional: specific monitors to check

# DigitalOcean Spaces
SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
SPACES_ACCESS_KEY=DO00XXXXXXXXXXXXX
SPACES_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Status hosting
STATUS_BUCKET=elytra-status
STATUS_BUCKET_KEY=status.json

# Backup checking
BACKUP_BUCKET=elytra-backups
BACKUP_PREFIX=backups/
BACKUP_MAX_AGE_HOURS=25

# Output
OUTPUT_FILE=/tmp/status.json
LOG_FILE=/opt/elytra-infra/logs/status-updates.log
```

---

## 🔧 Usage

### Manual Execution

```bash
# Activate virtual environment
cd /opt/elytra-infra
source venv/bin/activate

# Generate status.json
python scripts/cli/status.py

# View generated file
cat /tmp/status.json

# Upload to Spaces
./scripts/upload_status_json.sh

# Or run both steps combined
./scripts/generate_and_upload.sh
```

### Automated Execution (Cron)

Set up cron to run every 10 minutes:

```bash
# Edit crontab
crontab -e

# Add this line:
*/10 * * * * cd /opt/elytra-infra && ./scripts/generate_and_upload.sh >> logs/status-updates.log 2>&1
```

**Verify cron is running:**
```bash
# Check cron logs
grep CRON /var/log/syslog

# Check execution logs
tail -f /opt/elytra-infra/logs/status-updates.log
```

---

## 🧪 Testing

### Test Individual Components

```bash
cd /opt/elytra-infra
source venv/bin/activate

# Test Uptime Kuma client
python scripts/cli/uptime_kuma_client.py

# Test backup checker
python scripts/cli/backup_checker.py

# Test status generator
python scripts/cli/status.py
```

### Test Upload

```bash
# Upload to Spaces
./scripts/upload_status_json.sh

# Verify public URL
curl https://elytra-status.nyc3.digitaloceanspaces.com/status.json | python -m json.tool
```

### Test Full Pipeline

```bash
# Run complete cycle
./scripts/generate_and_upload.sh

# Check logs
tail logs/status-updates.log

# Verify public URL updates
curl https://status.elytracloud.com/status.json | python -m json.tool
```

---

## 📊 Output Format

The generated `status.json` follows this schema:

```json
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
```

**Platform Status Values:**
- `operational` - All services running normally
- `degraded` - Some services experiencing issues
- `outage` - Critical services are down
- `unknown` - Unable to determine status

**Backup Status Values:**
- `success` - Recent backup exists (< 25h old)
- `warning` - Backup is aging (25-50h old)
- `failed` - Backup is too old (> 50h)
- `unknown` - Unable to check backup status

---

## 🌐 DNS Configuration

Point your status subdomain to the Spaces bucket:

### Option A: Direct CNAME to Spaces

```
Type: CNAME
Name: status
Value: elytra-status.nyc3.digitaloceanspaces.com
TTL: 300
```

### Option B: Via Cloudflare (Recommended)

```
1. Add DNS record:
   Type: CNAME
   Name: status
   Target: elytra-status.nyc3.digitaloceanspaces.com
   Proxy: Enabled (orange cloud)

2. Add Page Rule for caching:
   URL: status.elytracloud.com/status.json
   Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 5 minutes
```

### Configure CORS on Spaces Bucket

```bash
# Create cors.json
cat > cors.json << 'EOF'
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
EOF

# Apply CORS policy
aws s3api put-bucket-cors \
  --bucket elytra-status \
  --cors-configuration file://cors.json \
  --endpoint-url https://nyc3.digitaloceanspaces.com
```

---

## 🔍 Monitoring & Debugging

### Check Logs

```bash
# View recent logs
tail -n 50 /opt/elytra-infra/logs/status-updates.log

# Follow logs in real-time
tail -f /opt/elytra-infra/logs/status-updates.log

# Search for errors
grep -i error /opt/elytra-infra/logs/status-updates.log
```

### Monitor the Status Endpoint

Add `https://status.elytracloud.com/status.json` to your Uptime Kuma instance to monitor:
- Endpoint availability (should return 200)
- JSON validity
- Timestamp freshness (`updated_at` should be < 15 minutes old)

### Common Issues

**Issue:** "ModuleNotFoundError: No module named 'requests'"
```bash
# Solution: Activate virtual environment
cd /opt/elytra-infra
source venv/bin/activate
pip install -r requirements.txt
```

**Issue:** "Access Denied" when uploading to Spaces
```bash
# Solution: Verify credentials
aws s3 ls s3://elytra-status \
  --endpoint-url https://nyc3.digitaloceanspaces.com

# Check bucket ACL and permissions in DigitalOcean dashboard
```

**Issue:** Cron job not running
```bash
# Check cron status
systemctl status cron

# Check cron logs
grep CRON /var/log/syslog | tail -n 20

# Ensure script has execute permissions
chmod +x /opt/elytra-infra/scripts/generate_and_upload.sh
```

**Issue:** "CORS policy blocked" in browser
```bash
# Apply CORS policy to bucket (see DNS Configuration section)
# Verify CORS is applied:
aws s3api get-bucket-cors \
  --bucket elytra-status \
  --endpoint-url https://nyc3.digitaloceanspaces.com
```

---

## 🔐 Security Best Practices

- ✅ **Never commit** `.env` file (it's gitignored)
- ✅ Use **separate Spaces keys** for different environments
- ✅ Restrict **Spaces key permissions** to only required buckets
- ✅ Use **read-only API keys** for Uptime Kuma if possible
- ✅ Set up **log rotation** to prevent disk space issues:
  ```bash
  sudo nano /etc/logrotate.d/elytra-infra
  # Add:
  /opt/elytra-infra/logs/*.log {
      daily
      rotate 7
      compress
      missingok
      notifempty
  }
  ```

---

## 📈 Performance & Optimization

- **Cron frequency:** Every 10 minutes (matches backend status.json update rate)
- **Cache TTL:** 5 minutes (via `Cache-Control: max-age=300`)
- **Expected execution time:** < 30 seconds
- **Network requests:** ~3-5 per execution (Uptime Kuma API + S3 upload)

---

## 🛠️ Development

### Running Tests

```bash
# Test Uptime Kuma client
python scripts/cli/uptime_kuma_client.py

# Test backup checker
python scripts/cli/backup_checker.py

# Test full status generation
python scripts/cli/status.py
```

### Adding New Monitors

1. Add monitors to Uptime Kuma dashboard
2. Get monitor IDs from Uptime Kuma API or UI
3. Update `MONITOR_IDS` in `.env` (or leave empty to monitor all)

### Extending Status Schema

To add new fields to `status.json`:

1. Update `generate_status_json()` in `scripts/cli/status.py`
2. Update frontend TypeScript types in `elytra-marketing/lib/fetchStatus.ts`
3. Update mock data in `elytra-marketing/public/mocks/status.json`

---

## 📚 Related Documentation

- [Phase 3 Implementation Guide](../elytra-marketing/docs/phase-3-backend-implementation.md)
- [Marketing Site README](../elytra-marketing/README.md)
- [Uptime Kuma API Docs](https://github.com/louislam/uptime-kuma/wiki/API)
- [DigitalOcean Spaces Docs](https://docs.digitalocean.com/products/spaces/)

---

## 📝 License

Private repository - All rights reserved.

---

## 🆘 Support

For issues or questions:
1. Check the logs: `tail -f logs/status-updates.log`
2. Review troubleshooting section above
3. Contact infrastructure team

---

**Last Updated:** November 10, 2025  
**Maintained By:** Elytra Cloud Infrastructure Team
