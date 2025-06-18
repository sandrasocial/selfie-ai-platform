// -----------------------------------------------------------------------------
// SEPARATE PAGE – AI Imagery Collections (can be routed to /aesthetic-collections)
// -----------------------------------------------------------------------------
import React from "react";
import Header from "@/components/layout/Header";
import CollectionSelector from "@/components/aesthetics/CollectionSelector";

export default function AestheticCollections() {
  return (
    <div className="min-h-screen bg-[#F1F1F1] text-[#171719] font-inter">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-light mb-4"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            AI Imagery Collections
          </h1>
          <p className="text-lg text-[#4C4B4B] font-light max-w-2xl mx-auto">
            Curated aesthetic collections designed to elevate your brand with sophisticated visual storytelling
          </p>
        </div>

        {/* Collections */}
        <CollectionSelector showPurchaseOption={true} />

        {/* Benefits */}
        <div className="mt-16 border-t border-[#B5B5B3] pt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Editorial Quality",
              desc: "Professional-grade imagery curated for luxury brand aesthetics",
            },
            {
              title: "AI-Optimized",
              desc: "Designed to work seamlessly with our AI brand strategy tools",
            },
            {
              title: "Complete Package",
              desc: "Includes color palettes, font suggestions, and tone guidelines",
            },
          ].map((b) => (
            <div key={b.title} className="text-center">
              <h3
                className="text-xl font-light mb-3"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                {b.title}
              </h3>
              <p className="text-[#4C4B4B] font-light">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}