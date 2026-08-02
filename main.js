// ==========================================
// IsmoType 主逻辑 v2.4
// 文件: main.js
// 新增: 自动发现 languages/ 文件夹中的语言文件
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // 全局状态
    // ==========================================
    const app = document.getElementById('app');
    const QUESTIONS = [];
    let currentLang = 'zh';
    let isOnHome = true;
    let isQuizActive = false;

    let answers = [];
    let currentIndex = 0;
    let totalQuestions = 0;

    // 语言注册表
    if (!window.LANG_REGISTRY) window.LANG_REGISTRY = {};

    // DOM 元素
    const langBtn = document.getElementById('langToggle');
    const langMenu = document.getElementById('langMenu');

    // ==========================================
    // 工具函数
    // ==========================================
    function getLang() { return currentLang; }

    function setLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        updateLangUI();
    }

    function updateLangUI() {
        if (langBtn) {
            const data = window.LANG_REGISTRY[currentLang];
            langBtn.textContent = data?.flag || '🌐';
        }
        document.querySelectorAll('.lang-menu-item').forEach(el => {
            const l = el.dataset.lang;
            el.classList.toggle('active', l === currentLang);
            const check = el.querySelector('.lang-menu-check');
            if (check) check.textContent = l === currentLang ? '✓' : '';
        });
        closeLangMenu();
    }

    function t(key) {
        const lang = window.LANG || window.LANG_ZH;
        if (!lang) return key;
        const keys = key.split('.');
        let val = lang;
        for (const k of keys) {
            if (val && typeof val === 'object' && k in val) val = val[k];
            else return key;
        }
        return val || key;
    }

    function getIsmName(k) {
        const lang = window.LANG || window.LANG_ZH;
        return lang?.isms?.[k]?.name || k;
    }
    function getIsmDesc(k) {
        const lang = window.LANG || window.LANG_ZH;
        return lang?.isms?.[k]?.desc || '';
    }
    function getMbtiDesc(t) {
        const lang = window.LANG || window.LANG_ZH;
        return lang?.mbti?.[t] || '';
    }
    function getDimDesc(l) {
        const lang = window.LANG || window.LANG_ZH;
        return lang?.dimensions?.[l] || '';
    }
    function getFieldName(k) {
        const lang = window.LANG || window.LANG_ZH;
        return lang?.fields?.[k] || k;
    }
    function getUI(k) {
        const lang = window.LANG || window.LANG_ZH;
        return lang?.ui?.[k] !== undefined ? lang.ui[k] : k;
    }

    // ==========================================
    // 语言菜单
    // ==========================================
    function toggleLangMenu(e) {
        e?.stopPropagation();
        if (!langMenu) return;
        const isOpen = langMenu.style.display === 'block';
        if (isOpen) {
            closeLangMenu();
        } else {
            openLangMenu();
        }
    }

    function openLangMenu() {
        if (!langMenu) return;
        renderLangMenu();
        langMenu.style.display = 'block';
        document.addEventListener('click', closeLangMenuOnOutside);
    }

    function closeLangMenu() {
        if (langMenu) langMenu.style.display = 'none';
        document.removeEventListener('click', closeLangMenuOnOutside);
    }

    function closeLangMenuOnOutside(e) {
        if (!langMenu || !langBtn) return;
        if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
            closeLangMenu();
        }
    }

    function renderLangMenu() {
        if (!langMenu) return;
        const langs = window.LANG_REGISTRY || {};
        const keys = Object.keys(langs);
        if (keys.length === 0) {
            langMenu.innerHTML = `<div class="lang-menu-item" style="color:var(--text-muted);cursor:default;">无可用语言</div>`;
            return;
        }
        let html = '';
        keys.forEach(key => {
            const data = langs[key];
            const flag = data?.flag || '🌐';
            const label = data?.label || key;
            const active = key === currentLang;
            html += `
                <div class="lang-menu-item ${active ? 'active' : ''}" data-lang="${key}" onclick="window.switchLanguage('${key}')">
                    <span class="lang-menu-flag">${flag}</span>
                    <span class="lang-menu-label">${label}</span>
                    ${active ? '<span class="lang-menu-check">✓</span>' : ''}
                </div>
            `;
        });
        langMenu.innerHTML = html;
    }

    // ==========================================
    // 语言切换
    // ==========================================
    window.switchLanguage = function(lang) {
        if (lang === currentLang) { closeLangMenu(); return; }
        if (!window.LANG_REGISTRY[lang]) { closeLangMenu(); return; }

        const data = window.LANG_REGISTRY[lang];
        if (data) window.LANG = data;
        setLang(lang);
        loadQuestions(lang, function() {
            renderHome();
        });
        closeLangMenu();
    };

    // ==========================================
    // 自动发现并加载所有语言文件
    // ==========================================
    function autoDiscoverLanguages() {
        // 预定义支持的语言列表（可扩充）
        const supportedLangs = ['zh', 'en'];
        let loaded = 0;
        const total = supportedLangs.length;

        return new Promise((resolve) => {
            supportedLangs.forEach(lang => {
                // 检查是否已加载
                if (window.LANG_REGISTRY[lang]) {
                    loaded++;
                    if (loaded === total) resolve();
                    return;
                }
                // 尝试加载
                const script = document.createElement('script');
                script.src = `languages/${lang}.js`;
                script.onload = function() {
                    const key = lang.toUpperCase();
                    const data = window[`LANG_${key}`];
                    if (data) {
                        window.LANG_REGISTRY[lang] = data;
                        if (lang === 'zh') window.LANG_ZH = data;
                        if (lang === 'en') window.LANG_EN = data;
                        if (!window.LANG) window.LANG = data;
                        console.log(`✅ 自动注册语言: ${lang}`);
                    }
                    loaded++;
                    if (loaded === total) resolve();
                };
                script.onerror = function() {
                    // 语言文件不存在，静默跳过
                    console.log(`⚠️ 语言文件不存在: ${lang}.js，跳过`);
                    loaded++;
                    if (loaded === total) resolve();
                };
                document.head.appendChild(script);
            });
        });
    }

    // ==========================================
    // 题目加载
    // ==========================================
    function loadQuestions(lang, callback) {
        QUESTIONS.length = 0;
        let idx = 1;
        const total = 7;

        function next() {
            if (idx > total) { if (callback) callback(); return; }
            const s = document.createElement('script');
            s.src = `questions/questions_${lang}_${idx}.js`;
            s.onload = function() {
                const arr = window[`QUESTIONS_${lang.toUpperCase()}_${idx}`];
                if (Array.isArray(arr)) QUESTIONS.push(...arr);
                idx++;
                next();
            };
            s.onerror = function() {
                console.warn('跳过:', `questions_${lang}_${idx}.js`);
                idx++;
                next();
            };
            document.head.appendChild(s);
        }
        next();
    }

    // ==========================================
    // 控制栏控制
    // ==========================================
    function setLangBtnVisible(v) {
        if (langBtn) langBtn.classList.toggle('hidden', !v);
        if (!v) closeLangMenu();
    }

    // ==========================================
    // 渲染 MBTI 图片（带占位，居中）
    // ==========================================
    function renderMbtiImageHTML(type, size) {
        size = size || '80px';
        const fs = parseInt(size) * 0.4;
        return `<img src="images/mbti/${type.toLowerCase()}.png" alt="${type}" style="display:block; margin:0 auto 12px; width:${size}; height:${size}; border-radius:16px; object-fit:cover; background:var(--accent-light); border:2px solid var(--border);" onerror="this.outerHTML='<div class=\\'fallback-icon\\' style=\\'display:block; margin:0 auto 12px; width:${size}; height:${size}; border-radius:16px; background:var(--accent); color:white; text-align:center; line-height:${size}; font-size:${fs}px; font-weight:700; border:2px solid var(--border);\\'>${type}</div>';">`;
    }

    // ==========================================
    // 渲染 ISMS 图标（带占位）
    // ==========================================
    function renderIcon(path, name, size) {
        size = size || '56px';
        const initial = name ? name.charAt(0) : '?';
        const fs = parseInt(size) * 0.5;
        if (!path) {
            return `<div class="fallback-icon" style="width:${size};height:${size};font-size:${fs}px;">${initial}</div>`;
        }
        return `<img src="${path}" alt="${name}" style="width:${size};height:${size};border-radius:12px;object-fit:cover;flex-shrink:0;background:var(--accent-light);border:1px solid var(--border);" onerror="this.outerHTML='<div class=\\'fallback-icon\\' style=\\'width:${size};height:${size};font-size:${fs}px;\\'>${initial}</div>';">`;
    }

    // ==========================================
    // 渲染主页
    // ==========================================
    function renderHome() {
        isOnHome = true;
        isQuizActive = false;
        setLangBtnVisible(true);
        updateLangUI();

        const startBtn = getUI('startBtn');
        const heroNote = getUI('heroNote');
        const scrollText = getUI('scrollText');

        app.innerHTML = `
            <section id="home-hero">
                <div class="hero-content">
                    <svg class="logo-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="28" fill="none" stroke="var(--accent)" stroke-width="3"/>
                        <path d="M18 30 L30 12 L42 30 L30 48 Z" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
                        <circle cx="30" cy="30" r="6" fill="var(--accent)"/>
                        <line x1="8" y1="30" x2="18" y2="30" stroke="var(--accent)" stroke-width="2"/>
                        <line x1="42" y1="30" x2="52" y2="30" stroke="var(--accent)" stroke-width="2"/>
                        <line x1="30" y1="8" x2="30" y2="12" stroke="var(--accent)" stroke-width="2"/>
                        <line x1="30" y1="48" x2="30" y2="52" stroke="var(--accent)" stroke-width="2"/>
                    </svg>
                    <div class="hero-title">IsmoType</div>
                    <div class="hero-subtitle"><span>${getUI('heroSubtitle')}</span></div>
                    <div class="hero-divider"></div>
                    <div class="hero-stats">
                        <div class="stat">
                            <div class="number">16</div>
                            <div class="label"><span class="label-dot"></span>${getUI('statMbti')}</div>
                        </div>
                        <div class="stat">
                            <div class="number">200+</div>
                            <div class="label"><span class="label-dot"></span>${getUI('statIsms')}</div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="window.startQuiz()">${startBtn}</button>
                    <p class="hero-note">${heroNote}</p>
                </div>
                <div class="hero-footer">
                    <div class="scroll-indicator" id="scrollArrow">
                        <span class="arrow-icon">⌄</span>
                        <span class="arrow-icon">⌄</span>
                        <span class="scroll-text">${scrollText}</span>
                    </div>
                </div>
            </section>

            <section id="intro-section">
                <div class="intro-block" data-delay="0">
                    <h2>${getUI('introWhyTitle')}</h2>
                    <p>${getUI('introWhyDesc')}</p>
                    <p>${getUI('introWhyDesc2')}</p>
                </div>
                <div class="intro-block" data-delay="100">
                    <h2>${getUI('introCoverTitle')}</h2>
                    <div class="home-grid">
                        <div class="home-card"><span class="icon">🧠</span><h3>${getUI('cover1Title')}</h3><p>${getUI('cover1Desc')}</p></div>
                        <div class="home-card"><span class="icon">⚖️</span><h3>${getUI('cover2Title')}</h3><p>${getUI('cover2Desc')}</p></div>
                        <div class="home-card"><span class="icon">💰</span><h3>${getUI('cover3Title')}</h3><p>${getUI('cover3Desc')}</p></div>
                        <div class="home-card"><span class="icon">❤️</span><h3>${getUI('cover4Title')}</h3><p>${getUI('cover4Desc')}</p></div>
                        <div class="home-card"><span class="icon">🌿</span><h3>${getUI('cover5Title')}</h3><p>${getUI('cover5Desc')}</p></div>
                        <div class="home-card"><span class="icon">🎨</span><h3>${getUI('cover6Title')}</h3><p>${getUI('cover6Desc')}</p></div>
                    </div>
                </div>
                <div class="intro-block" data-delay="200">
                    <h2>${getUI('introHowTitle')}</h2>
                    <div class="steps">
                        <div class="step"><div class="step-num">1</div><h3>${getUI('step1Title')}</h3><p>${getUI('step1Desc')}</p></div>
                        <div class="step"><div class="step-num">2</div><h3>${getUI('step2Title')}</h3><p>${getUI('step2Desc')}</p></div>
                        <div class="step"><div class="step-num">3</div><h3>${getUI('step3Title')}</h3><p>${getUI('step3Desc')}</p></div>
                    </div>
                </div>
                <div class="intro-block" data-delay="300">
                    <div class="intro-cta">
                        <h2>${getUI('ctaTitle')}</h2>
                        <p style="max-width:500px;margin:0 auto 24px;">${getUI('ctaDesc')}</p>
                        <button class="btn btn-primary" onclick="window.startQuiz()">${startBtn}</button>
                    </div>
                </div>
            </section>
        `;

        // ===== 箭头点击：平滑滚动到介绍区 =====
        const arrow = document.getElementById('scrollArrow');
        const intro = document.getElementById('intro-section');
        if (arrow && intro) {
            const newArrow = arrow.cloneNode(true);
            arrow.parentNode.replaceChild(newArrow, arrow);
            newArrow.addEventListener('click', function(e) {
                e.stopPropagation();
                intro.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // 控制栏状态
        setLangBtnVisible(true);
        updateLangUI();
        renderLangMenu();

        if (langBtn) {
            langBtn.onclick = toggleLangMenu;
        }
    }

    // ==========================================
    // 初始化答题
    // ==========================================
    window.startQuiz = function() {
        if (QUESTIONS.length === 0) {
            loadQuestions(currentLang, function() {
                if (QUESTIONS.length === 0) {
                    showError('题目加载失败，请刷新重试');
                    return;
                }
                initQuiz();
            });
            return;
        }
        initQuiz();
    };

    function showError(msg) {
        app.innerHTML = `
            <div class="status-message">
                <span class="emoji">⚠️</span>
                <p>${msg}</p>
                <button class="btn btn-primary retry-btn" onclick="window.startQuiz()">重试</button>
            </div>
        `;
    }

    function initQuiz() {
        isOnHome = false;
        isQuizActive = true;
        setLangBtnVisible(false);

        totalQuestions = QUESTIONS.length;
        answers = new Array(totalQuestions).fill(null);
        currentIndex = 0;
        renderQuestion(currentIndex);
    }

    // ==========================================
    // 渲染题目
    // ==========================================
    function renderQuestion(idx) {
        const q = QUESTIONS[idx];
        if (!q) return;

        const labels = ['非常同意', '同意', '中立', '不同意', '非常不同意'];
        const labelsEn = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'];
        const isZh = currentLang === 'zh';
        const labelSet = isZh ? labels : labelsEn;

        let opts = '';
        for (let i = 0; i < 5; i++) {
            const sel = answers[idx] === i ? ' selected' : '';
            opts += `<div class="option-btn${sel}" onclick="window.selectAnswer(${idx},${i})"><div class="option-radio"></div><span>${labelSet[i]}</span></div>`;
        }

        const pct = totalQuestions > 0 ? ((idx) / totalQuestions) * 100 : 0;
        const qNum = getUI('questionNum') || '问题';
        const of = getUI('of') || '/';
        const prevLabel = getUI('prevBtn') || '上一题';
        const hint = getUI('navHint') || '点击选项自动前进';

        app.innerHTML = `
            <header style="text-align:center;margin-bottom:20px;">
                <svg class="logo-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" style="width:44px;height:44px;">
                    <circle cx="30" cy="30" r="28" fill="none" stroke="var(--accent)" stroke-width="3"/>
                    <path d="M18 30 L30 12 L42 30 L30 48 Z" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
                    <circle cx="30" cy="30" r="6" fill="var(--accent)"/>
                    <line x1="8" y1="30" x2="18" y2="30" stroke="var(--accent)" stroke-width="2"/>
                    <line x1="42" y1="30" x2="52" y2="30" stroke="var(--accent)" stroke-width="2"/>
                    <line x1="30" y1="8" x2="30" y2="12" stroke="var(--accent)" stroke-width="2"/>
                    <line x1="30" y1="48" x2="30" y2="52" stroke="var(--accent)" stroke-width="2"/>
                </svg>
                <h1 style="font-size:1.4rem;">IsmoType</h1>
                <p class="subtitle" style="font-size:0.85rem;">${getUI('heroSubtitle')}</p>
            </header>
            <div class="progress-bar-container"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="question-section">
                <div class="question-num">${qNum} ${idx+1} ${of} ${totalQuestions}</div>
                <div class="question-text">${q.q}</div>
                <div class="options">${opts}</div>
            </div>
            <div class="nav-buttons">
                <button class="btn btn-prev" ${idx===0?'disabled':''} onclick="window.prevQuestion()">${prevLabel}</button>
                <span class="nav-hint">${hint}</span>
            </div>
        `;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.selectAnswer = function(idx, val) {
        answers[idx] = val;
        renderQuestion(idx);
        setTimeout(() => {
            if (currentIndex === idx) {
                if (currentIndex < totalQuestions - 1) {
                    currentIndex++;
                    renderQuestion(currentIndex);
                } else {
                    showResults();
                }
            }
        }, 280);
    };

    window.prevQuestion = function() {
        if (currentIndex > 0) { currentIndex--; renderQuestion(currentIndex); }
    };

    // ==========================================
    // 计分逻辑（余弦相似度）
    // ==========================================
    function calcScores() {
        const mbtiScores = [0,0,0,0];
        const tagScores = new Array(TAGS.length).fill(0);
        let answered = 0;
        for (let i = 0; i < totalQuestions; i++) {
            if (answers[i] === null) continue;
            const w = answers[i] - 2;
            const q = QUESTIONS[i];
            if (q?.mbti) for (let d=0; d<4; d++) mbtiScores[d] += (q.mbti[d]||0) * w;
            if (q?.tags) for (let t=0; t<TAGS.length; t++) tagScores[t] += (q.tags[t]||0) * w;
            answered++;
        }
        if (answered === 0) return { mbtiScores: [0,0,0,0], tagScores: new Array(TAGS.length).fill(0) };
        return { mbtiScores, tagScores };
    }

    function getMBTIType(scores) {
        return [
            scores[0] >= 0 ? 'E' : 'I',
            scores[1] >= 0 ? 'S' : 'N',
            scores[2] >= 0 ? 'T' : 'F',
            scores[3] >= 0 ? 'J' : 'P'
        ].join('');
    }

    function calcDimPercents(scores) {
        const maxExp = 200;
        return scores.map(s => {
            const c = Math.max(-maxExp, Math.min(maxExp, s));
            return Math.min(100, Math.max(0, Math.round(((c/maxExp)+1)*50)));
        });
    }

    function calcIsmScores(tagScores) {
        let norm = 0;
        for (let t=0; t<TAGS.length; t++) norm += tagScores[t]*tagScores[t];
        norm = Math.sqrt(norm) || 1;
        const userVec = tagScores.map(s => s/norm);
        const results = {};
        for (const [field, isms] of Object.entries(ISMS)) {
            const items = [];
            for (const [name, data] of Object.entries(isms)) {
                let ismNorm = 0;
                for (let t=0; t<TAGS.length; t++) ismNorm += (data.tags[t]||0)*(data.tags[t]||0);
                ismNorm = Math.sqrt(ismNorm) || 1;
                let dot = 0;
                for (let t=0; t<TAGS.length; t++) dot += userVec[t] * (data.tags[t]||0) / ismNorm;
                const score = Math.round(((dot+1)/2)*100);
                items.push({ name, score: Math.max(0,Math.min(100,score)), desc: getIsmDesc(name), icon: data.icon||'' });
            }
            items.sort((a,b) => b.score - a.score);
            results[field] = items;
        }
        return results;
    }

    // ==========================================
    // 结果渲染
    // ==========================================
    function showResults() {
        isQuizActive = false;
        setLangBtnVisible(false);

        const { mbtiScores, tagScores } = calcScores();
        const mbtiType = getMBTIType(mbtiScores);
        const mbtiDesc = getMbtiDesc(mbtiType);
        const dimPercents = calcDimPercents(mbtiScores);
        const ismResults = calcIsmScores(tagScores);

        const dimPairs = [['E','I'], ['S','N'], ['T','F'], ['J','P']];
        const dimColors = [
            { left: '#b384ba', right: '#d35c5f' },
            { left: '#7eb896', right: '#62a87b' },
            { left: '#7696c5', right: '#4c72b0' },
            { left: '#9c8fc2', right: '#8172b2' }
        ];

        const resultTitle = getUI('resultTitle') || '人格 / 主义评测结果';
        const mbtiLabel = getUI('mbtiLabel') || 'MBTI 人格';
        const fullBtn = getUI('fullReportBtn') || '查看完整报告';
        const hideBtn = getUI('hideReportBtn') || '收起完整报告';
        const restartLabel = getUI('restartBtn') || '重新测试';
        const rankToggle = getUI('rankTableToggle') || '▼ 查看完整排名';
        const dimDetail = getUI('dimensionDetail') || '查看详情';

        const mbtiImgHTML = renderMbtiImageHTML(mbtiType, '120px');

        let html = `
            <h2 class="result-title">${resultTitle}</h2>
            <div class="summary-mbti-section">
                ${mbtiImgHTML}
                <div class="summary-mbti-type">${mbtiType}</div>
                <p style="color:var(--text-light);max-width:500px;margin:8px auto 0;">${mbtiDesc}</p>
            </div>
            <div class="summary-isms-grid">
        `;

        const fields = Object.keys(ismResults);
        fields.forEach((field, idx) => {
            const top = ismResults[field][0] || { name: '—', icon: '' };
            const name = getIsmName(top.name);
            html += `
                <div class="summary-ism-item">
                    ${renderIcon(top.icon, name, '56px')}
                    <div class="summary-ism-name">${name}</div>
                </div>
            `;
            if (idx === 2) html += `</div><div class="summary-isms-grid">`;
        });
        html += `</div>`;

        html += `
            <div style="text-align:center;margin:30px 0;">
                <button class="btn btn-primary" id="toggleReportBtn" onclick="window.toggleFullReport()">${fullBtn}</button>
            </div>
            <div id="fullReport" style="display:none;">
                <div class="report-section">
                    <h3 class="report-title">${mbtiLabel}</h3>
                    <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center;margin-bottom:20px;">
                        ${renderMbtiImageHTML(mbtiType, '80px')}
                        <div>
                            <div style="font-size:2rem;font-weight:800;color:var(--accent-dark);">${mbtiType}</div>
                            <p style="color:var(--text-light);margin-top:8px;max-width:400px;">${mbtiDesc}</p>
                        </div>
                    </div>
                    <div class="spectrum-grid">
        `;

        dimPairs.forEach((pair, i) => {
            const leftLetter = pair[0], rightLetter = pair[1];
            const leftPct = dimPercents[i], rightPct = 100 - leftPct;
            const color = dimColors[i];
            const leftDesc = getDimDesc(leftLetter);
            const rightDesc = getDimDesc(rightLetter);

            html += `
                <div class="spectrum-item">
                    <div class="spectrum-labels"><span>${leftLetter}</span><span>${rightLetter}</span></div>
                    <div class="spectrum-bar">
                        <div class="spectrum-fill left-fill" style="width:${leftPct}%;background:${color.right};"></div>
                        <div class="spectrum-gap"></div>
                        <div class="spectrum-fill right-fill" style="width:${rightPct}%;background:${color.left};"></div>
                    </div>
                    <div class="spectrum-percents"><span>${leftPct}%</span><span>${rightPct}%</span></div>
                    <div class="spectrum-detail-toggle" onclick="window.toggleDimDesc('dimDesc${i}')">${dimDetail}</div>
                    <div id="dimDesc${i}" class="dim-desc-content" style="display:none;">
                        <p><strong>${leftLetter}</strong> ${leftDesc}</p>
                        <p><strong>${rightLetter}</strong> ${rightDesc}</p>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;

        fields.forEach(field => {
            const items = ismResults[field];
            if (!items?.length) return;
            const top = items[0];
            const fieldName = getFieldName(field);
            const fieldKey = field.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '_');

            html += `
                <div class="report-section">
                    <h3 class="report-title">${fieldName}</h3>
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap;">
                        ${renderIcon(top.icon, getIsmName(top.name), '48px')}
                        <div>
                            <strong style="font-size:1.2rem;">${getIsmName(top.name)}</strong>
                            <p style="color:var(--text-light);margin-top:4px;">${top.desc || getIsmDesc(top.name)}</p>
                        </div>
                    </div>
                    <div class="radar-container"><canvas class="radar-chart" id="radar_${fieldKey}" width="350" height="350"></canvas></div>
                    <div class="rank-table-toggle" onclick="window.toggleTable('${fieldKey}')">${rankToggle}</div>
                    <table class="rank-table" id="table_${fieldKey}">
                        <thead><tr><th>#</th><th>${getUI('rankName')||'主义'}</th><th>${getUI('rankScore')||'匹配度'}</th><th>${getUI('rankDesc')||'描述'}</th></tr></thead>
                        <tbody>
            `;
            items.forEach((item, idx) => {
                const name = getIsmName(item.name);
                html += `<tr><td>${idx+1}</td><td><strong>${name}</strong></td><td>${item.score}%</td><td>${item.desc||getIsmDesc(item.name)}</td></tr>`;
            });
            html += `</tbody></table></div>`;
        });

        html += `</div><div class="restart-btn"><button class="btn btn-primary" onclick="window.restartTest()">${restartLabel}</button></div>`;
        app.innerHTML = html;

        // 绘制雷达图
        fields.forEach(field => {
            const items = ismResults[field];
            if (!items?.length) return;
            const top8 = items.slice(0,8);
            const canvas = document.getElementById('radar_' + field.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '_'));
            if (canvas) drawRadar(canvas, top8.map(i=>getIsmName(i.name)), top8.map(i=>i.score));
        });

        window.toggleFullReport = function() {
            const report = document.getElementById('fullReport');
            const btn = document.getElementById('toggleReportBtn');
            if (report.style.display === 'none') {
                report.style.display = 'block';
                btn.textContent = hideBtn;
            } else {
                report.style.display = 'none';
                btn.textContent = fullBtn;
            }
        };
        window.toggleDimDesc = function(id) {
            const el = document.getElementById(id);
            if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
        };
        window.toggleTable = function(key) {
            const table = document.getElementById('table_'+key);
            if (table) {
                table.classList.toggle('visible');
                const toggle = table.previousElementSibling;
                if (toggle?.classList.contains('rank-table-toggle')) {
                    const isVisible = table.classList.contains('visible');
                    toggle.textContent = isVisible ? '▲ ' + (getUI('rankTableHide')||'收起排名') : (getUI('rankTableToggle')||'▼ 查看完整排名');
                }
            }
        };
        window.restartTest = function() {
            answers = new Array(totalQuestions).fill(null);
            currentIndex = 0;
            renderQuestion(0);
        };
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==========================================
    // 绘制雷达图
    // ==========================================
    function drawRadar(canvas, labels, values) {
        if (!labels.length) return;
        const ctx = canvas.getContext('2d');
        const w=canvas.width, h=canvas.height, cx=w/2, cy=h/2, r=Math.min(w,h)*0.32;
        ctx.clearRect(0,0,w,h);
        for (let level=0.2; level<=1; level+=0.2) {
            ctx.beginPath();
            for (let i=0; i<labels.length; i++) {
                const a=Math.PI*2*i/labels.length - Math.PI/2;
                const x=cx+r*level*Math.cos(a), y=cy+r*level*Math.sin(a);
                i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
            }
            ctx.closePath();
            ctx.strokeStyle='var(--border,#d4e0dd)'; ctx.stroke();
        }
        for (let i=0; i<labels.length; i++) {
            const a=Math.PI*2*i/labels.length - Math.PI/2;
            ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));
            ctx.strokeStyle='var(--border,#d4e0dd)'; ctx.stroke();
        }
        const maxVal=Math.max(...values,1);
        ctx.beginPath();
        for (let i=0; i<labels.length; i++) {
            const a=Math.PI*2*i/labels.length - Math.PI/2;
            const v=values[i]/maxVal;
            const x=cx+r*v*Math.cos(a), y=cy+r*v*Math.sin(a);
            i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.fillStyle='rgba(59,122,110,0.25)'; ctx.fill();
        ctx.strokeStyle='var(--accent,#3b7a6e)'; ctx.lineWidth=2.5; ctx.stroke();
        ctx.fillStyle='var(--text,#1e2b2a)';
        ctx.font='11px "PingFang SC","Segoe UI",sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        for (let i=0; i<labels.length; i++) {
            const a=Math.PI*2*i/labels.length - Math.PI/2;
            ctx.fillText(labels[i], cx+(r+22)*Math.cos(a), cy+(r+22)*Math.sin(a));
        }
    }

    // ==========================================
    // 启动
    // ==========================================
    async function init() {
        // 自动发现并加载所有语言文件
        await autoDiscoverLanguages();

        // 设置默认语言（优先中文）
        if (window.LANG_REGISTRY['zh']) {
            window.LANG = window.LANG_REGISTRY['zh'];
            setLang('zh');
        } else if (window.LANG_REGISTRY['en']) {
            window.LANG = window.LANG_REGISTRY['en'];
            setLang('en');
        } else {
            console.warn('没有可用的语言包');
        }

        // 加载题目（默认中文）
        const defaultLang = window.LANG_REGISTRY['zh'] ? 'zh' : (window.LANG_REGISTRY['en'] ? 'en' : 'zh');
        loadQuestions(defaultLang, function() {
            if (QUESTIONS.length === 0) {
                // 兼容旧文件格式
                const s = document.createElement('script');
                s.src = 'questions/questions_1.js';
                s.onload = function() {
                    for (let i=1; i<=7; i++) {
                        const arr = window[`QUESTIONS_${i}`];
                        if (Array.isArray(arr)) {
                            QUESTIONS.push(...arr);
                            window[`QUESTIONS_ZH_${i}`] = arr;
                        }
                    }
                    if (QUESTIONS.length === 0) {
                        app.innerHTML = `<div class="status-message"><span class="emoji">⚠️</span><p>题目加载失败，请确保 questions 文件夹存在。</p></div>`;
                        return;
                    }
                    renderHome();
                };
                s.onerror = function() {
                    app.innerHTML = `<div class="status-message"><span class="emoji">⚠️</span><p>题目加载失败，请刷新重试。</p><button class="btn btn-primary retry-btn" onclick="location.reload()">刷新</button></div>`;
                };
                document.head.appendChild(s);
                return;
            }
            renderHome();
        });

        updateLangUI();
        renderLangMenu();

        if (langBtn) {
            langBtn.onclick = toggleLangMenu;
        }

        console.log('✅ main.js v2.4 加载完成');
    }

    // ==========================================
    // 启动
    // ==========================================
    if (typeof TAGS === 'undefined' || typeof ISMS === 'undefined') {
        app.innerHTML = '<p style="text-align:center;padding:40px;">数据文件缺失，请刷新重试。</p>';
        return;
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    window.__main = { getLang, setLang, renderHome, initQuiz, showResults, QUESTIONS };
    console.log('✅ main.js 加载完成');
})();