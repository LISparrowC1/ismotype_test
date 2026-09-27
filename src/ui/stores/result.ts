import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { deriveCalibration } from '../../core/calibration'
import type { MbtiDimension } from '../../core/content'
import { buildResult, type AssessmentResult, type MbtiResult } from '../../core/result'
import { dataset } from '../data'
import { tiedDimensions } from '../result/mbti'
import { useQuizStore } from './quiz'
import { usePrefsStore } from './prefs'

/**
 * 结果。**进入结果页或定向页时才算**，作答过程中不算。
 *
 * 计分实测远低于 1ms（358 题），所以不需要任何缓存策略；算一次存下来只是为了
 * 让"页面重新挂载时拿到同一个对象"——每次新建对象会让依赖它的渲染抖动。
 *
 * **打平定向会改写结果，所以结果与"还要不要定向"必须在同一处算**：
 * 早期把两者分开时，定向答完后缓存里的 `mbti.code` 还是旧的（带着 `X`），
 * 而用户已经在结果页上了 —— 那正是"绝不显示 X"这条规则唯一会漏的缝。
 */
export const useResultStore = defineStore('result', () => {
  const cached = ref<AssessmentResult | null>(null)

  const calibration = computed(() => deriveCalibration(dataset.taxonomy, dataset.questions))

  /** 现有作答算出的结果；一题未答时为 null。**不缓存**，供定向判断用。 */
  function computeNow(): AssessmentResult | null {
    const quiz = useQuizStore()
    if (quiz.progress.answered === 0) return null
    return buildResult({
      taxonomy: dataset.taxonomy,
      questions: dataset.questions,
      isms: dataset.isms,
      calibration: calibration.value,
      answers: quiz.toAnswers(),
      // 人格层题项与常模都在这里接上；locale 决定查哪一份常模表
      facetItems: dataset.personalityQuestions,
      norms: dataset.norms,
      locale: usePrefsStore().locale,
      // 打平定向：只有该维恰好 50/50 时才存在，收集在 quiz store 里
      mbtiTieBreaks: quiz.toTieBreaks(),
    })
  }

  /** 进入结果页时调一次；幂等，重复调用返回同一个对象。 */
  function compute(): AssessmentResult | null {
    if (cached.value === null) cached.value = computeNow()
    return cached.value
  }

  /** 定向作答改变了分数，缓存必须作废，否则结果页显示的还是定向前的类型。 */
  function invalidate(): void {
    cached.value = null
  }

  /**
   * 当前作答下的 MBTI 结果（含各维占比与打平标记）。
   *
   * **从作答现算，不读缓存。** 缓存是"进结果页时算的那一次"，用户答完定向题后
   * 它还是旧的（那一维仍带着 `X`）；用缓存判断会把用户永远锁在定向页上。
   * 代价是每次读这个值都重算一遍计分（实测远低于 1ms），换来的是不会有
   * 任何一处拿到过期结论 —— 这里正是"绝不显示 X"唯一会漏的缝。
   */
  const mbti = computed<MbtiResult | null>(() => {
    if (useQuizStore().progress.answered === 0) return null
    try {
      return computeNow()!.personality.mbti
    } catch {
      // 分类学版本不符等硬错误由结果页统一处理，这里只回答"要不要定向"
      return null
    }
  })

  /** 需要先做定向题的维度（**恰好打平**，非"没测到"）。 */
  const pendingTieBreaks = computed<MbtiDimension[]>(() =>
    mbti.value === null ? [] : tiedDimensions(mbti.value),
  )

  const needsTieBreak = computed(() => pendingTieBreaks.value.length > 0)

  return {
    result: cached,
    compute,
    invalidate,
    mbti,
    pendingTieBreaks,
    needsTieBreak,
  }
})
