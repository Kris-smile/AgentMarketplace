/** 筛选栏：关键词 + 擅长模块 / 地区 / 报价 / 好评率 + 排序（列表页用） */
import { Search, RotateCcw } from 'lucide-react'
import { CATEGORIES, REGIONS, PRICE_RANGES, RATING_LEVELS, SORT_OPTIONS } from '@/data/constants'
import { Input, Select } from '@/components/ui/form'
import type { FilterState } from '@/lib/filter'

export default function FilterBar({
  state,
  onChange,
  onReset,
}: {
  state: FilterState
  onChange: (patch: Partial<FilterState>) => void
  onReset: () => void
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      {/* 关键词搜索行 */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="搜索昵称 / 简介 / 模块，如：AI 客服"
          value={state.q ?? ''}
          onChange={(e) => onChange({ q: e.target.value })}
        />
      </div>

      {/* 条件筛选：手机 2 列，PC 5 列 */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <Select
          aria-label="擅长模块"
          value={state.category ?? 'all'}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          <option value="all">擅长模块：全部</option>
          {CATEGORIES.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </Select>

        <Select
          aria-label="地区"
          value={state.region ?? 'all'}
          onChange={(e) => onChange({ region: e.target.value })}
        >
          <option value="all">地区：全部</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>

        <Select
          aria-label="报价区间"
          value={state.price ?? 'all'}
          onChange={(e) => onChange({ price: e.target.value })}
        >
          <option value="all">报价：全部</option>
          {PRICE_RANGES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>

        <Select
          aria-label="好评率"
          value={state.rating ?? 'all'}
          onChange={(e) => onChange({ rating: e.target.value })}
        >
          <option value="all">好评率：全部</option>
          {RATING_LEVELS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>

        <Select
          aria-label="排序"
          value={state.sort ?? 'recommend'}
          onChange={(e) => onChange({ sort: e.target.value })}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>

      {/* 已选条件提示 + 重置 */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>筛选条件会同步到网址，可直接分享给同事</span>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
        >
          <RotateCcw size={12} />
          重置筛选
        </button>
      </div>
    </div>
  )
}
