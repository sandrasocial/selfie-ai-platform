// Sample data for SSELFIE platform development
// Use this instead of database during development

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  subscription_status: 'free' | 'starter' | 'branded' | 'vip'
  onboarding_stage: string
  confidence_score: number
  total_posts: number
  followers_count: number
}

export interface VisionBoardItem {
  id: string
  user_id: string
  type: 'image' | 'quote' | 'stats' | 'personal-quote'
  content: string
  image?: string
  author?: string
  number?: string
  label?: string
  sublabel?: string
  position: number
}

export interface ContentPost {
  id: string
  user_id: string
  title: string
  description: string
  image_url: string
  platform: 'instagram' | 'linkedin' | 'twitter'
  scheduled_for: string
  status: 'draft' | 'scheduled' | 'published'
  engagement_prediction: number
  hashtag_set: string
}

export interface UserStats {
  user_id: string
  new_followers_this_month: number
  confidence_score: number
  posts_this_month: number
  monthly_growth: string
  total_posts: number
  avg_engagement: number
  best_performing_post: string
}

// Sample Users
export const sampleUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    full_name: 'Sarah Johnson',
    avatar_url: '/images/users/sarah.jpg',
    created_at: '2025-06-01T10:00:00Z',
    subscription_status: 'branded',
    onboarding_stage: 'completed',
    confidence_score: 89,
    total_posts: 47,
    followers_count: 3200,
  },
  {
    id: '2',
    email: 'emma@example.com',
    full_name: 'Emma Chen',
    avatar_url: '/images/users/emma.jpg',
    created_at: '2025-06-15T14:30:00Z',
    subscription_status: 'starter',
    onboarding_stage: 'vision_board',
    confidence_score: 72,
    total_posts: 12,
    followers_count: 890,
  },
]

// Sample Vision Board Items
export const sampleVisionBoard: VisionBoardItem[] = [
  {
    id: '1',
    user_id: '1',
    type: 'image',
    content: 'CEO Energy',
    image: '/images/vision/ceo-energy.jpg',
    position: 1,
  },
  {
    id: '2',
    user_id: '1',
    type: 'quote',
    content: 'She remembered who she was and the game changed',
    author: 'Lalah Delia',
    position: 2,
  },
  {
    id: '3',
    user_id: '1',
    type: 'image',
    content: 'Keynote Speaker',
    image: '/images/vision/keynote-speaker.jpg',
    position: 3,
  },
  {
    id: '4',
    user_id: '1',
    type: 'stats',
    content: '10K Community Members',
    number: '10K',
    label: 'Community Members',
    sublabel: 'BY DECEMBER 2025',
    position: 4,
  },
  {
    id: '5',
    user_id: '1',
    type: 'personal-quote',
    content: 'I am magnetic to the right opportunities',
    position: 5,
  },
  {
    id: '6',
    user_id: '1',
    type: 'image',
    content: 'Work From Anywhere',
    image: '/images/vision/work-anywhere.jpg',
    position: 6,
  },
]

// Sample Content Posts
export const sampleContentPosts: ContentPost[] = [
  {
    id: '1',
    user_id: '1',
    title: 'The Power of Quiet Confidence',
    description: 'I used to think being seen meant being loud. Then I realized the most magnetic people in the room are often the ones who speak with intention, not volume. Here\'s what changed when I stopped trying to prove myself...',
    image_url: '/images/content/quiet-confidence.jpg',
    platform: 'instagram',
    scheduled_for: '2025-06-25T10:30:00Z',
    status: 'draft',
    engagement_prediction: 8.2,
    hashtag_set: 'Authority Builder',
  },
  {
    id: '2',
    user_id: '1',
    title: 'Behind the Scenes: Building Authentic Connections',
    description: 'People always ask me how I built such an engaged community. The secret isn\'t growth hacks or viral content. It\'s this one thing that most creators skip...',
    image_url: '/images/content/authentic-connections.jpg',
    platform: 'linkedin',
    scheduled_for: '2025-06-26T09:00:00Z',
    status: 'scheduled',
    engagement_prediction: 7.8,
    hashtag_set: 'Community Builder',
  },
]

// Sample User Stats
export const sampleUserStats: UserStats[] = [
  {
    user_id: '1',
    new_followers_this_month: 847,
    confidence_score: 89,
    posts_this_month: 47,
    monthly_growth: '3x',
    total_posts: 156,
    avg_engagement: 8.4,
    best_performing_post: 'The Power of Quiet Confidence',
  },
  {
    user_id: '2',
    new_followers_this_month: 234,
    confidence_score: 72,
    posts_this_month: 12,
    monthly_growth: '2x',
    total_posts: 28,
    avg_engagement: 6.2,
    best_performing_post: 'Finding My Voice After 30',
  },
]

// Sample Messages from Sandra AI
export const sampleSandraMessages = [
  "You've posted 47 times this month. That's 3x more than last month! Your consistency is paying off.",
  "I love how you're showing up authentically. That vulnerability in yesterday's post? That's what builds real connections.",
  "Your confidence score went up 12 points this week. You're literally becoming the woman you envisioned.",
  "Real talk: Your content is getting better every single day. Keep trusting the process.",
]

// Sample Daily Focus Items
export const sampleDailyFocus = {
  title: "Today's Focus",
  description: "Three strategic posts scheduled. Your 'expertise without ego' series continues.",
  action: "Review Content",
  posts_ready: 3,
  optimal_time: "10:30 AM",
}

// Sample Milestones
export const sampleMilestones = [
  { type: 'first_post', message: 'You did it! Your first post is live!', achieved: true },
  { type: 'week_streak', message: 'One week of consistency!', achieved: true },
  { type: '1k_followers', message: 'You just hit 1K followers!', achieved: true },
  { type: '30_days', message: '30 days of transformation!', achieved: false },
  { type: '5k_followers', message: 'Welcome to the 5K club!', achieved: false },
]

// Helper function to get current user (for development)
export const getCurrentUser = (): User => sampleUsers[0]

// Helper function to get user stats
export const getUserStats = (userId: string): UserStats | undefined => 
  sampleUserStats.find(stats => stats.user_id === userId)

// Helper function to get user vision board
export const getUserVisionBoard = (userId: string): VisionBoardItem[] => 
  sampleVisionBoard.filter(item => item.user_id === userId)

// Helper function to get user content
export const getUserContent = (userId: string): ContentPost[] => 
  sampleContentPosts.filter(post => post.user_id === userId)

// Helper function for random Sandra message
export const getRandomSandraMessage = (): string => 
  sampleSandraMessages[Math.floor(Math.random() * sampleSandraMessages.length)]

// Sample product pricing
export const samplePricing = {
  free: {
    name: 'Free Guide',
    price: 0,
    features: ['Selfie basics guide', 'Basic lighting tips', 'Angle fundamentals'],
  },
  starter: {
    name: 'Selfie Starter Kit',
    price: 67,
    features: ['10 essential poses', 'Lighting secrets', 'Preset pack', 'Caption templates', '30-day challenge'],
  },
  branded: {
    name: 'Branded By Selfie',
    price: 397,
    features: ['90-day guided journey', 'Weekly Sandra AI coaching', 'Advanced Future Self features', 'Brand voice development', 'Content strategy mastery', 'Community access'],
  },
  vip: {
    name: 'VIP Program',
    price: 'Application Only',
    features: ['1-on-1 with Sandra', 'Custom AI model training', 'Done-with-you implementation', 'Luxury retreat invitation'],
  },
}
