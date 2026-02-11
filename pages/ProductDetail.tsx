
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Watch } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { watches, addToCart } = useShop();
  const navigate = useNavigate();
  const [watch, setWatch] = useState<Watch | undefined>();
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const found = watches.find(w => w.id === id);
    if (found) {
      setWatch(found);
      setActiveImageIndex(0);
    }
  }, [id, watches]);

  if (!watch) return <div className="h-[70vh] flex items-center justify-center opacity-30 uppercase tracking-[1em] text-[10px] md:text-[12px] font-black">Securing Masterpiece...</div>;

  const handleAddToCart = () => {
    addToCart(watch);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16 font-sans animate-reveal">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gold hover:opacity-60 transition-all mb-8 md:mb-12 uppercase text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-black"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 md:mr-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Return to the Collection
      </button>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-20 items-start">
        <div className="w-full lg:w-1/2 space-y-6 md:space-y-10 lg:sticky lg:top-32">
          <div className="aspect-[4/5] bg-white dark:bg-white/5 overflow-hidden group relative border border-gold/10 shadow-4xl transition-all duration-1000 rounded-xl md:rounded-2xl">
            <img 
              src={watch.images[activeImageIndex] || watch.images[0]} 
              alt={watch.name} 
              className="w-full h-full object-cover transition-all duration-[1.5s]" 
            />
          </div>
          
          <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2">
            {watch.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImageIndex(i)}
                className={`aspect-square w-16 md:w-20 shrink-0 overflow-hidden cursor-pointer border-2 rounded-lg transition-all duration-500 ${activeImageIndex === i ? 'border-gold scale-105 shadow-xl opacity-100' : 'border-transparent opacity-40 hover:opacity-80'}`}
              >
                 <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col pt-0 md:pt-4">
          <div className="mb-8 md:mb-16 pb-8 md:pb-16 border-b border-gold/10">
            <span className="text-gold uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-[11px] font-black mb-3 md:mb-6 block">
              {watch.brand_name}
            </span>
            <h1 className="text-3xl md:text-6xl lg:text-7xl tracking-tighter mb-6 md:mb-10 uppercase leading-[0.9] font-black">
              {watch.name}
            </h1>
            <p className="text-2xl md:text-3xl text-gold mb-6 md:mb-10 tracking-widest font-bold">
              ${watch.price.toLocaleString()}
            </p>
            <p className="opacity-70 leading-relaxed text-sm md:text-lg font-medium">
              {watch.description}
            </p>
          </div>

          <div className="space-y-8 md:space-y-12 mb-10 md:mb-16">
            <h3 className="uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[10px] font-black text-gold">
              Technical Manifesto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
              {[
                { label: 'Exoskeleton', value: watch.specifications.case },
                { label: 'The Pulse', value: watch.specifications.movement },
                { label: 'The Depths', value: watch.specifications.waterResistance },
                { label: 'The Clasp', value: watch.specifications.strap }
              ].map((spec, i) => (
                <div key={i} className="flex flex-col space-y-1.5 md:space-y-3 border-l-2 border-gold/20 pl-4 md:pl-6 group">
                  <p className="text-[8px] md:text-[9px] opacity-40 group-hover:opacity-100 group-hover:text-gold uppercase tracking-[0.2em] md:tracking-[0.3em] font-black transition-all">
                    {spec.label}
                  </p>
                  <p className="text-[11px] md:text-[13px] uppercase tracking-[0.1em] font-bold leading-relaxed">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 md:pt-10 border-t border-gold/10 flex flex-col gap-4 md:gap-6">
            <button 
              onClick={handleAddToCart}
              className={`py-4 md:py-6 rounded-xl uppercase tracking-[0.3em] md:tracking-[0.5em] text-[9px] md:text-[10px] font-black transition-all duration-700 ${
                added 
                ? 'bg-gold text-white shadow-3xl' 
                : 'bg-obsidian dark:bg-gold text-white dark:text-obsidian hover:shadow-gold hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-xl'
              }`}
            >
              {added ? 'Secured for Private Archive' : 'Acquire the Masterpiece'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
