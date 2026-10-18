/**
 * 把版式规划器产出的指令序列画到 canvas 上。**这一层只负责执行，不做任何判断** ——
 * 位置、宽度、截断全在 `sharePlan.ts` 里算好并单测过（happy-dom 没有 canvas，
 * 逻辑留在这里就一行都验不了）。
 *
 * 颜色一律从 CSS 令牌**现读**，不在 JS 里再抄一份：抄一份就会出现
 * "改了令牌忘了改这里"的静默不一致（同 `MbtiTypeCard` 读卡片底色的做法）。
 */
import {
  planShareImage,
  type ShareInput,
  type SharePlan,
  type ShareTokens,
} from './sharePlan'

/** canvas 上下文创建不出来时的失败原因，调用方据此给出降级提示 */
export class ShareUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ShareUnavailableError'
  }
}

const token = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/**
 * 把任意 CSS 颜色规范化成 `rgba(r, g, b, a)`。
 *
 * 借 canvas 的 `fillStyle` 做解析：它认得 hex / rgb / hsl 并会把结果规范化回字符串，
 * 手写解析器要覆盖的语法反而更多。`color-mix()` 它不认 —— 所以需要透明度的令牌
 * （面板底色）走"读基础色 + 自己加 alpha"，而不是直接用令牌里那句 `color-mix`。
 */
