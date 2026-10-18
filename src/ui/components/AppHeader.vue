<script setup lang="ts">
/**
 * 站头。左侧站名（回首页），右侧两个开关：语言、亮暗。
 *
 * **首页不显示小号站名**：那里有一块居中的大标题 + 图标，再挂一个同名的链接
 * 是同一句话说两遍。其余页面保留它 —— 它是回首页的唯一入口。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePrefsStore } from '../stores/prefs'

const { t } = useI18n()
const route = useRoute()
const prefs = usePrefsStore()

const onHome = computed(() => route.name === 'home')
/** 标签说的是"点了会怎样"，而不是"现在是什么" */
const themeLabel = computed(() =>
  prefs.theme === 'dark' ? t('ui.theme.toLight') : t('ui.theme.toDark'),
)
</script>

<template>
  <header class="site-header">
    <RouterLink v-if="!onHome" class="site-name" :to="{ name: 'home' }">
      {{ t('ui.app.title') }}
    </RouterLink>
    <span v-else />

    <div class="controls">
      <button
        type="button"
        class="control"
        :aria-label="t('ui.lang.switch')"
        data-test="lang-toggle"
        @click="prefs.toggle()"
      >
        {{ t(prefs.otherLabelKey) }}
      </button>

      <button
        type="button"
        class="control icon"
        :aria-label="themeLabel"
        :title="themeLabel"
        data-test="theme-toggle"
        @click="prefs.toggleTheme()"
      >
        <!-- 太阳 / 月亮：只在"点了会变成什么"上区分，不做旋转动画 -->
        <svg v-if="prefs.theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.4" />
          <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6" />
          <path d="M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path class="solid" d="M20 14.6A8.4 8.4 0 0 1 9.4 4a8.6 8.6 0 1 0 10.6 10.6z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--page-pad);
}

.site-name {
  font-family: var(--font-latin);
  font-weight: 600;
  font-size: var(--fs-md);
  letter-spacing: 0.02em;
  color: var(--ink);
  text-decoration: none;
}

.site-name:hover {
  color: var(--accent);
}

.controls {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-left: auto;
}

.control {
  border-color: transparent;
  background: none;
  padding: var(--sp-1) var(--sp-2);
  font-size: var(--fs-sm);
  color: var(--ink-2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.control:hover {
  color: var(--accent);
  border-color: transparent;
  background: none;
  box-shadow: none;
  text-decoration: underline;
}

/* 图标按钮不参与下划线：它没有可读的文字 */
.control.icon:hover {
  text-decoration: none;
}

.control svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
}

/* 月亮是实心的：描边在 18px 上会糊成一团 */
.control svg .solid {
  fill: currentColor;
  stroke: none;
}

@media (max-width: 480px) {
  .site-header {
    padding: var(--sp-3) var(--page-pad);
  }
}
</style>
