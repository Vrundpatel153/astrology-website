import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Sparkles, Heart, Shield, Star, Leaf } from "lucide-react";
import { Link } from "wouter";

const values = [
  { icon: Leaf,     title: "Ethically Sourced",    desc: "Every crystal is responsibly mined and sourced directly from trusted partners in Brazil, Uruguay, India, and Peru." },
  { icon: Sparkles, title: "Full Moon Energised",   desc: "All our crystals are cleansed under running water and recharged under each full moon before being packed for you." },
  { icon: Shield,   title: "Lab Tested & Certified",desc: "Each gemstone is authenticated and tested for quality — you get only genuine, natural crystals, never dyed or synthetic." },
  { icon: Heart,    title: "Made with Intention",   desc: "Our artisans handcraft every piece with prayers and positive energy, setting the healing intention directly into each crystal." },
  { icon: Star,     title: "Vedic Wisdom",          desc: "Our crystal recommendations are grounded in ancient Indian Vedic astrology, Ayurveda, and thousands of years of healing tradition." },
];

const team = [
  { name: "Priya Sharma",   role: "Founder & Vedic Astrologer",     img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80" },
  { name: "Arjun Mehta",    role: "Head of Crystal Sourcing",        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Kavitha Nair",   role: "Lead Jewellery Artisan",          img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#2a1f1a]">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=1400&q=80)", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1f1a]/60 to-[#2a1f1a]/80" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8a951] mb-4">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-white leading-tight mb-6">
            Born from the Stars,<br />Rooted in the Earth
          </h1>
          <p className="text-[#fdf8f4]/70 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Selenite Soul was born from a simple belief — that ancient Vedic wisdom and the healing power of crystals can transform modern lives.
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a951] mb-5">The Beginning</p>
                <h2 className="text-3xl font-serif font-light text-[#2a1f1a] mb-6 leading-snug">A journey that started with a single amethyst</h2>
                <p className="text-[#2a1f1a]/70 leading-relaxed mb-5">
                  In 2019, our founder Priya was going through a difficult phase — anxiety, sleepless nights, and a disconnection from herself. A trip to Haridwar changed everything. A sage placed a raw amethyst in her hands and said, <em>"The Earth already knows your cure."</em>
                </p>
                <p className="text-[#2a1f1a]/70 leading-relaxed">
                  That moment sparked a deep study of Vedic astrology, Navagrahas, and crystal healing. Selenite Soul was born to bring this knowledge to every Indian home — in a form that is beautiful, authentic, and spiritually alive.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80"
                  alt="Crystal healing"
                  className="w-full h-[380px] object-cover"
                />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#c8a951]/20 border border-[#c8a951]/30" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-[#2a1f1a]">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal direction="up" className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c8a951] mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white">Our Sacred Commitments</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} direction="up" delay={i * 0.08}>
                <motion.div
                  className="border border-[#fdf8f4]/10 p-7 group cursor-default"
                  whileHover={{ borderColor: "rgba(200,169,81,0.4)", backgroundColor: "rgba(200,169,81,0.04)" }}
                  transition={{ duration: 0.2 }}
                >
                  <v.icon className="w-6 h-6 text-[#c8a951] mb-5" />
                  <h3 className="text-lg font-serif font-light text-white mb-3">{v.title}</h3>
                  <p className="text-sm text-[#fdf8f4]/50 leading-relaxed">{v.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal direction="up" className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c8a951] mb-3">The People Behind</p>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#2a1f1a]">Meet Our Soul Team</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} direction="up" delay={i * 0.1}>
                <div className="text-center">
                  <div className="relative w-36 h-36 mx-auto mb-5 overflow-hidden rounded-full">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-serif text-lg text-[#2a1f1a] mb-1">{member.name}</h3>
                  <p className="text-xs text-[#2a1f1a]/50 uppercase tracking-wider font-medium">{member.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#f5ede4] text-center">
        <ScrollReveal direction="up">
          <Sparkles className="w-8 h-8 text-[#c8a951] mx-auto mb-5" />
          <h2 className="text-3xl font-serif font-light text-[#2a1f1a] mb-4">Find Your Crystal Soulmate</h2>
          <p className="text-[#2a1f1a]/60 mb-8 max-w-md mx-auto">Every crystal has a story. Every person has a purpose. Let Vedic astrology guide your perfect match.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kundali">
              <motion.span className="inline-block bg-[#c8a951] text-[#2a1f1a] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Get Free Kundali Reading
              </motion.span>
            </Link>
            <Link href="/shop">
              <motion.span className="inline-block border border-[#2a1f1a] text-[#2a1f1a] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer" whileHover={{ backgroundColor: "#2a1f1a", color: "#fdf8f4" }} transition={{ duration: 0.2 }}>
                Explore All Crystals
              </motion.span>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
