
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

const Checkout: React.FC = () => {
  const { cart, placeOrder } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: user?.email || '', 
    address: '', 
    city: '', 
    country: '', 
    cardNumber: '', 
    expiry: '', 
    cvv: '' 
  });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  const subtotal = cart.reduce((acc, item) => acc + item.watch.price * item.quantity, 0);

  if (cart.length === 0) { 
    navigate('/shop'); 
    return null; 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await placeOrder({ 
      name: `${formData.firstName} ${formData.lastName}`.trim() || user?.email?.split('@')[0] || 'Anonymous Collector', 
      email: formData.email, 
      address: `${formData.address}, ${formData.city}, ${formData.country}` 
    });

    if (success) {
      navigate('/confirmation');
    } else {
      setLoading(false);
      alert("Verification Protocol Failed. Please verify your collection or contact the private concierge.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16 animate-reveal font-sans">
      <header className="mb-8 md:mb-16 text-center">
        <h1 className="text-2xl md:text-3xl tracking-[0.4em] uppercase font-black">Secure Checkout</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Mobile Summary */}
        <div className="lg:hidden bg-white/40 dark:bg-white/5 p-5 border border-gold/20 rounded-xl mb-8">
          <button 
            type="button"
            className="w-full flex justify-between items-center text-gold uppercase tracking-[0.2em] text-[10px] font-black"
            onClick={() => {
              const el = document.getElementById('mobile-summary-content');
              el?.classList.toggle('hidden');
            }}
          >
            <span>Show Order Summary</span>
            <span className="text-base font-black">${subtotal.toLocaleString()}</span>
          </button>
          <div id="mobile-summary-content" className="hidden mt-6 space-y-4 pt-4 border-t border-gold/10">
            {cart.map(item => (
              <div key={item.watch.id} className="flex gap-3 items-center">
                <div className="w-12 h-16 bg-white dark:bg-black shrink-0 border border-gold/10 overflow-hidden rounded-md">
                  <img src={item.watch.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="text-[7px] text-gold uppercase tracking-widest font-black">{item.watch.brand_name}</p>
                  <p className="text-[10px] uppercase font-bold">{item.watch.name}</p>
                  <p className="text-[8px] opacity-40 uppercase font-black tracking-widest">Qty: {item.quantity}</p>
                </div>
                <div className="text-[10px] font-black">${(item.watch.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow space-y-12 md:space-y-20 order-2 lg:order-1">
          <section className="space-y-8 md:space-y-12">
            <h3 className="uppercase tracking-[0.6em] text-[10px] font-black text-gold">I. Identification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-1.5 md:space-y-3">
                <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">Forename</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-transparent border-b border-gold/20 dark:border-white/10 focus:border-gold outline-none py-2 md:py-3 transition-all text-xs uppercase tracking-[0.2em]" />
              </div>
              <div className="space-y-1.5 md:space-y-3">
                <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">Surname</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-transparent border-b border-gold/20 dark:border-white/10 focus:border-gold outline-none py-2 md:py-3 transition-all text-xs uppercase tracking-[0.2em]" />
              </div>
              <div className="sm:col-span-2 space-y-1.5 md:space-y-3">
                <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">Verified Email</label>
                <input readOnly type="email" name="email" value={formData.email} className="w-full bg-transparent border-b border-gold/10 py-2 text-xs opacity-50 outline-none cursor-not-allowed" />
              </div>
            </div>
          </section>

          <section className="space-y-8 md:space-y-12">
            <h3 className="uppercase tracking-[0.6em] text-[10px] font-black text-gold">II. Destination</h3>
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-1.5 md:space-y-3">
                <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">Physical Residence</label>
                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-transparent border-b border-gold/20 dark:border-white/10 focus:border-gold outline-none py-2 md:py-3 transition-all text-xs uppercase tracking-[0.2em]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-1.5 md:space-y-3">
                  <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-transparent border-b border-gold/20 dark:border-white/10 focus:border-gold outline-none py-2 md:py-3 transition-all text-xs uppercase tracking-[0.2em]" />
                </div>
                <div className="space-y-1.5 md:space-y-3">
                  <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">Country</label>
                  <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-transparent border-b border-gold/20 dark:border-white/10 focus:border-gold outline-none py-2 md:py-3 transition-all text-xs uppercase tracking-[0.2em]" />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8 md:space-y-12">
            <h3 className="uppercase tracking-[0.6em] text-[10px] font-black text-gold">III. Payment Protocol</h3>
            <div className="space-y-6 md:space-y-10 p-5 md:p-8 border-2 border-gold/10 bg-gold/5 dark:bg-white/5 rounded-2xl">
              <div className="space-y-1.5 md:space-y-3">
                <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">Card Protocol</label>
                <input required type="text" name="cardNumber" placeholder="**** **** **** ****" value={formData.cardNumber} onChange={handleInputChange} className="w-full bg-transparent border-b border-gold/20 dark:border-white/10 focus:border-gold outline-none py-2 md:py-3 transition-all text-sm font-mono tracking-[0.3em] placeholder:opacity-20" />
              </div>
              <div className="grid grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-1.5 md:space-y-3">
                  <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">Validity</label>
                  <input required type="text" name="expiry" placeholder="MM / YY" value={formData.expiry} onChange={handleInputChange} className="w-full bg-transparent border-b border-gold/20 dark:border-white/10 focus:border-gold outline-none py-2 md:py-3 transition-all text-xs font-mono placeholder:opacity-20" />
                </div>
                <div className="space-y-1.5 md:space-y-3">
                  <label className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-black">Security Code</label>
                  <input required type="text" name="cvv" placeholder="***" value={formData.cvv} onChange={handleInputChange} className="w-full bg-transparent border-b border-gold/20 dark:border-white/10 focus:border-gold outline-none py-2 md:py-3 transition-all text-xs font-mono placeholder:opacity-20" />
                </div>
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-obsidian dark:bg-gold text-white py-5 md:py-8 rounded-xl uppercase tracking-[0.5em] text-[10px] font-black transition-all disabled:opacity-30 hover:shadow-2xl active:scale-[0.98] shadow-xl"
          >
            {loading ? 'Transmitting Manifest...' : `Confirm Acquisition • $${subtotal.toLocaleString()}`}
          </button>
        </form>

        {/* Desktop Sidebar Summary */}
        <aside className="hidden lg:block w-80 order-2">
          <div className="sticky top-32 space-y-10 bg-white/40 dark:bg-white/5 p-8 border border-gold/20 rounded-2xl shadow-4xl gold-glow backdrop-blur-sm">
            <h3 className="uppercase tracking-[0.5em] text-[10px] font-black text-gold text-center">Order Manifest</h3>
            <div className="space-y-8 max-h-[40vh] overflow-y-auto no-scrollbar pr-2">
              {cart.map(item => (
                <div key={item.watch.id} className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-white dark:bg-black shrink-0 border border-gold/10 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <img src={item.watch.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[8px] text-gold uppercase tracking-[0.3em] font-black">{item.watch.brand_name}</p>
                    <p className="text-[11px] tracking-[0.05em] uppercase font-bold">{item.watch.name}</p>
                    <p className="text-[8px] opacity-40 uppercase font-black tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-[11px] text-gold font-black">
                    ${(item.watch.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-gold/20">
              <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-40 font-black mb-3">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="flex justify-between text-xl font-black">
                <span className="tracking-tight uppercase">Total</span>
                <span className="text-gold">${subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;