/**
 * 入驻申请页 /join
 * 表单：身份信息、擅长模块、可验证案例链接、报价区间、简介
 * MVP：提交到 localStorage 暂存（模拟），提示人工审核
 */
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ShieldCheck, Lock, ClipboardCheck, FileText } from 'lucide-react'
import { CATEGORIES } from '@/data/constants'
import { Input, Textarea, Select, Label } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** 入驻申请表单数据结构（二阶段将提交到云数据库 / 表单服务） */
interface JoinForm {
  name: string
  contact: string
  identity: string
  region: string
  categories: string[]
  priceMin: string
  priceMax: string
  caseLink1: string
  caseLink2: string
  intro: string
  agree: boolean
}

const EMPTY_FORM: JoinForm = {
  name: '',
  contact: '',
  identity: '个人',
  region: '',
  categories: [],
  priceMin: '',
  priceMax: '',
  caseLink1: '',
  caseLink2: '',
  intro: '',
  agree: false,
}

export default function JoinPage() {
  const [form, setForm] = useState<JoinForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof JoinForm, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (patch: Partial<JoinForm>) => setForm((f) => ({ ...f, ...patch }))

  /** 擅长模块多选（2-4 个） */
  const toggleCategory = (key: string) => {
    setForm((f) => {
      const has = f.categories.includes(key)
      const next = has ? f.categories.filter((c) => c !== key) : [...f.categories, key]
      return { ...f, categories: next }
    })
  }

  /** 简单校验 */
  const validate = (): boolean => {
    const e: Partial<Record<keyof JoinForm, string>> = {}
    if (!form.name.trim()) e.name = '请填写姓名或昵称'
    if (!/^1\d{10}$|^[\w-]{4,20}$/.test(form.contact.trim()))
      e.contact = '请填写 11 位手机号或微信号'
    if (!form.region.trim()) e.region = '请填写所在地区'
    if (form.categories.length < 2) e.categories = '请至少选择 2 个擅长模块（最多 4 个）'
    if (form.categories.length > 4) e.categories = '最多选择 4 个擅长模块'
    const min = Number(form.priceMin)
    const max = Number(form.priceMax)
    if (!min || !max || min < 100) e.priceMin = '报价下限至少 100 元'
    else if (max <= min) e.priceMax = '报价上限需大于下限'
    if (!form.caseLink1.trim()) e.caseLink1 = '请至少提供 1 个可验证案例链接'
    if (!form.intro.trim() || form.intro.trim().length < 10) e.intro = '简介至少 10 个字，说说你能提供什么服务'
    if (!form.agree) e.agree = '请阅读并同意入驻规则'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    // MVP：本地暂存（模拟提交），二阶段替换为表单服务/云函数
    try {
      const list = JSON.parse(localStorage.getItem('join_applications') ?? '[]')
      list.push({ ...form, submittedAt: new Date().toISOString() })
      localStorage.setItem('join_applications', JSON.stringify(list))
    } catch {
      /* localStorage 不可用时忽略（隐私模式等），不影响演示 */
    }
    setSubmitted(true)
    window.scrollTo({ top: 0 })
  }

  // ===== 提交成功态 =====
  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center p-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={32} />
            </span>
            <h1 className="mt-4 text-xl font-bold">入驻申请已提交</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              平台将在 <span className="font-semibold text-foreground">3 个工作日内</span> 完成人工审核，
              审核内容包括：实名信息、案例真实性、报价合理性。结果将通过你留下的联系方式通知你。
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => { setForm(EMPTY_FORM); setSubmitted(false) }}>
                再提交一份
              </Button>
              <Link to="/"><Button>回首页</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ===== 表单态 =====
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">我要入驻</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          免费入驻 · 平台审核通过后上架你的专属卡片，开始接单
        </p>
      </div>

      {/* 入驻流程提示 */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { icon: FileText, label: '提交资料' },
          { icon: ShieldCheck, label: '实名审核' },
          { icon: ClipboardCheck, label: '案例核验' },
          { icon: Lock, label: '上架接单' },
        ].map(({ icon: Icon, label }, i) => (
          <div key={label} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <Icon size={15} className="shrink-0 text-muted-foreground" />
            <span className="truncate">{label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} noValidate>
        <Card>
          <CardContent className="space-y-5 p-5 sm:p-6">
            {/* 身份信息 */}
            <fieldset className="space-y-4">
              <legend className="mb-1 text-sm font-bold text-foreground">① 身份信息</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">姓名 / 昵称 *</Label>
                  <Input
                    id="name"
                    placeholder="将展示在卡片上的昵称"
                    value={form.name}
                    onChange={(e) => set({ name: e.target.value })}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="contact">手机号 / 微信号 *</Label>
                  <Input
                    id="contact"
                    placeholder="用于审核结果通知（不对外展示）"
                    value={form.contact}
                    onChange={(e) => set({ contact: e.target.value })}
                  />
                  {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="identity">身份类型</Label>
                  <Select id="identity" value={form.identity} onChange={(e) => set({ identity: e.target.value })}>
                    <option>个人</option>
                    <option>团队 / 工作室</option>
                    <option>公司</option>
                  </Select>
                </div>
                <div>
                  <Label>所在地区 *</Label>
                  <Input
                    placeholder="如：宁波"
                    value={form.region ?? ''}
                    onChange={(e) => set({ region: e.target.value })}
                  />
                  {errors.region && <p className="mt-1 text-xs text-red-600">{errors.region}</p>}
                </div>
              </div>
            </fieldset>

            {/* 擅长模块 */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-foreground">② 擅长模块 *（选 2-4 个）</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ key, label }) => {
                  const active = form.categories.includes(key)
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleCategory(key)}
                      className={cn(
                        'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                        active
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary',
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {errors.categories && <p className="mt-1.5 text-xs text-red-600">{errors.categories}</p>}
            </fieldset>

            {/* 报价区间 */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-foreground">③ 报价区间（元/单）*</legend>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="下限，如 500"
                  value={form.priceMin}
                  onChange={(e) => set({ priceMin: e.target.value })}
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="上限，如 3000"
                  value={form.priceMax}
                  onChange={(e) => set({ priceMax: e.target.value })}
                />
              </div>
              {errors.priceMin && <p className="mt-1 text-xs text-red-600">{errors.priceMin}</p>}
              {errors.priceMax && <p className="mt-1 text-xs text-red-600">{errors.priceMax}</p>}
            </fieldset>

            {/* 案例链接 */}
            <fieldset className="space-y-4">
              <legend className="mb-1 text-sm font-bold text-foreground">④ 可验证案例链接 *（至少 1 个）</legend>
              <div>
                <Label htmlFor="case1">案例 1</Label>
                <Input
                  id="case1"
                  placeholder="https:// 你的案例地址（作品、文章、店铺链接均可）"
                  value={form.caseLink1}
                  onChange={(e) => set({ caseLink1: e.target.value })}
                />
                {errors.caseLink1 && <p className="mt-1 text-xs text-red-600">{errors.caseLink1}</p>}
              </div>
              <div>
                <Label htmlFor="case2">案例 2（选填，多多益善）</Label>
                <Input
                  id="case2"
                  placeholder="https://"
                  value={form.caseLink2}
                  onChange={(e) => set({ caseLink2: e.target.value })}
                />
              </div>
            </fieldset>

            {/* 简介 */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-foreground">⑤ 一句话简介 *</legend>
              <Textarea
                placeholder="例如：8 年后端转型，专帮企业把 AI 客服跑进真实业务（将展示在卡片上）"
                value={form.intro}
                onChange={(e) => set({ intro: e.target.value })}
              />
              {errors.intro && <p className="mt-1 text-xs text-red-600">{errors.intro}</p>}
            </fieldset>

            {/* 同意条款 */}
            <div>
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                  checked={form.agree}
                  onChange={(e) => set({ agree: e.target.checked })}
                />
                <span className="text-muted-foreground">
                  我已阅读并同意
                  <Link to="/about" className="mx-1 font-medium text-primary hover:underline">
                    《平台入驻规则》
                  </Link>
                  ，理解平台将对我的资料进行人工审核，并愿意在通过审核后缴纳履约保证金。
                </span>
              </label>
              {errors.agree && <p className="mt-1 text-xs text-red-600">{errors.agree}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="mt-5 flex justify-center">
          <Button type="submit" size="lg" className="w-full sm:w-auto sm:px-16">
            提交入驻申请
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          提交即视为同意平台人工审核 · 审核通过前不会公开展示你的信息
        </p>
      </form>
    </div>
  )
}
