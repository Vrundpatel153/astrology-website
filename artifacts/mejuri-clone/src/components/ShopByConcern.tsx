import { motion } from "framer-motion";
import { Link } from "wouter";
import { concerns } from "@/data/products";

export default function ShopByConcern() {
  return (
    <section className="py-10 md:py-20 bg-background" data-testid="section-shop-by-concern">
      <div className="w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12 px-4"
        >
          <span className="block text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-[#2a1f1a]/70 mb-2">
            SHOP BY
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[52px] font-serif text-[#2a1f1a] mb-4">
            Concern
          </h2>
          <p className="font-mono text-sm md:text-base text-[#2a1f1a]/70 max-w-md mx-auto">
            Find the right crystal for what you want to invite into your life.
          </p>
        </motion.div>

        <div className="w-full overflow-x-auto scrollbar-hide pb-4 px-4 md:px-0">
          <div className="flex md:grid md:grid-cols-5 gap-4 md:gap-0 md:px-0 min-w-max md:min-w-0 w-full">
            {concerns.map((concern, idx) => (
              <Link key={concern.id} href="#">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group cursor-pointer overflow-hidden flex-none w-[60vw] md:w-full aspect-square md:aspect-[3/4]"
                  data-testid={`card-concern-${concern.id}`}
                >
                  <img
                    src={concern.image}
                    alt={concern.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-center text-white">
                    <h3 className="text-xl md:text-2xl font-serif mb-1">{concern.name}</h3>
                    <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.15em] border-b border-white/50 pb-0.5 group-hover:border-white transition-colors">
                      {concern.subtitle}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
