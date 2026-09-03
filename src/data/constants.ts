/**
 * 全站枚举常量：擅长模块、地区、报价区间、好评率档位、排序方式
 * 展示层与数据层共用，保证口径一致。
 */
import type { CategoryKey } from '@/types/provider'

/** 擅长模块（6 大类） */
export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'agent', label: 'Agent 部署' },
  { key: 'skill', label: 'Skill 安装' },
  { key: 'training', label: 'AI 培训' },
  { key: 'workflow', label: '工作流搭建' },
  { key: 'private', label: '私有化部署' },
  { key: 'service', label: 'AI 客服' },
]

/** 根据 key 拿到中文标签 */
export const categoryLabel = (key: CategoryKey): string =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key

/** 地区选项（第一期聚焦宁波/长三角，兼顾全国主要城市） */
export const REGIONS = [
  '宁波', '杭州', '上海', '苏州', '南京',
  '北京', '深圳', '广州', '成都', '武汉',
] as const

/** 报价区间选项（value 为 "min-max" 字符串） */
export const PRICE_RANGES = [
  { value: '0-1000', label: '¥1000 以内' },
  { value: '1000-3000', label: '¥1000-3000' },
  { value: '3000-10000', label: '¥3000-10000' },
  { value: '10000-999999', label: '¥10000 以上' },
] as const

/** 好评率档位 */
export const RATING_LEVELS = [
  { value: '90', label: '好评率 90%+' },
  { value: '95', label: '好评率 95%+' },
  { value: '98', label: '好评率 98%+' },
] as const

/** 排序方式 */
export const SORT_OPTIONS = [
  { value: 'recommend', label: '综合推荐' },
  { value: 'rating', label: '好评率优先' },
  { value: 'orders', label: '完成单数优先' },
  { value: 'price-asc', label: '报价从低到高' },
  { value: 'price-desc', label: '报价从高到低' },
] as const

/** 主页热门搜索词（点击直达筛选结果） */
export const HOT_SEARCHES = ['AI 客服搭建', '工作流自动化', '私有化部署', 'Agent 代安装', 'AI 内训'] as const
