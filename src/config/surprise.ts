// All personal copy, theme colors, and choreography live here.
// Leave girlfriendName empty to use the affectionate greeting below.
export const surprise = {
  title: "A Little Sunshine For You 💜",
  girlfriendName: "",
  from: "Paulo",
  welcome: {
    greeting: "Hi love! 💜",
    headline: ["A little sunshine,", "just for you."],
    message: "I made a little something special just for you.",
    button: "Open Your Surprise 💜",
    footnote: "A tiny surprise. A whole lot of love.",
  },
  scene: {
    heading: ["Some flowers for", "my favorite person"],
    subtitle: "A little sunshine, wrapped in all my love.",
    growing: "Growing a little happiness for you…",
    ready: "Every little bloom, a little reminder of my love.",
    letterButton: "Open My Letter 💌",
  },
  letter: {
    eyebrow: "A LITTLE NOTE, JUST FOR YOU",
    salutation: "My love,",
    paragraphs: [
      "These flowers may only be virtual, but the love behind them is real.",
      "I made this kind of flowers because I wanted to give you something special. Even though it's just a virtual bouquet, I hope these flowers make you smile and remind you how much you mean to me.",
      "Thank you for making my days brighter and for being someone so wonderful in my life.",
      "I love you so much. 💜",
    ],
    closing: "Love always,",
  },
  closingMessage: "Made with love, for my favorite person.",
  theme: {
    lavender: "#E6E6FA",
    lilac: "#D8B4F8",
    violet: "#C9A0DC",
    accent: "#7C3AED",
    ink: "#4B3267",
    cream: "#FFF9F0",
    green: "#A8CFA5",
  },
  timing: {
    // Scales the complete SVG choreography. 1 = about 7 seconds.
    growthSpeed: 1,
    transition: 0.45,
    wrapper: 0.15,
    stemDuration: 1.15,
    petalDuration: 1.25,
    teddy: 3.5,
    popcorn: 4.1,
    envelopeFold: 0.55,
    paperLift: 0.5,
  },
} as const;
