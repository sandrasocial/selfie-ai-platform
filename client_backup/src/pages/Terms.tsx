
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";

export default function Terms() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-none">
          <h1 className="font-prata text-4xl md:text-5xl mb-8 text-luxury-headline">
            Terms of Service
          </h1>

          <p className="text-luxury-text-gray mb-8 text-sm tracking-wide font-['Neue Einstellung']">
            Last updated: January 2025
          </p>

          <section className="mb-12">
            <h2 className="font-prata text-2xl mb-4 text-luxury-headline">
              Acceptance of Terms
            </h2>
            <p className="text-luxury-text-gray font-['Neue Einstellung'] leading-relaxed">
              By accessing and using SELFIE AI™, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-prata text-2xl mb-4 text-luxury-headline">
              Use License
            </h2>
            <p className="text-luxury-text-gray font-['Neue Einstellung'] leading-relaxed mb-4">
              Permission is granted to temporarily use SELFIE AI™ for personal, non-commercial
              transitory viewing only.
            </p>
            <ul className="list-disc pl-6 text-luxury-text-gray font-['Neue Einstellung'] space-y-2">
              <li>This is the grant of a license, not a transfer of title</li>
              <li>You may not modify or copy the materials</li>
              <li>You may not use the materials for commercial purposes</li>
              <li>You may not attempt to reverse engineer any software</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-prata text-2xl mb-4 text-luxury-headline">
              User Content
            </h2>
            <p className="text-luxury-text-gray font-['Neue Einstellung'] leading-relaxed">
              You retain ownership of all content you upload to our platform. By uploading content,
              you grant us a license to use, store, and process your content to provide our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-prata text-2xl mb-4 text-luxury-headline">
              Limitations
            </h2>
            <p className="text-luxury-text-gray font-['Neue Einstellung'] leading-relaxed">
              In no event shall SELFIE AI™ or its suppliers be liable for any damages arising
              out of the use or inability to use the materials on our platform.
            </p>
          </section>

          <section>
            <h2 className="font-prata text-2xl mb-4 text-luxury-headline">
              Contact Information
            </h2>
            <p className="text-luxury-text-gray font-['Neue Einstellung'] leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:hello@sselfie.ai" className="underline text-luxury-headline">
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
