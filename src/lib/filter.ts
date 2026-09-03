/**
 * 搜索 / 筛选 / 排序纯函数（数据层逻辑，与 UI 解耦）
 * 二阶段接云数据库后，这些条件将翻译为数据库查询参数。
 */
import type { Provider } from '@/types/provider'

/** 筛选条件（与 URL 查询参数一一对应，便于分享链接） */
export interface FilterState {
  q?: string // 关键词（匹配昵称/简介/擅长模块）
  category?: string // 擅长模块 key
  region?: string // 地区
  price?: string // 报价区间 "min-max"
  rating?: string // 最低好评率
  sort?: string // 排序方式
}

/** 关键词匹配：昵称 / 简介 / 擅长模块中文标签（简单包含匹配，MVP 够用） */
function matchKeyword(p: Provider, q: string, categoryLabels: Record<string, string>): boolean {
  const kw = q.trim().toLowerCase()
  if (!kw) return true
  const haystack = [
    p.nickname,
    p.intro,
    p.region,
    ...p.categories.map((c) => categoryLabels[c] ?? ''),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(kw)
}
void matchKeyword // 保留函数供二阶段服务端检索复用

/**
 * 对常见需求语句做轻量语义映射（如"我想给公司装个AI客服"→ 命中 AI 客服），
 * 提升一句话搜索的命中率。纯前端实现，二阶段可换成服务端检索。
 */
const KEYWORD_ALIASES: Record<string, string[]> = {
  service: ['客服', '售后机器人', '自动回复'],
  agent: ['agent', '智能体', '代装', '代安装', '部署agent', 'claw', 'coze', 'dify'],
  skill: ['skill', '技能', '插件', '安装skill'],
  training: ['培训', '教学', '课程', '教', '内训'],
  workflow: ['工作流', '自动化', '流程', 'workflow', 'n8n'],
  private: ['私有化', '本地部署', '内网', '私有部署'],
}

/** 主筛选函数：多条件过滤 + 排序 */
export function filterProviders(
  list: Provider[],
  state: FilterState,
  categoryLabels: Record<string, string>,
): Provider[] {
  // ---- 1. 关键词（含轻量语义映射）----
  let result = list
  const q = state.q?.trim().toLowerCase() ?? ''
  if (q) {
    // 先看关键词能映射到哪些擅长模块
    const hitCategories = Object.entries(KEYWORD_ALIASES)
      .filter(([, words]) => words.some((w) => q.includes(w)))
      .map(([key]) => key)
    result = result.filter((p) => {
      const textHit = [p.nickname, p.intro, p.region, ...p.categories.map((c) => categoryLabels[c] ?? '')]
        .join(' ')
        .toLowerCase()
        .includes(q)
      const categoryHit = hitCategories.length > 0 && p.categories.some((c) => hitCategories.includes(c))
      return textHit || categoryHit
    })
  }

  // ---- 2. 擅长模块 ----
  if (state.category && state.category !== 'all') {
    result = result.filter((p) => p.categories.includes(state.category as never))
  }

  // ---- 3. 地区 ----
  if (state.region && state.region !== 'all') {
    result = result.filter((p) => p.region === state.region)
  }

  // ---- 4. 报价区间（与接单人报价区间有交集即命中）----
  if (state.price && state.price !== 'all') {
    const [minStr, maxStr] = state.price.split('-')
    const min = Number(minStr)
    const max = Number(maxStr)
    result = result.filter((p) => p.priceMin <= max && p.priceMax >= min)
  }

  // ---- 5. 最低好评率 ----
  if (state.rating && state.rating !== 'all') {
    const minRating = Number(state.rating)
    result = result.filter((p) => p.rating >= minRating)
  }

  // ---- 6. 排序 ----
  const sorted = [...result]
  switch (state.sort) {
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    case 'orders':
      sorted.sort((a, b) => b.completedOrders - a.completedOrders)
      break
    case 'price-asc':
      sorted.sort((a, b) => a.priceMin - b.priceMin)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.priceMax - a.priceMax)
      break
    default:
      // 综合推荐：好评率 × log(单数)，兼顾口碑与经验
      sorted.sort(
        (a, b) =>
          b.rating * Math.log10(b.completedOrders + 10) - a.rating * Math.log10(a.completedOrders + 10),
      )
  }
  return sorted
}
