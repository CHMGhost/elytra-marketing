# Elytracloud Marketing Site

Enterprise WordPress hosting platform marketing website with integrated **real-time platform status monitoring**.

---

## 🎯 Project Overview

This repository contains the **frontend marketing site** for Elytracloud. It integrates with a **backend automation system** (Phase 3) that monitors platform health via Uptime Kuma and generates status updates every 10 minutes.

**Live Status Display:**
- ✅ Real-time platform status (operational/degraded/outage)
- 📊 Uptime metrics (24h, 7d, 30d)
- 💾 Backup status and recency
- ⚡ Updates every 10 minutes via ISR caching

---

## 📦 What's Included

### Frontend (Phases 1-2) - Marketing Site
- Next.js 14 with App Router and TypeScript
- Platform status card component (4 states)
- Dedicated `/status` page
- ISR caching and analytics
- Production deployment configs

### Backend (Phase 3) - Automation System  
**Location:** `backend-reference/` directory

- Python scripts for status generation
- Uptime Kuma API integration
- Backup verification (DigitalOcean Spaces)
- Upload automation (S3-compatible)
- Cron job setup for 10-minute updates

**See:** `DEPLOYMENT_QUICKSTART.md` for backend deployment

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

```bash
# Clone the repository
git clone git@github.com:CHMGhost/elytra-marketing.git
cd elytra-marketing

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
elytra-marketing/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles
│   └── status/
│       └── page.tsx         # Platform status page
├── components/              # React components
│   └── PlatformStatusCard.tsx
├── lib/                     # Utility functions
│   └── fetchStatus.ts       # Status data fetcher
├── public/
│   └── mocks/
│       └── status.json      # Mock data for local dev
├── docs/                    # Documentation
│   ├── prompt.md           # Frontend implementation spec
│   └── implementation-guide.md
└── [config files]
```

## 🎨 Platform Status Integration

This site includes a **real-time platform status component** that displays:

- ✅ Platform operational status (operational/degraded/outage)
- 📊 Uptime metrics (24h, 7-day, and 30-day)
- 💾 Backup status and recency
- 🏗️ Infrastructure details
- ⚡ Real-time updates every 10 minutes

### How It Works

1. **Backend** (Phase 3) - Runs on infrastructure server
   - Fetches monitor data from Uptime Kuma API
   - Checks backup status from DigitalOcean Spaces
   - Generates `status.json` every 10 minutes
   - Uploads to public S3 bucket

2. **Frontend** (Phases 1-2) - Next.js marketing site
   - Fetches `status.json` from CDN
   - Caches for 10 minutes using Next.js ISR
   - Displays real-time status on homepage and `/status` page
   - Shows staleness warnings if data is outdated

### Local Development

The status component uses mock data from `public/mocks/status.json` during local development.

### Testing Different Status States

Edit `public/mocks/status.json` to test different states:

**Operational (default):**
```json
{
  "platform_status": "operational"
}
```

**Degraded:**
```json
{
  "platform_status": "degraded"
}
```

**Outage:**
```json
{
  "platform_status": "outage"
}
```

**Unknown (delete the file or set invalid URL):**
- Delete `public/mocks/status.json`
- Or set `NEXT_PUBLIC_STATUS_JSON_URL=""` in `.env.local`

## 🌐 Environment Variables

| Variable | Description | Default (dev) |
|----------|-------------|---------------|
| `NEXT_PUBLIC_STATUS_JSON_URL` | Platform status JSON endpoint | `http://localhost:3000/mocks/status.json` |

### Production Configuration

For production, update `.env.local` (or set in Vercel/hosting platform):

```bash
NEXT_PUBLIC_STATUS_JSON_URL="https://status.elytracloud.com/status.json"
```

## 🧪 Testing Status Component

### Manual Testing Checklist

- [ ] Homepage displays status card
- [ ] `/status` page loads successfully
- [ ] Green dot shows for "operational" status
- [ ] Yellow dot shows for "degraded" status
- [ ] Red dot shows for "outage" status
- [ ] Gray dot shows when data unavailable
- [ ] Uptime percentages display correctly
- [ ] Backup information renders
- [ ] Staleness warning appears for old data
- [ ] Component handles missing JSON file gracefully

### Test Staleness Warning

