import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");
const connection = await mysql.createConnection(url);
const [users] = await connection.query("SELECT id FROM users ORDER BY id LIMIT 1");
const userId = users[0]?.id;
if (!userId) throw new Error("请先完成一次登录，让 users 表产生用户记录");

await connection.query(
  `INSERT INTO providers (userId, displayName, headline, bio, city, categories, deliveryModes, priceMin, priceMax, rating, completedOrders, responseHours, verificationStatus, status, cases)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified', 'published', ?)
   ON DUPLICATE KEY UPDATE updatedAt = CURRENT_TIMESTAMP`,
  [userId, "林墨 · Agent 交付顾问", "把复杂的 Agent 落地成团队真正用得起来的流程", "专注 AI 客服、知识库、工作流与团队培训，交付边界清晰，支持远程协作与本地上门。", "宁波", JSON.stringify(["AI 客服", "工作流搭建", "Agent 部署"]), JSON.stringify(["远程", "上门", "培训"]), "800.00", "5000.00", "4.90", 36, 2, JSON.stringify([{ title: "制造业售后知识库", description: "整理 2000+ 条产品资料，搭建可追溯问答流程。" }, { title: "电商客服工作流", description: "将售前咨询、售后分流与日报自动化。" }])]
);

await connection.query(
  `INSERT INTO demands (buyerId, title, goal, budgetMin, budgetMax, deliveryDays, city, deliveryMode, category, status, notes)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)` ,
  [userId, "为小团队搭建可维护的 AI 客服", "希望接入现有 FAQ 与产品文档，支持人工转接和每周数据复盘。", "1200.00", "3500.00", 10, "宁波", "远程", "AI 客服", "需要有类似企业落地案例，先线上沟通需求。"]
);

console.log("Seed completed");
await connection.end();
