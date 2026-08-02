// ==========================================
// IsmoType Question Data - English (en) Part 6 (Questions 251-300)
// File: questions/questions_en_6.js
// ==========================================
const QUESTIONS_EN_6 = [
  {
    q: "I prefer deep one-on-one conversations over group discussions.",
    mbti: [-2, 0, 0, 0],
    tags: [0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "Speaking up in meetings feels effortless and even enjoyable to me.",
    mbti: [2, 0, 1, 0],
    tags: [1, 0, 0, -1, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "When reading, I focus more on the literal information than the author's intended meaning.",
    mbti: [0, -2, 1, 1],
    tags: [0, 0, 1, 0, 0, 2, -1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "I find it fascinating to deconstruct the hidden meanings behind a work.",
    mbti: [0, 2, -1, -1],
    tags: [1, 0, -1, -1, 1, 0, 1, 0, 0, 1, 0, 0, 1, -1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "At work, I value task completion quality more than relationships with colleagues.",
    mbti: [0, 0, 2, 1],
    tags: [1, 0, 0, 0, 0, 2, -1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
  },
  {
    q: "Building good relationships with colleagues is equally important as completing tasks.",
    mbti: [0, 0, -2, -1],
    tags: [0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "I make detailed budgets and route plans before traveling.",
    mbti: [0, 0, 0, 3],
    tags: [0, 0, 2, 0, -1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, -1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "I prefer following my instincts on a trip — spontaneous journeys are the most memorable.",
    mbti: [0, 0, 0, -3],
    tags: [3, 0, -2, -1, 2, -1, 1, 2, -1, 0, 0, 0, 0, -2, 1, 1, -1, 1, -2, 1, 0, 0, 0, 0, 1, 0]
  },
  {
    q: "Rules exist to be broken — that's how progress happens.",
    mbti: [2, 2, 0, -3],
    tags: [3, 0, -3, -3, 3, 0, 1, 3, -1, 2, -2, 0, 0, -1, 1, 1, -2, 2, -3, 3, 0, 1, 0, 0, 0, 1]
  },
  {
    q: "Without rules, society would descend into a lawless chaos.",
    mbti: [-1, -2, 0, 3],
    tags: [-2, 1, 3, 2, -2, 2, -1, -2, 2, -1, 0, 0, 0, 0, -1, -1, 1, -1, 3, -2, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "High incomes for the wealthy are fair compensation for their contributions.",
    mbti: [1, -1, 2, 1],
    tags: [2, 0, 1, 0, -1, 1, -1, 3, -2, 0, 0, 3, -1, 0, 0, -1, 0, -1, 1, -1, 0, 3, 0, 2, 0, 1]
  },
  {
    q: "The existence of billionaires is a sign of policy failure.",
    mbti: [-1, 1, -2, -1],
    tags: [1, 3, -1, -1, 2, 0, 1, -1, 2, 0, 0, -2, 0, 0, 1, 1, 0, 1, -1, 1, 0, -3, -1, -1, 0, 0]
  },
  {
    q: "Children should be encouraged to question authority, including teachers and parents.",
    mbti: [1, 2, 0, -2],
    tags: [3, 1, -2, -2, 2, 1, 0, 2, -1, 3, -1, 0, 0, 0, 1, 1, -1, 2, -2, 3, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "Respecting teachers and honoring parents are the most important virtues for children.",
    mbti: [-1, -2, -1, 2],
    tags: [-1, 0, 3, 3, -2, 0, 1, -1, 1, -2, 1, 0, 0, 0, -1, 0, 2, -2, 2, -2, 1, -1, 0, 0, 0, -1]
  },
  {
    q: "If a person's wrongdoing is caused by their environment, they shouldn't be blamed.",
    mbti: [0, 1, -2, -1],
    tags: [1, 1, -1, -1, 1, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, -1]
  },
  {
    q: "Regardless of excuses, everyone must take full responsibility for their actions.",
    mbti: [1, 0, 2, 2],
    tags: [2, 0, 1, 1, 0, 2, -1, 2, 0, 0, 0, 0, 0, 0, 0, -1, 1, -1, 1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "Immigrants should fully assimilate into the local culture and abandon their original customs.",
    mbti: [1, -2, 1, 2],
    tags: [-1, 0, 2, 2, -1, 0, -1, -1, 1, 0, 0, 0, 0, 0, -1, -1, 1, -2, 2, -1, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "People from different cultural backgrounds maintaining their distinct characteristics makes society richer.",
    mbti: [-1, 2, -1, -2],
    tags: [2, 2, -2, -2, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 3, -2, 0, 2, 0, 0, 0, 0, 0]
  },
  {
    q: "We should allow gene editing on human embryos to prevent diseases.",
    mbti: [1, 2, 2, -1],
    tags: [2, 1, -1, -2, 3, 3, 0, 1, 0, 0, -2, 1, -1, 0, 1, 0, -1, 0, -1, 1, 0, 1, 0, 0, 0, 3]
  },
  {
    q: "Gene editing technology crosses ethical boundaries and should not be promoted.",
    mbti: [-2, -1, -1, 2],
    tags: [0, 0, 2, 2, -2, 0, 2, 0, 1, 1, 2, 0, 2, 0, -1, 0, 3, -1, 2, -1, 1, -1, 0, 0, 1, -2]
  },
  {
    q: "The meaning of life lies in creating and leaving your mark.",
    mbti: [2, 1, 1, -1],
    tags: [3, 0, -1, -2, 2, 0, 1, 3, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, 0, 2, 0, 1, 0, 1]
  },
  {
    q: "The meaning of life lies in experiencing the present moment — no need to deliberately create anything.",
    mbti: [-1, 0, -1, -1],
    tags: [1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, -1, 1, 0, 1, 0]
  },
  {
    q: "Fast fashion may be cheap, but it harms the environment and should be resisted.",
    mbti: [-1, 1, -2, 1],
    tags: [0, 2, 1, 0, 1, 0, 2, -1, 2, 0, 0, -2, 0, -1, 1, 1, 0, 0, 0, 0, 2, -2, -1, -2, 3, -1]
  },
  {
    q: "Downgrading consumption and seeking affordable fashion is a wise economic choice.",
    mbti: [0, -1, 1, 1],
    tags: [1, 0, 0, 0, 0, 0, -1, 2, 0, 0, 0, 2, 0, 3, -1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0]
  },
  {
    q: "The most important role of art is to reflect social reality and drive change.",
    mbti: [0, 1, -1, 1],
    tags: [2, 2, -1, -2, 3, 0, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1, -2, 3, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Art should provide entertainment and aesthetic pleasure for the masses.",
    mbti: [0, -1, 0, 0],
    tags: [1, 0, 1, 1, -1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0]
  },
  {
    q: "Maintaining appropriate distance from relatives is better for relationships than being overly close.",
    mbti: [0, 0, 1, 1],
    tags: [1, 0, 1, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Family members should support each other unconditionally when needed — boundaries don't matter.",
    mbti: [0, 0, -2, -1],
    tags: [-1, 0, 0, 1, -1, -1, 2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "I dream of a perfect world without class or conflict.",
    mbti: [-2, 2, -3, -2],
    tags: [2, 3, -3, -3, 3, -1, 2, 0, 2, 0, 0, -1, 2, 0, 3, 2, 0, 2, -3, 2, 3, -3, -1, -2, 1, -1]
  },
  {
    q: "A perfect utopia is either impossible to achieve or would become a dictatorship.",
    mbti: [1, -1, 1, 1],
    tags: [1, 0, 1, 0, -1, 2, -1, 1, 0, 3, 0, 0, 0, 0, -2, -1, 0, -1, 1, -1, 0, 1, 0, 0, 0, 1]
  },
  {
    q: "Cooking a simple meal myself is more satisfying than ordering takeout.",
    mbti: [0, -1, -1, 1],
    tags: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, 0, 0]
  },
  {
    q: "I'd rather pay for convenience and services than spend my own time on them.",
    mbti: [1, 0, 0, -1],
    tags: [2, 0, -1, -1, 0, 1, 0, 2, -1, 0, 0, 2, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1, -1, 2, 0, 1]
  },
  {
    q: "Work is mainly for earning a living; meaning can be found in leisure time.",
    mbti: [0, -1, 1, 0],
    tags: [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
  },
  {
    q: "Work is an important way to realize personal value and should have a sense of mission.",
    mbti: [0, 1, -1, 1],
    tags: [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
  },
  {
    q: "I trust that traditional news media reports are mostly objective.",
    mbti: [0, -1, 0, 1],
    tags: [0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "All media is biased; I prefer independent alternative media.",
    mbti: [0, 1, 1, -2],
    tags: [2, 0, -1, -1, 2, 1, 0, 1, 0, 3, -1, 0, 0, 0, 1, 1, -1, 2, -1, 2, 0, 1, 0, 0, 0, 1]
  },
  {
    q: "I'm curious about new things and get bored easily.",
    mbti: [1, 2, 0, -2],
    tags: [3, 0, -2, -2, 3, 1, 1, 2, 0, 1, -1, 0, 0, -1, 2, 1, -1, 2, -2, 1, 0, 0, 0, 1, 0, 2]
  },
  {
    q: "Routine and stability give me a sense of security; I don't like too much change.",
    mbti: [-2, -2, -1, 3],
    tags: [-1, 0, 3, 2, -3, 0, -1, -1, 0, -2, 1, 0, 0, 1, -2, 0, 2, -2, 2, -2, 2, -1, 1, -1, 0, -2]
  }
];

if (typeof window !== 'undefined') {
  window.QUESTIONS_EN_6 = QUESTIONS_EN_6;
}
console.log('✅ questions_en_6.js loaded (50 questions)');