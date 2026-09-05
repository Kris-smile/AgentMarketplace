import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, auditLogs, demands, onboardingApplications, orders, providers, quotes, reviews, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) { values.role = user.role ?? "admin"; updateSet.role = values.role; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listPublishedProviders(filters?: { category?: string; city?: string; deliveryMode?: string; minBudget?: number; maxBudget?: number; minRating?: number; verifiedOnly?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(providers.status, "published")];
  if (filters?.verifiedOnly !== false) conditions.push(eq(providers.verificationStatus, "verified"));
  if (filters?.minRating !== undefined) conditions.push(gte(providers.rating, String(filters.minRating)));
  if (filters?.city) conditions.push(eq(providers.city, filters.city));
  if (filters?.minBudget !== undefined) conditions.push(gte(providers.priceMax, String(filters.minBudget)));
  if (filters?.maxBudget !== undefined) conditions.push(lte(providers.priceMin, String(filters.maxBudget)));
  const rows = await db.select().from(providers).where(and(...conditions)).orderBy(desc(providers.rating), desc(providers.completedOrders));
  return rows.filter((row) => !filters?.category || row.categories.includes(filters.category)).filter((row) => !filters?.deliveryMode || row.deliveryModes.includes(filters.deliveryMode));
}

export async function getProviderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(providers).where(eq(providers.id, id)).limit(1);
  return result[0];
}

export async function createDemand(input: typeof demands.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("数据库未连接");
  const result = await db.insert(demands).values(input);
  return Number(result[0].insertId);
}

export async function listDemands(buyerId?: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(demands).where(buyerId ? eq(demands.buyerId, buyerId) : undefined).orderBy(desc(demands.createdAt));
}

export async function createQuote(input: typeof quotes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("数据库未连接");
  const result = await db.insert(quotes).values(input);
  return Number(result[0].insertId);
}

export async function selectQuote(quoteId: number, buyerId: number) {
  const db = await getDb();
  if (!db) throw new Error("数据库未连接");
  const quote = (await db.select().from(quotes).where(eq(quotes.id, quoteId)).limit(1))[0];
  if (!quote) throw new Error("报价不存在");
  const demand = (await db.select().from(demands).where(and(eq(demands.id, quote.demandId), eq(demands.buyerId, buyerId))).limit(1))[0];
  if (!demand) throw new Error("无权选择该报价");
  await db.update(quotes).set({ status: "selected" }).where(eq(quotes.id, quoteId));
  await db.update(quotes).set({ status: "rejected" }).where(and(eq(quotes.demandId, quote.demandId), sql`${quotes.id} <> ${quoteId}`));
  await db.update(demands).set({ status: "in_progress" }).where(eq(demands.id, quote.demandId));
  const result = await db.insert(orders).values({ demandId: quote.demandId, quoteId, buyerId, providerId: quote.providerId });
  return Number(result[0].insertId);
}

export async function createReview(input: typeof reviews.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("数据库未连接");
  const result = await db.insert(reviews).values(input);
  return Number(result[0].insertId);
}

export async function createOnboarding(input: typeof onboardingApplications.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("数据库未连接");
  const result = await db.insert(onboardingApplications).values(input);
  return Number(result[0].insertId);
}

export async function adminMetrics() {
  const db = await getDb();
  if (!db) return { providers: 0, demands: 0, orders: 0, pendingApplications: 0, pendingReviews: 0 };
  const count = async (table: any, condition?: any) => Number((await db.select({ count: sql<number>`count(*)` }).from(table).where(condition))[0]?.count ?? 0);
  return { providers: await count(providers), demands: await count(demands), orders: await count(orders), pendingApplications: await count(onboardingApplications, eq(onboardingApplications.status, "pending")), pendingReviews: await count(reviews, eq(reviews.status, "pending")) };
}

export async function appendAuditLog(input: typeof auditLogs.$inferInsert) {
  const db = await getDb();
  if (db) await db.insert(auditLogs).values(input);
}

export async function listQuotesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const providerRows = await db.select().from(providers).where(eq(providers.userId, userId));
  const providerIds = providerRows.map((row) => row.id);
  if (!providerIds.length) return [];
  return db.select().from(quotes).where(eq(quotes.providerId, providerIds[0])).orderBy(desc(quotes.createdAt));
}

export async function listOrdersForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(sql`${orders.buyerId} = ${userId} OR ${orders.providerId} = ${userId}`).orderBy(desc(orders.createdAt));
}

export async function updateOrder(input: { id: number; status?: typeof orders.$inferInsert.status; paymentStatus?: typeof orders.$inferInsert.paymentStatus; disputeNote?: string }) {
  const db = await getDb();
  if (!db) throw new Error("数据库未连接");
  await db.update(orders).set({ status: input.status, paymentStatus: input.paymentStatus, disputeNote: input.disputeNote }).where(eq(orders.id, input.id));
  return input.id;
}

export async function listPendingApplications() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(onboardingApplications).where(eq(onboardingApplications.status, "pending")).orderBy(desc(onboardingApplications.createdAt));
}

export async function reviewApplication(id: number, status: "approved" | "rejected", reviewNote: string | undefined, actorId: number) {
  const db = await getDb();
  if (!db) throw new Error("数据库未连接");
  await db.update(onboardingApplications).set({ status, reviewNote }).where(eq(onboardingApplications.id, id));
  await appendAuditLog({ actorId, entityType: "onboardingApplication", entityId: id, action: status, note: reviewNote });
  return id;
}

export async function listQuotesForDemand(demandId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quotes).where(eq(quotes.demandId, demandId)).orderBy(desc(quotes.createdAt));
}

export async function listAdminQueues() {
  const db = await getDb();
  if (!db) return { demands: [], orders: [], reviews: [] };
  return {
    demands: await db.select().from(demands).orderBy(desc(demands.createdAt)).limit(50),
    orders: await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(50),
    reviews: await db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(50),
  };
}

export async function reviewEntity(input: { entityType: "demand" | "order" | "review"; entityId: number; action: string; note?: string; actorId: number }) {
  const db = await getDb();
  if (!db) throw new Error("数据库未连接");
  if (input.entityType === "demand") await db.update(demands).set({ status: input.action as any }).where(eq(demands.id, input.entityId));
  if (input.entityType === "order") await db.update(orders).set({ status: input.action as any, disputeNote: input.note }).where(eq(orders.id, input.entityId));
  if (input.entityType === "review") await db.update(reviews).set({ status: input.action as any }).where(eq(reviews.id, input.entityId));
  await appendAuditLog({ actorId: input.actorId, entityType: input.entityType, entityId: input.entityId, action: input.action, note: input.note });
  return input.entityId;
}

export async function listAuditLogs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100);
}
