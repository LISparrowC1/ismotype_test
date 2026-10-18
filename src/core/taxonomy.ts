export interface SubDimension {
  id: string
  nameKey: string
  definition: string
  excludes: string
  poles: [string, string]
  anchors: { high: string; low: string }
}

export interface Construct {
  id: string
  nameKey: string
  definition: string
  facets: SubDimension[]
}

export interface Taxonomy {
  version: string
  constructs: Construct[]
}

export interface Issue { path: string; message: string }

export const FACET_MIN = 2
export const FACET_MAX = 4

const ID_RE = /^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9_]*)*$/

const blank = (v: unknown): boolean => typeof v !== 'string' || v.trim() === ''

export function validateTaxonomy(t: Taxonomy): Issue[] {
  const issues: Issue[] = []
  if (blank(t?.version)) issues.push({ path: 'version', message: '版本号不能为空' })
  if (!Array.isArray(t?.constructs) || t.constructs.length === 0) {
    issues.push({ path: 'constructs', message: '至少需要一个顶层构念' })
    return issues
  }

  const seenC = new Set<string>()
  const seenD = new Set<string>()

  t.constructs.forEach((c, ci) => {
    const cp = `constructs[${ci}]`
    if (!ID_RE.test(c.id ?? '')) issues.push({ path: `${cp}.id`, message: `id 格式非法: ${c.id}` })
    else if (seenC.has(c.id)) issues.push({ path: `${cp}.id`, message: `构念 id 重复: ${c.id}` })
    else seenC.add(c.id)

    if (blank(c.nameKey)) issues.push({ path: `${cp}.nameKey`, message: '不能为空' })
    if (blank(c.definition)) issues.push({ path: `${cp}.definition`, message: '不能为空' })

    if (!Array.isArray(c.facets) || c.facets.length < FACET_MIN || c.facets.length > FACET_MAX) {
      issues.push({
        path: `${cp}.facets`,
        message: `子维度数须在 ${FACET_MIN}–${FACET_MAX}，实际 ${c.facets?.length ?? 0}`,
      })
    }

    ;(c.facets ?? []).forEach((d, di) => {
      const dp = `${cp}.facets[${di}]`
      if (!ID_RE.test(d.id ?? '')) issues.push({ path: `${dp}.id`, message: `id 格式非法: ${d.id}` })
      else if (seenD.has(d.id)) issues.push({ path: `${dp}.id`, message: `子维度 id 全局重复: ${d.id}` })
      else seenD.add(d.id)

      if (blank(d.nameKey)) issues.push({ path: `${dp}.nameKey`, message: '不能为空' })
      if (blank(d.definition)) issues.push({ path: `${dp}.definition`, message: '不能为空' })
      if (blank(d.excludes)) {
        issues.push({ path: `${dp}.excludes`, message: '不能为空（用于防止维度侵蚀，必填）' })
      }
      if (!Array.isArray(d.poles) || d.poles.length !== 2 || d.poles.some(blank)) {
        issues.push({ path: `${dp}.poles`, message: '必须是两个非空字符串' })
      }
      if (blank(d.anchors?.high) || blank(d.anchors?.low)) {
        issues.push({ path: `${dp}.anchors`, message: 'high 与 low 锚点例句均必填' })
      }
    })
  })

  return issues
}
