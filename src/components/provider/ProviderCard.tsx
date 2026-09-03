/**
 * 接单人卡片（全站核心组件：主页瀑布流 / 列表页共用）
 * 整卡可点击跳转详情页。
 */
import { Link } from 'react-router-dom'
import { MapPin, Star, PackageCheck } from 'lucide-react'
import type { Provider } from '@/types/provider'
import { categoryLabel } from '@/data/constants'
import { Badge } from '@/components/ui/badge'
import { Avatar } from './Avatar'
import { VerifyBadge } from './VerifyBadge'

export default function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link
      to={`/provider/${provider.id}`}
      className="group block rounded-lg border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* 头部：头像 + 昵称 + 地区 + 认证徽章 */}
      <div className="flex items-start gap-3">
        <Avatar name={provider.nickname} hue={provider.avatarHue} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold leading-tight group-hover:text-primary">
              {provider.nickname}
            </h3>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            {provider.region}
          </div>
          {/* 认证标识（最多显示 3 个） */}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {provider.badges.map((b) => (
              <VerifyBadge key={b} type={b} />
            ))}
          </div>
        </div>
      </div>

      {/* 擅长模块标签（2-4 个） */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.categories.slice(0, 4).map((c) => (
          <Badge key={c}>{categoryLabel(c)}</Badge>
        ))}
      </div>

      {/* 一句话简介 */}
      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-muted-foreground">
        {provider.intro}
      </p>

      {/* 底部数据条：报价区间 · 完成单数 · 好评率 */}
      <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
        <span className="text-sm font-bold text-primary">
          ¥{provider.priceMin.toLocaleString()}-{provider.priceMax.toLocaleString()}
          <span className="text-xs font-normal text-muted-foreground">/单</span>
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <PackageCheck size={13} />
            {provider.completedOrders} 单
          </span>
          <span className="inline-flex items-center gap-1">
            <Star size={13} className="text-amber-500" />
            {provider.rating}%
          </span>
        </div>
      </div>
    </Link>
  )
}
