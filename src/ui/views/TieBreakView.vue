<script setup lang="ts">
/**
 * 打平定向页。**只在有维度恰好 50/50（或该维一题未答）时出现**，
 * 断了之后才让结果页展示四字母类型。
 *
 * 为什么不让结果页自己画个 `X`：`X` 不是类型码的一部分，用户会把它读成
 * "我是 INXJ 型"。打平是**必须回答的问题**，不是展示的结论。（spec §4.5）
 *
 * 一次只问一维：一次摆五道二选一会让人以为回到了答题页。
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { MBTI_POLES, type MbtiDimension } from '../../core/content'
import { dataset } from '../data'
import { mbtiDimensionRows, mbtiItemCounts, type MbtiDimensionRow } from '../result/mbti'
import { useQuizStore } from '../stores/quiz'
import { useResultStore } from '../stores/result'

const { t } = useI18n()
const router = useRouter()
const quiz = useQuizStore()
const store = useResultStore()

const itemCounts = mbtiItemCounts(dataset.personalityQuestions)

const current = computed<MbtiDimension | null>(() => store.pendingTieBreaks[0] ?? null)
const remaining = computed(() => store.pendingTieBreaks.length)

/** 该维的两行二选一：字母 + 该极的名字 + 抓取来的那句话。 */
const options = computed<Array<{ pole: 1 | 2; letter: string; label: string; text: string }>>(() => {
  const dim = current.value
  if (dim === null) return []
  const poles = MBTI_POLES[dim]
  return ([1, 2] as const).map((pole) => ({
    pole,
    letter: poles[pole - 1] ?? '',
    label: t(`mbti.pole.${dim}.${pole}`),
    text: t(`mbti.tiebreak.${dim}.${pole}`),
  }))
})

/**
 * 该维已作答的题数。**它决定这道二选一有没有意义**：一题未答的维不是"打平"，
 * 是"没测到"，界面要说清楚，否则用户会以为自己做错了什么。
 */
const row = computed<MbtiDimensionRow | null>(() => {
  const dim = current.value
  const mbti = store.mbti
  if (dim === null || mbti === null) return null
  const rows = mbtiDimensionRows(
    mbti.dimensions,
    itemCounts,
    (d) => t(`mbti.dim.${d}`),
    (d, pole) => t(`mbti.pole.${d}.${pole}`),
    (d) => t(`mbti.dim.${d}.desc`),
  )
  return rows.find((x) => x.dimension === dim) ?? null
})

/** 没有待定向的维度就不该停在这里（比如用户直接改地址进来）。 */
onMounted(() => {
  if (!store.needsTieBreak) void router.replace({ name: 'result' })
})

function choose(pole: 1 | 2): void {
  const dim = current.value
  if (dim === null) return
  quiz.setTieBreak(dim, pole)
  if (store.needsTieBreak) return
  void router.replace({ name: 'result' })
}
</script>

<template>
  <main id="main" class="page">
    <h1>{{ t('ui.tiebreak.title') }}</h1>

    <p class="lead label">{{ t('ui.tiebreak.intro') }}</p>

    <template v-if="current && remaining > 0">
      <p class="progress label">
        {{ t('ui.tiebreak.remaining', { n: remaining }) }}
      </p>

      <p class="asked label">
        {{ t(`mbti.dim.${current}`) }}
        <template v-if="row && row.answered > 0">
          <span class="num">{{ row.answered }} / {{ row.total }}</span>
        </template>
      </p>

      <p v-if="row && row.answered === 0" class="notice" role="note">
        {{ t('ui.tiebreak.unmeasured') }}
      </p>

      <h2 class="question">{{ t(`mbti.tiebreak.${current}.q`) }}</h2>

      <ul class="options">
        <li v-for="o in options" :key="o.pole">
          <button type="button" :data-test="`tiebreak-${o.pole}`" @click="choose(o.pole)">
            <span class="opt-head">
              <span class="letter" aria-hidden="true">{{ o.letter }}</span>
              <span class="opt-label">{{ o.label }}</span>
            </span>
            <span class="opt-text">{{ o.text }}</span>
          </button>
        </li>
      </ul>
    </template>
  </main>
</template>

<style scoped>
.lead {
  margin-top: var(--sp-3);
  max-width: var(--measure);
}

.progress {
  margin-bottom: var(--sp-2);
}

.asked {
  margin-bottom: var(--sp-3);
}

.notice {
  border-left: 2px solid var(--rule);
  padding-left: var(--sp-3);
  color: var(--ink-2);
  font-size: var(--fs-sm);
}

.question {
  font-size: var(--fs-lg);
  margin: var(--sp-5) 0 var(--sp-3);
  max-width: var(--measure);
}

.options {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--sp-3);
}

.options button {
  display: block;
  width: 100%;
  text-align: left;
  padding: var(--sp-4);
}

.opt-head {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
}

.letter {
  font-size: var(--fs-lg);
  font-weight: 600;
}

.opt-label {
  font-size: var(--fs-sm);
  color: var(--ink-2);
}

.opt-text {
  display: block;
  max-width: var(--measure);
}
</style>
