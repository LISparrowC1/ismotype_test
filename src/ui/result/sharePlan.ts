/**
 * 分享图的**版式规划器**：把整张图算成一串绘制指令，不碰 canvas。
 *
 * 为什么拆成两层：happy-dom（本项目的测试环境）**没有 canvas 实现**，
 * `getContext('2d')` 直接返回 `null`，画的东西一行都验不了。
 * 于是把"画什么、画在哪、多宽多高"全部收敛到这个纯函数里逐条单测，
 * 真正调 canvas API 的那层（`shareDraw.ts`）薄到只剩照着执行。
 *
 * 硬不变量：**任何一条指令都不许越出画布**。1080×1920 装四大块内容本来就紧，
 * 越界在截图里表现为"最后一行被切掉一半"，而那是发布出去之后才发现的问题。
 * 这条由单测逐条断言，不靠目测。
 *
 * 文本宽度由调用方注入 `measure`（真实的走 canvas 的 `measureText`，测试里走估算），
 * 这样截断与换行的行为在两边一致 —— 与 `Translate` 的注入是同一个路子。
 */
import { markInnerPoints, markPoints, markSparkPath } from './siteMark'

export interface SharePoint {
  x: number
  y: number
}

export type ShareOp =
  | { kind: 'linear-gradient'; x0: number; y0: number; x1: number; y1: number; stops: Array<{ at: number; color: string }> }
  | { kind: 'radial-glow'; cx: number; cy: number; r: number; color: string }
  | { kind: 'circle'; cx: number; cy: number; r: number; fill: string }
  | { kind: 'rect'; x: number; y: number; w: number; h: number; radius: number; fill?: string; stroke?: string; lineWidth?: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: string; lineWidth: number }
  | { kind: 'polygon'; points: SharePoint[]; fill?: string; stroke?: string; lineWidth?: number }
  | { kind: 'text'; x: number; y: number; text: string; font: string; fill: string; align: CanvasTextAlign; baseline: CanvasTextBaseline }
  | { kind: 'image'; href: string; x: number; y: number; w: number; h: number }

export interface ShareTokens {
  bgFrom: string
  bgTo: string
  glowA: string
  glowB: string
  ink: string
  ink2: string
  rule: string
  ruleSoft: string
  /** 性格底色那条轨道的底：令牌里是 `color-mix(...)`，canvas 不认，由绘制层换算成 rgba */
  ruleTrack: string
  accent: string
  accentInk: string
  starInk: string
  panel: string
  panelBorder: string
}

export interface ShareDimensionRow {
  /** 左极字母，如 E */
  left: string
  right: string
  /** 左极占比，0–100 */
  leftPct: number
  rightPct: number
  /** 分数高的那一侧加粗 */
  lead: 'left' | 'right'
}

export interface ShareChampion {
  construct: string
  ism: string
  fitPct: number
}

export interface ShareInput {
  tokens: ShareTokens
  measure: (text: string, font: string) => number
  siteName: string
  /** 站点地址，画在站名同一行的右侧。发布到别的域名时改 `SHARE_SITE_URL` */
  siteUrl: string
  type: {
    code: string
    variant: string
    /** 类型名 */
    name: string
    /** 已按当前底色修正过可读性的类型色 */
    color: string
    avatarHref: string | null
  }
  headings: { dimensions: string; bigFive: string; ideology: string }
  dimensions: ShareDimensionRow[]
  /** 性格底色五条。`value` 是 −1..1 的相对位置，与页面同一口径（页面上不印数字） */
  bigFive: Array<{ label: string; value: number }>
  champions: ShareChampion[]
  /** 星点数量；位置由固定种子算，同一份结果每次生成同一张图 */
  starCount?: number
}

export interface SharePlan {
  width: number
  height: number
  ops: ShareOp[]
}

export const SHARE_WIDTH = 1080
export const SHARE_HEIGHT = 1920

/* ---- 版面常量。越界由单测兜住，改动这里之后必须重跑 ---- */
const PAD = 72
const HEADER_TOP = 64
const MARK = 54
const WORDMARK_FONT = '600 34px "Space Grotesk", system-ui, sans-serif'
const SITE_URL_FONT = '500 22px "Space Grotesk", system-ui, sans-serif'
/**
 * 分享图右上角的站址。**不带 `https://`** —— 图上只需要认得出是哪个站。
 * 这份图会被发到别人的信息流里，所以它必须自带"去哪找"的线索。
 */
export const SHARE_SITE_URL = 'lisparrowc1.github.io/ismotype_test'
const CARD_TOP = 150
const CARD_H = 340
const SECTION_GAP = 46
const HEADING_FONT = '500 26px "Noto Sans SC", "PingFang SC", system-ui, sans-serif'
const ROW_H = 62
const BF_ROW_H = 58
const CHAMP_ROW_H = 84
const COLS = 2

