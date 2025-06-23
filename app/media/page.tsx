export default function MediaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-6">
            Media & Press
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Press resources and media coverage for SELFIE AI™
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Press Kit</h2>
              <p className="text-gray-400">
                Download our press kit with logos, screenshots, and company information.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Media Coverage</h2>
              <p className="text-gray-400">
                Latest news and coverage about SELFIE AI™ in the media.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-gray-400">
              For press inquiries, contact us at{" "}
              <a href="mailto:press@ssasocial.com" className="text-blue-400 hover:text-blue-300">
                press@ssasocial.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
