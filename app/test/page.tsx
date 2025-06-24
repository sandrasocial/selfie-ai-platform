'use client'

import { 
  Navigation, 
  Button,
  Diamond,
  SectionDivider,
  Footer
} from '@/components/global'
import { sampleUsers, sampleVisionBoard, sampleContentPosts, sampleUserStats } from '@/lib/sample-data'

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
        <div className="max-w-[1400px] mx-auto px-6 md:px-24 py-16">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-bodoni text-5xl md:text-7xl text-soft-white mb-6">
              SSELFIE Component Test
            </h1>
            <p className="font-inter text-lg text-soft-white/80 max-w-2xl mx-auto">
              Testing the luxury SSELFIE platform setup and components
            </p>
            <div className="mt-8">
              <Diamond size={20} animate={true} />
            </div>
          </div>

          {/* Button Test */}
          <div className="mb-16 text-center">
            <h2 className="font-bodoni text-3xl text-soft-white mb-8">Button Test</h2>
            <div className="max-w-md mx-auto space-y-4">
              <Button 
                variant="primary" 
                onClick={handleButtonClick}
                fullWidth={true}
              >
                Test Primary Button
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleButtonClick}
                fullWidth={true}
              >
                Test Secondary Button
              </Button>
            </div>
          </div>

          <SectionDivider />

          {/* Sample Data Display */}
          <div className="mb-16">
            <h2 className="font-bodoni text-3xl text-soft-white mb-8 text-center">Sample Data</h2>
            <div className="max-w-2xl mx-auto bg-luxury-black/50 p-8 border border-soft-white/10 rounded-lg">
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
                  <span className="text-soft-white capitalize">{sampleUser.subscription_status}</span>
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
          <div className="text-center py-16">
            <Diamond size={24} animate={true} />
            <h3 className="font-bodoni text-2xl text-soft-white mt-6 mb-4">
              ✨ Setup Complete! ✨
            </h3>
            <p className="font-inter text-soft-white/60 mb-6">
              Your SSELFIE luxury platform is ready for development
            </p>
            <div className="space-y-2 text-sm font-inter text-soft-white/50">
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
