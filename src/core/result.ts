import type { Calibration } from './calibration'
import {
  allDimensionIds, BIG_FIVE_DOMAINS, MBTI_DIMENSIONS, MBTI_POLES,
  type BigFiveDomain, type Ism, type MbtiDimension, type Question,
} from './content'
import {
  computeConfidence, computeConstructConfidences, matchIsms,
  type Confidence, type ConfidenceLevel,
} from './matching'
import { EMPTY_NORMS, percentileOf, type Norms } from './norms'
import {
  countPersonalityAnswers, deriveMbtiType, mbtiPoleShare, normalizeAnswers, scoreBigFive,
  scoreDimensions, tallyMbtiDimensions,
  type Answer, type MbtiTieBreak,
} from './scoring'
import type { Taxonomy } from './taxonomy'

export interface ResultInput {
  taxonomy: Taxonomy
  questions: Question[]
  isms: Ism[]
  calibration: Calibration
  answers: Answer[]
  /**
   * 人格层题项（bigfive + mbti）。省略时人格结果为"未测量"（raw 0、四维 X），
   * 主义结果不受影响。两层的题分开放，是因为计分口径与校验规则都不同。
   */
  facetItems?: Question[]
  /** 常模。省略即 `EMPTY_NORMS`，所有 `percentile` 为 null。 */
  norms?: Norms
  /** 常模按语言查表，须与 UI 语言一致。省略按 zh-CN。 */
  locale?: string
  /**
   * 产出这批作答时所用的分类学版本。省略则视为与 taxonomy.version 一致。
   * 不一致时 buildResult 抛错 —— 绝不让旧作答静默按新维度计分。
   */
  taxonomyVersionOfAnswers?: string
  /**
   * MBTI 层的打平定向作答。只有该维恰好 50/50 时才有意义（`MbtiDimensionResult.tie`），
   * 未打平的维上给了定向也会被照常计入 —— 调用方负责只在打平时收集。
   */
  mbtiTieBreaks?: readonly MbtiTieBreak[]
}

export interface BigFiveScore {
  /**
   * IPIP 原始分 = 该维度每题得分（1–5）之和，取值 **10–50**；**0 表示一题未答**。
   * 与公开常模同尺度，故可直接查表。UI 必须把 0 当"未测量"处理，不得显示为最低分。
   */
  raw: number
  /**
   * 该维度实际作答了几题（满编 10）。
   *
   * **不做"未答满就不给分"的硬判定** —— 那要产品裁定（答 8 题算不算测到了？），
   * 而且会与"中途退出的人也该看到部分结果"冲突。这里只把事实交给 UI：
   * UI 据此决定是展示分数、标注"基于 8/10 题"，还是提示补答。
   */
  answeredCount: number
  /** 缺该语言/该维度的常模时为 null —— 不得编造（spec §4.6） */
  percentile: number | null
}

export interface ResultField {
  constructId: string
  /** 该构念内**全部**主义，按 match 降序（spec §7.1 要求完整排名，不截断） */
  topIsms: Array<{ ismId: string; match: number; rank: number }>
  /** 该构念内 top1 与 top2 的 match 差。**候选 < 2 个时为 0**（无可比较的对手） */
  margin: number
  /**
   * 该构念内参与排名的主义数。`margin` 只有在 `candidateCount >= 2` 时才有意义：
   * 单候选构念的 margin 恒为 0，若把它算进全局 margin 会把全局值钉死在 0，
   * 显示成"所有领域都不确定"（M1）。
   */
  candidateCount: number
  /** 该构念自身的置信度 —— UI 据此指出「哪一维是接近的竞争」 */
  confidence: { level: ConfidenceLevel; decisiveness: number }
}

/** 单个维度的呈现用的全部事实。UI 不该自己重算任何一项。 */
export interface MbtiDimensionResult {
  dimension: MbtiDimension
  /** 左极 / 右极字母，顺序与源站的 `traitN_1` / `traitN_2` 一致（左极在前） */
  poles: readonly [string, string]
  /** 左极占比，50–100；右极恒为 `100 - pct1`，故两者之和永远是 100 */
  pct1: number
  pct2: number
  /** 有符号原始分，正数偏向左极 */
  raw: number
  /** 该维实际作答了几题（满编 12） */
  answered: number
  /** 该维满分（满编 36；加了定向题后为 37.5） */
  maxRaw: number
  /** 恰好打平且有作答 —— 需要一道二选一定向题 */
  tie: boolean
}

