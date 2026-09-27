import { IPIP_OPTION_COUNT, MBTI_OPTION_COUNT, OPTION_COUNT } from './calibration'
import type { Layer } from './content'

/**
 * IPIP-50 的响应值 = 原始的 1–5。
 *
 * 这个取值决定了 `scoreBigFive` 的 raw 落在 10–50，与公开发表的常模表同尺度，
 * 因此常模可直接查表比对。若改用 [-2, 2] 的加权值，raw 落在 [-20, 20]，
 * 任何常模表都必须先做一次仿射换算才能用 —— 那是把"口径"散到查表处，
 * 而不是收敛在计分处。
 */
export const IPIP_VALUES = [1, 2, 3, 4, 5] as const

/**
 * MBTI 风格层的响应值 = **索引 0 是最同意**（七点，与源站一致）。
 *
 * 与 IPIP 的方向差别是刻意的，理由见 `calibration.ts` 的 `MBTI_OPTION_VALUES`：
 * 本层是"同意 / 不同意"量表，两头是同意与不同意；IPIP 是"准确 / 不准确"量表，
 * 两头是不准确与准确。**两者索引 0 都代表"该量表里最小的那个"**，但"小"的含义不同。
 */
export const MBTI_VALUES = [3, 2, 1, 0, -1, -2, -3] as const

export interface ResponseScale {
  /** 选项个数 */
  readonly count: number
  /** i18n 键，按选项索引排列；索引 0 恒为最低/最左 */
  readonly labelKeys: readonly string[]
}

const LABELS = (prefix: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `${prefix}.${i}`)

/**
 * 三层各自的响应用量。标签是**数据**（i18n 键），不是代码里的字符串 ——
 * UI 与语言包都从这里取，三层的点数与方向只有一个真相源。
 *
 * **两个"同意"量表（主义 6 点、MBTI 7 点）都是同意在前**：索引 0 = 最同意，
 * 与各自的权重/取值方向一致（主义 `OPTION_WEIGHTS[0] = +2.5`、MBTI `MBTI_OPTION_VALUES[0] = +3`）。
 * IPIP 是"准确"量表，索引 0 = 最不准确、取值 1。
 *
 * 早先主义层的标签写成"不同意在前"而权重却是"同意在前"，两者反着；
 * 更糟的是 MBTI 层的取值写成 `option - 3`，让索引 0（非常同意）落到 −3，
 * 整层判分反过来。三处方向现在是同一条规则的三种写法：
 * **两个"同意"量表的第一项都必须是最同意**（索引 0 的权重/取值为正），IPIP 反过来。
 */
export const SCALES: Record<Layer, ResponseScale> = {
  ideology: { count: OPTION_COUNT, labelKeys: LABELS('scale.agree', OPTION_COUNT) },
  bigfive: { count: IPIP_OPTION_COUNT, labelKeys: LABELS('scale.accurate', IPIP_OPTION_COUNT) },
  mbti: { count: MBTI_OPTION_COUNT, labelKeys: LABELS('scale.agree7', MBTI_OPTION_COUNT) },
}
