<script setup lang="ts">
/**
 * 一屏一题。键盘：`1`–`9` 选择并前进、`←/→` 前后、`Esc` 打开区段跳转。
 *
 * 自动前进的规则：**选了就前进**。346 道题下"选完再点下一题"要多一次点击、
 * 多一次视线移动；要回看用 `←` 或"上一题"。
 */
import { computed, nextTick, ref, watch } from 'vue'
import type { Question } from '../../core/content'
import type { ResponseScale } from '../../core/responses'
import ScaleOptions from './ScaleOptions.vue'

const props = defineProps<{
  question: Question
  scale: ResponseScale
  labels: string[]
  selected: number | null
  index: number
  total: number
  text: string
  groupLabel: string
  questionLabel: string
  prevLabel: string
  nextLabel: string
  jumpLabel: string
  /** 未作答时禁用"下一题"；原因文案由调用方给出 */
  canNext: boolean
  answerHint: string
  canPrev: boolean
  /**
   * 这一题是整卷最后一题（按钮文案因此是"看结果"）。
   * 为真时按钮换成**选中态底色（不透明度抬高）+ 一圈常驻波纹**，见模板里的说明。
   */
  nextIsFinish?: boolean
}>()

const emit = defineEmits<{
  select: [option: number]
  prev: []
  next: []
  openJump: []
}>()

const heading = ref<HTMLElement | null>(null)
const keyCount = computed(() => Math.min(props.scale.count, 9))

/**
 * 点击波纹。**从指针位置扩散**，不是从按钮中心 —— 从中心扩散的波纹在宽按钮上
 * 会显得与点击无关。半径取指针到最远那个角的距离，保证铺满整个按钮。
 *
 * 自己实现而不引库：这是整套 UI 里唯一一个波纹，为此加一个依赖不值得。
 * 时长走 `--dur-ripple`，所以在"减少动态效果"下会归零 —— 与其它交互动效同一口径。
 */
interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

const ripples = ref<Ripple[]>([])
let rippleSeq = 0

/** 一条波纹从生成到动画结束的存活时间，与 `--dur-ripple` 对齐并留一点余量 */
const RIPPLE_TTL = 640

function spawnRipple(event: MouseEvent): void {
  const el = event.currentTarget as HTMLElement | null
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const size = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y))
  const id = (rippleSeq += 1)
  ripples.value = [...ripples.value, { id, x, y, size }]
  window.setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id)
  }, RIPPLE_TTL)
}

/** 键盘触发（回车/空格）时 `clientX/Y` 是 0，波纹会跑到左上角去，故跳过 */
function onFinishClick(event: MouseEvent): void {
  if (event.clientX !== 0 || event.clientY !== 0) spawnRipple(event)
  emit('next')
}

function pick(option: number): void {
  if (option < 0 || option >= props.scale.count) return
  emit('select', option)
}

function onKeydown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement | null
  // 焦点在按钮或链接上时不抢键盘：那会让"回车激活按钮"之类的基本操作失效
  if (target && ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

  if (event.key === 'Escape') {
    emit('openJump')
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    emit('prev')
    return
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    emit('next')
    return
  }
  const n = Number(event.key)
  if (Number.isInteger(n) && n >= 1 && n <= keyCount.value) {
    event.preventDefault()
    pick(n - 1)
  }
}

// 换题后把焦点移到题干标题：读屏会从新题开始念，键盘用户也不会"停在上一题的位置"
watch(
  () => props.question.id,
  async () => {
    await nextTick()
    heading.value?.focus()
  },
  { immediate: true },
)
</script>

