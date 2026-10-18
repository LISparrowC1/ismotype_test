/**
 * 站点图标的几何。**唯一真相源** —— Vue 组件（`SiteMark.vue`）与分享图的
 * canvas 绘制都从这里取点，两边各画一套必然会在某次调整后长得不一样。
 *
 * 形状：六边形外圈 + 内圈"你的形状" + 六个顶点 + 中心一颗星点。
 * 六轴对应主义雷达图，星点对应夜晚的天空。
 */

/** 视框边长。点位都在这套坐标里，用的时候按目标尺寸缩放。 */
export const MARK_SIZE = 48
/** 六边形外接圆半径 */
export const MARK_RADIUS = 19
/** 内圈相对外圈的比例 */
export const MARK_INNER_RATIO = 0.56

export interface MarkPoint {
  x: number
  y: number
}

/** 六个顶点，起始角 −90°（正上方），顺时针 —— 与雷达图同一套极坐标约定 */
export function markPoints(size = MARK_SIZE, radius = MARK_RADIUS): MarkPoint[] {
  const c = size / 2
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180
    return { x: c + radius * Math.cos(a), y: c + radius * Math.sin(a) }
  })
}

/** 内圈多边形（缩放过的顶点） */
export function markInnerPoints(size = MARK_SIZE): MarkPoint[] {
  const c = size / 2
  return markPoints(size).map((p) => ({
    x: c + (p.x - c) * MARK_INNER_RATIO,
    y: c + (p.y - c) * MARK_INNER_RATIO,
  }))
}

/** 中心那颗四角星点的路径点，按目标尺寸缩放 */
export function markSparkPath(size = MARK_SIZE): MarkPoint[] {
  const k = size / MARK_SIZE
  const c = MARK_SIZE / 2
  /** 相对 48×48 视框里的形状：上下左右四个尖 + 四个内凹点 */
  const raw: Array<[number, number]> = [
    [24, 20.4],
    [25.1, 22.9],
    [27.6, 24],
    [25.1, 25.1],
    [24, 27.6],
    [22.9, 25.1],
    [20.4, 24],
    [22.9, 22.9],
  ]
  return raw.map(([x, y]) => ({ x: (x - c) * k + (size / 2), y: (y - c) * k + (size / 2) }))
}
