import type { ResultField } from '../../core/result'

/** 一条候选项在界面上需要的全部信息。名字与说明由视图从语言包解析后填进来。 */
export interface Candidate {
  ismId: string
  rank: number
  name: string
  description: string
  /**
   * 贴合度百分比 = 引擎 `match` 四舍五入到整数。
   *
   * `match` 已经是 0–100 的量（引擎对余弦做过一次线性映射），所以这里**只做取整**。
   * 早期在界面上又套了一次 `(m + 1) / 2` 的归一化，于是每一行都显示 100 ——
   * 二次归一化正是这类错误的形态：它不报错，只是让所有数字长得一样。
   */
  fitPct: number
}

/**
 * 把引擎给的候选（按 match 降序）解析成界面要的形状。
 *
 * **不产出置信度。** 立场段的呈现口径是「只给贴合度」：置信度那套
 * （明确 / 较明确 / 不确定）曾经逐条挂在候选行上、也曾经在段首给一句总评，
 * 两处都被去掉了 —— 三档文字在列表里既长得一样又互相看不出差别，百分比才能横向比。
 * 引擎仍然算置信度（`field.confidence`，spec §4.6 的统计防线），只是界面不再展示它。
 */
export function buildCandidates(
  field: ResultField,
  resolve: (ismId: string) => { name: string; description: string },
): Candidate[] {
  return field.topIsms.map((t) => {
    const { name, description } = resolve(t.ismId)
    return {
      ismId: t.ismId,
      rank: t.rank,
      name,
      description,
      fitPct: Math.round(t.match),
    }
  })
}
