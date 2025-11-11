# Deployment Guide - Phase 2

This guide covers deploying the Elytracloud marketing site to production.

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best Next.js deployment experience with automatic optimizations.

#### Prerequisites
- GitHub repository connected to Vercel
- Vercel account (free tier works)

#### Steps

1. **Connect Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import `CHMGhost/elytra-marketing` repository
   - Select "elytra-marketing" project

2. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_STATUS_JSON_URL=https://status.elytracloud.com/status.json
   ```
   - Go to Project Settings → Environment Variables
   - Add the variable for Production, Preview, and Development environments

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Site will be live at `your-project.vercel.app`

4. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add `elytracloud.com` (or `www.elytracloud.com`)
   - Update DNS records as instructed:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

#### Automatic Deployments

Vercel will automatically deploy:
- **Production:** When you push to `main` branch
- **Preview:** For pull requests and other branches

---

### Option 2: DigitalOcean App Platform

Good option if you're already using DigitalOcean infrastructure.

#### Prerequisites
- DigitalOcean account
- GitHub repository access

#### Steps

1. **Create App**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Choose "GitHub" as source
   - Select `CHMGhost/elytra-marketing` repository
   - Choose `main` branch

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - HTTP Port: `3000`
   - Environment: Node.js

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_STATUS_JSON_URL=https://status.elytracloud.com/status.json
   NODE_ENV=production
   ```

4. **Choose Plan**
   - Basic (512 MB RAM, $5/month) is sufficient for most use cases
   - Can scale up as needed

5. **Deploy**
   - Review settings
   - Click "Create Resources"
   - Wait for initial deployment (~5 minutes)

6. **Add Custom Domain**
   - Go to Settings → Domains
   - Add `elytracloud.com`
   - Update DNS records:
     ```
     Type: A
     Name: @
     Value: [provided by DO]
     
     Type: CNAME
     Name: www
     Value: [provided by DO]
     ```

#### Using doctl CLI (Alternative)

```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init

# Deploy from spec file
doctl apps create --spec .do/app.yaml

# Or update existing app
doctl apps update YOUR_APP_ID --spec .do/app.yaml
```

---

## 🌐 DNS Configuration

### Required DNS Records

For `elytracloud.com`:

```
# Root domain
Type: A (or CNAME)
Name: @
Value: [Vercel/DO IP or CNAME]
TTL: 3600

# WWW subdomain
Type: CNAME
Name: www
Value: [Vercel/DO CNAME]
TTL: 3600

# Status subdomain (for status.json endpoint)
Type: CNAME
Name: status
Value: [Spaces bucket CNAME or CDN]
TTL: 3600
```

### Cloudflare Setup (If Using)

1. **Add Site to Cloudflare**
   - Add `elytracloud.com` to Cloudflare
   - Update nameservers at domain registrar

2. **DNS Records**
   ```
   A    @      76.76.21.21    (Proxied ☁️)
   CNAME www   @              (Proxied ☁️)
   CNAME status [spaces-url]  (DNS only 🔘)
   ```

3. **SSL/TLS Settings**
   - SSL/TLS encryption mode: Full (strict)
   - Always Use HTTPS: On
   - Automatic HTTPS Rewrites: On

4. **Caching Rules**
   - Create rule for `/mocks/*`: Cache Level: No Cache
   - Create rule for `/_next/static/*`: Cache Level: Standard, Edge TTL: 1 year

---

## 🔒 Environment Variables Reference

### Required

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_STATUS_JSON_URL` | `https://status.elytracloud.com/status.json` | Status data endpoint |

### Optional

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics 4 ID |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://...` | Sentry error tracking |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | `https://...` | Custom analytics endpoint |

---

## 🧪 Pre-Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` locally to check for errors
- [ ] Verify all environment variables are set
- [ ] Test with production status URL (if available)
- [ ] Check `vercel.json` or `.do/app.yaml` configuration
- [ ] Ensure `.env.local` is in `.gitignore` (it is)
- [ ] Review security headers in `vercel.json`
- [ ] Test mobile responsiveness
- [ ] Run Lighthouse audit (target score > 90)

---

## 📊 Post-Deployment Validation

After deployment:

