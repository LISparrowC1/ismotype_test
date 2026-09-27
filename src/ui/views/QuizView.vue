<script setup lang="ts">
/**
 * 作答页。三个区段共用，按路由参数 `:block` 取题。
 *
 * 拆成子路由（而不是一个页面内部换段）的目的：让"可回退"由浏览器后退键天然支持，
 * 且某一段可以被直接分享或收藏。
 */
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { BLOCKS, blockOf, type BlockId } from '../blocks'
import { useQuizStore } from '../stores/quiz'
import { useResultStore } from '../stores/result'
import ModalDialog from '../components/ModalDialog.vue'
import QuestionCard from '../components/QuestionCard.vue'
import ProgressBar from '../components/ProgressBar.vue'

const route = useRoute()
const router = useRouter()
const quiz = useQuizStore()
const resultStore = useResultStore()
const { t } = useI18n()

const browseOpen = ref(false)

/**
 * 路由参数 → 区段。参数非法（用户手改地址）时退回当前 store 所在的区段，
 * 并把地址纠正过来 —— 不弹错误页，直接给一个合理的去处。
 */
const activeBlockId = computed<BlockId>(() => blockOf(String(route.params.block))?.id ?? quiz.currentBlock.id)

watch(
  activeBlockId,
  (id) => {
    if (blockOf(String(route.params.block)) === undefined) {
      void router.replace({ name: 'quiz', params: { block: id } })
      return
    }
    if (quiz.currentBlock.id !== id) quiz.jumpTo(id, 0)
  },
  { immediate: true },
)

const question = computed(() => quiz.currentQuestion)
const text = computed(() => (question.value ? t(question.value.textKey) : ''))
const labels = computed(() => quiz.currentBlock.scale.labelKeys.map((k) => t(k)))
const selected = computed(() => (question.value ? (quiz.answers[question.value.id] ?? null) : null))
const isLastOfAll = computed(() =>
  quiz.currentBlock.id === BLOCKS[BLOCKS.length - 1]!.id &&
  quiz.questionIndex === quiz.currentBlock.questions.length - 1,
)

/**
 * 位置标签：**当前处在哪一题**，不是"答了几题"。
 *
 * 早先用的是 `quiz.progress.answered`，于是答完之后每一题都显示
 * "第 358 题，共 358 题" —— 那是进度，不是位置；而且分母用的是全局 358，
 * 分子却是已答数，两个数说的根本不是一回事。
 * 现在分子分母都取自**本段**：区段名已经在标题上，读者要的是段内第几题。
 */
const questionLabel = computed(() =>
  t('ui.quiz.questionOf', {
    n: quiz.questionIndex + 1,
    total: quiz.currentBlock.questions.length,
  }),
)

/**
 * 当前题是否已作答。未作答时**禁用"下一题"**并把原因写在按钮旁。
 *
 * 为什么不静默放行：最后一题按"下一题"会去结果页，而结果页的守卫要求三段都答完 ——
 * 未答完时会被弹回某个答题段，用户看到的是"点了没反应/莫名跳走"。
 * 与其让他撞上一次莫名其妙的跳转，不如在按钮上就说明"先选一个"。
 * 想换一题可以用"浏览题目"。
 */
const answeredCurrent = computed(() => selected.value !== null)

function onSelect(option: number): void {
  if (!question.value) return
  quiz.answer(question.value.id, option)
  quiz.next()
}

/**
 * 最后一题答完后的去处。**先问定向、再看结果**：
 * 有维度恰好打平时，类型码里会有一个 `X`，而 `X` 绝不展示给用户 ——
 * 那是必须先回答的问题，不是可以摆在结果页上的结论。
 */
function onNext(): void {
  if (!isLastOfAll.value) {
    quiz.next()
    return
  }
  // 作答刚刚变了，缓存的结果（可能还带着 X）必须作废
  resultStore.invalidate()
  void router.push({ name: resultStore.needsTieBreak ? 'tiebreak' : 'result' })
}

function onPrev(): void {
  quiz.prev()
}

/** 浏览题目面板里的题号：已作答的才可点，未作答的按钮原生 disabled（读屏也能听出"不可用"）。 */
const numberedBlocks = computed(() =>
  BLOCKS.map((b) => ({
    id: b.id,
    titleKey: b.titleKey,
    items: b.questions.map((q, i) => ({ id: q.id, n: i + 1, answered: quiz.answers[q.id] !== undefined })),
  })),
)

/**
 * 浏览题目：**弹出小窗口**，不是页面下方展开。
 * 焦点圈、背景锁滚动、焦点归还全部由 `ModalDialog` 负责 —— 分享预览用的是同一个，
 * 那三件事写两遍必然有一遍漏掉。
 */
function openBrowse(): void {
  browseOpen.value = true
}

function closeBrowse(): void {
  if (!browseOpen.value) return
  browseOpen.value = false
}

/**
 * 区段一换就关掉浏览窗口。
 *
 * 窗口里列的是全部三段的题号，但它挂在**当前段**的上下文上（段内编号、当前位置高亮）。
 * **浏览器后退键能在窗口开着时把段换掉** —— 实测窗口会留在新段上，
 * 而焦点还在窗口里，读屏用户会以为自己在原来那一段。关掉比重定位简单，也不会像卡住。
 */
