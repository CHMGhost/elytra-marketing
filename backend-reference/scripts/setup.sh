#!/bin/bash

###############################################################################
# Elytra Infrastructure - Quick Setup Script
# 
# This script automates the initial setup of the backend infrastructure.
# Run this on your server after cloning the repository.
###############################################################################

set -e

echo "========================================="
echo "Elytra Infrastructure - Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "Project root: $PROJECT_ROOT"
echo ""

# === Step 1: Check Python ===
echo "Step 1: Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    echo "Install with: sudo apt-get install python3 python3-pip python3-venv"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo -e "${GREEN}✅ $PYTHON_VERSION found${NC}"
echo ""

# === Step 2: Create Virtual Environment ===
echo "Step 2: Setting up Python virtual environment..."
if [ -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment already exists${NC}"
else
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
fi
echo ""

# === Step 3: Activate and Install Dependencies ===
echo "Step 3: Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# === Step 4: Check AWS CLI ===
echo "Step 4: Checking AWS CLI..."
if ! command -v aws &> /dev/null; then
    echo -e "${YELLOW}⚠️  AWS CLI is not installed${NC}"
    echo ""
    echo "To install AWS CLI, run:"
    echo "  curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
    echo "  unzip awscliv2.zip"
    echo "  sudo ./aws/install"
    echo ""
else
    AWS_VERSION=$(aws --version)
    echo -e "${GREEN}✅ $AWS_VERSION found${NC}"
fi
echo ""

# === Step 5: Setup Environment File ===
echo "Step 5: Setting up environment configuration..."
if [ -f "config/.env" ]; then
    echo -e "${YELLOW}⚠️  config/.env already exists (not overwriting)${NC}"
else
    cp config/.env.example config/.env
    echo -e "${GREEN}✅ Created config/.env from template${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit config/.env with your credentials!${NC}"
fi
echo ""

# === Step 6: Create Directories ===
echo "Step 6: Creating necessary directories..."
mkdir -p logs
mkdir -p /tmp
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# === Step 7: Make Scripts Executable ===
echo "Step 7: Making scripts executable..."
chmod +x scripts/*.sh
chmod +x scripts/cli/*.py
echo -e "${GREEN}✅ Scripts are now executable${NC}"
echo ""

# === Step 8: Test Setup ===
echo "Step 8: Testing setup..."
echo ""
echo -e "${YELLOW}Testing Python imports...${NC}"
python3 -c "import requests, boto3, dotenv; print('✅ All Python modules imported successfully')" || {
    echo -e "${RED}❌ Failed to import Python modules${NC}"
    exit 1
}
echo ""

# === Summary ===
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit your environment configuration:"
echo "   nano config/.env"
echo ""
echo "2. Configure AWS CLI for DigitalOcean Spaces:"
echo "   aws configure set aws_access_key_id 'YOUR_ACCESS_KEY'"
echo "   aws configure set aws_secret_access_key 'YOUR_SECRET_KEY'"
echo ""
echo "3. Test the status generator:"
echo "   source venv/bin/activate"
echo "   python scripts/cli/status.py"
echo ""
echo "4. Test the upload script:"
echo "   ./scripts/upload_status_json.sh"
echo ""
echo "5. Set up cron job:"
echo "   crontab -e"
echo "   Add: */10 * * * * cd $PROJECT_ROOT && ./scripts/generate_and_upload.sh >> logs/status-updates.log 2>&1"
echo ""
echo "For detailed documentation, see README.md"
echo "========================================="
