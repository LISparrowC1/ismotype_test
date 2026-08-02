// ==========================================
// IsmoType Question Data - English (en) Part 4 (Questions 151-200)
// File: questions/questions_en_4.js
// ==========================================
const QUESTIONS_EN_4 = [
  {
    q: "After spending a whole day with a large group of people, I need to be alone to recover.",
    mbti: [-3, 0, 0, 0],
    tags: [0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "I'm the type to actively greet strangers at parties.",
    mbti: [3, 0, 0, 0],
    tags: [1, 0, -1, -1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "Puzzles and logic games appeal to me more than open-ended creative writing.",
    mbti: [0, -2, 1, 1],
    tags: [0, 0, 1, 0, 0, 2, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "The possibilities of future technological development spark endless imagination in me.",
    mbti: [0, 3, 0, -1],
    tags: [1, 0, -1, -1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 1, -1, 0, 0, 0, 0, 0, 0, 3]
  },
  {
    q: "I trust statistical data more than personal anecdotes.",
    mbti: [0, -1, 2, 1],
    tags: [0, 0, 0, 0, 0, 3, -2, 0, 0, 0, 0, 2, -1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
  },
  {
    q: "Even if the truth hurts, I believe it should be told directly.",
    mbti: [1, 0, 3, 0],
    tags: [2, 0, 0, 0, 1, 2, -2, 1, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 1, -1, 1, 0, 0, 0, 0]
  },
  {
    q: "Sometimes white lies are more beneficial to relationships than blunt honesty.",
    mbti: [-1, 0, -3, -1],
    tags: [0, 0, 0, 1, 0, -1, 3, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, -1, 2, -1, 0, 0, 0, 0]
  },
  {
    q: "I habitually plan detailed itineraries long before traveling.",
    mbti: [0, 0, 0, 3],
    tags: [0, 0, 2, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "A trip with no fixed itinerary is far more exciting.",
    mbti: [0, 0, 0, -3],
    tags: [3, 0, -2, -1, 3, -1, 1, 2, -1, 0, 0, 0, 0, -1, 0, 1, 0, 1, -2, 1, 0, 0, 0, 0, 1, 0]
  },
  {
    q: "Free speech is absolute and should not be limited even if it offends others.",
    mbti: [1, 2, 1, -2],
    tags: [3, 0, -2, -2, 2, 2, -1, 3, -1, 1, -1, 0, 0, 0, 1, 0, -1, 2, -2, 1, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "Hate speech is harmful to society and should be prohibited by law.",
    mbti: [-1, -1, -1, 2],
    tags: [0, 3, 2, 0, 1, 0, 1, -1, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0]
  },
  {
    q: "Universal basic income is a good solution to future automation-driven unemployment.",
    mbti: [-1, 2, -1, -1],
    tags: [1, 3, 0, -1, 2, 0, 1, 0, 2, 0, 0, -1, 0, 0, 2, 2, 0, 1, -1, 0, 2, -2, 0, -1, 0, 1]
  },
  {
    q: "People should earn income through work, not rely on government handouts.",
    mbti: [1, -1, 2, 2],
    tags: [2, 0, 2, 1, 0, 2, -1, 3, -2, 0, 0, 2, 0, 0, -1, -1, 1, -1, 0, 0, 0, 3, 0, 1, 0, 1]
  },
  {
    q: "The decision to have an abortion should be entirely up to the pregnant person.",
    mbti: [1, 1, 1, -2],
    tags: [3, 2, -2, -2, 2, 1, 0, 3, -1, 0, -1, 0, 0, 0, 1, 1, 0, 1, -2, 2, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Life begins at conception; abortion is immoral.",
    mbti: [-1, -2, 0, 3],
    tags: [-2, 0, 2, 3, -2, 0, 2, -1, 1, -1, 2, 0, 0, 0, -2, -1, 3, -1, 1, -2, 1, -1, 0, 0, 0, -1]
  },
  {
    q: "The death penalty is morally justified for certain crimes.",
    mbti: [1, 0, 2, 1],
    tags: [0, 0, 2, 1, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "The state has no right to take any life, regardless of the crime's severity.",
    mbti: [-1, 0, -2, -1],
    tags: [2, 2, -1, -1, 1, -1, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, -1, 1, 2, 0, 0, 0, 0, 0]
  },
  {
    q: "Life is inherently painful; we can only seek small comforts within it.",
    mbti: [-2, 1, -1, -1],
    tags: [0, 0, -1, -1, -1, 0, 2, 0, 0, 0, -1, -1, 1, -2, -1, 0, -1, 0, 0, 0, 0, -2, -1, -1, 0, -1]
  },
  {
    q: "Despite its challenges, life is ultimately beautiful.",
    mbti: [1, -1, 1, 1],
    tags: [2, 0, -1, -1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
  },
  {
    q: "There is no such thing as objective truth — everything is interpretation.",
    mbti: [0, 2, -1, -2],
    tags: [2, 1, -2, -2, 1, -2, 1, 0, 0, 3, -2, 0, 0, -2, -1, 2, -1, 3, -2, 1, 0, 0, 0, 0, 0, -2]
  },
  {
    q: "Mathematical and logical truths are universal and exist independently of humans.",
    mbti: [0, 0, 3, 2],
    tags: [0, 0, 2, 1, 0, 3, -2, 0, 0, -2, 1, 0, 1, 0, 1, 0, 2, -1, 1, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "Humans are the stewards of Earth and have a responsibility to protect all life.",
    mbti: [-1, 1, -2, 1],
    tags: [0, 2, 1, 0, 1, 0, 2, -1, 2, 0, 0, -1, 1, 0, 1, 2, 0, 0, 0, 0, 2, -2, -1, -1, 3, -1]
  },
  {
    q: "Natural resources exist to be used by humans.",
    mbti: [1, -1, 2, 0],
    tags: [2, 0, 0, -1, 1, 2, -1, 2, -1, 0, 0, 3, -2, 0, -1, -1, 0, 0, 0, 0, -1, 2, 0, 2, -2, 3]
  },
  {
    q: "For national security, I am willing to sacrifice some personal privacy.",
    mbti: [0, -1, -1, 2],
    tags: [-2, 0, 3, 1, -1, 1, 0, -2, 2, -1, 0, 0, 0, 0, -1, -1, 0, -1, 2, -2, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "Privacy rights are inviolable, even in the name of national security.",
    mbti: [0, 1, 1, -2],
    tags: [3, 0, -2, -2, 1, 2, 0, 3, -1, 1, 0, 0, 0, 0, 1, 0, 0, 0, -2, 2, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "We are not qualified to judge other cultures' practices, even if they seem cruel to us.",
    mbti: [-2, 1, -2, -2],
    tags: [1, 1, -1, -2, 1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, -1, 3, -2, 0, 2, 0, 0, 0, 0, 0]
  },
  {
    q: "Certain universal human rights should transcend cultural differences and be enforced.",
    mbti: [1, -1, 2, 2],
    tags: [1, 2, 0, 0, 2, 2, 0, 0, 1, 0, 0, 0, 0, 0, 1, -1, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Worker cooperatives are a fairer form of business organization than traditional companies.",
    mbti: [-1, 1, -2, -1],
    tags: [1, 3, 0, -1, 1, 0, 1, 0, 3, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, -2, 0, -1, 0, 0]
  },
  {
    q: "Profit motive is the core driver of innovation and economic development.",
    mbti: [1, 0, 2, 1],
    tags: [2, 0, 0, -1, 1, 2, -1, 3, -2, 0, 0, 3, -1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 0, 2]
  },
  {
    q: "To avoid conflict, I hide my true thoughts.",
    mbti: [-2, 0, -2, 0],
    tags: [0, 0, 1, 0, -1, -1, 1, -1, 1, -1, 0, 0, 0, -1, 0, 1, 0, 0, 0, -1, 3, -1, 0, 0, 0, 0]
  },
  {
    q: "Complete honesty is the only way to build deep trust.",
    mbti: [2, 0, 2, 1],
    tags: [2, 0, 0, -1, 1, 2, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "I enjoy music that brings immediate sensory pleasure, like pop songs.",
    mbti: [1, -1, -1, -1],
    tags: [1, 0, -1, 0, 0, -1, 2, 1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
  },
  {
    q: "I prefer complex music that requires repeated listening to understand, such as classical or progressive rock.",
    mbti: [-1, 2, 1, 1],
    tags: [0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, -1, 1, 0, 1, 0, 0, 0, 0, 0, 0, -1, 0, 0]
  },
  {
    q: "The primary goal of education should be to cultivate critical thinking and civic awareness.",
    mbti: [0, 2, 1, -1],
    tags: [1, 2, -1, -1, 2, 3, 0, 0, 1, 1, 0, 0, 0, 0, 2, 1, 0, 2, -1, 1, 1, 0, 0, 0, 0, 1]
  },
  {
    q: "Education should focus more on teaching practical skills for finding a good job.",
    mbti: [0, -2, 0, 2],
    tags: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, -1, 3, -1, 0, 0, 0, 0, 0, 1, 2, 0, 1, 0, 1]
  },
  {
    q: "Meditation and mindfulness practices are beneficial for mental health, even without believing in spirituality.",
    mbti: [0, 1, -1, 1],
    tags: [0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0]
  },
  {
    q: "Religion is primarily a tool for controlling people; its positive effects can be replaced by secular methods.",
    mbti: [1, 0, 2, -1],
    tags: [1, 0, -2, -1, 2, 3, -2, 1, 0, 3, -3, 0, -1, 0, -1, 0, -2, 1, -1, 2, 0, 0, 0, 0, 0, 2]
  },
  {
    q: "History is generally linear progress — today is better than yesterday.",
    mbti: [1, 0, 1, 1],
    tags: [1, 1, -1, -1, 3, 2, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 3]
  },
  {
    q: "History is cyclical; civilizations rise and fall without real progress.",
    mbti: [-1, 1, -1, -1],
    tags: [0, 0, 2, 1, -1, 1, -1, -1, 0, 2, 0, -1, 0, -1, -1, 0, 0, 0, 1, -1, 0, -1, -1, -1, 0, -2]
  },
  {
    q: "Stories of individual heroism move me more than stories of collective struggle.",
    mbti: [2, 1, 0, -1],
    tags: [3, 0, -1, -1, 1, 0, 1, 3, -2, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 2, 0, 2, 0, 0, 0, 0]
  },
  {
    q: "Stories of community mutual aid and cooperation warm my heart.",
    mbti: [-1, -1, -1, 0],
    tags: [0, 2, 0, 1, 0, 0, 2, -2, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 2, -2, 0, 0, 0, 0]
  },
  {
    q: "For new work projects, I prefer to take action and iterate rather than plan perfectly before starting.",
    mbti: [1, 0, 0, -3],
    tags: [1, 0, -1, -1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "Impulse buying often leaves me with regret.",
    mbti: [0, 0, 0, -2],
    tags: [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 3, 0, 0]
  },
  {
    q: "Complex systems (like nations or corporations) can be understood and managed through mechanical models.",
    mbti: [0, 0, 2, 1],
    tags: [0, 0, 1, 0, 0, 3, -2, 0, 0, 0, 0, 0, -1, 2, 0, 0, -2, 0, 0, 0, 0, 0, 0, 0, 0, 2]
  }
];

if (typeof window !== 'undefined') {
  window.QUESTIONS_EN_4 = QUESTIONS_EN_4;
}
console.log('✅ questions_en_4.js loaded (50 questions)');