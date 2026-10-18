<script setup lang="ts">
/**
 * 结果页。顺序是**产品裁定**的，不要重排：
 * 类型卡 → 五条维度条 → 性格底色（Big Five） → 立场（主义）。
 *
 * 三条硬约束体现在这里：
 * · `percentile` 为 null 时写"暂无可比常模"，**页面上不出现任何百分位数字**
 * · MBTI 段之前必先断掉全部打平（`fullCode` 为 null 时送去定向页），页面上不出现 `X`
 * · 娱乐声明只在页脚（`AppFooter`），MBTI 段旁边不重复
 */
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BIG_FIVE_DOMAINS } from '../../core/content'
import { dataset } from '../data'
import { buildCandidates } from '../result/candidates'
import {
  buildMbtiTypeView,
  mbtiDimensionRows,
  mbtiItemCounts,
  type MbtiDimensionRow,
} from '../result/mbti'
import { readableTypeColor } from '../result/typeColor'
import { SHARE_SITE_URL, type ShareInput, type ShareTokens } from '../result/sharePlan'
import { usePrefsStore } from '../stores/prefs'
import { useResultStore } from '../stores/result'
import ConstructCard from '../components/ConstructCard.vue'
import DeviationBars from '../components/DeviationBars.vue'
import MbtiDimensionBars from '../components/MbtiDimensionBars.vue'
import MbtiTypeCard from '../components/MbtiTypeCard.vue'
import SharePreview from '../components/SharePreview.vue'

const { t } = useI18n()
const router = useRouter()
const store = useResultStore()
const prefs = usePrefsStore()

/** 每维题数从题库现算，不写死 12 —— 见 `mbtiItemCounts` 的说明。 */
const itemCounts = mbtiItemCounts(dataset.personalityQuestions)

onMounted(() => {
  const r = store.compute()
  // 守卫已经拦过"没答完"，这里兜住"作答被清空"这种边角
  if (!r) {
    void router.replace({ name: 'home' })
    return
  }
  // 还有维度恰好打平：`fullCode` 是 null，类型卡拼不出来，先去定向
  if (store.needsTieBreak) void router.replace({ name: 'tiebreak' })
})

const result = computed(() => store.result)

/**
 * 类型卡。`fullCode` 为 null（还有维度没定）时 `buildMbtiTypeView` 返回 null，
 * 页面不给卡 —— 那种情况由上面的跳转接手，不会停留在这里。
 */
const typeView = computed(() => {
  const mbti = store.mbti
  if (!mbti) return null
  return buildMbtiTypeView(mbti, {
    typeName: (style) => t(style.nameKey),
    typeDescription: (style) => t(style.descKey),
  })
})

/** 五条维度条：两半占比直接来自 core，界面不重算。 */
const dimensionRows = computed<Array<MbtiDimensionRow & { leftLabel: string; rightLabel: string }>>(
  () => {
    const mbti = store.mbti
    if (!mbti) return []
    return mbtiDimensionRows(
      mbti.dimensions,
      itemCounts,
      (d) => t(`mbti.dim.${d}`),
      (d, pole) => t(`mbti.pole.${d}.${pole}`),
      (d) => t(`mbti.dim.${d}.desc`),
    )
  },
)

const constructName = (constructId: string): string => {
  const c = dataset.taxonomy.constructs.find((x) => x.id === constructId)
  return c ? t(c.nameKey) : constructId
}

/** 主义 id → 名字与说明。查数据是视图的职责，组件不该自己去找。 */
const resolveIsm = (ismId: string): { name: string; description: string } => {
  const ism = dataset.isms.find((x) => x.id === ismId)
  return ism
    ? { name: t(ism.nameKey), description: t(ism.descKey) }
    : { name: ismId, description: '' }
}