export interface MbtiResult {
  /** 四字母类型码；有未定的位时为 `UNDECIDED_LETTER`，UI 必须先定向再展示 */
  code: string
  variant: string
  /** `INTJ-A`；有任何一位未定即为 null，不拼半成品 */
  fullCode: string | null
  /** 仍未定的维度，按 `MBTI_DIMENSIONS` 顺序 */
  undecided: MbtiDimension[]
  /** 五个维度，顺序与 `MBTI_DIMENSIONS` 一致（Identity 最后） */
  dimensions: MbtiDimensionResult[]
  /**
   * 该层**无法通过本项目的验证标准**（决策 3 为工程级、无真实数据），
   * UI 必须显式标注为娱乐性质，且不得与 Big Five 并列展示而不加区分（spec §5.3）。
   */
  entertainment: true
}

export interface AssessmentResult {
  taxonomyVersion: string
  personality: {
    bigFive: Record<BigFiveDomain, BigFiveScore>
    mbti: MbtiResult
  }
  ideology: {
    constructs: Array<{ id: string; score: number }>
    fields: ResultField[]
  }
  confidence: Confidence & { margin: number }
  answered: number
  total: number
}

/**
 * 输入一致性校验。错配的数据必须显式报错，而不是静默算出看似合理的结果 ——
 * 分类学升版（M4/M6 必然发生）后若沿用旧题库/旧标定，静默计分是最危险的失败模式。
 */
function assertConsistent(taxonomy: Taxonomy, questions: Question[], isms: Ism[], calibration: Calibration): void {
  if (calibration.taxonomyVersion !== taxonomy.version) {
    throw new Error(`标定数据版本 ${calibration.taxonomyVersion} 与分类学版本 ${taxonomy.version} 不匹配`)
  }
  const dimIds = allDimensionIds(taxonomy)
  for (const q of questions) {
    for (const l of q.loadings ?? []) {
      if (!dimIds.has(l.dim)) throw new Error(`题目 ${q.id} 的载荷引用未知子维度 ${l.dim}`)
    }
  }
  for (const ism of isms) {
    for (const dim of Object.keys(ism.profile)) {
      if (!dimIds.has(dim)) throw new Error(`主义 ${ism.id} 的轮廓引用未知子维度 ${dim}`)
    }
  }
}

