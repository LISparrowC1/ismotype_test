import type { Issue, Taxonomy } from './taxonomy'

export type Layer = 'ideology' | 'bigfive' | 'mbti'

export const BIG_FIVE_DOMAINS = ['O', 'C', 'E', 'A', 'N'] as const
export type BigFiveDomain = (typeof BIG_FIVE_DOMAINS)[number]

/**
 * MBTI 风格层的五个维度，顺序与源站的 `test-results.trait1..5` 一致（Identity 排最后）。
 *
 * 前四维构成四字母类型码，第五维是 `-A / -T` 后缀。**是五维不是四维**：
 * 源站的框架文档把 Identity 称作"定义性特征"，类型码本身也带这个后缀（`INTJ-A`）。
 */
export const MBTI_DIMENSIONS = ['energy', 'mind', 'nature', 'tactics', 'identity'] as const
export type MbtiDimension = (typeof MBTI_DIMENSIONS)[number]

/** 构成四字母类型码的四个维度（不含 Identity）。顺序即字母顺序。 */
export const MBTI_CODE_DIMENSIONS = ['energy', 'mind', 'nature', 'tactics'] as const

/** 决定 `-A / -T` 后缀的维度。 */
export const MBTI_VARIANT_DIMENSION: MbtiDimension = 'identity'

/**
 * 每维两极的字母，顺序与源站的 `traitN_1` / `traitN_2` 一致：**左极在前**。
 *
 * 这同时就是结果页维度条「左半 / 右半」的字母，五维统一。注意左极不都是"外向型"那一侧：
 * Mind 的左极是 N、Nature 的左极是 T、Identity 的左极是 A —— 源站自己的编号如此，
 * 而结果页的 `traitN_1` 也是这个顺序。
 */
export const MBTI_POLES: Record<MbtiDimension, readonly [string, string]> = {
  energy: ['E', 'I'],
  mind: ['N', 'S'],
  nature: ['T', 'F'],
  tactics: ['J', 'P'],
  identity: ['A', 'T'],
}

/**
 * 每维的题数。源站是每维 12 题、共 60 题，五维正好五等分。
 *
 * 放在 core 而不是数据层：UI 要拿它显示"基于 n/12 题"，而数据层是 Node 专用的
 * （`node:fs`），浏览器侧不能引用。
 */
export const MBTI_ITEMS_PER_DIMENSION = 12
export const MBTI_TOTAL_ITEMS = MBTI_ITEMS_PER_DIMENSION * MBTI_DIMENSIONS.length

export interface Loading { dim: string; weight: number }

export interface Question {
  id: string
  textKey: string
  layer: Layer
  reversed?: boolean
  loadings?: Loading[]
  facet?: string
}

export interface Ism {
  id: string
  constructId: string
  nameKey: string
  descKey: string
  icon: string | null
  profile: Record<string, number>
}

export interface MbtiType {
  /** 四字母类型码，字母顺序固定为 energy → mind → nature → tactics（即 E/I、N/S、T/F、J/P） */
  code: string
  nameKey: string
  descKey: string
}

/**
 * 四字母类型码与文案键。**只放结构与键名，不放文案** —— 文案在语言包里（spec §7.3）。
 *
 * 名称与描述取自 16personalities 的公开类型页（中英各一份）；
 * 色值与角色归属在 `src/data/mbti/types.v1.json`。
 */
export const MBTI_TYPES: readonly MbtiType[] = (['I', 'E'] as const).flatMap((ei) =>
  (['N', 'S'] as const).flatMap((ns) => (['T', 'F'] as const).flatMap((tf) =>
    (['J', 'P'] as const).map((jp) => {
      const code = `${ei}${ns}${tf}${jp}`
      return { code, nameKey: `mbti.type.${code}.name`, descKey: `mbti.type.${code}.desc` }
    }))))

export const LOADING_MIN = 3
export const LOADING_MAX = 6
export const LOADING_WEIGHT_MAX = 5

const blank = (v: unknown): boolean => typeof v !== 'string' || v.trim() === ''
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v)

export function allDimensionIds(t: Taxonomy): Set<string> {
  const ids = new Set<string>()
  for (const c of t.constructs) for (const f of c.facets) ids.add(f.id)
  return ids
}