/** 人格五维：raw 是每题 1–5 的和，除以作答数得均值，再归一到 [-1, 1] 才能画"距中点"。 */
const bigFiveRows = computed(() => {
  if (!result.value) return []
  return BIG_FIVE_DOMAINS.map((domain) => {
    const s = result.value!.personality.bigFive[domain]
    const total = dataset.personalityQuestions.filter(
      (q) => q.layer === 'bigfive' && q.facet === domain,
    ).length
    return {
      id: domain,
      label: t(`dim.${domain}`),
      value: s.answeredCount > 0 ? (s.raw / s.answeredCount - 3) / 2 : 0,
      answered: s.answeredCount,
      total,
      unmeasuredLabel: t('ui.result.unmeasured'),
      partialLabel: t('ui.result.partial', { n: s.answeredCount, total }),
    }
  })
})

/**
 * 五维全都没有常模时给一条总说明，避免每维重复一句。
 *
 * **页面上不写作答覆盖度**（项目所有者裁定删掉了"已作答 358/358"与
 * "其中立场部分 248/248"两行）。逐维答不满时仍由维度条自己标注"基于 n/N 题"。
 */
const noNorms = computed(() =>
  result.value
    ? BIG_FIVE_DOMAINS.every((d) => result.value!.personality.bigFive[d].percentile === null)
    : false,
)

/* ---- 分享图：数据在这里解析好，绘制层不认识 store 与 i18n ---- */

const shareOpen = ref(false)

/** 类型色在暗色下要按卡片底色修正可读性，分享图沿用同一条规则 */
const shareTypeColor = computed(() => {
  const raw = typeView.value?.colorHex ?? '#36263d'
  return readableTypeColor(raw, prefs.theme === 'dark' ? '#111827' : '#ffffff')
})

const shareFileName = computed(
  () => `ismotype-${typeView.value?.fullCode ?? typeView.value?.code ?? 'result'}-${today()}.png`,
)

function today(): string {
  const d = new Date()
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
}

/**
 * 分享图的全部事实。**在这里解析**：文案走 `t`、数据查 `dataset`，
 * 绘制层只收一份已经翻译好的输入（与 `mbtiDimensionRows` 同一个分工）。
 *
 * 两个参数由绘制层注入（量文字的函数与当前主题的颜色令牌），这里不用它们，
 * 但签名必须接住 —— 输入里不含 measure / tokens，由调用方补上。
 */
function buildShareInput(
  _measure: (text: string, font: string) => number,
  _tokens: ShareTokens,
): Omit<ShareInput, 'measure' | 'tokens'> {
  const champions = (result.value?.ideology.fields ?? []).map((field) => {
    const top = [...field.topIsms].sort((a, b) => a.rank - b.rank)[0]
    const ism = top ? dataset.isms.find((x) => x.id === top.ismId) : undefined
    return {
      construct: constructName(field.constructId),
      ism: ism ? t(ism.nameKey) : (top?.ismId ?? ''),
      fitPct: Math.round(top?.match ?? 0),
    }
  })

  return {
    siteName: t('ui.app.title'),
    siteUrl: SHARE_SITE_URL,
    type: {
      code: typeView.value?.code ?? '',
      variant: typeView.value?.variant ?? 'A',
      name: typeView.value?.name ?? '',
      color: shareTypeColor.value,
      avatarHref: typeView.value?.avatarUrl ?? null,
    },
    headings: {
      dimensions: t('ui.result.mbti.dimensions'),
      bigFive: t('ui.result.personality'),
      ideology: t('ui.result.ideology'),
    },
    dimensions: dimensionRows.value.map((row) => ({
      // 条上只放字母（宽度百分比要挨着它），与页面一致
      left: row.leftLetter,
      right: row.rightLetter,
      leftPct: row.leftPct,
      rightPct: row.rightPct,
      lead: row.dominant,
    })),
    bigFive: bigFiveRows.value.map((row) => ({ label: row.label, value: row.value })),
    champions,
  }
}
</script>

