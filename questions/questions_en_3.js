// ==========================================
// IsmoType Question Data - English (en) Part 3 (Questions 101-150)
// File: questions/questions_en_3.js
// ==========================================
const QUESTIONS_EN_3 = [
  {
    q: "Meeting new people is exciting for me.",
    mbti: [3, 0, 0, 0],
    tags: [1, 0, -1, -1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "I prefer investing time in maintaining existing close relationships rather than expanding my social circle.",
    mbti: [-3, 0, 0, 1],
    tags: [0, 0, 1, 1, 0, 1, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "When learning something new, I prefer starting with concrete examples rather than theory first.",
    mbti: [0, -3, 0, 0],
    tags: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Building a grand theoretical framework is more satisfying than solving specific problems.",
    mbti: [0, 3, 1, -1],
    tags: [0, 0, -1, -1, 2, 2, 0, 0, 0, 0, 0, 0, 2, -1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
  },
  {
    q: "I appreciate a building's practical function and comfort more than its design concept.",
    mbti: [0, -2, 1, 1],
    tags: [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
  },
  {
    q: "A city's charm lies in its history and cultural symbols, not its modern facilities.",
    mbti: [0, 2, -1, -1],
    tags: [0, 0, 0, 2, -1, 0, 1, 0, 1, 0, 1, -1, 2, -2, 1, 1, 0, 1, -1, 0, 1, -1, 0, 0, 0, -1]
  },
  {
    q: "When a friend confides in me, my instinct is to offer solutions rather than just comfort.",
    mbti: [0, 0, 3, 1],
    tags: [0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
  },
  {
    q: "When a friend is sad, I feel that silent companionship is more valuable than any advice.",
    mbti: [0, 0, -3, -1],
    tags: [0, 0, 0, 0, 0, -1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, -1, 0, 0, 0, 0]
  },
  {
    q: "If a rule is illogical, even if it's traditional, I tend to break it.",
    mbti: [0, 1, 2, -2],
    tags: [2, 0, -2, -3, 2, 3, -1, 1, 0, 1, -1, 0, 0, 0, 1, 0, -1, 1, -2, 2, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "I understand why people follow traditions even when they seem illogical.",
    mbti: [0, -1, -2, 2],
    tags: [0, 1, 2, 2, 0, 0, 1, -1, 1, 0, 1, 0, 0, 0, 0, 2, 0, 0, 1, -1, 1, 0, 0, 0, 0, -1]
  },
  {
    q: "A clean and organized workspace helps me be more productive.",
    mbti: [0, 0, 0, 3],
    tags: [0, 0, 2, 0, 0, 2, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0]
  },
  {
    q: "My desk may be messy, but I can always find what I need.",
    mbti: [0, 0, 0, -3],
    tags: [2, 0, -1, -1, 1, -1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, -1, 1, -1, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Adults should have the right to use any psychoactive substances as long as they don't harm others.",
    mbti: [1, 1, 1, -3],
    tags: [3, 0, -3, -3, 2, 1, 0, 3, -2, 1, -2, 0, 0, 0, 1, 1, -2, 2, -3, 2, 0, 0, 1, 1, 0, 0]
  },
  {
    q: "For public health, the government should strictly regulate addictive substances.",
    mbti: [-1, -1, -1, 3],
    tags: [-2, 2, 3, 2, -1, 1, 0, -2, 3, -1, 0, 0, 0, 0, -1, -1, 1, -1, 3, -2, 2, -1, -1, -1, 0, 0]
  },
  {
    q: "Gender is fluid and should not be confined to a binary framework.",
    mbti: [0, 2, -1, -2],
    tags: [3, 2, -2, -3, 3, 1, 1, 1, 0, 1, -2, 0, 0, 0, 1, 2, -1, 3, -2, 2, 1, 0, 0, 0, 0, 1]
  },
  {
    q: "Traditional gender roles contribute to social stability.",
    mbti: [0, -2, 0, 2],
    tags: [-1, 0, 3, 3, -3, 0, -1, -1, 1, -2, 1, 0, 0, 0, -2, -1, 2, -2, 2, -2, 1, -1, 0, 0, 0, -1]
  },
  {
    q: "Private enterprises are far more efficient than government agencies.",
    mbti: [1, 0, 2, 1],
    tags: [3, -1, 0, -1, 1, 2, -1, 3, -2, 0, 0, 2, 0, 0, 0, 0, 0, 0, -1, 0, 0, 3, 1, 2, 0, 2]
  },
  {
    q: "Healthcare and education should be fully provided by the government free of charge.",
    mbti: [-1, -1, -2, 0],
    tags: [0, 3, 0, 0, 1, 0, 1, -2, 3, 0, 0, -1, 0, 0, 1, 1, 0, 1, 0, 0, 2, -2, 0, -1, 0, 0]
  },
  {
    q: "Inheritance of wealth is unfair and should be strictly limited.",
    mbti: [0, 1, -2, 0],
    tags: [0, 3, 0, -1, 2, 1, 0, -1, 2, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 1, 1, -2, 0, -1, 0, 0]
  },
  {
    q: "Generational transfer of wealth is a reward for effort and should not be taken away.",
    mbti: [1, -1, 2, 1],
    tags: [3, 0, 1, 1, -1, 1, 0, 3, -1, 0, 0, 3, -1, 0, 0, -1, 0, -1, 0, -1, 0, 2, 1, 1, 0, 0]
  },
  {
    q: "Without government, people could still form order through voluntary cooperation.",
    mbti: [1, 2, 1, -2],
    tags: [3, 1, -3, -3, 3, 1, 0, 3, -1, 2, -2, 0, 0, 0, 1, 2, -1, 2, -3, 3, 1, 0, 1, -1, 0, 0]
  },
  {
    q: "A strong central government is a prerequisite for national development.",
    mbti: [-1, -1, 0, 3],
    tags: [-2, -1, 3, 2, -2, 0, -1, -2, 2, -2, 0, 0, 0, 0, -1, -1, 0, -1, 3, -3, 1, -1, -1, 0, 0, 1]
  },
  {
    q: "I am proud of my country and believe national interests should take priority.",
    mbti: [0, -1, -1, 2],
    tags: [-1, -1, 1, 3, -1, 0, 1, -1, 2, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "Patriotic sentiment is often exploited by politicians to incite conflict.",
    mbti: [0, 1, 1, -2],
    tags: [1, 0, -1, -2, 1, 2, 0, 1, 0, 3, 0, 0, 0, 0, 0, 1, 0, 2, -1, 1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "We should abolish all borders and allow people to migrate freely.",
    mbti: [-1, 2, -2, -3],
    tags: [3, 3, -3, -3, 3, 0, 0, 1, 3, 0, -1, 0, 0, 0, 2, 3, -1, 3, -3, 0, 2, -1, 0, 0, 0, 0]
  },
  {
    q: "Unrestricted immigration threatens national cultural identity and employment.",
    mbti: [1, -2, 1, 2],
    tags: [-2, 0, 2, 3, -2, 1, 0, 0, 1, 0, 0, 0, 0, 0, -1, -1, 1, -2, 2, -1, 0, 0, 0, 0, 0, -1]
  },
  {
    q: "The world has no predetermined meaning; I am the sum of my choices.",
    mbti: [1, 2, 1, -2],
    tags: [3, 0, -2, -2, 2, 1, 1, 3, -1, 1, -3, 0, 1, -1, 1, 0, -1, 1, -2, 2, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "I believe everyone is born with a destiny and purpose.",
    mbti: [-1, -1, -2, 1],
    tags: [-1, 0, 2, 2, -1, -1, 1, -1, 1, -1, 3, 0, 2, 0, 1, 0, 2, -1, 1, -1, 1, -1, 0, 0, 0, -1]
  },
  {
    q: "The pursuit of sensory pleasure is a primary goal in life.",
    mbti: [1, -1, 0, -2],
    tags: [2, 0, -2, -2, 1, -1, 3, 2, -1, 0, -2, 2, -1, 0, -2, 1, -3, 0, -1, 1, -1, 0, 1, 3, -1, 0]
  },
  {
    q: "Self-discipline and restraint of desires lead to true nobility.",
    mbti: [-2, 1, 1, 3],
    tags: [-1, 0, 2, 2, -2, 2, 1, -1, 0, 0, 2, -2, 2, 0, 1, 0, 3, -1, 1, -1, 1, -2, -1, -3, 0, 0]
  },
  {
    q: "As long as the outcome is good, some imperfections in the means are acceptable.",
    mbti: [0, 1, 2, -1],
    tags: [0, 1, -1, -1, 2, 1, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2]
  },
  {
    q: "Some things are morally wrong, regardless of any benefits they might bring.",
    mbti: [0, 0, -1, 2],
    tags: [0, 0, 2, 1, -1, 2, 0, 0, 0, 0, 1, 0, 1, -1, 1, 0, 3, -1, 1, 0, 1, -1, 0, 0, 0, -1]
  },
  {
    q: "Technology has made our lives much better than they were a hundred years ago.",
    mbti: [1, 0, 2, 1],
    tags: [1, 1, -1, -1, 3, 3, 0, 1, 0, 0, -1, 2, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 3]
  },
  {
    q: "Social media is destroying genuine human relationships.",
    mbti: [-1, 0, -2, -1],
    tags: [0, 0, 1, 1, -1, 0, 2, 0, 0, 3, 0, -1, 0, 0, -1, 0, 1, 0, 0, 0, 0, -1, -1, -1, 0, -3]
  },
  {
    q: "I would rather buy more expensive but eco-friendly products.",
    mbti: [-1, 1, -2, 1],
    tags: [0, 2, 1, 0, 1, 0, 2, -1, 2, 0, 0, -1, 0, 0, 1, 1, 0, 0, 0, 0, 2, -1, -1, -1, 3, 0]
  },
  {
    q: "Shopping and consumption are my primary ways of relieving stress.",
    mbti: [1, -1, 0, -2],
    tags: [1, 0, -1, -1, 1, -1, 1, 2, -1, 0, 0, 3, -1, 0, -1, 0, 0, 0, 0, 0, 0, 1, 0, 3, -1, 0]
  },
  {
    q: "Art should bring beauty and pleasure, not confusion.",
    mbti: [0, -1, -1, 1],
    tags: [0, 0, 1, 1, -1, 1, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1, -1, 1, 0, 2, 0, 1, 0, 0, 0]
  },
  {
    q: "Disturbing art is often more powerful than pleasing art.",
    mbti: [0, 2, 0, -2],
    tags: [2, 0, -2, -2, 3, -1, 2, 1, 0, 2, -1, 0, 1, -1, 1, 0, -2, 2, -2, 2, -1, 0, -1, -1, 0, 0]
  },
  {
    q: "I believe in seeing is believing and reject claims without evidence.",
    mbti: [0, -2, 2, 1],
    tags: [0, 0, 0, 0, 0, 2, -1, 0, 0, 3, -2, 2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "Miracles exist; science just hasn't explained them yet.",
    mbti: [-1, 2, -2, -2],
    tags: [0, 0, -1, 0, 0, -2, 2, 0, 0, -1, 3, 0, 3, -1, 1, 0, 0, 0, 0, 0, 1, -1, 0, 0, 1, -2]
  },
  {
    q: "I always try to see things from others' perspectives, even when I disagree.",
    mbti: [-2, 0, -3, -1],
    tags: [0, 1, -1, 0, 0, 0, 2, -1, 1, -1, 0, 0, 0, 0, 0, 3, 0, 3, -1, 0, 2, 0, 0, 0, 0, 0]
  },
  {
    q: "I struggle to understand how anyone could hold views completely opposite to mine.",
    mbti: [2, 0, 1, 2],
    tags: [0, 0, 1, 0, 0, 0, -1, 2, 0, 0, 1, 0, 0, 0, 0, -2, 2, -2, 1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "Groups are generally wiser than individuals.",
    mbti: [-2, -1, -1, 0],
    tags: [-1, 2, 0, 0, 0, -1, 0, -3, 3, -1, 0, 0, 0, 0, 0, 1, 0, 1, 0, -2, 1, -2, 0, 0, 0, 0]
  },
  {
    q: "In most cases, individual judgment is superior to group consensus.",
    mbti: [1, 1, 2, -1],
    tags: [2, 0, -1, -1, 1, 2, 0, 3, -2, 1, 0, 0, 0, 0, 0, 0, -1, -1, 0, 1, 0, 1, 0, 0, 0, 0]
  }
];

if (typeof window !== 'undefined') {
  window.QUESTIONS_EN_3 = QUESTIONS_EN_3;
}
console.log('✅ questions_en_3.js loaded (50 questions)');