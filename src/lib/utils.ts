/** 通用工具函数 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 合并 Tailwind 类名（shadcn/ui 惯例） */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 报价区间格式化：¥500-2000/单 */
export function formatPrice(min: number, max: number): string {
  return `¥${min.toLocaleString()}-${max.toLocaleString()}/单`
}

/** 好评率文案：98% */
export function formatRating(rating: number): string {
  return `${rating}%`
}

/**
 * 根据字符串生成稳定的色相值（0-360），
 * 用于头像/缩略图的渐变底色，保证同一数据每次渲染颜色一致。
 */
export function hueFromString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 360
  }
  return hash
}
