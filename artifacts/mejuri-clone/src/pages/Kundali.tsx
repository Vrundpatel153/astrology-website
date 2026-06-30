import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  calculateKundali, geocodePlace, RASHIS,
  type BirthData, type KundaliResult, type PlanetInfo,
} from "@/lib/kundali";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

// ─── Custom SVG Icons (no Lucide) ─────────────────────────────────────────────
function IconPerson() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="7" cy="4.5" r="2.5"/>
      <path d="M1.5 13c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="1.5" y="2.5" width="11" height="10" rx="0.5"/>
      <line x1="1.5" y1="5.5" x2="12.5" y2="5.5"/>
      <line x1="4.5" y1="1" x2="4.5" y2="4"/>
      <line x1="9.5" y1="1" x2="9.5" y2="4"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="7" cy="7" r="5.5"/>
      <line x1="7" y1="4" x2="7" y2="7.5" strokeLinecap="round"/>
      <line x1="7" y1="7.5" x2="9.5" y2="8.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M7 13C7 13 2 8.5 2 5.5a5 5 0 0110 0C12 8.5 7 13 7 13z"/>
      <circle cx="7" cy="5.5" r="1.5"/>
    </svg>
  );
}
function IconReset() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M2 6.5A4.5 4.5 0 1 1 6.5 11" strokeLinecap="round"/>
      <polyline points="2,3 2,7 6,7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="2" y1="7" x2="11" y2="7" strokeLinecap="round"/>
      <polyline points="8,4 11,7 8,10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconDiamond({ size = 6 }: { size?: number }) {
  const h = size;
  return (
    <svg width={h} height={h} viewBox="0 0 10 10" fill="currentColor">
      <polygon points="5,0 10,5 5,10 0,5"/>
    </svg>
  );
}

