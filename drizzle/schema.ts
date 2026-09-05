import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "provider", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const providers = mysqlTable("providers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  headline: varchar("headline", { length: 240 }).notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatarUrl"),
  city: varchar("city", { length: 80 }).notNull(),
  categories: json("categories").$type<string[]>().notNull(),
  deliveryModes: json("deliveryModes").$type<string[]>().notNull(),
  priceMin: decimal("priceMin", { precision: 12, scale: 2 }).notNull(),
  priceMax: decimal("priceMax", { precision: 12, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0").notNull(),
  completedOrders: int("completedOrders").default(0).notNull(),
  responseHours: int("responseHours").default(24).notNull(),
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "verified", "rejected"]).default("pending").notNull(),
  status: mysqlEnum("status", ["draft", "published", "paused"]).default("draft").notNull(),
  cases: json("cases").$type<Array<{ title: string; description: string; link?: string }>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const demands = mysqlTable("demands", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  goal: text("goal").notNull(),
  budgetMin: decimal("budgetMin", { precision: 12, scale: 2 }).notNull(),
  budgetMax: decimal("budgetMax", { precision: 12, scale: 2 }).notNull(),
  deliveryDays: int("deliveryDays").notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  deliveryMode: varchar("deliveryMode", { length: 80 }).notNull(),
  notes: text("notes"),
  category: varchar("category", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["published", "matching", "in_progress", "completed", "closed"]).default("published").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  demandId: int("demandId").notNull(),
  providerId: int("providerId").notNull(),
  message: text("message").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  deliveryDays: int("deliveryDays").notNull(),
  status: mysqlEnum("status", ["submitted", "selected", "rejected", "withdrawn"]).default("submitted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  demandId: int("demandId").notNull(),
  quoteId: int("quoteId").notNull(),
  buyerId: int("buyerId").notNull(),
  providerId: int("providerId").notNull(),
  status: mysqlEnum("status", ["awaiting_payment", "paid", "in_progress", "delivered", "completed", "disputed", "cancelled"]).default("awaiting_payment").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["unpaid", "escrowed", "released", "refunded"]).default("unpaid").notNull(),
  disputeNote: text("disputeNote"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  reviewerId: int("reviewerId").notNull(),
  providerId: int("providerId").notNull(),
  rating: int("rating").notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "published", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const onboardingApplications = mysqlTable("onboardingApplications", {
  id: int("id").autoincrement().primaryKey(),
  applicantId: int("applicantId").notNull(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  categories: json("categories").$type<string[]>().notNull(),
  caseLinks: json("caseLinks").$type<string[]>().notNull(),
  priceRange: varchar("priceRange", { length: 80 }).notNull(),
  introduction: text("introduction").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  reviewNote: text("reviewNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  actorId: int("actorId").notNull(),
  entityType: varchar("entityType", { length: 40 }).notNull(),
  entityId: int("entityId").notNull(),
  action: varchar("action", { length: 80 }).notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Provider = typeof providers.$inferSelect;
export type Demand = typeof demands.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Review = typeof reviews.$inferSelect;
