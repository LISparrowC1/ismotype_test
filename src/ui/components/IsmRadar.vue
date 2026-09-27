<script lang="ts">
/**
 * 几何常量放在普通 `<script>` 里导出：**测试要按同一个值验半径**。
 * `<script setup>` 不允许 `export`，而测试里再抄一份常量就是第二个真相源 ——
 * 调大半径那次立刻让两条断言无声地失败。`DeviationBars.vue` 的 `halfWidthPct` 同理。
 */
export const RADAR_RADIUS = 78
/** 图占整个绘图区宽度的比例；剩下的横向空间留给轴端标签 */
export const RADAR_CHART_RATIO = 0.48
/**
 * 标签锚点所在的半径，占绘图区的比例。
 * 必须 > `RADAR_CHART_RATIO / 2 ÷ cos30°`（≈ 1.155 倍），否则锚点会落到六边形顶点里面。
 * 这两条同时决定图能画多大：图占比越大，锚点与标签的可用带就越窄。当前取值下
 * 图直径约 211px、两侧各留 ~25% 给标签（440px 的柱子下约 110px，英文最长的一批名能单行放下）。
 */
export const RADAR_LABEL_RADIUS = 0.29
</script>

<script setup lang="ts">
/**
 * 主义雷达图：一个领域的前六名，六条轴按名次排（第 1 名在正上方，顺时针）。
 *
 * 四个口径决定，都写在这里免得后来的人猜：
 *
 * 1. **轴 = 该领域的前六名主义，值 = 契合度百分比**（项目所有者裁定）。
 *    这意味着**不同用户的轴不一样**，图与图之间只在同一份结果内部可比 ——
 *    它不回答"你比谁更像"，只回答"我在这个领域的偏好是尖的还是平的"。
 * 2. **径向固定 0–100%，不放大**。放大（比如 40–70%）能让形状更好看，但会丢掉
 *    "这个领域前六名全都挤在 50% 附近"这个信息。实测单张图内跨度 10–25 个百分点，
 *    固定刻度下形状已经读得出来。
 * 3. **轴端标主义名，不标 1–6 的数字**（项目所有者裁定）。名次靠位置表达。
 * 4. **标签是 HTML、绝对定位在 SVG 外面，不是 SVG 里的 `<text>`**。
 *
 * 第 4 条是踩出来的：SVG 的用户单位随渲染尺寸整体缩放，**写在 SVG 里的字号跟着缩放** ——
 * 中英文名长短不同 → 视框宽窄不同 → 同一份代码在中文页面渲出 13px、英文页面渲出 9.7px，
 * 连图的大小都跟着语言变。改成 HTML 之后字号由 CSS 定死，名太长交给 CSS 换行，
 * 不必在 JS 里估算字符宽度再截断。
 *
 * 手写内联 SVG，不引图表库 —— 与频谱条、维度条同一套做法。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 前六名的契合度百分比，按名次排；不足六个就按实际个数画 */
    values: number[]
    /** 与 `values` 同序的主义名，标在轴端 */
    labels: string[]
    /** 读屏替代文本：由调用方翻译好，包含全部名次与百分比 */
    label: string
    caption: string
  }>(),
  {},
)

const R = RADAR_RADIUS
const RINGS = [0.25, 0.5, 0.75]

/** 轴序固定：第 1 名在正上方（−90°），顺时针 */
const axisCount = computed(() => Math.max(props.values.length, 3))
const angleOf = (i: number): number => ((-90 + (360 / axisCount.value) * i) * Math.PI) / 180
const at = (i: number, radius: number): { x: number; y: number } => ({
  x: radius * Math.cos(angleOf(i)),
  y: radius * Math.sin(angleOf(i)),
})

const spokes = computed(() =>
  Array.from({ length: axisCount.value }, (_, i) => {
    const p = at(i, R)
    return { x1: 0, y1: 0, x2: p.x, y2: p.y }
  }),
)

/** 网格环：用多边形而不是圆，与六边形的坐标系一致，读数时不会看歪 */
const rings = computed(() =>
  RINGS.map((k) => ({
    k,
    points: Array.from({ length: axisCount.value }, (_, i) => {
      const p = at(i, R * k)
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    }).join(' '),
  })),
)

