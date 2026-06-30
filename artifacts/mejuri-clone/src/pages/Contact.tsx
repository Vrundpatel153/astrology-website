import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Mail, Phone, MapPin, Clock, MessageCircle, Instagram } from "lucide-react";

const info = [
  { icon: Mail,    label: "Email Us",        value: "hello@selenitesoul.com",  sub: "We reply within 24 hours" },
  { icon: Phone,   label: "Call / WhatsApp",  value: "+91 98765 43210",         sub: "Mon–Sat, 10am – 6pm IST" },
  { icon: MapPin,  label: "Our Studio",       value: "Hauz Khas, New Delhi",    sub: "Visit by appointment only" },
  { icon: Clock,   label: "Support Hours",    value: "Mon–Sat",                 sub: "10:00 AM – 6:00 PM IST" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name && form.email && form.message) setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      {/* Hero */}
      <section className="pt-20 pb-12 px-6 text-center bg-[#f5ede4]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8a951] mb-4">Reach Out</p>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2a1f1a] mb-4">We'd Love to Hear from You</h1>
          <p className="text-[#2a1f1a]/60 max-w-xl mx-auto">Whether it's a question about your order, crystal advice, or Vedic astrology — our team is here to help.</p>
        </motion.div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* Contact Info */}
            <ScrollReveal direction="left">
              <div>
                <h2 className="text-2xl font-serif font-light text-[#2a1f1a] mb-8">Contact Information</h2>
                <div className="flex flex-col gap-6 mb-10">
                  {info.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 border border-[#c8a951]/30 bg-[#c8a951]/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-[#c8a951]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2a1f1a]/40 mb-0.5">{item.label}</p>
                        <p className="text-[#2a1f1a] font-medium text-sm">{item.value}</p>
                        <p className="text-[#2a1f1a]/50 text-xs">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#e8d9cf] pt-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2a1f1a]/40 mb-4">Follow Us</p>
                  <div className="flex gap-4">
                    {[
                      { icon: Instagram, label: "@selenitesoul" },
                      { icon: MessageCircle, label: "WhatsApp" },
                    ].map(({ icon: Icon, label }) => (
                      <motion.a
                        key={label}
                        href="#"
                        className="flex items-center gap-2 text-sm text-[#2a1f1a]/60 border border-[#e8d9cf] px-4 py-2.5"
                        whileHover={{ borderColor: "#c8a951", color: "#c8a951" }}
                        transition={{ duration: 0.18 }}
                      >
                        <Icon className="w-4 h-4" />{label}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal direction="right">
              {sent ? (
                <motion.div
                  className="h-full flex flex-col items-center justify-center text-center py-16 border border-[#c8a951]/30 bg-[#c8a951]/5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-2xl font-serif font-light text-[#2a1f1a] mb-3">Message Received!</h3>
                  <p className="text-[#2a1f1a]/60 text-sm max-w-xs">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h2 className="text-2xl font-serif font-light text-[#2a1f1a] mb-3">Send a Message</h2>
                  {[
                    { id: "name",    label: "Your Name",     type: "text",  placeholder: "Priya Sharma" },
                    { id: "email",   label: "Email Address", type: "email", placeholder: "priya@email.com" },
                    { id: "subject", label: "Subject",       type: "text",  placeholder: "Order enquiry / Crystal advice" },
                  ].map(({ id, label, type, placeholder }) => (
                    <div key={id}>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2a1f1a]/50 block mb-1.5">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={(form as Record<string, string>)[id]}
                        onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                        className="w-full border border-[#e8d9cf] bg-white px-4 py-3 text-sm text-[#2a1f1a] placeholder:text-[#2a1f1a]/30 outline-none focus:border-[#c8a951] transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2a1f1a]/50 block mb-1.5">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full border border-[#e8d9cf] bg-white px-4 py-3 text-sm text-[#2a1f1a] placeholder:text-[#2a1f1a]/30 outline-none focus:border-[#c8a951] transition-colors resize-none"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="bg-[#c8a951] text-[#2a1f1a] py-4 text-[11px] font-bold uppercase tracking-widest"
                    whileHover={{ scale: 1.02, backgroundColor: "#d4b565" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    Send Message ✨
                  </motion.button>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
