/** 首字母渐变头像（本地渲染，不依赖外网图片） */
import { cn } from '@/lib/utils'

export function Avatar({
  name,
  hue,
  size = 'md',
  className,
}: {
  name: string
  hue: number
  size?: 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizes = { md: 'h-11 w-11 text-lg', lg: 'h-14 w-14 text-xl', xl: 'h-20 w-20 text-3xl' }
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white',
        sizes[size],
        className,
      )}
      // 用色相生成同色系渐变底 + 深色文字更清晰，这里用白字 + 中等饱和度
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 45%))`,
      }}
    >
      {name.slice(0, 1)}
    </span>
  )
}

/** 案例缩略图：渐变底 + 标题首字（本地渲染） */
export function CaseThumb({ title, hue }: { title: string; hue: number }) {
  return (
    <div
      className="flex h-28 w-full items-center justify-center rounded-md text-2xl font-bold text-white/95"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 60% 60%), hsl(${(hue + 50) % 360} 55% 42%))`,
      }}
    >
      {title.slice(0, 2)}
    </div>
  )
}
