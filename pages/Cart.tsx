import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useShop();
  const { user } = useAuth();

  const subtotal = cart.reduce((acc, item) => acc + item.watch.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24 text-center animate-reveal">
        <h2 className="text-xl md:text-3xl tracking-[0.25em] mb-6 uppercase font-black px-2">
          Your Atelier Bag is Empty
        </h2>
        <p className="opacity-50 mb-10 max-w-md mx-auto text-sm md:text-lg leading-relaxed font-medium px-2">
          The archive is waiting for its next great masterpiece.
        </p>
        <Link
          to="/shop"
          className="bg-obsidian dark:bg-gold text-white dark:text-obsidian px-8 md:px-16 py-3.5 md:py-6 uppercase tracking-[0.3em] text-[10px] font-black transition-all hover:scale-105 shadow-2xl inline-block"
        >
          Explore Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-14 animate-reveal">
      <header className="mb-8 md:mb-14 border-b border-gold/10 pb-5 md:pb-8 text-center">
        <h1 className="text-xl md:text-3xl tracking-[0.35em] uppercase font-black">Shopping Archive</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        {/* Items */}
        <div className="flex-grow space-y-5 md:space-y-10">
          {cart.map((item) => {
            const lineTotal = item.watch.price * item.quantity;

            return (
              <div
                key={item.watch.id}
                className="flex gap-4 md:gap-8 pb-5 md:pb-8 border-b border-gold/5 group items-start"
              >
                {/* Compact thumbnail (mobile-friendly) */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-36 bg-white dark:bg-white/5 shrink-0 border border-gold/10 shadow-xl overflow-hidden rounded-xl">
                  <img
                    src={item.watch.images[0]}
                    alt={item.watch.name}
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                  />
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0 space-y-3">
                  {/* Top row: title + remove */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0 space-y-1">
                      <span className="text-gold text-[8px] sm:text-[9px] uppercase tracking-[0.35em] block font-black truncate">
                        {item.watch.brand_name}
                      </span>
                      <h3 className="text-sm sm:text-base md:text-xl tracking-[0.08em] uppercase font-black leading-snug truncate">
                        {item.watch.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.watch.id)}
                      className="opacity-50 hover:opacity-100 transition-all hover:rotate-90 p-1.5 text-gold shrink-0"
                      aria-label="Remove item"
                      title="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 md:h-5 md:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Bottom row: qty + price (compact, wraps nicely) */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center border border-gold/20 rounded-lg overflow-hidden w-fit">
                      <button
                        onClick={() => updateQuantity(item.watch.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-gold font-bold hover:bg-gold/10 transition-colors"
                        aria-label="Decrease quantity"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="w-9 text-center text-[10px] font-black tracking-widest">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.watch.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-gold font-bold hover:bg-gold/10 transition-colors"
                        aria-label="Increase quantity"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-[9px] uppercase tracking-[0.25em] font-black opacity-40 sm:hidden">
                        Line Total
                      </span>
                      <span className="text-base sm:text-lg md:text-xl text-gold tracking-widest font-black">
                        ${lineTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="w-full lg:w-80">
          <div className="bg-white dark:bg-obsidian p-5 md:p-8 border border-gold/20 rounded-2xl space-y-7 shadow-4xl lg:sticky lg:top-32">
            <h3 className="uppercase tracking-[0.45em] text-[10px] font-black text-gold text-center">
              Acquisition Summary
            </h3>

            <div className="space-y-5 text-[10px] tracking-[0.15em] uppercase font-bold">
              <div className="flex justify-between opacity-50">
                <span>Value</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between opacity-50">
                <span>Delivery</span>
                <span className="text-gold">Complimentary</span>
              </div>
              <div className="pt-5 border-t border-gold/10 flex justify-between text-lg md:text-xl font-black">
                <span>Total</span>
                <span className="text-gold">${subtotal.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to={user ? '/checkout' : '/auth'}
              className="block w-full text-center bg-obsidian dark:bg-gold text-white dark:text-obsidian py-3.5 md:py-4 rounded-xl uppercase tracking-[0.4em] text-[10px] font-black transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-xl"
            >
              {user ? 'Secure Acquisition' : 'Login to Checkout'}
            </Link>

            <p className="text-[8px] opacity-30 leading-loose text-center uppercase tracking-[0.25em] font-black italic">
              {user ? 'Highest-grade security protocols active.' : 'Authentication required for artifact registry.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
