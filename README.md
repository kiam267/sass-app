# Multi-Tenant SaaS Platform

A complete multi-tenant SaaS application with subdomain &
custom domain support, built with Next.js, Drizzle, and
Neon.

## Features

✅ **Multi-tenant Architecture**

- Each user gets their own workspace
- Automatic subdomain creation (e.g.,
  `alif.shariarkobirkiam.xyz`)
- Support for custom domains (e.g., `alif.com`)

✅ **Authentication**

- Secure signup/login with bcryptjs
- JWT-based sessions
- Protected API routes

✅ **Domain Management**

- Wildcard subdomain support
- Custom domain DNS setup
- CNAME generation & verification
- Provider-specific setup guides (Name.com, GoDaddy,
  Cloudflare)

✅ **Multi-Tenant Routing**

- Automatic tenant detection via subdomain
- Custom domain routing
- Middleware-based tenant context

## Tech Stack

- **Frontend**: Next.js 16, React 19, shadcn/ui, Tailwind
  CSS
- **Backend**: Next.js Route Handlers, Server Actions
- **Database**: Neon (PostgreSQL), Drizzle ORM
- **Authentication**: JWT + bcryptjs
- **Deployment**: Vercel with wildcard domains

## Project Structure

```bash
├── app/
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Main dashboard
│   └── [tenantId]/           # Tenant-specific pages
│       ├── settings/         # Tenant settings
│       └── api/              # API routes
│
├── auth/                     # Auth endpoints
├── tenants/                  # Tenant management
│
├── lib/
│   ├── db/                   # Database config & schema
│   └── auth/                 # Auth utilities
│
├── tenant-utils.ts           # Tenant detection logic
│
├── components/
│   ├── auth/                 # Auth forms
│   └── tenant/               # Tenant components
│
├── domains/                  # Domain management
│
├── scripts/                  # SQL migrations
│
├── middleware.ts             # Request routing
└── drizzle.config.ts         # Drizzle configuration

```

## Quick Start

### 1. Environment Setup

`bash cp .env.local.example .env.local`

Update `.env.local` with your values:

- `DATABASE_URL`: From Neon
- `JWT_SECRET`: Generate a random secret
- `NEXT_PUBLIC_MAIN_DOMAIN`: Your domain

### 2. Install Dependencies

`bash npm install `

### 3. Initialize Database

`bash npm run db:push `

Or run the SQL migration from v0 dashboard.

### 4. Start Development Server

`bash npm run dev `

Visit `http://localhost:3000`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment
guide including:

- Vercel configuration
- Domain setup
- Database initialization
- Custom domain setup for users

## How Multi-Tenancy Works

### Subdomain Tenant Detection

```bash
Request: alif.shariarkobirkiam.xyz ↓ Middleware
extracts "alif" from hostname ↓ Database lookup:
tenants.slug = "alif" ↓ Routes to that tenant's dashboard

```

### Custom Domain Tenant Detection

```bash
Request: alif.com ↓ Middleware checks custom_domains
table ↓ Finds tenant_id from custom_domains.domain =
"alif.com" ↓ Routes to that tenant's dashboard

```

## API Examples

### Create Tenant

```bash
curl -X POST
http://localhost:3000/api/tenants/create
 -H "Authorization: Bearer {token}" \
 -H "Content-Type: application/json"
 -d { "name": "My Dashboard", "slug": "mydash",
"description": "My project dashboard" }

```

### Add Custom Domain

```bash
curl -X POST
http://localhost:3000/api/tenants/{tenantId}/domains
 -H "Authorization: Bearer {token}"
 -H "Content-Type: application/json"
 -d { "domain": "example.com" }

```

Response:

```json
{
  "id": "uuid",
  "domain": "example.com",
  "cname": "cname.vercel.sh",
  "isVerified": false
}
```

## Database Schema

### Users Table

```sql

- id: UUID (Primary Key)
- email: TEXT (Unique)
- name: TEXT
- password: TEXT (Hashed)
- created_at: TIMESTAMP 

```

### Tenants Table

``` sql

- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → users)
- name: TEXT
- slug: TEXT (Unique)
- description: TEXT
- created_at: TIMESTAMP 

```

### Custom Domains Table

``` sql

- id: UUID (Primary Key)
- tenant_id: UUID (Foreign Key → tenants)
- domain: TEXT (Unique)
- cname: TEXT
- is_verified: BOOLEAN
- verified_at: TIMESTAMP
- created_at: TIMESTAMP 

```

## Best Practices Implemented

✅ **Security**

- Bcryptjs password hashing (10 salt rounds)
- JWT with 7-day expiration
- Protected API routes with token verification
- Input validation (slug format, domain validation)

✅ **Database**

- Indexes on frequently queried columns
- Foreign key constraints with cascade delete
- Connection pooling via Neon

✅ **Architecture**

- Singleton pattern for database client
- Middleware for automatic tenant detection
- Separation of concerns (routes, utilities, components)

✅ **User Experience**

- Form validation with user feedback
- CNAME setup guides for major registrars
- Clear error messages
- Loading states

## Common Workflows

### User Signup & Dashboard Creation

1. User signs up at `shariarkobirkiam.xyz/auth/signup`
2. Creates first dashboard with slug "myapp"
3. Automatically redirected to `myapp.shariarkobirkiam.xyz`

### Adding Custom Domain

1. User goes to domain settings
2. Enters their domain: `example.com`
3. Receives CNAME value
4. Updates their domain registrar's DNS
5. Both `myapp.shariarkobirkiam.xyz` and `example.com` now
   work

## Scaling Considerations

- **Database**: Neon handles connection pooling and scaling
- **Compute**: Vercel serverless scales automatically
- **Domains**: Add to Vercel dashboard as needed
- **Data Isolation**: Query by `tenant_id` in all queries

## Environment Variables Reference

```env

# Database (Required)

DATABASE_URL=postgresql://...

# JWT Secret (Required)

JWT_SECRET=your-random-secret-key

# Domain Config (Required)

NEXT_PUBLIC_MAIN_DOMAIN=shariarkobirkiam.xyz
NEXT_PUBLIC_APP_URL=https://shariarkobirkiam.xyz

# Vercel (Optional - auto-configured on Vercel)

VERCEL_URL=... VERCEL_ENV=... 

```

## Troubleshooting

### "Slug already taken" Error

- Choose a different slug name
- Slugs must be unique across all tenants

### "Unauthorized" on API calls

- Verify JWT token in localStorage
- Check token isn't expired (7-day expiration)
- Try logging in again

### Custom domain not working

- Verify CNAME is added to registrar
- Wait 24-48 hours for DNS propagation
- Check DNS with: `nslookup example.com`

## License

MIT

## Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)