export function allConstructIds(t: Taxonomy): Set<string> {
  return new Set(t.constructs.map((c) => c.id))
}

export function validateContent(t: Taxonomy, questions: Question[], isms: Ism[]): Issue[] {
  const issues: Issue[] = []
  const dims = allDimensionIds(t)
  const constructs = allConstructIds(t)

  const seenQ = new Set<string>()
  questions.forEach((q, qi) => {
    const qp = `questions[${qi}]`
    if (blank(q.id)) issues.push({ path: `${qp}.id`, message: '不能为空' })
    else if (seenQ.has(q.id)) issues.push({ path: `${qp}.id`, message: `题目 id 重复: ${q.id}` })
    else seenQ.add(q.id)
    if (blank(q.textKey)) issues.push({ path: `${qp}.textKey`, message: '不能为空' })

    if (q.layer === 'ideology') {
      const ls = q.loadings
      if (!Array.isArray(ls) || ls.length < LOADING_MIN || ls.length > LOADING_MAX) {
        issues.push({
          path: `${qp}.loadings`,
          message: `主义层载荷数须在 ${LOADING_MIN}–${LOADING_MAX}，实际 ${ls?.length ?? 0}`,
        })
      }
      // 逐条校验与数量校验解耦：数量错误时仍报出每一条的具体问题，
      // 否则开发者要修两轮才能看到全部错误。
      if (Array.isArray(ls)) {
        const seenDim = new Set<string>()
        ls.forEach((l, li) => {
          const lp = `${qp}.loadings[${li}]`
          if (!dims.has(l.dim)) issues.push({ path: `${lp}.dim`, message: `未知子维度: ${l.dim}` })
          else if (seenDim.has(l.dim)) issues.push({ path: `${lp}.dim`, message: `同一题内重复: ${l.dim}` })
          else seenDim.add(l.dim)
          if (!isInt(l.weight) || l.weight === 0 || Math.abs(l.weight) > LOADING_WEIGHT_MAX) {
            issues.push({
              path: `${lp}.weight`,
              message: `须为绝对值 1–${LOADING_WEIGHT_MAX} 的非零整数，实际 ${l.weight}`,
            })
          }
        })
      }
    } else if (q.layer === 'bigfive') {
      if (!BIG_FIVE_DOMAINS.includes(q.facet as BigFiveDomain)) {
        issues.push({ path: `${qp}.facet`, message: `bigfive 层 facet 须为 ${BIG_FIVE_DOMAINS.join('/')}，实际 ${q.facet}` })
      }
    } else if (q.layer === 'mbti') {
      if (!MBTI_DIMENSIONS.includes(q.facet as MbtiDimension)) {
        issues.push({ path: `${qp}.facet`, message: `mbti 层 facet 须为 ${MBTI_DIMENSIONS.join('/')}，实际 ${q.facet}` })
      }
    } else {
      issues.push({ path: `${qp}.layer`, message: `未知层级: ${q.layer as string}` })
    }
  })

  const seenI = new Set<string>()
  isms.forEach((ism, ii) => {
    const ip = `isms[${ii}]`
    if (blank(ism.id)) issues.push({ path: `${ip}.id`, message: '不能为空' })
    else if (seenI.has(ism.id)) issues.push({ path: `${ip}.id`, message: `主义 id 重复: ${ism.id}` })
    else seenI.add(ism.id)

    if (!constructs.has(ism.constructId)) {
      issues.push({ path: `${ip}.constructId`, message: `未知构念: ${ism.constructId}` })
    }
    if (blank(ism.nameKey)) issues.push({ path: `${ip}.nameKey`, message: '不能为空' })
    if (blank(ism.descKey)) issues.push({ path: `${ip}.descKey`, message: '不能为空' })

    const entries = Object.entries(ism.profile ?? {})
    if (entries.length === 0) issues.push({ path: `${ip}.profile`, message: '轮廓不能为空' })
    for (const [dim, w] of entries) {
      if (!dims.has(dim)) issues.push({ path: `${ip}.profile.${dim}`, message: `未知子维度: ${dim}` })
      if (!isInt(w) || w === 0) issues.push({ path: `${ip}.profile.${dim}`, message: `权重须为非零整数，实际 ${w}` })
    }
  })

  return issues
}
