import js from '@eslint/js'
import tseslint from 'typescript-eslint'

// 依赖方向（spec §3.2）：ui → {data, i18n, core}；data → core；i18n → ∅；core → ∅；tools → {core, data, i18n}
//
// 这些模式按**相对路径**匹配，而 '..' 是普通段名不是通配符，所以每条禁止方向都要
// 把裸引用（'../tools'）与带子路径（'../tools/x'）分开写、把每一层深度('..' 个数)
// 分别列出：'**/data/**' 匹配不到 '../data'，'../tools{,/**}' 匹配不到 '../../tools/x'。
// 两者都漏过真实违规，所以宁可啰嗦。代价是比项目实际更深的相对路径（'../../../tools/x'）
// 不在覆盖内——这种路径会先撞上 no-restricted-imports 之外的模块解析问题，不值得为它加规则。
const at = (prefix, dir) => [`${prefix}${dir}`, `${prefix}${dir}{,/**}`]
const NO_UI = { group: ['**/ui/**'], message: '不得依赖 ui（spec §3.2 单向依赖）' }
const NODE_BUILTINS = { group: ['node:*'], message: '浏览器打包路径不得引入 Node 内置模块' }
const fromDirs = (names, prefixes) => ({
  group: prefixes.flatMap((p) => names.flatMap((d) => at(p, d))),
  message: `不得依赖 ${names.join(' / ')}（spec §3.2 单向依赖）`,
})
const noTools = (prefixes) => fromDirs(['tools'], prefixes)
const noI18n = (prefixes) => fromDirs(['i18n'], prefixes)

const LAYER_RULES = [
  { files: ['src/core/**/*.ts'], patterns: [NO_UI, NODE_BUILTINS, noTools(['../']), noI18n(['../']),
    { group: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vue/**'], message: 'core 必须是零框架依赖的纯 TS（spec §3.2）' },
    { group: at('../', 'data'), message: 'core 不得依赖任何内容层（spec §3.2）' }] },
  // src/data 自带 Node 侧加载器（node:fs/promises），约束是「浏览器侧不得 import 它」，
  // 由 src/ui 那条规则兜住，故此处不封 node 内置模块。
  { files: ['src/data/**/*.ts'], patterns: [NO_UI, noTools(['../', '../../']), noI18n(['../'])] },
  { files: ['src/i18n/**/*.ts'], patterns: [NO_UI, NODE_BUILTINS, noTools(['../', '../../'])] },
  { files: ['src/ui/**/*.ts'], patterns: [NODE_BUILTINS, noTools(['../'])] },
  { files: ['tools/**/*.ts'], patterns: [
    { group: ['**/ui/**'], message: 'tools 不得依赖 ui——会把 Vue 拖进构建期工具（spec §3.2）' },
    { group: ['**/i18n/*.json'], message: '取文案请走 tools/gates/text.ts 的 ALL_TEXTS 或 tools/i18n/bundle.ts（spec §3.2）' }] },
]

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.superpowers/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...LAYER_RULES.map(({ files, patterns }) => ({
    files,
    rules: { 'no-restricted-imports': ['error', { patterns }] },
  })),
  {
    // core 是纯 TS：任何宿主/运行时全局都是越界。globalThis 与 process 拦的是"绕过点名检查"，
    // 只列 window/document 时 globalThis.localStorage 这类写法照样能过。
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-globals': ['error',
        ...['window', 'document', 'localStorage', 'sessionStorage', 'navigator', 'fetch', 'globalThis', 'process']
          .map((name) => ({ name, message: 'core 不得访问宿主/运行时全局（Global Constraints）' })),
      ],
    },
  },
  {
    // 语言包仅有的两个合法入口：闸门取文本的 ALL_TEXTS、i18n 校验本身。
    // 其余位置取文案必须经它们，否则会在别处再长出一份口径（计划 4 复核 C2 的成因）。
    files: ['tools/gates/text.ts', 'tools/i18n/cli.ts', 'tools/i18n/bundle.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
)
