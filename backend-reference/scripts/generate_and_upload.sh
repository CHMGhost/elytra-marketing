#!/bin/bash

###############################################################################
# Generate and Upload Status JSON
# 
# Combined script that generates status.json and uploads it to Spaces.
# This script is intended to be run by cron every 10 minutes.
###############################################################################

set -e  # Exit on error

# Get script directory (works even when called from cron)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root
cd "$PROJECT_ROOT"

# Log file
LOG_FILE="${LOG_FILE:-$PROJECT_ROOT/logs/status-updates.log}"
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========================================="
log "Starting status update cycle"
log "========================================="

# Activate virtual environment
if [ -f "$PROJECT_ROOT/venv/bin/activate" ]; then
    log "Activating virtual environment..."
    source "$PROJECT_ROOT/venv/bin/activate"
else
    log "⚠️  Warning: Virtual environment not found at $PROJECT_ROOT/venv"
fi

# Load environment variables
ENV_FILE="$PROJECT_ROOT/config/.env"
if [ -f "$ENV_FILE" ]; then
    log "Loading environment from $ENV_FILE"
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
else
    log "⚠️  Warning: .env file not found at $ENV_FILE"
fi

# === Step 1: Generate status.json ===
log "Step 1: Generating status.json..."

if python "$PROJECT_ROOT/scripts/cli/status.py"; then
    log "✅ Status generation successful"
else
    log "❌ Status generation failed with exit code $?"
    exit 1
fi

# === Step 2: Upload to Spaces ===
log "Step 2: Uploading to DigitalOcean Spaces..."

if "$PROJECT_ROOT/scripts/upload_status_json.sh" >> "$LOG_FILE" 2>&1; then
    log "✅ Upload successful"
else
    log "❌ Upload failed with exit code $?"
    exit 1
fi

log "========================================="
log "Status update cycle complete"
log "========================================="
log ""

exit 0
