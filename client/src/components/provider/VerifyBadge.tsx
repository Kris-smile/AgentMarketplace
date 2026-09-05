/** 认证徽章：平台认证 / 已实名 / 保证金 */
import { BadgeCheck, UserCheck, Coins } from 'lucide-react'
import type { BadgeType } from '@/types/provider'
import { cn } from '@/lib/utils'

const BADGE_META: Record<BadgeType, { label: string; icon: typeof BadgeCheck; cls: string }> = {
  platform: { label: '平台认证', icon: BadgeCheck, cls: 'bg-primary/10 text-primary' },
  realname: { label: '已实名', icon: UserCheck, cls: 'bg-emerald-50 text-emerald-600' },
  deposit: { label: '保证金', icon: Coins, cls: 'bg-amber-50 text-amber-600' },
}

export function VerifyBadge({ type, className }: { type: BadgeType; className?: string }) {
  const meta = BADGE_META[type]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium leading-4',
        meta.cls,
        className,
      )}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  )
}
