/**
 * 平台规则页 /about
 * 平台介绍 + 信任与风控机制（实名认证 / 保证金 / 案例审核 / 资金托管 / 信用评级）+ 入驻门槛 + FAQ
 * 文案依据：项目策划书 3.5 节（信任与风控机制）、5.4 节（入驻门槛）
 */
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Coins, ClipboardCheck, Lock, Award, ArrowRight, Handshake,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 平台介绍 */}
      <header className="mb-10 text-center">
        <h1 className="text-xl font-bold sm:text-2xl">关于平台</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          AI Agent 服务对接平台是一个「AI Agent 服务黄页 + 撮合市场」：连接想用 AI Agent
          却不会装、不知找谁、怕被坑的需求方，与会部署、会培训、有真实交付能力的专业接单人。
          平台只做一件事：<span className="font-medium text-foreground">让信任可验证，让服务可追溯</span>。
        </p>
      </header>

      {/* 信任与风控机制 */}
      <section>
        <h2 className="mb-4 text-lg font-bold">信任与风控机制（平台立足之本）</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              icon: ShieldCheck,
              title: '实名认证',
              desc: '接单人 100% 实名认证，平台人工逐一审核身份与职业资料，杜绝"三无"服务方。',
            },
            {
              icon: Coins,
              title: '保证金制度',
              desc: '接单人需缴纳 500-1000 元履约保证金。发生违约时双倍赔付、平台扣减，先赔付后追责。',
            },
            {
              icon: ClipboardCheck,
              title: '资质审核 + 案例验证',
              desc: '入驻必须提供可验证的已完成案例，平台抽样核验真实性，虚假案例一票否决并永久拉黑。',
            },
            {
              icon: Lock,
              title: '资金托管',
              desc: '需求方先付款到平台，验收通过再放款给接单人；交易有纠纷时平台介入仲裁。',
            },
            {
              icon: Award,
              title: '信用评级 + 徽章体系',
              desc: '好评率、完成单数、认证等级直接展示在卡片上，信用资产全透明。',
            },
            {
              icon: Handshake,
              title: '不满意可投诉',
              desc: '任何一单不满意都可以发起投诉，平台 48 小时内响应，先处理问题再划分责任。',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="flex gap-3 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 入驻门槛 */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold">入驻门槛（宁缺毋滥）</h2>
        <Card>
          <CardContent className="p-5 sm:p-6">
            <p className="text-sm text-muted-foreground">
              为保护平台口碑，入驻者必须全部满足以下 5 项条件，缺一不可：
            </p>
            <ol className="mt-4 space-y-3">
              {[
                '实名认证 + 基础资料（身份证 / 职业信息）',
                '至少 2 个可验证的已完成案例（链接或截图，平台抽查）',
                '填写擅长模块与报价区间，平台按市场行情审核定价合理性',
                '缴纳保证金（500-1000 元），作为履约保障',
                '通过一次平台「试单」或技能自评（如：能说出某常见 Agent 的部署流程）',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-6">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* 资金托管流程 */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold">资金托管流程</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {[
            { step: '1', title: '需求方下单', desc: '确认方案后付款至平台' },
            { step: '2', title: '平台托管', desc: '资金由平台冻结保管' },
            { step: '3', title: '交付验收', desc: '接单人交付，需求方验收' },
            { step: '4', title: '验收放款', desc: '验收通过后放款给接单人' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="rounded-lg border border-border bg-card p-4 shadow-card">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {step}
              </span>
              <h3 className="mt-2.5 text-sm font-semibold">{title}</h3>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold">常见问题</h2>
        <div className="space-y-3">
          {[
            {
              q: '入驻收费吗？',
              a: '第一阶段入驻免费。平台冷启动期间以积累优质供给为主，未来认证升级、置顶推广等增值服务另行公示。',
            },
            {
              q: '需求方怎么付款？现在能在线下单吗？',
              a: '第一阶段（MVP）以「信息展示 + 平台客服撮合」为主，在线下单与资金托管支付将于第二阶段上线，届时交易资金全程平台托管。',
            },
            {
              q: '对接单人怎么收费？',
              a: '平台按撮合成交收取 5%-10% 佣金（按单量阶梯下调），未成交不收费。报价、合同细节均双方直接沟通确认。',
            },
            {
              q: '遇到纠纷怎么办？',
              a: '平台先介入调解；涉及资金的按托管规则处理，重大违约扣除保证金赔付需求方，并对违规接单人下架拉黑。',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group rounded-lg border border-border bg-card p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                <span className="mr-2 text-primary group-open:hidden">＋</span>
                <span className="mr-2 hidden text-primary group-open:inline">－</span>
                {q}
              </summary>
              <p className="mt-2 pl-5 text-sm leading-6 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 flex flex-col items-center gap-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-sky-400/10 px-6 py-8 text-center">
        <h2 className="text-lg font-bold">准备好了吗？</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          会部署、会培训、有真实交付能力，就欢迎入驻；想找人装 AI，先去逛逛接单人卡片。
        </p>
        <div className="flex gap-3">
          <Link to="/join"><Button>我要入驻</Button></Link>
          <Link to="/explore">
            <Button variant="outline">
              找服务 <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
