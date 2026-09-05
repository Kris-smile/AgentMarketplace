/**
 * 主页：四个模块（按策划书 3.2 节）
 * 1. 顶部一句话需求搜索栏  2. 擅长模块分类标签导航
 * 3. 接单人卡片瀑布流（核心）  4. 底部平台信任背书条
 */
import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import { PROVIDERS } from '@/data/providers'
import { CATEGORIES, HOT_SEARCHES, categoryLabel } from '@/data/constants'
import { Button } from '@/components/ui/button'
import CategoryTabs from '@/components/provider/CategoryTabs'
import ProviderCard from '@/components/provider/ProviderCard'
import { TrustBar } from '@/components/layout/Footer'

/** 主页展示数量：一屏 6-8 张 → PC 三列取 9 张（3 行），其余去列表页看 */
const HOME_LIMIT = 9

export default function HomePage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  // 搜索提交 → 跳转筛选列表页并带上关键词
  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = keyword.trim()
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore')
  }

  // 主页卡片：综合推荐排序后取前 9 张
  const featured = [...PROVIDERS]
    .sort(
      (a, b) =>
        b.rating * Math.log10(b.completedOrders + 10) - a.rating * Math.log10(a.completedOrders + 10),
    )
    .slice(0, HOME_LIMIT)

  return (
    <div>
      {/* ========== 模块 1：Hero + 一句话需求搜索栏 ========== */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        {/* 科技感装饰光斑 */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-16 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-medium text-primary">
            <Sparkles size={13} />
            {PROVIDERS.length} 位认证接单人已入驻 · 覆盖 {CATEGORIES.length} 大服务模块
          </span>
          <h1 className="mt-4 text-2xl font-bold leading-snug tracking-tight sm:text-4xl">
            找专业的人，装好你的 AI
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Agent 部署 · Skill 安装 · AI 培训 · 工作流搭建 —— 按地区、报价、口碑筛选，一目了然
          </p>

          {/* 一句话需求搜索框 */}
          <form onSubmit={onSearch} className="mx-auto mt-6 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-12 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-card placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder='试着输入你的需求，如"我想给公司装个 AI 客服"'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="shrink-0">
              搜索
            </Button>
          </form>

          {/* 热门搜索词 */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>热门：</span>
            {HOT_SEARCHES.map((word) => (
              <Link
                key={word}
                to={`/explore?q=${encodeURIComponent(word)}`}
                className="rounded-full bg-card px-2.5 py-1 shadow-sm transition-colors hover:text-primary"
              >
                {word}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 模块 2：擅长模块分类标签导航 ========== */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <CategoryTabs />
      </section>

      {/* ========== 模块 3：接单人卡片瀑布流（核心区域） ========== */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">优质接单人</h2>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              按综合口碑推荐 · 每位接单人均通过平台人工审核
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            查看全部 {PROVIDERS.length} 位
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* 卡片网格：手机单列 / 平板两列 / PC 三列 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>

        {/* 移动端也保留入口 */}
        <div className="mt-6 text-center lg:hidden">
          <Link to="/explore">
            <Button variant="outline">
              查看全部 {PROVIDERS.length} 位接单人
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ========== 模块 4：平台信任背书条 ========== */}
      <TrustBar />

      {/* 接单人招募 CTA */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-sky-400/10 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-lg font-bold">你是 AI 部署 / 培训的专业人士？</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              免费入驻，展示专业卡片，平台帮你对接真实订单 · {categoryLabel('agent')} 等
              {' '}
              {CATEGORIES.length} 大模块均可入驻
            </p>
          </div>
          <Link to="/join" className="shrink-0">
            <Button size="lg">
              我要入驻接单
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
