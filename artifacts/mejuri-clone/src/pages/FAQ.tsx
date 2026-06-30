import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

const sections = [
  {
    heading: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 4–7 business days. Express delivery (1–2 days) is available at checkout for select pincodes across India. Orders placed before 2 PM IST on weekdays are dispatched same day." },
      { q: "Do you ship internationally?", a: "Yes! We ship to 30+ countries. International orders typically take 10–15 business days. Customs duties and taxes are the responsibility of the buyer and vary by country." },
      { q: "How can I track my order?", a: "Once your order is dispatched, you'll receive an email and WhatsApp message with your tracking number. You can also track your order under 'My Orders' in your account." },
      { q: "What if my order arrives damaged?", a: "We pack every crystal with extreme care, but if something arrives broken or damaged, please WhatsApp us a photo within 48 hours of delivery. We'll send a replacement or full refund immediately." },
      { q: "Is there free shipping?", a: "Yes! We offer free standard shipping on all orders above ₹999 within India. International orders have flat shipping rates starting at ₹799." },
    ]
  },
  {
    heading: "Crystals & Products",
    items: [
      { q: "Are your crystals genuine and natural?", a: "Absolutely. Every crystal is 100% natural and ethically sourced. We work directly with trusted mines in Brazil, Uruguay, India, and Peru. All gemstones are lab-tested and certified — never dyed, synthetic, or heat-treated (unless explicitly mentioned)." },
      { q: "How do I cleanse and charge my crystals?", a: "We recommend placing your crystals in moonlight on a full moon night, or using sage smoke, sound bowls, or selenite plates. Avoid water for porous stones like selenite, malachite, and pyrite. Our Cleansing Kit includes everything you need." },
      { q: "Which crystal is right for me?", a: "Try our free Kundali Calculator — it analyses your birth chart and recommends crystals based on your Rashi, Lagna, and planetary positions using Vedic astrology. It's the most personalised crystal recommendation you'll find." },
      { q: "Do you energise the crystals before shipping?", a: "Yes! Every crystal is cleansed under running water, dried in sunlight, and then recharged under the full moon. We also offer Puja Energisation where each piece is consecrated with Sanskrit mantras before shipping." },
    ]
  },
  {
    heading: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 15 days of delivery. The crystal must be in its original, undamaged condition. Customised or engraved pieces are non-returnable. Shipping charges for returns are borne by the customer." },
      { q: "How do I initiate a return?", a: "WhatsApp us at +91 98765 43210 with your order number and reason for return. Our team will arrange a pickup and process your refund within 5–7 business days once we receive the item." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount is credited to your original payment method or as store credit (your choice)." },
    ]
  },
  {
    heading: "Astrology & Kundali",
    items: [
      { q: "Is the Kundali reading really free?", a: "Yes, completely free. Enter your birth details and get a full Vedic birth chart with planetary positions, Rashi, Nakshatra, and personalised crystal recommendations instantly — no email or payment required." },
      { q: "How accurate is the Vedic crystal recommendation?", a: "Our recommendations are based on classical Vedic astrology texts — Brihat Parashara Hora Shastra and Jataka Parijata. They identify which Navagraha (planet) needs strengthening and recommend the corresponding Navratna or healing crystal." },
      { q: "Can I book a personal consultation?", a: "Yes! You can book a 15-minute or 30-minute one-on-one session with our resident Vedic astrologer. Sessions are conducted over video call. Reach out via WhatsApp or email to schedule." },
    ]
  },
];

function AccordionItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border-b border-[#e8d9cf] cursor-pointer"
      initial={false}
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-medium text-[#2a1f1a] pr-4 text-sm md:text-base">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-5 h-5 text-[#c8a951] flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[#2a1f1a]/65 text-sm leading-relaxed pb-5 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      <section className="pt-20 pb-12 px-6 text-center bg-[#f5ede4]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8a951] mb-4">Help Centre</p>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2a1f1a] mb-4">Frequently Asked Questions</h1>
          <p className="text-[#2a1f1a]/60 max-w-lg mx-auto">Everything you need to know about our crystals, orders, and Vedic astrology services.</p>
        </motion.div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[820px] mx-auto">
          {sections.map((section, si) => (
            <ScrollReveal key={section.heading} direction="up" delay={si * 0.06} className="mb-12">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c8a951] mb-6">{section.heading}</h2>
              <div>
                {section.items.map((item, i) => (
                  <AccordionItem key={i} q={item.q} a={item.a} i={i} />
                ))}
              </div>
            </ScrollReveal>
          ))}

          <ScrollReveal direction="up" className="mt-12 bg-[#2a1f1a] p-8 text-center">
            <p className="text-[#fdf8f4]/70 mb-3 text-sm">Still have questions?</p>
            <h3 className="text-xl font-serif font-light text-white mb-6">We're here to help</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <motion.span className="inline-block bg-[#c8a951] text-[#2a1f1a] px-7 py-3 text-[11px] font-bold uppercase tracking-widest cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Contact Us
                </motion.span>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                <motion.span className="inline-block border border-[#fdf8f4]/30 text-[#fdf8f4] px-7 py-3 text-[11px] font-bold uppercase tracking-widest cursor-pointer" whileHover={{ borderColor: "#c8a951", color: "#c8a951" }} transition={{ duration: 0.18 }}>
                  WhatsApp Us
                </motion.span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
