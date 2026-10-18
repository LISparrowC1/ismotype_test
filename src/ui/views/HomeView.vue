<script setup lang="ts">
/**
 * 首页。只说必要的事：这是什么、分几段各多少题、要花多久。
 *
 * **不放元信息说明**（项目所有者裁定删掉了原先的介绍段、量表说明段与"不收集数据"那句）：
 * 页面上不解释自己怎么算、不写免责声明，只留用户开始前真正需要的信息。
 * 量表会在切段时提示（见 `blocks.ts` 的 `noteKeys`），不必在这里预告。
 */
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BLOCKS, TOTAL_QUESTIONS } from '../blocks'
import { usePrefsStore } from '../stores/prefs'
import { useQuizStore } from '../stores/quiz'
import SiteMark from '../components/SiteMark.vue'

const { t } = useI18n()
const router = useRouter()
const quiz = useQuizStore()
const prefs = usePrefsStore()

/** 每题按 3 秒估。取整到分钟。 */
const minutes = computed(() => Math.round((TOTAL_QUESTIONS * 3) / 60))
const hasProgress = computed(() => quiz.progress.answered > 0)
const lengthNote = computed(() =>
  t('ui.home.lengthNote', { n: TOTAL_QUESTIONS, min: minutes.value }),
)
const resumeNote = computed(() => t('ui.home.resumeHint', { n: quiz.progress.answered }))

function start(): void {
  quiz.reset()
  // 清空作答后仍要能进答题段：守卫看的是"开始过没有"，不是"答了几题"
  prefs.markBegun()
  void router.push({ name: 'quiz', params: { block: BLOCKS[0]!.id } })
}

function resume(): void {
  prefs.markBegun()
  void router.push({ name: 'quiz', params: { block: quiz.firstIncompleteBlock() } })
}

/* ---- 清除本地数据 ---- */

/** 本地存着作答或偏好时才显示 —— 全新访客没有东西可清 */
const canClear = computed(() => hasProgress.value || prefs.stored)
/** 两下确认：清掉作答不可撤销，一次点击就删太容易误触 */
const confirming = ref(false)
let disarm: number | undefined

function onClear(): void {
  if (!confirming.value) {
    confirming.value = true
    // 走过神就别一直架着：几秒后自己放下
    window.clearTimeout(disarm)
    disarm = window.setTimeout(() => {
      confirming.value = false
    }, 6000)
    return
  }
  window.clearTimeout(disarm)
  confirming.value = false
  // 两份存档各由自己的 store 清：作答归 quiz，语言/主题/开始标记归 prefs
  quiz.reset()
  prefs.clearAll()
  // **重载而不是就地重置主题**：那条"没选过就按系统偏好"的规则只在 index.html 的
  // 引导脚本里有一份，就地重算等于把它抄第二遍。重载后用户看到的就是全新状态。
  window.location.reload()
}

onBeforeUnmount(() => window.clearTimeout(disarm))
</script>

<template>
  <main id="main" class="page page-center home">
    <!--
      居中 hero：图标在站名上面、站名在页面正中。**只有首页这么做**
      （其余页面用页头的小号站名），否则手机上大标题会顶掉半屏题干。
      h1 是**站名**而不是"开始之前"那类页面标签 —— 页面标签由副标题与按钮已经说清了。
    -->
    <div class="hero">
      <SiteMark class="mark" :size="88" />
      <h1 class="site">{{ t('ui.app.title') }}</h1>
      <p class="lede">{{ t('ui.app.tagline') }}</p>
    </div>

    <dl class="facts">
      <div v-for="b in BLOCKS" :key="b.id" class="fact">
        <dt>{{ t(b.titleKey) }}</dt>
        <dd class="num">{{ quiz.progress.perBlock[b.id].total }}</dd>
      </div>
    </dl>

    <p class="length">{{ lengthNote }}</p>

    <div class="actions">
      <button v-if="hasProgress" type="button" class="primary" @click="resume">
        {{ t('ui.home.resume') }}
      </button>
      <button type="button" :class="{ primary: !hasProgress }" @click="start">
        {{ hasProgress ? t('ui.home.restart') : t('ui.home.start') }}
      </button>
    </div>

    <p v-if="hasProgress" class="length">{{ resumeNote }}</p>

    <!--
      清除本地数据：本地存着作答或偏好时才出现，且要**点两下**才真的删。
      作答（`ismotype:progress:v1`）与偏好（`ismotype:prefs:v1`）都在浏览器的 localStorage 里，
      而 localStorage **按源隔离**，换成别的端口或别的浏览器就看不到它们 ——
      所以给一个自己能清的入口。
    -->
    <div v-if="canClear" class="clear-cell">
      <button
        type="button"
        class="clear"
        :class="{ armed: confirming }"
        data-test="clear-data"
        @click="onClear"
      >
        {{ confirming ? t('ui.home.clearConfirm') : t('ui.home.clear') }}
      </button>
      <p v-if="confirming" class="clear-hint" role="status">{{ t('ui.home.clearHint') }}</p>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: var(--sp-5);
  padding-top: var(--sp-7);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
}

.mark {
  margin-bottom: var(--sp-1);
}

.site {
  font-family: var(--font-latin);
  font-size: var(--fs-hero);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.05;
}

.lede {
  font-size: var(--fs-lg);
  color: var(--ink-2);
  margin: 0;
  max-width: 24ch;
}

.facts {
  display: flex;
  gap: var(--sp-6);
  margin: 0;
  justify-content: center;
}

.fact {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--sp-1);
}

.fact dt {
  color: var(--ink-2);
  font-size: var(--fs-sm);
}

.fact dd {
  margin: 0;
  font-size: var(--fs-2xl);
  line-height: 1;
  font-weight: 500;
}

.length {
  margin: 0;
  color: var(--ink-2);
  font-size: var(--fs-sm);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  justify-content: center;
}

.actions button {
  padding: var(--sp-3) var(--sp-6);
}

.primary {
  border-color: transparent;
  background: var(--accent);
  color: var(--accent-ink);
}

.primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--accent) 85%, var(--ink));
  border-color: transparent;
  color: var(--accent-ink);
}

/* 清除本地数据：低调的一行小字，不与开始/继续争视线 */
.clear-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
}

.clear {
  border-color: transparent;
  background: none;
  padding: var(--sp-1) var(--sp-2);
  font-size: var(--fs-sm);
  color: var(--ink-2);
}

.clear:hover:not(:disabled) {
  border-color: transparent;
  background: none;
  box-shadow: none;
  text-decoration: underline;
}

/* 第二下才是真删：这时用警示色，与"不确定"同一个语义 */
.clear.armed {
  color: var(--warn);
  text-decoration: underline;
}

/*
  不限宽：这一段是 flex column + align-items: center，段落本来就收缩到文字宽，
  中文那 18 个字正好一行。写 `max-width: 30ch` 时会差几个像素放不下最后一个字，
  于是"撤销"的"销"单独掉到第二行居中 —— 手机上更常见。
*/
.clear-hint {
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--ink-2);
}

@media (max-width: 480px) {
  .facts {
    gap: var(--sp-5);
  }

  .fact dd {
    font-size: var(--fs-xl);
  }

  .actions {
    width: 100%;
  }

  .actions button {
    flex: 1;
  }
}
</style>
