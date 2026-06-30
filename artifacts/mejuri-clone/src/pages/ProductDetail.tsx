import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Heart, ShoppingBag, ChevronLeft, Star, Shield, Truck, RotateCcw, Plus, Minus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f4]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-2xl font-serif text-[#2a1f1a] mb-4">Crystal not found</p>
          <motion.button
            onClick={() => navigate("/shop")}
            className="text-xs uppercase tracking-widest underline text-[#2a1f1a]"
            whileHover={{ opacity: 0.6 }}
          >
            Back to Shop
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    navigate("/cart");
  };

  const benefits = [
    "Energetically cleansed before dispatch",
    "Certificate of authenticity included",
    "Lab-tested genuine gemstone",
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 py-3 border-b border-[#e8d9cf] bg-white">
        <motion.button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#2a1f1a]/60"
          whileHover={{ x: -3, color: "#2a1f1a" }}
          transition={{ duration: 0.18 }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Shop
        </motion.button>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

          {/* Left: Image gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-[#f7f1ec] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedThumb}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  whileHover={{ scale: 1.04 }}
                />
              </AnimatePresence>
              {product.badge && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`absolute top-4 left-4 text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5 ${
                    product.badge === "SALE" ? "bg-[#c84b31] text-white" :
                    product.badge === "NEW"  ? "bg-[#2a1f1a] text-white" :
                    product.badge === "BEST SELLER" ? "bg-[#c8a951] text-[#2a1f1a]" :
                    "bg-[#2a1f1a] text-white"
                  }`}
                >
                  {product.badge}
                </motion.span>
              )}
              <motion.button
                onClick={() => setWishlisted(w => !w)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/90 flex items-center justify-center"
                whileHover={{ scale: 1.12, backgroundColor: "white" }}
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.15 }}
              >
                <motion.div animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                  <Heart className={`w-4 h-4 transition-all duration-200 ${wishlisted ? "fill-[#c84b31] text-[#c84b31]" : "text-[#2a1f1a]"}`} />
                </motion.div>
              </motion.button>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map(i => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`aspect-square bg-[#f7f1ec] overflow-hidden border-2 transition-colors ${selectedThumb === i ? "border-[#2a1f1a]" : "border-transparent"}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <img src={product.image} alt="" className={`w-full h-full object-cover transition-opacity ${selectedThumb === i ? "opacity-100" : "opacity-75 hover:opacity-100"}`} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2a1f1a]/50 mb-2">
              {product.category.replace("-", " & ")}
            </p>
            <h1 className="text-2xl md:text-3xl font-serif font-light text-[#2a1f1a] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div key={i} whileHover={{ scale: 1.2 }} transition={{ duration: 0.12 }}>
                    <Star className={`w-3.5 h-3.5 ${i <= 4 ? "fill-[#c8a951] text-[#c8a951]" : "text-[#e8d9cf]"}`} />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-[#2a1f1a]/60">(4.8) · 247 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-2xl font-light text-[#2a1f1a]">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-[#2a1f1a]/40 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <motion.span
                    className="text-xs font-bold text-[#c84b31]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {product.savePercent}% OFF
                  </motion.span>
                </>
              )}
            </div>

            {/* Details grid */}
            <div className="border-t border-b border-[#e8d9cf] py-4 mb-5 space-y-2.5">
              {[
                { label: "Material", value: product.material },
                ...(product.gemstone ? [{ label: "Gemstone", value: product.gemstone }] : []),
                ...(product.concern?.length ? [{ label: "Intention", value: product.concern.join(", ") }] : []),
              ].map(({ label, value }) => (
                <motion.div
                  key={label}
                  className="flex justify-between text-xs"
                  whileHover={{ backgroundColor: "#f7f1ec", paddingLeft: "4px", paddingRight: "4px" }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-[#2a1f1a]/60 uppercase tracking-widest">{label}</span>
                  <span className="font-medium capitalize">{value}</span>
                </motion.div>
              ))}
            </div>

            {/* Swatches */}
            {product.swatches && product.swatches.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a] mb-2">Crystals</p>
                <div className="flex gap-2 flex-wrap">
                  {product.swatches.map((color, i) => (
                    <motion.div
                      key={i}
                      className="w-6 h-6 border-2 border-white ring-1 ring-[#e8d9cf] cursor-pointer"
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: 1.3, ring: "2px" }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]">Qty</p>
              <div className="flex items-center border border-[#e8d9cf]">
                <motion.button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#2a1f1a]"
                  whileHover={{ backgroundColor: "#f7f1ec" }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                >
                  <Minus className="w-3.5 h-3.5" />
                </motion.button>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={quantity}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="w-10 text-center text-sm font-medium"
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <motion.button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#2a1f1a]"
                  whileHover={{ backgroundColor: "#f7f1ec" }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                >
                  <Plus className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <motion.button
                onClick={handleBuyNow}
                className="w-full bg-[#2a1f1a] text-white h-14 text-[11px] font-bold uppercase tracking-[0.15em]"
                whileHover={{ backgroundColor: "#3d2d25", scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                Buy Now
              </motion.button>
              <motion.button
                onClick={handleAddToCart}
                className="relative w-full border border-[#2a1f1a] text-[#2a1f1a] h-14 text-[11px] font-bold uppercase tracking-[0.15em] overflow-hidden"
                whileHover={{ backgroundColor: "#f7f1ec", scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <AnimatePresence mode="wait">
                  {addedAnim ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-2 text-[#2a855d] absolute inset-0"
                    >
                      <ShoppingBag className="w-4 h-4" /> Added to Cart ✓
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Benefits */}
            <div className="space-y-2.5 mb-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2.5 text-xs text-[#2a1f1a]/70"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                >
                  <Shield className="w-3.5 h-3.5 text-[#c8a951] shrink-0" />
                  {b}
                </motion.div>
              ))}
            </div>

            {/* Shipping info */}
            <motion.div
              className="bg-[#f7f1ec] p-4 space-y-2.5"
              whileHover={{ backgroundColor: "#f0e9e1" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2.5 text-xs text-[#2a1f1a]">
                <Truck className="w-4 h-4 text-[#c8a951]" />
                <span>Free shipping on orders above ₹999</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#2a1f1a]">
                <RotateCcw className="w-4 h-4 text-[#c8a951]" />
                <span>Easy 15-day returns</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Description + How to Use */}
        <ScrollReveal direction="up" className="mt-12 md:mt-16 border-t border-[#e8d9cf] pt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2a1f1a] mb-4">About This Crystal</h2>
            <p className="text-sm text-[#2a1f1a]/70 leading-relaxed">
              Each {product.name} is handpicked from ethically sourced mines across India and
              South America. Our gemologists verify authenticity and energy quality before
              each piece is cleansed under the full moon and infused with Reiki healing energy.
              Every crystal carries its own unique frequency — no two are identical.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2a1f1a] mb-4">How to Use</h2>
            <ul className="space-y-2">
              {[
                "Hold during morning meditation for 5–10 minutes",
                "Place on your altar or workspace for continuous energy",
                "Sleep with it under your pillow to enhance dream clarity",
                "Carry in your pocket as a daily talisman",
              ].map((tip, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-[#2a1f1a]/70"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <span className="text-[#c8a951] font-bold mt-0.5">·</span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Kundali CTA */}
        <ScrollReveal direction="up" className="mt-10">
          <motion.div
            className="bg-[#f7f1ec] border border-[#c8a951]/30 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5 cursor-pointer"
            onClick={() => navigate("/kundali")}
            whileHover={{ borderColor: "rgba(200,169,81,0.7)", backgroundColor: "#f2e9d6" }}
            transition={{ duration: 0.2 }}
          >
            <div className="shrink-0 w-12 h-12 rounded-full bg-[#c8a951]/10 border border-[#c8a951]/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#c8a951]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a951] mb-1">Not sure this is right for you?</p>
              <p className="text-sm text-[#2a1f1a]/70">
                Try our <strong>free Kundali calculator</strong> — get personalised crystal recommendations based on your Vedic birth chart.
              </p>
            </div>
            <motion.span
              className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-[#c8a951] whitespace-nowrap"
              whileHover={{ x: 4 }}
            >
              Try Kundali →
            </motion.span>
          </motion.div>
        </ScrollReveal>

        {/* Related Products */}
        {related.length > 0 && (
          <ScrollReveal direction="up" className="mt-14 border-t border-[#e8d9cf] pt-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#2a1f1a] mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rel, i) => (
                <motion.button
                  key={rel.id}
                  onClick={() => navigate(`/product/${rel.id}`)}
                  className="text-left group"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="aspect-square bg-[#f7f1ec] overflow-hidden mb-3">
                    <motion.img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.07 }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#2a1f1a] leading-tight mb-1 group-hover:opacity-70 transition-opacity">
                    {rel.name}
                  </p>
                  <p className="text-xs text-[#2a1f1a]/70">₹{rel.price.toLocaleString()}</p>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>

      <Footer />
    </div>
  );
}
