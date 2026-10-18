import { readFile } from 'node:fs/promises'
import { validateContent, validateTaxonomy } from '../core'
import type { Ism, Question } from '../core/content'
import type { Norms } from '../core/norms'
import type { Taxonomy } from '../core/taxonomy'
import {
  loadPersonalityFrom, validateIpip50, validateMbti16p, validatePersonalityQuestions,
} from './personality'

export interface Dataset {
  taxonomy: Taxonomy
  questions: Question[]
  isms: Ism[]
  /**
   * 人格层题项（bigfive + mbti）。与 `questions` 分开：两者计分口径与校验规则都不同，
   * 且主义题是标注存储的物化产物，人格题不是。
   */
  personalityQuestions: Question[]
  /** IPIP 常模。空表是**合法状态**（spec R1），此时所有 percentile 为 null。 */
  norms: Norms
}

export * from './personality'

export const DATA_PATHS = {
  taxonomy: 'taxonomy/v1.json',
  questions: 'questions/ideology.v1.json',
  isms: 'isms/profiles.v1.json',
} as const

/** 读取版本化 JSON。文件缺失必须报错并带上路径，绝不静默返回空集。 */
async function readJson<T>(dir: string, rel: string): Promise<T> {
  const path = `${dir}/${rel}`
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch (err) {
    throw new Error(`无法读取数据文件 ${path}：${(err as Error).message}`, { cause: err })
  }
}

export async function loadDatasetFrom(dir: string): Promise<Dataset> {
  const personality = await loadPersonalityFrom(dir)
  return {
    taxonomy: await readJson<Taxonomy>(dir, DATA_PATHS.taxonomy),
    questions: await readJson<Question[]>(dir, DATA_PATHS.questions),
    isms: await readJson<Ism[]>(dir, DATA_PATHS.isms),
    personalityQuestions: personality.questions,
    norms: personality.norms,
  }
}

/**
 * 主义题与人格题的 id 不得撞名（复核 F5）。
 *
 * 两层同 id 时，`normalizeAnswers` 的 byId 会让后进的那个覆盖前者，
 * 同一笔作答会被**两层同时计入**：主义层多算一题，人格层也多算一题，而两边都看不出来。
 * 此前只有一条针对当前数据快照的测试，没有结构上的守卫。
 */
export function assertNoCrossLayerIdClash(questions: Question[], personality: Question[]): void {
  const ideology = new Set(questions.map((q) => q.id))
  const clash = personality.filter((q) => ideology.has(q.id)).map((q) => q.id)
  if (clash.length > 0) {
    throw new Error(
      `主义题与人格题 id 冲突（${clash.length} 个）：${clash.slice(0, 10).join(', ')} —— ` +
      '同一笔作答会被两层同时计入，必须改掉其中一层的 id',
    )
  }
}

/** 结构校验。问题数 > 0 即抛错，消息含前 20 条路径。 */
export function assertDatasetConsistent(ds: Dataset): void {
  assertNoCrossLayerIdClash(ds.questions, ds.personalityQuestions)
  const issues = [
    ...validateTaxonomy(ds.taxonomy),
    ...validateContent(ds.taxonomy, ds.questions, ds.isms),
    ...validatePersonalityQuestions(ds.personalityQuestions),
    ...validateIpip50(ds.personalityQuestions),
    ...validateMbti16p(ds.personalityQuestions),
  ]
  if (issues.length === 0) return
  const head = issues.slice(0, 20).map((i) => `${i.path}: ${i.message}`).join('\n  ')
  throw new Error(`数据集结构校验失败（共 ${issues.length} 项）：\n  ${head}`)
}
