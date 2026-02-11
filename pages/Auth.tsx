
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) {
            if (error.message.includes("rate limit")) {
                throw new Error("Email rate limit exceeded. Please wait 1 hour or disable 'Confirm Email' in your Supabase dashboard settings.");
            }
            throw error;
        }
        setMessage("Verification link sent. Please check your inbox.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-white/5 border border-gold/10 p-8 md:p-12 rounded-2xl shadow-4xl gold-glow animate-reveal">
        <div className="text-center mb-12">
          <span className="text-gold uppercase tracking-[0.5em] text-[10px] font-black block mb-4">Client Portal</span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
            {isLogin ? 'Private Entry' : 'New Membership'}
          </h1>
          <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest leading-relaxed">
            {isLogin ? 'Access your private collection' : 'Join the elite circle of Chronos'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] leading-relaxed uppercase font-black tracking-widest text-center rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-8 p-4 bg-gold/10 border border-gold/20 text-gold text-[11px] leading-relaxed uppercase font-black tracking-widest text-center rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-8">
          <div className="space-y-1.5">
            <label className="text-[8px] uppercase font-black text-gold tracking-widest">Email Address</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gold/20 py-3 text-sm focus:border-gold outline-none transition-all font-medium"
              placeholder="sharifislam02001@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[8px] uppercase font-black text-gold tracking-widest">Password</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gold/20 py-3 text-sm focus:border-gold outline-none transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-obsidian dark:bg-gold text-white dark:text-obsidian py-5 rounded-xl text-[10px] uppercase font-black tracking-[0.4em] shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Enter Atelier' : 'Request Access'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gold/10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[9px] uppercase font-black text-gold tracking-widest hover:opacity-60 transition-all"
          >
            {isLogin ? "Request Membership Access" : "Already a member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
