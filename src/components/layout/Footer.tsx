/** 底部：信任背书条 + 版权信息 */
import { ShieldCheck, Lock, ClipboardCheck, MessageSquareWarning } from 'lucide-react'

/** 平台信任背书条：实名认证 · 资金托管 · 平台审核 · 不满意可投诉 */
export function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: '实名认证', desc: '接单人 100% 实名' },
    { icon: Lock, label: '资金托管', desc: '验收通过再放款' },
    { icon: ClipboardCheck, label: '平台审核', desc: '案例人工核验' },
    { icon: MessageSquareWarning, label: '不满意可投诉', desc: '平台介入处理' },
  ]
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4">
        {items.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={20} />
            </span>
            <div>
              <div className="text-sm font-semibold">{label}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            AI Agent 服务对接平台 —— 按地区 / 擅长模块 / 报价 / 口碑，找专业的人
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a href="/explore" className="hover:text-foreground">找服务</a>
            <a href="/join" className="hover:text-foreground">我要入驻</a>
            <a href="/about" className="hover:text-foreground">平台规则</a>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground/70 sm:text-left">
          © 2026 AI Agent 服务对接平台 · 第一阶段 MVP（演示数据） · 资金托管与评价体系将于第二阶段上线
        </p>
      </div>
    </footer>
  )
}
