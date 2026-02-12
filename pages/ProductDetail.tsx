import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ isDown: false, startX: 0, startY: 0 });

  useEffect(() => {
    const found = watches.find(w => w.id === id);
    if (found) {
      setWatch(found);
      setActiveImageIndex(0);
    }
  }, [id, watches]);

  const images = watch?.images ?? [];

  const goTo = useCallback(
    (idx: number) => {
      if (!images.length) return;
      const safe = ((idx % images.length) + images.length) % images.length;
      setActiveImageIndex(safe);
    },
    [images.length]
  );

  const goNext = useCallback(() => goTo(activeImageIndex + 1), [activeImageIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeImageIndex - 1), [activeImageIndex, goTo]);

  // wheel + swipe/drag (kept)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || images.length <= 1) return;

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 8) return;
      e.preventDefault();
      delta > 0 ? goNext() : goPrev();
    };

    const onPointerDown = (e: PointerEvent) => {
      dragState.current.isDown = true;
      dragState.current.startX = e.clientX;
      dragState.current.startY = e.clientY;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragState.current.isDown) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        dragState.current.isDown = false;
        dx > 0 ? goPrev() : goNext();
      }
    };

    const onPointerUp = () => {
      dragState.current.isDown = false;
    };

    // el.addEventListener('wheel', onWheel, { passive: false });

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('pointerleave', onPointerUp);

    return () => {
      el.removeEventListener('wheel', onWheel as any);
      el.removeEventListener('pointerdown', onPointerDown as any);
      el.removeEventListener('pointermove', onPointerMove as any);
      el.removeEventListener('pointerup', onPointerUp as any);
      el.removeEventListener('pointercancel', onPointerUp as any);
      el.removeEventListener('pointerleave', onPointerUp as any);
    };
  }, [goNext, goPrev, images.length]);

  const handleAddToCart = () => {
    if (!watch) return;
    addToCart(watch);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (!watch) {
    return (
      <div className="h-[70vh] flex items-center justify-center opacity-30 uppercase tracking-[1em] text-[10px] md:text-[12px] font-black">
        Securing Masterpiece...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16 font-sans animate-reveal">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gold hover:opacity-60 transition-all mb-6 md:mb-12 uppercase text-[9px] md:text-[10px] tracking-[0.3em] font-black"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 md:mr-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Return to the Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-start">
        {/* LEFT */}
        <div className="w-full">
          <div className="mx-auto w-full max-w-[480px] sm:max-w-[520px] lg:max-w-none lg:mx-0 space-y-6 md:space-y-10 lg:sticky lg:top-32">
            {/* Mobile smaller image, desktop normal */}
            <div
              ref={sliderRef}
              className="
                aspect-[4/5] sm:aspect-[3/4]
                w-[85%] sm:w-[90%] lg:w-full
                mx-auto
                bg-white dark:bg-white/5
                overflow-hidden relative group
                border border-gold/10
                shadow-2xl
                rounded-xl md:rounded-2xl
                transition-all duration-700
                select-none touch-pan-y
              "
            >
              <img
                src={watch.images[activeImageIndex] || watch.images[0]}
                alt={watch.name}
                className="w-full h-full object-cover transition-all duration-700"
                draggable={false}
              />

              {watch.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-obsidian/70 text-champagne border border-gold/20 backdrop-blur-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-obsidian/70 text-champagne border border-gold/20 backdrop-blur-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    aria-label="Next image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {watch.images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImageIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          activeImageIndex === i ? 'w-8 bg-gold' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 sm:gap-4 justify-center overflow-x-auto no-scrollbar pb-2">
              {watch.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square w-14 sm:w-16 md:w-20 shrink-0 overflow-hidden border-2 rounded-lg transition-all duration-300 ${
                    activeImageIndex === i ? 'border-gold scale-105 shadow-lg opacity-100' : 'border-transparent opacity-40 hover:opacity-80'
                  }`}
                  aria-label={`Thumbnail ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full">
          <div className="mx-auto w-full max-w-[480px] sm:max-w-[520px] lg:max-w-none lg:mx-0 flex flex-col">
            {/* Restored full info section (as your older version) */}
            <div className="mb-8 md:mb-16 pb-8 md:pb-16 border-b border-gold/10">
              <span className="text-gold uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-[11px] font-black mb-3 md:mb-6 block">
                {watch.brand_name}
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter mb-6 md:mb-10 uppercase leading-[0.9] font-black">
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
                className={`w-full py-4 md:py-6 rounded-xl uppercase tracking-[0.3em] md:tracking-[0.5em] text-[9px] md:text-[10px] font-black transition-all duration-700 ${
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
    </div>
  );
};

export default ProductDetail;
