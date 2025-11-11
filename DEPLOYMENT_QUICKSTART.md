# 🚀 Quick Start: Deploy Backend (Phase 3)

**Estimated Time:** 1-2 hours  
**Prerequisites:** Ubuntu/Debian server, Uptime Kuma running, DigitalOcean Spaces configured

---

## Step 1: Copy Files to Infrastructure Server

```bash
# On your local machine (from elytra-marketing directory)
cd /Users/minorkeith/elytra-marketing

# Copy backend-reference to your server
scp -r backend-reference/ user@your-server.com:/tmp/

# SSH into your server
ssh user@your-server.com

# Move to final location
sudo mkdir -p /opt/elytra-infra
sudo mv /tmp/backend-reference/* /opt/elytra-infra/
sudo chown -R $USER:$USER /opt/elytra-infra
```

---

## Step 2: Run Automated Setup

```bash
cd /opt/elytra-infra
./scripts/setup.sh
```

This will:
- ✅ Check Python 3 installation
- ✅ Create virtual environment
- ✅ Install dependencies (requests, boto3, python-dotenv)
- ✅ Create `.env` from template
- ✅ Make scripts executable
- ✅ Test Python imports

---

## Step 3: Configure Credentials

```bash
nano config/.env
```

**Fill in these required values:**

```bash
# Uptime Kuma
UPTIME_KUMA_URL=https://uptime.yourdomain.com
UPTIME_KUMA_API_KEY=uk1_xxxxxxxxxxxxxxxxxxxxxxxxxx

# DigitalOcean Spaces
SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
SPACES_ACCESS_KEY=DO00XXXXXXXXXXXXX
SPACES_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Buckets
STATUS_BUCKET=elytra-status
BACKUP_BUCKET=elytra-backups
```

**Save and exit** (Ctrl+O, Enter, Ctrl+X)

---

## Step 4: Install AWS CLI (for Spaces uploads)

```bash
# Download AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version

# Configure credentials
aws configure set aws_access_key_id "YOUR_SPACES_ACCESS_KEY"
aws configure set aws_secret_access_key "YOUR_SPACES_SECRET_KEY"
aws configure set default.region us-east-1
```

---

## Step 5: Test Manual Execution

```bash
cd /opt/elytra-infra
source venv/bin/activate

# Test status generation
python scripts/cli/status.py

# Expected output: ✅ Platform status: operational

# Verify generated file
cat /tmp/status.json

# Test upload
./scripts/upload_status_json.sh

# Expected output: ✅ Upload successful!

# Verify public URL (replace with your bucket)
curl https://elytra-status.nyc3.digitaloceanspaces.com/status.json | python3 -m json.tool
```

**If all tests pass, continue to Step 6.**

---

## Step 6: Set Up Cron Job

```bash
crontab -e
```

**Add this line** (adjust path if needed):

```bash
*/10 * * * * cd /opt/elytra-infra && ./scripts/generate_and_upload.sh >> logs/status-updates.log 2>&1
```

**Save and exit**

**Verify cron is scheduled:**

```bash
crontab -l
```

**Wait 10 minutes, then check logs:**

```bash
tail -f /opt/elytra-infra/logs/status-updates.log
```

You should see:
```
[2025-11-10 15:30:00] Starting status update cycle
[2025-11-10 15:30:01] Step 1: Generating status.json...
[2025-11-10 15:30:03] ✅ Status generation successful
[2025-11-10 15:30:03] Step 2: Uploading to DigitalOcean Spaces...
[2025-11-10 15:30:05] ✅ Upload successful
[2025-11-10 15:30:05] Status update cycle complete
```

---

## Step 7: Configure DNS

### Option A: Direct CNAME

In your DNS provider (Cloudflare, etc.):

```
Type: CNAME
Name: status
Value: elytra-status.nyc3.digitaloceanspaces.com
TTL: 300
```

### Option B: Cloudflare with CDN (Recommended)

