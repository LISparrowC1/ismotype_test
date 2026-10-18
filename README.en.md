# IsmoType — Personality & Ideology Spectrum Test

[简体中文](README.md) | **English**

**One test, two lenses.** 358 multi-dimensional questions reveal both your four-letter personality type and your ideological coordinates across 12 constructs and 37 sub-dimensions, together with the ideologies closest to you.

[![Live Demo](https://img.shields.io/badge/Live_Demo-ismotype_test-3b7a6e?style=for-the-badge&logo=githubpages)](https://lisparrowc1.github.io/ismotype_test/)
[![MIT License](https://img.shields.io/badge/License-MIT-3b7a6e?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/LISparrowC1/ismotype_test?style=for-the-badge&color=3b7a6e)](https://github.com/LISparrowC1/ismotype_test/stargazers)

---

## ✨ Features

- **One session, two result lines** — the same questions yield both a personality type and an ideological profile: the first reads "how you think", the second "where you stand".
- **358 questions in three blocks**: 248 beliefs, 50 disposition, 60 style — roughly 18 minutes at 3 seconds per question. Stop anytime and pick up where you left off.
- **Three blocks, three scales**: 6-point agreement for beliefs (agree ↔ disagree), 5-point accuracy for disposition (IPIP-50), 7-point −3…+3 with 0 as neutral for style. The point counts are kept identical to the external norms they are compared against.
- **121 ideologies** across 12 constructs — power & governance, community & borders, change & order, resource allocation, distribution & mutual aid, individual & group, life orientation, nature & technology, ontology & meaning, knowledge & reason, foundations of morality, form & expression in art — mapped onto 37 sub-dimensions and ranked by cosine similarity.
- **Smart result page**: type card → five dimension bars → Big Five deviation bars → ideology ranking for every construct, with the top six drawn as a radar chart.
- **Ties get one more question**: a dimension that comes out exactly 50/50 triggers a two-option tie-break first, so an intermediate "X" never shows up in the result.
- **One-tap share image**: the whole result composed into a 1080×1920 portrait image that follows the current light/dark theme — save it and post it.
- **Bilingual · day/night themes**: switch language and theme anytime; the first visit follows the system. Ambient glow drift and a starfield sit in the background.
- **Pure front end, zero backend**: a static site with no server that neither collects nor uploads any answer data. Progress lives only in your own browser and can be wiped from the home page.
- **Fully keyboard accessible**: number keys to answer, arrow keys to page through, Esc to close dialogs — focus is always visible.

> The style block's question bank and framework come from 16personalities (NERIS Type Explorer); the interface keeps the colloquial Chinese name "MBTI". It is not an official MBTI assessment tool and has no affiliation with the Myers & Briggs Foundation or The Myers-Briggs Company. Scoring for the disposition and beliefs blocks is done in earnest.

---

## 🚀 Quick Start

### Run locally

```bash
git clone https://github.com/LISparrowC1/ismotype_test.git
cd ismotype_test
npm install
npm run dev
```

Open **<http://localhost:5173>**.

> Use `localhost`, not `127.0.0.1`: Vite listens on IPv6 `::1`, so `127.0.0.1` will not connect.
>
> Node ≥ 22.12 is required.

### Build and deploy

```bash
npm run build     # bundle into dist/
npm run preview   # preview the production build locally
```

`dist/` holds nothing but static files and runs on any static host: Nginx, object storage + CDN, Netlify / Vercel, GitHub Pages — **no backend, no environment variables**.

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds and publishes to GitHub Pages. Deploying under a sub-path requires passing `BASE_PATH` to the build (e.g. `BASE_PATH=/ismotype_test/ npm run build`), otherwise the page looks for assets at the site root; the workflow passes the repository name automatically.

### Self-checks

```bash
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint (includes dependency-direction rules)
```

---

## 📁 Project Structure

```
ismotype_test/
├── index.html                      # entry page (sets the theme before first paint, so dark-mode users never see a white flash)
└── src/
    ├── core/                       # scoring engine: pure TS, no framework deps, frozen contract
    ├── data/                       # content data: taxonomy, question bank, ideology profiles, norms, type copy
    ├── i18n/                       # zh-CN / en language packs: question stems + ideology/type copy + UI copy
    └── ui/                         # interface: four views + components + radar chart + share image
```

---

## 🧠 How It Works

### Three blocks, three scales

- **Beliefs, 248 questions**: 6 options each, from "strongly agree" to "strongly disagree"; index 0 carries the positive weight and means most agreement.
- **Disposition, 50 questions**: the original IPIP-50 items, 5 options each, asking how accurate each statement is (index 0 = least accurate).
- **Style, 60 questions**: 7 options each, −3…+3 with 0 as the neutral point.

The point counts cannot change: alter IPIP's and it loses comparability with the published norms; alter the style block's and it no longer matches its source.

### Ideology matching (cosine similarity)

- Your answers are projected onto the 37 sub-dimensions through the per-question loadings, forming a single vector.
- Every ideology carries a profile vector over the same dimensions.
- Both sides are L2-normalized and dot-producted (cosine similarity) — that value is the match score.
- Inside each construct the candidates are sorted by match score; the full ranking is returned, never truncated.

### The number of dimensions is computed, not chosen

The taxonomy does not presume a dozen dimensions and force questions into them: the dimension count is decided by effective-rank pruning. The gates watch four things — per-dimension question coverage, near-duplicate questions, redundant pairs between ideology profiles, and each dimension's unique variance. A dimension fully explained by the others drops out.

### No norms, no percentile

When `percentile: null`, the interface says "no comparable norms yet" rather than inventing a number that looks like a percentile. Adding norms means filling in `src/data/norms/ipip50.v1.json` — no code change needed.

---

## 🛠️ Tech Stack

- **HTML5** + **CSS3** (design tokens as custom properties; the light and dark sets share names and differ only in values)
- **TypeScript** (strict)
- **Vue 3.5** + **Vite 8** + **Pinia** + **vue-router** (hash mode) + **vue-i18n**
- **Vitest** + **@vue/test-utils** + **happy-dom**
- Every chart is hand-written inline SVG and the share image is hand-written Canvas — no chart library, no Canvas library

---

## 💡 Philosophy

Traditional personality tests tell you which type you are and leave out the mind underneath. IsmoType puts both into one set of questions, so everyone can see their own distinct coordinates of thought.

**No right answers, no judgement — every choice is a stroke in the portrait.**

---

## 📄 License

Released under the **MIT License**, copyright © 2026 [LI_SparrowC1](https://github.com/LISparrowC1). See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

If this project gave you something, please leave a ⭐!
