// ==========================================
// IsmoType 主逻辑 v3.8
// 修复：组合按钮整体悬停光晕 + 区域细线分隔
// 文件: main.js
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // 全局状态
    // ==========================================
    const app = document.getElementById('app');
    let ALL_QUESTIONS = [];
    let QUESTIONS = [];
    let currentLang = 'zh';
    let isOnHome = true;
    let isQuizActive = false;

    let answers = [];
    let currentIndex = 0;
    let totalQuestions = 0;

    let availableFileCount = 0;
    let selectedCount = 100;

    if (!window.LANG_REGISTRY) window.LANG_REGISTRY = {};

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

    function getUI(k) {
        const val = t('ui.' + k);
        return val !== 'ui.' + k ? val : k;
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
            langMenu.innerHTML = `<div class="lang-menu-item" style="color:var(--text-muted);cursor:default;">${getUI('noQuestions')}</div>`;
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
        loadAllQuestionsForLang(lang, function() {
            selectedCount = 100;
            renderHome();
        });
        closeLangMenu();
    };

    // ==========================================
    // 自动发现语言包
    // ==========================================
    function autoDiscoverLanguages() {
        const supportedLangs = ['zh', 'en'];
        let loaded = 0;
        const total = supportedLangs.length;

        return new Promise((resolve) => {
            supportedLangs.forEach(lang => {
                if (window.LANG_REGISTRY[lang]) {
                    loaded++;
                    if (loaded === total) resolve();
                    return;
                }
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
                    console.log(`⚠️ 语言文件不存在: ${lang}.js，跳过`);
                    loaded++;
                    if (loaded === total) resolve();
                };
                document.head.appendChild(script);
            });
        });
    }

    // ==========================================
    // 加载该语言的全部题库
    // ==========================================
    function loadAllQuestionsForLang(lang, callback) {
        ALL_QUESTIONS = [];
        let idx = 1;
        let totalFiles = 0;
        const maxAttempts = 20;

        function tryLoad() {
            if (idx > maxAttempts) {
                availableFileCount = totalFiles;
                console.log(`✅ 语言 ${lang} 共发现 ${totalFiles} 个文件 (${totalFiles*100} 题)`);
                if (callback) callback();
                return;
            }
            const script = document.createElement('script');
            script.src = `questions/questions_${lang}_${idx}.js`;
            script.onload = function() {
                const key = `QUESTIONS_${lang.toUpperCase()}_${idx}`;
                if (window[key] && Array.isArray(window[key])) {
                    const qs = window[key];
                    if (qs.length === 100) {
                        ALL_QUESTIONS.push(...qs);
                        totalFiles++;
                        console.log(`✅ 加载 ${lang} 文件 ${idx} (100题)`);
                    } else {
                        console.warn(`⚠️ ${lang} 文件 ${idx} 不是100题 (${qs.length}题)，跳过`);
                    }
                }
                idx++;
                tryLoad();
            };
            script.onerror = function() {
                console.log(`ℹ️ ${lang} 文件 ${idx} 不存在，停止发现`);
                availableFileCount = totalFiles;
                console.log(`✅ 语言 ${lang} 共发现 ${totalFiles} 个文件 (${totalFiles*100} 题)`);
                if (callback) callback();
            };
            document.head.appendChild(script);
        }

        tryLoad();
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
    // 绘制雷达图
    // ==========================================
    function drawRadar(canvas, labels, values) {
        if (!labels.length) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2, r = Math.min(w,h)*0.32;

        ctx.clearRect(0, 0, w, h);
        const isDark = document.body.classList.contains('dark-mode');
        const bgColor = isDark ? '#1a221f' : '#ffffff';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);

        const gridColor = isDark ? '#2a3d38' : '#d4e0dd';
        const textColor = isDark ? '#dce6e2' : '#1e2b2a';
        const accentColor = isDark ? '#6ba89a' : '#3b7a6e';

        for (let level = 0.2; level <= 1; level += 0.2) {
            ctx.beginPath();
            for (let i = 0; i < labels.length; i++) {
                const a = Math.PI * 2 * i / labels.length - Math.PI / 2;
                const x = cx + r * level * Math.cos(a), y = cy + r * level * Math.sin(a);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = gridColor;
            ctx.stroke();
        }
        for (let i = 0; i < labels.length; i++) {
            const a = Math.PI * 2 * i / labels.length - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
            ctx.strokeStyle = gridColor;
            ctx.stroke();
        }

        const maxVal = Math.max(...values, 1);
        ctx.beginPath();
        for (let i = 0; i < labels.length; i++) {
            const a = Math.PI * 2 * i / labels.length - Math.PI / 2;
            const v = values[i] / maxVal;
            const x = cx + r * v * Math.cos(a), y = cy + r * v * Math.sin(a);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = isDark ? 'rgba(107,168,154,0.25)' : 'rgba(59,122,110,0.25)';
        ctx.fill();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = '11px "PingFang SC","Segoe UI",sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < labels.length; i++) {
            const a = Math.PI * 2 * i / labels.length - Math.PI / 2;
            ctx.fillText(labels[i], cx + (r + 22) * Math.cos(a), cy + (r + 22) * Math.sin(a));
        }
    }

    // ==========================================
    // 刷新所有雷达图
    // ==========================================
    window.refreshRadars = function() {
        if (!window._radarDataMap || window._radarDataMap.length === 0) return;
        window._radarDataMap.forEach(item => {
            if (item.canvas && item.canvas.parentNode) {
                drawRadar(item.canvas, item.labels, item.values);
            }
        });
    };

    // ==========================================
    // 渲染主页
    // ==========================================
    function renderHome() {
        isOnHome = true;
        isQuizActive = false;
        setLangBtnVisible(true);
        updateLangUI();

        const startBtnText = getUI('startTest');
        const heroNote = getUI('heroNote');
        const scrollText = getUI('scrollText');

        // 生成选项
        const options = [];
        for (let i = 1; i <= availableFileCount; i++) {
            options.push(i * 100);
        }
        if (options.length === 0) options.push(100);

        let dropdownHTML = '';
        options.forEach((count) => {
            const isActive = (count === selectedCount) ? 'active' : '';
            const bg = isActive ? 'var(--accent)' : 'transparent';
            const color = isActive ? '#fff' : 'var(--text)';
            dropdownHTML += `
                <div class="dropdown-item ${isActive}" data-count="${count}" style="padding: 10px 20px; cursor: pointer; transition: background 0.15s; background: ${bg}; color: ${color}; border-bottom: 1px solid var(--border); font-weight: ${isActive ? '600' : '400'}; text-align: center; border-radius: 0;">
                    ${count} ${getUI('questionsCount')}
                </div>
            `;
        });

        app.innerHTML = `
            <section id="home-hero">
                <div class="hero-content" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; text-align:center;">
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

                    <!-- 组合按钮：整体悬停光晕 + 内部细线分隔 -->
                    <div style="display:inline-block; position:relative; margin: 12px 0 8px;">
                        <div class="combo-group" style="display:inline-flex; border-radius:60px; background:var(--accent); box-shadow: 0 4px 24px rgba(59,122,110,0.30); transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);">
                            <!-- 左侧：开始测试 -->
                            <button id="startTestBtn" style="border-radius:60px 0 0 60px; padding:16px 32px; min-width:140px; background:transparent; color:#fff; border:none; font-weight:600; font-size:1.05rem; cursor:pointer; letter-spacing:1px; transition: background 0.25s ease; position:relative; z-index:2;">
                                ${startBtnText}
                            </button>
                            <!-- 细线分隔 -->
                            <div style="width:1px; background:rgba(255,255,255,0.35); flex-shrink:0; z-index:2; position:relative;"></div>
                            <!-- 右侧：下拉箭头 -->
                            <button id="dropdownToggle" style="border-radius:0 60px 60px 0; padding:16px 18px; background:transparent; color:#fff; border:none; font-weight:600; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; min-width:52px; transition: background 0.25s ease; position:relative; z-index:2;">
                                ▼
                            </button>
                        </div>
                        <!-- 下拉菜单 -->
                        <div id="dropdownMenu" style="display:none; position:absolute; top:calc(100% + 8px); left:0; width:100%; background:var(--card-bg); border:1px solid var(--border); border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,0.15); overflow:hidden; z-index:50; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);">
                            ${dropdownHTML}
                        </div>
                    </div>

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
                        <button class="btn btn-primary" onclick="window.startQuiz()">${startBtnText}</button>
                    </div>
                </div>
            </section>
        `;

        // ===== 组合按钮交互：整体悬停光晕 =====
        const comboGroup = document.querySelector('.combo-group');
        const startBtn = document.getElementById('startTestBtn');
        const dropdownToggle = document.getElementById('dropdownToggle');

        // 组合框整体悬停效果（光晕作用于整个按钮）
        if (comboGroup) {
            comboGroup.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
                this.style.boxShadow = '0 0 40px rgba(59,122,110,0.50), 0 8px 32px rgba(59,122,110,0.40)';
            });
            comboGroup.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 24px rgba(59,122,110,0.30)';
            });
        }

        // 左侧按钮悬停微效果（不影响整体光晕，仅做区域反馈）
        if (startBtn) {
            const freshStart = startBtn.cloneNode(true);
            startBtn.parentNode.replaceChild(freshStart, startBtn);
            freshStart.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255,255,255,0.10)';
            });
            freshStart.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
            });
            freshStart.addEventListener('click', function(e) {
                e.stopPropagation();
                window.startQuiz();
            });
        }

        // 右侧按钮悬停微效果
        const freshDropdown = document.getElementById('dropdownToggle');
        if (freshDropdown) {
            const newDropdown = freshDropdown.cloneNode(true);
            freshDropdown.parentNode.replaceChild(newDropdown, freshDropdown);
            newDropdown.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255,255,255,0.10)';
            });
            newDropdown.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
            });
        }

        // ===== 下拉菜单交互 =====
        const finalDropdown = document.getElementById('dropdownToggle');
        const dropdownMenu = document.getElementById('dropdownMenu');

        if (finalDropdown && dropdownMenu) {
            finalDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
                const isOpen = dropdownMenu.style.display === 'block';
                dropdownMenu.style.display = isOpen ? 'none' : 'block';
            });

            const items = dropdownMenu.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const count = parseInt(this.dataset.count);
                    if (isQuizActive) {
                        if (!confirm(getUI('switchConfirm'))) return;
                    }
                    selectedCount = count;
                    renderHome();
                });
            });

            document.addEventListener('click', function(e) {
                if (dropdownMenu.style.display === 'block') {
                    if (!finalDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
                        dropdownMenu.style.display = 'none';
                    }
                }
            });
        }

        // ===== 滚动箭头 =====
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

        setLangBtnVisible(true);
        updateLangUI();
        renderLangMenu();

        if (langBtn) {
            langBtn.onclick = toggleLangMenu;
        }
    }

    // ==========================================
    // 开始测试
    // ==========================================
    window.startQuiz = function() {
        if (ALL_QUESTIONS.length === 0) {
            alert(getUI('noQuestions'));
            return;
        }

        const total = Math.min(selectedCount, ALL_QUESTIONS.length);
        QUESTIONS = ALL_QUESTIONS.slice(0, total);

        if (QUESTIONS.length === 0) {
            alert(getUI('chooseValid'));
            return;
        }

        initQuiz();
    };

    function showError(msg) {
        app.innerHTML = `
            <div class="status-message">
                <span class="emoji">⚠️</span>
                <p>${msg}</p>
                <button class="btn btn-primary retry-btn" onclick="window.startQuiz()">${getUI('retry')}</button>
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
        const qNum = getUI('questionNum');
        const of = getUI('of');
        const prevLabel = getUI('prevBtn');
        const hint = getUI('navHint');

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
    // 计分逻辑
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

        window._lastResult = {
            mbtiType: mbtiType,
            mbtiDesc: mbtiDesc,
            ismResults: ismResults,
            dimPercents: dimPercents,
            dimPairs: dimPairs,
            dimColors: dimColors
        };

        const resultTitle = getUI('resultTitle');
        const mbtiLabel = getUI('mbtiLabel');
        const fullBtn = getUI('fullReportBtn');
        const hideBtn = getUI('hideReportBtn');
        const restartLabel = getUI('restartBtn');
        const rankToggle = getUI('rankTableToggle');
        const dimDetail = getUI('dimensionDetail');
        const shareImageText = getUI('shareImage');

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

        const radarDataMap = [];

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
                        <thead><tr><th>#</th><th>${getUI('rankName')}</th><th>${getUI('rankScore')}</th><th>${getUI('rankDesc')}</th></tr></thead>
                        <tbody>
            `;
            items.forEach((item, idx) => {
                const name = getIsmName(item.name);
                html += `<tr><td>${idx+1}</td><td><strong>${name}</strong></td><td>${item.score}%</td><td>${item.desc||getIsmDesc(item.name)}</td></tr>`;
            });
            html += `</tbody></table></div>`;

            const top8 = items.slice(0,8);
            radarDataMap.push({
                canvasId: `radar_${fieldKey}`,
                labels: top8.map(i => getIsmName(i.name)),
                values: top8.map(i => i.score)
            });
        });

        html += `</div>
            <div class="restart-btn" style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
                <button class="btn btn-primary" onclick="window.restartTest()">${restartLabel}</button>
                <button class="btn btn-primary" style="background: #6c7a7a; box-shadow: 0 4px 24px rgba(0,0,0,0.10);" onclick="window.shareResultImage()">${shareImageText}</button>
            </div>
        `;
        app.innerHTML = html;

        const actualRadarMap = [];
        radarDataMap.forEach(item => {
            const canvas = document.getElementById(item.canvasId);
            if (canvas) {
                drawRadar(canvas, item.labels, item.values);
                actualRadarMap.push({
                    canvas: canvas,
                    labels: item.labels,
                    values: item.values
                });
            }
        });
        window._radarDataMap = actualRadarMap;

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
    // 分享功能
    // ==========================================
    window.shareResultImage = function() {
        const data = window._lastResult;
        if (!data) {
            alert(getUI('noResult'));
            return;
        }

        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = function() {
                buildResultImage(data);
            };
            script.onerror = function() {
                alert(getUI('libraryLoadFailed'));
            };
            document.head.appendChild(script);
        } else {
            buildResultImage(data);
        }
    };

    function buildResultImage(data) {
        const { mbtiType, mbtiDesc, ismResults, dimPercents, dimPairs, dimColors } = data;

        const isDark = document.body.classList.contains('dark-mode');
        const bgColor = isDark ? '#1a221f' : '#ffffff';
        const textColor = isDark ? '#dce6e2' : '#1e2b2a';
        const textLight = isDark ? '#a8b8b4' : '#4f5e5d';
        const borderColor = isDark ? '#2a3d38' : '#e0eae7';
        const accentColor = isDark ? '#6ba89a' : '#3b7a6e';

        const card = document.createElement('div');
        card.style.cssText = `
            position: fixed;
            top: -9999px; left: -9999px;
            width: 600px;
            background: ${bgColor};
            padding: 32px 28px;
            border-radius: 24px;
            font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
            color: ${textColor};
            box-sizing: border-box;
            z-index: -1;
        `;

        let dimsHTML = '';
        dimPairs.forEach((pair, i) => {
            const leftLetter = pair[0], rightLetter = pair[1];
            const leftPct = dimPercents[i], rightPct = 100 - leftPct;
            const color = dimColors[i];
            dimsHTML += `
                <div style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; font-weight:600; font-size:0.85rem; margin-bottom:4px; color:${textColor};">
                        <span>${leftLetter}</span><span>${rightLetter}</span>
                    </div>
                    <div style="display:flex; height:12px; border-radius:6px; overflow:hidden; gap:2px;">
                        <div style="flex:0 0 ${leftPct}%; background:${color.right};"></div>
                        <div style="flex:0 0 ${rightPct}%; background:${color.left};"></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:${textLight}; margin-top:2px;">
                        <span>${leftPct}%</span><span>${rightPct}%</span>
                    </div>
                </div>
            `;
        });

        const fields = Object.keys(ismResults);
        let fieldsHTML = '';
        fields.forEach(field => {
            const items = ismResults[field];
            if (!items?.length) return;
            const top = items[0];
            const fieldName = getFieldName(field);
            const ismName = getIsmName(top.name);
            const radarCanvas = document.createElement('canvas');
            radarCanvas.width = 300;
            radarCanvas.height = 300;
            const top8 = items.slice(0,8);
            drawRadar(radarCanvas, top8.map(i=>getIsmName(i.name)), top8.map(i=>i.score));
            const radarDataURL = radarCanvas.toDataURL('image/png');

            fieldsHTML += `
                <div style="margin-bottom:24px; border-bottom:1px solid ${borderColor}; padding-bottom:16px;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                        <div style="font-weight:600; color:${accentColor};">${fieldName}</div>
                        <span style="font-size:0.9rem; color:${accentColor};">→</span>
                        <span style="font-weight:700; color:${textColor};">${ismName}</span>
                    </div>
                    <img src="${radarDataURL}" style="width:100%; max-width:300px; display:block; margin:0 auto; border-radius:12px; border:1px solid ${borderColor};" />
                </div>
            `;
        });

        card.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; border-bottom:2px solid ${borderColor}; padding-bottom:16px;">
                <span style="font-size:1.8rem; font-weight:800; background: linear-gradient(135deg, #2a5e54, ${accentColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">IsmoType</span>
                <span style="font-size:0.8rem; color:${textLight}; background:${isDark ? '#2a3d38' : '#e8f0ee'}; padding:4px 14px; border-radius:30px;">${getUI('shareCardTitle')}</span>
            </div>

            <div style="display:flex; align-items:center; gap:20px; margin-bottom:20px;">
                <div style="flex-shrink:0; width:80px; height:80px; background:${isDark ? '#2a3d38' : '#e8f0ee'}; border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:2.4rem; font-weight:800; color:${accentColor}; border:2px solid ${borderColor};">
                    ${mbtiType}
                </div>
                <div>
                    <div style="font-size:1.8rem; font-weight:700; color:${textColor}; line-height:1.2;">${mbtiType}</div>
                    <div style="font-size:0.85rem; color:${textLight}; margin-top:4px; line-height:1.5;">${mbtiDesc || ''}</div>
                </div>
            </div>

            <div style="margin:16px 0 20px;">
                ${dimsHTML}
            </div>

            <div style="margin:8px 0 12px;">
                ${fieldsHTML}
            </div>

            <div style="text-align:center; border-top:1px solid ${borderColor}; padding-top:14px; color:${textLight}; font-size:0.7rem; letter-spacing:0.5px;">
                ${getUI('shareFooter')}
            </div>
        `;

        document.body.appendChild(card);

        requestAnimationFrame(() => {
            setTimeout(() => {
                html2canvas(card, {
                    scale: 2,
                    backgroundColor: bgColor,
                    allowTaint: false,
                    useCORS: true,
                    logging: false,
                    width: 600,
                    height: card.scrollHeight
                }).then(canvas => {
                    card.remove();
                    showPreviewModal(canvas);
                }).catch(err => {
                    card.remove();
                    console.error('html2canvas error:', err);
                    alert(getUI('imageGenFailed'));
                });
            }, 100);
        });
    }

    function showPreviewModal(canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const isDark = document.body.classList.contains('dark-mode');
        const cardBg = isDark ? '#1a221f' : '#ffffff';
        const textColor = isDark ? '#dce6e2' : '#1e2b2a';
        const borderColor = isDark ? '#2a3d38' : '#d4e0dd';
        const btnBg = isDark ? '#6ba89a' : '#3b7a6e';
        const btnHover = isDark ? '#529b87' : '#2f6b5f';

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed; top:0; left:0; width:100%; height:100%;
            z-index: 9999;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        `;

        const inner = document.createElement('div');
        inner.style.cssText = `
            background: ${cardBg};
            border-radius: 24px;
            padding: 24px;
            max-width: 640px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            text-align: center;
            color: ${textColor};
            scrollbar-width: thin;
            scrollbar-color: ${borderColor} transparent;
        `;
        const style = document.createElement('style');
        style.textContent = `
            #preview-scroll::-webkit-scrollbar {
                width: 6px;
            }
            #preview-scroll::-webkit-scrollbar-track {
                background: transparent;
            }
            #preview-scroll::-webkit-scrollbar-thumb {
                background: ${borderColor};
                border-radius: 8px;
            }
        `;
        inner.appendChild(style);
        inner.id = 'preview-scroll';

        inner.innerHTML += `
            <img src="${dataUrl}" style="width:100%; height:auto; border-radius:12px; display:block; margin-bottom:16px;" />
            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                <button class="btn btn-prev" style="min-width:100px; padding:10px 24px; border:2px solid ${borderColor}; background:transparent; color:${textColor}; border-radius:50px; font-weight:500; cursor:pointer; transition:all 0.25s;" onclick="this.closest('#preview-scroll').parentElement.remove()">
                    ${getUI('close')}
                </button>
                <button id="downloadBtn" class="btn btn-primary" style="min-width:100px; padding:10px 24px; background:${btnBg}; color:white; border:none; border-radius:50px; font-weight:600; cursor:pointer; transition:all 0.25s; box-shadow:0 4px 24px rgba(59,122,110,0.30);" onmouseover="this.style.background='${btnHover}'" onmouseout="this.style.background='${btnBg}'">
                    ⬇️ ${getUI('shareDownload')}
                </button>
            </div>
        `;

        container.appendChild(inner);
        document.body.appendChild(container);

        const downloadBtn = container.querySelector('#downloadBtn');
        downloadBtn.addEventListener('click', function() {
            const link = document.createElement('a');
            link.download = `IsmoType_${window._lastResult?.mbtiType || 'result'}_${new Date().toISOString().slice(0,10)}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        container.addEventListener('click', function(e) {
            if (e.target === container) container.remove();
        });
    }

    // ==========================================
    // 启动
    // ==========================================
    async function init() {
        await autoDiscoverLanguages();

        if (window.LANG_REGISTRY['zh']) {
            window.LANG = window.LANG_REGISTRY['zh'];
            setLang('zh');
        } else if (window.LANG_REGISTRY['en']) {
            window.LANG = window.LANG_REGISTRY['en'];
            setLang('en');
        } else {
            console.warn('没有可用的语言包');
        }

        loadAllQuestionsForLang(currentLang, function() {
            selectedCount = 100;
            renderHome();
        });

        updateLangUI();
        renderLangMenu();

        if (langBtn) {
            langBtn.onclick = toggleLangMenu;
        }

        console.log('✅ main.js v3.8 加载完成 (组合按钮整体光晕 + 细线分隔)');
    }

    // ==========================================
    // 启动检查
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

    window.__main = { getLang, setLang, renderHome, initQuiz, showResults, QUESTIONS, ALL_QUESTIONS };
    console.log('✅ main.js 加载完成');
})();