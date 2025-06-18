
// AI-Powered 30-Day Content Generation System
export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  reelPrompt: string;
  captionTemplate: string;
  storySlides: string[]; // Array of 6 slides
  signature: string;
  hashtags: string[];
  seoKeywords: string[];
  coverImage: string;
  isPro: boolean;
  day: number;
  tags: string[];
  cta?: string;
}

export interface UserProfile {
  name?: string;
  niche: string;
  audience: string;
  story: string;
  offer: string;
  goals: string;
}

export interface GeneratedContent {
  day: number;
  title: string;
  reel_prompt: string;
  caption_template: string;
  signature: string;
  hashtags: string[];
  seo_keywords: string[];
  story_slides: string[];
  cta: string;
}

// Complete 90-Day Content Journey - Sandra's authentic framework
const dayTitles = [
  // MONTH 1: Foundation & Trust Building (Days 1-30)
  { title: "Introduce Yourself with Power", description: "Share the truth of where you are and what you're building. Trust starts here." },
  { title: "Your Why Story", description: "Let your audience feel the heart behind your mission. This is what moves people." },
  { title: "Before & After Transformation", description: "Show your emotional and visual glow-up. Real results build real connection." },
  { title: "The Moment It Changed", description: "Share the shift—the breakdown or breakthrough that made you say 'never again.'" },
  { title: "Your Old Identity", description: "What version of you did you outgrow? Let them see the woman you used to be." },
  { title: "Your Future Self", description: "Speak from your higher self. Paint the vision. Embody it now." },
  { title: "Raw Truth Confession", description: "Drop the highlight reel. Share what's been hard—and how you're still standing." },
  { title: "Day in the Life", description: "Take us behind the scenes. Let them feel your energy, your rituals, your rebuild." },
  { title: "Teach One Small Thing", description: "Share one mindset shift, selfie tip, or brand lesson that changed everything for you." },
  { title: "You Wouldn't Believe...", description: "Hook with a jaw-dropping truth from your journey. Then tie it back to your mission." },
  { title: "From Surviving to Showing Up", description: "Talk about how you went from hiding to building your brand in public." },
  { title: "Your Rock Bottom Moment", description: "The most relatable post you'll ever share. Keep it raw. Keep it human." },
  { title: "What I Needed to Hear", description: "Speak to the old you. What would have saved her months or years?" },
  { title: "Show the Receipts", description: "Drop the DMs, comments, or real results. Prove your process works." },
  { title: "She Asked Me...", description: "Share a question from your audience or community that inspired a powerful answer." },
  { title: "I Used to Think...", description: "Break a belief. Share the mindset you had to unlearn to grow." },
  { title: "Behind the Selfie", description: "Show the story behind a post, outfit, launch, or selfie moment." },
  { title: "What I'd Do Differently", description: "Be real about the lessons. Tell them what you'd change if you had to start again." },
  { title: "What No One Talks About", description: "Break the silence. Share something that's rarely said in your space." },
  { title: "My Healing Toolkit", description: "Share your go-to tools for healing, confidence, or creativity." },
  { title: "The 'No One Showed Me' Post", description: "Teach something you had to figure out alone so no one else has to." },
  { title: "Your Boldest Belief", description: "Say the thing. Own your power. Let them feel your conviction." },
  { title: "My New Life Looks Like...", description: "Get dreamy. Talk about what your life feels like now vs. before." },
  { title: "The Fear I Had to Face", description: "Talk about the moment you had to get brave. The turning point." },
  { title: "Things I Let Go Of", description: "Who did you have to stop being to become who you are now?" },
  { title: "What They Don't See", description: "The hours, the healing, the invisible work. Make it visible." },
  { title: "The Client Win", description: "Share a real transformation story that shows the power of what you teach." },
  { title: "My Favorite Part", description: "Show the joy. The connection. The reason you keep showing up." },
  { title: "If You're Still Here...", description: "Speak directly to your silent watchers. Invite them to take the next step." },
  { title: "Start Here", description: "Wrap it up by guiding your audience. Tell them exactly where to begin." },

  // MONTH 2: Consistency & Authority Building (Days 31-60)
  { title: "Level Up Your Content", description: "Month 2 mindset: consistency builds authority. Show them your evolution." },
  { title: "Content That Converts", description: "Share your top-performing content strategies and why they work." },
  { title: "Behind My Brand", description: "Show the strategy behind your personal brand development." },
  { title: "Mindset Shifts That Changed Everything", description: "The mental game changes that leveled up your business." },
  { title: "Building in Public", description: "Document your business growth journey in real-time." },
  { title: "The Systems That Save Me", description: "Share your content creation and business systems." },
  { title: "Authority Building 101", description: "How you're establishing yourself as the go-to expert." },
  { title: "Consistency Over Perfection", description: "Why showing up matters more than perfect content." },
  { title: "My Content Strategy", description: "Break down your content pillars and posting strategy." },
  { title: "Growing My Audience", description: "Authentic strategies for sustainable audience growth." },
  { title: "Overcoming Comparison", description: "How to stay in your lane while others seem to 'winning'." },
  { title: "The Power of Niching Down", description: "Why specificity creates more attraction than broad appeal." },
  { title: "My Signature Style", description: "How you developed your unique voice and visual brand." },
  { title: "Scaling Without Burnout", description: "Sustainable growth strategies that protect your energy." },
  { title: "Community Over Competition", description: "Building genuine connections in your industry." },
  { title: "Investment Mindset", description: "When and how to invest in your business growth." },
  { title: "The Business Behind the Brand", description: "Show the real work that goes into building a business." },
  { title: "Pricing Your Worth", description: "How you learned to charge what you're worth." },
  { title: "Creating Multiple Streams", description: "Diversifying your income beyond just one offer." },
  { title: "The Long Game", description: "Why sustainable growth beats quick wins every time." },
  { title: "My Support System", description: "The people and resources that keep you going." },
  { title: "Learning from Failures", description: "Your biggest business mistakes and what they taught you." },
  { title: "Time Management Reality", description: "How you really manage your time as an entrepreneur." },
  { title: "Investment vs. Expense", description: "Teaching your audience to think like investors." },
  { title: "Building Systems", description: "The backend work that makes everything else possible." },
  { title: "Your Ideal Day", description: "What your perfect workday looks like now." },
  { title: "Growth Mindset", description: "How you approach challenges and setbacks." },
  { title: "The Next Level", description: "What you're working toward in the next phase." },
  { title: "Celebrating Wins", description: "Why acknowledging progress matters for momentum." },
  { title: "Month 2 Reflection", description: "What you've learned and how you've grown." },

  // MONTH 3: Scaling & Mastery (Days 61-90)
  { title: "Scale Your Impact", description: "Month 3 focus: scaling your message and maximizing your impact." },
  { title: "Authority Content", description: "Creating content that positions you as the industry expert." },
  { title: "Strategic Partnerships", description: "How collaboration multiplies your reach and impact." },
  { title: "Premium Positioning", description: "Elevating your brand to attract high-value clients." },
  { title: "Thought Leadership", description: "Sharing opinions and insights that shape your industry." },
  { title: "Scaling Your Offers", description: "Moving from 1:1 to 1:many without losing quality." },
  { title: "Media & PR Strategy", description: "Getting featured and amplifying your message." },
  { title: "Speaking Your Truth", description: "Using your platform to advocate for what matters." },
  { title: "Industry Disruption", description: "Challenging the status quo in your space." },
  { title: "Mastery Mindset", description: "The shift from learning to teaching to mastering." },
  { title: "Creating Movement", description: "Building a community around your mission." },
  { title: "Legacy Building", description: "What you want to be remembered for." },
  { title: "Scaling Systems", description: "The infrastructure needed for sustainable growth." },
  { title: "Team Building", description: "When and how to start building your support team." },
  { title: "Global Impact", description: "Thinking beyond your immediate audience." },
  { title: "Innovation Strategy", description: "Staying ahead of trends and creating new solutions." },
  { title: "Mentorship Role", description: "Becoming the guide for others on similar journeys." },
  { title: "Platform Power", description: "Using your influence responsibly and effectively." },
  { title: "Market Leadership", description: "Setting trends instead of following them." },
  { title: "Sustainable Success", description: "Building something that lasts beyond just you." },
  { title: "Vision Casting", description: "Painting the picture of the future you're creating." },
  { title: "Impact Measurement", description: "How you track and celebrate your real impact." },
  { title: "Industry Recognition", description: "Being acknowledged as a leader in your space." },
  { title: "Next Level Strategies", description: "Advanced tactics for established businesses." },
  { title: "Giving Back", description: "How success creates responsibility to lift others." },
  { title: "Future Focus", description: "Planning for the next phase of growth." },
  { title: "Mastery Moment", description: "Recognizing how far you've come in your expertise." },
  { title: "Community Impact", description: "The ripple effect of your work on others." },
  { title: "The Vision Realized", description: "Living the life and business you dreamed of." },
  { title: "Your Legacy", description: "The lasting impact you want to make on the world." }
];

