import { useLocation } from "wouter";
import { categories } from "@/data/products";

export default function CategoryGrid() {
  const [, navigate] = useLocation();

  return (
    <section className="py-10 md:py-16 bg-[#fdf8f4]" data-testid="section-category-grid">
      <div className="px-4 md:px-[60px] mb-8">
        <h2 className="text-[28px] md:text-[40px] font-bold text-[#2a1f1a] uppercase tracking-tight">
          SHOP BY PRODUCT
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 border-t border-l border-[#e8d9cf]">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="border-b border-r border-[#e8d9cf] relative group cursor-pointer overflow-hidden aspect-square"
            onClick={() => navigate(`/shop?category=${cat.id}`)}
          >
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-bold text-sm md:text-base uppercase tracking-wide">{cat.name}</p>
              <p className="text-white/70 text-xs font-mono">{cat.count} products</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
