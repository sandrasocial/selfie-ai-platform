export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-soft-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bodoni text-5xl mb-6">Affiliate Program</h1>
          <p className="text-xl text-warm-gray mb-12">
            Join our affiliate program and earn commissions promoting SELFIE AI
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 border border-warm-gray">
              <h3 className="font-bodoni text-2xl mb-4">Commission Rate</h3>
              <p className="text-3xl font-bold text-luxury-black mb-2">30%</p>
              <p className="text-warm-gray">On all sales you refer</p>
            </div>
            
            <div className="p-6 border border-warm-gray">
              <h3 className="font-bodoni text-2xl mb-4">Cookie Duration</h3>
              <p className="text-3xl font-bold text-luxury-black mb-2">30 Days</p>
              <p className="text-warm-gray">Track referrals for 30 days</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="font-bodoni text-3xl mb-6">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-luxury-black text-soft-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-warm-gray">Join our affiliate program</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-luxury-black text-soft-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-semibold mb-2">Promote</h3>
                <p className="text-warm-gray">Share your unique affiliate link</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-luxury-black text-soft-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-semibold mb-2">Earn</h3>
                <p className="text-warm-gray">Get paid for successful referrals</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-luxury-black text-soft-white">
            <h3 className="font-bodoni text-2xl mb-4">Ready to Start?</h3>
            <p className="mb-6">Contact us to join our affiliate program</p>
            <a 
              href="mailto:affiliates@selfie-ai.com" 
              className="inline-block bg-soft-white text-luxury-black px-6 py-3 font-semibold hover:bg-gray-200 transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 