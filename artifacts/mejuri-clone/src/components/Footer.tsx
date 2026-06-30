import { Link } from "wouter";
import { Instagram, Twitter, Facebook, Youtube, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

const footerLinks = [
  {
    heading: "Shop",
    links: [
      { label: "All Products",        href: "/shop" },
      { label: "New Arrivals",        href: "/shop?filter=new" },
      { label: "Best Sellers",        href: "/shop?filter=best" },
      { label: "Bracelets",           href: "/shop?category=bracelets" },
      { label: "Pendants",            href: "/shop?category=pendants" },
      { label: "Rings",               href: "/shop?category=rings" },
      { label: "Necklaces & Mala",    href: "/shop?category=necklaces" },
      { label: "Gemstones & Crystals",href: "/shop?category=gemstones" },
      { label: "Gifting",             href: "/shop" },
    ],
  },
  {
    heading: "Astrology",
    links: [
      { label: "Kundali Calculator",    href: "/kundali" },
      { label: "Shop by Zodiac",        href: "/shop" },
      { label: "Shop by Concern",       href: "/shop" },
      { label: "Crystal Healing Guide", href: "/about" },
      { label: "Book Consultation",     href: "/kundali" },
      { label: "About Selenite Soul",   href: "/about" },
    ],
  },
  {
    heading: "Account & Orders",
    links: [
      { label: "My Cart",      href: "/cart" },
      { label: "My Wishlist",  href: "/wishlist" },
      { label: "Track Order",  href: "/orders" },
      { label: "Returns",      href: "/returns" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "FAQ",          href: "/faq" },
      { label: "Contact Us",   href: "/contact" },
    ],
  },
];

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href}>
      <motion.span
        className="block text-sm text-[#fdf8f4]/60 cursor-pointer w-fit relative overflow-hidden group"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <span className="group-hover:text-[#c8a951] transition-colors duration-200">{label}</span>
      </motion.span>
    </Link>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  }

  return (
    <footer className="bg-[#2a1f1a] text-[#fdf8f4] pt-16 md:pt-20 pb-8 px-6 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        {/* Top CTA strip */}
        <ScrollReveal direction="up" className="border border-[#fdf8f4]/10 p-6 md:p-8 mb-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#c8a951]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a951]">Free Kundali Reading</span>
            </div>
            <p className="text-lg md:text-xl font-serif font-light text-white">Discover your cosmic crystal prescription</p>
          </div>
          <Link href="/kundali">
            <motion.span
              className="flex items-center gap-2 bg-[#c8a951] text-[#2a1f1a] px-6 py-3 text-[11px] font-bold uppercase tracking-widest cursor-pointer whitespace-nowrap"
              whileHover={{ scale: 1.03, backgroundColor: "#d4b565" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              Get My Kundali <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </ScrollReveal>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand column */}
          <ScrollReveal direction="up" delay={0} className="lg:col-span-2">
            <Link href="/">
              <span
                className="block text-3xl font-normal tracking-normal cursor-pointer mb-4 hover:opacity-80 transition-opacity"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                Selenite Soul
              </span>
            </Link>
            <p className="font-mono text-sm text-[#fdf8f4]/60 max-w-[260px] leading-relaxed mb-6">
              Ethically sourced crystals aligned with your energy — cleansed under the full moon and delivered with love.
            </p>
            <div className="flex gap-4 mb-8">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Twitter,   href: "#" },
                { Icon: Facebook,  href: "#" },
                { Icon: Youtube,   href: "#" },
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  className="w-9 h-9 border border-[#fdf8f4]/20 flex items-center justify-center text-[#fdf8f4]/60"
                  whileHover={{ borderColor: "#c8a951", color: "#c8a951", scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            {/* Newsletter */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#fdf8f4]/40 mb-3">Join Our List</p>
            <form onSubmit={handleSubscribe} className="flex gap-0">
              {subscribed ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-[#c8a951] font-medium"
                >
                  Thank you for joining.
                </motion.p>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-white/5 border border-[#fdf8f4]/20 px-3 py-2.5 text-xs text-[#fdf8f4] placeholder:text-[#fdf8f4]/30 outline-none focus:border-[#c8a951] transition-colors"
                  />
                  <motion.button
                    type="submit"
                    className="bg-[#c8a951] text-[#2a1f1a] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider"
                    whileHover={{ backgroundColor: "#d4b565" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join
                  </motion.button>
                </>
              )}
            </form>
          </ScrollReveal>

          {/* Link columns */}
          {footerLinks.map((col, ci) => (
            <ScrollReveal key={col.heading} direction="up" delay={0.08 + ci * 0.06}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fdf8f4]/40 mb-5">{col.heading}</h4>
              <div className="flex flex-col gap-3">
                {col.links.map(link => (
                  <FooterLink key={link.label} label={link.label} href={link.href} />
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust badges row */}
        <ScrollReveal direction="none" className="border-t border-b border-[#fdf8f4]/10 py-5 mb-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {["100% Natural Crystals", "Lab Tested & Certified", "Full Moon Energised", "1.5L+ Happy Customers", "Free Shipping ₹999+", "Easy 15-Day Returns"].map(badge => (
              <span key={badge} className="text-[9px] font-bold uppercase tracking-widest text-[#fdf8f4]/30">{badge}</span>
            ))}
          </div>
        </ScrollReveal>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#fdf8f4]/30 font-mono">
            © {new Date().getFullYear()} Selenite Soul. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-[#fdf8f4]/30 font-mono">
            {["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Sitemap"].map(item => (
              <Link key={item} href="#">
                <span className="hover:text-[#fdf8f4]/70 cursor-pointer transition-colors">{item}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
