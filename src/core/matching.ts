import type { Ism } from './content'

export interface IsmMatch {
  ismId: string
  constructId: string
  match: number
  rank: number
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v))

/**
 * 余弦匹配（spec §5.1：保留原始余弦，不做白化或中心化 —— 实测更优）。
 * 用户向量与主义轮廓都按 L2 归一化；主义未声明的维度按 0 参与点积。
 * match = ((cos + 1) / 2) * 100，落在 [0, 100]。
 */
export function matchIsms(isms: Ism[], dims: Record<string, number>): IsmMatch[] {
  let userSq = 0
  for (const v of Object.values(dims)) userSq += v * v
  const userNorm = Math.sqrt(userSq)

  const scored: IsmMatch[] = isms.map((ism) => {
    let dot = 0
    let ismSq = 0
    for (const [dim, weight] of Object.entries(ism.profile)) {
      dot += (dims[dim] ?? 0) * weight
      ismSq += weight * weight
    }
    const ismNorm = Math.sqrt(ismSq)
    const denom = userNorm * ismNorm
    const cos = denom > 0 ? dot / denom : 0
    return {
      ismId: ism.id,
      constructId: ism.constructId,
      match: clamp(((cos + 1) / 2) * 100, 0, 100),
      rank: 0,
    }
  })

  const groups = new Map<string, IsmMatch[]>()
  for (const s of scored) {
    const g = groups.get(s.constructId)
    if (g) g.push(s)
    else groups.set(s.constructId, [s])
  }
  for (const g of groups.values()) {
    g.sort((a, b) => b.match - a.match || a.ismId.localeCompare(b.ismId))
    g.forEach((item, i) => { item.rank = i + 1 })
  }

  return scored
}

export type ConfidenceLevel = 'high' | 'moderate' | 'low'

export interface Confidence {
  level: ConfidenceLevel
  reasonKey: string
  /** 最弱构念的判定量（保守代表） */
  decisiveness: number
}

export interface ConstructConfidence {
  constructId: string
  level: ConfidenceLevel
  decisiveness: number
}

/**
 * 判定量阈值。**校准对象是「单构念判定量」**（Task 7 的分桶表即按此统计量测得）：
 *
 *   各桶 z 上界   0.067 | 0.182 | 0.717 | 1.422 | 2.225
 *   各桶恢复率    0.552 | 0.813 | 0.927 | 1.000 | 1.000
 *
 * 恢复率跃升最大的两处位于 z ≈ 0.067（+0.261）与 z ≈ 0.717（+0.073）。
 *
 * ⚠️ 这两个常数**不可**直接套用到跨构念最小值上：K 个构念取最小是一个随 K 单调收缩的
 * 统计量（实测 K=3 中位数 0.109、K=10×10 仅 0.014），套用会让 high 永不可达。
 * 因此全局 level 由**各构念 level 的分布**决定，而不是由最小值过阈值决定。
 * 改这两个常数要重跑夺冠率回归：低噪声下 3 个种子的均值须 ≥ 0.92，单种子 ≥ 0.90。
 */
export const DECISIVENESS_LOW = 0.07
export const DECISIVENESS_HIGH = 0.72

/** 作答完整度低于此值即视为覆盖不足 */
export const MIN_ANSWERED_RATIO = 0.9

function decisivenessOf(scores: number[]): number {
  if (scores.length < 2) return 0
  const sorted = [...scores].sort((a, b) => b - a)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const sd = Math.sqrt(scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length)
  return sd > 0 ? (sorted[0]! - sorted[1]!) / sd : 0
}

/**
 * 把判定量映射成三档。导出是为了让界面用**同一把尺子**给每个候选项标置信度 ——
 * 界面自己再定一套阈值就会和引擎的结论打架。
 */
export function levelOf(z: number): ConfidenceLevel {
  if (z >= DECISIVENESS_HIGH) return 'high'
  if (z <= DECISIVENESS_LOW) return 'low'
  return 'moderate'
}

/**
 * 单条候选项的判定量：**它比紧随其后的那一条高出多少**，按构念内标准差归一。
 *
 * 与 `decisivenessOf` 是同一个公式（只是把"前两名"换成"第 i 名与其后一名"），
 * 这样冠军的档位与 `computeConstructConfidences` 的结论完全一致 ——
 * 界面不需要（也不应该）自带一套阈值。
 *
 * 最后一名没有后继，返回 0（即 low）：它后面确实没有可比较的对象。
 */
export function decisivenessOfCandidate(scores: number[], index: number): number {
  if (index < 0 || index >= scores.length - 1) return 0
  const gap = scores[index]! - scores[index + 1]!
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const sd = Math.sqrt(scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length)
  return sd > 0 ? gap / sd : 0
}

/** 单构念判定量：(m1 - m2) / sd(构念内全部分数)。阈值在此统计量上校准。 */
export function computeConstructDecisiveness(matches: IsmMatch[], constructId: string): number {
  return decisivenessOf(matches.filter((m) => m.constructId === constructId).map((m) => m.match))
}

/** 逐构念置信度。这是唯一有标定依据的口径，UI 应据此指出「哪一维是接近的竞争」。 */
export function computeConstructConfidences(matches: IsmMatch[]): ConstructConfidence[] {
  const ids = [...new Set(matches.map((m) => m.constructId))]
  return ids.map((constructId) => {
    const decisiveness = computeConstructDecisiveness(matches, constructId)
    return { constructId, level: levelOf(decisiveness), decisiveness }
  })
}

/**
 * 跨构念最小值 —— 尺度无关的"最弱环节"判定量。
 * 注意它随构念数单调收缩，只适合作保守代表数字，**不可**直接过 DECISIVENESS_* 阈值。
 */
export function computeDecisiveness(matches: IsmMatch[]): number {
  const per = computeConstructConfidences(matches)
  return per.length > 0 ? Math.min(...per.map((c) => c.decisiveness)) : 0
}

/**
 * 全局置信度：由各构念 level 的**分布**决定，而非由最小值过阈值决定。
 * 十个领域里九个清楚、一个接近，诚实的说法是 moderate 并指出那一维，而不是整体 low。
 */
export function computeConfidence(matches: IsmMatch[], answeredRatio: number): Confidence {
  const per = computeConstructConfidences(matches)
  const decisiveness = per.length > 0 ? Math.min(...per.map((c) => c.decisiveness)) : 0

  if (answeredRatio < MIN_ANSWERED_RATIO) {
    return {
      level: decisiveness >= DECISIVENESS_HIGH ? 'moderate' : 'low',
      reasonKey: 'confidence.reason.lowCoverage',
      decisiveness,
    }
  }
  if (per.length === 0) {
    return { level: 'low', reasonKey: 'confidence.reason.closeCall', decisiveness }
  }
  if (per.every((c) => c.level === 'high')) {
    return { level: 'high', reasonKey: 'confidence.reason.clear', decisiveness }
  }
  const lowCount = per.filter((c) => c.level === 'low').length
  if (lowCount * 2 > per.length) {
    return { level: 'low', reasonKey: 'confidence.reason.closeCall', decisiveness }
  }
  return { level: 'moderate', reasonKey: 'confidence.reason.partialCloseCall', decisiveness }
}
