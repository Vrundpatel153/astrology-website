import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronDown, CreditCard, Landmark, Smartphone, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

type PayMethod = "card" | "upi" | "netbanking";
type Step = "info" | "payment";

function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a]/60 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-[#e8d9cf] bg-white px-4 py-3 text-sm outline-none focus:border-[#2a1f1a] transition-all duration-200 focus:bg-white placeholder:text-[#2a1f1a]/30";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [processing, setProcessing] = useState(false);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping;

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", pincode: "", state: "",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
    upiId: "", bank: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function formatCard(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
  }

  function formatExpiry(val: string) {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  }

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { clearCart(); navigate("/payment-success"); }, 2200);
  };

  if (items.length === 0 && !processing) { navigate("/cart"); return null; }

  const steps = [{ id: "info", label: "Delivery" }, { id: "payment", label: "Payment" }] as const;

  return (
    <div className="min-h-screen bg-[#fdf8f4] text-[#2a1f1a]">
      <Header />

      {/* Progress bar */}
      <div className="bg-white border-b border-[#e8d9cf] px-4 py-3">
        <div className="max-w-[1000px] mx-auto flex items-center gap-3">
          <motion.button
            onClick={() => step === "payment" ? setStep("info") : navigate("/cart")}
            className="text-[#2a1f1a]/50"
            whileHover={{ x: -3, color: "#2a1f1a" }}
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          <div className="flex items-center gap-3 flex-1">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                {i > 0 && (
                  <motion.div
                    className="h-px w-12 bg-[#e8d9cf] origin-left"
                    animate={{ scaleX: step === "payment" ? 1 : 0.3, backgroundColor: step === "payment" ? "#c8a951" : "#e8d9cf" }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                    animate={{
                      backgroundColor: (step === s.id || (s.id === "info" && step === "payment")) ? "#2a1f1a" : "transparent",
                      color: (step === s.id || (s.id === "info" && step === "payment")) ? "#fff" : "rgba(42,31,26,0.35)",
                      borderColor: (step === s.id || (s.id === "info" && step === "payment")) ? "#2a1f1a" : "#e8d9cf",
                    }}
                    style={{ border: "1px solid" }}
                    transition={{ duration: 0.3 }}
                  >
                    {s.id === "info" && step === "payment" ? "✓" : i + 1}
                  </motion.div>
                  <motion.span
                    className="text-[10px] uppercase tracking-widest font-bold"
                    animate={{ color: step === s.id ? "#2a1f1a" : "rgba(42,31,26,0.35)" }}
                    transition={{ duration: 0.2 }}
                  >
                    {s.label}
                  </motion.span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#2a1f1a]/50">
            <Lock className="w-3 h-3" /> Secure
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

        {/* Left: Form */}
        <div>
          <AnimatePresence mode="wait">
            {step === "info" ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#2a1f1a]">Delivery Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "name",    label: "Full Name",    type: "text",  col: 2 },
                    { name: "email",   label: "Email",        type: "email", col: 1 },
                    { name: "phone",   label: "Phone",        type: "tel",   col: 1 },
                    { name: "address", label: "Address",      type: "text",  col: 2 },
                    { name: "city",    label: "City",         type: "text",  col: 1 },
                    { name: "pincode", label: "Pincode",      type: "text",  col: 1 },
                    { name: "state",   label: "State",        type: "text",  col: 2 },
                  ].map((f, i) => (
                    <motion.div
                      key={f.name}
                      className={f.col === 2 ? "sm:col-span-2" : ""}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <InputField label={f.label}>
                        <input
                          name={f.name}
                          type={f.type}
                          value={(form as Record<string, string>)[f.name]}
                          onChange={handleChange}
                          className={inputCls}
                          placeholder={f.label}
                        />
                      </InputField>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => setStep("payment")}
                  className="w-full bg-[#2a1f1a] text-white h-14 text-[11px] font-bold uppercase tracking-[0.15em]"
                  whileHover={{ backgroundColor: "#3d2d25", scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  Continue to Payment
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#2a1f1a]">Payment Method</h2>

                {/* Payment tabs */}
                <div className="grid grid-cols-3 border border-[#e8d9cf]">
                  {([
                    { id: "card",       label: "Card",        Icon: CreditCard },
                    { id: "upi",        label: "UPI",         Icon: Smartphone },
                    { id: "netbanking", label: "Net Banking",  Icon: Landmark   },
                  ] as { id: PayMethod; label: string; Icon: React.ElementType }[]).map(({ id, label, Icon }) => (
                    <motion.button
                      key={id}
                      onClick={() => setPayMethod(id)}
                      className={`py-3.5 flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border-r last:border-r-0 border-[#e8d9cf] relative overflow-hidden ${payMethod === id ? "bg-[#2a1f1a] text-white" : "bg-white text-[#2a1f1a]/60"}`}
                      whileHover={payMethod !== id ? { backgroundColor: "#f7f1ec" } : {}}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {payMethod === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <InputField label="Card Number">
                        <input
                          name="cardNumber"
                          value={form.cardNumber}
                          onChange={e => setForm(f => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                          className={`${inputCls} font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans`}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                        />
                      </InputField>
                      <InputField label="Name on Card">
                        <input name="cardName" value={form.cardName} onChange={handleChange} className={inputCls} placeholder="Priya Sharma" />
                      </InputField>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Expiry">
                          <input
                            name="expiry"
                            value={form.expiry}
                            onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                            className={`${inputCls} font-mono`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </InputField>
                        <InputField label="CVV">
                          <input
                            name="cvv"
                            value={form.cvv}
                            onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                            className={`${inputCls} font-mono`}
                            placeholder="•••"
                            maxLength={4}
                          />
                        </InputField>
                      </div>
                      <p className="text-[10px] text-[#2a1f1a]/40 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Demo only — no real payment processed
                      </p>
                    </motion.div>
                  )}

                  {payMethod === "upi" && (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <InputField label="UPI ID">
                        <input name="upiId" value={form.upiId} onChange={handleChange} className={inputCls} placeholder="yourname@upi" />
                      </InputField>
                      <div className="bg-[#f7f1ec] p-4 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-[#2a1f1a]/60 mb-3">Or scan QR code</p>
                        <div className="w-32 h-32 mx-auto bg-white border border-[#e8d9cf] grid grid-cols-5 p-2 gap-0.5">
                          {Array.from({ length: 25 }, (_, i) => (
                            <div key={i} className={`${[0,1,5,6,10,16,17,20,23,24].includes(i) ? "bg-[#2a1f1a]" : "bg-white"}`} />
                          ))}
                        </div>
                        <p className="text-[9px] text-[#2a1f1a]/40 mt-2">Demo QR only</p>
                      </div>
                    </motion.div>
                  )}

                  {payMethod === "netbanking" && (
                    <motion.div
                      key="netbanking"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <InputField label="Select Bank">
                        <div className="relative">
                          <select
                            name="bank"
                            value={form.bank}
                            onChange={handleChange}
                            className={`${inputCls} appearance-none cursor-pointer`}
                          >
                            <option value="">Choose your bank</option>
                            {["HDFC Bank","ICICI Bank","SBI","Axis Bank","Kotak Mahindra","Yes Bank","Bank of Baroda","Punjab National Bank"].map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2a1f1a]/50 pointer-events-none" />
                        </div>
                      </InputField>
                      <p className="text-[10px] text-[#2a1f1a]/40 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Demo mode — you'll be redirected to confirmation
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pay button */}
                <motion.button
                  onClick={handlePay}
                  disabled={processing}
                  className="w-full bg-[#2a1f1a] text-white h-14 text-[11px] font-bold uppercase tracking-[0.15em] disabled:opacity-70 flex items-center justify-center gap-3"
                  whileHover={!processing ? { backgroundColor: "#3d2d25", scale: 1.01 } : {}}
                  whileTap={!processing ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.18 }}
                >
                  {processing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Processing…
                    </>
                  ) : (
                    <><Lock className="w-4 h-4" /> Pay ₹{total.toLocaleString()}</>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Order Summary */}
        <div>
          <motion.div
            className="bg-[#f7f1ec] p-5 sticky top-24"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a] mb-4">
              Order ({items.length} item{items.length !== 1 ? "s" : ""})
            </h3>
            <div className="space-y-4 mb-5">
              {items.map(item => (
                <motion.div
                  key={item.product.id}
                  className="flex gap-3 items-start"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="relative w-14 h-14 bg-[#e8d9cf] shrink-0 overflow-hidden">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#2a1f1a] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#2a1f1a] leading-tight truncate">{item.product.name}</p>
                    <p className="text-[10px] text-[#2a1f1a]/60 mt-0.5">{item.product.material}</p>
                  </div>
                  <p className="text-xs font-medium text-[#2a1f1a] shrink-0">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
            <div className="border-t border-[#e8d9cf] pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-xs">
                <span className="text-[#2a1f1a]/60">Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#2a1f1a]/60">Shipping</span>
                <span className={shipping === 0 ? "text-[#2a855d] font-medium" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t border-[#e8d9cf] pt-3 mt-1">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
