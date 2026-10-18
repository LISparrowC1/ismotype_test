import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

/**
 * 版本号的唯一真相源是 `package.json`，构建时用 `define` 注进来。
 *
 * 为什么不让页面去 `import pkg from '../../package.json'`：那会把整份清单
 * （连依赖列表一起）打进包，只为取一个字符串；`define` 是文本替换，一个字节都不多带。
 */
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }

export default defineConfig({
  /**
   * 部署在子目录时要覆盖（GitHub Pages 的项目站点就在 `/<仓库名>/` 下）：
   * 不设的话产物里的资源都写死成 `/assets/...`，放到子目录里会 404。
   * `.github/workflows/deploy-pages.yml` 传的就是 `BASE_PATH=/ismotype_test/`。
   */
  base: process.env.BASE_PATH ?? '/',
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [vue()],
  server: {
    watch: {
      /**
       * 忽略 vitest 写测试文件时产生的临时目录。
       *
       * 不忽略会让 **dev 服务直接崩掉**：vitest 在测试文件旁建
       * `.ResultView.test.ts.<pid>.<uuid>.tmpdir/…tmp` 并立刻写入，而 Vite 的文件监视器
       * 在同一瞬间去 watch 它，Windows 下报 `EBUSY: resource busy or locked`，
       * 该错误是 `FSWatcher` 上的 `error` 事件，未捕获即终止进程（实测崩过一次）。
       */
      ignored: ['**/*.tmpdir/**', '**/*.tmp'],
    },
  },
  test: {
    globals: true,
    // 默认 node：core 与 tools 的测试是纯 Node，跑在 happy-dom 下会丢掉真实的 Node 语义。
    // 界面测试各自在文件顶部写 `// @vitest-environment happy-dom`。
    //
    // 为什么不用 environmentMatchGlobs：vitest 5 实测不生效（写了之后 tests/ui 里
    // `document` 仍是 undefined）。文件级指令更明确，也不依赖版本行为。
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
