import { readFile } from 'node:fs/promises'
import { BIG_FIVE_DOMAINS, MBTI_DIMENSIONS, MBTI_ITEMS_PER_DIMENSION, MBTI_TOTAL_ITEMS, type BigFiveDomain, type MbtiDimension, type Question } from '../core/content'
import type { Issue } from '../core/taxonomy'
import type { Norms } from '../core/norms'

export const PERSONALITY_PATHS = {
  bigfive: 'questions/bigfive.ipip50.json',
  mbti: 'questions/mbti.16p.v1.json',
  norms: 'norms/ipip50.v1.json',
} as const

/**
 * IPIP-50 官方计分键（https://ipip.ori.org/newBigFive5broadKey.htm）：每维 10 题。
 * 放在代码里而不是只存在于 JSON 中，是为了让测试能把 JSON 与**独立的一份**清单比对 ——
 * 否则"JSON 与它自己一致"是句废话。
 */
export const IPIP50_FACET_COUNTS: Record<BigFiveDomain, number> = {
  O: 10, C: 10, E: 10, A: 10, N: 10,
}

/**
 * 官方 - keyed（反向计分）题号，按维度分组。
 *
 * **不是"每维 5 正 5 反"**：O 反向 3 条、C 4 条、E 5 条、A **4** 条、N 8 条。
 * 写这张表时踩过两次同一个坑，都值得留着：
 * · 先按"均衡"的直觉推，把 `ipip.29` 当正向、`ipip.30` 当反向 —— 推错了；
 * · 后来以为 A 维该有 5 条反向，于是给 `ipip.42` 补上 `reversed` —— 也错了。
 *   `ipip.42` 是 "Feel others' emotions."（官方 `(2+)`，**正向**）；
 *   我把它与 `ipip.48` "Am exacting in my work."（`(3+)`）看串了，而 48 本来就没有反向标记。
 * 教训：这张表只能**逐条对着官方计分键核**，任何"应该有几条"的先验都会把它带偏。
 * 官方页面本身也写着 Factor II 是 "six +keyed and four -keyed"，与 4 条一致。
 */
export const IPIP50_REVERSED: Record<BigFiveDomain, readonly number[]> = {
  O: [10, 20, 30],
  C: [8, 18, 28, 38],
  E: [6, 16, 26, 36, 46],
  A: [2, 12, 22, 32],
  N: [4, 14, 24, 29, 34, 39, 44, 49],
}

/** 人格题 id 重复必须显式报错：重复的题会被计分两次，而结果看起来完全正常。 */
export function assertPersonalityIdsUnique(questions: Question[]): void {
  const seen = new Set<string>()
  for (const q of questions) {
    if (seen.has(q.id)) throw new Error(`人格题 id 重复：${q.id}`)
    seen.add(q.id)
  }
}

const FACETS_OF: Record<'bigfive' | 'mbti', readonly string[]> = {
  bigfive: BIG_FIVE_DOMAINS,
  mbti: MBTI_DIMENSIONS,
}

/**
 * 人格题的形状校验。**不用 `validateContent`**：那条路径是主义层的口径
 * （要求 3–6 个稀疏载荷），人格题没有载荷，判据完全不同。
 *
 * `reversed` 只允许缺省或字面 `true`；`false` 也算非法——它会让"正向键题数"的统计
 * 与实际不符，且 JSON 里写 `false` 是冗余噪声。判据用 `Object.hasOwn` 而不是
 * `q.loadings !== undefined`：后者对 `loadings: null` / `loadings: []` 会放行，
 * 而这两种写法正是"题库文件被复制粘贴污染"的典型形态。
 */
