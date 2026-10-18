import { createI18n } from 'vue-i18n'
import enJson from '../i18n/en.json'
import zhJson from '../i18n/zh-CN.json'

export const LOCALES = ['zh-CN', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'zh-CN'

export const MESSAGES: Record<Locale, Record<string, string>> = {
  'zh-CN': zhJson as Record<string, string>,
  en: enJson as Record<string, string>,
}

/**
 * 建 i18n 实例。
 *
 * **不要设 `flatJson: true`。** 这个名字容易让人以为"语言包是扁平的所以打开它"，
 * 但它在**运行时**的作用恰恰相反：把 `'ism.art.baroque'` 这样的扁平键**拆成嵌套对象**。
 * 实测（vue-i18n 11）：打开后一份 719 个扁平键的语言包被改写成 128 个顶层键 + 7 个嵌套对象
 * （`c` / `dim` / `ism` / `mbti` / `q` / `scale` / `ui`），并刷一屏
 * `[intlify] Ignore object flatten: 'baroque' key has an string value`。
 * 不打开时 719 个键原样保留，点号键 `t('c.power')` 直接可用 —— 这才是本项目要的行为。
 *
 * **必须传副本**：无论开不开那个选项，实例化都会**原地改写**传进来的对象，
 * 而语言包是 `import` 进来的模块单例 —— 被改写后**导入同一份 JSON 的调用方也一起坏掉**
 * （测试里 `zh['c.power']` 变 undefined、`Object.keys(zh).length` 从 719 变 128）。
 * 这个 bug 的症状会指向 JSON 文件本身，但文件一直是对的。
 *
 * `legacy: false`：Composition API 模式。`missingWarn` / `fallbackWarn` 关掉：
 * 缺键由构建期的 `npm run i18n:check` 负责报错，运行期刷警告只会淹没控制台。
 */
export function createAppI18n() {
  return createI18n({
    legacy: false,
    locale: DEFAULT_LOCALE,
    fallbackLocale: 'en',
    // 副本是这里的要点，见上面的说明
    messages: structuredClone(MESSAGES),
    missingWarn: false,
    fallbackWarn: false,
  })
}

export const i18n = createAppI18n()

export function currentLocale(): Locale {
  return i18n.global.locale.value as Locale
}

export function setLocale(locale: Locale): void {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
}

/** 组件里用的 `t`，签名只要 `(key: string) => string` —— 便于在测试里注入桩。 */
export type Translate = (key: string) => string

export function translate(): Translate {
  return (key: string) => i18n.global.t(key)
}
