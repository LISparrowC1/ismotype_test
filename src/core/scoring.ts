import {
  MBTI_MAX_MAGNITUDE, MBTI_OPTION_COUNT, MBTI_OPTION_VALUES, MBTI_TIEBREAK_WEIGHT,
  OPTION_COUNT, OPTION_WEIGHTS,
  IPIP_OPTION_COUNT, IPIP_OPTION_WEIGHTS,
  type Calibration,
} from './calibration'
import {
  BIG_FIVE_DOMAINS, MBTI_CODE_DIMENSIONS, MBTI_DIMENSIONS, MBTI_POLES, MBTI_VARIANT_DIMENSION,
  type BigFiveDomain, type MbtiDimension, type Question,
} from './content'
import type { Taxonomy } from './taxonomy'

export interface Answer {
  questionId: string
  option: number
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v))

function isValidOption(option: number): boolean {
  return Number.isInteger(option) && option >= 0 && option < OPTION_COUNT
}

/**
 * 主义层：把作答累加为各子维度原始分，再按标定量程归一化到 [-1, 1]。
 * 未作答 / 非法 option / 未知题目一律忽略；零量程维度返回 0（不产生 NaN）。
 */
export function scoreDimensions(
  taxonomy: Taxonomy,
  questions: Question[],
  answers: Answer[],
  calibration: Calibration,
): Record<string, number> {
  const raw: Record<string, number> = {}
  for (const c of taxonomy.constructs) {
    for (const f of c.facets) raw[f.id] = 0
  }

  const byId = new Map(questions.map((q) => [q.id, q]))
  for (const a of answers) {
    const q = byId.get(a.questionId)
    if (!q || q.layer !== 'ideology' || !q.loadings) continue
    if (!isValidOption(a.option)) continue
    const w = OPTION_WEIGHTS[a.option]!
    for (const l of q.loadings) {
      // Object.hasOwn 而非 `in`：`in` 会走原型链，畸形载荷里的 'constructor'
      // 会被当成已有子维度（M3）。
      if (Object.hasOwn(raw, l.dim)) raw[l.dim] = (raw[l.dim] ?? 0) + l.weight * w
    }
  }

  const normalized: Record<string, number> = {}
  for (const [dim, value] of Object.entries(raw)) {
    const ceiling = calibration.dimCeiling[dim] ?? 0
    normalized[dim] = ceiling > 0 ? clamp(value / ceiling, -1, 1) : 0
  }
  return normalized
}

function isValidIpipOption(option: number): boolean {
  return Number.isInteger(option) && option >= 0 && option < IPIP_OPTION_COUNT
}

function isValidMbtiOption(option: number): boolean {
  return Number.isInteger(option) && option >= 0 && option < MBTI_OPTION_COUNT
}

function accumulate(
  questions: Question[],
  answers: Answer[],
  layer: 'bigfive' | 'mbti',
): Map<string, number> {
  const totals = new Map<string, number>()
  const byId = new Map(questions.map((q) => [q.id, q]))
  for (const a of answers) {
    const q = byId.get(a.questionId)
    if (!q || q.layer !== layer) continue
    if (!isValidIpipOption(a.option)) continue
    const facet = q.facet
    if (!facet) continue
    // IPIP 的 - keyed 题按 6 - 值 翻转：值 ∈ [1,5] ⇒ 6 - 值 ∈ [1,5]，尺度不变
    const value = IPIP_OPTION_WEIGHTS[a.option]!
    totals.set(facet, (totals.get(facet) ?? 0) + (q.reversed ? 6 - value : value))
  }
  return totals
}

/**
 * IPIP 五点量表：每维 10 题，raw = 每题得分之和，取值 10–50（与公开常模同尺度）。
 * 反向题按 `6 - 值` 翻转；未作答与越界选项一律忽略。
 *
 * **一题未答的维度返回 0** —— 0 落在 10–50 之外，是"未测量"的哨兵值。
 * UI 必须据此降级，不得把 0 显示成"最低分"。
 */
export function scoreBigFive(questions: Question[], answers: Answer[]): Record<BigFiveDomain, number> {
  const totals = accumulate(questions, answers, 'bigfive')
  const out = {} as Record<BigFiveDomain, number>
  for (const domain of BIG_FIVE_DOMAINS) out[domain] = totals.get(domain) ?? 0
  return out
}