const CJK = /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/

/** 估算文本宽度。真实渲染用 canvas 的 measureText；测试里用它，两边口径一致。 */
export function estimateTextWidth(text: string, sizePx: number): number {
  let w = 0
  for (const ch of text) w += CJK.test(ch) ? sizePx : sizePx * 0.56
  return w
}

/** 按像素宽截断，超出加省略号。**返回值一定 ≤ maxWidth**（除非单字就超）。 */
export function fitText(
  text: string,
  maxWidth: number,
  measure: (t: string) => number,
): string {
  if (measure(text) <= maxWidth) return text
  let out = ''
  for (const ch of text) {
    if (measure(`${out}${ch}…`) > maxWidth) break
    out += ch
  }
  return out === '' ? '…' : `${out}…`
}

const rounded = (n: number): number => Math.round(n)

export function planShareImage(input: ShareInput): SharePlan {
  const W = SHARE_WIDTH
  const H = SHARE_HEIGHT
  const t = input.tokens
  const ops: ShareOp[] = []

  /* ---- 背景：渐变 + 两团光晕 + 星点。不带任何动效，分享图是静止的 ---- */
  ops.push({
    kind: 'linear-gradient',
    x0: 0,
    y0: 0,
    x1: W * 0.35,
    y1: H,
    stops: [
      { at: 0, color: t.bgFrom },
      { at: 1, color: t.bgTo },
    ],
  })
  ops.push({ kind: 'radial-glow', cx: W * 0.16, cy: H * 0.1, r: W * 0.72, color: t.glowA })
  ops.push({ kind: 'radial-glow', cx: W * 0.92, cy: H * 0.86, r: W * 0.62, color: t.glowB })
  // 亮色主题下 `--star-ink` 是 `transparent`（背景层在白天本来就没有星星），
  // 那就一条都别生成 —— 120 个看不见的圆既费时，又让"指令数"这个调试信号失真
  if (t.starInk !== 'transparent') {
    for (const star of stars(input.starCount ?? 120)) {
      ops.push({ kind: 'circle', cx: star.x * W, cy: star.y * H, r: star.r, fill: t.starInk })
    }
  }

  /*
   * 头部：图标 + 站名，右侧同一行放站址。免责与元信息按所有者裁定一律不加 ——
   * 站址是**唯一的例外**，而且它必须与站名同一行：卡片从 150 就开始，
   * 往站名下面再塞一行会把整块内容往下推，最后 12 个冠军会被挤出画布。
   */
  ops.push(...markOps(PAD, HEADER_TOP, MARK, t))
  ops.push({
    kind: 'text',
    x: PAD + MARK + 20,
    y: HEADER_TOP + MARK / 2,
    text: input.siteName,
    font: WORDMARK_FONT,
    fill: t.ink,
    align: 'left',
    baseline: 'middle',
  })
  ops.push({
    kind: 'text',
    x: W - PAD,
    y: HEADER_TOP + MARK / 2,
    text: input.siteUrl,
    font: SITE_URL_FONT,
    fill: t.ink2,
    align: 'right',
    baseline: 'middle',
  })

  /* ---- 类型卡 ---- */
  ops.push({
    kind: 'rect',
    x: PAD,
    y: CARD_TOP,
    w: W - PAD * 2,
    h: CARD_H,
    radius: 28,
    fill: t.panel,
    stroke: t.panelBorder,
    lineWidth: 1,
  })

  const cardPad = 44
  const avatarSize = 232
  const avatarX = W - PAD - cardPad - avatarSize
  const textLeft = PAD + cardPad
  const textRight = avatarX - 28

  const codeFont = '700 148px "Space Grotesk", system-ui, sans-serif'
  ops.push({
    kind: 'text',
    x: textLeft,
    y: CARD_TOP + 172,
    text: input.type.code,
    font: codeFont,
    fill: input.type.color,
    align: 'left',
    baseline: 'alphabetic',
  })
  const codeWidth = input.measure(input.type.code, codeFont)
  ops.push({
    kind: 'text',
    x: textLeft + codeWidth + 12,
    y: CARD_TOP + 172,
    text: `-${input.type.variant}`,
    font: '400 34px "Space Grotesk", system-ui, sans-serif',
    fill: t.ink2,
    align: 'left',
    baseline: 'alphabetic',
  })

  const nameFont = '600 56px "Noto Sans SC", "PingFang SC", system-ui, sans-serif'
  ops.push({
    kind: 'text',
    x: textLeft,
    y: CARD_TOP + 272,
    text: fitText(input.type.name, textRight - textLeft, (s) => input.measure(s, nameFont)),
    font: nameFont,
    fill: input.type.color,
    align: 'left',
    baseline: 'alphabetic',
  })

  if (input.type.avatarHref) {
    ops.push({
      kind: 'image',
      href: input.type.avatarHref,
      x: avatarX,
      y: CARD_TOP + (CARD_H - avatarSize) / 2,
      w: avatarSize,
      h: avatarSize,
    })
  }

  /* ---- 分区一：五个维度的偏向 ---- */
  let y = CARD_TOP + CARD_H + SECTION_GAP
  ops.push(...heading(input.headings.dimensions, PAD, y, t, HEADING_FONT))
  y += 46
  const barLeft = PAD + 34
  const barRight = W - PAD - 34
  const barW = barRight - barLeft
  for (const row of input.dimensions) {
    const barTop = y + 14
    const barH = 34
    ops.push({
      kind: 'text',
      x: PAD,
      y: barTop + barH / 2,
      text: row.left,
      font: letterFont(row.lead === 'left'),
      fill: t.ink,
      align: 'left',
      baseline: 'middle',
    })
    ops.push({
      kind: 'text',
      x: W - PAD,
      y: barTop + barH / 2,
      text: row.right,
      font: letterFont(row.lead === 'right'),
      fill: t.ink,
      align: 'right',
      baseline: 'middle',
    })
    const leftW = rounded((barW * row.leftPct) / 100)
    ops.push({ kind: 'rect', x: barLeft, y: barTop, w: leftW, h: barH, radius: 6, fill: t.accent })
    ops.push({
      kind: 'rect',
      x: barLeft + leftW,
      y: barTop,
      w: barW - leftW,
      h: barH,
      radius: 6,
      fill: t.rule,
    })
    // 百分比写在色段内、紧贴同侧：与页面一致
    const pctFont = '500 17px "Space Grotesk", system-ui, sans-serif'
    const lText = `${row.leftPct}%`
    const rText = `${row.rightPct}%`
    if (input.measure(lText, pctFont) + 16 < leftW) {
      ops.push({ kind: 'text', x: barLeft + 10, y: barTop + barH / 2, text: lText, font: pctFont, fill: t.accentInk, align: 'left', baseline: 'middle' })
    }
    if (input.measure(rText, pctFont) + 16 < barW - leftW) {
      ops.push({ kind: 'text', x: barRight - 10, y: barTop + barH / 2, text: rText, font: pctFont, fill: t.ink, align: 'right', baseline: 'middle' })
    }
    y += ROW_H
  }

  /* ---- 分区二：性格底色 ---- */
  y += SECTION_GAP - 12
  ops.push(...heading(input.headings.bigFive, PAD, y, t, HEADING_FONT))
  y += 46
  /*
   * 与页面 `DeviationBars` 同一套几何：标签列 + 一条**看得见的轨道** + 中轴 + 从中间伸出的条。
   * 第一版只画了中轴刻度，那五条在图上像凭空浮着的短横 —— 轨道是"偏离中点"这个读法的载体，
   * 少了它整块的语义就没了。
   */
  const trackLeft = PAD + 150
  const trackRight = W - PAD
  const trackW = trackRight - trackLeft
  for (const row of input.bigFive) {
    const cy = y + BF_ROW_H / 2
    ops.push({
      kind: 'text',
      x: PAD,
      y: cy,
      text: fitText(row.label, 140, (s) => input.measure(s, BIGFIVE_LABEL_FONT)),
      font: BIGFIVE_LABEL_FONT,
      fill: t.ink2,
      align: 'left',
      baseline: 'middle',
    })
    ops.push({ kind: 'rect', x: trackLeft, y: cy - 5, w: trackW, h: 10, radius: 0, fill: t.ruleTrack })
    const mid = trackLeft + trackW / 2
    ops.push({ kind: 'line', x1: mid, y1: cy - 8, x2: mid, y2: cy + 8, stroke: t.rule, lineWidth: 1 })
    // **页面上这五条不印数字**，分享图也不印 —— 没有数字就没有可被读成百分位的东西。
    const clamped = Math.max(-1, Math.min(1, row.value))
    const half = (Math.sqrt(Math.abs(clamped)) * trackW) / 2
    const from = clamped >= 0 ? mid : mid - half
    ops.push({ kind: 'rect', x: from, y: cy - 5, w: Math.max(2, half), h: 10, radius: 0, fill: t.accent })
    ops.push({ kind: 'circle', cx: clamped >= 0 ? mid + half : mid - half, cy, r: 5, fill: t.accent })
    y += BF_ROW_H
  }

  /* ---- 分区三：立场 12 个冠军，两列 ---- */
  y += SECTION_GAP - 12
  ops.push(...heading(input.headings.ideology, PAD, y, t, HEADING_FONT))
  y += 50
  const colGap = 40
  const colW = (W - PAD * 2 - colGap) / COLS
  input.champions.slice(0, 12).forEach((c, i) => {
    const col = i % COLS
    const rowIndex = Math.floor(i / COLS)
    const x = PAD + col * (colW + colGap)
    const rowY = y + rowIndex * CHAMP_ROW_H
    /*
     * 一行两条字：上面领域名（小、次级墨），下面主义名（大、墨）。
     * **基线必须分开算**：领域名走 `top`（占 rowY+2 到 rowY+20），
     * 主义名走 `alphabetic` 且基线下移到 rowY+50 —— 曾经两者只差 28px，
     * 而 18px + 30px 两行字加起来有 40px 高，于是整整一片名字叠在一起。
     * 现在由单测的"任意两段文字不许重叠"逐条兜住。
     */
    ops.push({
      kind: 'text',
      x,
      y: rowY + 2,
      text: fitText(c.construct, colW, (s) => input.measure(s, CONSTRUCT_FONT)),
      font: CONSTRUCT_FONT,
      fill: t.ink2,
      align: 'left',
      baseline: 'top',
    })
    const fitFont = '500 20px "Space Grotesk", system-ui, sans-serif'
    const pct = `${c.fitPct}%`
    ops.push({
      kind: 'text',
      x: x + colW,
      y: rowY + 50,
      text: pct,
      font: fitFont,
      fill: t.ink2,
      align: 'right',
      baseline: 'alphabetic',
    })
    const ismFont = '600 30px "Noto Sans SC", "PingFang SC", system-ui, sans-serif'
    const ismMax = colW - input.measure(pct, fitFont) - 14
    ops.push({
      kind: 'text',
      x,
      y: rowY + 50,
      text: fitText(c.ism, ismMax, (s) => input.measure(s, ismFont)),
      font: ismFont,
      fill: t.ink,
      align: 'left',
      baseline: 'alphabetic',
    })
    ops.push({ kind: 'line', x1: x, y1: rowY + CHAMP_ROW_H - 18, x2: x + colW, y2: rowY + CHAMP_ROW_H - 18, stroke: t.ruleSoft, lineWidth: 1 })
  })

  return { width: W, height: H, ops }
}