export function validatePersonalityQuestions(questions: Question[]): Issue[] {
  const issues: Issue[] = []
  const seen = new Set<string>()

  questions.forEach((q, i) => {
    const p = `personalityQuestions[${i}]`
    if (typeof q.id !== 'string' || q.id.trim() === '') {
      issues.push({ path: `${p}.id`, message: '不能为空' })
    } else if (seen.has(q.id)) {
      issues.push({ path: `${p}.id`, message: `题目 id 重复: ${q.id}` })
    } else {
      seen.add(q.id)
    }
    if (typeof q.textKey !== 'string' || q.textKey.trim() === '') {
      issues.push({ path: `${p}.textKey`, message: '不能为空' })
    }

    if (q.layer !== 'bigfive' && q.layer !== 'mbti') {
      issues.push({ path: `${p}.layer`, message: `人格题 layer 须为 bigfive 或 mbti，实际 ${q.layer as string}` })
      return
    }
    const allowed = FACETS_OF[q.layer]
    if (!allowed.includes(q.facet as string)) {
      issues.push({ path: `${p}.facet`, message: `${q.layer} 层 facet 须为 ${allowed.join('/')}，实际 ${q.facet}` })
    }
    if (Object.hasOwn(q, 'loadings')) {
      issues.push({ path: `${p}.loadings`, message: '人格题不得带 loadings（那是主义层字段）' })
    }
    if (Object.hasOwn(q, 'reversed') && q.reversed !== true) {
      issues.push({ path: `${p}.reversed`, message: `只允许缺省或 true，实际 ${JSON.stringify(q.reversed)}` })
    }
  })

  return issues
}

/** 题目序号 → 该题在 IPIP-50 官方清单里的位置。取不出序号即返回 null。 */
function ordinalOf(id: string): number | null {
  const m = /^ipip\.(\d+)$/.exec(id)
  return m ? Number(m[1]) : null
}

/**
 * IPIP-50 的**专用**校验（只对真实题库有意义）：50 题、每维题数与反向题号都与官方计分键一致。
 *
 * 与 `validatePersonalityQuestions` 分开，是因为后者对夹具目录也要成立（夹具只有 1 道题），
 * 而这几条只对真实 IPIP 题库有意义。
 *
 * **只校验 id 以 `ipip.` 开头的题**：夹具用别的前缀（如 `fix.bigfive.`），
 * 于是同一条判据既能在真实数据上生效，又不会因为夹具只有 1 道题而误报。
 * 如果开发时改了前缀而这道校验"消失"，表现是**静默不校验**——这是它最容易失效的方式。
 */
export function validateIpip50(questions: Question[]): Issue[] {
  const issues: Issue[] = []
  const bigfive = questions.filter((q) => q.layer === 'bigfive')
  const ipip = bigfive.filter((q) => ordinalOf(q.id) !== null)
  if (ipip.length === 0) {
    // **不能静默返回空**（复核 F8）：这是"键向与官方计分键一致"的唯一机器守卫，
    // 早期版本在这里直接 return，于是"IPIP 题库被改名"这类情形会安安静静地通过。
    //
    // 判据必须精确到"看起来就是那一份 IPIP-50"：**恰好 50 道 bigfive 题却没有一道
    // 是 ipip.NN 形态**。不能用"≥20 道"之类的规模阈值 —— 测试夹具（如闸门端到端用的
    // 满编 90 道人格题）会被误伤，而它本来就走不到这条校验。
    if (bigfive.length === 50) {
      issues.push({
        path: 'personalityQuestions',
        message: '恰好 50 道 bigfive 题，却没有一道 id 是 ipip.NN 形态' +
          `（如 ${bigfive[0]!.id}）—— IPIP-50 的官方计分键校验无法进行`,
      })
    }
    return issues
  }
  if (ipip.length !== 50) {
    issues.push({ path: 'personalityQuestions', message: `IPIP-50 须为 50 题，实际 ${ipip.length} 题` })
  }
  for (const [domain, expected] of Object.entries(IPIP50_FACET_COUNTS)) {
    const items = ipip.filter((q) => q.facet === domain)
    if (items.length !== expected) {
      issues.push({ path: `personalityQuestions.${domain}`, message: `${domain} 须为 ${expected} 题，实际 ${items.length} 题` })
    }
  }
  for (const [domain, expected] of Object.entries(IPIP50_REVERSED)) {
    const actual = ipip
      .filter((q) => q.facet === domain && q.reversed === true)
      .map((q) => ordinalOf(q.id))
      .filter((n): n is number => n !== null)
      .sort((a, b) => a - b)
    if (actual.join(',') !== [...expected].join(',')) {
      issues.push({
        path: `personalityQuestions.${domain}.reversed`,
        message: `${domain} 的反向题号与官方计分键不一致：实际 [${actual.join(', ')}]，应为 [${expected.join(', ')}]`,
      })
    }
  }
  return issues
}