/** 某一维的作答合计。`raw` 有符号，正数偏向左极（E / N / T / J / A）。 */
export interface MbtiDimensionTally {
  raw: number
  /** 该维实际作答了几题（满编 12） */
  answered: number
  /**
   * 该维满分 = `MBTI_MAX_MAGNITUDE × answered`（满编 36）。
   * 加了定向题后按定向题的权重累加，故可能是 37.5 这样的半整数。
   */
  maxRaw: number
}

/** 一次打平定向：用户在该维的两个选项里选了一边。 */
export interface MbtiTieBreak {
  dimension: MbtiDimension
  /** 1 = 选了左极选项，2 = 选了右极选项 */
  pole: 1 | 2
}

export const MBTI_TALLIES_EMPTY = (): Record<MbtiDimension, MbtiDimensionTally> => {
  const out = {} as Record<MbtiDimension, MbtiDimensionTally>
  for (const dim of MBTI_DIMENSIONS) out[dim] = { raw: 0, answered: 0, maxRaw: 0 }
  return out
}

/**
 * MBTI 风格层逐维合计。
 *
 * **不做"未答满就不给分"的硬判定** —— 那要产品裁定，且与"中途退出也该看到部分结果"
 * 冲突。这里只如实记录答了几题，满分按作答数缩放（答 6 题则满分 18，不会因为少答
 * 就被算成偏中间）。
 *
 * `tieBreaks` 是打平后补答的定向题：选项 1 贡献 `+MBTI_TIEBREAK_WEIGHT`、选项 2 贡献
 * 负值，满分同步加 `MBTI_TIEBREAK_WEIGHT`。同一维多次定向只取最后一次。
 */
export function tallyMbtiDimensions(
  questions: Question[],
  answers: Answer[],
  tieBreaks: readonly MbtiTieBreak[] = [],
): Record<MbtiDimension, MbtiDimensionTally> {
  const out = MBTI_TALLIES_EMPTY()
  const byId = new Map(questions.map((q) => [q.id, q]))
  for (const a of answers) {
    const q = byId.get(a.questionId)
    if (!q || q.layer !== 'mbti') continue
    if (!isValidMbtiOption(a.option)) continue
    const dim = q.facet as MbtiDimension
    if (!MBTI_DIMENSIONS.includes(dim)) continue
    const t = out[dim]
    // 有符号：索引 0 是"非常同意"= +3，索引 6 是"非常不同意"= −3，
    // 方向再由题目自己承担（`reversed` 的题同意它推向另一极）。
    // **不要写成 `a.option - 3`** —— 那会让索引 0（非常同意）落到 −3，
    // 整层判反：「你经常结交新朋友」选"非常同意"会把人判成内向。
    const value = MBTI_OPTION_VALUES[a.option]!
    t.raw += q.reversed ? -value : value
    t.answered += 1
    t.maxRaw += MBTI_MAX_MAGNITUDE
  }

  const applied = new Map<MbtiDimension, 1 | 2>()
  for (const tb of tieBreaks) {
    if (!MBTI_DIMENSIONS.includes(tb.dimension)) continue
    if (tb.pole !== 1 && tb.pole !== 2) continue
    applied.set(tb.dimension, tb.pole)
  }
  for (const [dim, pole] of applied) {
    const t = out[dim]
    t.raw += pole === 1 ? MBTI_TIEBREAK_WEIGHT : -MBTI_TIEBREAK_WEIGHT
    t.maxRaw += MBTI_TIEBREAK_WEIGHT
  }
  return out
}

/**
 * 左极的占比，口径与源站一致：`Math.ceil(score / 2) + 50`，其中
 * `score = raw / maxRaw × 100` 是归一到 ±100 的有符号偏差。
 *
 * 该公式的三个性质都是实测出来的，不是设计偏好：
 * · `raw = 0` ⇒ 恰好 **50**（源站无作答时 `/api/onboarding/traits` 就返回 `score: 0, pct: 50`）；
 * · 非零时**主导侧恒 ≥ 51**，永远不会出现 50 这种中间值；
 * · `ceil` 让两向差 1 个百分点（`raw = 1` → 52，`raw = −1` → 左极 49、右极 51），
 *   这是源站口径自带的，不要"修"成四舍五入 —— 修了就与源站对不上。
 *
 * 该维**一题未答**（`maxRaw = 0`）时返回 50，由 UI 按"未测量"降级显示。
 */
export function mbtiPoleShare(raw: number, maxRaw: number): number {
  if (!(maxRaw > 0)) return 50
  return Math.ceil(((raw / maxRaw) * 100) / 2) + 50
}

