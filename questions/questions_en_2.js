// ==========================================
// IsmoType Question Data - English (en) Part 2 (Questions 51-100)
// File: questions/questions_en_2.js
// ==========================================
const QUESTIONS_EN_2 = [
  {
    q: "I prefer communicating through text or email rather than face-to-face or by phone.",
    mbti: [-2, 0, 0, 1],
    tags: [0, 0, 0, 0, 0, 1, -1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "I believe brainstorming sessions stimulate creativity in the workplace.",
    mbti: [2, 1, 0, -1],
    tags: [1, 0, -1, -1, 2, 0, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, -1, 0, 0, 1, 0, 0, 0, 1]
  },
  {
    q: "I'm better at remembering specific data and facts than theoretical frameworks.",
    mbti: [0, -3, 0, 0],
    tags: [0, 0, 1, 0, 0, 2, -1, 0, 0, 0, 0, 2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "I find discussing abstract concepts far more engaging than everyday trivia.",
    mbti: [0, 3, 1, -1],
    tags: [0, 0, -1, -1, 1, 2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "When watching a movie, I pay more attention to logical consistency and realism.",
    mbti: [0, -2, 2, 0],
    tags: [0, 0, 1, 0, 0, 2, -1, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "I'm moved by symbolic meanings and deep metaphors when watching films.",
    mbti: [0, 2, -2, 0],
    tags: [1, 0, -1, -1, 1, -1, 2, 1, 0, 0, 1, 0, 2, -1, 1, 1, 0, 1, -1, 0, 0, 0, 0, 0, 0, -1]
  },
  {
    q: "I easily notice subtle changes in others' emotions.",
    mbti: [-1, 0, -2, -1],
    tags: [0, 0, 0, 0, 0, -1, 3, -1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Making fair judgments matters more than accommodating everyone's feelings.",
    mbti: [1, 0, 3, 1],
    tags: [0, 0, 1, 0, 0, 3, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "A team's cohesion is more critical than its efficiency in completing tasks.",
    mbti: [-1, 0, -3, -1],
    tags: [0, 1, 0, 0, 0, -1, 3, -1, 2, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 2, -1, 0, 0, 0, 0]
  },
  {
    q: "I would compromise some of my positions to preserve relationships in an argument.",
    mbti: [-2, 0, -2, -1],
    tags: [0, 0, 0, 1, 0, -1, 2, -1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, -1, 0, 2, -1, 0, 0, 0, 0]
  },
  {
    q: "I like to outline a clear step-by-step list before starting a task.",
    mbti: [0, 0, 0, 3],
    tags: [0, 0, 2, 0, -1, 2, -1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, -1, 1, 0, 0, 0, 0, 1]
  },
  {
    q: "I prefer keeping my options open and delaying decisions until the last moment.",
    mbti: [0, 0, 0, -3],
    tags: [2, 0, -1, -1, 1, -1, 1, 2, -1, 1, 0, 0, 0, 0, 1, 1, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "For uncertain situations, I prepare multiple contingency plans in advance.",
    mbti: [0, -1, 1, 3],
    tags: [0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  },
  {
    q: "I enjoy the tension of approaching deadlines — it helps me focus.",
    mbti: [1, 1, 0, -3],
    tags: [1, 0, -1, 0, 1, -1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "Wealth inequality is a natural market outcome; government should not intervene excessively.",
    mbti: [1, 0, 2, 1],
    tags: [3, -1, 0, -1, 1, 2, -1, 3, -2, 0, -1, 2, -1, 0, 0, -1, 0, -1, 0, 0, 0, 3, 1, 2, 0, 2]
  },
  {
    q: "Society should significantly reduce wealth gaps through redistribution.",
    mbti: [-1, 0, -2, -1],
    tags: [0, 3, 0, 0, 2, 0, 1, -2, 3, 0, 0, -1, 0, 0, 1, 1, 0, 1, -1, 0, 1, -2, -1, -1, 0, 0]
  },
  {
    q: "Government has no right to interfere with voluntary transactions between consenting adults.",
    mbti: [1, 1, 1, -2],
    tags: [3, 0, -2, -2, 1, 1, 0, 3, -2, 0, -1, 1, 0, 0, 1, 1, -1, 0, -2, 1, 0, 1, 0, 1, 0, 0]
  },
  {
    q: "Strong market regulation is needed to protect consumers and workers.",
    mbti: [-1, -1, -1, 2],
    tags: [-1, 2, 2, 0, 1, 1, 1, -1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "History is driven by the few who dare to challenge the status quo.",
    mbti: [1, 2, 0, -2],
    tags: [2, 1, -2, -2, 3, 0, 1, 2, 0, 1, 0, 0, 0, 0, 2, 0, 0, 1, -3, 3, 0, 1, 0, 0, 0, 2]
  },
  {
    q: "Social stability depends on the majority following existing rules.",
    mbti: [-1, -2, 0, 3],
    tags: [-1, 0, 3, 2, -2, 0, -1, -1, 1, -2, 0, 0, 0, 0, -1, -1, 0, -1, 3, -3, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "I sympathize with those who disobey the law to protest injustice.",
    mbti: [1, 1, -1, -2],
    tags: [2, 3, -2, -1, 2, -1, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, -2, 3, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Breaking the law is never acceptable; change should come through legal channels.",
    mbti: [-1, -1, 0, 3],
    tags: [-1, 0, 3, 1, -1, 1, -1, -1, 0, -1, 0, 0, 0, 0, -1, 0, 1, -1, 1, -2, 2, 0, 0, 0, 0, 0]
  },
  {
    q: "Marriage as an institution is outdated and should be replaced by flexible partnerships.",
    mbti: [0, 2, 1, -2],
    tags: [3, 1, -2, -3, 3, 1, 1, 2, -1, 1, -2, 0, 0, 0, 1, 1, -1, 2, -2, 1, 0, 0, 1, 0, 0, 0]
  },
  {
    q: "Traditional family structures provide the ideal environment for raising the next generation.",
    mbti: [0, -2, -1, 2],
    tags: [-1, 0, 3, 3, -2, 0, 0, -1, 1, -1, 1, 0, 0, 0, -1, 0, 2, -2, 1, -2, 1, 0, 0, 0, 0, -1]
  },
  {
    q: "I believe some form of God or cosmic consciousness exists.",
    mbti: [-1, 1, -2, -1],
    tags: [-1, 0, 0, 1, 0, -2, 1, -1, 0, -1, 3, 0, 3, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, -2]
  },
  {
    q: "Religion is an outdated worldview; science is sufficient to explain everything.",
    mbti: [0, 1, 3, 0],
    tags: [0, 0, -1, -1, 1, 3, -2, 0, 0, 2, -3, 2, -2, 0, 0, 0, -2, 0, -1, 1, 0, 0, 0, 0, 0, 3]
  },
  {
    q: "The existence of an afterlife or soul is possible.",
    mbti: [-1, 2, -2, -1],
    tags: [0, 0, -1, 0, 0, -1, 1, 0, 0, 0, 2, 0, 3, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, -1]
  },
  {
    q: "Life is finite; we should fully pursue worldly achievements and pleasures.",
    mbti: [1, 0, 2, -1],
    tags: [2, 0, -1, -1, 2, 2, 1, 3, -1, 1, -2, 2, -1, 0, -1, 0, 0, 0, 0, 1, 0, 2, 1, 2, 0, 1]
  },
  {
    q: "Privatization is generally more efficient than nationalization.",
    mbti: [1, 0, 2, 1],
    tags: [3, 0, 0, -1, 1, 2, -1, 2, -1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 0, 2]
  },
  {
    q: "Key industries (such as energy and healthcare) should be state-controlled.",
    mbti: [-1, -1, -1, 1],
    tags: [-1, 3, 1, 0, 1, 0, 1, -2, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, -2, 0, -1, 0, 0]
  },
  {
    q: "Free trade benefits everyone.",
    mbti: [1, 1, 2, 0],
    tags: [2, 0, -1, -1, 2, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 1, 0, 1, -1, 0, 1, 2, 0, 1, 0, 2]
  },
  {
    q: "Trade protectionism is necessary to protect domestic workers.",
    mbti: [-1, -1, 0, 1],
    tags: [0, 1, 2, 1, -1, 0, 1, -1, 2, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1, 0, 0, -1, 0, 0, 0, -1]
  },
  {
    q: "Economic growth is more important than environmental protection.",
    mbti: [1, -1, 2, 1],
    tags: [1, 0, 0, -1, 2, 1, -1, 1, 0, 0, 0, 3, -2, 0, -1, -1, 0, 0, 0, 0, 0, 2, 1, 2, -3, 3]
  },
  {
    q: "Even if it lowers our standard of living, we must prioritize protecting the planet.",
    mbti: [-1, 1, -2, -1],
    tags: [0, 2, 1, 0, 1, 0, 2, -1, 2, 0, 0, -3, 1, 0, 1, 1, 0, 0, 0, 0, 2, -3, -3, -3, 3, -2]
  },
  {
    q: "Animals should have the same rights as humans.",
    mbti: [-2, 1, -3, -2],
    tags: [1, 3, -1, -1, 2, -1, 2, 0, 0, 0, 0, -1, 0, 0, 1, 2, 0, 1, 0, 0, 2, -1, -1, -1, 2, -1]
  },
  {
    q: "Humans hold a higher status in nature than other species.",
    mbti: [1, -1, 2, 1],
    tags: [2, 0, 0, 1, 1, 1, -1, 2, 0, 0, 0, 2, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 1, -2, 2]
  },
  {
    q: "When I appreciate a painting, I focus first on its color and composition.",
    mbti: [0, -1, 1, 0],
    tags: [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "What matters most in an artwork is the idea it conveys.",
    mbti: [0, 2, 0, -1],
    tags: [0, 1, 0, -1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Dissonant art (such as noise music) can also be beautiful.",
    mbti: [1, 2, -1, -2],
    tags: [3, 0, -2, -2, 3, -2, 1, 2, -1, 2, -2, 0, 0, -1, 1, 0, -1, 3, -2, 2, 0, 0, 0, -1, 0, 0]
  },
  {
    q: "Classical artistic standards and aesthetic norms should be followed.",
    mbti: [-1, -1, 0, 2],
    tags: [0, 0, 2, 3, -2, 2, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 2, -2, 2, -1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "We should prioritize helping our own citizens over foreign refugees.",
    mbti: [0, -1, 1, 1],
    tags: [-1, 0, 2, 2, -1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Global suffering concerns me, even when it happens far away.",
    mbti: [-1, 1, -2, -2],
    tags: [2, 3, -1, -1, 2, 0, 2, 0, 3, 0, 0, 0, 0, 0, 2, 3, 0, 3, -1, 0, 2, 0, 0, 0, 0, 0]
  },
  {
    q: "Cultural homogenization is a serious problem brought by globalization.",
    mbti: [-1, 1, -1, 0],
    tags: [0, 1, 1, 1, -1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 2, 0, 0, 0, 0, -1]
  },
  {
    q: "Shared global pop culture is a positive development for all humanity.",
    mbti: [1, -1, 0, -1],
    tags: [2, 0, -1, -1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, -1, 0, 1, 1, 1, 1, 0, 2]
  },
  {
    q: "Artificial intelligence will eventually surpass humanity; we should prepare for it.",
    mbti: [0, 2, 2, 1],
    tags: [1, 0, -1, -1, 3, 3, -1, 0, 0, 0, 0, 1, -1, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 3]
  },
  {
    q: "The alienation and loneliness caused by technological progress outweigh its conveniences.",
    mbti: [-1, 0, -2, -1],
    tags: [0, 0, 1, 1, -2, 0, 2, 0, 0, 2, 0, -1, 1, 0, -1, 0, 0, 0, 0, 0, 1, -2, -1, -1, 1, -3]
  },
  {
    q: "We should embrace genetic engineering and human enhancement technologies.",
    mbti: [1, 2, 2, 0],
    tags: [2, 0, -1, -2, 3, 3, -1, 2, 0, 0, -2, 1, -1, 0, 1, 0, 0, 0, -1, 1, 0, 1, 0, 1, -1, 3]
  },
  {
    q: "I enjoy minimalism — owning the least possible makes me feel free.",
    mbti: [-1, 1, -1, 2],
    tags: [0, 0, 0, 0, -1, 0, 1, 1, 0, 0, 1, -2, 2, 0, 0, 1, 1, 0, 0, 0, 2, -2, -3, -2, 1, -1]
  },
  {
    q: "Having a rich collection of goods and consuming brings me joy.",
    mbti: [1, -1, 0, -1],
    tags: [2, 0, -1, -1, 1, 0, 1, 2, -1, 0, 0, 3, -2, 0, -1, 0, 0, 1, 0, 0, 0, 2, 1, 3, 0, 1]
  }
];

if (typeof window !== 'undefined') {
  window.QUESTIONS_EN_2 = QUESTIONS_EN_2;
}
console.log('✅ questions_en_2.js loaded (50 questions)');