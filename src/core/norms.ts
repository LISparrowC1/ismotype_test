import type { BigFiveDomain } from './content'

/**
 * 一张常模表。`percentiles` 的键是**原始分**（尺度由 rawMin/rawMax 说明），
 * 值是 0–100 的百分位。
 *
 * 不存"均值/标准差"而存"原始分 → 百分位"的直接映射，是因为后者不需要假设分布形状：
 * IPIP 各维的分布并不严格正态，用 μ/σ 反推百分位会引入一层未经检验的假设。
 */
export interface NormTable {
  source: string
  citationUrl: string
  sample: string
  rawMin: number
  rawMax: number
  percentiles: Record<number, number>
}

export interface Norms {
  version: string
  /** 语言 → 该语言的常模。缺该语言即该语言下所有维度都是 null */
  locales: Record<string, { note: string; tables: Partial<Record<BigFiveDomain, NormTable>> }>
}

/**
 * 空常模。**本计划落地为这个值**（spec R1：中文常模可用性未知）。
 * 接入常模时只替换 JSON 数据，不改任何代码。
 */
export const EMPTY_NORMS: Norms = { version: 'v1', locales: {} }

export function normTableFor(norms: Norms, locale: string, domain: BigFiveDomain): NormTable | null {
  return norms.locales[locale]?.tables[domain] ?? null
}

/**
 * 查百分位。**没有表就返回 null**——调用方（UI）据此降级为定性区间。
 * 绝不返回一个"看起来像百分位"的猜测值：spec §4.6 明确 `null` 表示缺常模。
 *
 * 三种情况必须返回 `null`：
 * · 缺该语言 / 该维度的表，或表是空的
 * · `raw = 0`：这是"一题未答"的哨兵值（见 `BigFiveScore.raw`），**不是最低分**
 * · `raw` 落在表自己声明的量程 `[rawMin, rawMax]` 之外 —— 夹到端点等于外推，
 *   而没有数据支持的外推就是编造
 *
 * 表内两格之间取"不超过 raw 的最近一格"（宁可低估，也不给没有依据的更高分位）。
 * 表未声明量程时不猜边界，只按表内取值判断。
 */
export function percentileOf(
  norms: Norms, locale: string, domain: BigFiveDomain, raw: number,
): number | null {
  const table = normTableFor(norms, locale, domain)
  if (!table) return null
  if (!Number.isFinite(raw) || raw <= 0) return null
  const { rawMin, rawMax } = table
  const hasRange = Number.isFinite(rawMin) && Number.isFinite(rawMax) && rawMax >= rawMin
  if (hasRange && (raw < rawMin || raw > rawMax)) return null

  const keys = Object.keys(table.percentiles).map(Number).sort((a, b) => a - b)
  const lowest = keys[0]
  const highest = keys[keys.length - 1]
  if (lowest === undefined || highest === undefined) return null
  if (raw <= lowest) return table.percentiles[lowest]!
  if (raw >= highest) return table.percentiles[highest]!
  // 取不超过 raw 的最近一格：不外推，宁可低估也不给没有依据的更高分位
  let chosen = lowest
  for (const k of keys) if (k <= raw) chosen = k
  return table.percentiles[chosen]!
}
