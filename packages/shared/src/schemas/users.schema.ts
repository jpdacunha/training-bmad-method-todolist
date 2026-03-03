import { index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    avatarUrl: text('avatarUrl'),
    oauthProvider: text('oauthProvider').notNull(),
    oauthProviderId: text('oauthProviderId').notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('idx_users_email').on(table.email),
    index('idx_users_oauthProviderId').on(table.oauthProviderId),
    uniqueIndex('uq_users_oauth').on(table.oauthProvider, table.oauthProviderId),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
