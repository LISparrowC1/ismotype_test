<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppHeader from './components/AppHeader.vue'
import BackdropLayer from './components/BackdropLayer.vue'

const { t } = useI18n()

/** 构建时由 vite.config.ts 的 define 注入，来源是 package.json 的 version */
const version = __APP_VERSION__
const AUTHOR_URL = 'https://github.com/LISparrowC1'
</script>

<template>
  <!-- 背景层在 .app-shell 之下（z-index 0 vs 1），固定定位，不参与滚动 -->
  <BackdropLayer />
  <div class="app-shell">
    <a class="skip-link" href="#main">{{ t('ui.app.skipToMain') }}</a>
    <AppHeader />
    <RouterView />
    <!--
      署名与版本号。**它属于站，不属于某一屏**，所以放这儿而不是塞进某个视图。
      分寸：12px、次级墨、居中、不参与任何布局竞争 —— 读得到，但不会先看到它。
    -->
    <footer class="site-footer">
      <a :href="AUTHOR_URL" target="_blank" rel="noreferrer">LI_SparrowC1</a>
      <span aria-hidden="true">·</span>
      <span>v{{ version }}</span>
    </footer>
  </div>
</template>

<style scoped>
.site-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-4) var(--page-pad) var(--sp-6);
  font-size: var(--fs-xs);
  line-height: 1.4;
  /* 次级墨：与标签、单位同一个层级，压得住又不消失 */
  color: var(--ink-2);
}

.site-footer a {
  color: inherit;
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease);
}

.site-footer a:hover,
.site-footer a:focus-visible {
  color: var(--accent);
  text-decoration: underline;
}

/* 短屏上（横屏手机那种）把下留白收一收，别为了署名多出一截可滚动的空白 */
@media (max-height: 560px) {
  .site-footer {
    padding-bottom: var(--sp-3);
  }
}
</style>
