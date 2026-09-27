<script setup lang="ts">
/**
 * 进度条。ARIA 的 progressbar 角色是硬要求（总 spec §7.4）：
 * 视觉上的进度条对读屏用户完全不可见，没有 aria-valuenow 就等于没有进度。
 */
const props = defineProps<{
  answered: number
  total: number
  label: string
}>()

const percent = () => (props.total > 0 ? Math.round((props.answered / props.total) * 100) : 0)
</script>

<template>
  <div class="progress">
    <div class="head">
      <span class="label">{{ label }}</span>
      <span class="count num">{{ answered }} / {{ total }}</span>
    </div>
    <div
      class="track"
      role="progressbar"
      :aria-valuenow="answered"
      :aria-valuemin="0"
      :aria-valuemax="total"
      :aria-label="label"
      :aria-valuetext="`${answered} / ${total}`"
    >
      <div class="fill" :style="{ width: `${percent()}%` }" />
    </div>
  </div>
</template>

<style scoped>
.progress {
  margin-bottom: var(--sp-4);
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--sp-3);
  margin-bottom: var(--sp-2);
}

.count {
  font-size: var(--fs-sm);
  color: var(--ink-2);
}

.track {
  height: 3px;
  background: var(--rule-soft);
}

.fill {
  height: 100%;
  background: var(--accent);
  transition: width var(--dur-base) var(--ease);
}
</style>
