import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { adminMetrics, appendAuditLog, createDemand, createOnboarding, createQuote, createReview, getProviderById, listDemands, listPublishedProviders, listQuotesForUser, listQuotesForDemand, listOrdersForUser, listPendingApplications, listAdminQueues, listAuditLogs, reviewEntity, reviewApplication, selectQuote, updateOrder } from "./db";

const providerFilters = z.object({ category: z.string().optional(), city: z.string().optional(), deliveryMode: z.string().optional(), minBudget: z.number().optional(), maxBudget: z.number().optional(), minRating: z.number().min(0).max(5).optional(), verifiedOnly: z.boolean().optional() }).optional();

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }),
  }),
  providers: router({
    list: publicProcedure.input(providerFilters).query(({ input }) => listPublishedProviders(input)),
    byId: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getProviderById(input.id)),
  }),
  demands: router({
    list: publicProcedure.query(({ ctx }) => listDemands(ctx.user?.id)),
    create: protectedProcedure.input(z.object({ title: z.string().min(4), goal: z.string().min(10), budgetMin: z.number().nonnegative(), budgetMax: z.number().positive(), deliveryDays: z.number().int().positive(), city: z.string().min(1), deliveryMode: z.string().min(1), notes: z.string().optional(), category: z.string().min(1) })).mutation(({ input, ctx }) => createDemand({ ...input, buyerId: ctx.user.id, budgetMin: String(input.budgetMin), budgetMax: String(input.budgetMax) })),
  }),
  quotes: router({
    inbox: protectedProcedure.query(({ ctx }) => listQuotesForUser(ctx.user.id)),
    forDemand: publicProcedure.input(z.object({ demandId: z.number() })).query(({ input }) => listQuotesForDemand(input.demandId)),
    create: protectedProcedure.input(z.object({ demandId: z.number(), providerId: z.number(), message: z.string().min(10), amount: z.number().positive(), deliveryDays: z.number().int().positive() })).mutation(({ input }) => createQuote({ ...input, amount: String(input.amount) })),
    select: protectedProcedure.input(z.object({ quoteId: z.number() })).mutation(({ input, ctx }) => selectQuote(input.quoteId, ctx.user.id)),
  }),
  orders: router({
    mine: protectedProcedure.query(({ ctx }) => listOrdersForUser(ctx.user.id)),
    update: protectedProcedure.input(z.object({ id: z.number(), status: z.enum(["awaiting_payment", "paid", "in_progress", "delivered", "completed", "disputed", "cancelled"]).optional(), paymentStatus: z.enum(["unpaid", "escrowed", "released", "refunded"]).optional(), disputeNote: z.string().optional() })).mutation(({ input }) => updateOrder(input)),
  }),
  reviews: router({
    create: protectedProcedure.input(z.object({ orderId: z.number(), providerId: z.number(), rating: z.number().int().min(1).max(5), content: z.string().min(5) })).mutation(({ input, ctx }) => createReview({ ...input, reviewerId: ctx.user.id })),
  }),
  onboarding: router({
    submit: protectedProcedure.input(z.object({ displayName: z.string().min(2), city: z.string().min(1), categories: z.array(z.string()).min(1), caseLinks: z.array(z.string()).min(1), priceRange: z.string().min(1), introduction: z.string().min(20) })).mutation(({ input, ctx }) => createOnboarding({ ...input, applicantId: ctx.user.id })),
  }),
  admin: router({
    metrics: adminProcedure.query(() => adminMetrics()),
    pendingApplications: adminProcedure.query(() => listPendingApplications()),
    reviewApplication: adminProcedure.input(z.object({ id: z.number(), status: z.enum(["approved", "rejected"]), reviewNote: z.string().optional() })).mutation(({ input, ctx }) => reviewApplication(input.id, input.status, input.reviewNote, ctx.user.id)),
    audit: adminProcedure.input(z.object({ entityType: z.string(), entityId: z.number(), action: z.string(), note: z.string().optional() })).mutation(({ input, ctx }) => appendAuditLog({ ...input, actorId: ctx.user.id })),
    queues: adminProcedure.query(() => listAdminQueues()),
    auditLogs: adminProcedure.query(() => listAuditLogs()),
    reviewEntity: adminProcedure.input(z.object({ entityType: z.enum(["demand", "order", "review"]), entityId: z.number(), action: z.string(), note: z.string().optional() })).mutation(({ input, ctx }) => reviewEntity({ ...input, actorId: ctx.user.id })),
  }),
});

export type AppRouter = typeof appRouter;
