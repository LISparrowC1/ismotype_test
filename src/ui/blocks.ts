import type { Question } from '../core/content'
import { SCALES, type ResponseScale } from '../core/responses'
import { dataset } from './data'

export type BlockId = 'ideology' | 'bigfive' | 'mbti'

export interface Block {
  id: BlockId
  titleKey: string
  /**
   * 该段的常驻说明（键，按顺序逐条渲染在题干上方）。
   *
   * 第一段（主义 6 点）为空 —— 它是开头，没有"变"可言。
   * 第二段（IPIP 5 点）两条：
   * · 量表从 6 点变 5 点 —— **点数一变就要提示**，否则用户会以为界面坏了（总 spec §5.3）
   * · 这一段的正问与反问成对出现 —— 不说明的话，用户会把它当成**重复出题**
   *   （所有者就据此报过 bug）。IPIP-50 有 24/50 道反向计分题，作用是抵消
   *   "一路点同意"的作答习惯，题干逐字照抄官方、改不得，所以只能把用途讲清楚。
   * 第三段（风格类型 7 点）只提示 5 → 7。
   *
   * **风格类型那段不在这里放娱乐性与非官方声明**：那两句是**长期声明**，
   * 只在页脚出现（`ui.footer.entertainment` / `ui.footer.noAffiliation`）。
   * 答题时在题干上方再贴一遍长文，会让人以为这一段"更需要注意"，反而抬高了它的地位。
   * 这与"量表变了要提示"是两件事，别因为前者而把后者也去掉。
   */
  noteKeys?: readonly string[]
  questions: Question[]
  scale: ResponseScale
}

/**
 * 三个作答区段，顺序固定为 主义 → 性格底色 → 风格类型（总 spec §7.1）。
 *
 * 每个区段自带 `scale`：主义 6 点、IPIP 5 点、风格类型 7 点，三者**不可混用**——
 * 别的层的选项索引在本层会被判为越界而被丢弃，反之亦然。
 * 组件只按 `scale.count` 渲染，不自己判断层。
 */
export const BLOCKS: readonly Block[] = [
  {
    id: 'ideology',
    titleKey: 'ui.block.ideology',
    questions: dataset.questions,
    scale: SCALES.ideology,
  },
  {
    id: 'bigfive',
    titleKey: 'ui.block.bigfive',
    noteKeys: ['ui.quiz.scaleChange.bigfive', 'ui.quiz.reverseKeyed.bigfive'],
    questions: dataset.personalityQuestions.filter((q) => q.layer === 'bigfive'),
    scale: SCALES.bigfive,
  },
  {
    id: 'mbti',
    titleKey: 'ui.block.mbti',
    noteKeys: ['ui.quiz.scaleChange.mbti'],
    questions: dataset.personalityQuestions.filter((q) => q.layer === 'mbti'),
    scale: SCALES.mbti,
  },
]

export const TOTAL_QUESTIONS: number = BLOCKS.reduce((n, b) => n + b.questions.length, 0)

export function blockOf(id: string): Block | undefined {
  return BLOCKS.find((b) => b.id === id)
}

export function blockIndex(id: BlockId): number {
  return BLOCKS.findIndex((b) => b.id === id)
}
