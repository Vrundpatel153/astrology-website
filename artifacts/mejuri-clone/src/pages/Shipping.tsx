import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Truck, Package, RefreshCw, ShieldCheck, Clock, Globe } from "lucide-react";
import { Link } from "wouter";

const shippingTiers = [
  { zone: "India – Standard",   time: "4–7 business days",   cost: "₹79",  free: "Free above ₹999" },
  { zone: "India – Express",    time: "1–2 business days",   cost: "₹199", free: "Free above ₹2,499" },
  { zone: "International",      time: "10–15 business days", cost: "₹799", free: "Free above ₹4,999" },
];

const returnSteps = [
  { step: "01", title: "Initiate Return",    desc: "WhatsApp or email us within 15 days of delivery with your order ID and reason." },
  { step: "02", title: "Get Pickup Arranged", desc: "We'll schedule a courier pickup from your doorstep — no need to visit a store." },
  { step: "03", title: "Item Inspected",     desc: "Once received, we inspect the crystal (must be in original condition, unworn)." },
  { step: "04", title: "Refund Processed",   desc: "Refund credited within 5–7 business days to your original payment method." },
];

export default function Shipping() {
  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      <section className="pt-20 pb-12 px-6 text-center bg-[#f5ede4]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8a951] mb-4">Policies</p>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2a1f1a] mb-4">Shipping & Returns</h1>
          <p className="text-[#2a1f1a]/60 max-w-lg mx-auto">We want your crystals to reach you safely and beautifully. Here's everything about delivery and returns.</p>
        </motion.div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[1000px] mx-auto">

          {/* Quick badges */}
          <ScrollReveal direction="up" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: Truck,       label: "Free Shipping",     sub: "On orders ₹999+" },
              { icon: Clock,       label: "Same Day Dispatch", sub: "Orders before 2PM" },
              { icon: RefreshCw,   label: "15-Day Returns",    sub: "No questions asked" },
              { icon: ShieldCheck, label: "Insured Delivery",  sub: "Full order value" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-white border border-[#e8d9cf] p-5 text-center">
                <Icon className="w-6 h-6 text-[#c8a951] mx-auto mb-3" />
                <p className="font-medium text-sm text-[#2a1f1a]">{label}</p>
                <p className="text-xs text-[#2a1f1a]/50 mt-0.5">{sub}</p>
              </div>
            ))}
          </ScrollReveal>

          {/* Shipping rates */}
          <ScrollReveal direction="up" className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="w-5 h-5 text-[#c8a951]" />
              <h2 className="text-2xl font-serif font-light">Shipping Rates & Timelines</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#c8a951]">
                    <th className="text-left py-3 pr-6 text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]/50">Zone</th>
                    <th className="text-left py-3 pr-6 text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]/50">Delivery Time</th>
                    <th className="text-left py-3 pr-6 text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]/50">Cost</th>
                    <th className="text-left py-3 text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]/50">Free Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingTiers.map((tier, i) => (
                    <tr key={tier.zone} className={`border-b border-[#e8d9cf] ${i % 2 === 0 ? "bg-white" : "bg-[#fdf8f4]"}`}>
                      <td className="py-4 pr-6 font-medium">{tier.zone}</td>
                      <td className="py-4 pr-6 text-[#2a1f1a]/70">{tier.time}</td>
                      <td className="py-4 pr-6 text-[#2a1f1a]/70">{tier.cost}</td>
                      <td className="py-4 text-[#c8a951] font-medium">{tier.free}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#2a1f1a]/40 mt-4">* Shipping times are estimates and may vary during peak seasons or due to courier delays. Estimated delivery times exclude Sundays and public holidays.</p>
          </ScrollReveal>

          {/* Returns process */}
          <ScrollReveal direction="up" className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <RefreshCw className="w-5 h-5 text-[#c8a951]" />
              <h2 className="text-2xl font-serif font-light">How Returns Work</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {returnSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="bg-white border border-[#e8d9cf] p-6 flex gap-5"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-3xl font-serif text-[#c8a951]/40 flex-shrink-0 leading-none">{step.step}</span>
                  <div>
                    <h3 className="font-medium text-[#2a1f1a] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#2a1f1a]/60 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Non-returnable */}
          <ScrollReveal direction="up" className="mb-14 bg-[#f5ede4] border-l-4 border-[#c8a951] p-6">
            <h3 className="font-medium text-[#2a1f1a] mb-3">Items Not Eligible for Return</h3>
            <ul className="list-disc list-inside text-sm text-[#2a1f1a]/60 space-y-1.5">
              <li>Custom-engraved or personalised pieces</li>
              <li>Items purchased during clearance or final sale</li>
              <li>Crystals showing signs of wear, washing, or damage caused by the customer</li>
              <li>Gift sets that have been opened and partially used</li>
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="up" className="text-center">
            <p className="text-[#2a1f1a]/50 text-sm mb-5">Have a question about your specific order?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <motion.span className="inline-block bg-[#c8a951] text-[#2a1f1a] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Contact Support
                </motion.span>
              </Link>
              <Link href="/orders">
                <motion.span className="inline-block border border-[#2a1f1a] text-[#2a1f1a] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer" whileHover={{ backgroundColor: "#2a1f1a", color: "#fdf8f4" }} transition={{ duration: 0.2 }}>
                  Track My Order
                </motion.span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
