# Multi-tenant SaaS Deployment Guide

## Quick Start Overview

This guide covers:
1. Setting up your main domain on Vercel
2. Configuring wildcard subdomains
3. Database setup with Neon
4. Deploying to Vercel
5. Custom domain setup for users

---

## Step 1: Prepare Your Environment

### 1.1 Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up or login
3. Create a new project
4. Copy your connection string: `postgresql://user:password@host/dbname`

### 1.2 Set Environment Variables

In your Vercel project settings, add:

\`\`\`
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=generate-a-random-secret-key-here
NEXT_PUBLIC_MAIN_DOMAIN=shariarkobirkiam.xyz
NEXT_PUBLIC_APP_URL=https://shariarkobirkiam.xyz
\`\`\`

---

## Step 2: Vercel Configuration

### 2.1 Deploy Project

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New..." → "Project"
4. Select your repository
5. Add environment variables
6. Deploy

### 2.2 Configure Main Domain

In **Vercel Dashboard → Settings → Domains**:

1. Add domain: `shariarkobirkiam.xyz`
2. Update your domain registrar's nameservers to Vercel's
   - Vercel will provide the nameserver addresses
   - Update these in your registrar's DNS settings

### 2.3 Add Wildcard Subdomain

Still in Vercel Domains settings:

1. Click "Add"
2. Enter: `*.shariarkobirkiam.xyz`
3. Configure as wildcard redirect

Your domain configuration should look like:
\`\`\`
shariarkobirkiam.xyz          → Your main app
www.shariarkobirkiam.xyz      → Your main app
*.shariarkobirkiam.xyz        → Your app (for all subdomains)
\`\`\`

### 2.4 Update Vercel Project URL

In **Vercel Dashboard → Settings → Domains**:
- Set Production Domain to: `shariarkobirkiam.xyz`

---

## Step 3: Initialize Database

### Via v0 Dashboard

1. In your Code Project, you have `scripts/01-init-schema.sql`
2. Click "Run Scripts" in the toolbar
3. Select the script
4. It will automatically run using your `DATABASE_URL`

### Via Command Line (if doing locally)

\`\`\`bash
# Install Drizzle Kit globally
npm install -g drizzle-kit

# Run migrations
npm run db:push
\`\`\`

---

## Step 4: Test Your Setup

### 4.1 Test Main App

Visit: `https://shariarkobirkiam.xyz`

You should see the main authentication page.

### 4.2 Test Subdomain

1. Create an account
2. Create a new dashboard (e.g., slug: "myapp")
3. Visit: `https://myapp.shariarkobirkiam.xyz`

You should see that tenant's dashboard.

### 4.3 Custom Domain Test

For testing, use a domain you own or a test domain. The process:

1. Add custom domain in dashboard: `testdomain.com`
2. You'll get a CNAME value
3. Add CNAME record to your domain registrar:
   \`\`\`
   Name: @
   Type: CNAME
   Value: [provided-cname-value]
   \`\`\`
4. Wait 24-48 hours for DNS propagation
5. Visit: `https://testdomain.com`

---

## Step 5: Custom Domain Setup for Your Users

### For End Users

When a user wants to add their domain (e.g., `alif.com`):

1. They go to: `https://alif.shariarkobirkiam.xyz/dashboard/[id]/settings/domains`
2. Add domain: `alif.com`
3. They receive CNAME value to add to their registrar
4. Our system checks DNS for verification
5. Once verified, `alif.com` serves their dashboard

### Example Flow

**User: Alif**
- Creates dashboard with slug: `alif`
- Default URL: `https://alif.shariarkobirkiam.xyz`
- Adds personal domain: `alif.com`
- Updates DNS CNAME in their registrar
- Now both URLs work:
  - `https://alif.shariarkobirkiam.xyz`
  - `https://alif.com`

---

## Step 6: DNS Configuration by Provider

### Name.com

1. Login to Name.com
2. Go to Manage DNS for your domain
3. Add new DNS record:
   - Type: CNAME
   - Name: @ (or leave blank)
   - Value: [provided-cname]
4. Save

### GoDaddy

1. Login to GoDaddy
2. Go to Manage Domains
3. Click your domain
4. Go to DNS management
5. Add record:
   - Type: CNAME
   - Host: @ (or leave blank)
   - Points to: [provided-cname]
6. Save

### Cloudflare

1. Login to Cloudflare
2. Select your domain
3. Go to DNS → Records
4. Create new record:
   - Type: CNAME
   - Name: @ (or leave blank)
   - Content: [provided-cname]
   - TTL: Auto
5. Save

### DigitalOcean/Linode (if using their DNS)

1. Go to your DNS settings
2. Add new record:
   - Type: CNAME
   - Hostname: @ or blank
   - Value: [provided-cname]
3. Save

---

## Step 7: Going Live with Your Own Domains

For your own domains (if you have multiple), update:

**vercel.json:**
\`\`\`json
{
  "env": {
    "NEXT_PUBLIC_MAIN_DOMAIN": "yourdomain1.com",
    "NEXT_PUBLIC_APP_URL": "https://yourdomain1.com"
  }
}
\`\`\`

**lib/tenant-utils.ts** (update MAIN_DOMAIN):
\`\`\`typescript
export const MAIN_DOMAIN = 'yourdomain1.com'
\`\`\`

---

## Troubleshooting

### Subdomains Not Working

- Check Vercel shows `*.yourdomain.com` is added
- Verify nameservers are pointing to Vercel
- Wait up to 48 hours for DNS propagation

### Custom Domains Not Working

- Verify CNAME record is added correctly in registrar
- Use an online tool to check DNS records
- Ensure CNAME points to your Vercel URL
- Wait 24-48 hours

### 404 Errors on Tenant Subdomain

- Check database has the slug
- Verify token works with `/api/tenants`
- Check middleware.ts is working

---

## Security Best Practices

1. **JWT Secret**: Generate a strong random secret in production
   \`\`\`bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   \`\`\`

2. **Password Hashing**: Bcryptjs with 10 salt rounds (already configured)

3. **Database**: Neon has encryption at rest

4. **HTTPS Only**: Vercel automatically enforces HTTPS

5. **Rate Limiting**: Consider adding rate limiting to auth endpoints

6. **Input Validation**: All slugs validated (lowercase, hyphens, 3+ chars)

---

## Monitoring & Maintenance

### Check Database Connection

\`\`\`bash
# Verify connection works
npm run db:push --dry
\`\`\`

### Monitor Vercel Deployment

- Check Vercel Dashboard for errors
- Monitor performance metrics
- Set up alerts for failed deployments

### Backup Database

Neon provides automated backups. For additional security:
- Set up point-in-time recovery
- Regular manual exports

---

## Advanced: Handling Multiple Tenants on Same Domain

If you want `alif.shariarkobirkiam.xyz` and `alif.com` to serve the same dashboard:

1. Add custom domain through dashboard UI
2. System stores both associations in database
3. Middleware checks both subdomain AND custom domain
4. Routes to same tenant

This is already implemented in the code!

---

## Need Help?

- Check Vercel status: https://vercel.com/status
- Neon status: https://status.neon.tech
- DNS lookup tool: https://mxtoolbox.com/mxlookup.aspx

"
