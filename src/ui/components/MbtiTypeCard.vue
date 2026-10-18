<script setup lang="ts">
/**
 * 类型卡：四字母大字 + 类型名 + 一句说明 + 头像。
 *
 * 四件事按规则做：
 * · **该型的专属色用来写四字母与类型名**（项目所有者裁定：颜色落在名字上，不是顶栏那条线）。
 *   色值由抓取工具按可读性挑（**亮色纸面**上 ≥ 4.5:1，见 `tools/scrape/16p.ts`
 *   的 `pickLegibleSteps`，实测 4.60–13.14:1）。
 * · **暗色主题下必须再修一次**：那批色值是按白底挑的，放到近黑底上实测 16 个**全部**
 *   不达标（1.27–4.02:1）。修正走 `readableTypeColor`，只动显示、不动数据。
 *   参考面取**卡片自己的底色** `--paper-raised`：实测 16 个在白底上最低 4.90:1，
 *   而直接压在页面底色 `--paper` 上的话 ESFJ 只有 4.36:1。
 * · 头像没有就退化成一块该型实色，不留破图；**实色块用原色**，不套可读性修正 ——
 *   它没有文字对比度问题，套了反而变成一片灰。
 * · 只显示抓取到的类型说明原文，不自撰长文（spec §5.3 的娱乐性约束）
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { MbtiTypeView } from '../result/mbti'
import { readableTypeColor } from '../result/typeColor'
import { usePrefsStore } from '../stores/prefs'

const props = defineProps<{ type: MbtiTypeView }>()
const prefs = usePrefsStore()

/**
 * 卡片底色。**从 CSS 令牌现读**，不在 JS 里再抄一份 ——
 * 抄一份就会出现"改了令牌忘了改这里"的静默不一致。
 */
const surface = ref('#ffffff')

function readSurface(): void {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--paper-raised').trim()
  surface.value = value || '#ffffff'
}

onMounted(readSurface)
watch(
  () => prefs.theme,
  async () => {
    await nextTick()
    readSurface()
  },
)

const typeInk = computed(() => readableTypeColor(props.type.colorHex, surface.value))

/** 四字母拆成单字排在一起：字距比整串字母好看，且窄屏能各自换行。 */
const letters = (code: string): string[] => code.split('')
</script>

<template>
  <article
    class="card panel"
    :style="{ '--type-color': props.type.colorHex, '--type-ink': typeInk }"
  >
    <div class="body">
      <div class="text">
        <p class="code num" :aria-label="props.type.fullCode ?? props.type.code">
          <span v-for="(l, i) in letters(props.type.code)" :key="i" class="letter">{{ l }}</span>
          <!-- 后缀是字母 `-A` / `-T`：与 fullCode 逐字一致，读屏与眼睛看到同一个字符串。
               中文极名（坚决 / 摇摆）属于五条维度条里 Identity 那一条，不挪到这里。 -->
          <span class="variant">-{{ props.type.variant }}</span>
        </p>
        <h3 class="name">{{ props.type.name }}</h3>
        <p v-if="props.type.description" class="desc">{{ props.type.description }}</p>
      </div>

      <div class="figure" aria-hidden="true">
        <img v-if="props.type.avatarUrl" class="avatar" :src="props.type.avatarUrl" alt="" />
        <span v-else class="avatar fallback" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
}

.body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-5);
}

.text {
  min-width: 0;
}

/* 该型的专属色就落在这里：四字母与类型名。用的是修正过的 --type-ink，不是原色 */
.code {
  display: flex;
  align-items: baseline;
  gap: 0.02em;
  margin: 0;
  font-size: var(--fs-display);
  line-height: 1;
  letter-spacing: 0.04em;
  color: var(--type-ink);
}

.letter {
  font-weight: 600;
}

.variant {
  font-size: var(--fs-md);
  color: var(--ink-2);
  letter-spacing: 0;
  margin-left: var(--sp-2);
}

.name {
  font-size: var(--fs-xl);
  color: var(--type-ink);
  margin: var(--sp-3) 0 var(--sp-2);
}

.desc {
  margin: 0;
  color: var(--ink-2);
  font-size: var(--fs-sm);
  max-width: var(--measure);
}

.figure {
  flex: 0 0 auto;
}

.avatar {
  display: block;
  width: 96px;
  height: 96px;
  object-fit: contain;
}

.avatar.fallback {
  /* 实色块用原色：它没有文字对比度问题 */
  background: var(--type-color);
}

@media (max-width: 480px) {
  .card {
    padding: var(--sp-4);
  }

  .avatar {
    width: 64px;
    height: 64px;
  }
}
</style>