function toRgba(color: string, alpha: number, ctx: CanvasRenderingContext2D): string {
  const probe = ctx.fillStyle
  ctx.fillStyle = '#000'
  ctx.fillStyle = color
  const normalized = String(ctx.fillStyle)
  ctx.fillStyle = probe

  if (normalized.startsWith('#')) {
    const hex = normalized.slice(1)
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
    const r = Number.parseInt(full.slice(0, 2), 16)
    const g = Number.parseInt(full.slice(2, 4), 16)
    const b = Number.parseInt(full.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
  }

  const nums = normalized.match(/[\d.]+/g)?.map(Number) ?? []
  const r = nums[0] ?? 0
  const g = nums[1] ?? 0
  const b = nums[2] ?? 0
  // 规范化后的字符串本身可能带 alpha（`rgba(...)`），与传入的 alpha 相乘而不是覆盖
  const a = (nums[3] ?? 1) * alpha
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`
}

export function readShareTokens(ctx: CanvasRenderingContext2D): ShareTokens {
  const raised = token('--paper-raised') || '#ffffff'
  return {
    bgFrom: token('--bg-from') || '#f7fafd',
    bgTo: token('--bg-to') || '#dfe8f2',
    glowA: token('--glow-a') || 'transparent',
    glowB: token('--glow-b') || 'transparent',
    ink: token('--ink') || '#0f1720',
    ink2: token('--ink-2') || '#566274',
    rule: token('--rule') || '#93a1b3',
    ruleSoft: token('--rule-soft') || '#d7dee8',
    // 令牌里是 `color-mix(in srgb, var(--rule) 22%, transparent)`，canvas 认不出，
    // 在这里换算成等价的 rgba —— 与页面 `DeviationBars` 的轨道同一个颜色
    ruleTrack: toRgba(token('--rule') || '#93a1b3', 0.22, ctx),
    accent: token('--accent') || '#0c5468',
    accentInk: token('--accent-ink') || '#ffffff',
    starInk: token('--star-ink') || 'transparent',
    panel: toRgba(raised, 0.78, ctx),
    panelBorder: toRgba(token('--hairline') || 'rgba(15,23,32,0.08)', 1, ctx),
  }
}

/**
 * 等字体就位再画。**不等就会画成回退字体**：canvas 不会自己触发字体加载，
 * 而 `document.fonts.ready` 只覆盖"已经被请求过"的字形 —— 分享图用了四个字重，
 * 页面上未必都出现过，所以逐个显式 `load` 一遍。
 */
export async function waitForShareFonts(): Promise<void> {
  const faces = [
    '400 20px "Space Grotesk"',
    '500 20px "Space Grotesk"',
    '600 20px "Space Grotesk"',
    '700 20px "Space Grotesk"',
  ]
  await Promise.all(faces.map((f) => document.fonts.load(f).catch(() => undefined)))
  await document.fonts.ready
}

/** 用同一个上下文量文字，规划器与最终绘制因此是同一把尺子 */
export function makeMeasure(ctx: CanvasRenderingContext2D): (text: string, font: string) => number {
  return (text, font) => {
    ctx.save()
    ctx.font = font
    const w = ctx.measureText(text).width
    ctx.restore()
    return w
  }
}

async function loadImage(href: string): Promise<HTMLImageElement | null> {
  try {
    const img = new Image()
    // 同源资源，不会污染画布，`toBlob` 因此可用
    img.src = href
    await img.decode()
    return img
  } catch {
    // 头像缺失或解码失败：跳过这一条，图的其余部分照画
    return null
  }
}

export async function drawSharePlan(
  ctx: CanvasRenderingContext2D,
  plan: SharePlan,
): Promise<void> {
  // 先把手头的图都解出来，再按顺序画 —— 边画边等会让图层顺序取决于加载速度
  const images = new Map<string, HTMLImageElement>()
  const hrefs = [...new Set(plan.ops.flatMap((op) => (op.kind === 'image' ? [op.href] : [])))]
  await Promise.all(
    hrefs.map(async (href) => {
      const img = await loadImage(href)
      if (img) images.set(href, img)
    }),
  )

  ctx.clearRect(0, 0, plan.width, plan.height)

  for (const op of plan.ops) {
    switch (op.kind) {
      case 'linear-gradient': {
        const grad = ctx.createLinearGradient(op.x0, op.y0, op.x1, op.y1)
        for (const s of op.stops) grad.addColorStop(s.at, s.color)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, plan.width, plan.height)
        break
      }
      case 'radial-glow': {
        const grad = ctx.createRadialGradient(op.cx, op.cy, 0, op.cx, op.cy, op.r)
        grad.addColorStop(0, op.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, plan.width, plan.height)
        break
      }
      case 'circle': {
        ctx.beginPath()
        ctx.arc(op.cx, op.cy, op.r, 0, Math.PI * 2)
        ctx.fillStyle = op.fill
        ctx.fill()
        break
      }
      case 'rect': {
        ctx.beginPath()
        ctx.roundRect(op.x, op.y, op.w, op.h, op.radius)
        if (op.fill) {
          ctx.fillStyle = op.fill
          ctx.fill()
        }
        if (op.stroke) {
          ctx.strokeStyle = op.stroke
          ctx.lineWidth = op.lineWidth ?? 1
          ctx.stroke()
        }
        break
      }
      case 'line': {
        ctx.beginPath()
        ctx.moveTo(op.x1, op.y1)
        ctx.lineTo(op.x2, op.y2)
        ctx.strokeStyle = op.stroke
        ctx.lineWidth = op.lineWidth
        ctx.stroke()
        break
      }
      case 'polygon': {
        ctx.beginPath()
        op.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.closePath()
        if (op.fill) {
          ctx.fillStyle = op.fill
          ctx.fill()
        }
        if (op.stroke) {
          ctx.strokeStyle = op.stroke
          ctx.lineWidth = op.lineWidth ?? 1
          ctx.stroke()
        }
        break
      }
      case 'text': {
        ctx.font = op.font
        ctx.fillStyle = op.fill
        ctx.textAlign = op.align
        ctx.textBaseline = op.baseline
        ctx.fillText(op.text, op.x, op.y)
        break
      }
      case 'image': {
        const img = images.get(op.href)
        if (img) ctx.drawImage(img, op.x, op.y, op.w, op.h)
        break
      }
    }
  }
}

/** 造画布并画出整张分享图。调用方负责把它交给预览或下载。 */
export async function renderShareImage(
  build: (
    measure: (text: string, font: string) => number,
    tokens: ShareTokens,
  ) => Omit<ShareInput, 'measure' | 'tokens'>,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new ShareUnavailableError('canvas 2d context unavailable')
  }
  await waitForShareFonts()
  // 先把尺寸定下来再规划：规划里的量文字与最终绘制用同一把尺子（同一个 ctx）
  const measure = makeMeasure(ctx)
  const tokens = readShareTokens(ctx)
  const plan = planShareImage({ ...build(measure, tokens), measure, tokens })
  canvas.width = plan.width
  canvas.height = plan.height
  // 改 canvas 尺寸会把上下文状态清空，但 drawSharePlan 每条指令都自己设字体与颜色
  await drawSharePlan(ctx, plan)
  return canvas
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}
