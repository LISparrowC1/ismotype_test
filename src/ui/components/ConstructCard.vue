<script setup lang="ts">
/**
 * 一个构念的立场结果。
 *
 * 呈现口径是**只给贴合度**：冠军给名称、贴合度与一句灰色小字介绍，
 * 展开后是同一构念内其余候选的完整排序，每行也只给贴合度百分比。
 * 不写"明确 / 较明确 / 不确定"这类文字判断 —— 三档文字在列表里既长得一样
 * 又互相看不出差别，百分比才是能横向比的东西。
 *
 * 冠军那一行**带贴合度**：否则它是整段唯一没有数字的一行，
 * 而"冠军赢了多少"恰恰是这里最该看见的信息（展开列表里能比，但不展开就看不到）。
 *
 * 排序是完整的、不截断（spec §7.1）：主义匹配的全部候选都在这里。
 * 雷达图**只画前六名**，它是同一份数据的一个视图，不替代列表。
 *
 * 版面是两栏：左栏冠军与列表，右栏雷达。**右栏用固定宽度并且跨两行** ——
 * 展开列表只把左栏撑高，雷达图不会跟着跳（"排版别乱，提前预留区域"）。
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Candidate } from '../result/candidates'
import IsmRadar from './IsmRadar.vue'

const props = defineProps<{
  constructName: string
  /** 候选（名字、说明、贴合度），由视图解析好，已按名次排好 */
  candidates: Candidate[]
}>()

const { t } = useI18n()
const expanded = ref(false)
const detailOf = ref<string | null>(null)

const top = computed(() => props.candidates[0] ?? null)
/** 其余候选。冠军已经在上面详细展示过，列表里再列一遍是重复。 */
const rest = computed(() => props.candidates.slice(1))
/** 雷达只画前六名；不足六个时组件自己按实际个数画 */
const topSix = computed(() => props.candidates.slice(0, 6))

const radarLabel = computed(() =>
  t('ui.result.radar.label', {
    construct: props.constructName,
    list: topSix.value.map((c) => `${c.name} ${c.fitPct}%`).join(t('ui.result.radar.sep')),
  }),
)

const toggleDetail = (ismId: string): void => {
  detailOf.value = detailOf.value === ismId ? null : ismId
}
</script>

<template>
  <article class="card panel">
    <div class="head">
      <h3 class="construct">{{ constructName }}</h3>

      <template v-if="top">
        <p class="champion">
          <span class="rank num" aria-hidden="true">{{ top.rank }}</span>
          <span class="champion-name">{{ top.name }}</span>
          <span class="fit num" data-test="champion-fit">{{ top.fitPct }}%</span>
        </p>
        <p v-if="top.description" class="champion-desc">{{ top.description }}</p>
      </template>
    </div>

    <div class="aside">
      <IsmRadar
        :values="topSix.map((c) => c.fitPct)"
        :labels="topSix.map((c) => c.name)"
        :label="radarLabel"
        :caption="t('ui.result.radar.caption')"
      />    </div>

    <div class="foot">
      <template v-if="rest.length > 0">
        <button type="button" class="toggle" data-test="expand" @click="expanded = !expanded">
          {{ expanded ? t('ui.result.collapse') : t('ui.result.expandRest', { n: rest.length }) }}
        </button>

        <ol v-if="expanded" class="ranking">
          <li v-for="c in rest" :key="c.ismId" data-test="candidate">
            <div class="line">
              <span class="rank num">{{ c.rank }}</span>
              <span class="ism">{{ c.name }}</span>
              <span class="fit num" data-test="fit">{{ c.fitPct }}%</span>
              <button
                type="button"
                class="detail-toggle"
                :aria-expanded="detailOf === c.ismId"
                :data-test="`detail-${c.ismId}`"
                @click="toggleDetail(c.ismId)"
              >
                {{ t('ui.result.ismDetail') }}
              </button>
            </div>
            <div v-if="detailOf === c.ismId" class="detail" data-test="ism-detail">
              <p class="desc">{{ c.description }}</p>
            </div>
          </li>
        </ol>
      </template>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--rail-radar);
  column-gap: var(--rail-gap);
  align-items: start;
  padding: var(--sp-5);
  margin-bottom: var(--sp-4);
}

.head {
  grid-column: 1;
  grid-row: 1;
}

/* 跨两行：左栏展开列表时右栏不动。
   `justify-self` 保持默认（stretch）—— 写成 `end` 会让这一栏收缩到内容宽，
   雷达就撑不满预留的区域，"提前预留"也就白留了。 */
.aside {
  grid-column: 2;
  grid-row: 1 / span 2;
}

.foot {
  grid-column: 1;
  grid-row: 2;
}

.construct {
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--ink-2);
  margin: 0 0 var(--sp-2);
}

.champion {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin: 0 0 var(--sp-2);
}

.champion-name {
  font-size: var(--fs-xl);
  font-weight: 600;
  line-height: var(--lh-tight);
}

.rank {
  font-size: var(--fs-xs);
  color: var(--ink-2);
}

/* 灰色介绍小字：紧跟冠军名，是"这是什么"的答案 */
.champion-desc {
  margin: 0;
  color: var(--ink-2);
  font-size: var(--fs-sm);
  max-width: var(--measure);
}

.toggle {
  margin-top: var(--sp-4);
  border-color: transparent;
  background: none;
  padding: var(--sp-1) 0;
  font-size: var(--fs-sm);
  color: var(--accent);
}

.toggle:hover,
.detail-toggle:hover {
  background: none;
  box-shadow: none;
  text-decoration: underline;
}

.ranking {
  list-style: none;
  margin: var(--sp-3) 0 0;
  padding: 0;
  font-size: var(--fs-sm);
}

.ranking > li {
  padding: var(--sp-2) 0;
  border-bottom: 1px solid var(--rule-soft);
}

.ranking > li:last-child {
  border-bottom: 0;
}

.line {
  display: grid;
  grid-template-columns: 2.2em 1fr auto auto;
  gap: var(--sp-3);
  align-items: baseline;
}

.fit {
  color: var(--ink-2);
}

.detail-toggle {
  border-color: transparent;
  background: none;
  padding: 0;
  font-size: var(--fs-xs);
  color: var(--accent);
}

.detail {
  margin: var(--sp-2) 0 var(--sp-2);
  padding-left: var(--sp-3);
  border-left: 2px solid var(--rule);
}

.desc {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--ink);
  max-width: var(--measure);
}

/* 窄屏：单栏，顺序为 冠军 → 雷达 → 展开与列表 */
@media (max-width: 900px) {
  .card {
    grid-template-columns: minmax(0, 1fr);
  }

  .head,
  .aside,
  .foot {
    grid-column: 1;
    grid-row: auto;
  }

  /* 窄屏也**撑满**（不要 justify-self: center）：收缩到内容宽时，
     绘图区那个 `aspect-ratio` + 百分比宽的方框算不出确定宽度，会缩成"最宽标签那么宽"，
     长的主义名于是溢出柱子。居中交给 `.radar` 自己的 `margin: 0 auto`。 */
  .aside {
    margin-top: var(--sp-4);
  }}

@media (max-width: 480px) {
  .card {
    padding: var(--sp-4);
  }

  .champion-name {
    font-size: var(--fs-lg);
  }

  .line {
    grid-template-columns: 2em 1fr auto;
  }

  /* 第 4 列（"介绍"按钮）在窄屏上换到下一行，免得名称被压成一列字 */
  .detail-toggle {
    grid-column: 2 / -1;
    justify-self: start;
  }
}
</style>