// ─── Starfield Canvas ───────────────────────────────────────────────────────────
function StarField({ count = 120 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = devicePixelRatio;
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * 2000, y: Math.random() * 1000,
      r: Math.random() * 1.1 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.6,
    }));
    let raf: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      stars.forEach(s => {
        const alpha = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase + t * 0.001 * s.speed));
        const x = (s.x % canvas.offsetWidth);
        const y = (s.y % canvas.offsetHeight);
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Geometric Mandala ─────────────────────────────────────────────────────────
function VedicMandala({ lagna = 0 }: { lagna?: number }) {
  const outerR = 112;
  const midR   = 84;
  const innerR = 56;
  const labelR = outerR + 26; // radius where zodiac icons sit

  // 12 zodiac SVG paths — each drawn in a 20×20 coordinate space (0–20)
  // These are STATIC (never rotate), so they always read upright
  const zodiacPaths: [string, string][] = [
    // 0  Aries ♈ — ram horns: two upward arcs
    ["Aries",    "M5,15 C5,9 9,5.5 10,9 C11,5.5 15,9 15,15"],
    // 1  Taurus ♉ — circle + two short horns
    ["Taurus",   "M6,14 a4,4 0 1,1 8,0 M10,10 L7,5 M10,10 L13,5"],
    // 2  Gemini ♊ — two vertical bars with top & bottom rails
    ["Gemini",   "M7,5 L7,15 M13,5 L13,15 M7,5 L13,5 M7,15 L13,15"],
    // 3  Cancer ♋ — interlocked 6 & 9
    ["Cancer",   "M13,9 a3.5,3.5 0 1,0 -3.5,3.5 M7,11 a3.5,3.5 0 1,0 3.5,-3.5"],
    // 4  Leo ♌ — circle + curling tail
    ["Leo",      "M7,9 a3,3 0 1,1 6,0 M13,9 C15,9 16,13 14,15 C12,17 11,15 12,13"],
    // 5  Virgo ♍ — m-shape + right descending loop
    ["Virgo",    "M4,15 L4,7 C4,5 6.5,5 7,7.5 C7.5,5 10,5 10.5,7.5 L10.5,12 C10.5,15.5 15,15.5 15,12 C15,8.5 10.5,8.5 10.5,12"],
    // 6  Libra ♎ — flat line + arch
    ["Libra",    "M4,13 L16,13 M7,13 C7,8.5 13,8.5 13,13"],
    // 7  Scorpio ♏ — m-shape + forward arrow
    ["Scorpio",  "M4,14 L4,7 C4,5 6.5,5 7,7.5 C7.5,5 10,5 10.5,7.5 L10.5,12 L15,12 M13,10 L15,12 L13,14"],
    // 8  Sagittarius ♐ — diagonal arrow up-right
    ["Sagittarius","M5,15 L15,5 M15,5 L10,5 M15,5 L15,10"],
    // 9  Capricorn ♑ — V + curling right tail
    ["Capricorn","M4,5 L8,13 C9,16 11,16 12,13 C13,10 13,9 15,9 C17,9 17,14 15,14"],
    // 10 Aquarius ♒ — two wavy lines
    ["Aquarius", "M4,9 C6,7 8,11 10,9 C12,7 14,11 16,9 M4,13 C6,11 8,15 10,13 C12,11 14,15 16,13"],
    // 11 Pisces ♓ — two arcs + center vertical line
    ["Pisces",   "M10,5 L10,15 M5,7.5 C5,5 9,5 9,10 C9,15 5,15 5,12.5 M15,7.5 C15,5 11,5 11,10 C11,15 15,15 15,12.5"],
  ];

  return (
    <div className="relative w-[380px] h-[380px] md:w-[480px] md:h-[480px] shrink-0 flex items-center justify-center select-none">
      <svg viewBox="-165 -165 330 330" className="absolute inset-0 w-full h-full overflow-visible">

        {/* ── Outermost decorative ring ── */}
        <motion.g
          animate={{ rotate: -360 }}
          style={{ transformOrigin: "0px 0px" }}
          transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
        >
          <circle cx={0} cy={0} r={labelR + 16}
            fill="none" stroke="rgba(200,169,81,0.15)" strokeWidth="0.5"
            strokeDasharray="4 8"
          />
        </motion.g>

        {/* ── MAIN ROTATING WHEEL (Outer Ring & Icons) ── */}
        <motion.g
          animate={{ rotate: 360 }}
          style={{ transformOrigin: "0px 0px" }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          {/* ── Outer ring circle ── */}
          <circle cx={0} cy={0} r={outerR}
            fill="none" stroke="rgba(200,169,81,0.55)" strokeWidth="1.2"
          />

          {/* ── Tick marks ── */}
          <g>
            {/* Major ticks at every 30° */}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * 30 - 90) * (Math.PI / 180);
              return (
                <line key={i}
                  x1={(outerR - 7) * Math.cos(a)} y1={(outerR - 7) * Math.sin(a)}
                  x2={(outerR + 7) * Math.cos(a)} y2={(outerR + 7) * Math.sin(a)}
                  stroke="rgba(200,169,81,0.75)" strokeWidth="1.2"
                />
              );
            })}
            {/* Minor ticks at every 10° */}
            {Array.from({ length: 36 }, (_, i) => {
              if (i % 3 === 0) return null;
              const a = (i * 10 - 90) * (Math.PI / 180);
              return (
                <line key={i}
                  x1={(outerR - 3) * Math.cos(a)} y1={(outerR - 3) * Math.sin(a)}
                  x2={(outerR + 3) * Math.cos(a)} y2={(outerR + 3) * Math.sin(a)}
                  stroke="rgba(200,169,81,0.3)" strokeWidth="0.7"
                />
              );
            })}
          </g>

          {/* ── Zodiac icons + connector lines + diamond markers ── */}
          {zodiacPaths.map(([name, path], i) => {
            const a      = (i * 30 - 90) * (Math.PI / 180);
            const lx     = labelR * Math.cos(a);
            const ly     = labelR * Math.sin(a);
            const dmx    = (outerR - 13) * Math.cos(a);
            const dmy    = (outerR - 13) * Math.sin(a);
            const lnX1   = (outerR + 8) * Math.cos(a);
            const lnY1   = (outerR + 8) * Math.sin(a);
            const lnX2   = (labelR - 13) * Math.cos(a);
            const lnY2   = (labelR - 13) * Math.sin(a);
            const active = i === lagna;
            return (
              <g key={name}>
                {/* Connector line from ring to icon circle */}
                <line x1={lnX1} y1={lnY1} x2={lnX2} y2={lnY2}
                  stroke={active ? "rgba(200,169,81,0.65)" : "rgba(255,255,255,0.12)"}
                  strokeWidth="0.7"
                />
                {/* Diamond marker on ring */}
                <polygon
                  points={`${dmx},${dmy - 4} ${dmx + 4},${dmy} ${dmx},${dmy + 4} ${dmx - 4},${dmy}`}
                  fill={active ? "#c8a951" : "rgba(255,255,255,0.28)"}
                />
                
                {/* ICON & BACKGROUND - Counter Rotating (Ferris Wheel effect) */}
                <motion.g
                  animate={{ rotate: -360 }}
                  style={{ transformOrigin: `${lx}px ${ly}px` }}
                  transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                >
                  {/* Icon circle background */}
                  <circle cx={lx} cy={ly} r={13}
                    fill="rgba(7,4,18,0.85)"
                    stroke={active ? "#c8a951" : "rgba(255,255,255,0.18)"}
                    strokeWidth={active ? 1.2 : 0.7}
                  />
                  {/* Zodiac glyph — 20×20 coordinate space centered at lx,ly */}
                  <g transform={`translate(${lx - 10},${ly - 10})`}>
                    <path d={path}
                      fill="none"
                      stroke={active ? "#c8a951" : "rgba(255,255,255,0.72)"}
                      strokeWidth={active ? 1.9 : 1.35}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </motion.g>
              </g>
            );
          })}
        </motion.g>

        {/* ── INNER RING & SRI YANTRA (Counter-Rotating) ── */}
        <motion.g
          animate={{ rotate: -360 }}
          style={{ transformOrigin: "0px 0px" }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          {/* ── Inner ring ── */}
          <circle cx={0} cy={0} r={innerR}
            fill="none" stroke="rgba(200,169,81,0.52)" strokeWidth="1.2"
          />

          {/* ── Sri Yantra triangles ── */}
          {/* Outer pair */}
          <polygon
            points={`0,${-innerR + 10} ${(innerR-10)*0.866},${(innerR-10)*0.5} ${-(innerR-10)*0.866},${(innerR-10)*0.5}`}
            fill="rgba(200,169,81,0.07)" stroke="rgba(200,169,81,0.88)" strokeWidth="1.5"
          />
          <polygon
            points={`0,${innerR - 10} ${(innerR-10)*0.866},${-(innerR-10)*0.5} ${-(innerR-10)*0.866},${-(innerR-10)*0.5}`}
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5"
          />
          {/* Inner pair */}
          <polygon
            points={`0,${-innerR + 26} ${(innerR-26)*0.866},${(innerR-26)*0.5} ${-(innerR-26)*0.866},${(innerR-26)*0.5}`}
            fill="rgba(200,169,81,0.04)" stroke="rgba(200,169,81,0.52)" strokeWidth="1"
          />
          <polygon
            points={`0,${innerR - 26} ${(innerR-26)*0.866},${-(innerR-26)*0.5} ${-(innerR-26)*0.866},${-(innerR-26)*0.5}`}
            fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.42)" strokeWidth="1"
          />
        </motion.g>

        {/* ── 8-PETAL LOTUS & BINDU (Forward-Rotating) ── */}
        <motion.g
          animate={{ rotate: 360 }}
          style={{ transformOrigin: "0px 0px" }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        >
          {/* ── 8-petal lotus ── */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * 45) * (Math.PI / 180);
            const x = 28 * Math.cos(a);
            const y = 28 * Math.sin(a);
            return (
              <ellipse key={i} cx={x} cy={y} rx={8.5} ry={4}
                fill="none" stroke="rgba(200,169,81,0.38)" strokeWidth="0.8"
                transform={`rotate(${i * 45} ${x} ${y})`}
              />
            );
          })}

          {/* ── Center bindu ── */}
          <circle cx={0} cy={0} r={15}
            fill="none" stroke="rgba(200,169,81,0.38)" strokeWidth="0.8"
          />
          <motion.circle cx={0} cy={0} r={7}
            fill="#c8a951"
            animate={{ r: [7, 9, 7], opacity: [1, 0.75, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx={0} cy={0} r={13}
            fill="none" stroke="rgba(200,169,81,0.55)" strokeWidth="0.9"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

      </svg>
    </div>
  );
}

// ─── North Indian Chart ───────────────────────────────────────────────────────
const HOUSE_GRID: [number, number, number][] = [
  [12,0,0],[1,0,1],[2,0,2],[3,0,3],
  [11,1,0],[4,1,3],
  [10,2,0],[5,2,3],
  [9,3,0],[8,3,1],[7,3,2],[6,3,3],
];

function KundaliChart({ result }: { result: KundaliResult }) {
  const cells: Record<number, PlanetInfo[]> = {};
  for (let h = 1; h <= 12; h++) cells[h] = [];
  result.planets.forEach(p => { if (cells[p.house]) cells[p.house].push(p); });

  return (
    <div className="w-full max-w-[300px] mx-auto">
      <div className="grid grid-cols-4 gap-px" style={{ background: "rgba(200,169,81,0.12)" }}>
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => {
            if ((row === 1 || row === 2) && (col === 1 || col === 2)) {
              if (row === 1 && col === 1) return (
                <motion.div
                  key="center"
                  className="col-span-2 row-span-2 flex flex-col items-center justify-center p-3 border border-[#c8a951]/20"
                  style={{ background: "rgba(7,4,18,0.95)", minHeight: 68 }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div
                    className="w-8 h-8 flex items-center justify-center mb-1"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <svg viewBox="0 0 30 30" fill="none" className="w-full h-full">
                      <polygon points="15,2 28,28 2,28" fill="none" stroke="rgba(200,169,81,0.6)" strokeWidth="1"/>
                      <polygon points="15,28 2,2 28,2" fill="none" stroke="rgba(200,169,81,0.4)" strokeWidth="1"/>
                      <circle cx="15" cy="15" r="3" fill="#c8a951" opacity="0.8"/>
                    </svg>
                  </motion.div>
                  <p className="text-[#c8a951] text-[7px] font-bold uppercase tracking-widest">Lagna</p>
                  <p className="text-white text-[9px] font-medium mt-0.5">{result.lagnaName}</p>
                  <p className="text-[#c8a951]/50 text-[6px] mt-0.5 font-mono">{result.lagnaLongitude.toFixed(1)}°</p>
                </motion.div>
              );
              return null;
            }
            const entry = HOUSE_GRID.find(([, r, c]) => r === row && c === col);
            if (!entry) return null;
            const houseNum = entry[0];
            const rashiNum = result.houseRashis[houseNum - 1];
            const rashi = RASHIS[rashiNum - 1];
            const here = cells[houseNum] || [];
            return (
              <motion.div
                key={`${row}-${col}`}
                style={{ background: "rgba(7,4,18,0.9)", minHeight: 68 }}
                className="flex flex-col items-center justify-center p-1 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * (row * 4 + col) }}
              >
                <span className="absolute top-1 left-1.5 text-[6px] text-white/15 font-mono">{houseNum}</span>
                <p className="text-[7px] text-white/30 font-serif italic">{rashi?.name.slice(0,2)}</p>
                <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                  {here.map(p => (
                    <motion.span key={p.name}
                      title={`${p.name}${p.isRetrograde ? " (R)" : ""}`}
                      className="text-[8px] font-bold font-mono"
                      style={{ color: p.color }}
                      animate={{ opacity: [0.65, 1, 0.65] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: Math.random() }}
                    >
                      {p.symbol}{p.isRetrograde ? "ᴿ" : ""}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {result.planets.map(p => (
          <span key={p.name} className="text-[7.5px] flex items-center gap-0.5 font-mono font-medium" style={{ color: p.color }}>
            {p.symbol} {p.name.slice(0,3)}{p.isRetrograde ? "ᴿ" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Planet Table ─────────────────────────────────────────────────────────────
function PlanetTable({ planets }: { planets: PlanetInfo[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(200,169,81,0.15)" }}>
            {["Planet","Sanskrit","Sign","House","Nakshatra","Pada",""].map(h => (
              <th key={h} className="text-[7.5px] uppercase tracking-widest text-white/25 font-bold py-3 px-3 text-left whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planets.map((p, i) => (
            <motion.tr key={p.name}
              className={i % 2 === 0 ? "" : ""}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ backgroundColor: "rgba(200,169,81,0.04)" }}
            >
              <td className="py-3 px-3 font-bold whitespace-nowrap" style={{ color: p.color }}>
                <span className="font-mono">{p.symbol}</span>
                <span className="ml-1.5 text-[10px]">{p.name}</span>
              </td>
              <td className="py-3 px-3 text-white/35 font-serif italic text-[10px]">{p.sanskrit}</td>
              <td className="py-3 px-3 whitespace-nowrap text-white/70 text-[10px]">
                {p.rashiName}
              </td>
              <td className="py-3 px-3 text-center font-mono text-white/50 text-[10px]">{p.house}</td>
              <td className="py-3 px-3 whitespace-nowrap text-white/60 text-[10px]">{p.nakshatra}</td>
              <td className="py-3 px-3 text-center font-mono text-white/40 text-[10px]">{p.nakshatraPada}</td>
              <td className="py-3 px-3">
                {p.isRetrograde && (
                  <span className="text-[7px] font-bold tracking-widest border border-orange-500/40 text-orange-400 px-1.5 py-0.5">R</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Crystal Card ──────────────────────────────────────────────────────────────
function CrystalCard({ rec, onAdd, delay = 0 }: {
  rec: { crystal: string; reason: string; planet: string; image: string; benefit: string };
  onAdd: () => void;
  delay?: number;
}) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => { onAdd(); setAdded(true); setTimeout(() => setAdded(false), 2000); };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="group relative overflow-hidden flex gap-4 items-start p-5"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(200,169,81,0.15)" }}
      whileHover={{ borderColor: "rgba(200,169,81,0.45)", backgroundColor: "rgba(255,255,255,0.04)" }}
    >
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 -translate-x-full pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(200,169,81,0.04), transparent)" }}
        whileHover={{ translateX: "200%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      <div className="w-14 h-14 shrink-0 overflow-hidden" style={{ border: "1px solid rgba(200,169,81,0.2)" }}>
        <motion.img src={rec.image} alt={rec.crystal} className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }} transition={{ duration: 0.35 }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#c8a951] mb-0.5">{rec.planet}</p>
        <p className="text-sm font-medium text-white leading-tight">{rec.crystal}</p>
        <p className="text-[10px] text-white/45 mt-1 leading-relaxed">{rec.benefit}</p>
        <p className="text-[9px] text-white/25 mt-1 italic">{rec.reason}</p>
      </div>
      <motion.button onClick={handleAdd}
        className="shrink-0 self-center px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider"
        style={{
          border: added ? "1px solid #22c55e" : "1px solid rgba(200,169,81,0.5)",
          color: added ? "#22c55e" : "#c8a951",
        }}
        whileHover={!added ? { backgroundColor: "#c8a951", color: "#2a1f1a" } : {}}
        whileTap={{ scale: 0.92 }}
      >
        {added ? "Added" : "Add"}
      </motion.button>
    </motion.div>
  );
}

// ─── Yoga Card ────────────────────────────────────────────────────────────────
function YogaCard({ yoga, i }: { yoga: { name: string; description: string; strength: string }; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.08 }}
      className="flex gap-4 items-start p-4"
      style={{ border: "1px solid rgba(200,169,81,0.15)", background: "rgba(200,169,81,0.03)" }}
    >
      <div className="mt-0.5 text-[#c8a951] opacity-60 shrink-0"><IconDiamond size={8} /></div>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">{yoga.name}</p>
          <span className="text-[7px] font-bold uppercase tracking-wider px-2 py-0.5"
            style={{ border: "1px solid rgba(200,169,81,0.3)", color: "#c8a951" }}
          >{yoga.strength}</span>
        </div>
        <p className="text-xs text-white/40 leading-relaxed">{yoga.description}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Kundali() {
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const [form, setForm] = useState({ name: "", date: "", time: "12:00", place: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<KundaliResult | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [activeTab, setActiveTab] = useState<"chart" | "planets" | "crystals" | "yogas">("crystals");

  const heroRef   = useRef<HTMLDivElement>(null);
  const formRef   = useRef<HTMLFormElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOp  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // GSAP scroll reveals
  useEffect(() => {
    if (!formRef.current) return;
    gsap.fromTo(formRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 85%", once: true } }
    );
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  useEffect(() => {
    if (!labelsRef.current) return;
    const els = labelsRef.current.querySelectorAll(".reveal-tag");
    gsap.fromTo(els,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out",
        scrollTrigger: { trigger: labelsRef.current, start: "top 88%", once: true } }
    );
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.date || !form.time || !form.place) {
      setError("Please complete all four fields."); return;
    }
    setLoading(true); setResult(null);
    try {
      const geo = await geocodePlace(form.place);
      const lat = geo?.lat ?? 28.6139;
      const lon = geo?.lon ?? 77.2090;
      const data: BirthData = { ...form, latitude: lat, longitude: lon };
      setBirthData(data);
      setResult(calculateKundali(data));
      setActiveTab("crystals");
    } catch {
      setError("Could not geocode that location. Try a major city name.");
    } finally { setLoading(false); }
  }

  const handleAddCrystal = (crystal: string) => {
    const match = products.find(p =>
      p.name.toLowerCase().includes(crystal.toLowerCase()) ||
      (p.gemstone && crystal.toLowerCase().includes(p.gemstone.toLowerCase()))
    );
    if (match) addToCart(match);
  };

  const tabs = [
    { id: "chart",    label: "Birth Chart"      },
    { id: "planets",  label: "Planets"           },
    { id: "crystals", label: "Crystal Remedies"  },
    { id: "yogas",    label: "Yogas & Doshas"    },
  ] as const;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#070412" }}>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "min(560px, 70vw)" }}>
        <StarField count={180} />

        {/* Nebula blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(90,40,140,0.18) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-[10%] w-64 h-64 rounded-full blur-[90px]"
            style={{ background: "radial-gradient(circle, rgba(200,169,81,0.1) 0%, transparent 70%)" }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(40,60,130,0.15) 0%, transparent 70%)" }} />
        </div>

        <motion.div
          className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-20 max-w-[960px] mx-auto"
          style={{ y: heroY, opacity: heroOp }}
        >
          {/* Mandala */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <VedicMandala lagna={result ? (result.lagna - 1) : 0} />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center md:text-left max-w-[360px]"
          >
            {/* Label line — no icons, just geometry */}
            <div className="flex items-center gap-3 mb-5 justify-center md:justify-start">
              <div className="h-px w-8 bg-[#c8a951]/40" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c8a951]">Vedic Jyotish</span>
              <div className="h-px w-8 bg-[#c8a951]/40" />
            </div>

            <h1 className="text-5xl md:text-6xl font-normal leading-none mb-5 text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", letterSpacing: "-0.02em" }}
            >
              Your Kundali
            </h1>

            <p className="text-sm text-white/50 leading-relaxed mb-8">
              Discover your Vedic birth chart, nakshatra, planetary positions, yogas — and the crystals the universe has aligned for your soul.
            </p>

            {/* Tags — no emojis */}
            <div ref={labelsRef} className="flex flex-wrap gap-2 justify-center md:justify-start">
              {["Lahiri Ayanamsa", "Vedic Sidereal", "9 Grahas", "27 Nakshatras"].map(tag => (
                <span key={tag} className="reveal-tag text-[8px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 text-white/35"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, #070412, transparent)" }} />
      </div>

      {/* ── FORM ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-[860px] mx-auto px-5 md:px-8 pt-6 pb-14">

        <form ref={formRef} onSubmit={handleSubmit} className="relative mb-12" style={{ opacity: 0 }}>
          {/* Outer border */}
          <div className="relative" style={{ border: "1px solid rgba(200,169,81,0.2)" }}>

            {/* Corner accents */}
            {(["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"] as const).map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-5 h-5 pointer-events-none`}>
                <div className={`absolute top-0 ${i%2===0?"left-0":"right-0"} w-5 h-px bg-[#c8a951]`} />
                <div className={`absolute ${i<2?"top-0":"bottom-0"} ${i%2===0?"left-0":"right-0"} h-5 w-px bg-[#c8a951]`} />
              </div>
            ))}

            <div className="p-6 md:p-10">
              {/* Section label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-4 bg-[#c8a951]" />
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c8a951]">Enter Birth Details</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">

                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2">
                    <span className="text-white/20"><IconPerson /></span>Full Name
                  </label>
                  <input name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/15"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(200,169,81,0.5)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2">
                    <span className="text-white/20"><IconCalendar /></span>Date of Birth
                  </label>
                  <input name="date" type="date" value={form.date} onChange={handleChange}
                    className="w-full px-4 py-3.5 text-sm text-white outline-none transition-all [color-scheme:dark]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(200,169,81,0.5)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2">
                    <span className="text-white/20"><IconClock /></span>Time of Birth
                  </label>
                  <input name="time" type="time" value={form.time} onChange={handleChange}
                    className="w-full px-4 py-3.5 text-sm text-white outline-none transition-all [color-scheme:dark]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(200,169,81,0.5)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>

                {/* Place */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2">
                    <span className="text-white/20"><IconPin /></span>Place of Birth
                  </label>
                  <input name="place" type="text" value={form.place} onChange={handleChange}
                    placeholder="e.g. Mumbai, India"
                    className="w-full px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/15"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(200,169,81,0.5)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-red-400/80 mb-5 tracking-wide"
                >{error}</motion.p>
              )}

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.25em] disabled:opacity-50 relative overflow-hidden flex items-center justify-center gap-3"
                style={{ background: "#c8a951", color: "#0d0917" }}
                whileHover={!loading ? { brightness: 1.08 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
              >
                {loading ? (
                  <>
                    <motion.div className="w-4 h-4 border border-[#0d0917]/30 border-t-[#0d0917] rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                    />
                    Consulting the Stars
                  </>
                ) : (
                  <>Generate My Kundali</>
                )}
              </motion.button>

              <p className="text-[7.5px] text-white/18 text-center mt-4 uppercase tracking-widest">
                Lahiri Ayanamsa · Vedic Sidereal System · Geocoded via OpenStreetMap
              </p>
            </div>
          </div>
        </form>

        {/* ── RESULTS ──────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {result && birthData && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >

              {/* Summary banner */}
              <div className="relative mb-7 overflow-hidden" style={{ border: "1px solid rgba(200,169,81,0.2)", background: "rgba(200,169,81,0.04)" }}>
                <StarField count={35} />
                <div className="relative z-10 p-7 md:p-9">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-7">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#c8a951] mb-1.5">Kundali for</p>
                      <h2 className="text-2xl font-serif font-light text-white">{birthData.name}</h2>
                      <p className="text-[10px] text-white/30 mt-1 font-mono">{birthData.date} · {birthData.time} · {birthData.place}</p>
                    </div>
                    <motion.button onClick={() => setResult(null)}
                      className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors self-start"
                      whileHover={{ x: -2 }}
                    >
                      <IconReset /> New Chart
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Lagna",    value: result.lagnaName },
                      { label: "Moon",     value: result.moonSign },
                      { label: "Sun",      value: result.sunSign },
                      { label: "Nakshatra",value: `${result.nakshatra} P${result.nakshatraPada}` },
                    ].map((item, i) => (
                      <motion.div key={item.label}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.07 }}
                        className="p-3.5"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <p className="text-[7.5px] font-bold uppercase tracking-widest text-white/25 mb-1.5">{item.label}</p>
                        <p className="text-sm font-medium text-white">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info pills */}
              <div className="flex flex-wrap gap-2 mb-7">
                {[
                  { label: "Current Dasha",  value: `${result.dashaLord} · ${result.dashaYears} yrs` },
                  { label: "Nakshatra Lord", value: result.nakshatraLord },
                  { label: "Lagna Lord",     value: RASHIS[result.lagna - 1].ruler },
                ].map(pill => (
                  <motion.div key={pill.label}
                    className="flex gap-2 items-center px-4 py-2"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                    whileHover={{ borderColor: "rgba(200,169,81,0.35)" }}
                  >
                    <span className="text-[7.5px] font-bold uppercase tracking-widest text-white/25">{pill.label}</span>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-[11px] font-medium text-white/70">{pill.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex mb-7 overflow-x-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {tabs.map(tab => (
                  <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="px-5 md:px-7 py-4 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap relative"
                    style={{ color: activeTab === tab.id ? "#c8a951" : "rgba(255,255,255,0.3)" }}
                    whileHover={{ color: activeTab !== tab.id ? "rgba(200,169,81,0.6)" : "#c8a951" }}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-line"
                        className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ background: "#c8a951" }}
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                >
                  {activeTab === "chart" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/25 mb-4">D1 — Janma Kundali (North Indian)</p>
                        <KundaliChart result={result} />
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/25 mb-4">Chart Summary</p>
                        <div style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                          {[
                            { label: "Ascendant",      val: `${result.lagnaName} ${result.lagnaLongitude.toFixed(2)}°` },
                            { label: "Moon Sign",      val: result.moonSign },
                            { label: "Sun Sign",       val: result.sunSign },
                            { label: "Nakshatra",      val: `${result.nakshatra}, Pada ${result.nakshatraPada}` },
                            { label: "Nakshatra Lord", val: result.nakshatraLord },
                            { label: "Dasha",          val: `${result.dashaLord} (${result.dashaYears} yrs)` },
                          ].map((r, i) => (
                            <motion.div key={r.label}
                              className="flex justify-between px-4 py-3"
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                              whileHover={{ backgroundColor: "rgba(200,169,81,0.04)" }}
                            >
                              <span className="text-[7.5px] uppercase tracking-widest text-white/25 font-bold">{r.label}</span>
                              <span className="text-[11px] font-medium text-white/70">{r.val}</span>
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-[7.5px] text-white/18 leading-relaxed mt-3">
                          Approximate positions using Lahiri Ayanamsa. For precise readings consult a Jyotishi.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "planets" && (
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-white/25 mb-5">Graha Positions</p>
                      <div style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                        <PlanetTable planets={result.planets} />
                      </div>
                      <p className="text-[7.5px] text-white/18 mt-3">ᴿ = Retrograde. Houses counted from Lagna.</p>
                    </div>
                  )}

                  {activeTab === "crystals" && (
                    <div>
                      <div className="mb-6">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/25 mb-1.5">Personalised Crystal Remedies</p>
                        <p className="text-xs text-white/35">Based on your Lagna lord, Moon sign, and planetary strengths</p>
                      </div>
                      <div className="space-y-3 mb-8">
                        {result.crystalRecommendations.map((rec, i) => (
                          <CrystalCard key={i} rec={rec} delay={i * 0.1} onAdd={() => handleAddCrystal(rec.crystal)} />
                        ))}
                      </div>
                      <motion.div
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5"
                        style={{ border: "1px solid rgba(200,169,81,0.2)", background: "rgba(200,169,81,0.04)" }}
                        whileHover={{ borderColor: "rgba(200,169,81,0.4)" }}
                      >
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#c8a951] mb-1.5">
                            {result.lagnaName} Rising Collection
                          </p>
                          <p className="text-xs text-white/40 leading-relaxed max-w-sm">
                            Crystals curated for your Lagna — worn as jewellery they continuously strengthen your energy field.
                          </p>
                        </div>
                        <motion.button onClick={() => navigate("/shop")}
                          className="shrink-0 flex items-center gap-2.5 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
                          style={{ border: "1px solid rgba(200,169,81,0.5)", color: "#c8a951" }}
                          whileHover={{ backgroundColor: "#c8a951", color: "#0d0917" }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                        >
                          Explore Shop <IconArrow />
                        </motion.button>
                      </motion.div>
                    </div>
                  )}

                  {activeTab === "yogas" && (
                    <div className="space-y-6">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/25 mb-5">Yogas Detected</p>
                        <div className="space-y-3">
                          {result.yogas.map((yoga, i) => (
                            <YogaCard key={i} yoga={yoga as { name: string; description: string; strength: string }} i={i} />
                          ))}
                        </div>
                      </div>

                      {result.doshas && result.doshas.length > 0 && (
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-white/25 mb-5 mt-8">Doshas & Remedies</p>
                          <div className="space-y-3">
                            {result.doshas.map((dosha: { name: string; description: string; remedy: string }, i: number) => (
                              <motion.div key={i}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.08 }}
                                className="p-4"
                                style={{ border: "1px solid rgba(200,100,100,0.15)", background: "rgba(200,100,100,0.03)" }}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">{dosha.name}</p>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed mb-2">{dosha.description}</p>
                                <p className="text-[9px] text-[#c8a951]/60 italic">Remedy: {dosha.remedy}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
