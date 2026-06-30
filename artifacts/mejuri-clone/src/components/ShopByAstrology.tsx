import { zodiacSigns } from "@/data/products";

export default function ShopByAstrology() {
  return (
    <section className="py-10 md:py-20 bg-[#fdf8f4]" data-testid="section-astrology">
      <div className="px-4 md:px-[60px] mb-8 text-center">
        <span className="block text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-[#2a1f1a]/70 mb-2">
          COSMIC ALIGNMENT
        </span>
        <h2 className="text-[28px] md:text-[40px] font-bold text-[#2a1f1a] uppercase tracking-tight mb-4">
          SHOP BY ASTROLOGY
        </h2>
        <p className="font-mono text-sm md:text-base text-[#2a1f1a]/70 max-w-md mx-auto">
          Discover the perfect crystal companion for your zodiac sign.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
          {zodiacSigns.map((sign) => (
            <div 
              key={sign.sign} 
              className="bg-[#f7f1ec] border border-[#e8d9cf] p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#2a1f1a] hover:bg-white transition-colors group"
            >
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {sign.emoji}
              </div>
              <h3 className="font-bold text-[#2a1f1a] uppercase text-sm mb-1">{sign.sign}</h3>
              <p className="text-[10px] text-[#2a1f1a]/60 uppercase tracking-wider mb-2">{sign.dates}</p>
              <div className="mt-auto pt-2 border-t border-[#e8d9cf] w-full">
                <p className="text-xs font-medium text-[#c9957a]">{sign.crystal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
