import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_LOCALE, LOCALES, currentLocale, setLocale, type Locale } from '../i18n'

const KEY = 'ismotype:prefs:v1'

export type Theme = 'light' | 'dark'

interface Persisted {
  version: number
  locale: Locale
  /** 是否开始过作答。守卫用它区分"从没开始"与"开始后又清空了" */
  begun: boolean
  /**
   * 主题。**字段缺失表示"没选过"**，此时按系统偏好 —— 所以加这个字段不需要
   * 升 `version`：旧存档读出来 `theme` 是 undefined，正好等于没选过。
   */
  theme?: Theme
}

/**
 * 初值从 `<html data-theme>` 读，而不是在这里再判一次 localStorage 与系统偏好。
 *
 * 判两遍就会出现两个真相源：index.html 的引导脚本为了防白屏必须在首次绘制前定下主题，
 * 这里若各自算一遍，改了一处忘了另一处就会"首屏暗、随后变亮"。DOM 属性是它们之间
 * 唯一的交接面。属性缺失（单测环境没有引导脚本）时按亮色。
 */
function themeFromDom(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/**
 * 界面偏好：目前只有语言。与作答分开存 —— 清空作答不该顺手丢掉语言选择，
 * 而且作答那份数据的版本语义（题库变了就作废）与偏好完全不同。
 */
export const usePrefsStore = defineStore('prefs', () => {
  const locale = ref<Locale>(DEFAULT_LOCALE)
  const storageAvailable = ref(true)
  /**
   * 是否开始过作答。
   *
   * **不能只看"答了几题"**：首页的"重新开始"会先把作答清零再进第一段，
   * 用题数当判据会让守卫把刚点完开始的用户弹回首页 —— 一个必然发生的死循环。
   * 这个标记与语言同存一处，清空作答不会顺手把它抹掉。
   */
  const begun = ref(false)
  const theme = ref<Theme>(themeFromDom())
  /** 本地是否存着偏好。首页据此决定"清除本地数据"要不要出现 */
  const stored = ref(false)

  function read(): string | null {
    try {
      return window.localStorage.getItem(KEY)
    } catch {
      storageAvailable.value = false
      return null
    }
  }

  function write(): void {
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({
          version: 1,
          locale: locale.value,
          begun: begun.value,
          theme: theme.value,
        } satisfies Persisted),
      )
      stored.value = true
    } catch {
      storageAvailable.value = false
    }
  }

  function remove(): void {
    try {
      window.localStorage.removeItem(KEY)
    } catch {
      storageAvailable.value = false
    }
  }

  function restore(): void {
    const raw = read()
    if (raw === null) {
      locale.value = currentLocale()
      return
    }
    stored.value = true
    try {
      const parsed = JSON.parse(raw) as Partial<Persisted>
      if (parsed.version !== 1) return
      begun.value = parsed.begun === true
      // 主题的 DOM 属性由引导脚本设过，这里只在存档里明确选了时对齐一次
      if (parsed.theme === 'light' || parsed.theme === 'dark') {
        theme.value = parsed.theme
        applyTheme(parsed.theme)
      }
      if (LOCALES.includes(parsed.locale as Locale)) apply(parsed.locale as Locale)
    } catch {
      // 坏存档：用默认值
    }
  }

  /**
   * 清掉本地偏好，回到"从没来过"的状态。
   *
   * **主题不在这里重算**：那条规则（没选过就按系统偏好）只在 `index.html` 的引导脚本里
   * 有一份，在这里再写一遍就是第二个真相源 —— 改了一处忘了另一处会得到
   * "清完还是旧主题"。调用方清完会重载页面，让引导脚本重新跑一次。
   *
   * 只清自己这一份存档；作答由 `quiz.reset()` 清。
   */
  function clearAll(): void {
    remove()
    stored.value = false
    begun.value = false
    locale.value = DEFAULT_LOCALE
    setLocale(DEFAULT_LOCALE)
  }

  function applyTheme(next: Theme): void {
    theme.value = next
    document.documentElement.dataset.theme = next
  }

  /** 亮暗切换。两态：首次进站按系统定，之后一直用用户选的那个。 */
  function toggleTheme(): void {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
    write()
  }

  function apply(next: Locale): void {
    locale.value = next
    setLocale(next)
  }

  function set(next: Locale): void {
    apply(next)
    write()
  }

  function toggle(): void {
    const idx = LOCALES.indexOf(locale.value)
    set(LOCALES[(idx + 1) % LOCALES.length]!)
  }

  /** 用户点过"开始"或"继续"。守卫据此放行答题段。 */
  function markBegun(): void {
    begun.value = true
    write()
  }

  /**
   * 另一种语言的文案键。**computed 必须真的依赖 `locale`** ——
   * 早期写法把 `other` 算成一个模块级常量再用进 computed，于是切换语言后
   * 这个值永远不变、按钮一直显示同一个语言名（测试抓住过）。
   */
  const otherLabelKey = computed(() =>
    locale.value === 'zh-CN' ? 'ui.lang.en' : 'ui.lang.zh',
  )

  restore()

  return {
    locale,
    begun,
    theme,
    stored,
    otherLabelKey,
    storageAvailable,
    set,
    toggle,
    toggleTheme,
    markBegun,
    clearAll,
  }
})
