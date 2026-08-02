// ==========================================
// IsmoType Question Data - English (en) Part 1 (Questions 1-50)
// File: questions/questions_en_1.js
// ==========================================
const QUESTIONS_EN_1 = [
  // --- Social & Energy (E/I) ---
  {
    q: "I feel energized rather than exhausted after attending a lively party.",
    mbti: [3, 0, 0, 0],
    tags: [1, 0, -1, -1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "I prefer deep conversations with a few people over small talk with many.",
    mbti: [-3, 0, 0, 0],
    tags: [0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "Speaking up and expressing my views in a team setting comes naturally and enjoyably to me.",
    mbti: [2, 0, 1, 0],
    tags: [1, 0, 0, -1, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "I need plenty of alone time to process my thoughts and recharge.",
    mbti: [-2, 0, 0, 1],
    tags: [0, 0, 1, 0, 0, 1, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, -1, 0, 0, 0, 0]
  },
  // --- Information Processing (S/N) ---
  {
    q: "I focus more on concrete details and facts than on grand theories and imagination.",
    mbti: [0, -3, 0, 0],
    tags: [0, 0, 1, 0, -1, 1, -1, 0, 0, 0, 0, 2, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "Abstract concepts and future possibilities capture my attention more than daily routines.",
    mbti: [0, 3, 0, 0],
    tags: [1, 0, -1, -1, 2, 1, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "When solving problems, I tend to rely on methods that have worked in the past.",
    mbti: [0, -2, 0, 1],
    tags: [0, 0, 1, 1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 3, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "I trust inspiration and intuition, even when they lack logical support.",
    mbti: [0, 2, -1, -1],
    tags: [1, 0, -1, -1, 1, -1, 2, 1, 0, 0, 1, 0, 2, -1, 2, 1, 0, 1, -1, 0, 0, 0, 0, 0, 0, -1]
  },
  // --- Decision Making (T/F) ---
  {
    q: "When making important decisions, I prioritize weighing pros and cons over considering others' feelings.",
    mbti: [0, 0, 3, 0],
    tags: [0, 0, 0, 0, 0, 3, -1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
  },
  {
    q: "I'm willing to compromise efficiency for the sake of team harmony.",
    mbti: [0, 0, -3, 0],
    tags: [0, 1, 0, 0, 0, -1, 3, -1, 2, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 2, -1, 0, 0, 0, 0]
  },
  {
    q: "Fairness and consistency matter more than compassion.",
    mbti: [0, 0, 2, 1],
    tags: [0, 1, 1, 0, 0, 3, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "When pointing out someone's mistake, I prioritize not hurting their feelings.",
    mbti: [0, 0, -2, -1],
    tags: [0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0]
  },
  // --- Lifestyle (J/P) ---
  {
    q: "I enjoy making detailed schedules in advance and following them.",
    mbti: [0, 0, 0, 3],
    tags: [0, 0, 2, 0, -1, 2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 1, 0, 0, 0, 0, 1]
  },
  {
    q: "Plans often change, and I prefer adapting on the fly.",
    mbti: [0, 0, 0, -3],
    tags: [2, 0, -1, -1, 2, -1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "After completing a task, I double-check details to ensure perfection.",
    mbti: [0, -1, 1, 2],
    tags: [0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Deadlines are flexible; inspiration often strikes at the last moment.",
    mbti: [0, 1, -1, -2],
    tags: [2, 0, -1, -1, 2, -1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0, 0]
  },
  // --- Freedom vs Order ---
  {
    q: "Personal freedom of choice should not be overly restricted by law, even if it brings risks.",
    mbti: [1, 1, 1, -1],
    tags: [3, 0, -2, -2, 2, 1, 0, 3, -1, 1, -1, 0, 0, 0, 1, 1, 0, 1, -2, 2, 0, 1, 1, 0, 0, 0]
  },
  {
    q: "Social stability requires strong laws and enforcement to constrain individual behavior.",
    mbti: [-1, -1, 0, 2],
    tags: [-1, 0, 3, 2, -2, 1, 0, -1, 2, -1, 0, 0, 0, 0, -1, -1, 0, -1, 3, -2, 1, -1, 0, 0, 0, 0]
  },
  // --- Tradition vs Change ---
  {
    q: "Traditional family structures and marriage values should still be respected and maintained in modern society.",
    mbti: [0, -1, -1, 1],
    tags: [-1, 0, 2, 3, -2, 0, 0, -1, 1, 0, 1, 0, 0, 0, -1, 0, 1, -1, 1, -2, 1, 0, 0, 0, 0, -1]
  },
  {
    q: "Outdated traditions should be boldly abandoned to make way for progress.",
    mbti: [0, 2, 1, -2],
    tags: [2, 0, -2, -3, 3, 1, 0, 1, -1, 1, -1, 0, 0, 0, 2, 0, -1, 2, -2, 2, 0, 0, 0, 0, 0, 1]
  },
  // --- Reason vs Emotion ---
  {
    q: "The scientific method is the only reliable path to acquiring knowledge.",
    mbti: [0, 0, 2, 1],
    tags: [0, 0, 0, 0, 0, 3, -3, 0, 0, 0, -2, 2, -2, 0, 1, 0, -2, 0, -1, 0, 0, 0, -1, 0, 0, 3]
  },
  {
    q: "The richness of human emotion cannot be fully captured by scientific data.",
    mbti: [0, 1, -2, -1],
    tags: [0, 0, -1, 0, 0, -2, 3, 1, 0, 0, 0, 0, 2, -1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, -2]
  },
  // --- Individual vs Collective ---
  {
    q: "Personal achievement and self-actualization should take priority over collective goals.",
    mbti: [1, 1, 1, 0],
    tags: [3, 0, -1, -2, 1, 1, -1, 3, -2, 0, 0, 1, 0, 0, 1, -1, 0, 0, -1, 1, 0, 2, 1, 1, 0, 1]
  },
  {
    q: "The needs of the collective should take precedence over individual desires.",
    mbti: [-1, -1, -1, 0],
    tags: [-2, 2, 1, 1, -1, 0, 0, -3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -2, 1, -2, -1, -1, 0, 0]
  },
  // --- Skepticism vs Faith ---
  {
    q: "One should remain skeptical of any claimed truth until sufficient evidence is provided.",
    mbti: [0, 0, 1, 0],
    tags: [0, 0, -1, -1, 1, 2, -1, 0, 0, 3, -2, 0, 0, 0, -1, 1, -2, 0, -1, 1, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "Some things transcend reason and can only be perceived through faith or intuition.",
    mbti: [0, 1, -1, -1],
    tags: [1, 0, 0, 0, 0, -2, 2, 0, 0, -1, 3, 0, 3, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, -1]
  },
  // --- Material vs Spiritual ---
  {
    q: "Financial security and living comfort are my primary life goals.",
    mbti: [0, -1, 0, 1],
    tags: [0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 3, -2, 0, -1, 0, 0, 0, 0, 0, 1, 1, 1, 2, 0, 1]
  },
  {
    q: "Inner fulfillment and spiritual peace matter far more than external wealth.",
    mbti: [-1, 1, -1, -1],
    tags: [0, 0, -1, -1, 0, 0, 2, -1, 0, 0, 1, -3, 3, 0, 1, 1, 1, 0, 0, 0, 2, -2, -2, -2, 1, -1]
  },
  // --- Practical vs Ideal ---
  {
    q: "The quality of a policy should be judged solely by its practical outcomes.",
    mbti: [0, -1, 2, 0],
    tags: [0, 0, 0, 0, 1, 2, -1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2]
  },
  {
    q: "Even if inefficient in the short term, a society should uphold its ideals.",
    mbti: [0, 1, -2, 0],
    tags: [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, -2, 3, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  // --- Tolerance vs Purity ---
  {
    q: "Being open-minded toward diverse lifestyles and viewpoints is a virtue.",
    mbti: [-1, 1, -1, -1],
    tags: [1, 1, -1, -1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, -1, 0, 2, 0, 0, 0, 0, 0]
  },
  {
    q: "Upholding principles and purity is far more important than being all-inclusive.",
    mbti: [1, -1, 1, 2],
    tags: [0, 0, 1, 1, -1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 3, -1, 1, 0, 0, 0, 0, 0, 0, 0]
  },
  // --- Diversity vs Authority ---
  {
    q: "A diverse society is vibrant, and different voices should coexist.",
    mbti: [-1, 1, -1, -1],
    tags: [2, 2, -2, -2, 2, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 2, 0, 3, -2, 1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Without a strong authority, society would quickly descend into chaos.",
    mbti: [0, -1, 0, 2],
    tags: [-2, -1, 3, 1, -2, 0, -1, -1, 1, -2, 1, 0, 0, 0, -1, -2, 0, -2, 3, -2, 0, -1, -1, 0, 0, 0]
  },
  // --- Resistance vs Peace ---
  {
    q: "Civil disobedience and nonviolent resistance are justified in the face of injustice.",
    mbti: [1, 1, 0, -1],
    tags: [2, 3, -2, -1, 2, 0, 2, 1, 1, 0, 0, 0, 0, 0, 2, 1, 0, 1, -2, 3, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Maintaining social peace and stability is more important than protests and demonstrations.",
    mbti: [-1, -1, -1, 1],
    tags: [-1, 0, 2, 1, -2, 0, -1, -1, 1, -1, 0, 0, 0, 0, -1, -1, 0, -1, 1, -2, 3, -1, 0, 0, 0, 0]
  },
  // --- Competition vs Simplicity/Nature ---
  {
    q: "Competition pushes everyone to reach their full potential.",
    mbti: [1, 0, 2, 1],
    tags: [1, 0, 0, -1, 1, 1, -1, 2, -1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, -1, 3, 0, 1, 0, 1]
  },
  {
    q: "Excessive competition damages relationships; cooperation is the path forward.",
    mbti: [-1, 0, -2, -1],
    tags: [0, 2, 0, 0, 0, 0, 2, -1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, -2, -1, -1, 0, 0]
  },
  {
    q: "A simple, contented lifestyle with few desires is the healthiest way to live.",
    mbti: [-1, 1, -1, -1],
    tags: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, -2, 2, 0, 1, 1, 1, 0, 0, 0, 2, -2, -3, -2, 2, -1]
  },
  {
    q: "Pursuing new technology and consumer products makes life more meaningful.",
    mbti: [1, -1, 0, 0],
    tags: [2, 0, -1, -1, 2, 1, 0, 2, -1, 0, -1, 3, -1, 0, -1, 0, 0, 1, 0, 0, 0, 2, 1, 3, -1, 2]
  },
  // --- Environment vs Technology ---
  {
    q: "Humans have the right to transform nature to meet our needs.",
    mbti: [1, -1, 2, 1],
    tags: [2, 0, 0, -1, 2, 2, -1, 2, -1, 0, -1, 2, -2, 0, 0, -1, 0, 0, 0, 1, 0, 2, 0, 2, -2, 3]
  },
  {
    q: "We should drastically reduce technology use and reconnect with nature.",
    mbti: [-1, 1, -2, -1],
    tags: [0, 0, 1, 0, 0, -1, 2, -1, 0, 2, 1, -2, 2, -1, 0, 1, 1, 0, 0, 0, 2, -2, -3, -3, 3, -3]
  },
  // --- Additional questions to ensure tag coverage ---
  {
    q: "Society should guarantee basic living standards, even if it means high taxes.",
    mbti: [-1, 0, -2, 0],
    tags: [0, 3, 1, 0, 1, 0, 1, -1, 3, 0, 0, -1, 0, 0, 1, 1, 0, 1, 0, 0, 1, -2, 0, -1, 0, 0]
  },
  {
    q: "The market economy is the most efficient way to organize economic life.",
    mbti: [0, -1, 2, 1],
    tags: [2, 0, 0, -1, 1, 2, 0, 2, -1, 0, 0, 3, -1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 0, 2]
  },
  {
    q: "The value of art lies in the sincerity of its emotional expression, not in its technique.",
    mbti: [0, 1, -2, -1],
    tags: [1, 0, -1, -1, 1, -1, 3, 2, 0, 0, 0, 0, 1, -1, 1, 1, 0, 1, -1, 0, 0, 0, 0, 0, 0, -1]
  },
  {
    q: "Perfect form and technique are the foundation of great art.",
    mbti: [0, -1, 2, 1],
    tags: [0, 0, 1, 1, 0, 3, -1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 1, 0, 0, 0, 1, 0, 0, 1]
  },
  {
    q: "National pride is essential for maintaining social cohesion.",
    mbti: [1, -1, 0, 1],
    tags: [-1, 0, 1, 3, -1, 0, 1, -1, 2, 0, 0, 0, 0, 0, -1, 0, 1, -1, 1, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "All people are first and foremost global citizens; national identity is secondary.",
    mbti: [-1, 1, -1, -1],
    tags: [2, 3, -2, -2, 2, 0, 0, 1, 3, 0, 0, 0, 0, 0, 2, 3, 0, 3, -2, 0, 2, 0, 0, 0, 0, 1]
  },
  {
    q: "The answers to most of life's questions can be found in philosophy.",
    mbti: [0, 3, 0, -1],
    tags: [0, 0, -1, -1, 0, 2, 0, 0, 0, 0, 1, 0, 3, -1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Concrete action and practical solutions change the world more than abstract theories.",
    mbti: [0, -3, 1, 2],
    tags: [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2]
  }
];

if (typeof window !== 'undefined') {
  window.QUESTIONS_EN_1 = QUESTIONS_EN_1;
}
console.log('✅ questions_en_1.js loaded (50 questions)');