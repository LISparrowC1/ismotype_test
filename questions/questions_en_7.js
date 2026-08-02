// ==========================================
// IsmoType Question Data - English (en) Part 7 (Questions 301-350)
// File: questions/questions_en_7.js
// ==========================================
const QUESTIONS_EN_7 = [
  {
    q: "In team discussions, I prefer to hear everyone's thoughts before sharing my own.",
    mbti: [-2, 0, 0, 1],
    tags: [0, 1, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, -1, 0, 0, 0, 0]
  },
  {
    q: "Even with strangers, I can quickly find common ground.",
    mbti: [3, 0, 0, -1],
    tags: [1, 0, -1, -1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "I prefer savoring the original text in detail rather than reading a book summary.",
    mbti: [0, -2, 0, 2],
    tags: [0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "When learning a new concept, I want to know how it connects to the bigger picture.",
    mbti: [0, 3, 0, -1],
    tags: [0, 0, -1, -1, 2, 2, 0, 0, 0, 0, 0, 0, 2, -1, 2, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "I admire those who can remain objective and make judgments without personal bias.",
    mbti: [0, 0, 3, 1],
    tags: [0, 0, 1, 0, 0, 3, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "When making decisions, I find it hard to ignore emotional memories tied to the matter.",
    mbti: [0, 0, -2, -1],
    tags: [0, 0, 0, 0, 0, -1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Before starting work each day, I spend a few minutes listing my to-dos.",
    mbti: [0, 0, 0, 3],
    tags: [0, 0, 2, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Too much planning only limits my freedom and creativity.",
    mbti: [0, 0, 0, -3],
    tags: [3, 0, -2, -1, 2, -1, 1, 2, 0, 0, 0, 0, 0, -1, 1, 1, 0, 1, -2, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "I often contemplate the meaning of life.",
    mbti: [0, 2, -1, -1],
    tags: [0, 0, -1, -1, 0, 0, 2, 1, 0, 1, 1, 0, 3, -1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "I believe it's better to focus on living each day well than to ponder the meaning of life.",
    mbti: [0, -2, 1, 1],
    tags: [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 3, -1, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0]
  },
  {
    q: "I support lowering the voting age to 16 to allow more young people to participate in politics.",
    mbti: [1, 2, -1, -2],
    tags: [2, 3, -1, -1, 2, 0, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 0, 2, -1, 1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Voting rights should only be given to adults with sufficient understanding of society.",
    mbti: [0, -1, 1, 2],
    tags: [-1, 0, 2, 2, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 1, -1, 1, -1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "If I could decide, I would significantly raise taxes on the wealthy.",
    mbti: [-1, 0, -2, 0],
    tags: [0, 3, 0, -1, 2, 0, 1, -2, 3, 0, 0, -1, 0, 0, 1, 1, 0, 1, 0, 1, 1, -2, -1, -1, 0, 0]
  },
  {
    q: "Low taxes encourage people to work harder and invest, ultimately benefiting all of society.",
    mbti: [1, 0, 2, 1],
    tags: [3, 0, 1, 0, 1, 2, -1, 3, -1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 1]
  },
  {
    q: "I worry that AI development will gradually erode human autonomy.",
    mbti: [-1, 1, -1, 1],
    tags: [0, 0, 1, 0, -1, 1, 2, 0, 0, 2, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, -1, -1, -1, 0, -3]
  },
  {
    q: "I think fear of AI mostly comes from sci-fi movies; real AI will make life better.",
    mbti: [1, 0, 2, 0],
    tags: [2, 1, -1, -1, 2, 3, -1, 1, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 3]
  },
  {
    q: "I'm willing to change my eating habits to reduce my carbon footprint.",
    mbti: [-1, 1, -2, 1],
    tags: [0, 2, 1, 0, 2, 0, 2, 0, 2, 0, 0, -1, 0, 0, 1, 1, 0, 0, 0, 0, 2, -1, -1, -1, 3, 0]
  },
  {
    q: "Individual behavioral changes have little impact on global environmental issues — policy is what matters.",
    mbti: [0, -1, 1, 1],
    tags: [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1]
  },
  {
    q: "I believe street art and graffiti are urban culture worth preserving.",
    mbti: [1, 2, -1, -2],
    tags: [3, 1, -2, -2, 2, -1, 2, 2, 0, 1, 0, 0, 0, -1, 1, 1, -1, 2, -2, 2, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Public spaces should be kept clean; graffiti damages the city's appearance.",
    mbti: [0, -2, 0, 2],
    tags: [0, 0, 2, 1, -1, 1, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 1, -1, 1, -1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "If lying could prevent a massive disaster, then lying would be the right thing to do.",
    mbti: [0, 1, 2, -1],
    tags: [0, 1, -1, -1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Honesty is always the best policy, no matter the situation.",
    mbti: [0, -1, 0, 2],
    tags: [0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, -2, 0, 0, 2, -1, 0, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "We should significantly increase foreign aid budgets to help poor countries develop.",
    mbti: [-2, 1, -2, -1],
    tags: [1, 3, -1, -1, 2, 0, 2, 0, 3, 0, 0, -1, 0, 0, 2, 2, 0, 2, -1, 0, 2, -2, -1, -1, 0, 0]
  },
  {
    q: "Foreign aid is often wasted; resources are better spent on domestic issues.",
    mbti: [1, -1, 1, 1],
    tags: [1, 0, 2, 1, -1, 1, 0, 1, 1, 2, 0, 0, 0, 0, -1, -1, 1, -1, 1, 0, 0, 1, 0, 0, 0, 0]
  },
  {
    q: "I get tired of routine and repetition — I'm always looking for novelty.",
    mbti: [2, 2, -1, -3],
    tags: [3, 0, -2, -2, 3, 0, 1, 2, -1, 1, -1, 0, 0, -1, 1, 1, -1, 2, -2, 1, -1, 0, -1, 1, 0, 1]
  },
  {
    q: "An orderly and routine life makes me feel secure and productive.",
    mbti: [-1, -2, 1, 3],
    tags: [0, 0, 3, 2, -2, 1, -1, 0, 0, -1, 0, 0, 0, 2, -1, 0, 1, -1, 2, -2, 1, 0, 1, 0, 0, 0]
  },
  {
    q: "I sense a transcendent presence in the grandeur of nature or the cosmos.",
    mbti: [-1, 2, -2, -1],
    tags: [0, 0, -1, 0, 0, -1, 2, 0, 0, 0, 2, -1, 3, 0, 1, 1, 0, 0, 0, 0, 2, -1, 0, -1, 2, -1]
  },
  {
    q: "All spiritual experiences can be explained by psychology and neuroscience.",
    mbti: [0, 0, 3, 1],
    tags: [0, 0, 0, 0, 0, 3, -2, 0, 0, 1, -2, 1, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
  },
  {
    q: "Schools should spend more time teaching critical thinking rather than rote memorization.",
    mbti: [0, 2, 1, -1],
    tags: [1, 1, -1, -1, 2, 3, 0, 0, 0, 3, 0, 0, 0, 0, 2, 1, 0, 2, -1, 1, 1, 0, 0, 0, 0, 1]
  },
  {
    q: "Basic knowledge must be mastered through repeated practice — it's the foundation for further innovation.",
    mbti: [0, -2, 0, 2],
    tags: [0, 0, 2, 1, 0, 1, -1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "To prevent terrorism, stricter surveillance may be necessary.",
    mbti: [0, -1, 0, 2],
    tags: [-2, 0, 3, 1, -1, 1, -1, -2, 1, -1, 0, 0, 0, 0, -1, -1, 0, -1, 3, -2, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "A surveillance society is an affront to freedom and should not be compromised even for security.",
    mbti: [0, 1, 1, -2],
    tags: [3, 0, -2, -2, 1, 2, 0, 3, -1, 1, 0, 0, 0, 0, 1, 0, 0, 0, -2, 2, 0, 0, 0, 0, 0, -1]
  },
  {
    q: "I feel like I am the creator of my own destiny.",
    mbti: [2, 1, 1, -1],
    tags: [3, 0, -2, -2, 2, 1, 2, 3, -1, 0, -1, 0, 2, -1, 2, 0, 0, 0, -2, 2, 0, 2, 0, 0, 0, 0]
  },
  {
    q: "There are too many factors beyond our control in life — we're just going with the flow.",
    mbti: [-2, 0, -1, 0],
    tags: [-1, 0, 2, 0, -1, 0, 0, -2, 1, 0, 0, 1, -1, 0, -2, -1, 0, -1, 1, -2, 1, -1, 0, 0, 0, -1]
  },
  {
    q: "I'm often curious about the essence of things, even when it seems obvious to others.",
    mbti: [0, 2, 0, -1],
    tags: [0, 0, -1, -1, 1, 2, 0, 0, 0, 3, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "I believe most answers to things can be found in books or from experts.",
    mbti: [0, -2, 1, 1],
    tags: [0, 0, 1, 2, -1, 1, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, -1, 1, -1, 1, 0, 0, 0, 0, 0]
  },
  {
    q: "Material success is an important measure of life's value for me.",
    mbti: [1, -2, 1, 2],
    tags: [1, 0, 0, 0, 0, 0, -1, 3, -1, 0, 0, 3, -2, 0, -2, -1, -1, -1, 0, 0, 0, 3, 0, 2, 0, 1]
  },
  {
    q: "I often feel a nameless emptiness inside.",
    mbti: [-1, 1, -1, -1],
    tags: [0, 0, -1, -1, 0, -1, 2, 0, 0, 2, -1, -1, 1, -2, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1]
  },
  {
    q: "I learn better through practice and experience than through theoretical discussion.",
    mbti: [0, -2, 0, 0],
    tags: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  },
  {
    q: "Over-analyzing ruins the natural beauty of human relationships.",
    mbti: [0, 0, -3, -1],
    tags: [0, 0, -1, 0, 0, -2, 3, 0, 0, 0, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 0, -1]
  },
  {
    q: "I'm willing to endure years of hard training for a long-term goal.",
    mbti: [-1, 0, 2, 3],
    tags: [1, 0, 2, 0, 1, 2, 1, 2, 0, 0, 0, 0, 1, 0, 2, 0, 2, 0, 1, 0, 1, 1, 1, -1, 0, 0]
  },
  {
    q: "I don't like setting long-term goals; I prefer living in the moment.",
    mbti: [1, 0, -1, -3],
    tags: [2, 0, -1, -1, 1, -1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, 0, 1, -1, 0, 1, 0, 0]
  },
  {
    q: "The value of art is entirely determined by the viewer's subjective experience.",
    mbti: [0, 2, -2, -2],
    tags: [1, 0, -2, -1, 1, -1, 2, 1, 0, 1, 0, 0, 0, -1, 0, 2, -1, 2, -1, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "There are objective standards for what makes a good piece of art.",
    mbti: [0, -1, 2, 1],
    tags: [0, 0, 1, 1, 0, 2, -1, 0, 0, -1, 0, 0, 0, 1, 0, -1, 2, -1, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    q: "Traditional crafts still hold irreplaceable spiritual value in modern society.",
    mbti: [-1, 1, -1, 1],
    tags: [0, 0, 2, 2, -1, -1, 2, -1, 1, 0, 0, -1, 2, -1, 1, 1, 1, 0, 0, -1, 1, -1, 1, -2, 0, -2]
  },
  {
    q: "Mass-produced goods made by efficient machines are more practical than handmade crafts.",
    mbti: [1, -1, 2, 0],
    tags: [2, 0, 0, -1, 2, 2, -1, 1, 0, 0, 0, 2, -1, 3, -1, 0, -1, -1, 0, 0, 0, 1, 1, 2, 0, 2]
  }
];

if (typeof window !== 'undefined') {
  window.QUESTIONS_EN_7 = QUESTIONS_EN_7;
}
console.log('✅ questions_en_7.js loaded (50 questions)');