// ==========================================
// IsmoType 主逻辑 v5.3
// 文件: main.js
// 新增: 滚动主页多段内容 + Intersection Observer
// ==========================================
(function() {
    const app = document.getElementById('app');
    const QUESTIONS = [];
    let loadIndex = 1;

    // 动态加载题目
    function tryLoadNext() {
        const script = document.createElement('script');
        script.src = `questions/questions_${loadIndex}.js`;
        script.onload = () => {
            const arr = window[`QUESTIONS_${loadIndex}`];
            if (Array.isArray(arr)) QUESTIONS.push(...arr);
            loadIndex++;
            tryLoadNext();
        };
        script.onerror = () => {
            if (QUESTIONS.length === 0) {
                app.innerHTML = '<p style="text-align:center;padding:40px;">题目加载失败，请检查 questions 文件夹。</p>';
                return;
            }
            renderHome();
        };
        document.head.appendChild(script);
    }

    if (typeof TAGS === 'undefined' || typeof ISMS === 'undefined' || typeof MBTI_DESCRIPTIONS === 'undefined' || typeof DIMENSION_DESCRIPTIONS === 'undefined') {
        app.innerHTML = '<p style="text-align:center;padding:40px;">数据文件缺失，请刷新重试。</p>';
        return;
    }

    tryLoadNext();

    // ==================== 主页 ====================
    function renderHome() {
        app.innerHTML = `
            <!-- 英雄区 -->
            <section class="home-section visible" style="padding-top:20px;">
                <header>
                    <svg class="logo-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="28" fill="none" stroke="#4a8c7e" stroke-width="3"/>
                        <path d="M18 30 L30 12 L42 30 L30 48 Z" fill="none" stroke="#4a8c7e" stroke-width="2.5"/>
                        <circle cx="30" cy="30" r="6" fill="#4a8c7e"/>
                        <line x1="8" y1="30" x2="18" y2="30" stroke="#4a8c7e" stroke-width="2"/>
                        <line x1="42" y1="30" x2="52" y2="30" stroke="#4a8c7e" stroke-width="2"/>
                        <line x1="30" y1="8" x2="30" y2="12" stroke="#4a8c7e" stroke-width="2"/>
                        <line x1="30" y1="48" x2="30" y2="52" stroke="#4a8c7e" stroke-width="2"/>
                    </svg>
                    <h1>IsmoType</h1>
                    <p class="subtitle">探索你的思想坐标</p>
                </header>
                <div style="display:flex;justify-content:center;gap:40px;flex-wrap:wrap;margin:30px 0;">
                    <div style="text-align:center;">
                        <div style="font-size:3rem;font-weight:800;color:var(--accent);">16</div>
                        <div style="font-size:0.95rem;color:var(--text-light);">MBTI 人格类型</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:3rem;font-weight:800;color:var(--accent);">200+</div>
                        <div style="font-size:0.95rem;color:var(--text-light);">主义光谱</div>
                    </div>
                </div>
                <button class="btn btn-primary" style="padding:16px 40px;font-size:1.1rem;" onclick="startQuiz()">开始测试</button>
                <p style="color:var(--text-light);font-size:0.8rem;margin-top:12px;">预计 20-30 分钟 · 随时返回修改</p>
            </section>

            <!-- 为什么要做这个测试？ -->
            <section class="home-section">
                <h2>为什么要做这个测试？</h2>
                <p>传统的性格测试只告诉你是什么类型，却忽略了你的思想底色。IsmoType 将人格与主义深度结合，通过 300+ 道多维题目，同时揭示你的 MBTI 人格和分布在六大领域的 200 余种主义倾向。</p>
                <p>你不仅会知道自己是 INTJ 还是 ENFP，还会了解自己是倾向于自由主义还是保守主义，是存在主义者还是实用主义者——这一切都源自你的真实回答。</p>
            </section>

            <!-- 测试涵盖什么？ -->
            <section class="home-section">
                <h2>测试涵盖什么？</h2>
                <div class="home-grid">
                    <div class="home-card">
                        <div class="icon">🧠</div>
                        <h3>哲学层面</h3>
                        <p>存在主义、虚无主义、斯多葛主义等 30+ 主义</p>
                    </div>
                    <div class="home-card">
                        <div class="icon">⚖️</div>
                        <h3>政治社会层面</h3>
                        <p>自由主义、社会主义、无政府主义等 28 种立场</p>
                    </div>
                    <div class="home-card">
                        <div class="icon">💰</div>
                        <h3>经济层面</h3>
                        <p>资本主义、凯恩斯主义、互助主义等 15 种理念</p>
                    </div>
                    <div class="home-card">
                        <div class="icon">❤️</div>
                        <h3>伦理价值层面</h3>
                        <p>功利主义、义务论、德性伦理学等 15 种取向</p>
                    </div>
                    <div class="home-card">
                        <div class="icon">🌿</div>
                        <h3>文化生活层面</h3>
                        <p>个人主义、极简主义、技术乐观主义等 19 种方式</p>
                    </div>
                    <div class="home-card">
                        <div class="icon">🎨</div>
                        <h3>艺术美学层面</h3>
                        <p>浪漫主义、现实主义、超现实主义等 12 种品味</p>
                    </div>
                </div>
            </section>

            <!-- 如何工作？ -->
            <section class="home-section">
                <h2>如何工作？</h2>
                <div class="steps">
                    <div class="step">
                        <div class="step-num">1</div>
                        <h3>回答题目</h3>
                        <p>对 300+ 个陈述表达同意程度</p>
                    </div>
                    <div class="step">
                        <div class="step-num">2</div>
                        <h3>多维分析</h3>
                        <p>26 个观念标签交叉映射 MBTI 与主义</p>
                    </div>
                    <div class="step">
                        <div class="step-num">3</div>
                        <h3>获得结果</h3>
                        <p>人格类型 + 六大领域主义光谱</p>
                    </div>
                </div>
            </section>

            <!-- 最终行动号召 -->
            <section class="home-section">
                <h2>准备好探索自己了吗？</h2>
                <p>没有标准答案，没有对错判断。每一个选择都在描摹你独特的思想坐标。</p>
                <button class="btn btn-primary" style="padding:16px 40px;font-size:1.1rem;" onclick="startQuiz()">开始测试</button>
            </section>
        `;

        // 为所有 .home-section 添加 Intersection Observer（除了第一个已经可见）
        const sections = document.querySelectorAll('.home-section:not(.visible)');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        sections.forEach(s => observer.observe(s));

        // 确保第一个 section 已有 visible 类，立即动画
        document.querySelector('.home-section.visible')?.classList.add('visible');
    }

    // ==================== 开始答题 ====================
    window.startQuiz = () => initQuiz();

    function initQuiz() {
        const TOTAL = QUESTIONS.length;
        let cur = 0;
        const answers = new Array(TOTAL).fill(null);

        function renderQuestion(idx) {
            const q = QUESTIONS[idx];
            const labels = ['非常同意','同意','中立','不同意','非常不同意'];
            let opts = '';
            for (let i = 0; i < 5; i++) {
                const sel = answers[idx] === i ? ' selected' : '';
                opts += `<div class="option-btn${sel}" onclick="selectAnswer(${idx},${i})"><div class="option-radio"></div><span>${labels[i]}</span></div>`;
            }
            const pct = (idx / TOTAL) * 100;
            app.innerHTML = `
                <header>
                    <svg class="logo-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="28" fill="none" stroke="#4a8c7e" stroke-width="3"/>
                        <path d="M18 30 L30 12 L42 30 L30 48 Z" fill="none" stroke="#4a8c7e" stroke-width="2.5"/>
                        <circle cx="30" cy="30" r="6" fill="#4a8c7e"/>
                        <line x1="8" y1="30" x2="18" y2="30" stroke="#4a8c7e" stroke-width="2"/>
                        <line x1="42" y1="30" x2="52" y2="30" stroke="#4a8c7e" stroke-width="2"/>
                        <line x1="30" y1="8" x2="30" y2="12" stroke="#4a8c7e" stroke-width="2"/>
                        <line x1="30" y1="48" x2="30" y2="52" stroke="#4a8c7e" stroke-width="2"/>
                    </svg>
                    <h1>IsmoType</h1>
                    <p class="subtitle">人格与主义光谱测试</p>
                </header>
                <div class="progress-bar-container"><div class="progress-fill" style="width:${pct}%"></div></div>
                <div class="question-section">
                    <div class="question-num">问题 ${idx+1} / ${TOTAL}</div>
                    <div class="question-text">${q.q}</div>
                    <div class="options">${opts}</div>
                </div>
                <div class="nav-buttons">
                    <button class="btn btn-prev" ${idx===0?'disabled':''} onclick="prevQuestion()">上一题</button>
                    <span style="color:var(--text-light);font-size:0.85rem;align-self:center;">点击选项自动前进</span>
                </div>`;
        }

        window.selectAnswer = (idx, val) => {
            answers[idx] = val;
            renderQuestion(idx);
            setTimeout(() => {
                if (cur === idx) {
                    if (cur < TOTAL - 1) { cur++; renderQuestion(cur); }
                    else { showResults(); }
                }
            }, 250);
        };

        window.prevQuestion = () => {
            if (cur > 0) { cur--; renderQuestion(cur); }
        };

        // 计分逻辑
        function calcScores() {
            const mbtiScores = [0,0,0,0];
            const tagScores = new Array(TAGS.length).fill(0);
            for (let i = 0; i < TOTAL; i++) {
                if (answers[i] === null) continue;
                const w = answers[i] - 2;
                const q = QUESTIONS[i];
                for (let d = 0; d < 4; d++) mbtiScores[d] += q.mbti[d] * w;
                for (let t = 0; t < TAGS.length; t++) tagScores[t] += (q.tags[t]||0) * w;
            }
            return { mbtiScores, tagScores };
        }

        function getMBTIType(scores) {
            return [
                scores[0]>=0?'E':'I',
                scores[1]>=0?'S':'N',
                scores[2]>=0?'T':'F',
                scores[3]>=0?'J':'P'
            ].join('');
        }

        function calcDimPercents(scores) {
            const maxExp = 200;
            return scores.map(s => {
                const c = Math.max(-maxExp, Math.min(maxExp, s));
                return Math.min(100, Math.max(0, Math.round(((c/maxExp)+1)*50)));
            });
        }

        function normalizeScores(items) {
            const min = Math.min(...items.map(i=>i.score));
            const max = Math.max(...items.map(i=>i.score));
            const range = max - min || 1;
            return items.map(item => ({
                ...item,
                normalized: Math.round(((item.score - min) / range) * 100)
            }));
        }

        function calcIsmScores(tagScores) {
            const results = {};
            for (const [field, isms] of Object.entries(ISMS)) {
                let items = [];
                for (const [name, data] of Object.entries(isms)) {
                    let score = 0;
                    for (let t = 0; t < TAGS.length; t++) score += tagScores[t] * (data.tags[t]||0);
                    items.push({ name, score, desc: data.desc, icon: data.icon });
                }
                items.sort((a,b) => b.score - a.score);
                items = normalizeScores(items);
                results[field] = items;
            }
            return results;
        }

        // ==================== 结果页 ====================
        function showResults() {
            const { mbtiScores, tagScores } = calcScores();
            const mbtiType = getMBTIType(mbtiScores);
            const mbtiDesc = MBTI_DESCRIPTIONS[mbtiType] || '';
            const dimPercents = calcDimPercents(mbtiScores);
            const ismResults = calcIsmScores(tagScores);

            const dimColors = [
                { left: '#b384ba', right: '#d35c5f' },
                { left: '#7eb896', right: '#62a87b' },
                { left: '#7696c5', right: '#4c72b0' },
                { left: '#9c8fc2', right: '#8172b2' }
            ];
            const dimPairs = [['E','I'], ['S','N'], ['T','F'], ['J','P']];

            let html = `
                <h2 style="text-align:center;font-size:1.6rem;color:var(--accent-dark);margin-bottom:30px;">人格 / 主义评测结果</h2>
                <div class="summary-mbti-section">
                    <img src="images/mbti/${mbtiType.toLowerCase()}.png" alt="${mbtiType}" onerror="this.style.display='none'" class="summary-mbti-img">
                    <div class="summary-mbti-type">${mbtiType}</div>
                </div>
                <div class="summary-isms-grid">
            `;

            const fields = Object.keys(ismResults);
            fields.forEach((field, idx) => {
                const top = ismResults[field][0];
                html += `
                    <div class="summary-ism-item">
                        <img src="${top.icon}" alt="${top.name}" onerror="this.style.display='none'">
                        <div class="summary-ism-name">${top.name}</div>
                    </div>
                `;
                if (idx === 2) html += `</div><div class="summary-isms-grid">`;
            });
            html += `</div>`;

            html += `
                <div style="text-align:center;margin:30px 0;">
                    <button class="btn btn-primary" id="toggleReportBtn" onclick="toggleFullReport()">查看完整报告</button>
                </div>
                <div id="fullReport" style="display:none;">
                    <div class="report-section">
                        <h3 class="report-title">MBTI 人格</h3>
                        <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center;margin-bottom:20px;">
                            <img src="images/mbti/${mbtiType.toLowerCase()}.png" alt="${mbtiType}" style="width:80px;height:80px;border-radius:16px;" onerror="this.style.display='none'">
                            <div>
                                <div style="font-size:2rem;font-weight:800;color:var(--accent-dark);">${mbtiType}</div>
                                <p style="color:var(--text-light);margin-top:8px;">${mbtiDesc}</p>
                            </div>
                        </div>
                        <div class="spectrum-grid">
            `;

            dimPairs.forEach((pair, i) => {
                const leftLetter = pair[0];
                const rightLetter = pair[1];
                const leftPct = dimPercents[i];
                const rightPct = 100 - leftPct;
                const color = dimColors[i];
                html += `
                    <div class="spectrum-item">
                        <div class="spectrum-labels"><span>${leftLetter}</span><span>${rightLetter}</span></div>
                        <div class="spectrum-bar">
                            <div class="spectrum-fill left-fill" style="width:${leftPct}%;background:${color.right};"></div>
                            <div class="spectrum-gap"></div>
                            <div class="spectrum-fill right-fill" style="width:${rightPct}%;background:${color.left};"></div>
                        </div>
                        <div class="spectrum-percents"><span>${leftPct}%</span><span>${rightPct}%</span></div>
                        <div class="spectrum-detail-toggle" onclick="toggleDimDesc('dimDesc${i}')">查看详情</div>
                        <div id="dimDesc${i}" class="dim-desc-content" style="display:none;">
                            <p>${DIMENSION_DESCRIPTIONS[leftLetter]}</p>
                            <p>${DIMENSION_DESCRIPTIONS[rightLetter]}</p>
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;

            fields.forEach(field => {
                const items = ismResults[field];
                if (!items.length) return;
                const top = items[0];
                const top8 = items.slice(0,8);
                const totalNormalized = items.reduce((sum,it)=>sum+it.normalized,0);
                const fieldKey = field.replace(/[^a-zA-Z\u4e00-\u9fa5]/g,'_');
                html += `
                <div class="report-section">
                    <h3 class="report-title">${field}</h3>
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
                        <img src="${top.icon}" alt="${top.name}" style="width:48px;height:48px;border-radius:8px;" onerror="this.style.display='none'">
                        <div>
                            <strong style="font-size:1.2rem;">${top.name}</strong>
                            <p style="color:var(--text-light);margin-top:4px;">${top.desc}</p>
                        </div>
                    </div>
                    <div class="radar-container"><canvas class="radar-chart" id="radar_${fieldKey}" width="350" height="350"></canvas></div>
                    <div class="rank-table-toggle" onclick="toggleTable('${fieldKey}')">▼ 查看完整排名</div>
                    <table class="rank-table" id="table_${fieldKey}">
                        <thead><tr><th>排名</th><th>主义</th><th>占比</th><th>描述</th></tr></thead>
                        <tbody>${items.map((item,idx)=>{
                            const pct = totalNormalized>0 ? Math.round((item.normalized/totalNormalized)*100) : 0;
                            return `<tr><td>${idx+1}</td><td><strong>${item.name}</strong></td><td>${pct}%</td><td>${item.desc}</td></tr>`;
                        }).join('')}</tbody>
                    </table>
                </div>`;
            });

            html += `
                </div>
                <div class="restart-btn" style="margin-top:30px;"><button class="btn btn-primary" onclick="restartTest()">重新测试</button></div>
            `;

            app.innerHTML = html;

            // 绘制雷达图
            fields.forEach(field => {
                const items = ismResults[field];
                if (!items.length) return;
                const canvas = document.getElementById('radar_'+field.replace(/[^a-zA-Z\u4e00-\u9fa5]/g,'_'));
                if (canvas) {
                    const top8 = items.slice(0,8);
                    drawRadar(canvas, top8.map(i=>i.name), top8.map(i=>i.normalized));
                }
            });

            // 全局函数
            window.toggleFullReport = () => {
                const report = document.getElementById('fullReport');
                const btn = document.getElementById('toggleReportBtn');
                if (report.style.display === 'none') {
                    report.style.display = 'block';
                    btn.textContent = '收起完整报告';
                } else {
                    report.style.display = 'none';
                    btn.textContent = '查看完整报告';
                }
            };

            window.toggleDimDesc = (id) => {
                const el = document.getElementById(id);
                if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
            };

            window.toggleTable = key => {
                const table = document.getElementById('table_'+key);
                if (table) table.classList.toggle('visible');
            };
        }

        function drawRadar(canvas, labels, values) {
            if (!labels.length) return;
            const ctx = canvas.getContext('2d');
            const w=canvas.width, h=canvas.height, cx=w/2, cy=h/2, r=Math.min(w,h)*0.35;
            ctx.clearRect(0,0,w,h);
            for (let level=0.2; level<=1; level+=0.2) {
                ctx.beginPath();
                for (let i=0;i<labels.length;i++) {
                    const a = Math.PI*2*i/labels.length - Math.PI/2;
                    const x=cx+r*level*Math.cos(a), y=cy+r*level*Math.sin(a);
                    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
                }
                ctx.closePath(); ctx.strokeStyle='#e0dcd5'; ctx.stroke();
            }
            for (let i=0;i<labels.length;i++) {
                const a = Math.PI*2*i/labels.length - Math.PI/2;
                ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));
                ctx.strokeStyle='#ccc'; ctx.stroke();
            }
            const maxV = Math.max(...values,1);
            ctx.beginPath();
            for (let i=0;i<labels.length;i++) {
                const a = Math.PI*2*i/labels.length - Math.PI/2;
                const v = maxV>0 ? values[i]/maxV : 0;
                const x=cx+r*v*Math.cos(a), y=cy+r*v*Math.sin(a);
                i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
            }
            ctx.closePath(); ctx.fillStyle='rgba(74,140,126,0.25)'; ctx.fill();
            ctx.strokeStyle='#4a8c7e'; ctx.lineWidth=2; ctx.stroke();
            ctx.fillStyle='#333'; ctx.font='11px "PingFang SC","Microsoft YaHei",sans-serif'; ctx.textAlign='center';
            for (let i=0;i<labels.length;i++) {
                const a = Math.PI*2*i/labels.length - Math.PI/2;
                ctx.fillText(labels[i], cx+(r+18)*Math.cos(a), cy+(r+18)*Math.sin(a)+4);
            }
        }

        window.restartTest = () => {
            answers.fill(null);
            cur = 0;
            renderQuestion(0);
        };

        renderQuestion(0);
    }
})();