<template>
  <section class="card" @keydown="onKeydown">
    <p class="meta">
      <span class="counter num">{{ questionLabel }}</span>
    </p>
    <!-- 换题时播报：读屏用户需要知道"现在是第几题"，否则每次操作都没有反馈 -->
    <h1 ref="heading" class="stem" tabindex="-1" aria-live="polite">{{ text }}</h1>
    <ScaleOptions
      :scale="scale"
      :selected="selected"
      :labels="labels"
      :group-label="groupLabel"
      @select="pick"
    />
    <div class="nav">
      <!-- 左：浏览题目；右：上一题 / 下一题（项目所有者裁定的两端对齐） -->
      <button type="button" class="jump" @click="emit('openJump')">{{ jumpLabel }}</button>
      <div class="steps">
        <button type="button" :disabled="!canPrev" @click="emit('prev')">{{ prevLabel }}</button>
        <!--
          最后一题上这颗按钮就是「看结果」，它要**看起来可以按下去**：
          · 底色换成"选中态"，并且不透明度比普通选中项更高（`.finish`）
          · 一圈常驻波纹从按钮边缘扩散（`::after`，氛围动效，任何环境都动）
          · 点击时从指针位置再扩散一圈（`.ripple`，交互动效，减少动态时归零）

          波纹只在**可按**（`:not(:disabled)`）时出现：给一颗点不动的按钮画波纹
          是在邀请一次不会发生的点击。未作答时按钮仍是禁用态，旁边有"先选一个"的提示。
        -->
        <button
          type="button"
          class="next"
          :class="{ finish: nextIsFinish }"
          :disabled="!canNext"
          @click="nextIsFinish ? onFinishClick($event) : emit('next')"
        >
          <span class="clip" aria-hidden="true">
            <span
              v-for="r in ripples"
              :key="r.id"
              class="ripple"
              :style="{ left: `${r.x}px`, top: `${r.y}px`, width: `${r.size}px`, height: `${r.size}px` }"
            />
          </span>
          <span class="next-label">{{ nextLabel }}</span>
        </button>
      </div>
    </div>
    <p v-if="!canNext" class="hint">{{ answerHint }}</p>
  </section>
</template>

<style scoped>
.stem {
  font-size: var(--fs-xl);
  font-weight: 500;
  max-width: 40ch;
  margin: var(--sp-2) 0 0;
}

.stem:focus {
  outline: none;
}

.meta {
  margin: 0;
}

.counter {
  color: var(--ink-2);
  font-size: var(--fs-sm);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-top: var(--sp-5);
}

.steps {
  display: flex;
  gap: var(--sp-3);
}

/*
 * 「看结果」：选中态底色 + 抬高的不透明度。
 * 与选中项同一套语言（`--accent-soft` + 强调色描边），只是底更实 ——
 * 用户已经读完 358 道题，"可以看结果了"这件事值得比一个普通选中项更明确。
 */
.next {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.next.finish:not(:disabled) {
  background: var(--accent-strong);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 500;
  box-shadow: inset 0 0 0 1px var(--accent), var(--shadow-soft);
}

/* 常驻波纹：从按钮边缘向外扩散一圈。氛围动效，任何环境都动（同背景层） */
.next.finish:not(:disabled)::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  border: 1px solid var(--accent);
  pointer-events: none;
  animation: finish-ring var(--ambient-ring) ease-out infinite;
}

@keyframes finish-ring {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  70%,
  100% {
    transform: scale(1.28);
    opacity: 0;
  }
}

/* 点击波纹：内层裁剪，按钮本身因此可以保留 `overflow: visible` 给常驻波纹用 */
.clip {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.28;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple-out var(--dur-ripple) var(--ease) forwards;
}

@keyframes ripple-out {
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

.next-label {
  position: relative;
}

.jump {
  color: var(--ink-2);
}

.hint {
  margin: var(--sp-2) 0 0;
  font-size: var(--fs-sm);
  color: var(--warn);
}

/* 窄屏：换行时主操作在上、浏览在下；两颗按钮各占一半，手指够得着 */
@media (max-width: 560px) {
  .nav {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .steps button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .stem {
    font-size: var(--fs-lg);
  }
}
</style>
