<script setup lang="ts">
/**
 * 模态对话框。**浏览题目与分享预览共用同一个** —— 焦点圈、背景锁滚动、
 * 焦点归还这三件事写两遍必然有一遍漏掉，而漏掉的表现是"读屏用户掉到页面开头"
 * 这种只有用键盘才发现的形态。
 *
 * 四条行为都在这里：
 * 1. 打开时焦点进对话框
 * 2. `Tab` 在窗口内循环（写了 `aria-modal="true"` 就欠着这一条 ——
 *    等于向读屏声明"外面都不存在"，而浏览器照旧按文档顺序 tab）
 * 3. 背景锁滚动：不锁的话滚轮会让底层页面动，而对话框看着没反应
 * 4. 关闭时焦点**回到打开它的那个元素**（浏览器对 `position: fixed` 的覆盖层
 *    不会自动做这件事）
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * `closable` **必须给默认值**：类型里写成 `boolean` 时 Vue 会把缺省的 prop 转成 `false`
 * （不是 `undefined`），于是"不传就等于不要关闭按钮"，浏览题目那颗按钮会凭空消失。
 * 这个坑的表现是"另一处调用方的按钮没了"，与改动的地方隔着好几个文件。
 */
const props = withDefaults(
  defineProps<{
    title: string
    closeLabel: string
    /** 对话框自身的 aria-label；省略时用 title */
    ariaLabel?: string
    /**
     * 窄窗。默认 46rem 是给"题号网格"那种横向铺开的内容用的；
     * 分享预览里是一张 9:16 的竖图，按 46rem 撑开会在两侧留一大片空白。
     */
    narrow?: boolean
    /**
     * 头部是否带关闭按钮。**分享预览传 false** —— 那颗弹窗底部自己有"保存图片 / 关闭"
     * 一组操作，头部再放一个就成了两个关闭按钮，屏幕上一模一样的两个字。
     * 浏览题目没有自己的操作区，靠的就是头部这颗。
     */
    closable?: boolean
  }>(),
  { closable: true },
)

const emit = defineEmits<{ close: [] }>()

const panelEl = ref<HTMLElement | null>(null)
/** 打开前焦点所在的元素。关闭时必须还给它。 */
let returnFocus: HTMLElement | null = null

/**
 * 锁背景滚动与焦点归还都在**生命周期**里做，不要写成 `watch(panelEl)` ——
 * 卸载时 watcher 已经停了，那个分支根本不会执行，而症状是"关掉之后焦点没了"。
 */
const previousOverflow = document.body.style.overflow

onMounted(async () => {
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  document.body.style.overflow = 'hidden'
  await nextTick()
  panelEl.value?.focus()
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow
  returnFocus?.focus()
  returnFocus = null
})

function close(): void {
  emit('close')
}

/**
 * `Esc` 关闭，`Tab` 在窗口内循环。
 * 焦点圈不是可选项：不圈住的话键盘用户会 tab 到遮罩背后那些看不见的控件上。
 */
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    close()
    return
  }
  if (event.key !== 'Tab' || !panelEl.value) return
  const focusables = [...panelEl.value.querySelectorAll<HTMLElement>('button:not([disabled])')]
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (!first || !last) return
  const active = document.activeElement
  const atEdge =
    active === panelEl.value || (event.shiftKey ? active === first : active === last)
  if (!atEdge) return
  event.preventDefault()
  if (event.shiftKey) last.focus()
  else first.focus()
}

/** 开着的时候锁住背景滚动；关掉就还原（不写死 overflow，避免覆盖别的样式）。 */
</script>

<template>
  <div class="backdrop" @click.self="close">
    <div
      ref="panelEl"
      class="modal"
      :class="{ narrow: props.narrow }"
      role="dialog"
      aria-modal="true"
      :aria-label="props.ariaLabel ?? props.title"
      tabindex="-1"
      @keydown="onKeydown"
    >
      <div class="head">
        <h2 class="title">{{ props.title }}</h2>
        <button
          v-if="props.closable"
          type="button"
          class="close"
          data-test="modal-close"
          @click="close"
        >
          {{ props.closeLabel }}
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: var(--scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--page-pad);
}

.modal {
  width: min(100%, 46rem);
  max-height: min(88vh, 52rem);
  display: flex;
  flex-direction: column;
  background: var(--paper-raised);
  border: 1px solid var(--rule);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow-lift);
  padding: var(--sp-5);
}

.modal:focus {
  outline: none;
}

.modal.narrow {
  width: min(100%, 30rem);
}

.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-4);
}

.title {
  font-size: var(--fs-lg);
}

.close {
  padding: var(--sp-1) var(--sp-3);
  font-size: var(--fs-sm);
  color: var(--ink-2);
}

@media (max-width: 480px) {
  .modal {
    padding: var(--sp-4);
  }
}
</style>
