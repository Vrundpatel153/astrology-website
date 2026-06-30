import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Package, Search, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";

const sampleOrders = [
  {
    id: "SS-2024-0847",
    date: "June 22, 2026",
    status: "Delivered",
    items: [
      { name: "Pyrite Bracelet", image: "https://cdn.shopify.com/s/files/1/0720/7813/1509/files/pyrite-bracelet-5264057.webp", price: 1199 },
      { name: "Amethyst Pendant", image: "https://cdn.shopify.com/s/files/1/0720/7813/1509/files/amethyst-pendant-4882688.webp", price: 1499 },
    ],
    total: 2698,
    tracking: "DTDC123456789",
  },
  {
    id: "SS-2024-0831",
    date: "June 10, 2026",
    status: "In Transit",
    items: [
      { name: "7 Chakra Crystal Tree", image: "https://cdn.shopify.com/s/files/1/0720/7813/1509/files/7-chakra-crystal-tree-1684722.jpg", price: 1799 },
    ],
    total: 1799,
    tracking: "BLUEDART987654",
  },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  "Delivered":   { icon: CheckCircle, color: "text-green-600",  bg: "bg-green-50" },
  "In Transit":  { icon: Truck,       color: "text-blue-600",   bg: "bg-blue-50" },
  "Processing":  { icon: Clock,       color: "text-amber-600",  bg: "bg-amber-50" },
  "Out for Delivery": { icon: MapPin, color: "text-purple-600", bg: "bg-purple-50" },
};

export default function Orders() {
  const [trackId, setTrackId] = useState("");
  const [tracked, setTracked] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      <section className="pt-20 pb-12 px-6 text-center bg-[#f5ede4]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8a951] mb-4">My Account</p>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2a1f1a] mb-4">Track Your Orders</h1>
          <p className="text-[#2a1f1a]/60 max-w-lg mx-auto">Follow your crystal journey from our studio to your doorstep.</p>
        </motion.div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[900px] mx-auto">

          {/* Track form */}
          <ScrollReveal direction="up" className="mb-14">
            <div className="bg-white border border-[#e8d9cf] p-8">
              <h2 className="text-xl font-serif font-light mb-6">Track an Order</h2>
              <div className="flex gap-0">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. SS-2024-0847) or tracking number"
                  value={trackId}
                  onChange={e => setTrackId(e.target.value)}
                  className="flex-1 border border-[#e8d9cf] px-4 py-3.5 text-sm outline-none focus:border-[#c8a951] transition-colors"
                />
                <motion.button
                  onClick={() => setTracked(true)}
                  className="bg-[#c8a951] text-[#2a1f1a] px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
                  whileHover={{ backgroundColor: "#d4b565" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Search className="w-4 h-4" /> Track
                </motion.button>
              </div>
              {tracked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 bg-[#f5ede4] border border-[#c8a951]/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-5 h-5 text-[#c8a951]" />
                    <span className="font-medium">Order {trackId || "SS-2024-0847"}</span>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 font-medium">Delivered</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#2a1f1a]/60">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Delivered on June 25, 2026 at 2:34 PM — Hauz Khas, New Delhi
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollReveal>

          {/* Recent orders */}
          <ScrollReveal direction="up">
            <h2 className="text-xl font-serif font-light mb-6">Recent Orders</h2>
            <div className="flex flex-col gap-5">
              {sampleOrders.map((order, i) => {
                const sc = statusConfig[order.status] || statusConfig["Processing"];
                const StatusIcon = sc.icon;
                return (
                  <motion.div
                    key={order.id}
                    className="bg-white border border-[#e8d9cf] p-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                      <div>
                        <p className="font-medium text-[#2a1f1a]">{order.id}</p>
                        <p className="text-xs text-[#2a1f1a]/50">{order.date}</p>
                      </div>
                      <div className={`flex items-center gap-2 ${sc.bg} px-3 py-1.5 w-fit`}>
                        <StatusIcon className={`w-4 h-4 ${sc.color}`} />
                        <span className={`text-xs font-bold ${sc.color}`}>{order.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 mb-5">
                      {order.items.map(item => (
                        <div key={item.name} className="flex items-center gap-3 flex-1 min-w-0">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#2a1f1a] truncate">{item.name}</p>
                            <p className="text-sm text-[#2a1f1a]/60">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#e8d9cf]">
                      <p className="text-sm font-bold text-[#2a1f1a]">Total: ₹{order.total.toLocaleString()}</p>
                      <motion.span
                        className="text-[11px] font-bold uppercase tracking-wider text-[#c8a951] border border-[#c8a951] px-4 py-2 cursor-pointer"
                        whileHover={{ backgroundColor: "#c8a951", color: "#2a1f1a" }}
                        transition={{ duration: 0.18 }}
                      >
                        View Details
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" className="mt-14 text-center">
            <p className="text-[#2a1f1a]/50 text-sm mb-5">Not finding your order? Contact us and we'll look it up for you.</p>
            <Link href="/contact">
              <motion.span className="inline-block bg-[#2a1f1a] text-[#fdf8f4] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer" whileHover={{ backgroundColor: "#3d2f28" }} transition={{ duration: 0.18 }}>
                Contact Support
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
