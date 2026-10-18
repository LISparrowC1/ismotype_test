import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { MBTI_DIMENSIONS, type MbtiDimension } from '../../core/content'
import type { Answer, MbtiTieBreak } from '../../core/scoring'
import { BLOCKS, TOTAL_QUESTIONS, blockIndex, type Block, type BlockId } from '../blocks'
import { dataset, questionById } from '../data'

const STORAGE_KEY = 'ismotype:progress:v1'
/**
 * 存档版本。**每次改 `Persisted` 的形状都要 +1**，旧档会被整体丢弃 ——
 * 拿旧结构的作答去算新题库的分是静默错误，宁可让用户重答。
 * v2：新增 `tieBreaks`（MBTI 打平后补答的定向题）。
 */
const STORAGE_VERSION = 2

interface Persisted {
  version: number
  answers: Record<string, number>
  /** 题 id → 选项索引 */
  tieBreaks: Record<string, 1 | 2>
  blockIndex: number
  questionIndex: number
}

/** 三个区段各自的题量，用于进度分母。 */
const BLOCK_SIZES: Record<string, number> = Object.fromEntries(
  BLOCKS.map((b) => [b.id, b.questions.length]),
)

/**
 * 某层的选项个数。**唯一真相源是 `BLOCKS[i].scale.count`** ——
 * 三层点数各不相同，任何"人格层就是 5 点"的写法都会在 MBTI 层静默丢作答。
 */
function optionCountOf(layer: string): number {
  return BLOCKS.find((b) => b.id === layer)?.scale.count ?? 0
}

/** 存档里的定向作答过滤：未知维度与非法极点一律丢弃。 */
function cleanTieBreaks(raw: unknown): Record<string, 1 | 2> {
  const out: Record<string, 1 | 2> = {}
  if (typeof raw !== 'object' || raw === null) return out
  for (const [dim, pole] of Object.entries(raw as Record<string, unknown>)) {
    if (!MBTI_DIMENSIONS.includes(dim as MbtiDimension)) continue
    if (pole !== 1 && pole !== 2) continue
    out[dim] = pole
  }
  return out
}

function emptyProgress(): Record<BlockId, { answered: number; total: number }> {
  return Object.fromEntries(
    BLOCKS.map((b) => [b.id, { answered: 0, total: b.questions.length }]),
  ) as Record<BlockId, { answered: number; total: number }>
}

/**
 * 作答状态。**`answers` 是唯一真相源**（题 id → 选项索引），`Answer[]` 现算。
 *
 * 为什么用映射而不是数组：数组一旦按题序存放，题序或题量变化就会让已有作答错位，
 * 而那是**静默**的错（分数会算出来，只是算错）。映射没有这个失败模式。
 *
 * 持久化的三种失败（版本不符、JSON 坏、localStorage 不可用）一律**降级为不保存并继续作答**，
 * 由 `storageAvailable` 如实告知界面 —— 界面据此提示"本次作答不会被保存"。
 * 不能假装保存成功：用户会以为刷新还在，然后丢掉 340 道题。
 */