<template>
  <main id="main" class="page page-wide">
    <h1>{{ t('ui.result.title') }}</h1>

    <template v-if="result">
      <!-- 1. 类型卡 -->
      <section class="block" aria-labelledby="mbti-h">
        <h2 id="mbti-h" class="section-title">{{ t('ui.result.mbti.title') }}</h2>
        <MbtiTypeCard v-if="typeView" :type="typeView" />
      </section>

      <hr class="rule" />

      <!-- 2. 五条维度条 -->
      <section class="block" aria-labelledby="dims-h">
        <h2 id="dims-h" class="section-title">{{ t('ui.result.mbti.dimensions') }}</h2>
        <MbtiDimensionBars :rows="dimensionRows" />
      </section>

      <hr class="rule" />

      <!-- 3. 性格底色 -->
      <section class="block" aria-labelledby="personality-h">
        <h2 id="personality-h" class="section-title">{{ t('ui.result.personality') }}</h2>
        <p v-if="noNorms" class="notice" role="note">{{ t('ui.result.noNorms') }}</p>
        <DeviationBars :rows="bigFiveRows" />
      </section>

      <hr class="rule" />

      <!-- 4. 立场 -->
      <section class="block" aria-labelledby="ideology-h">
        <h2 id="ideology-h" class="section-title">{{ t('ui.result.ideology') }}</h2>
        <!--
          这一段**一点置信度都不出现**（项目所有者裁定）：每张卡只给
          「构念名 + 冠军 + 冠军贴合度 + 灰色小字 + 展开其余候选（各自贴合度）」。
          引擎仍算 `field.confidence`（spec §4.6 的统计防线），只是界面不展示 ——
          三档文字在列表里既长得一样又互相看不出差别，百分比才能横向比。
        -->
        <ConstructCard
          v-for="field in result.ideology.fields"
          :key="field.constructId"
          :construct-name="constructName(field.constructId)"
          :candidates="buildCandidates(field, resolveIsm)"
        />
      </section>

      <!--
        5. 分享。放在内容末尾（项目所有者裁定），静态，不做悬浮条 ——
        页面上唯一悬浮的东西会与"不要到处是盒子"的取向相冲。
        图里没有免责声明与元信息，只有站名与图标作署名。
      -->
      <hr class="rule" />

      <section class="block share" aria-labelledby="share-h">
        <h2 id="share-h" class="section-title">{{ t('ui.share.title') }}</h2>
        <p class="share-note">{{ t('ui.share.pitch') }}</p>
        <button type="button" class="share-open" data-test="share-open" @click="shareOpen = true">
          {{ t('ui.share.open') }}
        </button>
      </section>
    </template>

    <!--
      `result` 为 null 时**什么都不渲染**：这一屏根本到不了。
      路由守卫要求 `quiz.isComplete`（答满 358 题）才放行 `/result`，
      而 `compute()` 只在一题未答时返回 null —— 两个条件不可能同时成立。
      历史上这里挂过一句「还有题没答完」，那是**死代码**：它唯一真正出现过的场合，
      是它被 `v-else` 绑错了条件的时候 —— 同屏再插一个 `v-if` 元素就会让 `v-else` 改绑到
      新元素的条件上，而 Vue 既不报错也不警告。
      真到了这个状态，下面 `onMounted` 里的重定向已经把用户送回首页了。
    -->

    <!--
      分享预览（模态窗口）放在最后，别插进上面 `v-if` / `v-else` 这类相邻条件里 ——
      插进去会让 `v-else` 改绑到它身上，而 Vue 不报错也不警告。
    -->
    <SharePreview
      v-if="shareOpen"
      :build="buildShareInput"
      :file-name="shareFileName"
      @close="shareOpen = false"
    />
  </main>
</template>

<style scoped>
.block {
  margin-top: var(--sp-5);
}

.section-title {
  font-size: var(--fs-lg);
  margin: 0 0 var(--sp-4);
}

.label {
  margin: var(--sp-2) 0 0;
}

.notice {
  border-left: 2px solid var(--warn);
  padding-left: var(--sp-3);
  font-size: var(--fs-sm);
  color: var(--ink-2);
  max-width: var(--measure);
  margin-bottom: var(--sp-4);
}

.share-note {
  margin: 0 0 var(--sp-4);
  color: var(--ink-2);
  font-size: var(--fs-sm);
}

.share-open {
  padding: var(--sp-3) var(--sp-6);
  border-color: transparent;
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 500;
}

.share-open:hover:not(:disabled) {
  background: color-mix(in srgb, var(--accent) 85%, var(--ink));
  color: var(--accent-ink);
}

@media (max-width: 480px) {
  .share-open {
    width: 100%;
  }
}
</style>
