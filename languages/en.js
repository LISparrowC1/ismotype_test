// ==========================================
// IsmoType Language File - English (en)
// File: languages/en.js
// Description: Contains language identifier, UI copy, MBTI descriptions,
//              dimension descriptions, field names, ism names and descriptions
// Question texts are in questions/questions_en_*.js
// ==========================================

const LANG_EN = {
    // ========================================
    // Language Identifier
    // ========================================
    flag: '🇬🇧',
    label: 'English',

    // ========================================
    // UI Copy
    // ========================================
    ui: {
        // Home
        heroTitle: 'IsmoType',
        heroSubtitle: 'Explore Your Ideological Coordinates',
        statMbti: 'MBTI Personality Types',
        statIsms: 'Ideological Spectrums',
        startBtn: 'Start Test',
        heroNote: 'Estimated 20-30 min · Return anytime',
        scrollText: 'Explore More',

        // Intro Section
        introWhyTitle: 'Why Take This Test?',
        introWhyDesc: 'Traditional personality tests tell you what type you are, but overlook your ideological foundation. IsmoType deeply integrates personality with ideology through 300+ multidimensional questions, simultaneously revealing your MBTI type and ideological tendencies across six major domains with over 200 distinct isms.',
        introWhyDesc2: 'You\'ll not only discover whether you\'re INTJ or ENFP, but also learn whether you lean toward liberalism or conservatism, existentialism or pragmatism — all derived from your authentic responses.',

        introCoverTitle: 'What Does It Cover?',
        cover1Title: 'Philosophical',
        cover1Desc: 'Existentialism, Nihilism, Stoicism, and 30+ more',
        cover2Title: 'Political & Social',
        cover2Desc: 'Liberalism, Socialism, Anarchism, and 28+ positions',
        cover3Title: 'Economic',
        cover3Desc: 'Capitalism, Keynesianism, Mutualism, and 15+ ideas',
        cover4Title: 'Ethical & Value',
        cover4Desc: 'Utilitarianism, Deontology, Virtue Ethics, and 15+ orientations',
        cover5Title: 'Cultural & Lifestyle',
        cover5Desc: 'Individualism, Minimalism, Techno-optimism, and 19+ ways',
        cover6Title: 'Art & Aesthetics',
        cover6Desc: 'Romanticism, Realism, Surrealism, and 12+ tastes',

        introHowTitle: 'How It Works?',
        step1Title: 'Answer Questions',
        step1Desc: 'Rate your agreement with 300+ statements',
        step2Title: 'Multidimensional Analysis',
        step2Desc: '26 conceptual tags cross-map MBTI and ideologies',
        step3Title: 'Get Results',
        step3Desc: 'Personality type + ideological spectrum across six domains',

        ctaTitle: 'Ready to Explore Yourself?',
        ctaDesc: 'No right or wrong answers. Every choice traces your unique ideological coordinates.',

        // Quiz Interface
        questionNum: 'Question',
        of: '/',
        prevBtn: 'Previous',
        navHint: 'Click option to advance',

        // Results Interface
        resultTitle: 'Personality / Ideology Assessment Results',
        mbtiLabel: 'MBTI Personality',
        fullReportBtn: 'View Full Report',
        hideReportBtn: 'Hide Full Report',
        restartBtn: 'Retake Test',

        // Ranking Table
        rankTableToggle: '▼ View Full Ranking',
        rankTableHide: '▲ Hide Ranking',
        rankName: 'Ism',
        rankScore: 'Match',
        rankDesc: 'Description',

        // Dimension Details
        dimensionDetail: 'View Details',
        dimensionDetailHide: 'Hide Details',

        // Status Messages
        loading: 'Loading, please wait…',
        loadError: 'Failed to load questions, please try again',
        retry: 'Retry',

        // Language Switch
        langLabel: 'Switch Language',
    },

    // ========================================
    // MBTI Personality Type Descriptions
    // ========================================
    mbti: {
        INTJ: 'Architect — Strategic, independent, and resolute. You combine imagination with planning, excel at systematic thinking, pursue knowledge and improvement, but may overlook emotional nuances.',
        INTP: 'Logician — Innovative and curious inventors, passionate about theories and abstract concepts. You excel at detecting contradictions, pursue logical consistency, and may sometimes seem detached from reality.',
        ENTJ: 'Commander — Bold, imaginative leaders who always find solutions. You are goal-oriented, strong in execution, and skilled at organizing people and resources.',
        ENTP: 'Debater — Smart and curious explorers of ideas, unable to resist intellectual challenges. You love breaking conventions, excel at conceptual innovation, and sometimes enjoy arguing.',
        INFJ: 'Advocate — Quiet and mysterious, your idealism and compassion inspire others. You have deep insight into human nature and are dedicated to making the world a better place.',
        INFP: 'Mediator — Poetic, kind, and altruistic, always seeking the path of goodness. You stay true to your inner values, are creative, and long for harmony.',
        ENFJ: 'Protagonist — Charismatic leaders who always inspire others. You are empathetic, good at discovering others\' potential, and work for the collective good.',
        ENFP: 'Campaigner — Enthusiastic, creative free spirits who find beauty in life. You are outgoing, open, and love exploring possibilities and connections with people.',
        ISTJ: 'Logistician — Practical, fact-oriented individuals who are reliable and meticulous. You value order and tradition, are diligent and responsible, ensuring things get done.',
        ISFJ: 'Defender — Focused and warm protectors who always care for others. You are steady, considerate, good at remembering details, and maintain harmony.',
        ESTJ: 'Executive — Excellent managers with unmatched efficiency and organizational skills. You are pragmatic and decisive, enforce rules, and drive goals.',
        ESFJ: 'Consul — Warm helpers and harmonizers who value community. You are sociable, care about others\' needs, and enjoy bringing people together.',
        ISTP: 'Virtuoso — Bold and practical, skilled at mastering various tools and techniques. You are calm, enjoy hands-on problem-solving, and pursue mastery.',
        ISFP: 'Adventurer — Flexible and charming artists, always ready to explore new experiences. You are sensitive, kind, and express yourself through creativity.',
        ESTP: 'Entrepreneur — Energetic, perceptive problem-solvers who enjoy adventure and improvisation. You are optimistic and embrace challenges.',
        ESFP: 'Entertainer — Spontaneous, energetic entertainers who make life fun. You are warm, friendly, and love sharing joy with others.'
    },

    // ========================================
    // Dimension Descriptions
    // ========================================
    dimensions: {
        E: 'Extraversion: Gains energy from the external world and social interactions.',
        I: 'Introversion: Gains energy from solitude and inner reflection.',
        S: 'Sensing: Focuses on concrete facts, details, and real-world experience.',
        N: 'Intuition: Focuses on abstract concepts, future possibilities, and overall patterns.',
        T: 'Thinking: Prioritizes logic, objective standards, and consistency in decision-making.',
        F: 'Feeling: Prioritizes relationships, empathy, and values in decision-making.',
        J: 'Judging: Prefers structured, planned, and decisive lifestyles.',
        P: 'Perceiving: Prefers flexible, open, and adaptable lifestyles.'
    },

    // ========================================
    // Six Domain Names
    // ========================================
    fields: {
        '哲学层面': 'Philosophical',
        '政治社会层面': 'Political & Social',
        '经济层面': 'Economic',
        '伦理价值层面': 'Ethical & Value',
        '文化生活层面': 'Cultural & Lifestyle',
        '艺术美学层面': 'Art & Aesthetics'
    },

    // ========================================
    // Ism Names and Descriptions
    // ========================================
    isms: {
        // ---------- Philosophical ----------
        '存在主义': {
            name: 'Existentialism',
            desc: 'Emphasizes individual existence, freedom, and choice — existence precedes essence.'
        },
        '虚无主义': {
            name: 'Nihilism',
            desc: 'Asserts that life lacks objective meaning, purpose, or intrinsic value.'
        },
        '荒诞主义': {
            name: 'Absurdism',
            desc: 'Acknowledges the conflict between seeking meaning and the meaninglessness of the universe, yet chooses to embrace life.'
        },
        '实用主义': {
            name: 'Pragmatism',
            desc: 'Truth is defined by its practical effects and applications.'
        },
        '理性主义': {
            name: 'Rationalism',
            desc: 'Reason is the primary source of knowledge, superior to sensory experience.'
        },
        '经验主义': {
            name: 'Empiricism',
            desc: 'All knowledge derives from sensory experience, rejecting innate ideas.'
        },
        '唯物主义': {
            name: 'Materialism',
            desc: 'Matter is the fundamental substance of reality; consciousness is a product of matter.'
        },
        '唯心主义': {
            name: 'Idealism',
            desc: 'Mind or spirit is the fundamental substance of reality; matter is its product or appearance.'
        },
        '决定论': {
            name: 'Determinism',
            desc: 'All events are determined by prior causes; free will is an illusion.'
        },
        '自由意志论': {
            name: 'Free Will',
            desc: 'Human beings possess the genuine ability to make choices under given conditions.'
        },
        '怀疑主义': {
            name: 'Skepticism',
            desc: 'Systematically questions the possibility of certain knowledge.'
        },
        '斯多葛主义': {
            name: 'Stoicism',
            desc: 'Pursues inner peace and virtue through rational control of emotions.'
        },
        '伊壁鸠鲁主义': {
            name: 'Epicureanism',
            desc: 'Pursues moderate pleasure and the absence of pain to achieve tranquility of mind.'
        },
        '客观主义': {
            name: 'Objectivism',
            desc: 'Champions reason, individualism, and laissez-faire capitalism.'
        },
        '悲观主义': {
            name: 'Pessimism',
            desc: 'Views life as inherently painful — to exist is to suffer.'
        },
        '乐观主义': {
            name: 'Optimism',
            desc: 'Believes the world is moving toward improvement and the future is hopeful.'
        },
        '意志主义': {
            name: 'Voluntarism',
            desc: 'The will to power is the fundamental drive of life, pursuing self-overcoming.'
        },
        '人文主义': {
            name: 'Humanism',
            desc: 'Centers on human value, dignity, and reason.'
        },
        '结构主义': {
            name: 'Structuralism',
            desc: 'Emphasizes that deep structures determine phenomena; individuals are constrained by systems.'
        },
        '解构主义': {
            name: 'Deconstruction',
            desc: 'Dissolves fixed meanings and binary oppositions, revealing internal contradictions in texts.'
        },
        '后现代主义': {
            name: 'Postmodernism',
            desc: 'Questions grand narratives, universal truths, and objective knowledge.'
        },
        '实证主义': {
            name: 'Positivism',
            desc: 'Only verifiable scientific knowledge constitutes authentic knowledge.'
        },
        '现象学': {
            name: 'Phenomenology',
            desc: 'Returns to the things themselves, describing the essential structures of conscious experience.'
        },
        '自然主义': {
            name: 'Naturalism',
            desc: 'All phenomena can be explained by natural causes, rejecting supernatural explanations.'
        },
        '超验主义': {
            name: 'Transcendentalism',
            desc: 'Believes in the possibility of directly grasping ultimate reality beyond sense and reason.'
        },
        '相对主义': {
            name: 'Relativism',
            desc: 'Truth, morality, or values are relative to culture, individual, or context.'
        },
        '绝对主义': {
            name: 'Absolutism',
            desc: 'There exist universal, unchanging truths, moral principles, or value standards.'
        },
        '犬儒主义': {
            name: 'Cynicism',
            desc: 'Maintains a pervasive distrust and mockery of social norms and others\' motives.'
        },
        '辩证法': {
            name: 'Dialectics',
            desc: 'Understands change and development through the unity of contradictions.'
        },
        '逻辑实证主义': {
            name: 'Logical Positivism',
            desc: 'Only statements that are mathematical, logical, or verifiable are meaningful.'
        },
        '实用理性主义': {
            name: 'Pragmatic Rationalism',
            desc: 'Combines rational analysis with practical effects to guide action.'
        },

        // ---------- Political & Social ----------
        '自由主义': {
            name: 'Liberalism',
            desc: 'Emphasizes individual freedom, rights protection, limited government, and rule of law.'
        },
        '保守主义': {
            name: 'Conservatism',
            desc: 'Upholds traditional institutions, moral order, and gradual change.'
        },
        '社会主义': {
            name: 'Socialism',
            desc: 'Advocates public ownership of the means of production, economic equality, and social welfare.'
        },
        '共产主义': {
            name: 'Communism',
            desc: 'Abolishes private property, realizing a classless society of "from each according to ability, to each according to need."'
        },
        '无政府主义': {
            name: 'Anarchism',
            desc: 'Opposes all coercive hierarchies and authority, including the state.'
        },
        '社会民主主义': {
            name: 'Social Democracy',
            desc: 'Achieves social justice and a welfare state through democratic means within a capitalist framework.'
        },
        '自由意志主义': {
            name: 'Libertarianism',
            desc: 'Advocates for minimal government or even anarchy, maximizing individual and market freedom.'
        },
        '权威主义': {
            name: 'Authoritarianism',
            desc: 'Emphasizes obedience to authority, restricting individual freedom in exchange for order and security.'
        },
        '民主主义': {
            name: 'Democracy',
            desc: 'Sovereignty resides in the people, exercised through elections and participation.'
        },
        '共和主义': {
            name: 'Republicanism',
            desc: 'Emphasizes civic virtue, public good, and checks and balances, opposing hereditary power.'
        },
        '精英主义': {
            name: 'Elitism',
            desc: 'Society should be led by the most capable and talented minority.'
        },
        '平等主义': {
            name: 'Egalitarianism',
            desc: 'Advocates for equality of social, economic, and political conditions for all people.'
        },
        '民粹主义': {
            name: 'Populism',
            desc: 'Claims to represent ordinary people against elites and the establishment.'
        },
        '进步主义': {
            name: 'Progressivism',
            desc: 'Believes in continuous social reform to advance equality and justice.'
        },
        '民族主义': {
            name: 'Nationalism',
            desc: 'Centers on national interests, emphasizing national identity and sovereignty.'
        },
        '爱国主义': {
            name: 'Patriotism',
            desc: 'Love for one\'s country, supporting its interests and values.'
        },
        '国际主义': {
            name: 'Internationalism',
            desc: 'Promotes transnational cooperation and global solidarity beyond national boundaries.'
        },
        '孤立主义': {
            name: 'Isolationism',
            desc: 'Avoids involvement in foreign affairs, focusing on domestic development.'
        },
        '联邦主义': {
            name: 'Federalism',
            desc: 'Supports a decentralized system combining local autonomy with central authority.'
        },
        '社群主义': {
            name: 'Communitarianism',
            desc: 'Emphasizes community values and social responsibilities, criticizing excessive individualism.'
        },
        '世界主义': {
            name: 'Cosmopolitanism',
            desc: 'All people belong to a single global community, transcending geographic and cultural boundaries.'
        },
        '分离主义': {
            name: 'Separatism',
            desc: 'Advocates for a group to secede from an existing state and establish an independent nation.'
        },
        '殖民主义': {
            name: 'Colonialism',
            desc: 'Powerful nations control and exploit other regions, seen as an oppressive ideology.'
        },
        '反殖民主义': {
            name: 'Anti-colonialism',
            desc: 'Opposes colonial rule, striving for national independence and self-determination.'
        },
        '新自由主义': {
            name: 'Neoliberalism',
            desc: 'Champions free markets, privatization, deregulation, and globalization.'
        },
        '第三条道路': {
            name: 'Third Way',
            desc: 'A middle path between traditional socialism and neoliberalism.'
        },
        '激进主义': {
            name: 'Radicalism',
            desc: 'Advocates for fundamental changes to existing social, political, or economic structures.'
        },
        '温和主义': {
            name: 'Moderation',
            desc: 'Avoids extremes, seeking compromise and gradual reform.'
        },
        '中间主义': {
            name: 'Centrism',
            desc: 'Seeks balance between left and right on the political spectrum.'
        },

        // ---------- Economic ----------
        '资本主义': {
            name: 'Capitalism',
            desc: 'Private ownership of the means of production, market-driven resource allocation, profit-seeking.'
        },
        '自由放任主义': {
            name: 'Laissez-faire',
            desc: 'Government does not intervene in the economy; the market regulates itself.'
        },
        '干预主义': {
            name: 'Interventionism',
            desc: 'Government should actively intervene in the economy to correct market failures.'
        },
        '凯恩斯主义': {
            name: 'Keynesianism',
            desc: 'Manages aggregate demand through government spending and fiscal policy to stabilize the economy.'
        },
        '货币主义': {
            name: 'Monetarism',
            desc: 'Controlling the money supply is the primary means of stabilizing the economy.'
        },
        '重商主义': {
            name: 'Mercantilism',
            desc: 'Nations strengthen themselves through trade surpluses and accumulation of wealth.'
        },
        '计划经济主义': {
            name: 'Planned Economy',
            desc: 'Resources and production are allocated by state planning rather than markets.'
        },
        '市场经济主义': {
            name: 'Market Economy',
            desc: 'Resources are allocated through markets, with government providing the basic framework.'
        },
        '混合经济主义': {
            name: 'Mixed Economy',
            desc: 'Combines market mechanisms with government intervention, balancing efficiency and fairness.'
        },
        '分配主义': {
            name: 'Distributism',
            desc: 'Broadly disperses property ownership, opposing concentration of wealth.'
        },
        '供给学派': {
            name: 'Supply-side Economics',
            desc: 'Stimulates production through tax cuts and deregulation, driving economic growth.'
        },
        '熊彼特主义': {
            name: 'Schumpeterianism',
            desc: 'Innovation and creative destruction are the core drivers of economic development.'
        },
        '乔治主义': {
            name: 'Georgism',
            desc: 'Replaces other taxes with land value tax; land should be socially owned.'
        },
        '互惠主义': {
            name: 'Mutualism',
            desc: 'Organizes the economy through cooperation and mutual exchange rather than competition.'
        },
        '合作社主义': {
            name: 'Cooperativism',
            desc: 'Workers or consumers cooperatively own and operate enterprises.'
        },

        // ---------- Ethical & Value ----------
        '功利主义': {
            name: 'Utilitarianism',
            desc: 'The greatest happiness for the greatest number is the standard of morality.'
        },
        '义务论': {
            name: 'Deontology',
            desc: 'Actions are morally right if they conform to duty, regardless of consequences.'
        },
        '德性伦理学': {
            name: 'Virtue Ethics',
            desc: 'Focuses on cultivating virtues and character, becoming a virtuous person.'
        },
        '利己主义': {
            name: 'Egoism',
            desc: 'Self-interest should be the ultimate goal of action.'
        },
        '利他主义': {
            name: 'Altruism',
            desc: 'People should selflessly care for the welfare of others, even at personal sacrifice.'
        },
        '享乐主义': {
            name: 'Hedonism',
            desc: 'Pleasure and joy are life\'s highest goals and intrinsic values.'
        },
        '禁欲主义': {
            name: 'Asceticism',
            desc: 'Achieves spiritual or moral perfection through self-denial and restraint of desires.'
        },
        '道德相对主义': {
            name: 'Moral Relativism',
            desc: 'Moral judgments vary by culture, individual, or context; no universal standards exist.'
        },
        '道德绝对主义': {
            name: 'Moral Absolutism',
            desc: 'There are universal, unchanging moral principles applicable to all cultures.'
        },
        '道德虚无主义': {
            name: 'Moral Nihilism',
            desc: 'Objective morality does not exist; moral statements have no truth value.'
        },
        '关怀伦理学': {
            name: 'Care Ethics',
            desc: 'The core of morality lies in relationships, care, and compassion.'
        },
        '世俗主义': {
            name: 'Secularism',
            desc: 'Public life and morality should not depend on religion but be based on reason.'
        },
        '宗教伦理': {
            name: 'Religious Ethics',
            desc: 'Moral principles derive from religious faith and divine commandments.'
        },
        '后果主义': {
            name: 'Consequentialism',
            desc: 'Rightness or wrongness of actions depends solely on their outcomes.'
        },
        '情感主义': {
            name: 'Emotivism',
            desc: 'Moral judgments express emotions and attitudes rather than facts.'
        },

        // ---------- Cultural & Lifestyle ----------
        '个人主义': {
            name: 'Individualism',
            desc: 'Individual independence and self-realization take precedence over collective goals.'
        },
        '集体主义': {
            name: 'Collectivism',
            desc: 'Group goals and welfare take priority over individual interests and desires.'
        },
        '物质主义': {
            name: 'Materialism',
            desc: 'Material wealth and consumption are the primary markers of happiness and success.'
        },
        '精神主义': {
            name: 'Spiritualism',
            desc: 'Inner spiritual growth is more important than material pursuits.'
        },
        '极简主义': {
            name: 'Minimalism',
            desc: 'Reduces material possessions and clutter, focusing on what truly matters.'
        },
        '消费主义': {
            name: 'Consumerism',
            desc: 'Achieves satisfaction and identity through continuous consumption.'
        },
        '环保主义': {
            name: 'Environmentalism',
            desc: 'Protects the natural environment and promotes sustainable lifestyles.'
        },
        '生态主义': {
            name: 'Ecologism',
            desc: 'Prioritizes the overall health of ecosystems; humans are part of nature.'
        },
        '动物解放主义': {
            name: 'Animal Liberation',
            desc: 'Animals deserve equal rights and freedom from human exploitation.'
        },
        '素食主义': {
            name: 'Vegetarianism',
            desc: 'Avoids animal products for moral, health, or environmental reasons.'
        },
        '技术主义': {
            name: 'Technicism',
            desc: 'Technology is the primary force for solving human problems and driving progress.'
        },
        '技术乐观主义': {
            name: 'Techno-optimism',
            desc: 'Believes technological advances will bring a brighter future.'
        },
        '技术悲观主义': {
            name: 'Techno-pessimism',
            desc: 'Warns of technology\'s negative consequences such as alienation, surveillance, and environmental damage.'
        },
        '卢德主义': {
            name: 'Luddism',
            desc: 'Opposes or warns against new technologies, citing job loss and loss of humanity.'
        },
        '未来主义': {
            name: 'Futurism',
            desc: 'Embraces the future, speed, technology, and change while rejecting tradition.'
        },
        '传统主义': {
            name: 'Traditionalism',
            desc: 'Respects and preserves historically inherited culture, institutions, and values.'
        },
        '现代主义': {
            name: 'Modernism',
            desc: 'Celebrates reason, progress, innovation, and universal standards.'
        },
        '波西米亚主义': {
            name: 'Bohemianism',
            desc: 'A free-spirited, unconventional life pursuing art and spiritual experiences.'
        },
        '回归自然主义': {
            name: 'Back-to-Nature',
            desc: 'Returns to a simple, natural lifestyle, distancing from modern civilization.'
        },

        // ---------- Art & Aesthetics ----------
        '浪漫主义': {
            name: 'Romanticism',
            desc: 'Emphasizes emotion, imagination, nature, and individual expression.'
        },
        '现实主义': {
            name: 'Realism',
            desc: 'Depicts life and the world objectively and truthfully, without idealization.'
        },
        '自然主义': {
            name: 'Naturalism',
            desc: 'Faithfully reproduces nature and reality, emphasizing objective observation.'
        },
        '象征主义': {
            name: 'Symbolism',
            desc: 'Expresses inner spiritual worlds through symbols, metaphors, and mystical imagery.'
        },
        '印象主义': {
            name: 'Impressionism',
            desc: 'Captures fleeting light and sensory impressions, emphasizing subjective experience.'
        },
        '表现主义': {
            name: 'Expressionism',
            desc: 'Distorts reality to express inner emotions and subjective feelings.'
        },
        '超现实主义': {
            name: 'Surrealism',
            desc: 'Unleashes the subconscious through dreamlike, absurd imagery, breaking rational constraints.'
        },
        '达达主义': {
            name: 'Dadaism',
            desc: 'Anti-art, anti-reason, anti-tradition — challenges definition through absurdity and chaos.'
        },
        '极简主义': {
            name: 'Minimalism',
            desc: 'Reduces to essential elements, removing ornamentation, pursuing pure form.'
        },
        '古典主义': {
            name: 'Classicism',
            desc: 'Admires the harmony, order, and rational beauty of ancient Greece and Rome.'
        },
        '功能主义': {
            name: 'Functionalism',
            desc: 'Form follows function — practicality and efficiency determine design.'
        },
        '巴洛克主义': {
            name: 'Baroque',
            desc: 'Characterized by grandeur, dynamism, drama, and elaborate ornamentation.'
        }
    }
};

// Export to global
if (typeof window !== 'undefined') {
    window.LANG_EN = LANG_EN;
    console.log('✅ English language pack loaded');
}