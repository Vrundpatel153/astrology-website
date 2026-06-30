import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { products } from "@/data/products";

const carouselProducts = products.slice(0, 6);

export default function ProductCarousel() {
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
    <section className="py-10 md:py-20 bg-background overflow-hidden" data-testid="section-picked-for-you">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="px-4 md:px-[60px] mb-6 md:mb-10"
      >
        <h2 className="text-[32px] md:text-[52px] lg:text-[60px] font-bold text-[#2a1f1a] uppercase tracking-tight leading-none" data-testid="heading-picked-for-you">
          PICKED JUST FOR YOU
        </h2>
        <p className="hidden md:block font-mono text-[16px] md:text-[18px] text-[#2a1f1a]/70 mt-3">
          We think you'll love these
        </p>
      </motion.div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {carouselProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[42vw] md:w-[340px] border-r border-[#e8d9cf] bg-[#f7f1ec] group cursor-pointer"
              data-testid={`card-product-${product.id}`}
            >
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
                  data-testid={`button-add-${product.id}`}
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3 md:p-4 bg-background border-t border-[#e8d9cf]">
                <h3 className="text-[10px] md:text-[11px] font-normal uppercase tracking-widest text-[#2a1f1a] mb-1.5 truncate" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </h3>
                <p className="text-[13px] md:text-[15px] font-bold text-[#2a1f1a] mb-1" data-testid={`text-price-${product.id}`}>
                  ₹{product.price}
                </p>
                {/* Color swatches */}
                {product.swatches && product.swatches.length > 0 && (
                  <div className="flex items-center gap-1 mb-1">
                    {product.swatches.slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 border border-[#e8d9cf]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
                <p className="text-[10px] md:text-[12px] text-[#2a1f1a]/70 truncate mt-1" data-testid={`text-material-${product.id}`}>
                  {product.material}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation row */}
      <div className="flex items-center justify-between px-4 md:px-[60px] mt-5 md:mt-8">
        <button
          onClick={scrollPrev}
          className="w-9 h-9 md:w-11 md:h-11 border border-[#e8d9cf] flex items-center justify-center text-[#2a1f1a] hover:bg-[#f7f1ec] transition-colors"
          aria-label="Previous"
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div className="flex items-center gap-1.5 flex-1 mx-4">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-[2px] flex-1 transition-colors duration-300 ${idx === selectedIndex ? "bg-[#2a1f1a]" : "bg-[#e8d9cf]"}`}
              aria-label={`Go to slide ${idx + 1}`}
              data-testid={`button-dot-${idx}`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="w-9 h-9 md:w-11 md:h-11 bg-[#2a1f1a] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Next"
          data-testid="button-carousel-next"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

    </section>
  );
}
