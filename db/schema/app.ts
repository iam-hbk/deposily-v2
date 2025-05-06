import { sql } from "drizzle-orm";
import {
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Assuming the users table is defined in './auth' as 'user'
import { user } from "./auth";

export const processingStatusEnum = pgEnum("processing_status", [
  "uploaded",
  "validating",
  "processing",
  "completed",
  "failed",
]);

export const statements = pgTable("statements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }), // Link to user table
  filename: text("filename").notNull(),
  filepath: text("filepath"), // Nullable as requested
  uploadDate: timestamp("upload_date", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  processingStatus: processingStatusEnum("processing_status")
    .notNull()
    .default("uploaded"),
  validationDetails: jsonb("validation_details"), // Store AI validation results
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .default(sql`now()`), // Use SQL 'now()' for auto-update
});

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }), //User who owns the client
  name: text("name").notNull(),
  clientReference: text("client_reference").notNull(), // Unique per user is handled application-side or via composite index if needed
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  statementId: uuid("statement_id")
    .notNull()
    .references(() => statements.id, { onDelete: "cascade" }), // Link to statements table
  clientId: uuid("client_id").references(() => clients.id, {
    onDelete: "set null",
  }), // Nullable, link to clients table
  transactionDate: timestamp("transaction_date", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  description: text("description").notNull(),
  extractedReference: text("extracted_reference"), // Can be null
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(), // For currency
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

// Define relations for easier querying if using drizzle-orm relational queries
import { relations } from "drizzle-orm";

export const statementRelations = relations(statements, ({ one, many }) => ({
  user: one(user, { fields: [statements.userId], references: [user.id] }),
  transactions: many(transactions),
}));

export const clientRelations = relations(clients, ({ one, many }) => ({
  user: one(user, { fields: [clients.userId], references: [user.id] }),
  transactions: many(transactions),
}));

export const transactionRelations = relations(transactions, ({ one }) => ({
  statement: one(statements, {
    fields: [transactions.statementId],
    references: [statements.id],
  }),
  client: one(clients, {
    fields: [transactions.clientId],
    references: [clients.id],
  }),
}));
