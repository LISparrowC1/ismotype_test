<script setup lang="ts">
/**
 * 五条维度条：`E 78% ▓▓▓▓▓░░ 22% I`。**五维格式完全一致**，Identity 只是排在最后。
 *
 * 结构是两层，不是一层：
 * `row`（字母 + 轨道 + 字母）里放一条 `track`，`track` 内部才是两个色段。
 * 为什么不能把六个节点平铺成一行：`flex-basis` 的百分比是相对**父容器**的，
 * 平铺时两个色段用 78% / 22% 就吃掉了整行，四个文字节点只剩负空间；
 * 而 flex item 的 `min-width` 默认是 `auto`（min-content），`flex-shrink: 1`
 * 也压不到内容宽度以下 —— 那一行**必然横向溢出**。嵌套之后百分比相对的是轨道本身。
 *
 * 色段内的百分比**紧贴各自那一侧的字母**：左半 `justify-content: flex-start`、
 * 右半 `flex-end`，于是 `E 78% ▓▓▓░ 22% I` 里的两个数字分别落在自己那一段的内侧。
 *
 * 维度条不使用品牌色：那是类型卡的身份标识，混进来会让"颜色 = 哪个维度"产生歧义。
 * 只有未答满才是警告色，与全局规则一致（红只标不确定）。
 */
import { useI18n } from 'vue-i18n'
import type { MbtiDimensionRow } from '../result/mbti'

const props = defineProps<{
  rows: Array<MbtiDimensionRow & { leftLabel: string; rightLabel: string }>
}>()

const { t } = useI18n()

const partial = (r: MbtiDimensionRow): boolean => r.answered > 0 && r.answered < r.total

/**
 * 轨道宽度（字符数）。`ch` 在等宽数字下就是一个数字的宽度，用它当"这一行能放几个字"
 * 的尺子。取一个保守的常量而不是去量 DOM：这层只决定"显不显示"，不需要精确 ——
 * 估算偏小只会让数字更早消失，不会让数字被切一半。
 */
const TRACK_CH = 32

/**
 * 这一侧的百分比数字**装得下才渲染**。
 *
 * 极端值不是理论情况：全部题都选"非常同意"就会得到某一维 100% / 0%。
 * 宽度为 0 的色段里放数字，它会溢出压到对面那一段上；而用 `overflow: hidden`
 * 裁掉一半的数字（"0%" 只剩一条竖边）比不显示更难看，看着像渲染坏了。
 * 所以按"整条渲染或整条不渲染"处理：装不下时色段退化成一条纯色细条，
 * 语义仍由外侧字母与 `aria-label` 承载。
 */
function showsNumber(pct: number): boolean {
  if (pct <= 0) return false
  // 可用宽度（字符数）对比该数字的估算宽度：等宽数字约 0.62em/字，两侧各留 0.25em
  const capacity = (TRACK_CH * pct) / 100
  return capacity >= String(pct).length * 0.62 + 0.5
}
</script>

<template>
  <ul class="dims">
    <li v-for="r in props.rows" :key="r.dimension" class="dim">
      <h3 class="label">{{ r.label }}</h3>
      <p v-if="r.desc" class="desc">{{ r.desc }}</p>

      <p v-if="r.unmeasured" class="unmeasured">{{ t('ui.result.unmeasured') }}</p>

      <template v-else>
        <div class="row">
          <span class="letter" :class="{ lead: r.dominant === 'left' }" aria-hidden="true">
            {{ r.leftLetter }}
          </span>

          <span
            class="track"
            role="img"
            :aria-label="`${r.leftLabel} ${r.leftPct}% / ${r.rightLabel} ${r.rightPct}%`"
          >
            <span
              class="half lead"
              :style="{ flexBasis: `${r.leftPct}%` }"
              aria-hidden="true"
            >{{ showsNumber(r.leftPct) ? `${r.leftPct}%` : '' }}</span>
            <span
              class="half trail"
              :style="{ flexBasis: `${r.rightPct}%` }"
              aria-hidden="true"
            >{{ showsNumber(r.rightPct) ? `${r.rightPct}%` : '' }}</span>
          </span>

          <span class="letter" :class="{ lead: r.dominant === 'right' }" aria-hidden="true">
            {{ r.rightLetter }}
          </span>
        </div>

        <p v-if="partial(r)" class="meta uncertain">
          {{ t('ui.result.partial', { n: r.answered, total: r.total }) }}
        </p>
      </template>
    </li>
  </ul>
</template>

<style scoped>
.dims {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dim {
  padding: var(--sp-4) 0;
  border-bottom: 1px solid var(--rule-soft);
}

.dim:last-child {
  border-bottom: 0;
}

.label {
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--ink-2);
  margin: 0 0 var(--sp-2);
}

/* 两极说明：它是对照传统 E/I、S/N、T/F、J/P 的一把尺子，属于参考信息，
   所以比维度名更弱一档，也不抢条的注意力 */
.desc {
  margin: 0 0 var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--ink-2);
  max-width: var(--measure);
}

/* 字母在外、轨道在内：字母与它那一侧的色段相邻，读起来是一句话 */
.row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.letter {
  flex: 0 0 auto;
  font-size: var(--fs-md);
  font-weight: 600;
  color: var(--ink-2);
}

.letter.lead {
  color: var(--ink);
}

.track {
  display: flex;
  flex: 1;
  min-width: 0;
  height: 18px;
  /* 底衬。两条色段都撑满高度（align-self: stretch），所以正常情况下它一点也不露；
     它是为"某一段宽度为 0"那一档准备的，免得那里出现一条透明缝。 */
  background: var(--rule-soft);
}

/* flex-shrink 必须为 0：否则窄屏上色段会被数字挤窄，占比就不再是占比 */
.half {
  flex-grow: 0;
  flex-shrink: 0;
  /* 默认的 min-width: auto 会让内容顶住宽度，色段会被数字撑破 */
  min-width: 0;
  align-self: stretch;
  display: flex;
  align-items: center;
  font-size: var(--fs-xs);
  white-space: nowrap;
}

.half.lead {
  justify-content: flex-start;
  background: var(--accent);
  /* 压在实色上的文字色：两套主题各自给值，不要用 --paper 碰巧对上 */
  color: var(--accent-ink);
  padding-left: var(--sp-1);
}

.half.trail {
  justify-content: flex-end;
  background: var(--rule);
  /* 墨色而不是纸色：纸色压在 --rule 上对比度不足 3:1，数字会糊进灰底里 */
  color: var(--ink);
  padding-right: var(--sp-1);
}

.unmeasured {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--ink-2);
}

.meta {
  margin: var(--sp-2) 0 0;
  font-size: var(--fs-xs);
}

.meta.uncertain {
  color: var(--warn);
}
</style>
