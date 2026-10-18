<script lang="ts">
/**
 * 一组"距中点"的偏差条。用于人格五维：分数本身（1–5 的均值）不如图"离中点有多远"直观。
 *
 * `value` 归一化到 [-1, 1]；`unmeasured` 为真时**不画条**，只写"未测量"——
 * 未测量的维度画成 0 会被读成"正好居中"，那是编造。
 *
 * ## 条长是**非线性**的：长度 ∝ √|偏差|
 *
 * 线性的读法有一个真实的观感问题：满格对应理论极端（十道题全部答最极端、且正反题
 * 都朝着同一极），而 IPIP 十分制下"随机或不分化地作答"的原始分标准差只有 **4.6 分**
 * （满分偏移区间是 ±20 分），于是线性的条长通常只有满格的 1/4 —— 五条一起看就像
 * **全部卡在中间**，看着像渲染坏了。
 *
 * 直接缩小"满格"（例如改成 ±10 分）会走向另一个极端：按内容认真作答的人原始分常在
 * 40–45 / 15–20（偏离 10–15 分），**几乎全部顶格**，条就退化成"满或不满"两态。
 *
 * 开方是小偏差放大、大偏差压缩，**两端仍严格对应 ±1**（不夹取、不顶格）：
 * 随机作答（|偏差| ≈ 0.23）从 23% 抬到约 48%，而认真作答的 0.5–0.75 落在 71–87%。
 * 代价是长度不再与偏差成正比，这一点在 UI 规格里写明。
 *
 * 偏差 → 半宽占比（0–50%）。带符号开方，端点不动。
 * 放在普通 `<script>` 块里是为了能被测试直接调用 —— `<script setup>` 不允许 `export`。
 */
export function halfWidthPct(value: number): number {
  const clamped = Math.min(1, Math.max(-1, value))
  return Math.sign(clamped) * Math.sqrt(Math.abs(clamped)) * 50
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  rows: Array<{
    id: string
    label: string
    /** [-1, 1] */
    value: number
    /** 该维实际答了几题 */
    answered: number
    /** 该维总题数 */
    total: number
    unmeasuredLabel: string
    partialLabel: string
  }>
}>()

const rows = computed(() =>
  props.rows.map((r) => ({
    ...r,
    unmeasured: r.answered === 0,
    partial: r.answered > 0 && r.answered < r.total,
    // 半宽的偏移：条从中轴往一侧长
    offset: Math.abs(halfWidthPct(r.value)),
    side: r.value >= 0 ? 'right' : 'left',
  })),
)
</script>

<template>
  <dl class="bars">
    <div v-for="r in rows" :key="r.id" class="row">
      <dt class="label">{{ r.label }}</dt>
      <dd class="track-cell">
        <div v-if="r.unmeasured" class="unmeasured">{{ r.unmeasuredLabel }}</div>
        <div v-else class="track">
          <span class="mid" aria-hidden="true" />
          <span
            class="bar"
            :class="[r.side, { uncertain: r.partial }]"
            :style="r.side === 'right'
              ? { left: '50%', width: `${r.offset}%` }
              : { right: '50%', width: `${r.offset}%` }"
          />
        </div>
        <p v-if="r.partial" class="partial">{{ r.partialLabel }}</p>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.bars {
  margin: 0;
}

.row {
  display: grid;
  grid-template-columns: minmax(6em, 8em) 1fr;
  gap: var(--sp-3);
  align-items: center;
  padding: var(--sp-2) 0;
  border-bottom: 1px solid var(--rule-soft);
}

.row:last-child {
  border-bottom: 0;
}

.label {
  font-size: var(--fs-sm);
  color: var(--ink-2);
}

.track-cell {
  margin: 0;
}

.track {
  position: relative;
  height: 10px;
  background: color-mix(in srgb, var(--rule) 22%, transparent);
}

.mid {
  position: absolute;
  left: 50%;
  top: -2px;
  bottom: -2px;
  width: 1px;
  background: var(--rule);
}

.bar {
  position: absolute;
  top: 0;
  bottom: 0;
  background: var(--accent);
}

.bar.uncertain {
  background: var(--warn);
}

.unmeasured {
  font-size: var(--fs-sm);
  color: var(--ink-2);
}

.partial {
  margin: var(--sp-1) 0 0;
  font-size: var(--fs-xs);
  color: var(--warn);
}
</style>
