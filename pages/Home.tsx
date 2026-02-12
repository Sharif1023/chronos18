
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { BRANDS } from '../constants';

const Home: React.FC = () => {
  const { watches, siteSettings, submitMessage } = useShop();
  const featured = watches.filter(w => w.featured).slice(0, 3);
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const dbSuccess = await submitMessage(formData);
      const FORMSPREE_URL = "https://formspree.io/f/mnnjjppv"; 
      
      try {
        await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } catch (formspreeErr) {
        console.warn("External notification (Formspree) failed, but data is safe in DB:", formspreeErr);
      }
      
      if (dbSuccess) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Critical submission error:", err);
      setStatus('error');
    }
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden bg-champagne dark:bg-obsidian">
        <img 
          src={siteSettings.hero_image_url} 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-30 grayscale contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-champagne dark:to-obsidian"></div>
        
        <div className="relative text-center px-6 max-w-6xl z-10 space-y-8 md:space-y-12">
          <span className="uppercase tracking-[0.8em] text-gold text-[10px] md:text-xs font-black">
            {siteSettings.hero_tag}
          </span>
          <h1 className="text-4xl sm:text-7xl md:text-9xl tracking-tight leading-[0.85] uppercase font-black text-obsidian dark:text-champagne">
            {(siteSettings.hero_title || '').split(' ').map((word, i, arr) => (
              <React.Fragment key={i}>
                {i === Math.floor(arr.length / 2) ? <><br /> <span className="text-gold">{word}</span></> : word + ' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="opacity-80 text-sm md:text-xl font-medium tracking-[0.05em] max-w-2xl mx-auto leading-relaxed text-obsidian dark:text-champagne/80">
            {siteSettings.hero_subtitle}
          </p>
          <div className="pt-8 md:pt-12 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
            <Link to="/shop" className="bg-obsidian dark:bg-gold text-champagne dark:text-obsidian px-12 md:px-16 py-4 md:py-6 uppercase tracking-[0.4em] text-[10px] font-black transition-all hover:scale-105 hover:shadow-2xl">
              {siteSettings.hero_primary_btn_text}
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Grid (Box style) */}
<section className="py-12 md:py-20 bg-white dark:bg-black/50 border-y border-gold/10">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {BRANDS.map((brand) => (
        <Link
          key={brand.id}
          to={`/shop?brand=${encodeURIComponent(brand.name)}`}
          className="
            group
            rounded-2xl
            border border-gold/10
            bg-champagne/60 dark:bg-white/5
            px-5 py-6 md:px-8 md:py-8
            shadow-sm
            transition-all duration-500
            hover:-translate-y-1 hover:shadow-2xl
            hover:border-gold/30
          "
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] md:text-[13px] tracking-[0.35em] uppercase font-black text-obsidian dark:text-champagne">
              {brand.name}
            </span>

            {/* small arrow icon */}
            <span className="w-9 h-9 rounded-xl border border-gold/15 bg-gold/10 flex items-center justify-center text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-white group-hover:border-gold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* subtle underline */}
          <div className="mt-4 h-px w-full bg-gold/10 group-hover:bg-gold/30 transition-all" />
        </Link>
      ))}
    </div>
  </div>
</section>


      {/* Featured Section */}
      <section className="py-24 md:py-32 px-6 bg-champagne dark:bg-obsidian overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 space-y-8 md:space-y-0">
            <div className="space-y-4">
              <span className="uppercase tracking-[0.6em] text-gold text-[10px] font-black">
                {siteSettings.featured_tag}
              </span>
              <h2 className="text-3xl md:text-6xl tracking-tighter uppercase font-black text-obsidian dark:text-champagne">
                {siteSettings.featured_heading}
              </h2>
            </div>
            <Link to="/shop" className="uppercase tracking-[0.3em] text-[10px] font-black border-b-2 border-gold/30 pb-2 hover:border-gold transition-all text-obsidian dark:text-champagne">
              {siteSettings.featured_archive_link_text}
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
            {featured.map(watch => (
              <div key={watch.id} className="group cursor-pointer">
                <Link to={`/product/${watch.id}`}>
                  <div className="aspect-[4/5] overflow-hidden bg-white dark:bg-white/5 mb-6 md:mb-10 relative border border-gold/10 shadow-2xl transition-all duration-1000 group-hover:-translate-y-4">
                    <img 
                      src={watch.images[0]} 
                      alt={watch.name} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                    />
                  </div>
                </Link>
                <div className="space-y-4 text-center">
                  <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black">{watch.brand_name}</span>
                  <Link to={`/product/${watch.id}`}>
                    <h4 className="text-xl md:text-2xl tracking-[0.1em] uppercase font-black text-obsidian dark:text-champagne">{watch.name}</h4>
                  </Link>
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-xl tracking-widest text-gold font-bold">${watch.price.toLocaleString()}</p>
                    <div className="w-8 h-px bg-gold/30"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Brand Narrative Section */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center bg-obsidian text-champagne overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteSettings.immersive_image_url} 
            alt="Atelier" 
            className="w-full h-full object-cover opacity-20 grayscale scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-8 md:space-y-12 animate-reveal">
            <div className="space-y-3">
              <span className="text-gold uppercase tracking-[0.5em] text-[10px] md:text-xs font-black block">
                {siteSettings.immersive_subheading}
              </span>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tight leading-[0.9]">
                {siteSettings.immersive_heading}
              </h2>
            </div>
            <p className="text-base md:text-xl opacity-60 leading-relaxed max-w-xl font-medium">
              {siteSettings.immersive_description}
            </p>
            <Link 
              to="/shop" 
              className="inline-block border border-gold text-gold px-10 md:px-12 py-4 md:py-6 uppercase tracking-[0.4em] text-[10px] font-black transition-all hover:bg-gold hover:text-obsidian"
            >
              {siteSettings.immersive_button_text}
            </Link>
          </div>
          <div className="hidden lg:block">
             <div className="aspect-[4/3] border border-gold/20 shadow-4xl relative group">
                <img 
                  src={siteSettings.immersive_image_url} 
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  alt="Craftsmanship"
                />
                <div className="absolute inset-0 border-[30px] border-obsidian/50 group-hover:border-obsidian/0 transition-all duration-700"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Concierge Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-black/20 border-t border-gold/10">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-champagne dark:bg-white/5 p-6 md:p-12 border border-gold/10 rounded-3xl shadow-4xl animate-reveal">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 md:py-20">
                <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center border border-gold/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-widest text-obsidian dark:text-champagne">
                  Message Sent Successfully
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold dark:text-champagne">
                  We will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-gold/20 py-2 md:py-3 outline-none text-sm tracking-wide focus:border-gold transition-colors text-obsidian dark:text-champagne"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-gold/20 py-2 md:py-3 outline-none text-sm tracking-wide focus:border-gold transition-colors text-obsidian dark:text-champagne"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Subject</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-transparent border-b border-gold/20 py-2 md:py-3 outline-none text-sm tracking-wide focus:border-gold transition-colors text-obsidian dark:text-champagne"
                    placeholder="Subject"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Message</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border border-gold/10 p-4 rounded-xl outline-none text-sm focus:border-gold transition-colors text-obsidian dark:text-champagne"
                    placeholder="Write your message here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-obsidian dark:bg-gold text-white dark:text-obsidian py-4 rounded-xl text-sm uppercase font-bold tracking-widest transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-30"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
