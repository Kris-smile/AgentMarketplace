/** 顶部导航：Logo + 三个入口（找服务 / 我要入驻 / 平台规则） */
import { Link, NavLink } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/explore', label: '找服务' },
  { to: '/join', label: '我要入驻' },
  { to: '/about', label: '平台规则' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot size={18} />
          </span>
          <span className="text-base font-bold tracking-tight">
            {/* 手机端短名，PC 端全名 */}
            <span className="sm:hidden">Agent 对接平台</span>
            <span className="hidden sm:inline">AI Agent 服务对接平台</span>
          </span>
        </Link>

        {/* 导航：手机端紧凑展示，不换行 */}
        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-1.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