const MBTI_CODE_MAX = MBTI_CODE_DIMENSIONS.length + 1

export interface MbtiTypeCode {
  /** 四字母类型码；未定的位是 `UNDECIDED_LETTER` */
  code: string
  /** `A` / `T`；未定是 `UNDECIDED_LETTER` */
  variant: string
  /** 形如 `INTJ-A`；**只要有一位未定就是 null**，避免拼出 `INXJ-A` 这种半成品 */
  fullCode: string | null
  /** 仍未定的维度，按 `MBTI_DIMENSIONS` 顺序 */
  undecided: MbtiDimension[]
}

export const UNDECIDED_LETTER = 'X'

/**
 * 四字母 + 变体后缀。**恰好 0 分即报未定（`X`），绝不默认到某一极** ——
 * 默认到某一极正是旧项目 E-lock 缺陷的形态（`score >= 0 ? 'E' : 'I'` 在某维零题量时
 * 让首字母对所有人恒定）。
 *
 * 产品上"绝不显示 X"由 UI 保证：打平的维必须先用定向题断掉，
 * 未断干净的作答不会走到结果页。核心层保留 `X` 是为了让"打平"这个事实**可见**，
 * 而不是被某一极悄悄吸收。
 */
export function deriveMbtiType(
  tallies: Record<MbtiDimension, MbtiDimensionTally>,
): MbtiTypeCode {
  const undecided: MbtiDimension[] = []
  const letterOf = (dim: MbtiDimension): string => {
    const t = tallies[dim]
    if (!t || t.raw === 0 || t.answered === 0) {
      undecided.push(dim)
      return UNDECIDED_LETTER
    }
    return t.raw > 0 ? MBTI_POLES[dim][0] : MBTI_POLES[dim][1]
  }
  const code = MBTI_CODE_DIMENSIONS.map(letterOf).join('')
  const variant = letterOf(MBTI_VARIANT_DIMENSION)
  const fullCode = undecided.length === 0 ? `${code}-${variant}` : null
  if (code.length + 1 !== MBTI_CODE_MAX) {
    throw new Error(`类型码长度异常: ${code}-${variant}`)
  }
  return { code, variant, fullCode, undecided }
}

/**
 * 每个层内维度实际被作答了几题。UI 据此判断"这一维是不是没答完"。
 *
 * 只数**合法且属于该层**的作答：越界选项、未知题、别层的题都不算 ——
 * 与计分、与覆盖度的口径保持一致。不做"未答满就不给分"的硬判定（那要产品裁定）。
 */
export function countPersonalityAnswers(
  questions: Question[],
  answers: Answer[],
  layer: 'bigfive' | 'mbti',
): Record<string, number> {
  const out: Record<string, number> = {}
  const byId = new Map(questions.map((q) => [q.id, q]))
  const valid = layer === 'mbti' ? isValidMbtiOption : isValidIpipOption
  for (const a of answers) {
    const q = byId.get(a.questionId)
    if (!q || q.layer !== layer || !q.facet) continue
    if (!valid(a.option)) continue
    out[q.facet] = (out[q.facet] ?? 0) + 1
  }
  return out
}

/**
 * 把作答归一化为规范形式：题目必须存在、选项必须在**该题所属层**的量表范围内、
 * 每题最多保留一条。同一题重复作答按**最后一次**取值（与 UI「可回退修改」语义一致）。
 *
 * 必须在统计覆盖度与计分之前调用。否则：
 *   · 重复作答会重复计分（同一题答三次 = 三倍权重）
 *   · 未知题目 id 会灌水 `answered`，让 33% 的真实覆盖度显示为 100%
 *   · 越界选项会被计分忽略、却被覆盖度计入，两者口径不一致
 */
export function normalizeAnswers(questions: Question[], answers: Answer[]): Answer[] {
  const byId = new Map(questions.map((q) => [q.id, q]))
  const latest = new Map<string, Answer>()
  for (const a of answers) {
    const q = byId.get(a.questionId)
    if (!q) continue
    // 三层的量表点数各不相同（主义 6、IPIP 5、本层 7），必须按题所属层分别判，
    // 否则 option 5 会被 IPIP 接受、option 4 会被主义层接受，覆盖度与计分口径就此分家。
    const valid = q.layer === 'ideology'
      ? isValidOption(a.option)
      : q.layer === 'mbti' ? isValidMbtiOption(a.option) : isValidIpipOption(a.option)
    if (!valid) continue
    latest.set(a.questionId, a)
  }
  return [...latest.values()]
}
