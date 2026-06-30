import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Services() {
  return (
    <section className="py-10 md:py-20 px-4 md:px-6 max-w-[1600px] mx-auto bg-background" data-testid="section-services">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[32px] md:text-[52px] lg:text-[60px] font-bold text-[#2a1f1a] uppercase tracking-tight leading-none mb-4 md:mb-8" data-testid="heading-stores-services">
          SERVICES &amp; STUDIOS
        </h2>

        <p className="font-mono text-[13px] md:text-[15px] text-[#2a1f1a]/70 mb-8 md:mb-12 max-w-2xl leading-relaxed">
          Discover our thoughtfully designed stores and Piercing Studios across North America, Australia and the UK.
        </p>

        {/* Trust Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-12 py-6 mb-12 border-y border-[#e8d9cf]">
          <span className="text-xs font-medium uppercase tracking-widest text-[#2a1f1a] text-center">100% Natural</span>
          <span className="hidden md:block w-px h-4 bg-[#e8d9cf]"></span>
          <span className="text-xs font-medium uppercase tracking-widest text-[#2a1f1a] text-center">Energised After Order</span>
          <span className="hidden md:block w-px h-4 bg-[#e8d9cf]"></span>
          <span className="text-xs font-medium uppercase tracking-widest text-[#2a1f1a] text-center">Lab Testing Certificate Included</span>
          <span className="hidden md:block w-px h-4 bg-[#e8d9cf]"></span>
          <span className="text-xs font-medium uppercase tracking-widest text-[#2a1f1a] text-center">1.5L+ Happy Customers</span>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[#e8d9cf]">

          {/* Book Appointment Card */}
          <Link href="#">
            <div className="group block bg-background cursor-pointer overflow-hidden" data-testid="card-book-appointment">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/store.png"
                  alt="Luxury jewelry boutique interior"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  data-testid="img-store"
                />
              </div>
              <div className="p-6 md:p-8 bg-background">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-tight text-[#2a1f1a] mb-2">
                  BOOK A CRYSTAL READING
                </h3>
                <p className="font-mono text-xs md:text-sm text-[#2a1f1a]/70">
                  Experience styling in person with our experts.
                </p>
              </div>
            </div>
          </Link>

          {/* Find a Store Card */}
          <Link href="#">
            <div className="group block bg-[#f7f1ec] cursor-pointer overflow-hidden" data-testid="card-find-store">
              <div className="aspect-[4/3] w-full bg-[#f7f1ec] flex items-center justify-center p-12 relative overflow-hidden">
                <div className="w-full h-full border border-[#e8d9cf] relative group-hover:scale-105 transition-transform duration-700 bg-background">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#2a1f1a] rounded-full ring-4 ring-[#2a1f1a]/20" />
                </div>
              </div>
              <div className="p-6 md:p-8 bg-background border-t border-[#e8d9cf]">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-tight text-[#2a1f1a] mb-2">
                  FIND A STUDIO NEAR YOU
                </h3>
                <p className="font-mono text-xs md:text-sm text-[#2a1f1a]/70">
                  Locate a studio near you.
                </p>
              </div>
            </div>
          </Link>

        </div>
      </motion.div>
    </section>
  );
}