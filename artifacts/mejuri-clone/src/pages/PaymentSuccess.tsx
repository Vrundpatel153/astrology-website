import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 0.6,
  duration: 1.8 + Math.random() * 1.2,
  size: 4 + Math.random() * 8,
  color: ["#c8a951", "#e8d9cf", "#f48fb1", "#9c6fc4", "#ffd54f", "#81c784"][i % 6],
}));

const crystalEmojis = ["💎", "✨", "🔮", "💫", "🌙", "⭐", "🌸"];

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const orderId = useRef(`SS${Date.now().toString().slice(-7)}`);

  useEffect(() => {
    const t = setTimeout(() => {}, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf8f4] flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Confetti particles */}
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [1, 1, 0],
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            repeat: 1,
            repeatDelay: 0.5,
          }}
        />
      ))}

      {/* Crystal emoji floating */}
      {crystalEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 20}%` }}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [20, 0, -30] }}
          transition={{ delay: 0.3 + i * 0.15, duration: 1.5, ease: "easeOut" }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="bg-white p-8 md:p-12 max-w-md w-full text-center relative z-10 shadow-[0_20px_80px_rgba(42,31,26,0.08)]"
      >
        {/* Pulsing check */}
        <div className="relative inline-flex mb-6">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#c8a951]/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            <CheckCircle className="w-20 h-20 text-[#2a855d]" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#c8a951]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a951]">Order Confirmed</p>
            <Sparkles className="w-4 h-4 text-[#c8a951]" />
          </div>

          <h1
            className="text-3xl md:text-4xl font-normal text-[#2a1f1a] mb-2"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Thank You!
          </h1>
          <p className="text-sm text-[#2a1f1a]/60 mb-6 leading-relaxed">
            Your crystals are being cleansed and packaged with love.<br />
            The universe is aligning your order. ✨
          </p>

          {/* Order ID */}
          <div className="bg-[#f7f1ec] px-5 py-3.5 mb-6 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]/60">Order ID</span>
            <span className="text-sm font-mono font-bold text-[#2a1f1a]">#{orderId.current}</span>
          </div>

          {/* Timeline */}
          <div className="space-y-3 mb-8 text-left">
            {[
              { label: "Order Confirmed",   time: "Just now",      done: true  },
              { label: "Energy Cleansing",  time: "1–2 hours",     done: false },
              { label: "Dispatched",         time: "Within 24 hrs", done: false },
              { label: "Delivered",          time: "3–5 days",      done: false },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.12 }}
                className="flex items-center gap-3"
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${step.done ? "bg-[#2a855d] border-[#2a855d]" : "border-[#e8d9cf]"}`}>
                  {step.done && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <span className={`text-xs ${step.done ? "text-[#2a1f1a] font-medium" : "text-[#2a1f1a]/50"}`}>{step.label}</span>
                  <span className="text-[10px] text-[#2a1f1a]/40 font-mono">{step.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#2a1f1a] text-white h-12 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#3d2d25] transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="w-full border border-[#2a1f1a] text-[#2a1f1a] h-12 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#f7f1ec] transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/kundali")}
              className="text-[10px] uppercase tracking-widest text-[#c8a951] font-bold hover:underline"
            >
              ✨ Get Your Free Kundali Reading
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