const frame = computed(() =>
  Array.from({ length: axisCount.value }, (_, i) => {
    const p = at(i, R)
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' '),
)

const shape = computed(() =>
  props.values
    .map((v, i) => {
      const p = at(i, (Math.min(100, Math.max(0, v)) / 100) * R)
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    })
    .join(' '),
)

const nodes = computed(() =>
  props.values.map((v, i) => {
    const p = at(i, (Math.min(100, Math.max(0, v)) / 100) * R)
    return { x: p.x, y: p.y, value: v, label: props.labels[i] ?? '', rank: i + 1 }
  }),
)

/** SVG 视框：以圆心为原点，边长正好是外接圆直径 */
const viewBox = `${-R} ${-R} ${R * 2} ${R * 2}`

/**
 * 轴端标签的定位。锚点在 `RADAR_LABEL_RADIUS` 半径上，横竖都用百分比 ——
 * 绘图区是正方形，同一个半径在 x、y 上就是同一个百分比。
 * 位移按象限分：正上/正下的水平居中并整体贴到锚点之外，左右两侧分别靠外对齐。
 */
const axisLabels = computed(() =>
  Array.from({ length: axisCount.value }, (_, i) => {
    const a = angleOf(i)
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    const vertical =
      sin < -0.7 ? 'translate(-50%, -100%)' : sin > 0.7 ? 'translate(-50%, 0)' : 'translateY(-50%)'
    const horizontal = cos > 0.15 ? 'translateX(0)' : cos < -0.15 ? 'translateX(-100%)' : ''
    return {
      n: i + 1,
      text: props.labels[i] ?? '',
      /** 正上/正下这两条上下都有空间，可以放宽；两侧的更窄 */
      wide: Math.abs(cos) < 0.15,
      style: {
        left: `${(50 + RADAR_LABEL_RADIUS * 100 * cos).toFixed(3)}%`,
        top: `${(50 + RADAR_LABEL_RADIUS * 100 * sin).toFixed(3)}%`,
        transform: [horizontal, vertical].filter(Boolean).join(' '),
      },
    }
  }),
)
</script>

<template>
  <figure class="radar">
    <div class="plot">
      <!-- 比例从 `<script>` 里的常量传进来，CSS 不再抄一份 —— 两边写死会各自漂移 -->
      <svg
        class="chart"
        :style="{ '--chart-ratio': RADAR_CHART_RATIO }"
        :viewBox="viewBox"
        role="img"
        :aria-label="label"
      >
        <polygon class="grid" :points="frame" />
        <polygon v-for="ring in rings" :key="ring.k" class="ring" :points="ring.points" />
        <line
          v-for="(s, i) in spokes"
          :key="i"
          class="spoke"
          :x1="s.x1"
          :y1="s.y1"
          :x2="s.x2"
          :y2="s.y2"
        />

        <polygon class="shape" :points="shape" />

        <circle v-for="n in nodes" :key="n.rank" class="node" :cx="n.x" :cy="n.y" r="2.6">
          <title>{{ `${n.rank}. ${n.label} ${n.value}%` }}</title>
        </circle>
      </svg>

      <!--
        轴端标签。**`aria-hidden`**：图形本身已经是 `role="img"` 且带一句含全部
        名次与百分比的替代文本，这些名字再念一遍只是重复。
      -->
      <span
        v-for="t in axisLabels"
        :key="t.n"
        class="axis"
        :class="{ wide: t.wide }"
        :style="t.style"
        aria-hidden="true"
      >
        {{ t.text }}
      </span>
    </div>
    <figcaption class="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.radar {
  margin: 0 auto;
  width: 100%;
  max-width: 440px;
}

/* 正方形绘图区：图居中占 `--chart-ratio`，四周留给轴端标签 */
.plot {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}

.chart {
  position: absolute;
  /* 居中：两边各留 (100% − 图宽) / 2 */
  left: calc((100% - var(--chart-ratio) * 100%) / 2);
  top: calc((100% - var(--chart-ratio) * 100%) / 2);
  width: calc(var(--chart-ratio) * 100%);
  height: calc(var(--chart-ratio) * 100%);
}

.grid {
  fill: none;
  stroke: var(--rule);
  stroke-width: 1;
}

.ring {
  fill: none;
  stroke: var(--rule-soft);
  stroke-width: 1;
  stroke-dasharray: 3 4;
}

.spoke {
  stroke: var(--rule-soft);
  stroke-width: 1;
}

.shape {
  fill: color-mix(in srgb, var(--accent) 22%, transparent);
  stroke: var(--accent);
  stroke-width: 1.6;
  stroke-linejoin: round;
}

.node {
  fill: var(--accent);
  stroke: var(--paper-raised);
  stroke-width: 1;
}

.axis {
  position: absolute;
  /* 两侧标签的可用带 = 50% − 锚点横坐标；写大了会溢出柱子 */
  max-width: 28%;
  font-size: var(--fs-xs);
  line-height: 1.25;
  color: var(--ink-2);
  /* 名字长就换行；英文最长 21 字，实测两行够，不需要截断。
     `hyphens` 要开着：只给 `break-word` 会把 Internationalism 断成
     "Internationalis / m"，带连字符才是正常的英文断行（`<html lang>` 由
     `setLocale` 同步，浏览器据此选词典）。 */
  overflow-wrap: break-word;
  hyphens: auto;
}

.axis.wide {
  max-width: 46%;
  text-align: center;
}

.caption {
  margin-top: var(--sp-2);
  font-size: var(--fs-xs);
  color: var(--ink-2);
}

@media (max-width: 900px) {
  .radar {
    max-width: 340px;
  }
}
</style>