/**
 * 16personalities 60 题的**维度归属与键向**，唯一真相源。
 * `src/data/questions/mbti.16p.v1.json` 是它的产物（与主义层「标注 → 题库」同一套路），
 * 手改产物会被 `validateMbti16p` 挡下。
 *
 * 键是**源站的题号**（`mq_N` 的 N）；我们题库里的 id 是 `mbti.16p.⟨N+1⟩`，
 * 序号即源站题号加一。
 *
 * **这张表是语义判读出来的，不是抓来的**：源站题库载荷的字段只有
 * `key/text/reversed/order/answer/index`，没有任何维度字段，计分只在服务端
 * （`/api/onboarding/get-quiz` 返回的载荷与页面上那份逐字相同）。
 * 判读的强约束是「每维正好 12 题」（60 = 5 × 12）—— 错判一条就会打破配平。
 * 全库唯一有歧义的是 `mq_53`（字面像 Tactics，只有归 Nature 才配得平）。
 *
 * `left` = 同意时推向该维**左极**（E / N / T / J / A），`right` = 推向右侧（I / S / F / P / T）。
 * **不要与源站载荷里的 `reversed` 混为一谈** —— 那 60 个值全是 `false`，那是呈现标志。
 */
export const MBTI16P_KEYING: Record<MbtiDimension, { left: readonly number[]; right: readonly number[] }> = {
  energy: { left: [0, 10, 15, 30, 35, 42, 52], right: [5, 20, 25, 40, 50] },
  mind: { left: [1, 16, 18, 29, 36, 41, 56], right: [11, 21, 31, 45, 51] },
  nature: { left: [12, 22, 24, 27, 37], right: [2, 7, 17, 32, 47, 53, 57] },
  tactics: { left: [3, 6, 8, 23, 38, 43, 55], right: [13, 28, 33, 48, 58] },
  identity: { left: [4, 14, 34, 39, 59], right: [9, 19, 26, 44, 46, 49, 54] },
}

export const MBTI16P_ITEMS_PER_DIMENSION = MBTI_ITEMS_PER_DIMENSION
export const MBTI16P_TOTAL = MBTI_TOTAL_ITEMS

/** 题库 id → 源站题号。取不出即返回 null。 */
function sourceOrdinalOf(id: string): number | null {
  const m = /^mbti\.16p\.(\d{3})$/.exec(id)
  return m ? Number(m[1]) - 1 : null
}

/**
 * 夹具题 id 的前缀（测试夹具用它标记自己造的那批题）。
 *
 * 必须**显式**豁免：夹具按满编写 60 道 mbti 题，数量与生产题库一模一样，
 * 除了 id 前缀没有任何东西能区分二者。下一条守卫的"恰好 60 题却没有一道
 * 是 `mbti.16p.NNN`"判据若不加这个豁免，会把夹具误判成"生产题库被改名"。
 *
 * 对照：IPIP 那条同型守卫是靠**题量差**躲过夹具的（夹具 12 题/维，官方 10 题/维），
 * 那是碰巧，不是设计 —— 夹具哪天改成每维 10 题，它就会误报。
 */
export const MBTI_FIXTURE_ID_PREFIX = 'fix.'

