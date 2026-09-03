/**
 * 接单人（Provider）数据类型定义
 * 注意：字段设计与第二阶段云数据库集合保持一致，
 * 二阶段只需把 data/providers.ts 的 Mock 数据替换为云端查询结果。
 */

/** 擅长模块（key 与 data/constants.ts 中 CATEGORIES 一一对应） */
export type CategoryKey = 'agent' | 'skill' | 'training' | 'workflow' | 'private' | 'service'

/** 认证徽章类型 */
export type BadgeType = 'platform' | 'realname' | 'deposit'

/** 案例 */
export interface ProviderCase {
  title: string // 案例标题
  desc: string // 一句话描述
  link?: string // 可验证案例链接（可选）
  hue: number // 缩略图色相，用于本地生成渐变缩略图（不依赖外网图片）
}

/** 客户评价 */
export interface Review {
  client: string // 客户称呼（脱敏）
  stars: number // 星级 1-5
  date: string // 评价日期
  content: string // 评价内容
}

/** 接单人（核心实体） */
export interface Provider {
  id: string // 唯一标识
  nickname: string // 昵称
  region: string // 地区，如「宁波」
  categories: CategoryKey[] // 擅长模块（2-4 个）
  priceMin: number // 报价下限（元/单）
  priceMax: number // 报价上限（元/单）
  completedOrders: number // 已完成单数
  rating: number // 好评率（0-100）
  badges: BadgeType[] // 认证标识
  intro: string // 一句话简介
  avatarHue: number // 头像色相，用于本地生成首字母头像
  responseTime: string // 平均响应时间
  joinDate: string // 入驻时间
  cases: ProviderCase[] // 案例列表
  reviews: Review[] // 客户评价
}
