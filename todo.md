# Project TODO

- [x] Inspect project planning document and existing GitHub MVP
- [x] Initialize the full-stack project foundation
- [x] Preserve and upgrade the Chinese public pages: homepage, provider exploration, provider detail, join, and platform introduction
- [x] Implement responsive service marketplace visual system and Chinese navigation
- [x] Implement account entry and role-aware user, provider, and admin workspaces
- [x] Add provider profiles, service cards, categories, regions, price ranges, delivery modes, cases, badges, ratings, and review summaries
- [x] Add multi-condition provider search and filtering plus consultation entry from detail pages
- [x] Add demand publishing and management with project goal, budget, timeline, region, notes, and lifecycle statuses
- [x] Add provider response, quotation, selection, and order collaboration workflow
- [x] Add order confirmation, payment-state tracking, completion review, dispute notes, and audit trail
- [x] Add provider onboarding application and admin review workflows for providers, demands, orders, and reviews
- [x] Add operational statistics and role-protected admin dashboard
- [x] Add typed database schema, queries, API procedures, seed data, empty states, and error feedback
- [x] Add Dockerfile, Docker Compose, environment example, and deployment documentation
- [x] Add/update Vitest coverage for authentication and marketplace workflows
- [x] Run build, typecheck, unit tests, browser usability checks, and responsive screenshot verification
- [x] Fix discovered issues and update documentation with reproducible sandbox test steps
- [x] Commit and push completed source and deployment assets to GitHub

- [x] Verify and upgrade all migrated public pages: explore, provider detail, join, and about
- [x] Build separate buyer, provider, and admin workspace views with role-specific actions
- [x] Add certification and rating filters to provider search
- [x] Add provider quote submission, buyer quote selection, and order collaboration UI
- [x] Add order state transitions, payment-state updates, dispute notes, completion review, and audit screens
- [x] Add admin approve/reject workflows for onboarding, demands, orders, and reviews
- [x] Add marketplace workflow Vitest coverage beyond authentication
- [x] Run responsive browser checks for key pages at mobile and desktop breakpoints and clear runtime errors

- [x] Add a visible certification filter control to the exploration UI and wire it to the typed API
- [x] Implement provider quote submission and buyer quote selection UI for the quote-to-order flow
- [x] Add UI actions for payment status, dispute notes, completion review submission, and audit record viewing
- [x] Add admin queues and approve/reject actions for demands, orders, and reviews
- [x] Expand Vitest coverage to successful demand creation, quote creation/selection, order update, onboarding review, and review creation

- [x] 将探索页认证筛选接入 trpc.providers.list，并验证 verifiedOnly 与 rating 参数
- [x] 增加需求方报价对比与选择界面，调用 quotes.forDemand 和 quotes.select
- [x] 增加支付状态、争议备注、完结评价与审计日志查看界面
- [x] 增加运营侧需求、订单、评价审核队列及审批动作
- [x] 增加需求创建、报价创建/选择、订单更新、入驻审核和评价提交成功路径测试

- [x] 完成 GitHub commit/push 并保存命令结果
- [x] 为认证与评分筛选增加可验证的后端查询测试
- [x] 增加审计日志查询与查看界面
- [x] 将 admin.reviewEntity mutation 真正接入运营审核动作
- [x] 增加可在无外部数据库时运行的成功路径流程测试替身
