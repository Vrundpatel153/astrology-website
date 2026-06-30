import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, MapPin, ShoppingBag, Menu, X, Heart, Sparkles, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "New Arrivals",      href: "/shop" },
  { label: "Shop by Product",   href: "/shop" },
  { label: "Shop by Concern",   href: "/shop" },
  { label: "Shop by Astrology", href: "/shop" },
  { label: "Best Sellers",      href: "/shop" },
  { label: "Gifting",           href: "/shop" },
  { label: "Kundali",           href: "/kundali", gold: true },
];

const SIDEBAR_SECTIONS = [
  {
    heading: "Shop",
    links: [
      { label: "All Products",          href: "/shop" },
      { label: "New Arrivals",          href: "/shop" },
      { label: "Best Sellers",          href: "/shop" },
      { label: "Bracelets",             href: "/shop" },
      { label: "Pendants",              href: "/shop" },
      { label: "Rings",                 href: "/shop" },
      { label: "Necklaces & Mala",      href: "/shop" },
      { label: "Ear Studs & Anklets",   href: "/shop" },
      { label: "Gemstones & Raw Crystals", href: "/shop" },
      { label: "Gifting",               href: "/shop" },
    ],
  },
  {
    heading: "Astrology",
    links: [
      { label: "Kundali Calculator",    href: "/kundali", gold: true },
      { label: "Shop by Zodiac",        href: "/shop" },
      { label: "Shop by Concern",       href: "/shop" },
      { label: "Crystal Healing Guide", href: "/" },
      { label: "Book a Consultation",   href: "/kundali" },
    ],
  },
  {
    heading: "My Account",
    links: [
      { label: "My Cart",     href: "/cart" },
      { label: "Checkout",    href: "/checkout" },
      { label: "Track Order", href: "/" },
      { label: "Returns",     href: "/" },
      { label: "Contact Us",  href: "/" },
    ],
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const [, navigate] = useLocation();
  const [location] = useLocation();

  const isActive = (href: string) => href !== "/" && location.startsWith(href);

  return (
    <>
      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start pt-24 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="max-w-xl w-full mx-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white flex items-center px-4 py-4 gap-3">
                <Search className="w-5 h-5 text-[#2a1f1a]/40" />
                <input
                  autoFocus
                  placeholder="Search crystals, concerns, zodiac..."
                  className="flex-1 text-base text-[#2a1f1a] outline-none placeholder:text-[#2a1f1a]/30"
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5 text-[#2a1f1a]/50" />
                </button>
              </div>
              <div className="bg-[#f7f1ec] px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#2a1f1a]/40 mb-2">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Rose Quartz", "Amethyst Bracelet", "7 Chakra", "Pyrite", "Kundali"].map(s => (
                    <span
                      key={s}
                      onClick={() => { navigate("/shop"); setSearchOpen(false); }}
                      className="text-xs border border-[#e8d9cf] px-3 py-1.5 text-[#2a1f1a] cursor-pointer hover:bg-[#e8d9cf] transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 bg-white border-b border-[#e8d9cf]" data-testid="header">
        <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 max-w-[1600px] mx-auto">

          {/* Left */}
          <div className="flex items-center flex-1">
            <motion.button
              className="md:hidden flex items-center justify-center w-9 h-9 -ml-1 text-[#2a1f1a]"
              onClick={() => setMenuOpen(true)}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </motion.button>
            <Link href="/">
              <motion.span
                className="hidden md:inline text-xl md:text-2xl font-normal text-[#2a1f1a] cursor-pointer"
                style={{ fontFamily: "'Pacifico', cursive" }}
                whileHover={{ opacity: 0.75 }}
                transition={{ duration: 0.2 }}
              >
                Selenite Soul
              </motion.span>
            </Link>
          </div>

          {/* Center */}
          <div className="flex-none">
            <Link href="/">
              <span
                className="md:hidden text-xl font-normal text-[#2a1f1a] cursor-pointer"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                Selenite Soul
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-5 lg:gap-7">
              {NAV_LINKS.map(link => (
                <Link key={link.label} href={link.href}>
                  <motion.span
                    className={`text-[11px] font-medium tracking-[0.1em] uppercase relative cursor-pointer pb-1 whitespace-nowrap ${link.gold ? "text-[#c8a951]" : isActive(link.href) ? "text-[#2a1f1a]" : "text-[#2a1f1a]/80"}`}
                    whileHover={{ opacity: 1 }}
                  >
                    {link.label}
                    <motion.span
                      className="absolute left-0 bottom-0 w-full h-[1.5px] bg-current origin-left"
                      initial={{ scaleX: isActive(link.href) ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  </motion.span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right icons */}
          <div className="flex items-center justify-end gap-3 md:gap-4 flex-1 text-[#2a1f1a]">
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-1.5 hover:opacity-70"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
              <span className="text-xs font-medium uppercase tracking-widest">Search</span>
            </motion.button>
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="md:hidden"
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </motion.button>

            <motion.button
              onClick={() => navigate("/kundali")}
              className="md:hidden"
              whileTap={{ scale: 0.9 }}
              aria-label="Kundali"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#c8a951]">
                <polygon points="10,2 11.8,7.8 18,7.8 13,11.4 14.9,17.2 10,13.6 5.1,17.2 7,11.4 2,7.8 8.2,7.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <motion.button
              className="hidden md:flex items-center gap-1.5 hover:opacity-70"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            >
              <MapPin className="w-5 h-5 stroke-[1.5]" />
              <span className="text-xs font-medium uppercase tracking-widest">Store</span>
            </motion.button>

            <motion.button
              className="hidden md:flex"
              onClick={() => navigate("/wishlist")}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
            </motion.button>

            <motion.button
              onClick={() => navigate("/cart")}
              className="relative"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1.5 bg-[#2a1f1a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 z-50 w-[310px] bg-white flex flex-col md:hidden shadow-2xl overflow-hidden"
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-[#e8d9cf] shrink-0">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <span
                    className="text-xl font-normal text-[#2a1f1a] cursor-pointer"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    Selenite Soul
                  </span>
                </Link>
                <motion.button
                  onClick={() => setMenuOpen(false)}
                  whileTap={{ scale: 0.85 }}
                >
                  <X className="w-5 h-5 text-[#2a1f1a]" />
                </motion.button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto">
                {SIDEBAR_SECTIONS.map((section, si) => (
                  <div key={section.heading} className="py-4 border-b border-[#f7f1ec] last:border-0">
                    <p className="px-5 mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#2a1f1a]/40">
                      {section.heading}
                    </p>
                    {section.links.map((link, li) => (
                      <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                        <motion.span
                          className={`flex items-center justify-between px-5 py-2.5 text-[13px] font-medium cursor-pointer group ${link.gold ? "text-[#c8a951]" : "text-[#2a1f1a]"}`}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.05 + si * 0.04 + li * 0.025 }}
                          whileHover={{ x: 4, backgroundColor: "#fdf8f4" }}
                        >
                          {link.label}
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                        </motion.span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="p-4 border-t border-[#e8d9cf] shrink-0 space-y-2">
                <motion.button
                  onClick={() => { navigate("/cart"); setMenuOpen(false); }}
                  className="w-full bg-[#2a1f1a] text-white py-3 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  whileHover={{ backgroundColor: "#3d2d25" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  View Cart {totalItems > 0 && `(${totalItems})`}
                </motion.button>
                <motion.button
                  onClick={() => { navigate("/kundali"); setMenuOpen(false); }}
                  className="w-full border border-[#c8a951] text-[#c8a951] py-3 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  whileHover={{ backgroundColor: "#c8a951", color: "#2a1f1a" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                >
                  <Star className="w-4 h-4" /> Free Kundali Reading
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
