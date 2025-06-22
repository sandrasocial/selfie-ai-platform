export default function ContactPage() {
  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <h1 className="font-bodoni text-4xl mb-4">Contact Us</h1>
          <p className="text-warm-gray mb-8">
            Get in touch with the SELFIE AI team
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border border-warm-gray">
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-warm-gray">hello@selfie-ai.com</p>
            </div>
            
            <div className="p-4 border border-warm-gray">
              <h3 className="font-semibold mb-2">Instagram</h3>
              <p className="text-warm-gray">@sandraselfieai</p>
            </div>
            
            <div className="p-4 border border-warm-gray">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-warm-gray">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 