export const useQuizStore = defineStore('quiz', () => {
  const answers = ref<Record<string, number>>({})
  /**
   * MBTI 打平后补答的定向题：维度 → 选了哪一极（1 左 / 2 右）。
   * 与 `answers` 分开放：它不是题库里的题（没有题 id、不计入进度），
   * 混进作答映射会让覆盖度虚高一道题。
   */
  const tieBreaks = ref<Record<string, 1 | 2>>({})
  const blockIdx = ref(0)
  const questionIndex = ref(0)
  const storageAvailable = ref(true)

  function safeGet(): string | null {
    try {
      return window.localStorage.getItem(STORAGE_KEY)
    } catch {
      storageAvailable.value = false
      return null
    }
  }

  function safeSet(value: string): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      storageAvailable.value = false
    }
  }

  function safeRemove(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      storageAvailable.value = false
    }
  }

  function restore(): void {
    const raw = safeGet()
    if (raw === null) return
    try {
      const parsed = JSON.parse(raw) as Partial<Persisted>
      // 版本不符即丢弃：宁可从零开始，也不拿旧结构的作答去算新题库的分
      if (parsed.version !== STORAGE_VERSION || typeof parsed.answers !== 'object' || parsed.answers === null) {
        return
      }
      const clean: Record<string, number> = {}
      for (const [id, option] of Object.entries(parsed.answers)) {
        const q = questionById.get(id)
        if (!q || !Number.isInteger(option)) continue
        // 选项上限按**题所属层**取，不能按"人格层一律 5"：三层点数各不相同
        // （主义 6、IPIP 5、MBTI 7），写死 5 会静默丢掉全部选了末两项的 MBTI 作答。
        if (option < 0 || option >= optionCountOf(q.layer)) continue
        clean[id] = option
      }
      answers.value = clean
      tieBreaks.value = cleanTieBreaks(parsed.tieBreaks)
      const bi = Number(parsed.blockIndex)
      const qi = Number(parsed.questionIndex)
      if (Number.isInteger(bi) && bi >= 0 && bi < BLOCKS.length) blockIdx.value = bi
      if (Number.isInteger(qi) && qi >= 0) questionIndex.value = clampQuestion(blockIdx.value, qi)
    } catch {
      // JSON 坏：当作没有存档
    }
  }

  function persist(): void {
    const payload: Persisted = {
      version: STORAGE_VERSION,
      answers: answers.value,
      tieBreaks: tieBreaks.value,
      blockIndex: blockIdx.value,
      questionIndex: questionIndex.value,
    }
    safeSet(JSON.stringify(payload))
  }

  const currentBlock = computed<Block>(() => BLOCKS[blockIdx.value] ?? BLOCKS[0]!)
  const currentQuestion = computed(() => currentBlock.value.questions[questionIndex.value] ?? null)

  const progress = computed(() => {
    const perBlock = emptyProgress()
    let answered = 0
    for (const b of BLOCKS) {
      let n = 0
      for (const q of b.questions) if (answers.value[q.id] !== undefined) n += 1
      perBlock[b.id] = { answered: n, total: b.questions.length }
      answered += n
    }
    return { answered, total: TOTAL_QUESTIONS, perBlock }
  })

  const isComplete = computed(() => progress.value.answered === TOTAL_QUESTIONS)

  /** 第一个还没答完的区段 —— 守卫用它决定把用户送回哪里。 */
  function firstIncompleteBlock(): BlockId {
    for (const b of BLOCKS) {
      if (b.questions.some((q) => answers.value[q.id] === undefined)) return b.id
    }
    return BLOCKS[BLOCKS.length - 1]!.id
  }

  function clampQuestion(bi: number, qi: number): number {
    const size = BLOCKS[bi]?.questions.length ?? 1
    return Math.min(Math.max(qi, 0), Math.max(size - 1, 0))
  }

  function answer(questionId: string, option: number): void {
    if (!questionById.has(questionId)) return
    answers.value = { ...answers.value, [questionId]: option }
    persist()
  }

  function goTo(bi: number, qi: number): void {
    if (bi < 0 || bi >= BLOCKS.length) return
    blockIdx.value = bi
    questionIndex.value = clampQuestion(bi, qi)
  }

  /** 前进。区段末题进入下一段首题；最后一段末题**停住**（去不去结果页由视图决定）。 */
  function next(): void {
    const size = currentBlock.value.questions.length
    if (questionIndex.value + 1 < size) {
      questionIndex.value += 1
      persist()
      return
    }
    if (blockIdx.value + 1 < BLOCKS.length) {
      goTo(blockIdx.value + 1, 0)
      persist()
      return
    }
    // 已经是最后一段最后一题：停在原地
    persist()
  }

  /** 后退。区段首题回到上一段末题；第一段首题停住。 */
  function prev(): void {
    if (questionIndex.value > 0) {
      questionIndex.value -= 1
      persist()
      return
    }
    if (blockIdx.value > 0) {
      const bi = blockIdx.value - 1
      goTo(bi, BLOCKS[bi]!.questions.length - 1)
      persist()
      return
    }
    persist()
  }

  function jumpTo(blockId: BlockId, questionIndexInBlock = 0): void {
    const bi = blockIndex(blockId)
    if (bi < 0) return
    goTo(bi, questionIndexInBlock)
    persist()
  }

  /** 重新开始：清空作答、定向与存档。首页的"重新开始"用。 */
  function reset(): void {
    answers.value = {}
    tieBreaks.value = {}
    blockIdx.value = 0
    questionIndex.value = 0
    safeRemove()
  }

  /**
   * 记下一次打平定向。定向题是**二选一**，重答覆盖上一次（与作答同一语义）。
   */
  function setTieBreak(dimension: MbtiDimension, pole: 1 | 2): void {
    if (!MBTI_DIMENSIONS.includes(dimension)) return
    if (pole !== 1 && pole !== 2) return
    tieBreaks.value = { ...tieBreaks.value, [dimension]: pole }
    persist()
  }

  /** 交给 core 的定向作答数组，现算，顺序与 `MBTI_DIMENSIONS` 一致。 */
  function toTieBreaks(): MbtiTieBreak[] {
    return MBTI_DIMENSIONS.filter((d) => tieBreaks.value[d] !== undefined).map((d) => ({
      dimension: d,
      pole: tieBreaks.value[d]!,
    }))
  }

  /** 交给 core 的作答数组，现算。只含已知题目与合法选项。 */
  function toAnswers(): Answer[] {
    const out: Answer[] = []
    for (const [id, option] of Object.entries(answers.value)) {
      if (questionById.has(id)) out.push({ questionId: id, option })
    }
    return out
  }

  restore()

  return {
    answers,
    tieBreaks,
    blockIndex: blockIdx,
    questionIndex,
    storageAvailable,
    currentBlock,
    currentQuestion,
    progress,
    isComplete,
    firstIncompleteBlock,
    answer,
    next,
    prev,
    jumpTo,
    reset,
    setTieBreak,
    toAnswers,
    toTieBreaks,
    /** 供测试与诊断：三个区段各自的题量 */
    blockSizes: BLOCK_SIZES,
    /** 总题量（含未被作答的） */
    totalQuestions: TOTAL_QUESTIONS,
    /** 数据集的主义题量，用于结果页组装 buildResult 入参 */
    ideologyQuestions: dataset.questions,
  }
})