export const contentDays = dayTitles.map((dayData, index) => ({
  day: index + 1,
  title: `Day ${index + 1}: ${dayData.title}`,
  description: dayData.description,
  coverImage: `${(index % 30) + 1}.png`, // Cycle through 1-30 images for all 90 days
  isPro: index >= 1, // Day 1 free, Days 2-90 require PRO
  phase: index < 30 ? 1 : index < 60 ? 2 : 3 // Add phase indicator for UI
}));

// Template Registry - This will be populated with your Trello templates
export class TemplateRegistry {
  private static templates: Map<number, any> = new Map();
  
  static loadTemplate(day: number, templateData: any) {
    this.templates.set(day, templateData);
  }
  
  static getTemplate(day: number) {
    return this.templates.get(day);
  }
  
  static getAllTemplates() {
    return Array.from(this.templates.values());
  }
  
  static hasTemplate(day: number) {
    return this.templates.has(day);
  }
  
  // Method to personalize templates with user data
  static personalizeTemplate(templateText: string, userProfile: UserProfile): string {
    if (!templateText) return '';
    
    let personalized = templateText;
    
    // Replace common placeholders with user data
    const replacements: Record<string, string> = {
      '[your handle]': `@${userProfile.name?.toLowerCase() || 'yourhandle'}`,
      '[Your Handle]': `@${userProfile.name?.toLowerCase() || 'yourhandle'}`,
      '(your niche)': userProfile.niche || 'your niche',
      '(Your Niche)': userProfile.niche || 'your niche',
      '[your niche]': userProfile.niche || 'your niche',
      '[Your Niche]': userProfile.niche || 'your niche',
      '(your audience)': userProfile.audience || 'your audience',
      '(Your Audience)': userProfile.audience || 'your audience',
      '[your audience]': userProfile.audience || 'your audience',
      '[Your Audience]': userProfile.audience || 'your audience',
      '(your offer)': userProfile.offer || 'your offer',
      '(Your Offer)': userProfile.offer || 'your offer',
      '[your offer]': userProfile.offer || 'your offer',
      '[Your Offer]': userProfile.offer || 'your offer',
      '(your story)': userProfile.story || 'your story',
      '[your story]': userProfile.story || 'your story',
      '[Your Story]': userProfile.story || 'your story',
      '(your goals)': userProfile.goals || 'your goals',
      '[your goals]': userProfile.goals || 'your goals',
      '[Your Goals]': userProfile.goals || 'your goals',
      '[your name]': userProfile.name || 'your name',
      '[Your Name]': userProfile.name || 'your name',
      '(your name)': userProfile.name || 'your name',
      '(Your Name)': userProfile.name || 'your name'
    };
    
    // Apply all replacements
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      personalized = personalized.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
    });
    
    return personalized;
  }
}