const BIGFIVE_LABEL_FONT = '400 19px "Noto Sans SC", "PingFang SC", system-ui, sans-serif'
const CONSTRUCT_FONT = '400 18px "Noto Sans SC", "PingFang SC", system-ui, sans-serif'

const letterFont = (lead: boolean): string =>
  `${lead ? 700 : 500} 22px "Space Grotesk", system-ui, sans-serif`

function heading(text: string, x: number, y: number, t: ShareTokens, font: string): ShareOp[] {
  return [
    { kind: 'text', x, y, text, font, fill: t.ink, align: 'left', baseline: 'top' },
    { kind: 'line', x1: x, y1: y + 40, x2: SHARE_WIDTH - PAD, y2: y + 40, stroke: t.ruleSoft, lineWidth: 1 },
  ]
}

/** 站点图标：几何取自 `siteMark.ts`，与 Vue 组件同一份点位 */
function markOps(x: number, y: number, size: number, t: ShareTokens): ShareOp[] {
  const k = size / 48
  const at = (p: SharePoint): SharePoint => ({ x: x + p.x * k, y: y + p.y * k })
  return [
    { kind: 'polygon', points: markPoints().map(at), stroke: t.ruleSoft, lineWidth: 1.4 * k },
    {
      kind: 'polygon',
      points: markInnerPoints().map(at),
      fill: t.accent,
      stroke: t.accent,
      lineWidth: 1.6 * k,
    },
    ...markPoints().map((p) => {
      const c = at(p)
      return { kind: 'circle' as const, cx: c.x, cy: c.y, r: 2 * k, fill: t.accent }
    }),
    { kind: 'polygon', points: markSparkPath().map(at), fill: t.rule },
  ]
}

/** 固定种子的星点：同一份结果每次生成同一张图，不会每次点都变样 */
function stars(count: number): Array<{ x: number; y: number; r: number }> {
  let s = 20260928
  const next = (): number => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  return Array.from({ length: count }, () => ({
    // 收进画布内 2%：贴边的星点会被裁掉半个，"白点被切"在成图上很显眼
    x: 0.02 + next() * 0.96,
    y: 0.015 + next() * 0.97,
    r: 0.8 + next() * 1.6,
  }))
}

