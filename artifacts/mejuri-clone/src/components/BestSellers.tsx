import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { bestSellers } from "@/data/products";

export default function BestSellers() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (idx: number) => emblaApi && emblaApi.scrollTo(idx);

  return (
    <section className="py-10 md:py-20 bg-background overflow-hidden" data-testid="section-best-sellers">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="px-4 md:px-[60px] mb-6 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <h2 className="text-[32px] md:text-[52px] lg:text-[60px] font-bold text-[#2a1f1a] uppercase tracking-tight leading-none" data-testid="heading-best-sellers">
            MOST CHOSEN FOR RESULTS
          </h2>
        </div>
        <a href="#" className="text-sm font-bold uppercase tracking-widest text-[#2a1f1a] border-b border-[#2a1f1a] pb-0.5 whitespace-nowrap self-start">
          Shop Energetic Favourites →
        </a>
      </motion.div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[42vw] md:w-[340px] border-r border-y border-[#e8d9cf] bg-[#f7f1ec] group cursor-pointer relative"
              data-testid={`card-product-${product.id}`}
            >
              {product.badge && (
                <div className="absolute top-3 right-3 z-10 bg-[#8b2020] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  {product.badge} {product.savePercent ? `(SAVE ${product.savePercent}%)` : ''}
                </div>
              )}
              {/* Image Area */}
              <div className="relative aspect-square w-full bg-[#f7f1ec] p-4 md:p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  data-testid={`img-product-${product.id}`}
                />
                <button
                  className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-8 h-8 md:w-9 md:h-9 bg-background border border-[#e8d9cf] flex items-center justify-center hover:bg-[#2a1f1a] hover:text-white hover:border-[#2a1f1a] transition-colors"
                  aria-label="Quick add"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3 md:p-4 bg-background border-t border-[#e8d9cf]">
                <h3 className="text-[10px] md:text-[11px] font-normal uppercase tracking-widest text-[#2a1f1a] mb-1.5 truncate" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[13px] md:text-[15px] font-bold text-[#2a1f1a]">
                    ₹{product.price}
                  </p>
                  {product.originalPrice && (
                    <p className="text-[11px] md:text-[13px] text-[#2a1f1a]/50 line-through">
                      ₹{product.originalPrice}
                    </p>
                  )}
                </div>
                {/* Color swatches */}
                {product.swatches && product.swatches.length > 0 && (
                  <div className="flex items-center gap-1 mb-1 mt-2">
                    {product.swatches.slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 border border-[#e8d9cf]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {product.swatches.length > 4 && (
                      <span className="text-[9px] text-muted-foreground ml-1">+{product.swatches.length - 4}</span>
                    )}
                  </div>
                )}
                <p className="text-[10px] md:text-[12px] text-[#2a1f1a]/70 truncate mt-1">
                  {product.material}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
