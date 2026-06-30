import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Heart, Plus, SlidersHorizontal, X, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { products, categories, newArrivals, bestSellers } from "@/data/products";
import { useCart } from "@/context/CartContext";

const gemstones = [
  "Amethyst","Rose Quartz","Citrine","Black Tourmaline","Lapis Lazuli",
  "Pyrite","Moonstone","Turquoise","Jade","Selenite","Multi-stone",
  "Tiger Eye","Carnelian","Clear Quartz","Green Aventurine","Garnet",
  "Aquamarine","Labradorite","Malachite","Red Jasper","Fluorite",
];

export default function Shop() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filterParam = useMemo(() => new URLSearchParams(search).get("filter"), [search]);
  const categoryParam = useMemo(() => new URLSearchParams(search).get("category"), [search]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [selectedGemstones, setSelectedGemstones] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    setSelectedCategories(categoryParam ? [categoryParam] : []);
    setSelectedGemstones([]);
  }, [categoryParam]);

  const toggleWishlist = (id: number) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const toggleCategory = (id: string) =>
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const toggleGemstone = (id: string) =>
    setSelectedGemstones(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  const baseProducts = useMemo(() => {
    if (filterParam === "new") return newArrivals;
    if (filterParam === "best") return bestSellers;
    return products;
  }, [filterParam]);

  const filteredProducts = useMemo(() => baseProducts.filter(p => {
    const catMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const gemMatch = selectedGemstones.length === 0 || (p.gemstone && selectedGemstones.some(g => p.gemstone!.includes(g)));
    return catMatch && gemMatch;
  }), [baseProducts, selectedCategories, selectedGemstones]);

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]" data-testid="page-shop">
      <Header />

      {/* Filter bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8d9cf] bg-white sticky top-14 md:top-16 z-30">
        <div className="text-xs font-mono text-[#2a1f1a]/70">
          {filteredProducts.length} products
        </div>
        <motion.button
          className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#2a1f1a]"
          onClick={() => setMobileFilterOpen(true)}
          whileHover={{ opacity: 0.7 }}
          whileTap={{ scale: 0.95 }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          FILTER + SORT
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-[260px] lg:w-[280px] shrink-0 border-r border-[#e8d9cf] bg-[#f7f1ec]/50 min-h-screen p-6">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2a1f1a] mb-4">Product Type</h3>
              <div className="space-y-3">
                {categories.map((cat, i) => (
                  <motion.label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <motion.div
                      className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategories.includes(cat.id) ? "bg-[#2a1f1a] border-[#2a1f1a]" : "border-[#e8d9cf] group-hover:border-[#2a1f1a]"}`}
                      onClick={() => toggleCategory(cat.id)}
                      whileTap={{ scale: 0.85 }}
                    >
                      {selectedCategories.includes(cat.id) && (
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white"
                        />
                      )}
                    </motion.div>
                    <span className="text-sm text-[#2a1f1a] group-hover:text-[#2a1f1a]">{cat.name}</span>
                    <span className="ml-auto text-xs text-[#2a1f1a]/40">{cat.count}</span>
                  </motion.label>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="h-px bg-[#e8d9cf] mb-8" />

          <ScrollReveal direction="left" delay={0.2}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2a1f1a] mb-4">Gemstone</h3>
              <div className="space-y-3">
                {gemstones.map((gem, i) => (
                  <motion.label
                    key={gem}
                    className="flex items-center gap-3 cursor-pointer group"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.025 }}
                  >
                    <motion.div
                      className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedGemstones.includes(gem) ? "bg-[#2a1f1a] border-[#2a1f1a]" : "border-[#e8d9cf] group-hover:border-[#2a1f1a]"}`}
                      onClick={() => toggleGemstone(gem)}
                      whileTap={{ scale: 0.85 }}
                    >
                      {selectedGemstones.includes(gem) && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white" />
                      )}
                    </motion.div>
                    <span className="text-sm text-[#2a1f1a]">{gem}</span>
                  </motion.label>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Kundali CTA */}
          <motion.div
            className="mt-10 border border-[#c8a951]/40 p-4 bg-[#c8a951]/5 cursor-pointer"
            whileHover={{ backgroundColor: "rgba(200,169,81,0.12)", borderColor: "rgba(200,169,81,0.7)" }}
            onClick={() => navigate("/kundali")}
          >
            <Sparkles className="w-4 h-4 text-[#c8a951] mb-2" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#c8a951] mb-1">Find Your Crystal</p>
            <p className="text-[11px] text-[#2a1f1a]/60 leading-relaxed">Get personalized recommendations from your Kundali</p>
          </motion.div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.4), ease: [0.22, 1, 0.36, 1] }}
                  className="group relative border-b border-r border-[#e8d9cf] cursor-pointer bg-white"
                  onClick={() => navigate(`/product/${product.id}`)}
                  whileHover={{ zIndex: 1 }}
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-[#f7f1ec] overflow-hidden">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.07 }}
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span className={`absolute top-2.5 left-2.5 text-[8px] font-bold uppercase tracking-[0.12em] px-2 py-1 ${
                        product.badge === "SALE" ? "bg-[#c84b31] text-white" :
                        product.badge === "NEW"  ? "bg-[#2a1f1a] text-white" :
                        product.badge === "BEST SELLER" ? "bg-[#c8a951] text-[#2a1f1a]" :
                        "bg-[#2a1f1a] text-white"
                      }`}>
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist */}
                    <motion.button
                      className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Heart className={`w-3.5 h-3.5 stroke-[1.5] transition-all ${wishlist.includes(product.id) ? "fill-[#c84b31] text-[#c84b31] scale-110" : "text-[#2a1f1a]"}`} />
                    </motion.button>

                    {/* Add to cart */}
                    <motion.button
                      className={`absolute bottom-2.5 right-2.5 w-8 h-8 flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100 ${addedId === product.id ? "bg-green-600" : "bg-[#2a1f1a]"}`}
                      onClick={e => handleAddToCart(e, product)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ duration: 0.15 }}
                    >
                      <AnimatePresence mode="wait">
                        {addedId === product.id ? (
                          <motion.span key="check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} className="text-[11px] font-bold">✓</motion.span>
                        ) : (
                          <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Plus className="w-4 h-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Hover overlay */}
                    <motion.div
                      className="absolute inset-0 bg-[#2a1f1a]/0 group-hover:bg-[#2a1f1a]/5 transition-colors duration-300 pointer-events-none"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 md:p-4 space-y-2">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#2a1f1a]/50 mb-0.5">
                        {product.category.replace("-", " & ")}
                      </p>
                      <p className="text-[11px] md:text-xs font-medium text-[#2a1f1a] leading-tight uppercase tracking-[0.06em] group-hover:opacity-70 transition-opacity">
                        {product.name}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <p className="text-[11px] md:text-xs font-bold text-[#2a1f1a]">₹{product.price.toLocaleString()}</p>
                        {product.originalPrice && (
                          <p className="text-[9px] md:text-[10px] text-[#2a1f1a]/50 line-through">₹{product.originalPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {product.swatches && product.swatches.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {product.swatches.slice(0, 4).map((color, i) => (
                            <motion.div
                              key={i}
                              className="w-3 h-3 md:w-3.5 md:h-3.5 border border-[#e8d9cf] cursor-pointer"
                              style={{ backgroundColor: color }}
                              whileHover={{ scale: 1.3 }}
                              transition={{ duration: 0.15 }}
                            />
                          ))}
                          {product.swatches.length > 4 && (
                            <span className="text-[9px] text-[#2a1f1a]/50">+{product.swatches.length - 4}</span>
                          )}
                        </div>
                      )}
                      <span className="text-[9px] md:text-[10px] text-[#2a1f1a]/70 truncate">{product.material}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center flex flex-col items-center justify-center bg-white"
              >
                <p className="font-serif text-2xl mb-4 text-[#2a1f1a]">No products found</p>
                <motion.button
                  onClick={() => { setSelectedCategories([]); setSelectedGemstones([]); }}
                  className="text-xs uppercase tracking-widest font-bold underline"
                  whileHover={{ opacity: 0.7 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear all filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 md:hidden bg-black/40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-50 md:hidden bg-white w-[min(340px,95vw)] flex flex-col overflow-hidden"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="sticky top-0 bg-white border-b border-[#e8d9cf] px-4 h-14 flex items-center justify-between z-10">
                <span className="text-sm font-bold uppercase tracking-widest text-[#2a1f1a]">Filters</span>
                <motion.button onClick={() => setMobileFilterOpen(false)} whileTap={{ scale: 0.85 }}>
                  <X className="w-5 h-5 text-[#2a1f1a]" />
                </motion.button>
              </div>
              <div className="flex-1 p-4 space-y-8 pb-24 overflow-y-auto">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2a1f1a] mb-4">Product Type</h3>
                  <div className="space-y-4">
                    {categories.map(cat => (
                      <motion.label
                        key={cat.id}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => toggleCategory(cat.id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className={`w-5 h-5 border flex items-center justify-center ${selectedCategories.includes(cat.id) ? "bg-[#2a1f1a] border-[#2a1f1a]" : "border-[#e8d9cf]"}`}
                          whileTap={{ scale: 0.85 }}
                        >
                          {selectedCategories.includes(cat.id) && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white" />
                          )}
                        </motion.div>
                        <span className="text-base">{cat.name}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-[#e8d9cf] w-full" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2a1f1a] mb-4">Gemstone</h3>
                  <div className="space-y-4">
                    {gemstones.map(gem => (
                      <motion.label
                        key={gem}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => toggleGemstone(gem)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className={`w-5 h-5 border flex items-center justify-center ${selectedGemstones.includes(gem) ? "bg-[#2a1f1a] border-[#2a1f1a]" : "border-[#e8d9cf]"}`}
                          whileTap={{ scale: 0.85 }}
                        >
                          {selectedGemstones.includes(gem) && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white" />
                          )}
                        </motion.div>
                        <span className="text-base">{gem}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-[#e8d9cf] flex gap-3">
                <motion.button
                  className="flex-1 border border-[#2a1f1a] text-[#2a1f1a] h-12 flex items-center justify-center text-xs font-bold uppercase tracking-widest"
                  onClick={() => { setSelectedCategories([]); setSelectedGemstones([]); }}
                  whileHover={{ backgroundColor: "#f7f1ec" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Clear All
                </motion.button>
                <motion.button
                  className="flex-1 bg-[#2a1f1a] text-white h-12 flex items-center justify-center text-xs font-bold uppercase tracking-widest gap-2"
                  onClick={() => setMobileFilterOpen(false)}
                  whileHover={{ backgroundColor: "#3d2d25" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingBag className="w-4 h-4" /> View {filteredProducts.length} Items
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
