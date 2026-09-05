# AI Agent 服务对接平台部署说明

## 项目定位

本项目是在既有 MVP 页面基础上完成的中文优先全栈服务市场。公开页面保留首页、服务商探索、服务商详情、入驻与平台介绍；新增工作台、需求发布、报价接单、订单模型、评价与争议字段、服务商入驻申请、运营统计及审计日志 API。

## 本地启动

需要 Node.js 22、pnpm 10 和 MySQL 8.0+。复制 `ENVIRONMENT.example` 的变量到本地运行环境，至少配置 `DATABASE_URL`、`JWT_SECRET` 和 OAuth 相关变量，然后执行：

```bash
pnpm install
pnpm drizzle-kit generate
pnpm dev
```

默认前端与 API 由同一个服务提供，开发端口由 `PORT` 控制，页面入口为 `http://localhost:3000`。登录使用项目配置的 Manus OAuth；未登录状态仍可以浏览公开服务市场。

## Docker Compose

推荐使用 Compose 进行独立部署：

```bash
docker compose up -d --build
```

Compose 会启动 `app` 和 MySQL 8.4，并将数据库数据持久化到 `agent_marketplace_mysql` 卷。首次启动后，在应用容器内执行迁移或使用项目管理后台的数据库连接执行 `drizzle/0000_parallel_praxagora.sql` 与 `drizzle/0001_cool_the_stranger.sql`。生产环境务必替换 `JWT_SECRET`、`MYSQL_ROOT_PASSWORD` 和数据库密码，并将 `DATABASE_URL` 指向受保护的数据库网络地址。

## 核心 API 流程

| 业务阶段 | 主要过程 | 权限 |
|---|---|---|
| 服务发现 | `providers.list`、`providers.byId` | 公开 |
| 需求发布 | `demands.create`、`demands.list` | 登录用户 |
| 报价响应 | `quotes.create` | 登录用户 / 服务商 |
| 方案确认 | `quotes.select` | 需求方 |
| 订单跟踪 | `orders` 表记录支付、交付、完结、争议字段 | 订单参与方与运营 |
| 评价沉淀 | `reviews.create` | 登录用户 |
| 入驻审核 | `onboarding.submit`、运营侧审计 | 登录用户 / 管理员 |
| 运营概览 | `admin.metrics`、`admin.audit` | 管理员 |

## 沙箱可用性测试

执行 `pnpm check` 验证 TypeScript，执行 `pnpm build` 验证前端和服务端生产构建，执行 `pnpm test` 验证单元测试。浏览器检查建议按以下路径完成：首先访问首页和探索页，确认移动端单列卡片、桌面端多列布局、分类筛选与详情跳转；然后访问 `/#/workspace`，确认未登录时展示登录入口；完成 OAuth 后验证需求发布表单、需求列表与角色说明；管理员账户验证统计入口和审计 API 权限。

建议在 375×812 与 1280×720 两个视口各检查一次，并记录浏览器控制台、网络请求和页面截图。由于支付托管、实名认证与人工审核属于真实运营环节，当前版本保留状态字段、审计日志和管理员介入接口，不会伪造支付成功或认证结果。

## 生产注意事项

平台默认以单 Node 进程运行，Dockerfile 会在镜像内完成前端和服务端构建，容器通过 `process.env.PORT` 监听端口。不要把真实密钥提交到 Git；使用部署平台的 Secrets 管理功能注入环境变量。订单支付状态仅作为平台托管流程的可追踪记录，接入真实支付渠道前需要单独完成支付服务、退款、签名校验与合规审核。
