/**
 * 筛选列表页 /explore
 * 按擅长模块、地区、报价区间、好评率多条件筛选 + 排序；
 * 筛选条件同步到 URL 查询参数（可分享、可回退）。
 */
import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { PROVIDERS } from '@/data/providers'
import { CATEGORIES, categoryLabel } from '@/data/constants'
import { filterProviders, type FilterState } from '@/lib/filter'
import { Button } from '@/components/ui/button'
import CategoryTabs from '@/components/provider/CategoryTabs'
import FilterBar from '@/components/provider/FilterBar'
import ProviderCard from '@/components/provider/ProviderCard'

/** 构建分类 key → 中文标签 的映射，供筛选函数使用 */
const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(({ key, label }) => [key, label]),
)

export default function ExplorePage() {
  // 筛选状态直接存放在 URL 参数中（单一数据源，避免双份状态不同步）
  const [searchParams, setSearchParams] = useSearchParams()

  const state: FilterState = {
    q: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? 'all',
    region: searchParams.get('region') ?? 'all',
    price: searchParams.get('price') ?? 'all',
    rating: searchParams.get('rating') ?? 'all',
    sort: searchParams.get('sort') ?? 'recommend',
  }

  // 更新某个筛选条件 → 写回 URL
  const onChange = useCallback(
    (patch: Partial<FilterState>) => {
      const next = new URLSearchParams(searchParams)
      Object.entries(patch).forEach(([k, v]) => {
        const val = (v ?? '').toString()
        if (!val || val === 'all' || (k === 'sort' && val === 'recommend')) next.delete(k)
        else next.set(k, val)
      })
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const onReset = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams])

  // 过滤 + 排序（数据层纯函数）
  const result = useMemo(() => filterProviders(PROVIDERS, state, CATEGORY_LABELS), [state, searchParams])

  // 当前激活的分类 tab（用于标签高亮）
  const activeTab = state.category && state.category !== 'all' ? state.category : 'all'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* 页头 */}
      <div className="mb-4">
        <h1 className="text-xl font-bold sm:text-2xl">找服务</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          共 {PROVIDERS.length} 位接单人 · 当前筛选出 <span className="font-semibold text-primary">{result.length}</span> 位
        </p>
      </div>

      {/* 分类标签导航 */}
      <div className="mb-4">
        <CategoryTabs active={activeTab} />
      </div>

      {/* 多条件筛选栏 */}
      <FilterBar state={state} onChange={onChange} onReset={onReset} />

      {/* 结果列表：手机单列 / 平板两列 / PC 三列 */}
      {result.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <SearchX size={40} className="text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">没有符合条件的接单人，换个条件试试</p>
          <p className="text-xs text-muted-foreground/70">
            提示：报价筛选用的是「与接单人报价区间有交集」的规则
          </p>
          <Button variant="outline" size="sm" onClick={onReset} className="mt-2">
            清空筛选条件
          </Button>
        </div>
      )}

      {/* 底部提示 */}
      {result.length > 0 && (
        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          已展示全部 {result.length} 位 · 排序：
          {state.sort === 'rating'
            ? '好评率优先'
            : state.sort === 'orders'
              ? '完成单数优先'
              : state.sort === 'price-asc'
                ? '报价从低到高'
                : state.sort === 'price-desc'
                  ? '报价从高到低'
                  : '综合推荐'}
          {state.category && state.category !== 'all' && ` · ${categoryLabel(state.category as never)}`}
        </p>
      )}
    </div>
  )
}
