'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Download, 
  MessageSquare, 
  X,
  ChevronDown,
  ChevronUp,
  Star,
  BookOpen,
  Palette,
  Camera,
  Lightbulb,
  Heart,
  Eye,
  Users,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Coffee,
  Lock
} from 'lucide-react'

// Complete course data structure - Fully migrated from client_backup
const COURSE_MODULES = [
  {
    id: 'module-1',
    title: 'Your Brand, Your Power',
    subtitle: 'Let\'s fix your selfie game once and for all',
    description: 'Okay, real talk - your selfies ARE your marketing. Let me show you why your face is literally your strongest business tool.',
    duration: '8 min',
    order: 1,
    lessons: [
      {
        id: 'brand-power',
        title: 'Your Brand, Your Power',
        duration: '8 min',
        videoUrl: '/videos/starter-kit/module-1-brand-power.mp4',
        description: 'The foundation stuff - but make it fun. You\'ll actually want to show up after this.',
        order: 1
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Edit Like a Pro (Even on iPhone)',
    subtitle: 'Master the art of selfie editing',
    description: 'You know how some people just look effortlessly good in photos? Yeah, they\'re using these tricks. Time to level up.',
    duration: '20 min',
    order: 2,
    lessons: [
      {
        id: 'presets',
        title: 'Applying Your Presets',
        duration: '12 min',
        videoUrl: '/videos/starter-kit/module-2-presets.mp4',
        description: 'Presets are like Instagram filters but way better. I\'ll show you my exact process.',
        order: 1
      },
      {
        id: 'iphone-edit',
        title: 'iPhone Quick Edit',
        duration: '8 min',
        videoUrl: '/videos/starter-kit/module-2-iphone.mp4',
        description: 'No fancy apps needed. Your phone can already do more than you think.',
        order: 2
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Add Mood Without Losing the Real You',
    subtitle: 'Smart edits with apps',
    description: 'This is where we get a little fancy. Editorial vibes but you still look like... well, you.',
    duration: '25 min',
    order: 3,
    lessons: [
      {
        id: 'hypic',
        title: 'Editorial Edge with Hypic',
        duration: '10 min',
        videoUrl: '/videos/starter-kit/module-3-hypic.mp4',
        description: 'Hypic is my secret weapon for that magazine-y look. Super easy once you know how.',
        order: 1
      },
      {
        id: 'capcut',
        title: 'Luxe Video with CapCut',
        duration: '15 min',
        videoUrl: '/videos/starter-kit/module-3-capcut.mp4',
        description: 'Turn your selfies into those satisfying video posts everyone saves.',
        order: 2
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Shoot Solo, Stay in Flow',
    subtitle: 'Hands-free like a CEO',
    description: 'No photographer? No problem. You can literally talk to your phone and it listens. Game changer.',
    duration: '8 min',
    order: 4,
    lessons: [
      {
        id: 'hands-free',
        title: 'Voice & Gesture Control',
        duration: '8 min',
        videoUrl: '/videos/starter-kit/module-4-hands-free.mp4',
        description: 'The tricks that make solo shooting actually fun instead of awkward.',
        order: 1
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Design Like a CEO™',
    subtitle: 'Brand aesthetic builder',
    description: 'This is where your feed starts looking intentional instead of random. Your aesthetic = your energy.',
    duration: '20 min',
    order: 5,
    lessons: [
      {
        id: 'aesthetic',
        title: 'Your Visual Strategy',
        duration: '20 min',
        videoUrl: '/videos/starter-kit/module-5-aesthetic.mp4',
        description: 'How to make your whole vibe feel cohesive without being boring.',
        order: 1
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Write Like a Vibe',
    subtitle: 'Captions that convert',
    description: 'Captions that actually make people stop scrolling. Not corporate, not cringe - just you, but strategic.',
    duration: '15 min',
    order: 6,
    lessons: [
      {
        id: 'captions',
        title: 'Words That Connect',
        duration: '15 min',
        videoUrl: '/videos/starter-kit/module-6-captions.mp4',
        description: 'Write captions that feel like texting your best friend, but with purpose.',
        order: 1
      }
    ]
  }
]

// Aesthetic Collections - Full implementation from client_backup
const AESTHETIC_COLLECTIONS = [
  { 
    id: 'pink', 
    name: 'PINK', 
    mood: 'Feminine & Playful',
    description: 'Soft, romantic tones that exude confidence and femininity',
    images: [
      'https://i.postimg.cc/QtnSw23T/1.png', 
      'https://i.postimg.cc/c1t4jf7K/102.png', 
      'https://i.postimg.cc/CKtpH6Qc/117.png', 
      'https://i.postimg.cc/SKnwsfxC/126.png', 
      'https://i.postimg.cc/bwwXXhX6/125.png', 
      'https://i.postimg.cc/wjGGSRQv/134.png'
    ] 
  },
  { 
    id: 'cream', 
    name: 'CREAM', 
    mood: 'Timeless & Elegant',
    description: 'Warm, luxurious tones that speak to sophistication',
    images: [
      'https://i.postimg.cc/ryRY7Nht/10.png', 
      'https://i.postimg.cc/zvWNBZ8s/110.png', 
      'https://i.postimg.cc/t4zXWjWy/105.png', 
      'https://i.postimg.cc/Dfs31h3D/121.png', 
      'https://i.postimg.cc/YCRXQnST/15.png', 
      'https://i.postimg.cc/s2t02Bx2/137.png'
    ] 
  },
  { 
    id: 'beige', 
    name: 'BEIGE', 
    mood: 'Grounded & Natural',
    description: 'Earthy, authentic tones that feel approachable and warm',
    images: [
      'https://i.postimg.cc/VNCRLn6H/1.png', 
      'https://i.postimg.cc/WbY6GXqH/10.png', 
      'https://i.postimg.cc/d1QLSczm/34.png', 
      'https://i.postimg.cc/W3skLkJZ/24.png', 
      'https://i.postimg.cc/QMhtHrxG/42.png', 
      'https://i.postimg.cc/WzHFkYYm/25.png'
    ] 
  },
  { 
    id: 'coastal', 
    name: 'COASTAL', 
    mood: 'Fresh & Serene',
    description: 'Breezy, calming tones inspired by ocean and sky',
    images: [
      'https://i.postimg.cc/tC1JZ53k/103.png', 
      'https://i.postimg.cc/Zqj4DBP0/119.png', 
      'https://i.postimg.cc/wMn6cCXV/113.png', 
      'https://i.postimg.cc/wvTT6cxh/110.png', 
      'https://i.postimg.cc/52SXbtqW/128.png', 
      'https://i.postimg.cc/zXmvhhx1/132.png'
    ] 
  },
  { 
    id: 'energy', 
    name: 'ENERGY & HEALING', 
    mood: 'Spiritual & Nurturing',
    description: 'Healing, transformative visuals that inspire wellness',
    images: [
      'https://i.postimg.cc/MTjrNHg1/127161.png', 
      'https://i.postimg.cc/6p5bwYDW/a-a-bur-A-close-up-of-jasmine-petals-each-with-its-own-unique-a03a9998-01de-41e8-acd3-041b9403e5ac-0.png', 
      'https://i.postimg.cc/wjpysr6z/xelanft_resting_minimalistic_setting_no_face_seen_bright_natu_a1b2aefd-03ce-4137-8f43-74bed0e9f354_3.png', 
      'https://i.postimg.cc/Dz520jzx/xelanft_getting_a_massage_minimalistic_setting_no_face_seen_b_5c32c84d-9a8e-4f7f-bdfd-8f283256f5a4_3.png', 
      'https://i.postimg.cc/Dwrfky3k/xelanft_couple_hands_holding_minimalistic_setting_no_face_se_28a96e3d-ce84-4ddb-a0aa-a51aa03b5777_3.png', 
      'https://i.postimg.cc/VNvh9DRG/98751.png'
    ] 
  },
  { 
    id: 'golden', 
    name: 'GOLDEN HOUR', 
    mood: 'Warm & Radiant',
    description: 'Sun-kissed, glowing tones that capture magic hour',
    images: [
      'https://i.postimg.cc/Kz4g8yJc/12.png', 
      'https://i.postimg.cc/zG12Mqkg/18.png', 
      'https://i.postimg.cc/j5kPHjLJ/2.png', 
      'https://i.postimg.cc/CK7jK707/3.png', 
      'https://i.postimg.cc/MKsX3Gws/57.png', 
      'https://i.postimg.cc/hGmjGbdw/60.png'
    ] 
  },
  { 
    id: 'health', 
    name: 'HEALTH & WELLNESS', 
    mood: 'Clean & Vibrant',
    description: 'Fresh, healthy visuals that promote wellbeing',
    images: [
      'https://i.postimg.cc/RFsK7LgR/xelanft-bowl-of-fresh-fruits-minimalistic-setting-no-face-see-1e953559-47d3-4f55-8898-f9ab6cd0cf93-0.png', 
      'https://i.postimg.cc/XNBkfT0B/xelanft_holding_a_healing_stone_minimalistic_setting_no_face__eda9bbb8-1c02-48ac-b63f-ba1466a3c137_0.png', 
      'https://i.postimg.cc/W1TmPzq0/xelanft_lemon_water_minimalistic_setting_bright_natural_studi_be04fe14-63de-4481-b34c-bbe4846efe44_1.png', 
      'https://i.postimg.cc/Ls7Zh85C/xelanft_meditating_in_a_peaceful_calm_environment_no_face_see_9a10e24e-e8c6-4e4b-9bf3-a7f2a4c6abcd_3.png', 
      'https://i.postimg.cc/qqDw7Tfp/xelanft-A-close-up-of-orchid-petals-each-with-its-own-unique-10d8515c-b5b7-496f-b6a4-85bf5c749fdf-1.png', 
      'https://i.postimg.cc/XYs5S8b0/xelanft_matcha_minimalistic_counter_bright_natural_studio_lig_5c030848-c20d-4314-b74f-26f9fe0d5833_2.png'
    ] 
  },
  { 
    id: 'moody', 
    name: 'MOODY & MODERN', 
    mood: 'Bold & Edgy',
    description: 'Dramatic, contemporary tones for the modern entrepreneur',
    images: [
      'https://i.postimg.cc/SRz1B39j/100.png', 
      'https://i.postimg.cc/pVh2VdY5/103.png', 
      'https://i.postimg.cc/PrnktQ50/112.png', 
      'https://i.postimg.cc/zfc94nQt/116.png', 
      'https://i.postimg.cc/1znFrS1g/43.png', 
      'https://i.postimg.cc/WpMMysFg/39.png'
    ] 
  },
  { 
    id: 'minimal', 
    name: 'MINIMALISTIC', 
    mood: 'Clean & Focused',
    description: 'Simple, purposeful visuals that let your message shine',
    images: [
      'https://i.postimg.cc/02VLGyr8/1.png', 
      'https://i.postimg.cc/QCHzNRZp/111.png', 
      'https://i.postimg.cc/fLhXRX45/176.png', 
      'https://i.postimg.cc/WzWXZt8C/19.png', 
      'https://i.postimg.cc/KcqNJk7s/30.png', 
      'https://i.postimg.cc/2y6xCrYw/27.png'
    ] 
  }
]

interface User {
  id: string
  email: string
  tier: string
}

export default function SelfieStarterKit() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const [selectedAesthetic, setSelectedAesthetic] = useState<string | null>(null)
  const [sandraOpen, setSandraOpen] = useState(false)
  const [sandraMessages, setSandraMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    {
      role: 'assistant',
      content: "Hey gorgeous! So you're jumping into the Starter Kit - I'm literally so here for this. Listen, I know showing up online can feel weird at first, but you've got this. What's going on with your selfie game right now? Are you taking 47 photos and hating them all, or are you just not sure where to start?"
    }
  ])
  const [sandraInput, setSandraInput] = useState('')
  const [sandraLoading, setSandraLoading] = useState(false)
  const [showAestheticGallery, setShowAestheticGallery] = useState(false)
  const [celebrateCompletion, setCelebrateCompletion] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState(3)
  const [showMotivation, setShowMotivation] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [dailyMotivation, setDailyMotivation] = useState({
    message: "Your brand is your mirror. Make it magnetic.",
    author: "Sandra"
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const supabase = createClient()

  // Motivational messages in Sandra's voice
  const motivationalMessages = [
    { message: "You know what's wild? Every successful person started exactly where you are. The difference is they kept going.", author: "Sandra" },
    { message: "Your selfie game is about to be unrecognizable. Trust the process, babe.", author: "Sandra" },
    { message: "Listen, confidence isn't about being perfect. It's about showing up anyway.", author: "Sandra" },
    { message: "You're not just learning to take better photos. You're learning to see yourself the way others do - powerful.", author: "Sandra" },
    { message: "Every photo you take is practice. Every post you share is progress. Keep going.", author: "Sandra" },
    { message: "Your future self is watching you build your empire right now. Make her proud.", author: "Sandra" },
    { message: "Remember when you thought you couldn't do this? Look at you now.", author: "Sandra" }
  ]

  // Celebration messages for completing lessons
  const celebrationMessages = [
    "YES! You're absolutely crushing this!",
    "Look at you go! That's what I'm talking about!",
    "Another one done! You're on fire today!",
    "Boom! Progress looks good on you!",
    "You did that! Keep this energy going!",
    "I'm so proud of you for showing up!",
    "This is how empires are built - one lesson at a time!"
  ]

  useEffect(() => {
    checkAuth()
    
    // Set a daily motivational message
    const messageIndex = new Date().getDate() % motivationalMessages.length
    setDailyMotivation(motivationalMessages[messageIndex])
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        // Get user profile to check tier
        const { data: profile } = await supabase
          .from('profiles')
          .select('tier')
          .eq('id', authUser.id)
          .single()
        
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          tier: profile?.tier || 'free'
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => ({ ...prev, [lessonId]: true }))
    
    // Celebrate completion with some personality
    const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]
    setCelebrationMessage(randomMessage)
    setCelebrateCompletion(true)
    setTimeout(() => setCelebrateCompletion(false), 4000)
    
    // Update streak
    setCurrentStreak(prev => prev + 1)
  }

  const sendSandraMessage = async () => {
    if (!sandraInput.trim()) return
    
    const userMessage = sandraInput.trim()
    setSandraInput('')
    setSandraMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setSandraLoading(true)
    
    try {
      const response = await fetch('/api/ai/sandra-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          context: 'starter-kit-course',
          aesthetic: selectedAesthetic
        })
      })
      
      const data = await response.json()
      setSandraMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Sandra chat error:', error)
      setSandraMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Ugh, my brain just had a moment. Can you try asking me that again? Sometimes technology and I don't get along." 
      }])
    } finally {
      setSandraLoading(false)
    }
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const generateWorkbook = async () => {
    showToastMessage("Creating your personalized workbook...")
    try {
      const response = await fetch('/api/ai/generate-workbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseType: 'starter-kit',
          completedLessons,
          notes,
          selectedAesthetic,
          user
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'selfie-starter-kit-workbook.pdf'
        a.click()
        window.URL.revokeObjectURL(url)
        showToastMessage("Workbook downloaded! Time to put this into action.")
      } else {
        showToastMessage("Hmm, something went wrong. Try again in a sec?")
      }
    } catch (error) {
      console.error('Workbook generation failed:', error)
      showToastMessage("Oops, that didn't work. Let's try again.")
    }
  }

  // Calculate progress
  const totalLessons = COURSE_MODULES.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedCount = Object.keys(completedLessons).length  
  const progressPercentage = (completedCount / totalLessons) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#171719] border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-[#4C4B4B] font-light">Loading your course...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-[#171719]" />
          <h1 className="text-4xl font-cormorant text-[#171719] mb-4 font-light">HEY THERE</h1>
          <p className="text-[#4C4B4B] mb-8 font-light leading-relaxed">You'll need to sign in to access your course. Don't worry, it takes like 30 seconds and then we can get you looking amazing</p>
          <Link 
            href="/auth/login"
            className="inline-block bg-[#171719] text-white px-8 py-3 font-light hover:bg-[#2A2A2A] transition-all duration-300 tracking-wide"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Check if user has access to starter kit (requires starter tier or higher)
  if (user.tier === 'free') {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Lock className="w-16 h-16 mx-auto mb-6 text-[#171719]" />
          <h1 className="text-4xl font-cormorant text-[#171719] mb-4 font-light">STARTER KIT ACCESS</h1>
          <p className="text-[#4C4B4B] mb-8 font-light leading-relaxed">
            This is premium content from the Selfie Starter Kit. Ready to unlock your magnetic personal brand?
          </p>
          <div className="space-y-4">
            <Link 
              href="/products/starter-kit"
              className="block bg-[#171719] text-white px-8 py-3 font-light hover:bg-[#2A2A2A] transition-all duration-300 tracking-wide"
            >
              Get Starter Kit Access
            </Link>
            <Link 
              href="/dashboard"
              className="block border border-[#171719] text-[#171719] px-8 py-3 font-light hover:bg-[#171719] hover:text-white transition-all duration-300 tracking-wide"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-[#171719] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">          <h1 className="text-5xl lg:text-6xl font-cormorant mb-4 font-light tracking-wide">
            SELFIE STARTER KIT
          </h1>
          <p className="text-[#E8E8E8] text-lg font-light leading-relaxed max-w-2xl">
            Okay, so here's the thing - we're not just taking better photos. We're building a magnetic personal brand that makes people stop scrolling and think "I need to know her." Ready to become that person?
          </p>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-4xl font-cormorant mb-2 font-light">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-[#E8E8E8] font-light tracking-wide">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8 w-full bg-white/20 h-1">
            <div 
              className="bg-white h-1 transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Course Content */}
          <div className="xl:col-span-2 space-y-12">
            {COURSE_MODULES.map((module) => (
              <div key={module.id} className="bg-white border border-[#E8E8E8] overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="text-sm text-[#8A8A8A] font-light tracking-wide mb-2">
                        MODULE {module.order}
                      </div>
                      <h2 className="text-3xl font-cormorant text-[#171719] mb-3 font-light leading-tight">
                        {module.title}
                      </h2>
                      <p className="text-[#4C4B4B] mb-4 font-light leading-relaxed">
                        {module.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-[#8A8A8A] font-light">
                        <Clock size={16} />
                        {module.duration}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="border border-[#F0F0F0] p-6 hover:border-[#171719] transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-light text-[#171719] mb-2">
                              {lesson.title}
                            </h3>
                            <p className="text-[#8A8A8A] font-light text-sm mb-3 leading-relaxed">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-[#8A8A8A]">
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {lesson.duration}
                              </div>
                              {completedLessons[lesson.id] && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle size={14} />
                                  Completed
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => {
                                setCurrentLesson(lesson)
                                setShowVideo(true)
                              }}
                              className="flex items-center justify-center gap-2 bg-[#171719] text-white px-6 py-3 hover:bg-[#2A2A2A] transition-all duration-300 font-light tracking-wide"
                            >
                              <Play size={16} />
                              Watch
                            </button>
                            <button
                              onClick={() => markLessonComplete(lesson.id)}
                              className={`px-6 py-3 font-light tracking-wide transition-all duration-300 ${
                                completedLessons[lesson.id]
                                  ? 'bg-green-600 text-white hover:bg-green-700' 
                                  : 'border border-[#E8E8E8] text-[#8A8A8A] hover:bg-[#171719] hover:text-white hover:border-[#171719] hover:scale-105'
                              }`}
                            >
                              {completedLessons[lesson.id] ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle size={16} />
                                  Done!
                                </div>
                              ) : (
                                'Mark Complete'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Daily Motivation Widget */}
            <div className="bg-[#171719] text-white p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-20">
                <Coffee size={24} />
              </div>
              <h3 className="text-xl font-cormorant mb-4 font-light">Sandra Says</h3>
              <blockquote className="text-[#E8E8E8] font-light leading-relaxed italic mb-4">
                "{dailyMotivation.message}"
              </blockquote>
              <p className="text-sm text-[#B5B5B3] font-light">- {dailyMotivation.author}</p>
              <button
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
                  setDailyMotivation(motivationalMessages[randomIndex])
                }}
                className="mt-4 text-sm text-[#B5B5B3] hover:text-white transition-colors font-light tracking-wide"
              >
                Get Another →
              </button>
            </div>

            {/* Progress & Streak Widget */}
            <div className="bg-white border border-[#E8E8E8] p-8">
              <h3 className="text-2xl font-cormorant text-[#171719] mb-6 font-light">
                Your Progress
              </h3>
              
              {/* Streak Counter */}
              {currentStreak > 0 && (
                <div className="bg-[#F8F8F8] p-4 mb-6 border border-[#E8E8E8]">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap size={20} className="text-[#171719]" />
                    <span className="font-medium text-[#171719]">
                      {currentStreak} lesson streak!
                    </span>
                  </div>
                  <p className="text-sm text-[#8A8A8A] font-light">
                    You're on fire! Keep this momentum going.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8A8A] font-light">Completed</span>
                  <span className="font-medium text-[#171719]">
                    {completedCount}/{totalLessons}
                  </span>
                </div>
                <div className="w-full bg-[#F0F0F0] h-2">
                  <div 
                    className="bg-[#171719] h-2 transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-sm text-[#8A8A8A] text-center font-light">
                  {Math.round(progressPercentage)}% Complete
                </div>
                
                {/* Weekly Goal Progress */}
                <div className="pt-4 border-t border-[#F0F0F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#8A8A8A] font-light">Weekly Goal</span>
                    <span className="text-sm font-medium text-[#171719]">
                      {Math.min(completedCount, weeklyGoal)}/{weeklyGoal}
                    </span>
                  </div>
                  <div className="w-full bg-[#F0F0F0] h-1">
                    <div 
                      className="bg-[#171719] h-1 transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(completedCount / weeklyGoal * 100, 100)}%` }}
                    />
                  </div>
                  {completedCount >= weeklyGoal && (
                    <p className="text-xs text-green-600 font-light mt-2">
                      Goal achieved! You're crushing it this week.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Tools */}
            <div className="bg-white border border-[#E8E8E8] p-8">
              <h3 className="text-2xl font-cormorant text-[#171719] mb-6 font-light">
                Your Tools
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSandraOpen(true)}
                  className="w-full flex items-center gap-3 p-4 border border-[#E8E8E8] hover:bg-[#171719] hover:text-white hover:border-[#171719] transition-all duration-300 font-light tracking-wide"
                >
                  <MessageSquare size={18} />
                  Chat with Sandra AI
                </button>
                <button
                  onClick={generateWorkbook}
                  className="w-full flex items-center gap-3 p-4 border border-[#E8E8E8] hover:bg-[#171719] hover:text-white hover:border-[#171719] transition-all duration-300 font-light tracking-wide"
                >
                  <Download size={18} />
                  Generate Workbook
                </button>
                <Link
                  href="/studio"
                  className="w-full flex items-center gap-3 p-4 border border-[#E8E8E8] hover:bg-[#171719] hover:text-white hover:border-[#171719] transition-all duration-300 font-light tracking-wide"
                >
                  <Camera size={18} />
                  Studio Tools
                </Link>
                {progressPercentage > 0 && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`I'm ${Math.round(progressPercentage)}% through the Selfie Starter Kit and learning to build my magnetic personal brand! 🎯`)
                      showToastMessage("Progress copied! Ready to share your wins?")
                    }}
                    className="w-full flex items-center gap-3 p-4 border border-[#E8E8E8] hover:bg-[#171719] hover:text-white hover:border-[#171719] transition-all duration-300 font-light tracking-wide"
                  >
                    <Heart size={18} />
                    Share My Progress
                  </button>
                )}
              </div>
            </div>

            {/* Aesthetic Selection */}
            <div className="bg-white border border-[#E8E8E8] p-8">
              <h3 className="text-2xl font-cormorant text-[#171719] mb-6 font-light">
                Pick Your Vibe
              </h3>
              <div className="space-y-3 mb-6">
                {AESTHETIC_COLLECTIONS.slice(0, 4).map((aesthetic) => (
                  <button
                    key={aesthetic.id}
                    onClick={() => {
                      setSelectedAesthetic(aesthetic.id)
                      showToastMessage(`${aesthetic.name} vibe selected! This is going to look amazing.`)
                    }}
                    className={`w-full p-4 text-left font-light tracking-wide transition-all duration-300 border ${
                      selectedAesthetic === aesthetic.id
                        ? 'bg-[#171719] text-white border-[#171719]'
                        : 'border-[#E8E8E8] text-[#171719] hover:bg-[#171719]/5 hover:border-[#171719]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Palette size={16} />
                      <div>
                        <div className="font-medium">{aesthetic.name}</div>
                        <div className="text-sm text-current/70">{aesthetic.mood}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAestheticGallery(true)}
                className="w-full p-4 border border-[#E8E8E8] hover:bg-[#171719] hover:text-white hover:border-[#171719] transition-all duration-300 font-light tracking-wide text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <Eye size={16} />
                  View All Collections
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 bg-[#171719] text-white px-6 py-4 z-50 transform transition-all duration-300 max-w-sm shadow-xl">
          <p className="font-light leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* Celebration Widget */}
      {celebrateCompletion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white p-8 max-w-md w-full text-center animate-bounce pointer-events-auto">
            <div className="mb-4">
              <Sparkles size={48} className="mx-auto text-[#171719] mb-4" />
              <Trophy size={32} className="mx-auto text-[#171719]" />
            </div>
            <h3 className="text-2xl font-cormorant font-light text-[#171719] mb-3">
              Lesson Complete!
            </h3>
            <p className="text-[#4C4B4B] font-light mb-4 leading-relaxed">
              {celebrationMessage}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[#8A8A8A]">
              <Target size={16} />
              <span>Progress: {Math.round(progressPercentage)}% Complete</span>
            </div>
          </div>
        </div>
      )}

      {/* Aesthetic Gallery Modal */}
      {showAestheticGallery && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E8E8E8]">
              <h3 className="text-2xl font-cormorant text-[#171719] font-light">
                Aesthetic Collections
              </h3>
              <button
                onClick={() => setShowAestheticGallery(false)}
                className="text-[#8A8A8A] hover:text-[#171719] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-8">
              {AESTHETIC_COLLECTIONS.map((collection) => (
                <div key={collection.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-cormorant text-[#171719] font-light">
                        {collection.name}
                      </h4>
                      <p className="text-[#8A8A8A] font-light">{collection.mood}</p>
                      <p className="text-sm text-[#8A8A8A] font-light leading-relaxed">
                        {collection.description}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAesthetic(collection.id)
                        setShowAestheticGallery(false)
                        showToastMessage(`${collection.name} aesthetic locked in! Your brand is about to be unrecognizable.`)
                      }}
                      className={`px-6 py-2 font-light tracking-wide transition-all duration-300 ${
                        selectedAesthetic === collection.id
                          ? 'bg-[#171719] text-white'
                          : 'border border-[#E8E8E8] text-[#171719] hover:bg-[#171719] hover:text-white'
                      }`}
                    >
                      {selectedAesthetic === collection.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {collection.images.map((image, index) => (
                      <div key={index} className="aspect-square">
                        <img 
                          src={image} 
                          alt={`${collection.name} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && currentLesson && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="bg-black w-full max-w-5xl">
            <div className="flex items-center justify-between p-6 bg-black text-white border-b border-white/20">
              <div>
                <h3 className="text-xl font-light mb-1">{currentLesson.title}</h3>
                <p className="text-sm text-white/70 font-light">{currentLesson.description}</p>
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="text-white hover:text-white/70 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                className="w-full h-full"
                controls
                autoPlay
                onEnded={() => markLessonComplete(currentLesson.id)}
              >
                <source src={currentLesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-6 space-y-4 bg-black">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={() => markLessonComplete(currentLesson.id)}
                  className="bg-white text-black px-8 py-3 hover:bg-white/90 hover:scale-105 transition-all duration-300 font-light tracking-wide"
                >
                  {completedLessons[currentLesson.id] ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} />
                      Done! 
                    </div>
                  ) : (
                    'Mark as Complete'
                  )}
                </button>
                <div className="text-white/70 text-sm font-light">
                  Duration: {currentLesson.duration}
                </div>
              </div>
              <div className="bg-white/10 p-4">
                <textarea
                  placeholder="Take notes for this lesson..."
                  value={notes[currentLesson.id] || ''}
                  onChange={(e) => setNotes(prev => ({...prev, [currentLesson.id]: e.target.value}))}
                  className="w-full bg-transparent text-white placeholder-white/60 resize-none outline-none font-light leading-relaxed"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sandra AI Modal */}
      {sandraOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#E8E8E8]">
              <div>
                <h3 className="text-2xl font-cormorant text-[#171719] font-light">
                  Chat with Sandra AI
                </h3>
                <p className="text-sm text-[#8A8A8A] font-light">
                  Your bestie who happens to know about selfies and building empires
                </p>
              </div>
              <button
                onClick={() => setSandraOpen(false)}
                className="text-[#8A8A8A] hover:text-[#171719] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {sandraMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      message.role === 'assistant' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 bg-[#171719] text-white flex items-center justify-center font-light">
                        S
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 font-light leading-relaxed ${
                        message.role === 'assistant' 
                          ? 'bg-[#F8F8F8] text-[#171719]' 
                          : 'bg-[#171719] text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {sandraLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-10 h-10 bg-[#171719] text-white flex items-center justify-center font-light">
                      S
                    </div>
                    <div className="bg-[#F8F8F8] p-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-[#171719] animate-pulse"></div>
                        <div className="w-2 h-2 bg-[#171719] animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-[#171719] animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-[#E8E8E8]">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="What's going on with your selfie situation? Ask me anything..."
                  value={sandraInput}
                  onChange={(e) => setSandraInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendSandraMessage()}
                  className="flex-1 p-4 border border-[#E8E8E8] focus:border-[#171719] outline-none font-light"
                />
                <button 
                  onClick={sendSandraMessage}
                  disabled={sandraLoading || !sandraInput.trim()}
                  className="bg-[#171719] text-white px-8 py-4 hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 font-light tracking-wide"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sandra AI Floating Button */}
      <button
        onClick={() => setSandraOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#171719] text-white hover:scale-110 transition-all duration-300 shadow-xl flex items-center justify-center z-40"
        style={{ borderRadius: '50%' }}
      >
        <MessageSquare size={24} />
      </button>
    </div>
  )
}
