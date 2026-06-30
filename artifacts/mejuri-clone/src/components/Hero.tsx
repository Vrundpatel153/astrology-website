import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#2a1f1a]" style={{ height: "min(56vw, calc(100vh - 56px))", minHeight: "260px" }} data-testid="section-hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero.png"
          alt="Crystals flat lay"
          className="w-full h-full object-cover object-center opacity-90"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-[9vw] md:text-6xl lg:text-8xl font-bold text-white uppercase tracking-tight leading-[0.9] mb-3 md:mb-6 drop-shadow-sm" data-testid="heading-hero">
            ALIGN YOUR ENERGY
          </h1>
          <Link href="#">
            <span className="inline-block text-white text-[11px] md:text-sm font-medium uppercase tracking-[0.15em] border-b border-white/50 pb-0.5 hover:border-white transition-colors cursor-pointer" data-testid="link-shop-now">
              SHOP HEALING CRYSTALS
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}