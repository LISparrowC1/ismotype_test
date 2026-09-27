import type { Question } from './content'
import type { Taxonomy } from './taxonomy'

/** 主义层六点量表权重（spec §5.1） */
export const OPTION_WEIGHTS = [2.5, 1.5, 0.5, -0.5, -1.5, -2.5] as const
export const OPTION_COUNT = OPTION_WEIGHTS.length
export const MAX_OPTION_MAGNITUDE = Math.max(...OPTION_WEIGHTS.map((w) => Math.abs(w)))

/**
 * IPIP-50 的五点量表（原格式，不可改，否则常模失效 —— spec §5.3）。
 *
 * 值是 IPIP 原始的 1–5：`1 = Very Inaccurate` … `5 = Very Accurate`。
 * 该数组与 `OPTION_WEIGHTS` 一样是**按选项索引**排列的，故索引 0 → 1。
 *
 * 早先这里是 `[2,1,0,-1,-2]`，等于把 IPIP 的五点从另一头数（索引 0 → +2），
 * 后果是 raw 落在 [-20,20] 而非可查常模的 10–50，任何常模表都得先做仿射换算才能用。
 */
export const IPIP_OPTION_WEIGHTS = [1, 2, 3, 4, 5] as const
export const IPIP_OPTION_COUNT = IPIP_OPTION_WEIGHTS.length

/**
 * MBTI 风格层的七点量表，取值 +3…−3，**索引 0 是最同意**（与源站的七点量表对齐）。
 *
 * 方向口径与另外两层一致：**索引 0 = 最同意**（主义层的 `OPTION_WEIGHTS[0] = +2.5` 也是最同意）。
 * 本层是"同意 / 不同意"量表，所以"同意"落在负值一侧的写法会让整层判反 ——
 * 「你经常结交新朋友」选"非常同意"必须把该维推向**外向**，而题目自己说的方向由
 * `Question.reversed` 承担（`raw += reversed ? -value : value`）。
 *
 * 与 IPIP 的 1–5 是两套口径，不能混：
 * · IPIP 的 raw 必须留在 10–50 以便查常模，所以它是**无符号**的 1–5，索引 0 是最不准确；
 * · 本层是平衡键（每维正反措辞都有），必须**有符号且以 0 为中性点**，
 *   否则 12 题的合计恒为正、按符号定字母会把所有人判成同一侧。
 *
 * 改点数会同时废掉百分比口径（`Math.ceil(score/2)+50`，见 `mbtiPoleShare`）与源站的可比性。
 */
export const MBTI_OPTION_VALUES = [3, 2, 1, 0, -1, -2, -3] as const
export const MBTI_OPTION_COUNT = MBTI_OPTION_VALUES.length
/** 单题最大强度。该维满分 = 它 × 作答数（见 `tallyMbtiDimensions`）。 */
export const MBTI_MAX_MAGNITUDE = 3

/**
 * 打平定向题的权重，按"相当于多少强度的一题"计。
 *
 * 取**半个满强度**：定向题只用来断平局，不是一次测量，所以刻意只给一半分量 ——
 * 它刚好把 0 变成最小的非零分，又不足以压过用户真答过的那 12 题。
 *
 * 必须是 1.5 而不是 1：源站的 `Math.ceil(score/2)+50` 在 `raw = ±1.5`、满分 37.5 时
 * 两个方向都得 52%，而取 1 会得到 52% / 51% —— 两向不对称，等于让"选左边"比"选右边"
 * 多显示一个百分点。
 */
export const MBTI_TIEBREAK_WEIGHT = 1.5

export interface Calibration {
  taxonomyVersion: string
  optionWeights: readonly number[]
  /** 每个子维度的实测可达上限；由题库推导，绝不硬编码 */
  dimCeiling: Record<string, number>
  /** 每个构念的可达上限 = 其子维度量程之和 */
  constructCeiling: Record<string, number>
}

export function deriveCalibration(taxonomy: Taxonomy, questions: Question[]): Calibration {
  const dimCeiling: Record<string, number> = {}
  for (const c of taxonomy.constructs) {
    for (const f of c.facets) dimCeiling[f.id] = 0
  }

  for (const q of questions) {
    if (q.layer !== 'ideology' || !q.loadings) continue
    for (const l of q.loadings) {
      // Object.hasOwn 而非 `in`：`in` 会走原型链，畸形数据里的 'constructor' 会被
      // 当成已有子维度（M3）。
      if (!Object.hasOwn(dimCeiling, l.dim)) continue
      dimCeiling[l.dim] = (dimCeiling[l.dim] ?? 0) + Math.abs(l.weight) * MAX_OPTION_MAGNITUDE
    }
  }

  const constructCeiling: Record<string, number> = {}
  for (const c of taxonomy.constructs) {
    constructCeiling[c.id] = c.facets.reduce((sum, f) => sum + (dimCeiling[f.id] ?? 0), 0)
  }

  return {
    taxonomyVersion: taxonomy.version,
    optionWeights: OPTION_WEIGHTS,
    dimCeiling,
    constructCeiling,
  }
}
