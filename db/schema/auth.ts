import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  foreignKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// ——————— USER ———————
export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
});

export const userInsertSchema = createInsertSchema(user);
export const userSelectSchema = createSelectSchema(user);

// ——————— SESSION ———————
export const session = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});

// ——————— ACCOUNT ———————
export const account = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
});

// ——————— VERIFICATION ———————
export const verification = pgTable("verification", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
