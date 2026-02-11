
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
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center animate-reveal">
        <h2 className="text-2xl md:text-3xl tracking-[0.3em] mb-8 uppercase font-black px-4">Your Atelier Bag is Empty</h2>
        <p className="opacity-50 mb-12 max-w-md mx-auto text-base md:text-lg leading-relaxed font-medium px-4">
          The archive is waiting for its next great masterpiece.
        </p>
        <Link to="/shop" className="bg-obsidian dark:bg-gold text-white dark:text-obsidian px-10 md:px-16 py-4 md:py-6 uppercase tracking-[0.3em] text-[10px] font-black transition-all hover:scale-105 shadow-2xl inline-block">
          Explore Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16 animate-reveal">
      <header className="mb-10 md:mb-16 border-b border-gold/10 pb-6 md:pb-10 text-center">
        <h1 className="text-2xl md:text-3xl tracking-[0.4em] uppercase font-black">Shopping Archive</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        <div className="flex-grow space-y-8 md:space-y-12">
          {cart.map(item => (
            <div key={item.watch.id} className="flex flex-col sm:flex-row gap-6 md:gap-10 pb-8 border-b border-gold/5 group items-start sm:items-center">
              <div className="w-full sm:w-28 md:w-36 aspect-[3/4] sm:h-48 bg-white dark:bg-white/5 shrink-0 border border-gold/10 shadow-2xl overflow-hidden rounded-xl">
                <img src={item.watch.images[0]} alt={item.watch.name} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="flex-grow w-full space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-gold text-[9px] md:text-[10px] uppercase tracking-[0.4em] block font-black">{item.watch.brand_name}</span>
                    <h3 className="text-lg md:text-xl tracking-[0.1em] uppercase font-black leading-tight">{item.watch.name}</h3>
                  </div>
                  <button onClick={() => removeFromCart(item.watch.id)} className="opacity-40 hover:opacity-100 transition-all hover:rotate-90 p-2 text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                
                <div className="flex flex-row items-center justify-between pt-2 gap-4">
                  <div className="flex items-center border border-gold/20 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.watch.id, item.quantity - 1)} className="px-4 py-1.5 text-gold font-bold hover:bg-gold/10 transition-colors">-</button>
                    <span className="w-8 text-center text-[10px] font-black tracking-widest">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.watch.id, item.quantity + 1)} className="px-4 py-1.5 text-gold font-bold hover:bg-gold/10 transition-colors">+</button>
                  </div>
                  <span className="text-lg md:text-xl text-gold tracking-widest font-black">
                    ${(item.watch.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="w-full lg:w-80">
          <div className="bg-white dark:bg-obsidian p-6 md:p-8 border border-gold/20 rounded-2xl space-y-8 sticky top-32 shadow-4xl">
            <h3 className="uppercase tracking-[0.5em] text-[10px] font-black text-gold text-center">Acquisition Summary</h3>
            
            <div className="space-y-6 text-[10px] tracking-[0.15em] uppercase font-bold">
              <div className="flex justify-between opacity-50">
                <span>Value</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between opacity-50">
                <span>Delivery</span>
                <span className="text-gold">Complimentary</span>
              </div>
              <div className="pt-6 border-t border-gold/10 flex justify-between text-xl font-black">
                <span>Total</span>
                <span className="text-gold">${subtotal.toLocaleString()}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="block w-full text-center bg-obsidian dark:bg-gold text-white dark:text-obsidian py-4 rounded-xl uppercase tracking-[0.4em] text-[10px] font-black transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-xl"
            >
              {user ? 'Secure Acquisition' : 'Login to Checkout'}
            </Link>

            <p className="text-[8px] opacity-30 leading-loose text-center uppercase tracking-[0.25em] font-black italic">
              {user 
                ? 'Highest-grade security protocols active.' 
                : 'Authentication required for artifact registry.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
