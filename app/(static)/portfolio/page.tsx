import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Portfolio - SSELFIE',
  description: 'Brand collaborations and content creation by Sandra',
}

export default function PortfolioPage() {
  const brandLogos = [
    'https://i.postimg.cc/NF6qF3vt/1.png',
    'https://i.postimg.cc/x8DV007g/2.png',
    'https://i.postimg.cc/WbVcC101/3.png',
    'https://i.postimg.cc/59LMsCYr/4.png',
    'https://i.postimg.cc/sgDdfH6F/5.png',
    'https://i.postimg.cc/QxqZ3Zqk/6.png',
    'https://i.postimg.cc/NjJhK8SK/7.png',
    'https://i.postimg.cc/QMH219Z0/8.png',
    'https://i.postimg.cc/zf69jzJ5/9.png',
    'https://i.postimg.cc/DZGRp9ZG/10.png',
    'https://i.postimg.cc/yxztMLgb/11.png',
    'https://i.postimg.cc/Fzg8N00s/12.png',
  ]

  const stats = [
    { number: '55K+', label: 'TikTok Followers' },
    { number: '65K+', label: 'Instagram Community' },
    { number: '2M+', label: 'Monthly Reach' },
    { number: '8.5%', label: 'Engagement Rate' },
  ]

  const services = [
    {
      title: 'Content Feature',
      description: '1 Reel + 1 Story Mention + Tag',
      details: 'Perfect for product launches and brand awareness',
    },
    {
      title: 'Editorial Set',
      description: '1 UGC video, 3 stills, brand styling',
      details: 'Elevated content that matches your aesthetic',
    },
    {
      title: 'Full Campaign',
      description: '1-week activation, product placement, 5 assets',
      details: 'Comprehensive coverage across platforms',
    },
    {
      title: 'Brand Partnership',
      description: 'Let\'s create something custom together',
      details: 'Long-term collaborations and ambassador roles',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="h-[60vh] bg-luxury-black text-soft-white flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="font-bodoni text-6xl md:text-7xl lg:text-8xl font-light mb-4">
            Brand Collaborations
          </h1>
          <p className="text-xl md:text-2xl opacity-80 font-light">
            Creating content that converts
          </p>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute text-[50rem] font-playfair italic top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            P
          </div>
        </div>
      </section>

      {/* About Sandra */}
      <section className="py-20 md:py-32 bg-soft-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <h2 className="font-bodoni text-4xl md:text-5xl mb-6">
                Hi, I'm Sandra
              </h2>
              <p className="text-xl leading-relaxed mb-4">
                Single mom. Brand strategist. Content creator.
              </p>
              <p className="text-lg leading-relaxed text-warm-gray mb-4">
                With over 120K combined followers and a signature style that blends authenticity with aspiration, 
                I help brands connect with real women building real lives.
              </p>
              <p className="text-lg leading-relaxed text-warm-gray">
                My content focuses on transformation, confidence, and showing up as your authentic self - 
                because that's what resonates with real women making real changes.
              </p>
            </div>
            <div className="relative h-[600px]">
              <Image
                src="https://i.postimg.cc/YC0mdvs0/IMG-3198.jpg"
                alt="Sandra - Brand Strategist & Content Creator"
                fill
                className="object-cover contrast-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center border border-warm-gray/20 p-8">
                <div className="font-bodoni text-5xl md:text-6xl mb-2">
                  {stat.number}
                </div>
                <p className="text-xs uppercase tracking-wider text-warm-gray">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-20 bg-soft-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h3 className="font-bodoni text-4xl md:text-5xl text-center mb-12">
            Trusted By Leading Brands
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {brandLogos.map((logo, index) => (
              <div
                key={index}
                className="bg-white p-6 flex items-center justify-center min-h-[120px] grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border border-warm-gray/10"
              >
                <Image
                  src={logo}
                  alt="Brand Partner"
                  width={140}
                  height={80}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h3 className="font-bodoni text-4xl md:text-5xl text-center mb-12">
            Collaboration Options
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="border border-warm-gray/20 p-8 md:p-12">
                <h4 className="font-bodoni text-3xl mb-4">{service.title}</h4>
                <p className="text-lg mb-4">{service.description}</p>
                <p className="text-warm-gray">{service.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-soft-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="bg-white p-12 md:p-16 border border-warm-gray/20">
            <h3 className="font-bodoni text-4xl mb-4">Let's Work Together</h3>
            <p className="text-lg mb-6">For collaboration inquiries:</p>
            <a
              href="mailto:hello@sselfie.ai"
              className="text-2xl font-light hover:opacity-70 transition-opacity"
            >
              hello@sselfie.ai
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
