这是可直接下载的 README.md 完整文件：

```markdown
# IsmoType — 人格与主义光谱测试

**一套测试，双重视角。超过300道多维题目，同时揭示你的MBTI人格与分布在六大领域的200余种主义倾向。**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**在线体验:** [https://lisparrowc1.github.io/ismotype_test/](https://lisparrowc1.github.io/ismotype_test/)

---

## 特性

- **双维度测评**  
  同一套题目同时计算出你的 **MBTI 人格类型** 和 **6大领域的主义光谱**（哲学、政治社会、经济、伦理价值、文化生活、艺术美学），涵盖200+种具体主义。
- **300+ 精心设计的题目**  
  每道题均关联26个底层观念标签，通过加权映射精确定位你的思想坐标。
- **智能结果页**  
  摘要卡片直观展示主要人格与各领域代表性主义；雷达图呈现前8名；完整排名可展开查看百分比与描述。
- **多语言支持**  
  词典式架构，内置中英文。遵循浏览器语言自动选择，右上角一键切换。添加新语言只需新增一个词典文件。
- **日夜主题**  
  跟随系统深色模式，亦可手动切换。背景动态光斑/星场动画，视觉细腻。
- **全UI动效**  
  主页滚动浮现、按钮光晕、选中脉冲、雷达图Canvas绘制，交互流畅。
- **纯前端，零依赖**  
  单个HTML入口，双击即可运行，无需构建工具或后端服务器。数据不持久化，保护隐私。
- **扩展友好**  
  新增题库只需放入 `questions/` 文件夹并按编号命名；新增语言只需复制词典文件翻译。

---

## 快速开始

### 本地运行
```bash
git clone https://github.com/lisparrowc1/ismotype_test.git
cd ismotype_test
# 直接用浏览器打开 index.html 即可
```

### 部署到 GitHub Pages
1. Fork 本仓库
2. 进入 `Settings` → `Pages`
3. 选择分支 `main`，文件夹 `/(root)`
4. 保存，稍等片刻访问 `https://你的用户名.github.io/ismotype_test/`

---

## 项目结构

```
ismotype_test/
├── index.html                  # 入口页面（含主题、语言切换UI）
├── data.js                     # 静态数据：标签、主义配方、MBTI/维度键
├── main.js                     # 核心逻辑：题库加载、答题、计分、渲染、翻译函数
├── questions/                  # 题库文件（按编号自动索引）
│   ├── questions_1.js
│   ├── questions_2.js
│   └── ...
├── languages/                  # 多语言词典
│   ├── zh-CN.js                # 中文UI与描述
│   ├── en.js                   # 英文UI与描述
│   ├── zh-CN-questions_1.js    # 中文题目文本（与题库一一对应）
│   ├── en-questions_1.js       # 英文题目文本
│   └── ...
└── images/                     # 图标资源（可自行替换）
    ├── mbti/                   # 16张MBTI插画 (如 intj.png)
    └── isms/                   # 200+张主义图标 (如 existentialism.png)
```

---

## 如何自定义

### 增加题目
1. 在 `questions/` 下新建 `questions_8.js`（编号连续）。
2. 文件格式：`const QUESTIONS_8 = [{ q: "翻译键", mbti: [...], tags: [...] }, ...];`
3. 在 `languages/` 下添加对应的中英文翻译文件：`zh-CN-questions_8.js` 和 `en-questions_8.js`。
4. 无需修改任何现有代码，系统会自动加载新文件。

### 增加语言
1. 复制 `zh-CN.js` 并重命名为目标语言代码（如 `ja.js`）。
2. 翻译所有键值对（保持键名不变）。
3. 同样为每个题库文件创建翻译文件（如 `ja-questions_1.js`）。
4. 在 `main.js` 的语言加载逻辑中添加该语言分支，或在切换语言函数中增加选项。

### 替换图标
- MBTI 图标：将16张PNG图片命名为 `intj.png`, `intp.png`, ... 放入 `images/mbti/`。
- 主义图标：按照 `data.js` 中的 `icon` 路径，将图片放入 `images/isms/`，文件名对应即可。

---

## 技术栈

- **HTML5 & CSS3** (自定义属性实现主题切换，Grid/Flexbox布局)
- **JavaScript (ES6)**  
  动态加载脚本、Intersection Observer 动画、Canvas 雷达图
- **词典式国际化**：运行时键值查找，无需额外库
- **无构建工具**：原生模块加载

---

## 贡献

欢迎任何形式的贡献！如果你发现了bug、有新的主义建议、或想增加题目/语言，请：
1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

请确保题目权重数据合理，并与现有标签体系匹配。对于主义定义，请附上可靠的来源或说明。

---

## 理念

传统的性格测试只告诉你是什么类型，却忽略了你的思想底色。IsmoType 希望打破这种局限，通过同一套问题同时呈现人格特质与意识形态，让每个人都看到自己独特的思想坐标。没有标准答案，没有对错判断，每一次选择都在描摹你。

---

## 许可证

[MIT License](LICENSE) © 2026 LI_SparrowC1

---

**如果这个项目对你有启发，请给个 ⭐ 吧！**
```