// Legacy template for reference (will be replaced by AI generation)
export const templates: Template[] = [
  {
    id: "day-1",
    title: "Introduce Yourself + Build Trust",
    category: "Introduction", 
    description: "Create an authentic intro post that helps your audience see you as a real, relatable human — not just a brand",
    reelPrompt: "Create an intro reel where you show up as YOU. Share what you care about, what brought you here, and why your work matters to you. Let people connect to your energy.\n\nPrompt: \"Here's who I am, why I started, and what I'm here to help you with.\"\n\nUse simple footage (B-roll, talking head, voiceover) with room for text overlays.",
    captionTemplate: `Save this post if you've ever felt like you're *meant for more* 👇🏼

A while ago, I knew something had to change.  
I was tired of [insert struggle].  
But I kept telling myself [insert excuse].

Then one day, everything shifted.  
I realized I didn't want to keep playing small.  
So I took the first step — and everything started to change.

Now I'm here, sharing what I've learned.  
Helping others who are where I used to be.

If you're ready to start too… you don't have to wait.

💬 Comment "READY" and I'll send you the first step that helped me.`,
    storySlides: [
      "Welcome! So grateful to have you here 🖤\nLet's kick things off with a little intro…",
      "Because I [share a few steps you took to get where you are now].\n👇🏼 Tap to see the story.",
      "My journey looked like this:\n\n[date/step] — [emotion/struggle]\n\n[date/step] — [breakthrough]\nYou're not alone if you've felt this way.",
      "🎥 Share your intro reel here\nText overlay: \"Watch this to get to know me\"",
      "I started by just [insert simple step]\nNow I help others do the same.\nMy [insert offer or freebie] is linked in bio 💋",
      "Getting started can be scary — I get it.\n🫶🏼 If you've got questions, ask them here 👇🏼\n(question box)"
    ],
    signature: "Follow @yourhandle if you're ready to stop shrinking and start showing up as your most magnetic self — in life and online.",
    hashtags: ["#selfgrowth", "#onlinebusiness", "#authenticmarketing", "#selfexpression", "#creativeentrepreneur", "#digitalcreator", "#magneticmarketing"],
    seoKeywords: ["starting an online business", "how to build a brand from scratch", "creative women in business", "storytelling on social media", "passion to purpose journey"],
    coverImage: "1.png",
    isPro: false,
    day: 1,
    tags: ["authentic", "introduction", "trust building", "vulnerability"],
    cta: "DM me 'READY' to get started"
  }
];

export const templateCategories = [
  "All Templates",
  "Introduction", 
  "Education",
  "Problem Solving",
  "Strategy",
  "Engagement",
  "Stories",
  "Progress"
];

export const getTemplatesByCategory = (category: string) => {
  if (category === "All Templates") return templates;
  return templates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return templates.find(template => template.id === id);
};
