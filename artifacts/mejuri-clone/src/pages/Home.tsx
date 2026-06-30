import { Link } from "wouter";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import CategoryGrid from "@/components/CategoryGrid";
import ShopByConcern from "@/components/ShopByConcern";
import ProductCarousel from "@/components/ProductCarousel";
import BestSellers from "@/components/BestSellers";
import NewArrivals from "@/components/NewArrivals";
import ShopByAstrology from "@/components/ShopByAstrology";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

function TrustBadges() {
  const badges = [
    "100% Natural",
    "Energised After Order",
    "Lab Testing Certificate",
    "1.5L+ Happy Customers",
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-12 py-6 border-b border-[#e8d9cf] bg-white overflow-hidden">
      {badges.map((badge, i) => (
        <motion.span
          key={badge}
          className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-[#2a1f1a] text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
        >
          {badge}
        </motion.span>
      ))}
    </div>
  );
}

function KundaliPromo() {
  return (
    <ScrollReveal direction="up" threshold={0.15}>
      <Link href="/kundali">
        <motion.div
          className="mx-4 md:mx-8 my-10 md:my-14 border border-[#c8a951]/40 bg-gradient-to-r from-[#fdf3e1] to-[#fdf8f4] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 cursor-pointer group overflow-hidden relative"
          whileHover={{ borderColor: "rgba(200,169,81,0.8)" }}
          transition={{ duration: 0.2 }}
        >
          {/* Floating zodiac symbols */}
          {["♈","♌","♐","♎"].map((sym, i) => (
            <motion.span
              key={i}
              className="absolute text-4xl text-[#c8a951]/10 font-serif select-none pointer-events-none"
              style={{ top: `${10 + i * 20}%`, right: `${5 + i * 8}%` }}
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
            >
              {sym}
            </motion.span>
          ))}
          <div className="shrink-0 w-14 h-14 flex items-center justify-center rounded-full" style={{ border: "1.5px solid rgba(200,169,81,0.6)", background: "rgba(200,169,81,0.06)" }}>
            <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
              {/* Star of David / Sri Yantra — upward triangle */}
              <polygon points="20,4 33,28 7,28" fill="rgba(200,169,81,0.1)" stroke="#c8a951" strokeWidth="1.5" strokeLinejoin="round"/>
              {/* Downward triangle */}
              <polygon points="20,36 7,12 33,12" fill="rgba(200,169,81,0.05)" stroke="rgba(200,169,81,0.7)" strokeWidth="1.5" strokeLinejoin="round"/>
              {/* Center dot */}
              <circle cx="20" cy="20" r="2.5" fill="#c8a951"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c8a951] mb-1">Free Vedic Reading</p>
            <h3 className="text-xl md:text-2xl font-serif font-light text-[#2a1f1a] mb-1.5">
              Discover Your Crystal Destiny
            </h3>
            <p className="text-sm text-[#2a1f1a]/60 max-w-md">
              Enter your birth details and our Jyotish engine prescribes the exact gemstones aligned with your planetary chart.
            </p>
          </div>
          <motion.span
            className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a951] border-b border-[#c8a951]/40 pb-0.5 group-hover:border-[#c8a951] transition-colors"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.18 }}
          >
            Get My Kundali →
          </motion.span>
        </motion.div>
      </Link>
    </ScrollReveal>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopBar />
      <Header />

      <main>
        <Hero />
        <TrustBadges />

        <ScrollReveal direction="up" threshold={0.06}>
          <CategoryGrid />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.05} threshold={0.05}>
          <ShopByConcern />
        </ScrollReveal>

        <ScrollReveal direction="up" threshold={0.05}>
          <ProductCarousel />
        </ScrollReveal>

        <KundaliPromo />

        <ScrollReveal direction="up" threshold={0.04}>
          <BestSellers />
        </ScrollReveal>

        <ScrollReveal direction="up" threshold={0.04}>
          <NewArrivals />
        </ScrollReveal>

        <ScrollReveal direction="up" threshold={0.06}>
          <Manifesto />
        </ScrollReveal>

        <ScrollReveal direction="up" threshold={0.05}>
          <ShopByAstrology />
        </ScrollReveal>

        <ScrollReveal direction="up" threshold={0.05}>
          <Services />
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