watch(
  () => quiz.currentBlock.id,
  () => closeBrowse(),
)

function goQuestion(blockId: BlockId, indexInBlock: number): void {
  closeBrowse()
  quiz.jumpTo(blockId, indexInBlock)
  void router.push({ name: 'quiz', params: { block: blockId } })
}
</script>

<template>
  <main id="main" class="page">
    <h1 class="view-title">{{ t(activeBlockId === 'ideology' ? 'ui.block.ideology' : `ui.block.${activeBlockId}`) }}</h1>

    <ProgressBar
      :answered="quiz.progress.answered"
      :total="quiz.progress.total"
      :label="t('ui.quiz.progress')"
    />

    <p v-if="!quiz.storageAvailable" class="notice uncertain" role="status">
      {{ t('ui.quiz.storageUnavailable') }}
    </p>

    <p v-for="key in quiz.currentBlock.noteKeys ?? []" :key="key" class="notice" role="note">
      {{ t(key) }}
    </p>

    <QuestionCard
      v-if="question"
      :question="question"
      :scale="quiz.currentBlock.scale"
      :labels="labels"
      :selected="selected"
      :index="quiz.questionIndex"
      :total="quiz.currentBlock.questions.length"
      :text="text"
      :group-label="t('ui.a11y.optionsGroup')"
      :question-label="questionLabel"
      :prev-label="t('ui.quiz.prev')"
      :next-label="isLastOfAll ? t('ui.quiz.finish') : t('ui.quiz.next')"
      :jump-label="t('ui.quiz.jump')"
      :can-next="answeredCurrent"
      :next-is-finish="isLastOfAll"
      :answer-hint="t('ui.quiz.answerFirst')"
      :can-prev="quiz.questionIndex > 0 || quiz.currentBlock.id !== 'ideology'"
      @select="onSelect"
      @prev="onPrev"
      @next="onNext"
      @open-jump="openBrowse"
    />

    <!--
      浏览题目：**弹出一个小窗口**（不是页面下方展开）。里面列出全部题号
      （按段分组、段内从 1 编号），点已作答的跳过去。

      未作答的用原生 `disabled` —— 视觉上是灰的，读屏也听得出"不可用"。
      焦点圈、Esc、点窗口外、背景锁滚动都由 `ModalDialog` 负责（分享预览共用同一个）。
    -->
    <ModalDialog
      v-if="browseOpen"
      :title="t('ui.quiz.jump')"
      :close-label="t('ui.quiz.jumpClose')"
      @close="closeBrowse"
    >
      <p class="hint">{{ t('ui.quiz.browseHint') }}</p>
      <div class="modal-body">
        <section v-for="b in numberedBlocks" :key="b.id" class="browse-block">
          <h3 class="browse-title">{{ t(b.titleKey) }}</h3>
          <ol class="numbers">
            <li v-for="item in b.items" :key="item.id">
              <button
                type="button"
                class="number"
                :class="{ current: item.id === question?.id }"
                :disabled="!item.answered"
                :aria-current="item.id === question?.id ? 'true' : undefined"
                :data-test="`goto-${b.id}-${item.n}`"
                @click="goQuestion(b.id, item.n - 1)"
              >
                {{ item.n }}
              </button>
            </li>
          </ol>
        </section>
      </div>
    </ModalDialog>
  </main>
</template>

<style scoped>
.view-title {
  font-size: var(--fs-lg);
  margin-bottom: var(--sp-4);
}

.notice {
  border-left: 2px solid var(--rule);
  padding-left: var(--sp-3);
  font-size: var(--fs-sm);
  color: var(--ink-2);
  max-width: var(--measure);
}

.notice.uncertain {
  border-left-color: var(--warn);
}

/* 窗口的覆盖层、面板、头部与关闭按钮都在 `ModalDialog` 里，这里只管窗口内部的内容 */

/* 竖排滚动留给窗口内部，头部与提示固定不动 */
.modal-body {
  overflow-y: auto;
  margin-top: var(--sp-2);
}

.hint {
  margin: var(--sp-2) 0 0;
  font-size: var(--fs-xs);
  color: var(--ink-2);
}

.browse-block + .browse-block {
  margin-top: var(--sp-4);
}

.browse-title {
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--ink-2);
  margin: var(--sp-4) 0 var(--sp-2);
}

/* 题号网格：够密，358 个也不会滚很久；每格等宽，扫视时列能对上 */
.numbers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2.4em, 1fr));
  gap: var(--sp-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.number {
  width: 100%;
  padding: var(--sp-1) 0;
  font-size: var(--fs-xs);
  justify-content: center;
  border-color: var(--rule-soft);
}

/* 未作答：原生 disabled，灰且不响应 */
.number:disabled {
  color: var(--rule);
  border-color: transparent;
  background: none;
  cursor: default;
}

/* 当前题：用主强调色标出"你在这" */
.number.current {
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
}
</style>