export function buildResult(input: ResultInput): AssessmentResult {
  const { taxonomy, questions, isms, calibration } = input
  const facetItems = input.facetItems ?? []
  const norms = input.norms ?? EMPTY_NORMS
  const locale = input.locale ?? 'zh-CN'

  const answersVersion = input.taxonomyVersionOfAnswers ?? taxonomy.version
  if (answersVersion !== taxonomy.version) {
    throw new Error(`作答数据版本 ${answersVersion} 与分类学版本 ${taxonomy.version} 不匹配，请重新作答`)
  }
  assertConsistent(taxonomy, questions, isms, calibration)

  // 作答必须先归一化：去重（最后一笔生效）、丢弃未知题目与越界选项。
  // 否则覆盖度会被灌水、分数会被重复计分（见 normalizeAnswers 注释）。
  //
  // 归一化必须**同时看到两套题**：只传主义题时人格题会被当成"未知题目"整体丢弃
  // （实测：50 道 IPIP 题答满，raw 仍是 0）。两套题的 id 不重叠，由数据层的
  // assertPersonalityIdsUnique 保证。
  const normalizedAll = normalizeAnswers([...questions, ...facetItems], input.answers)
  // 主义层的答案另取一次：过滤发生在**层**这一级（人格题选项域是 0–4，主义题是 0–5），
  // 不能用 option 数值去区分，否则 option 4 会被算进主义层。
  const ideologyIds = new Set(questions.map((q) => q.id))
  const answers = normalizedAll.filter((a) => ideologyIds.has(a.questionId))
  const allPersonalityIds = new Set(facetItems.map((q) => q.id))
  const personalityAnswers = normalizedAll.filter((a) => allPersonalityIds.has(a.questionId))

  const scores = scoreDimensions(taxonomy, questions, answers, calibration)
  const matches = matchIsms(isms, scores)
  const confidence = computeConfidence(matches, questions.length > 0 ? answers.length / questions.length : 0)
  const fieldConfidence = new Map(computeConstructConfidences(matches).map((c) => [c.constructId, c]))

  // 构念分数 = Σ(子维度归一化分 × 子维度量程) / 构念量程。
  // 这是「原始分 / 量程」的等价形式；直接对子维度归一化分求和再夹取会饱和
  // （三个子维度各 0.6 会错报 100，正确值为 80）。
  const constructs = taxonomy.constructs.map((c) => {
    const ceiling = calibration.constructCeiling[c.id] ?? 0
    let weighted = 0
    for (const f of c.facets) {
      weighted += (scores[f.id] ?? 0) * (calibration.dimCeiling[f.id] ?? 0)
    }
    const normalized = ceiling > 0 ? Math.min(1, Math.max(-1, weighted / ceiling)) : 0
    return { id: c.id, score: Math.round(((normalized + 1) / 2) * 100) }
  })

  const fields: ResultField[] = taxonomy.constructs.map((c) => {
    const ranked = matches.filter((m) => m.constructId === c.id).sort((a, b) => a.rank - b.rank)
    const margin = ranked.length >= 2
      ? Math.round((ranked[0]!.match - ranked[1]!.match) * 100) / 100
      : 0
    const conf = fieldConfidence.get(c.id)
    return {
      constructId: c.id,
      topIsms: ranked.map((m) => ({
        ismId: m.ismId,
        match: Math.round(m.match * 100) / 100,
        rank: m.rank,
      })),
      margin,
      candidateCount: ranked.length,
      confidence: { level: conf?.level ?? 'low', decisiveness: conf?.decisiveness ?? 0 },
    }
  })

  // 人格题与主义题同在一个作答数组里：各层按 layer 过滤，互不干扰。
  // 但 total / answered 只统计主义题 —— 否则 50 道人格题会让主义层覆盖度虚高。
  const bigFiveRaw = scoreBigFive(facetItems, personalityAnswers)
  const bigFiveCounts = countPersonalityAnswers(facetItems, personalityAnswers, 'bigfive')
  const bigFive = {} as Record<BigFiveDomain, BigFiveScore>
  for (const domain of BIG_FIVE_DOMAINS) {
    const raw = bigFiveRaw[domain]
    bigFive[domain] = {
      raw,
      answeredCount: bigFiveCounts[domain] ?? 0,
      percentile: percentileOf(norms, locale, domain, raw),
    }
  }

  const tallies = tallyMbtiDimensions(facetItems, personalityAnswers, input.mbtiTieBreaks ?? [])
  const mbtiDims: MbtiDimensionResult[] = MBTI_DIMENSIONS.map((dimension) => {
    const t = tallies[dimension]
    const pct1 = mbtiPoleShare(t.raw, t.maxRaw)
    return {
      dimension,
      poles: MBTI_POLES[dimension],
      pct1,
      pct2: 100 - pct1,
      raw: t.raw,
      answered: t.answered,
      maxRaw: t.maxRaw,
      // 只有"答过题且恰好打平"才算打平：一题未答是"未测量"，再问一道二选一也补不回来
      tie: t.answered > 0 && t.raw === 0,
    }
  })
  const mbti = {
    ...deriveMbtiType(tallies),
    dimensions: mbtiDims,
    entertainment: true as const,
  }

  // 全局 margin 取各构念中最小的那个（最弱环节），但只算**有 ≥ 2 个候选**的构念：
  // 单候选构念的 margin 恒为 0，纳入后全局值恒为 0，与"这个领域不确定"是两回事（M1）。
  const comparable = fields.filter((f) => f.candidateCount >= 2)
  const margin = comparable.length > 0 ? Math.min(...comparable.map((f) => f.margin)) : 0

  return {
    taxonomyVersion: taxonomy.version,
    personality: { bigFive, mbti },
    ideology: { constructs, fields },
    confidence: { ...confidence, margin },
    answered: answers.length,
    total: questions.length,
  }
}