1. Add CNAME record:
   ```
   Type: CNAME
   Name: status
   Target: elytra-status.nyc3.digitaloceanspaces.com
   Proxy: Enabled (orange cloud icon)
   ```

2. Add Page Rule:
   ```
   URL: status.elytracloud.com/status.json
   Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 5 minutes
   ```

**Verify DNS:**

```bash
curl https://status.elytracloud.com/status.json | python3 -m json.tool
```

---

## Step 8: Configure CORS on Spaces Bucket

```bash
# Create CORS configuration
cat > /tmp/cors.json << 'EOF'
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
  --cors-configuration file:///tmp/cors.json \
  --endpoint-url https://nyc3.digitaloceanspaces.com

# Verify CORS was applied
aws s3api get-bucket-cors \
  --bucket elytra-status \
  --endpoint-url https://nyc3.digitaloceanspaces.com
```

---

## Step 9: Update Marketing Site

```bash
# On your local machine (in elytra-marketing directory)
cd /Users/minorkeith/elytra-marketing

# Update production environment
echo 'NEXT_PUBLIC_STATUS_JSON_URL=https://status.elytracloud.com/status.json' > .env.production

# Redeploy to Vercel
vercel --prod
```

---

## Step 10: End-to-End Verification

```bash
# 1. Check backend is generating status
curl https://status.elytracloud.com/status.json

# Expected: JSON with recent timestamp (< 10 minutes old)

# 2. Check marketing site displays status
curl https://elytracloud.com/status | grep -i "platform status"

# Expected: Status page HTML with current platform status

# 3. Check browser (visual verification)
# Visit: https://elytracloud.com
# Verify: Status card shows on homepage with correct data
```

---

## ✅ Success Checklist

- [ ] Backend scripts execute without errors
- [ ] `/tmp/status.json` is generated with valid data
- [ ] Upload to Spaces succeeds
- [ ] Public URL returns JSON (200 status)
- [ ] Cron job runs every 10 minutes
- [ ] Logs show successful execution
- [ ] DNS resolves to Spaces bucket
- [ ] CORS policy allows frontend access
- [ ] Marketing site fetches live data
- [ ] Homepage and /status page display correctly

---

## 🔍 Troubleshooting

### Backend script fails
```bash
# Check logs
tail -n 50 /opt/elytra-infra/logs/status-updates.log

# Test individual components
source /opt/elytra-infra/venv/bin/activate
python /opt/elytra-infra/scripts/cli/uptime_kuma_client.py
python /opt/elytra-infra/scripts/cli/backup_checker.py
```

### Upload fails
```bash
# Verify AWS CLI credentials
aws s3 ls s3://elytra-status --endpoint-url https://nyc3.digitaloceanspaces.com

# Check bucket permissions in DigitalOcean dashboard
```

### Cron not running
```bash
# Check cron service status
systemctl status cron

# Check system logs
grep CRON /var/log/syslog | tail -n 20

# Verify script is executable
ls -la /opt/elytra-infra/scripts/generate_and_upload.sh
```

### CORS errors in browser
```bash
# Re-apply CORS policy
aws s3api put-bucket-cors \
  --bucket elytra-status \
  --cors-configuration file:///tmp/cors.json \
  --endpoint-url https://nyc3.digitaloceanspaces.com
```

---

## 📊 Monitoring

### Check Status Endpoint Health

Add to your Uptime Kuma instance:

```
URL: https://status.elytracloud.com/status.json
Type: HTTP
Method: GET
Expected Status Code: 200
Check Interval: 60 seconds
```

### Alert Conditions

- Endpoint returns 404
- Response is not valid JSON
- `updated_at` timestamp is > 15 minutes old

---

## 🎉 Deployment Complete!

Your platform status system is now live:

- 🔄 Backend updates every 10 minutes
- ☁️ Public status.json on CDN
- 🌐 Marketing site displays real-time data
- 📊 Monitoring and logging active

**Next:** Monitor logs for 24 hours, set up alerting for failures.

---

**Need Help?** See `backend-reference/README.md` for detailed troubleshooting.
