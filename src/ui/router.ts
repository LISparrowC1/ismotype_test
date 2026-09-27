import { createRouter, createWebHashHistory, type Router } from 'vue-router'
import { usePrefsStore } from './stores/prefs'
import { useQuizStore } from './stores/quiz'

/**
 * 路由表。**hash 模式**：站点部署在 GitHub Pages（计划 7 / M9）。history 模式下用户刷新
 * `/quiz/ideology` 会 404，需要额外的 404 重写配置；本站不考虑 SEO，
 * 而"刷新即 404"是真实用户一定会踩的坑。故取 hash。
 */
export function createAppRouter(): Router {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/', name: 'home', component: () => import('./views/HomeView.vue') },
      { path: '/quiz/:block', name: 'quiz', component: () => import('./views/QuizView.vue') },
      { path: '/tiebreak', name: 'tiebreak', component: () => import('./views/TieBreakView.vue') },
      { path: '/result', name: 'result', component: () => import('./views/ResultView.vue') },
      // 未知路径回首页：地址栏打错字时给出路，而不是空白页
      { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
    scrollBehavior: () => ({ top: 0 }),
  })
  installGuards(router)
  return router
}

/**
 * 两个守卫，都只做重定向，**不弹窗、不阻断**：
 *
 * 1. **从没开始过**却访问答题段或结果页 → 回首页。
 *    判据是"开始过没有"，不是"答了几题" —— 首页的"重新开始"会先把作答清零再进第一段，
 *    用题数当判据会把刚点完开始的用户弹回首页（必然发生的死循环）。
 * 2. 没答完却访问结果页或定向页 → 送回**该继续的那一段**。
 *    结果依赖全部作答，没答完算出来的分数是假的；但把用户扔回首页又从零开始
 *    会丢掉已有进度，所以送到缺口所在处。
 *
 * 答了一部分的人当然可以继续答题、也可以自由跳到别的段：把"没答完"整个拦下
 * 会让中途退出的人再也回不到自己的进度。
 *
 * **"要不要打平定向"不在这里判**：那要跑一遍计分，而守卫每次导航都会执行。
 * 判在 `ResultView` 挂载时（它本来就要算结果），定向页在无事可做时自己回结果页。
 */
export function installGuards(router: Router): void {
  router.beforeEach((to) => {
    if (to.name === 'home') return true
    const prefs = usePrefsStore()
    const quiz = useQuizStore()

    // 有作答（含读档恢复的）也算开始过：老用户的 prefs 里没有 begun 标记时不能把他们挡在门外
    if (!prefs.begun && quiz.progress.answered === 0) return { name: 'home' }

    if ((to.name === 'result' || to.name === 'tiebreak') && !quiz.isComplete) {
      return { name: 'quiz', params: { block: quiz.firstIncompleteBlock() } }
    }
    return true
  })
}

export const router = createAppRouter()