/**
 * 题库产物与 `MBTI16P_KEYING` 的一致性校验。
 *
 * 存在的理由与 `validateIpip50` 相同：**产物可以被手改，而手改一条题的归属
 * 不会让任何东西看起来坏掉** —— 分数照算、界面照显示，只是那一维悄悄偏了。
 * 这道校验把「产物 == 从键向表重新推导」钉死。
 *
 * 只校验 id 形如 `mbti.16p.NNN` 的题，夹具（`fix.` 前缀）不参与。
 */
export function validateMbti16p(questions: Question[]): Issue[] {
  const issues: Issue[] = []
  const production = questions
    .filter((q) => q.layer === 'mbti' && !q.id.startsWith(MBTI_FIXTURE_ID_PREFIX))
  const bank = production.filter((q) => sourceOrdinalOf(q.id) !== null)
  if (bank.length === 0) {
    // **不能静默返回空**：恰好 60 道 mbti 题却没有一道是 mbti.16p.NNN 形态，
    // 说明题库被改名或换源，而"键向与判读一致"的唯一机器守卫会随之消失。
    if (production.length === MBTI16P_TOTAL) {
      issues.push({
        path: 'personalityQuestions',
        message: `恰好 ${MBTI16P_TOTAL} 道 mbti 题，却没有一道 id 是 mbti.16p.NNN 形态` +
          `（如 ${production[0]!.id}）—— 键向校验无法进行`,
      })
    }
    return issues
  }
  if (bank.length !== MBTI16P_TOTAL) {
    issues.push({ path: 'personalityQuestions', message: `16personalities 题库须为 ${MBTI16P_TOTAL} 题，实际 ${bank.length} 题` })
  }

  const expected = new Map<string, { dim: MbtiDimension; reversed: boolean }>()
  for (const dim of MBTI_DIMENSIONS) {
    const { left, right } = MBTI16P_KEYING[dim]
    if (left.length + right.length !== MBTI16P_ITEMS_PER_DIMENSION) {
      issues.push({
        path: `MBTI16P_KEYING.${dim}`,
        message: `须为 ${MBTI16P_ITEMS_PER_DIMENSION} 题（左 ${left.length} + 右 ${right.length}），配平被打破`,
      })
    }
    for (const n of left) expected.set(`mq_${n}`, { dim, reversed: false })
    for (const n of right) expected.set(`mq_${n}`, { dim, reversed: true })
  }
  if (expected.size !== MBTI16P_TOTAL) {
    issues.push({ path: 'MBTI16P_KEYING', message: `键向表覆盖 ${expected.size} 题，应为 ${MBTI16P_TOTAL} 题` })
  }

  for (const q of bank) {
    const want = expected.get(`mq_${sourceOrdinalOf(q.id)}`)
    if (!want) {
      issues.push({ path: `personalityQuestions.${q.id}`, message: '不在键向表覆盖范围内' })
      continue
    }
    if (q.facet !== want.dim) {
      issues.push({ path: `personalityQuestions.${q.id}.facet`, message: `应为 ${want.dim}，实际 ${q.facet}` })
    }
    if ((q.reversed === true) !== want.reversed) {
      issues.push({
        path: `personalityQuestions.${q.id}.reversed`,
        message: `应为 ${want.reversed}，实际 ${q.reversed === true}`,
      })
    }
  }
  return issues
}

export interface PersonalityDataset {
  questions: Question[]
  norms: Norms
}export async function loadPersonalityFrom(dir: string): Promise<PersonalityDataset> {
  const read = async <T>(rel: string): Promise<T> => {
    const path = `${dir}/${rel}`
    try {
      return JSON.parse(await readFile(path, 'utf8')) as T
    } catch (err) {
      throw new Error(`无法读取数据文件 ${path}：${(err as Error).message}`, { cause: err })
    }
  }

  const questions = [
    ...(await read<Question[]>(PERSONALITY_PATHS.bigfive)),
    ...(await read<Question[]>(PERSONALITY_PATHS.mbti)),
  ]
  assertPersonalityIdsUnique(questions)
  return { questions, norms: await read<Norms>(PERSONALITY_PATHS.norms) }
}
