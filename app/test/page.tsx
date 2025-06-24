'use client'

import { Navigation, Button, Diamond, SectionDivider, Footer } from '@/components/global'
import {
  sampleUsers,
  sampleVisionBoard,
  sampleContentPosts,
  sampleUserStats,
} from '@/lib/sample-data'

export default function TestPage() {
  const handleButtonClick = () => {
    console.log('SSELFIE Button clicked!')
  }

  const sampleUser = sampleUsers[0]
  const sampleStats = sampleUserStats[0]

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-luxury-black pt-20">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-24">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-6 font-bodoni text-5xl text-soft-white md:text-7xl">
              SSELFIE Component Test
            </h1>
            <p className="mx-auto max-w-2xl font-inter text-lg text-soft-white/80">
              Testing the luxury SSELFIE platform setup and components
            </p>
            <div className="mt-8">
              <Diamond size={20} animate={true} />
            </div>
          </div>

          {/* Button Test */}
          <div className="mb-16 text-center">
            <h2 className="mb-8 font-bodoni text-3xl text-soft-white">Button Test</h2>
            <div className="mx-auto max-w-md space-y-4">
              <Button variant="primary" onClick={handleButtonClick} fullWidth={true}>
                Test Primary Button
              </Button>
              <Button variant="secondary" onClick={handleButtonClick} fullWidth={true}>
                Test Secondary Button
              </Button>
            </div>
          </div>

          <SectionDivider />

          {/* Sample Data Display */}
          <div className="mb-16">
            <h2 className="mb-8 text-center font-bodoni text-3xl text-soft-white">Sample Data</h2>
            <div className="mx-auto max-w-2xl rounded-lg border border-soft-white/10 bg-luxury-black/50 p-8">
              <div className="space-y-4 font-inter text-soft-white/80">
                <div className="flex justify-between">
                  <span>User Name:</span>
                  <span className="text-soft-white">{sampleUser.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-soft-white">{sampleUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subscription:</span>
                  <span className="capitalize text-soft-white">
                    {sampleUser.subscription_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Score:</span>
                  <span className="text-soft-white">{sampleUser.confidence_score}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Posts This Month:</span>
                  <span className="text-soft-white">{sampleStats.posts_this_month}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="py-16 text-center">
            <Diamond size={24} animate={true} />
            <h3 className="mb-4 mt-6 font-bodoni text-2xl text-soft-white">
              ✨ Setup Complete! ✨
            </h3>
            <p className="mb-6 font-inter text-soft-white/60">
              Your SSELFIE luxury platform is ready for development
            </p>
            <div className="space-y-2 font-inter text-sm text-soft-white/50">
              <p>• Global components loaded</p>
              <p>• Sample data available</p>
              <p>• Luxury design system active</p>
              <p>• Agent instructions configured</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
