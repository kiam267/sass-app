import { pgTable, text, timestamp, uuid, serial, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').unique().notNull(),
    name: text('name').notNull(),
    password: text('password').notNull(), // Hash this!
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
  })
);

// Tenants table (each user's workspace/project)
export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // Display name (e.g., "Alif's Shop")
    slug: text('slug').unique().notNull(), // Subdomain slug (e.g., "alif")
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdIdx: index('tenant_user_id_idx').on(table.userId),
    slugIdx: index('slug_idx').on(table.slug),
  })
);

// Custom domains table
export const customDomains = pgTable(
  'custom_domains',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    domain: text('domain').unique().notNull(), // e.g., "alif.com"
    cname: text('cname').notNull(), // CNAME value (e.g., "cname.vercel.com")
    isVerified: boolean('is_verified').default(false),
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    tenantIdIdx: index('domain_tenant_id_idx').on(table.tenantId),
    domainIdx: index('domain_idx').on(table.domain),
  })
);

// Tenant settings
export const tenantSettings = pgTable(
  'tenant_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .unique()
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    logo: text('logo'),
    primaryColor: text('primary_color').default('#3b82f6'),
    theme: text('theme').default('light'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  }
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tenants: many(tenants),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  user: one(users, {
    fields: [tenants.userId],
    references: [users.id],
  }),
  customDomains: many(customDomains),
  settings: one(tenantSettings),
}));

export const customDomainsRelations = relations(customDomains, ({ one }) => ({
  tenant: one(tenants, {
    fields: [customDomains.tenantId],
    references: [tenants.id],
  }),
}));

export const tenantSettingsRelations = relations(tenantSettings, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantSettings.tenantId],
    references: [tenants.id],
  }),
}));
