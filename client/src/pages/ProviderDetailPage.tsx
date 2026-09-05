/**
 * 接单人详情页 /provider/:id
 * 完整资料、报价明细、案例展示、客户评价、接单历史、咨询入口
 */
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Star, PackageCheck, Clock, CalendarDays, ExternalLink,
  ChevronRight, MessageCircle, ShieldCheck, X,
} from 'lucide-react'
import { PROVIDERS } from '@/data/providers'
import { categoryLabel } from '@/data/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, CaseThumb } from '@/components/provider/Avatar'
import { VerifyBadge } from '@/components/provider/VerifyBadge'
import type { Provider } from '@/types/provider'

/** 由接单人基础数据推导一份"接单历史"（MVP 阶段的演示数据） */
function mockHistory(p: Provider): { service: string; price: string; date: string; stars: number }[] {
  const services = p.categories.map(categoryLabel)
  const rows = []
  for (let i = 0; i < 3; i++) {
    const svc = services[i % services.length]
    const mid = Math.round((p.priceMin + p.priceMax) / 2)
    const price = `¥${(mid - i * 300).toLocaleString()}`
    const month = 9 - i
    rows.push({
      service: svc,
      price,
      date: `2026-0${month}`,
      stars: p.rating >= 97 ? 5 : 4,
    })
  }
  return rows
}

/** 星级展示（只读） */
function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < n ? 'text-amber-500' : 'text-border'} fill={i < n ? 'currentColor' : 'none'} />
      ))}
    </span>
  )
}

export default function ProviderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showContact, setShowContact] = useState(false)

  const provider = PROVIDERS.find((p) => p.id === id)

  // 找不到接单人：友好提示
  if (!provider) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-lg font-semibold">没有找到这位接单人</p>
        <p className="mt-2 text-sm text-muted-foreground">可能链接已过期，去列表页看看其他人吧</p>
        <Button className="mt-6" onClick={() => navigate('/explore')}>去找服务</Button>
      </div>
    )
  }

  const history = mockHistory(provider)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* 面包屑 */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">首页</Link>
        <ChevronRight size={12} />
        <Link to="/explore" className="hover:text-foreground">找服务</Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{provider.nickname}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ===== 左侧（PC 占 2 列）：资料 + 案例 + 评价 + 历史 ===== */}
        <div className="space-y-6 lg:col-span-2">
          {/* 完整资料卡 */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar name={provider.nickname} hue={provider.avatarHue} size="xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold sm:text-2xl">{provider.nickname}</h1>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {provider.region}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {provider.badges.map((b) => (
                      <VerifyBadge key={b} type={b} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{provider.intro}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {provider.categories.map((c) => (
                      <Badge key={c} variant="secondary">{categoryLabel(c)}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* 关键数据条 */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-4">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <PackageCheck size={13} /> 完成单数
                  </div>
                  <div className="mt-1 text-lg font-bold">{provider.completedOrders}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star size={13} /> 好评率
                  </div>
                  <div className="mt-1 text-lg font-bold text-amber-600">{provider.rating}%</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={13} /> 平均响应
                  </div>
                  <div className="mt-1 text-lg font-bold">{provider.responseTime}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays size={13} /> 入驻时间
                  </div>
                  <div className="mt-1 text-lg font-bold">{provider.joinDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 案例展示 */}
          <Card>
            <CardHeader>
              <CardTitle>案例展示（{provider.cases.length}）</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {provider.cases.map((c) => (
                <div key={c.title} className="overflow-hidden rounded-md border border-border">
                  <CaseThumb title={c.title} hue={c.hue} />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold leading-5">{c.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{c.desc}</p>
                    {c.link && (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        查看案例链接 <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 客户评价 */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>客户评价（{provider.reviews.length}）</CardTitle>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                <Star size={14} fill="currentColor" /> 好评率 {provider.rating}%
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              {provider.reviews.map((r) => (
                <div key={r.client + r.date} className="rounded-md bg-secondary/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.client}</span>
                      <Stars n={r.stars} />
                    </div>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-foreground/90">{r.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 接单历史（演示数据） */}
          <Card>
            <CardHeader>
              <CardTitle>接单历史</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {history.map((h, i) => (
                  <div key={i} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{h.service}</Badge>
                      <Stars n={h.stars} />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-primary">{h.price}</span>
                      <span className="text-xs text-muted-foreground">{h.date} 完成</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground/70">* 历史记录为阶段一演示数据，第二阶段将展示平台真实订单</p>
            </CardContent>
          </Card>
        </div>

        {/* ===== 右侧（PC 侧栏，手机端置顶显示在按钮区）：报价明细 + 咨询 ===== */}
        <div className="space-y-6">
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle>报价明细</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ¥{provider.priceMin.toLocaleString()}-{provider.priceMax.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/单</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">最终报价以沟通需求后确认为准</p>

              <ul className="mt-4 space-y-2 text-sm">
                {provider.categories.map((c) => (
                  <li key={c} className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2">
                    <span>{categoryLabel(c)}</span>
                    <span className="text-xs text-muted-foreground">按需求报价</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2">
                <Button className="w-full" size="lg" onClick={() => setShowContact(true)}>
                  <MessageCircle size={16} />
                  咨询接单
                </Button>
                <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  资金托管 · 验收通过再放款
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 咨询弹窗（MVP：演示入口，二阶段接入真实订单流程） */}
      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={() => setShowContact(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">咨询「{provider.nickname}」</h3>
              <button
                onClick={() => setShowContact(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              平台撮合模式：提交需求后，由平台对接「{provider.nickname}」与你沟通方案与报价，
              成交后资金走平台托管，验收通过再放款。
            </p>
            <div className="mt-4 rounded-md bg-secondary/70 p-4 text-sm">
              <div className="font-medium">平台客服（演示）</div>
              <div className="mt-1 text-muted-foreground">微信号：AgentHub-KeFu（MVP 演示信息）</div>
              <div className="text-muted-foreground">工作时间：9:00 - 21:00</div>
            </div>
            <Button className="mt-4 w-full" onClick={() => setShowContact(false)}>
              我知道了
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
