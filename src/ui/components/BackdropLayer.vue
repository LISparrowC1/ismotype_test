<script setup lang="ts">
/**
 * 背景层：白天光晕、夜晚星点。
 *
 * 三条约束：
 * 1. **`aria-hidden` + `pointer-events: none`**：它是装饰，不能被读屏念出来，
 *    也不能挡住任何点击。层级靠 `z-index: 0` 与 `.app-shell` 的 `z-index: 1` 分开。
 * 2. **星点位置是算出来的、不是随机的**：伪随机用固定种子，只在模块初始化时算一次。
 *    否则每次组件重渲染星点都会跳一下 —— 那是看得见的抖动，不是"闪烁"。
 * 3. **动画时长走 `--ambient-*`，不跟 `prefers-reduced-motion`**：
 *    项目所有者裁定背景在所有环境都照常动（UI 规格 §4.4）。
 *    这不是漏接令牌，`tokens.css` 里两套时长是分开命名的，就为了让这件事显式。
 */
import { computed } from 'vue'
import { usePrefsStore } from '../stores/prefs'

const prefs = usePrefsStore()

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  /** 闪烁周期的相位偏移（0–1），让整片星不在一起呼吸 */
  phase: number
  halo: boolean
}

/** 线性同余，固定种子 —— 每次构建出的星空都一样 */
function makeStars(count: number, seed: number): Star[] {
  let s = seed
  const next = (): number => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  return Array.from({ length: count }, () => {
    const brightness = next()
    return {
      x: next() * 100,
      y: next() * 100,
      size: 0.8 + next() * 1.5,
      opacity: 0.25 + brightness * 0.6,
      phase: next(),
      halo: brightness > 0.82,
    }
  })
}

const stars = makeStars(92, 20260927)

/** 亮色主题下不渲染星点：它们本来也是透明的，省掉 92 个节点的动画开销 */
const isDark = computed(() => prefs.theme === 'dark')
</script>

<template>
  <div class="backdrop" aria-hidden="true">
    <div class="sky" />

    <!-- 光晕：三层不同周期与相位的径向渐变，缓慢漂移；暗色下变成星云 -->
    <div class="glow glow-a" />
    <div class="glow glow-b" />
    <div class="glow glow-c" />

    <template v-if="isDark">
      <div class="stars">
        <span
          v-for="(star, i) in stars"
          :key="i"
          class="star"
          :class="{ halo: star.halo }"
          :style="{
            left: star.x + '%',
            top: star.y + '%',
            width: star.size + 'px',
            height: star.size + 'px',
            opacity: star.opacity,
            animationDelay: `calc(${-star.phase} * var(--ambient-twinkle))`,
          }"
        />
      </div>
      <!-- 偶尔划过的一道：周期远长于闪烁，出现得越少越像"偶尔" -->
      <span class="shooting" />
    </template>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: linear-gradient(168deg, var(--bg-from) 0%, var(--bg-to) 100%);
}

.glow {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* 暖日光晕：白天的主角 */
.glow-a {
  width: 78vmax;
  height: 78vmax;
  top: -34vmax;
  left: -18vmax;
  background: radial-gradient(circle, var(--glow-a) 0%, transparent 62%);
  animation: drift-a var(--ambient-drift) ease-in-out infinite alternate;
}

/* 冷天光：从右下斜掠 */
.glow-b {
  width: 64vmax;
  height: 64vmax;
  right: -22vmax;
  bottom: -26vmax;
  background: radial-gradient(circle, var(--glow-b) 0%, transparent 60%);
  animation: drift-b calc(var(--ambient-drift) * 1.35) ease-in-out infinite alternate;
}

/* 中间一层极淡的补光，让两团之间有过渡而不是两个孤岛 */
.glow-c {
  width: 92vmax;
  height: 92vmax;
  top: 8vmax;
  left: 22vmax;
  background: radial-gradient(circle, var(--glow-c) 0%, transparent 70%);
  animation: drift-c calc(var(--ambient-drift) * 0.8) ease-in-out infinite alternate;
}

.stars {
  position: absolute;
  inset: 0;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: var(--star-ink);
  animation: twinkle var(--ambient-twinkle) ease-in-out infinite;
}

.star.halo {
  box-shadow: 0 0 6px color-mix(in srgb, var(--star-ink) 70%, transparent);
}

/* 划过的一道：只在右上到左下这条斜线上出现 */
.shooting {
  position: absolute;
  top: 12%;
  left: 68%;
  width: 140px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--star-ink));
  opacity: 0;
  transform: rotate(158deg);
  animation: shoot var(--ambient-shoot) linear infinite;
}

@keyframes drift-a {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(8vmax, 6vmax, 0) scale(1.12);
  }
}

@keyframes drift-b {
  from {
    transform: translate3d(0, 0, 0) scale(1.08);
  }
  to {
    transform: translate3d(-7vmax, -5vmax, 0) scale(1);
  }
}

@keyframes drift-c {
  from {
    transform: translate3d(0, 0, 0) scale(0.96);
  }
  to {
    transform: translate3d(-6vmax, 4vmax, 0) scale(1.06);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
  }
}

@keyframes shoot {
  0%,
  86% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(158deg);
  }
  88% {
    opacity: 0.9;
  }
  97% {
    opacity: 0;
    transform: translate3d(-46vw, 22vh, 0) rotate(158deg);
  }
  100% {
    opacity: 0;
    transform: translate3d(-46vw, 22vh, 0) rotate(158deg);
  }
}

/* 手机上把光晕缩小、星点减半：动效在窄屏上既费电又抢注意力 */
@media (max-width: 768px) {
  .glow-a,
  .glow-b,
  .glow-c {
    width: 120vw;
    height: 120vw;
  }

  .star:nth-child(2n) {
    display: none;
  }

  .shooting {
    display: none;
  }
}
</style>
