import { motion } from "framer-motion";

export default function Manifesto() {
  return (
    <section className="py-12 md:py-24 lg:py-32 px-4 md:px-6 bg-background" data-testid="section-manifesto">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-24 items-start">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="lg:w-1/2"
        >
          <h2 className="text-[28px] md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#2a1f1a] leading-tight" data-testid="heading-manifesto">
            CRYSTALS YOU<br />CAN LIVE BY
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:w-1/2 flex flex-col gap-5"
        >
          <p className="font-mono text-[13px] md:text-base lg:text-lg text-[#2a1f1a] leading-relaxed">
            For too long, healing crystals were seen as mystical objects locked away in boutiques. Reserved for seekers. For the spiritually devoted. Selenite Soul set out to change that.
          </p>
          <p className="font-mono text-[13px] md:text-base lg:text-lg text-[#2a1f1a] leading-relaxed">
            We believe crystals aren't for display. They're for living. For protection. For love. For calm. For owning your energy—because you deserve a life aligned with the universe.
          </p>
        </motion.div>

      </div>
    </section>
  );
}