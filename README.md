# IsmoType — 人格与主义光谱测试

**一套测试，双重视角。** 通过 300+ 道多维题目，同时揭示你的 MBTI 人格类型与分布在六大领域的 200+ 种主义倾向。

[![在线体验](https://img.shields.io/badge/在线体验-ismotype_test-3b7a6e?style=for-the-badge&logo=githubpages)](https://lisparrowc1.github.io/ismotype_test/)
[![MIT License](https://img.shields.io/badge/License-MIT-3b7a6e?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/LISparrowC1/ismotype_test?style=for-the-badge&color=3b7a6e)](https://github.com/LISparrowC1/ismotype_test/stargazers)

---

## ✨ 特性

- **双维度测评**：同一套题目同时计算出你的 **MBTI 人格类型** 和 **6 大领域的主义光谱**（哲学、政治社会、经济、伦理价值、文化生活、艺术美学），涵盖 200+ 种具体主义。
- **300+ 精心设计的题目**：每道题均关联 26 个底层观念标签，通过加权映射精确定位你的思想坐标。
- **智能结果页**：摘要卡片直观展示主要人格与各领域代表性主义；雷达图呈现前 8 名；完整排名可展开查看百分比与描述。
- **多语言支持**：词典式架构，内置中英文。浏览器语言自动适配，右上角一键切换。支持添加新语言。
- **日夜主题**：跟随系统深色模式，亦可手动切换。背景动态光斑/星场动画，视觉细腻。
- **全 UI 动效**：主页滚动浮现、按钮光晕、选中脉冲、雷达图 Canvas 绘制，交互流畅。
- **纯前端，零依赖**：单个 HTML 入口，双击即可运行，无需构建工具或后端服务器。数据不持久化，保护隐私。
- **扩展友好**：新增题库只需放入 `questions/` 文件夹并按编号命名；新增语言需加入翻译文件并修改 `main.js`。

---

## 🚀 快速开始

### 本地运行
```bash
git clone https://github.com/LISparrowC1/ismotype_test.git
cd ismotype_test
```

### 增加题目

在 `questions/` 下新建 `questions_zh_4.js`（编号连续），格式如下：

```javascript
const QUESTIONS_ZH_4 = [
    {
        q: "在这里直接写入中文题目内容",  // 直接写文本，不是翻译键
        mbti: [0, 0, 0, 0],             // [E/I, S/N, T/F, J/P] 权重
        tags: [0, 0, 0, 0, ...]         // 26 个标签权重，与 TAGS 数组顺序一致
    }
];
```

**注意**：`questions_zh_4.js` 只会被中文语言加载。如果需要英文版本，需同时创建 `questions_en_4.js` 并翻译其中的 `q` 字段。

### 增加新语言

复制 `languages/zh.js` 并重命名为目标语言代码（如 `fr.js`），翻译所有键值对（保持键名不变）。

在 `questions/` 下创建对应的题目文件（如 `questions_fr_1.js` ~ `questions_fr_3.js`），将现有题目翻译后放入。

修改 `main.js` 中的 `autoDiscoverLanguages()` 函数：
```javascript
function autoDiscoverLanguages() {
    // 在 supportedLangs 数组中添加新语言代码
    const supportedLangs = ['zh', 'en', 'fr'];  // 添加 'fr'
    // ...
   }
```
刷新页面即可出现语言切换选项。

### 题目数量选择

首页「开始测试」按钮下方提供了 **100题 / 200题 / 300题** 选项，点击即可切换测试题量。系统会自动检测 `questions/` 目录下当前语言的可用题目文件，动态生成对应选项。

---

## 🖼️ 图标资源

### MBTI 图标（16个）
- 路径：`images/mbti/`
- 命名：全部小写，如 `intj.png`、`enfp.png`
- 缺失时自动显示占位块

### 主义图标（121个）
- 路径：`images/isms/`
- 命名：与 `data.js` 中 `icon` 字段一致，如 `existentialism.png`
- 缺失时自动显示首字母占位块

> 图标资源清单详见 `images/mbti/mbti.md` 和 `images/isms/isms.md`

---

## 📁 项目结构

```
ismotype_test/
├── index.html                      # 入口页面
├── data.js                         # 核心数据
├── main.js                         # 主逻辑
├── languages/                      # 语言包
│   ├── zh.js                       # 中文语言包
│   └── en.js                       # 英文语言包
├── questions/                      # 题库（每个文件100题）
│   ├── questions_zh_1.js           # 中文 核心100题
│   ├── questions_zh_2.js           # 中文 扩展一100题
│   ├── questions_zh_3.js           # 中文 扩展二100题
│   ├── questions_en_1.js           # 英文 核心100题
│   ├── questions_en_2.js           # 英文 扩展一100题
│   ├── questions_en_3.js           # 英文 扩展二100题
│   └── backup/                     # （未分类题目）
│       └── questions_zh_4.js       # （暂不启用）
└── images/                         # 图标资源
    ├── mbti/                   
    └── isms/                   
```

---

## 🧠 核心算法

### MBTI 计分
- 每题包含 4 个维度的权重（E/I, S/N, T/F, J/P），用户选择“非常同意”至“非常不同意”映射为 +2 至 -2 的权重，累加后根据正负判定倾向。

### 主义匹配（余弦相似度）
- 用户的 26 个观念标签得分构成向量，做 L2 归一化。
- 每个主义的标签权重向量也做 L2 归一化。
- 计算两者点积（余弦相似度），映射到 0~100 的匹配度得分。
- 每个领域内按得分降序排列，展示首位主义和排名列表。

---

## 🛠️ 技术栈

- **HTML5** + **CSS3**
- **JavaScript (ES6+)**
- **Canvas**
- **Intersection Observer**

---

## 🔧 已修复问题

| 问题 | 状态 |
|------|------|
| 雷达图主题适配（切换日夜模式后雷达图颜色不更新） | ✅ 已修复（v2.5 / v3.6） |
| 组合按钮缝隙与光晕（开始测试和下拉选择按钮之间视觉分离） | ✅ 已修复（v2.5 / v3.8） |
| UI 居中偏移（刷新后页面元素左偏） | ✅ 已修复（v2.6） |

---

## 🤝 贡献

欢迎任何形式的贡献！如果你发现了 Bug、有新的主义建议、或想增加题目/语言，请：

1. Fork 本项目
2. 创建你的特性分支
3. 提交你的修改
4. 推送到分支
5. 打开一个Pull Request

---

## 💡 理念

传统的性格测试只告诉你是什么类型，却忽略了你的思想底色。IsmoType 希望打破这种局限，通过同一套问题同时呈现人格特质与意识形态，让每个人都看到自己独特的思想坐标。

**没有标准答案，没有对错判断，每一次选择都在描摹你。**

---

## 📄 许可证

本项目采用 **MIT License** 开源协议，版权 © 2026 [LI_SparrowC1](https://github.com/LISparrowC1)。详情请见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

如果这个项目对你有启发，请给个 ⭐ 吧！