Edit `public/mocks/status.json` and set `updated_at` to 1 hour ago:

```json
{
  "updated_at": "2025-11-09T11:00:00Z"
}
```

You should see a "⚠ Data may be outdated" warning.

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Lint check
npm run lint
```

## 🎯 Phase 1 Deliverables (Week 1)

✅ All Phase 1 tasks completed:

1. ✅ Mock `status.json` created with sample data
2. ✅ Environment variables configured (`.env.local`, `.env.example`)
3. ✅ Data fetcher utility (`lib/fetchStatus.ts`) with TypeScript types
4. ✅ `PlatformStatusCard` component with all status states
5. ✅ Dedicated `/status` page
6. ✅ Status card integrated on homepage
7. ✅ Ready for testing

## 🚀 Phase 2 Deliverables (Week 2)

✅ All Phase 2 tasks completed:

1. ✅ Caching strategy implemented (`revalidate: 600`)
2. ✅ Enhanced staleness warnings with severity levels
3. ✅ Production environment configuration
4. ✅ Analytics/monitoring integration (optional)
5. ✅ Deployment configs for Vercel and DigitalOcean
6. ✅ Comprehensive deployment guide
7. ✅ Ready for production deployment

## 🌐 Deployment

Ready to deploy to production! See **[Deployment Guide](docs/deployment-guide.md)** for detailed instructions.

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Quick Deploy to DigitalOcean

```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init

# Deploy
doctl apps create --spec .do/app.yaml
```

### Environment Variables for Production

Set in your deployment platform:
```
NEXT_PUBLIC_STATUS_JSON_URL=https://status.elytracloud.com/status.json
```

## 📚 Documentation

### Implementation Guides
- **Phase 1 & 2 (Frontend):** `README.md` (this file) - Marketing site with status integration
- **Phase 3 (Backend):** `docs/phase-3-backend-implementation.md` - Backend automation guide
- **Phase 3 Reference Code:** `backend-reference/` - Complete backend implementation files
- **Quick Reference:** `PHASE_3_COMPLETE.md` - Phase 3 completion summary

### Technical Documentation
- **Frontend Spec:** `docs/prompt.md` - Original implementation specification
- **Implementation Guide:** `docs/implementation-guide.md` - 4-week rollout plan
- **Deployment Guide:** `docs/deployment-guide.md` - Vercel and DigitalOcean deployment
- **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **TailwindCSS Docs:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## ✅ Implementation Status

### Phase 1 (Week 1) - ✅ COMPLETE
- ✅ Mock status.json with all variants
- ✅ Environment configuration
- ✅ Data fetcher utility with TypeScript types
- ✅ PlatformStatusCard component (all 4 states)
- ✅ Dedicated /status page
- ✅ Homepage integration
- ✅ Testing and documentation

### Phase 2 (Week 2) - ✅ COMPLETE
- ✅ ISR caching strategy (10-minute revalidation)
- ✅ Enhanced staleness warnings
- ✅ Analytics tracking module
- ✅ Production environment configuration
- ✅ Deployment configs (Vercel + DigitalOcean)
- ✅ Comprehensive documentation
- ✅ Production build verified

### Phase 3 (Week 3) - ✅ COMPLETE
- ✅ Status generation script (status.py)
- ✅ Uptime Kuma API client (uptime_kuma_client.py)
- ✅ Backup checker (backup_checker.py)
- ✅ Upload automation script (upload_status_json.sh)
- ✅ Cron job script (generate_and_upload.sh)
- ✅ Environment configuration (.env.example)
- ✅ Setup automation (setup.sh)
- ✅ Complete documentation (README + guides)

### Phase 4 (Week 4) - Ready to Deploy
- [ ] Deploy backend to infrastructure server
- [ ] Configure DNS (status.elytracloud.com)
- [ ] Set up cron job (every 10 minutes)
- [ ] Deploy marketing site to production
- [ ] End-to-end testing
- [ ] Monitoring and alerting setup

See `docs/implementation-guide.md` Week 3 for full details.

## 🤝 Contributing

This is the marketing site frontend. The infrastructure backend (status generation) lives in a separate repository.

## 📄 License

Private - Elytracloud © 2025

---

**Questions?** See `docs/implementation-guide.md` or contact the engineering team.
