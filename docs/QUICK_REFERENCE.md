# 🚀 Quick Reference - Platform Status Integration

## Dev Server

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Lint check
```

## URLs

- Homepage: http://localhost:3000
- Status Page: http://localhost:3000/status

## Test Different States

Edit `.env.local` then restart server:

```bash
# Operational (green)
NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status.json"

# Degraded (yellow)
NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-degraded.json"

# Outage (red)
NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-outage.json"

# Unknown (gray)
NEXT_PUBLIC_STATUS_JSON_URL=""

# Stale data (with warning)
NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-stale.json"
```

## File Locations

```
app/page.tsx                      → Homepage
app/status/page.tsx               → Status page
components/PlatformStatusCard.tsx → Status component
lib/fetchStatus.ts                → Data fetcher
public/mocks/status.json          → Mock data
.env.local                        → Environment variables
```

## Status States

| State | Color | Dot | Label |
|-------|-------|-----|-------|
| operational | green | 🟢 | All systems operational |
| degraded | yellow | 🟡 | Minor degradation |
| outage | red | 🔴 | Service disruption |
| unknown | gray | ⚫ | Status unavailable |

## Common Tasks

### Change status data
```bash
# Edit the mock file
vim public/mocks/status.json

# Or switch to different mock
echo 'NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-degraded.json"' > .env.local
```

### View in browser
```bash
open http://localhost:3000
open http://localhost:3000/status
```

### Check for errors
```bash
npm run lint
npm run build  # Check TypeScript errors
```

## Documentation

- `README.md` - Project setup
- `docs/testing-guide.md` - Testing scenarios
- `docs/implementation-guide.md` - Full implementation plan
- `docs/phase-1-summary.md` - Phase 1 completion summary

## Production Config

When deploying to production:

```bash
# Set in Vercel/hosting dashboard
NEXT_PUBLIC_STATUS_JSON_URL="https://status.elytracloud.com/status.json"
```

## Troubleshooting

**Component shows "unknown"**
- Check `.env.local` exists
- Check URL is correct
- Check mock file exists
- Restart dev server

**TypeScript errors**
- Run `npm install` to ensure dependencies installed
- Check `tsconfig.json` exists
- Restart VS Code

**Styles not loading**
- Check `tailwind.config.js` exists
- Check `app/globals.css` imported in layout
- Hard refresh browser (Cmd+Shift+R)

## Phase 1 Checklist

- [x] Mock data created
- [x] Environment configured
- [x] Components built
- [x] Pages created
- [x] Dev server running
- [x] All states tested
- [x] Documentation complete

## Phase 2 Checklist

- [x] Caching strategy implemented (10 min)
- [x] Staleness warnings enhanced
- [x] Analytics tracking added
- [x] Production env configured
- [x] Deployment configs created
- [x] Deployment guide written
- [x] Ready for production deployment

✅ **Phase 2 Complete - Ready to Deploy**

## Deployment Commands

### Vercel
```bash
# Install CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### DigitalOcean
```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init

# Deploy
doctl apps create --spec .do/app.yaml
```

## New in Phase 2

- 🚀 10-minute caching (matches backend frequency)
- 📊 Analytics tracking (4 events)
- ⚡ Animated status indicator
- 🕐 Data age display ("5m ago")
- ⚠️ Severity-based staleness warnings
- 🔒 Security headers configured
- 📦 Production deployment configs
