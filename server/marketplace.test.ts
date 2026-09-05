import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("marketplace routes", () => {
  it("exposes provider discovery with typed filters", async () => {
    const caller = appRouter.createCaller(context());
    const result = await caller.providers.list({ category: "AI 客服", city: "宁波", minRating: 4.5, verifiedOnly: true });
    expect(Array.isArray(result)).toBe(true);
  });

  it("protects demand creation for signed-out visitors", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.demands.create({
      title: "搭建企业 AI 客服",
      goal: "需要将常见问题与产品资料接入客服流程。",
      budgetMin: 800,
      budgetMax: 2000,
      deliveryDays: 7,
      city: "宁波",
      deliveryMode: "远程",
      category: "AI 客服",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("protects admin metrics from normal users", async () => {
    const caller = appRouter.createCaller(context({ id: 2, openId: "user-2", name: "普通用户", email: null, loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }));
    await expect(caller.admin.metrics()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
