import type { MbtiDimension } from '../../core/content'
import type { MbtiDimensionResult, MbtiResult } from '../../core/result'
import { mbtiTypeOf, type MbtiTypeStyle } from '../data'

/**
 * 结果页 MBTI 段要展示的一切。**这里不含任何判断** —— 每维的两极、占比、
 * 是否打平都直接来自 core 的 `MbtiDimensionResult`；本模块只做三件事：
 * 把占比翻成"哪一极、百分比是多少"，把类型码翻成色值与头像，以及
 * 算出还有哪几维没定向。
 *
 * 之所以独立成模块而不是写在 `.vue` 里：`.vue` 在本仓库不过 ESLint（没装
 * `vue-eslint-parser`），逻辑留在组件里等于没有门禁。
 */

/** 全 16 型的头像。`import.meta.glob` 是构建期展开的，运行时不发请求。 */
const AVATARS = import.meta.glob('../assets/mbti/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const avatarByCode = new Map<string, string>()
for (const [path, url] of Object.entries(AVATARS)) {
  const file = path.split('/').pop() ?? ''
  // 形如 `intj-male.svg`；取四字母前缀，一人格两份图里先出现的那个即可
  const code = file.slice(0, 4).toUpperCase()
  if (code.length === 4 && !avatarByCode.has(code)) avatarByCode.set(code, url)
}

/** 类型码 → 头像 URL。缺图返回 null，由调用方退化成实色块。 */
export function mbtiAvatar(code: string): string | null {
  return avatarByCode.get(code.toUpperCase()) ?? null
}

/**
 * 一条维度条。左右两半的宽度就是两极的占比（两者恒和为 100），
 * 百分比摆在各自那一侧的字母旁边。
 */
export interface MbtiDimensionRow {
  dimension: MbtiDimension
  /** 该维的名字，已解析（心智 / 能量 / 天性 / 战术 / 本性） */
  label: string
  /**
   * 该维两极在问什么，已解析（如"个体获取信息的感知方式：感觉（S）与直觉（N）偏好"）。
   *
   * 这一句是**传统 E/I、S/N、T/F、J/P 与源站五维命名的对照说明**，两者是同一件事的
   * 不同说法。它不参与任何判定，纯粹是给读的人一把尺子。
   */
  desc: string
  /** 左极字母，如 `E` */
  leftLetter: string
  rightLetter: string
  /** 左极百分比，50–100 */
  leftPct: number
  rightPct: number
  /** 占比高的一侧 —— 也是类型码里取的那个字母 */
  dominant: 'left' | 'right'
  /** 一题未答：按"未测量"降级，不画条也不给数字 */
  unmeasured: boolean
  /** 该维答了几题 / 共几题（未答满时界面标注"基于 n/m 题"） */
  answered: number
  total: number
}

/**
 * 每维题目数。**从数据集现算，不写死 12** —— 题库换版时写死的分母会让
 * "基于 8/12 题"变成谎话，而这种漂移没有任何构建期检查能发现。
 */
export function mbtiItemCounts(questions: ReadonlyArray<{ layer: string; facet?: string }>):
Record<MbtiDimension, number> {
  const out = {} as Record<MbtiDimension, number>
  for (const q of questions) {
    if (q.layer !== 'mbti' || q.facet === undefined) continue
    const dim = q.facet as MbtiDimension
    out[dim] = (out[dim] ?? 0) + 1
  }
  return out
}

export function mbtiDimensionRows(
  dimensions: readonly MbtiDimensionResult[],
  itemCounts: Record<MbtiDimension, number>,
  dimensionLabel: (dimension: MbtiDimension) => string,
  poleLabel: (dimension: MbtiDimension, pole: 1 | 2) => string,
  dimensionDesc: (dimension: MbtiDimension) => string,
): Array<MbtiDimensionRow & { leftLabel: string; rightLabel: string }> {
  return dimensions.map((d) => ({
    dimension: d.dimension,
    label: dimensionLabel(d.dimension),
    desc: dimensionDesc(d.dimension),
    leftLetter: d.poles[0],
    rightLetter: d.poles[1],
    // 字母与文字名分开：条上只放字母（宽度百分比要挨着它），名字给读屏用
    leftLabel: poleLabel(d.dimension, 1),
    rightLabel: poleLabel(d.dimension, 2),
    leftPct: d.pct1,
    rightPct: d.pct2,
    dominant: d.pct1 >= d.pct2 ? 'left' as const : 'right' as const,
    unmeasured: d.answered === 0,
    answered: d.answered,
    total: itemCounts[d.dimension] ?? 0,
  }))
}

/**
 * **恰好打平**的维度，按 core 的维度顺序。
 *
 * 判据取 core 的 `tie`（`answered > 0 && raw === 0`），不自己看 `pct1 === 50` ——
 * 后者把"该维一题未答"也算进来，而那是**没测到**，不是打平：补一道二选一
 * 补不回 12 道题的空缺（core 对 0 分与未作答同样给 `X`，但成因完全不同）。
 *
 * 这一项只在**全部答完之后**才有意义：答到一半时某维恰好 0 分是常态，
 * 那时把用户拽去定向页是错的（接下来那几道题本来就会把它拉偏）。
 */
export function tiedDimensions(mbti: MbtiResult): MbtiDimension[] {
  return mbti.dimensions.filter((d) => d.tie).map((d) => d.dimension)
}

/**
 * 结果页之前**必须**先解决掉的维度：打平的（要定向）与未测量的（要补答）。
 *
 * 两者都让 `deriveMbtiType` 产出 `X`，而 `X` 绝不显示给用户，故都必须拦住。
 * 界面据此二选一：打平去定向页，未测量送回答题页。
 */
export function pendingTieBreakDimensions(mbti: MbtiResult): MbtiDimension[] {
  return mbti.dimensions.filter((d) => d.tie || d.answered === 0).map((d) => d.dimension)
}

/** 类型卡的素材。文案与头像都由调用方解析后填进来 —— 本模块不认识语言包。 */
export interface MbtiTypeView {
  /** 四字母码，如上卡大字 */
  code: string
  /** `INTJ-A`；有任何一位未定时为 null，**此时不得显示类型卡** */
  fullCode: string | null
  /** 后缀字母 `A` / `T`，与 `fullCode` 里的那一位逐字一致 */
  variant: string
  /** 该型的中文名，如「架构师」 */
  name: string
  /** 该型的说明。**只用抓取到的原文**，不自撰长文 */
  description: string
  /** 品牌色，只作为实色块与顶栏使用 */
  colorHex: string
  colorFamily: string
  /** 头像 URL；缺图时为 null */
  avatarUrl: string | null
}

/**
 * 组装类型卡。
 *
 * `fullCode` 为 null（还有维度没定）时返回 null —— 调用方据此把用户送去定向题，
 * 而不是显示一个缺字母的类型。这不是防御性编程：`X` 是这个流程里**必然出现**的
 * 中间状态（每题都能选"中立"，12 题中立的维很常见）。
 *
 * 卡上印的后缀是**字母** `-A` / `-T`，不是"坚决 / 摇摆"：源站的类型码本身就这么写，
 * 而可视文字必须与 `fullCode` 逐字相同 —— 否则读屏读 `INTJ-A`、眼睛看到
 * `INTJ-坚决`，两个读数指向不同的字符串。中文极名属于五条维度条里 Identity 那一条。
 */
export function buildMbtiTypeView(
  mbti: MbtiResult,
  resolve: {
    typeName: (style: MbtiTypeStyle) => string
    typeDescription: (style: MbtiTypeStyle) => string
  },
): MbtiTypeView | null {
  if (mbti.fullCode === null) return null
  const style = mbtiTypeOf(mbti.code)
  // 类型码不在色卡里：题库或色卡被改坏时才会出现。仍要把码显示出来，缺的用中性值兜住
  return {
    code: mbti.code,
    fullCode: mbti.fullCode,
    variant: mbti.variant,
    name: style ? resolve.typeName(style) : mbti.code,
    description: style ? resolve.typeDescription(style) : '',
    colorHex: style?.colorHex ?? 'var(--rule)',
    colorFamily: style?.colorFamily ?? 'unknown',
    avatarUrl: mbtiAvatar(mbti.code),
  }
}
