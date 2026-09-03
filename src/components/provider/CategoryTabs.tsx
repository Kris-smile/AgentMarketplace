/** 擅长模块分类标签导航（主页/列表页共用） */
import { Link } from 'react-router-dom'
import { CATEGORIES } from '@/data/constants'
import { cn } from '@/lib/utils'

export default function CategoryTabs({ active = 'all' }: { active?: string }) {
  const tabs = [{ key: 'all', label: '全部' }, ...CATEGORIES]
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
      {tabs.map(({ key, label }) => {
        const isActive = key === active
        // 主页点击标签 → 跳转筛选列表页并带上分类参数
        return (
          <Link
            key={key}
            to={key === 'all' ? '/explore' : `/explore?category=${key}`}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary',
            )}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
