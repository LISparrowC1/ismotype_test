/**
 * 类型专属色的**显示**可读性修正。
 *
 * 16 个色值是按「在**亮色纸面** `#f7f8f7` 上做文字色 ≥ 4.5:1」挑的
 * （实测 4.60–13.14:1）。
 * 加了暗色主题之后，同一批色值放在深底上就不成立了 —— 内向型取的是各色系的
 * **深色档**，深紫写在近黑底上等于看不见。
 *
 * 修正在显示层，不改数据：与亮色纸面已经达标时**原样返回**（所以亮色主题下
 * 是一个恒等变换，看的还是抓来的那个色），否则把色值朝白方向混合到刚好达标。
 * 这与人格五维偏差条的 √ 刻度是同一类处理：**只动显示，数据不动**。
 *
 * 不做"给每个类型再挑一个暗色档"的原因：那要把 16personalities 的色阶重新抓一遍
 * 才能拿到亮色档，而抓取是外部依赖；显示层混合没有这个依赖，且可被单测逐值钉住。
 */

/** 相对亮度（WCAG 2.x） */
function luminance(hex: string): number {
  const v = hex.replace('#', '')
  const full =
    v.length === 3
      ? v
          .split('')
          .map((c) => c + c)
          .join('')
      : v
  const channel = (i: number): number => {
    const c = Number.parseInt(full.slice(i * 2, i * 2 + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2)
}

/** WCAG 对比度，1–21 */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

function toHex(rgb: [number, number, number]): string {
  return `#${rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')}`
}

function parse(hex: string): [number, number, number] {
  const v = hex.replace('#', '')
  const full =
    v.length === 3
      ? v
          .split('')
          .map((c) => c + c)
          .join('')
      : v
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ]
}

export const MIN_TYPE_TEXT_CONTRAST = 4.5

/**
 * 把 `color` 调到达标（相对 `paper`），返回可安全当文字色用的色值。
 * 达标就原样返回；不达标时按 4% 一档朝 `paper` 的**反方向**混合，
 * 最多混到纯白/纯黑 —— 循环有硬上界，不会因为算不到而挂住。
 */
export function readableTypeColor(color: string, paper: string): string {
  if (contrastRatio(color, paper) >= MIN_TYPE_TEXT_CONTRAST) return color
  const dark = luminance(paper) < 0.5
  const target: [number, number, number] = dark ? [255, 255, 255] : [0, 0, 0]
  const from = parse(color)
  for (let step = 1; step <= 25; step += 1) {
    const k = Math.min(1, step * 0.04)
    const mixed = toHex([
      from[0] + (target[0] - from[0]) * k,
      from[1] + (target[1] - from[1]) * k,
      from[2] + (target[2] - from[2]) * k,
    ])
    if (contrastRatio(mixed, paper) >= MIN_TYPE_TEXT_CONTRAST) return mixed
  }
  return toHex(target)
}
