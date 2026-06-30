import { useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft, ArrowRight, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Cart() {
  const [, navigate] = useLocation();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const discount = promoApplied ? Math.round(totalPrice * 0.1) : 0;
  const total = totalPrice + shipping - discount;

  const handlePromo = () => {
    if (promo.trim().toUpperCase() === "SOUL10") setPromoApplied(true);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Title */}
        <ScrollReveal direction="up" className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-light tracking-wide">
            Your Bag
            {totalItems > 0 && (
              <span className="text-sm text-[#2a1f1a]/50 ml-2 font-sans">
                ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </span>
            )}
          </h1>
          <motion.button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#2a1f1a]/60"
            whileHover={{ x: -3, color: "#2a1f1a" }}
            transition={{ duration: 0.18 }}
          >
            <ChevronLeft className="w-3 h-3" /> Continue Shopping
          </motion.button>
        </ScrollReveal>

        {/* Shipping progress bar */}
        {totalPrice > 0 && totalPrice < 999 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white border border-[#e8d9cf] p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]/60 mb-2">
              Add ₹{(999 - totalPrice).toLocaleString()} more for FREE shipping
            </p>
            <div className="h-1 bg-[#e8d9cf] overflow-hidden">
              <motion.div
                className="h-full bg-[#c8a951]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalPrice / 999) * 100, 100)}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
        {totalPrice >= 999 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-green-50 border border-green-200 p-3 text-center"
          >
            <p className="text-xs font-bold text-green-700 uppercase tracking-widest">🎉 You've unlocked FREE shipping!</p>
          </motion.div>
        )}

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShoppingBag className="w-16 h-16 text-[#e8d9cf] mb-6" />
            </motion.div>
            <h2 className="text-xl font-serif font-light text-[#2a1f1a] mb-2">Your bag is empty</h2>
            <p className="text-sm text-[#2a1f1a]/60 mb-8">Add crystals and gemstones to begin your journey</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={() => navigate("/shop")}
                className="bg-[#2a1f1a] text-white px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em]"
                whileHover={{ backgroundColor: "#3d2d25", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                Shop Now
              </motion.button>
              <motion.button
                onClick={() => navigate("/kundali")}
                className="border border-[#c8a951] text-[#c8a951] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em]"
                whileHover={{ backgroundColor: "#c8a951", color: "#2a1f1a", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                ✨ Get Kundali Recommendations
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            {/* Cart Items */}
            <div>
              <div className="hidden md:grid grid-cols-[1fr_120px_100px_40px] gap-4 pb-3 border-b border-[#e8d9cf] mb-2">
                {["Product", "Quantity", "Price", ""].map(h => (
                  <span key={h} className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#2a1f1a]/50">{h}</span>
                ))}
              </div>

              <AnimatePresence initial={false}>
                {items.map(item => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_40px] gap-4 items-center py-5 border-b border-[#e8d9cf]"
                  >
                    {/* Product info */}
                    <div className="flex gap-4 items-start">
                      <motion.button
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="w-20 h-20 md:w-24 md:h-24 bg-[#f7f1ec] overflow-hidden shrink-0"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </motion.button>
                      <div className="flex-1 min-w-0">
                        <button onClick={() => navigate(`/product/${item.product.id}`)} className="text-left group">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]/50 mb-0.5">
                            {item.product.category.replace("-", " & ")}
                          </p>
                          <p className="text-sm font-medium text-[#2a1f1a] leading-tight group-hover:underline">
                            {item.product.name}
                          </p>
                        </button>
                        <p className="text-xs text-[#2a1f1a]/60 mt-1">{item.product.material}</p>
                        <p className="md:hidden text-sm font-medium mt-2">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                        <div className="md:hidden flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#e8d9cf]">
                            <motion.button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#f7f1ec]"
                              whileTap={{ scale: 0.85 }}
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <motion.button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#f7f1ec]"
                              whileTap={{ scale: 0.85 }}
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <motion.button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#2a1f1a]/40 ml-1"
                            whileHover={{ color: "#c84b31", scale: 1.1 }}
                            whileTap={{ scale: 0.85 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Qty */}
                    <div className="hidden md:flex items-center border border-[#e8d9cf] w-fit">
                      <motion.button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#f7f1ec]"
                        whileTap={{ scale: 0.85 }}
                      >
                        <Minus className="w-3 h-3" />
                      </motion.button>
                      <motion.span
                        key={item.quantity}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-9 text-center text-sm font-medium"
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#f7f1ec]"
                        whileTap={{ scale: 0.85 }}
                      >
                        <Plus className="w-3 h-3" />
                      </motion.button>
                    </div>

                    {/* Desktop Price */}
                    <div className="hidden md:block">
                      <motion.p
                        key={item.quantity}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-sm font-medium"
                      >
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </motion.p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-[#2a1f1a]/50">₹{item.product.price.toLocaleString()} each</p>
                      )}
                    </div>

                    {/* Desktop Remove */}
                    <motion.button
                      onClick={() => removeFromCart(item.product.id)}
                      className="hidden md:flex text-[#2a1f1a]/30"
                      whileHover={{ color: "#c84b31", scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <ScrollReveal direction="right" delay={0.1}>
              <div className="bg-[#f7f1ec] p-6 sticky top-24">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#2a1f1a] mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#2a1f1a]/70">Subtotal</span>
                    <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex justify-between text-green-700"
                    >
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Promo (SOUL10)</span>
                      <span className="font-medium">–₹{discount}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#2a1f1a]/70">Shipping</span>
                    <span className={shipping === 0 ? "text-[#2a855d] font-medium" : "font-medium"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                {/* Promo code */}
                <div className="flex gap-2 mb-5">
                  <input
                    type="text"
                    placeholder="Promo code (try SOUL10)"
                    value={promo}
                    onChange={e => setPromo(e.target.value)}
                    disabled={promoApplied}
                    className="flex-1 border border-[#e8d9cf] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#2a1f1a] placeholder:text-[#2a1f1a]/40 transition-colors disabled:opacity-50"
                  />
                  <motion.button
                    onClick={handlePromo}
                    disabled={promoApplied}
                    className="px-4 py-2.5 border border-[#2a1f1a] text-[10px] font-bold uppercase tracking-wider disabled:opacity-40"
                    whileHover={!promoApplied ? { backgroundColor: "#2a1f1a", color: "white" } : {}}
                    whileTap={!promoApplied ? { scale: 0.95 } : {}}
                    transition={{ duration: 0.18 }}
                  >
                    {promoApplied ? "✓" : "Apply"}
                  </motion.button>
                </div>

                <div className="border-t border-[#e8d9cf] pt-4 mb-5">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.08, color: "#c8a951" }}
                      animate={{ scale: 1, color: "#2a1f1a" }}
                      transition={{ duration: 0.3 }}
                    >
                      ₹{total.toLocaleString()}
                    </motion.span>
                  </div>
                  <p className="text-[10px] text-[#2a1f1a]/50 mt-1">Including all taxes</p>
                </div>

                <motion.button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#2a1f1a] text-white py-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]"
                  whileHover={{ backgroundColor: "#3d2d25", scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="mt-4 flex items-center justify-center gap-4 text-[9px] text-[#2a1f1a]/50 uppercase tracking-widest">
                  <span>🔒 Secure Payment</span>
                  <span>·</span>
                  <span>Easy Returns</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
