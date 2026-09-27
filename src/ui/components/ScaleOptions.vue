<script setup lang="ts">
/**
 * 选项组。**按 `scale.count` 渲染，卡片不自己判断层** —— 主义层 6 点、人格层 5 点、
 * 风格层 7 点，三者不可混用（别的层的索引在本层会被判越界丢弃）。
 *
 * 原生 `<button>` 而不是 `<div onclick>`：键盘可达与焦点样式是免费的（旧版就是
 * 在这一点上不可用）。`role="radiogroup"` + `role="radio"` + `aria-checked`
 * 让读屏能理解"单选"语义。
 *
 * 排布是**竖排、一行一个**（项目所有者裁定）：一行一个时选项标签不用挤成两行，
 * 鼠标扫过的目标也更大。悬停只做「上浮 2px + 淡阴影」，**包在 `@media (hover: hover)` 里** ——
 * 触屏上 `:hover` 会粘住，点完一项它一直浮着，看起来像没选中。
 */
import { computed } from 'vue'
import type { ResponseScale } from '../../core/responses'

const props = defineProps<{
  scale: ResponseScale
  selected: number | null
  /** 已翻译好的选项标签，按索引排列 */
  labels: string[]
  groupLabel: string
}>()

const emit = defineEmits<{ select: [option: number] }>()

const options = computed(() =>
  Array.from({ length: props.scale.count }, (_, i) => ({
    index: i,
    label: props.labels[i] ?? `#${i + 1}`,
  })),
)
</script>

<template>
  <div class="scale" role="radiogroup" :aria-label="groupLabel">
    <button
      v-for="opt in options"
      :key="opt.index"
      type="button"
      role="radio"
      :aria-checked="selected === opt.index"
      :class="{ picked: selected === opt.index }"
      :data-option="opt.index"
      @click="emit('select', opt.index)"
    >
      <span class="key num" aria-hidden="true">{{ opt.index + 1 }}</span>
      <span class="text">{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.scale {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin: var(--sp-6) 0;
}

button {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-align: left;
  padding: var(--sp-3) var(--sp-4);
  line-height: var(--lh-tight);
  border-radius: var(--radius-panel);
  /* 悬停的位移与阴影都靠这两条过渡 */
  transition:
    transform var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease);
}

@media (hover: hover) {
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lift);
  }
}

/* 键盘走查时也要看得出"当前这一项"，不能只有鼠标有反馈 */
button:focus-visible {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lift);
}

.picked {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: inset 0 0 0 1px var(--accent);
}

/* 选项序号：竖排之后它是唯一的对齐轴，宽度固定住，长短不一的标签才不会参差 */
.key {
  flex: none;
  width: 1.4em;
  text-align: center;
  font-size: var(--fs-sm);
  color: var(--ink-2);
}

.picked .key {
  color: var(--accent);
}

.text {
  font-size: var(--fs-md);
}

@media (max-width: 480px) {
  button {
    padding: var(--sp-3);
  }

  .text {
    font-size: var(--fs-sm);
  }
}
</style>
