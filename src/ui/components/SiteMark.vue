<script setup lang="ts">
/**
 * 站点图标。**手写内联 SVG，不引文件、不引图标库**。
 *
 * 画的是本站自己的东西：一个六轴的雷达轮廓 —— 外圈六边形连着六个顶点，
 * 内圈是"你的形状"，中间一颗星点（六轴对应主义雷达图，星点对应夜晚的天空）。
 * 几何来自 `../result/siteMark.ts`，与分享图的 canvas 绘制**共用同一份点位** ——
 * 两边各画一套必然会在某次调整后长得不一样。
 *
 * 缩放交给 `viewBox`：点位始终按 48×48 算，`width`/`height` 一改就整体缩放。
 * 它只用语义令牌上色，所以两套主题下都成立，不需要为暗色另出一版。
 */
import { computed } from 'vue'
import { MARK_SIZE, markInnerPoints, markPoints, markSparkPath } from '../result/siteMark'

withDefaults(defineProps<{ size?: number }>(), { size: 72 })

const toPoints = (points: { x: number; y: number }[]): string =>
  points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

const outer = computed(() => toPoints(markPoints()))
const inner = computed(() => toPoints(markInnerPoints()))
const spark = computed(() => toPoints(markSparkPath()))
</script>

<template>
  <svg
    class="mark"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${MARK_SIZE} ${MARK_SIZE}`"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <polygon class="ring" :points="outer" />
    <polygon class="shape" :points="inner" />
    <circle v-for="(p, i) in markPoints()" :key="i" class="node" :cx="p.x" :cy="p.y" r="1.5" />
    <polygon class="spark" :points="spark" />
  </svg>
</template>

<style scoped>
.mark {
  display: block;
}

.ring {
  fill: none;
  stroke: var(--rule-soft);
  stroke-width: 1.1;
}

.shape {
  fill: color-mix(in srgb, var(--accent) 20%, transparent);
  stroke: var(--accent);
  stroke-width: 1.4;
  stroke-linejoin: round;
}

.node {
  fill: var(--accent);
}

.spark {
  fill: var(--ink-2);
  opacity: 0.75;
}
</style>