1. **Check Homepage**
   ```bash
   curl -I https://elytracloud.com
   # Should return 200 OK
   ```

2. **Check Status Page**
   ```bash
   curl -I https://elytracloud.com/status
   # Should return 200 OK
   ```

3. **Verify Status Component**
   - Visit https://elytracloud.com
   - Check that status card appears
   - Should show green "operational" or current status
   - Click "Platform Status" button → should load `/status` page

4. **Test Status Data Fetch**
   ```bash
   curl https://status.elytracloud.com/status.json
   # Should return valid JSON
   ```

5. **Check Security Headers**
   ```bash
   curl -I https://elytracloud.com | grep -i "x-frame-options\|x-content-type"
   ```

6. **Lighthouse Audit**
   ```bash
   npx lighthouse https://elytracloud.com --view
   ```
   Target scores:
   - Performance: > 90
   - Accessibility: > 95
   - Best Practices: > 90
   - SEO: > 90

---

## 🔄 CI/CD Pipeline

### Vercel (Automatic)

Vercel automatically sets up CI/CD:
- Push to `main` → Production deployment
- Create PR → Preview deployment
- No additional configuration needed

### GitHub Actions (Manual Setup)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_STATUS_JSON_URL: ${{ secrets.STATUS_JSON_URL }}
      
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

Add secrets in GitHub repo settings:
- `STATUS_JSON_URL`
- `VERCEL_TOKEN` (from Vercel account settings)

---

## 🐛 Troubleshooting

### Issue: Status Card Shows "Unknown"

**Cause:** Can't fetch `status.json`

**Solutions:**
1. Check environment variable is set correctly
2. Verify `status.elytracloud.com/status.json` is accessible
3. Check CORS headers on Spaces bucket
4. Check browser console for errors

### Issue: Build Fails on Vercel

**Cause:** TypeScript or build errors

**Solutions:**
```bash
# Test build locally first
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Check ESLint errors
npm run lint
```

### Issue: Slow Page Loads

**Cause:** Not using caching

**Solutions:**
- Verify `revalidate: 600` is in `fetchStatus.ts`
- Check Vercel/DO caching is enabled
- Use Cloudflare if not already

### Issue: Stale Data Warning Always Shows

**Cause:** `status.json` not updating

**Solutions:**
1. Check backend cron job is running
2. Verify status generation script works
3. Check Spaces upload permissions
4. Manually upload test file

---

## 🎯 Performance Optimization

### Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Enable Image Optimization

If you add images later, use Next.js Image component:
```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Elytracloud" 
  width={200} 
  height={50}
  priority
/>
```

### Enable Compression

Vercel/DO automatically enable gzip/brotli compression.

To verify:
```bash
curl -H "Accept-Encoding: gzip" -I https://elytracloud.com
# Should see: Content-Encoding: gzip
```

---

## 📈 Monitoring & Analytics

### Vercel Analytics Dashboard

- Real-time visitor data
- Page load performance
- Core Web Vitals
- Geographic distribution

Access at: https://vercel.com/[your-username]/elytra-marketing/analytics

### Custom Analytics Events

The site tracks:
- `status_fetch_success` - Status data loaded successfully
- `status_fetch_error` - Failed to load status
- `status_stale_data` - Data is outdated
- `status_unknown` - Status unavailable

View in browser console (dev mode) or analytics dashboard (production).

---

## 🔐 Security Considerations

### Headers (Already Configured)

The `vercel.json` includes:
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy

### Environment Variables

- ✅ Never commit `.env.local` to git
- ✅ Use platform environment variable UI
- ✅ Rotate secrets if exposed
- ✅ Use `NEXT_PUBLIC_` prefix only for client-safe vars

### Status Endpoint

- ✅ Public by design (no auth needed)
- ✅ Contains no sensitive data
- ✅ Safe to expose publicly

---

## 📞 Support

**Deployment Issues:**
- Vercel: https://vercel.com/support
- DigitalOcean: https://www.digitalocean.com/support

**Code Issues:**
- See `docs/implementation-guide.md`
- Check GitHub Issues

---

**Last Updated:** 2025-11-10  
**Version:** Phase 2  
**Status:** ✅ Ready for Production Deployment
