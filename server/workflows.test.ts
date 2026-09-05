import { describe, expect, it, vi } from "vitest";

const providers = [
  { id: 1, displayName: "认证服务商", verified: true, rating: 4.8 },
  { id: 2, displayName: "普通服务商", verified: false, rating: 4.2 },
];

vi.mock("./db", () => ({
  listPublishedProviders: vi.fn((filters?: { verifiedOnly?: boolean; minRating?: number }) => providers.filter((item) => (!filters?.verifiedOnly || item.verified) && (!filters?.minRating || item.rating >= filters.minRating))),
  createDemand: vi.fn(async (input) => ({ id: 11, ...input })),
  createQuote: vi.fn(async (input) => ({ id: 21, ...input })),
  selectQuote: vi.fn(async (quoteId, buyerId) => ({ id: 31, quoteId, buyerId })),
  updateOrder: vi.fn(async (input) => input.id),
  createOnboarding: vi.fn(async (input) => ({ id: 41, ...input })),
  createReview: vi.fn(async (input) => ({ id: 51, ...input })),
  reviewApplication: vi.fn(async (id) => id),
  adminMetrics: vi.fn(async () => ({ providers: 1, demands: 1, orders: 1, pendingApplications: 0, pendingReviews: 0 })),
  appendAuditLog: vi.fn(async () => undefined),
  getProviderById: vi.fn(async () => undefined),
  listDemands: vi.fn(async () => []),
  listQuotesForUser: vi.fn(async () => []),
  listQuotesForDemand: vi.fn(async () => []),
  listOrdersForUser: vi.fn(async () => []),
  listPendingApplications: vi.fn(async () => []),
  listAdminQueues: vi.fn(async () => ({ demands: [], orders: [], reviews: [] })),
  listAuditLogs: vi.fn(async () => []),
  reviewEntity: vi.fn(async (input) => input.entityId),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "user" | "provider" | "admin" = "user"): TrpcContext {
  return {
    user: { id: 7, openId: `workflow-${role}`, email: null, name: role, loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("offline marketplace workflows", () => {
  it("filters verified providers and minimum rating through the typed API", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.providers.list({ verifiedOnly: true, minRating: 4.5 })).resolves.toEqual([providers[0]]);
  });

  it("supports the buyer, provider, onboarding, review, and admin success contracts", async () => {
    const buyer = appRouter.createCaller(context("user"));
    const provider = appRouter.createCaller(context("provider"));
    const admin = appRouter.createCaller(context("admin"));
    await expect(buyer.demands.create({ title: "企业客服", goal: "需要接入企业知识库并完成客服流程。", budgetMin: 500, budgetMax: 2000, deliveryDays: 7, city: "宁波", deliveryMode: "远程", category: "AI 客服" })).resolves.toMatchObject({ id: 11 });
    await expect(provider.quotes.create({ demandId: 11, providerId: 3, message: "提供部署、培训和七天售后支持。", amount: 1200, deliveryDays: 5 })).resolves.toMatchObject({ id: 21 });
    await expect(buyer.quotes.select({ quoteId: 21 })).resolves.toMatchObject({ id: 31 });
    await expect(provider.orders.update({ id: 31, status: "delivered", paymentStatus: "escrowed" })).resolves.toBe(31);
    await expect(provider.onboarding.submit({ displayName: "工作室", city: "杭州", categories: ["Agent 部署"], caseLinks: ["https://example.com/case"], priceRange: "¥500-2000/单", introduction: "专注于企业 Agent 部署与工作流交付，提供清晰的服务边界。" })).resolves.toMatchObject({ id: 41 });
    await expect(buyer.reviews.create({ orderId: 31, providerId: 3, rating: 5, content: "交付清晰，沟通及时。" })).resolves.toMatchObject({ id: 51 });
    await expect(admin.admin.reviewEntity({ entityType: "order", entityId: 31, action: "completed" })).resolves.toBe(31);
  });
});
