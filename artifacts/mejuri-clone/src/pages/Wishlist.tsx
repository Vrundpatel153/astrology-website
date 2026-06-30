import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Heart, ShoppingBag, Trash2, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { useState } from "react";

export default function Wishlist() {
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const [wishlistIds, setWishlistIds] = useState<number[]>([1, 5, 18, 85, 122, 191, 201]);

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  function removeFromWishlist(id: number) {
    setWishlistIds(prev => prev.filter(i => i !== id));
  }

  function handleAddToCart(product: typeof products[0]) {
    addToCart(product);
    removeFromWishlist(product.id);
  }

  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      <section className="pt-20 pb-12 px-6 text-center bg-[#f5ede4]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Heart className="w-8 h-8 text-[#c8a951] mx-auto mb-4 fill-[#c8a951]" />
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2a1f1a] mb-3">Your Wishlist</h1>
          <p className="text-[#2a1f1a]/50">{wishlistProducts.length} saved items</p>
        </motion.div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <AnimatePresence mode="popLayout">
            {wishlistProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <Sparkles className="w-10 h-10 text-[#c8a951]/40 mx-auto mb-6" />
                <h2 className="text-2xl font-serif font-light text-[#2a1f1a] mb-3">Your wishlist is empty</h2>
                <p className="text-[#2a1f1a]/50 mb-8">Explore our crystals and save the ones that call to you.</p>
                <Link href="/shop">
                  <motion.span className="inline-block bg-[#c8a951] text-[#2a1f1a] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer" whileHover={{ scale: 1.02 }}>
                    Explore Crystals
                  </motion.span>
                </Link>
              </motion.div>
            ) : (
              <motion.div key="grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-white border border-[#e8d9cf] overflow-hidden"
                  >
                    <div
                      className="relative overflow-hidden cursor-pointer aspect-square"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.badge && (
                        <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${product.badge === "BEST SELLER" ? "bg-[#c8a951] text-[#2a1f1a]" : product.badge === "NEW" ? "bg-[#2a1f1a] text-[#fdf8f4]" : "bg-red-500 text-white"}`}>
                          {product.badge}
                        </span>
                      )}
                      <motion.button
                        className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={e => { e.stopPropagation(); removeFromWishlist(product.id); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                    </div>
                    <div className="p-4">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#2a1f1a]/40 mb-1">{product.category}</p>
                      <h3
                        className="text-sm font-medium text-[#2a1f1a] mb-2 cursor-pointer hover:text-[#c8a951] transition-colors leading-snug line-clamp-2"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-bold text-[#2a1f1a]">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#2a1f1a]/40 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <motion.button
                        className="w-full bg-[#2a1f1a] text-[#fdf8f4] py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                        onClick={() => handleAddToCart(product)}
                        whileHover={{ backgroundColor: "#c8a951", color: "#2a1f1a" }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
