#!/bin/bash

###############################################################################
# Upload Status JSON to DigitalOcean Spaces
# 
# This script uploads the generated status.json file to a DigitalOcean Spaces
# bucket with proper headers for public access and caching.
###############################################################################

set -e  # Exit on error

# Load environment variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../config/.env"

if [ -f "$ENV_FILE" ]; then
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
else
    echo "⚠️  Warning: .env file not found at $ENV_FILE"
    echo "Using environment variables from current shell"
fi

# Configuration
SOURCE_FILE="${OUTPUT_FILE:-/tmp/status.json}"
BUCKET="${STATUS_BUCKET:-elytra-status}"
KEY="${STATUS_BUCKET_KEY:-status.json}"
ENDPOINT="${SPACES_ENDPOINT:-nyc3.digitaloceanspaces.com}"

# Validate required variables
if [ -z "$SPACES_ACCESS_KEY" ] || [ -z "$SPACES_SECRET_KEY" ]; then
    echo "❌ Error: SPACES_ACCESS_KEY and SPACES_SECRET_KEY must be set"
    exit 1
fi

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "❌ Error: Source file not found: $SOURCE_FILE"
    exit 1
fi

# Verify AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed"
    echo "Install with: curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip' && unzip awscliv2.zip && sudo ./aws/install"
    exit 1
fi

echo "📤 Uploading status.json to DigitalOcean Spaces..."
echo "   Source: $SOURCE_FILE"
echo "   Destination: s3://${BUCKET}/${KEY}"
echo "   Endpoint: https://${ENDPOINT}"

# Upload file with proper headers
AWS_ACCESS_KEY_ID="$SPACES_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$SPACES_SECRET_KEY" \
aws s3 cp "$SOURCE_FILE" \
  "s3://${BUCKET}/${KEY}" \
  --endpoint-url "https://${ENDPOINT}" \
  --acl public-read \
  --content-type "application/json" \
  --cache-control "public, max-age=300" \
  --metadata-directive REPLACE

# Check upload status
if [ $? -eq 0 ]; then
    PUBLIC_URL="https://${BUCKET}.${ENDPOINT}/${KEY}"
    echo ""
    echo "✅ Upload successful!"
    echo "   Public URL: $PUBLIC_URL"
    echo ""
    
    # Optionally verify the upload
    if command -v curl &> /dev/null; then
        echo "🔍 Verifying upload..."
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PUBLIC_URL")
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ Verification successful (HTTP $HTTP_CODE)"
            
            # Show file contents
            echo ""
            echo "📄 Current status.json content:"
            echo "---"
            curl -s "$PUBLIC_URL" | python3 -m json.tool || curl -s "$PUBLIC_URL"
            echo "---"
        else
            echo "⚠️  Warning: HTTP status code is $HTTP_CODE (expected 200)"
        fi
    fi
    
    exit 0
else
    echo ""
    echo "❌ Upload failed"
    exit 1
fi
