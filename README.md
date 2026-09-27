# IsmoType — 人格与主义光谱测试

**一套测试，双重视角。** 通过 358 道多维题目，同时揭示你的四字母人格类型，以及你在 12 个构念、37 个维度上的思想坐标与最接近的主义。

[![在线体验](https://img.shields.io/badge/在线体验-ismotype_test-3b7a6e?style=for-the-badge&logo=githubpages)](https://lisparrowc1.github.io/ismotype_test/)
[![MIT License](https://img.shields.io/badge/License-MIT-3b7a6e?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/LISparrowC1/ismotype_test?style=for-the-badge&color=3b7a6e)](https://github.com/LISparrowC1/ismotype_test/stargazers)

---

## ✨ 特性

- **一次作答，两条结果线**：同一套题既给人格类型，也给思想倾向——人格看"你怎么想事"，主义看"你站哪一边"。
- **358 道题，分三段**：立场 248 题、性格底色 50 题、风格类型 60 题，按每题 3 秒估算约 18 分钟，随时可停、回来接着答。
- **三段三种量表**：立场六点（同意 ↔ 不同意）、性格底色五点（IPIP-50）、风格类型七点（−3…+3，以 0 为中性点），点数与外部常模保持一致。
- **121 个主义**：分属权力与治理、共同体与边界、变革与秩序、资源配置、分配与互助、个体与群体、生活取向、自然与技术、本体与意义、认识与理性、道德的基础、艺术的形式与表达这 12 个构念，落在 37 个子维度上，按余弦相似度给出匹配排名。
- **智能结果页**：类型卡 → 五条维度条 → 大五偏差条 → 每个构念的主义排名，前六名画成雷达图。
- **打平就多问一道**：某一维恰好 50/50 时先出一道二选一定向题，结果里绝不出现"X"这种中间态。
- **一键分享图**：把整份结果合成一张 1080×1920 的竖版长图，跟随当前亮暗主题，存下来就能发。
- **中英双语 · 日夜主题**：语言与主题随时切换，首次进入跟随系统；背景有光晕漂移与星野动效。
- **纯前端，零后端**：静态站点，没有服务器，不收集也不上传任何作答数据；进度只存在你自己的浏览器里，首页底部可以一键清除。
- **全程键盘可用**：数字键选项、方向键翻页、Esc 关弹窗，焦点始终可见。

> 风格类型那一段的题库与框架来自 16personalities（NERIS Type Explorer），界面沿用「MBTI」这个中文口语叫法。它不是官方 MBTI 测评工具，与 Myers & Briggs Foundation 及 The Myers-Briggs Company 没有任何关联；性格底色与立场两段的计分是认真做的。

---

## 🚀 快速开始

### 本地运行

```bash
git clone https://github.com/LISparrowC1/ismotype_test.git
cd ismotype_test
npm install
npm run dev
```

浏览器打开 **<http://localhost:5173>**。

> 用 `localhost` 而不是 `127.0.0.1`：Vite 监听的是 IPv6 的 `::1`，`127.0.0.1` 连不上。
>
> 需要 Node ≥ 22.12。

### 构建与部署

```bash
npm run build     # 打包，产物在 dist/
npm run preview   # 在本机预览打包产物
```

`dist/` 里是一堆纯静态文件，丢到任何静态托管都能跑：Nginx、对象存储 + CDN、Netlify / Vercel、GitHub Pages 都行，**不需要后端，也不需要任何环境变量**。

推到 `main` 分支后 `.github/workflows/deploy-pages.yml` 会自动打包并发布到 GitHub Pages。部署到子目录时要给构建传 `BASE_PATH`（例如 `BASE_PATH=/ismotype_test/ npm run build`），否则页面会去根路径找资源；工作流已按仓库名自动传好。

### 开发自检

```bash
npm run typecheck   # TypeScript 类型检查
npm run lint        # ESLint（含依赖方向约束）
```

---

## 📁 项目结构

```
ismotype_test/
├── index.html                      # 入口页面（首帧之前定下主题，暗色用户不会先看到白屏）
└── src/
    ├── core/                       # 计分引擎：纯 TS、零框架依赖、冻结契约
    ├── data/                       # 内容数据：分类学、题库、主义轮廓、常模、16 型文案
    ├── i18n/                       # 中英语言包：三层题干 + 主义/类型文案 + 界面文案
    └── ui/                         # 界面：四个视图 + 组件 + 雷达图 + 分享图
```

---

## 🧠 核心算法

### 三段三种量表

- **立场 248 题**：每题 6 个选项，从"非常同意"到"非常不同意"，索引 0 的权重为正、最同意。
- **性格底色 50 题**：IPIP-50 原题，每题 5 个选项，问的是"这句话有多准确"（索引 0 最不准确）。
- **风格类型 60 题**：每题 7 个选项，−3…+3，以 0 为中性点。

点数不能改：IPIP 改了就与公开常模失去可比性，风格类型改了就与题库来源对不上。

### 主义匹配（余弦相似度）

- 你的作答先按题目载荷投影到 37 个子维度上，构成一个向量。
- 每个主义在同一组维度上也有一条轮廓向量。
- 两边都做 L2 归一化后取点积（余弦相似度），就是匹配度。
- 每个构念内按匹配度降序排列，给出完整的候选排名，不截断。

### 维度数是算出来的，不是拍出来的

分类学不预设十几个维度然后硬凑题：维度数由有效秩剪枝决定。闸门盯着四件事——每个维度的题目覆盖度、题库近重复、主义轮廓之间的冗余对、以及每个维度的唯一方差。某一维被别的维完全解释，它就出局。

### 没有常模就不报百分位

`percentile: null` 时界面显示"暂无可比常模"，绝不编造一个看起来像百分位的数字。接入常模只需填 `src/data/norms/ipip50.v1.json`，代码不用动。

---

## 🛠️ 技术栈

- **HTML5** + **CSS3**（自定义属性做设计令牌，亮暗两套只换值不换名）
- **TypeScript**（strict）
- **Vue 3.5** + **Vite 8** + **Pinia** + **vue-router**（hash 模式）+ **vue-i18n**
- **Vitest** + **@vue/test-utils** + **happy-dom**
- 图表全部手写内联 SVG，分享图手写 Canvas —— 不引图表库，也不引 Canvas 库

---

## 💡 理念

传统的性格测试只告诉你是什么类型，却忽略了你的思想底色。IsmoType 希望打破这种局限，用同一套问题同时呈现人格特质与意识形态，让每个人都看到自己独特的思想坐标。

**没有标准答案，没有对错判断，每一次选择都在描摹你。**

---

## 📄 许可证

本项目采用 **MIT License** 开源协议，版权 © 2026 [LI_SparrowC1](https://github.com/LISparrowC1)。详情请见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

如果这个项目对你有启发，请给个 ⭐ 吧！
