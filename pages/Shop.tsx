import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { BRANDS } from '../constants';

const Shop: React.FC = () => {
  const { watches } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get('category') || 'All');
  const [activeBrand, setActiveBrand] = useState<string>(searchParams.get('brand') || 'All');
  const [sortOrder, setSortOrder] = useState<'low' | 'high' | 'newest'>(
    (searchParams.get('sort') as any) || 'newest'
  );

  const categories = ['All', 'Classic', 'Sport', 'Dive', 'Aviator'];
  const brands = ['All', ...BRANDS.map(b => b.name)];

  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (activeBrand !== 'All') params.brand = activeBrand;
    if (sortOrder !== 'newest') params.sort = sortOrder;
    setSearchParams(params, { replace: true });
  }, [activeCategory, activeBrand, sortOrder, setSearchParams]);

  const filteredWatches = useMemo(() => {
    let list = [...watches];

    if (activeCategory !== 'All') {
      list = list.filter(w => w.category === activeCategory);
    }

    if (activeBrand !== 'All') {
      list = list.filter(w => w.brand_name === activeBrand);
    }

    if (sortOrder === 'low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) =>
        (b.created_at || '').localeCompare(a.created_at || '')
      );
    }

    return list;
  }, [watches, activeCategory, activeBrand, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-0 pb-12 md:pb-20 animate-reveal bg-champagne dark:bg-obsidian min-h-screen">

      {/* Filter Section */}
      <div className="border-y border-gold/20 mb-12 md:mb-20 py-1">
        <div className="flex flex-col md:flex-row items-stretch md:items-center">
          
          {/* Category */}
          <div className="flex flex-1 border-b md:border-b-0 md:border-r border-gold/10">
            <div className="relative group flex-1">
              <button className="flex items-center justify-center gap-4 md:gap-10 h-16 md:h-20 w-full uppercase text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-black opacity-60 hover:opacity-100 hover:text-gold transition-all">
                <span>
                  Series: <span className="text-gold font-black ml-2 md:ml-4">{activeCategory}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute top-full left-0 right-0 bg-champagne dark:bg-obsidian border border-gold/10 shadow-4xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4 md:p-6 space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-center uppercase text-[8px] md:text-[9px] tracking-[0.2em] py-3 md:py-4 transition-all ${
                      activeCategory === cat
                        ? 'bg-gold text-white font-black'
                        : 'opacity-40 hover:opacity-100 hover:bg-gold/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="relative group flex-1 border-l border-gold/10">
              <button className="flex items-center justify-center gap-4 md:gap-10 h-16 md:h-20 w-full uppercase text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-black opacity-60 hover:opacity-100 hover:text-gold transition-all">
                <span>
                  Maison: <span className="text-gold font-black ml-2 md:ml-4">{activeBrand}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute top-full left-0 right-0 bg-champagne dark:bg-obsidian border border-gold/10 shadow-4xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4 md:p-6 space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setActiveBrand(brand)}
                    className={`w-full text-center uppercase text-[8px] md:text-[9px] tracking-[0.2em] py-3 md:py-4 transition-all ${
                      activeBrand === brand
                        ? 'bg-gold text-white font-black'
                        : 'opacity-40 hover:opacity-100 hover:bg-gold/10'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="px-8 md:px-12 h-16 md:h-20 flex items-center justify-center bg-white dark:bg-black/20">
            <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-50 mr-6 md:mr-10 font-black">
              Arrange
            </label>
            <select
              className="bg-transparent text-gold text-[9px] md:text-[10px] uppercase tracking-[0.2em] focus:outline-none cursor-pointer font-black appearance-none pr-10 md:pr-12"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
            >
              <option value="newest">Latest Arrivals</option>
              <option value="low">Valuation: Low-High</option>
              <option value="high">Valuation: High-Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-12 gap-y-12 md:gap-y-20">
        {filteredWatches.length === 0 ? (
          <div className="col-span-full py-32 md:py-48 text-center opacity-30 uppercase tracking-[1em] text-[12px] font-black italic">
            Archive entry not found
          </div>
        ) : (
          filteredWatches.map(watch => (
            <Link
              to={`/product/${watch.id}`}
              key={watch.id}
              className="group flex flex-col items-center"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-white dark:bg-white/5 mb-6 md:mb-8 relative border border-gold/10 shadow-2xl transition-all duration-1000 group-hover:-translate-y-2 md:group-hover:-translate-y-4 gold-glow">
                <img
                  src={watch.images[0]}
                  alt={watch.name}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="space-y-2 text-center">
                <span className="text-gold text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-black block opacity-90">
                  {watch.brand_name}
                </span>
                <h3 className="text-sm md:text-xl tracking-[0.1em] uppercase font-black leading-tight px-2">
                  {watch.name}
                </h3>
                <p className="text-sm md:text-xl tracking-widest opacity-60 font-bold">
                  ${watch.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Shop;
