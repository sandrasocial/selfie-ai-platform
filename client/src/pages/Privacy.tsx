
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";

export default function Privacy() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      <div className="max-w-3xl mx-auto px-6 py-24">
        <div>
          <h1 className="font-serif text-5xl md:text-6xl text-black mb-10">Privacy Policy</h1>
          <p className="text-base text-gray-600 mb-12">Last updated: January 2025</p>

          <section className="mb-12">
            <h2 className="font-serif text-3xl text-black mb-6">Information We Collect</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account,
              upload photos, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Account information (email, name)</li>
              <li>Photos and content you upload</li>
              <li>Usage data and preferences</li>
              <li>Communication records</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl text-black mb-6">How We Use Your Information</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We use the information we collect to provide, maintain, and improve our services.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide AI-powered content generation</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about our services</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl text-black mb-6">Data Security</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-black mb-6">Contact Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@sselfie.ai" className="underline text-black">
                hello@sselfie.ai
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
