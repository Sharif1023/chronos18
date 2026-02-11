
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Watch, CartItem, Order } from '../types';
import { WATCHES } from '../constants';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface SiteSettings {
  hero_tag: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_primary_btn_text: string;
  hero_secondary_btn_text: string;
  featured_tag: string;
  featured_heading: string;
  featured_archive_link_text: string;
  immersive_heading: string;
  immersive_subheading: string;
  immersive_description: string;
  immersive_button_text: string;
  immersive_image_url: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface ShopContextType {
  watches: Watch[];
  cart: CartItem[];
  orders: Order[];
  inquiries: Inquiry[];
  theme: 'light' | 'dark';
  siteSettings: SiteSettings;
  loading: boolean;
  initialLoadComplete: boolean;
  toggleTheme: () => void;
  addToCart: (watch: Watch) => void;
  removeFromCart: (watchId: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customer: Order['customer']) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateWatch: (updatedWatch: Watch) => Promise<void>;
  deleteWatch: (id: string) => Promise<void>;
  addWatch: (newWatch: Watch) => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  submitMessage: (data: { name: string; email: string; subject: string; message: string }) => Promise<boolean>;
  fetchInquiries: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const defaultSettings: SiteSettings = {
  hero_tag: 'The Art of Precision',
  hero_title: 'Absolute Legacy',
  hero_subtitle: '"A timepiece is a silent witness to your life\'s greatest moments."',
  hero_image_url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2000&auto=format&fit=crop',
  hero_primary_btn_text: 'Explore Atelier',
  hero_secondary_btn_text: 'Our Heritage',
  featured_tag: 'The Masterpieces',
  featured_heading: 'Curated Selection',
  featured_archive_link_text: 'Complete Archive',
  immersive_heading: 'The Atelier',
  immersive_subheading: 'Private',
  immersive_description: 'Experience the pinnacle of fine watchmaking in our private gallery spaces.',
  immersive_button_text: 'Request Exclusive Access',
  immersive_image_url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2000&auto=format&fit=crop'
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [watches, setWatches] = useState<Watch[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const isFirstMount = useRef(true);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('chronos_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);

  const fetchWatches = async () => {
    const { data, error } = await supabase.from('watches').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      if (data.length === 0 && !localStorage.getItem('chronos_db_initialized')) {
        setWatches(WATCHES);
      } else {
        setWatches(data);
      }
    } else if (error) {
      console.error("Error fetching watches:", error);
      setWatches([]);
    }
  };

  const fetchInquiries = async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (!error && data) setInquiries(data);
  };

  useEffect(() => {
    const initData = async () => {
      if (!initialLoadComplete) {
        setLoading(true);
      }

      try {
        await fetchWatches();
        const { data: orderData } = await supabase.from('orders').select('*').order('date', { ascending: false });
        if (orderData) setOrders(orderData);
        
        const { data: settingsData } = await supabase.from('site_settings').select('*').single();
        if (settingsData) {
          setSiteSettings({ ...defaultSettings, ...settingsData });
        }
        
        if (user?.email === 'sharifislam02001@gmail.com') {
          await fetchInquiries();
        }

        if (isFirstMount.current) {
          const savedCart = localStorage.getItem('chronos_cart');
          if (savedCart) setCart(JSON.parse(savedCart));
          isFirstMount.current = false;
        }
      } catch (err) {
        console.error("Init Error:", err);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };
    initData();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('chronos_cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  useEffect(() => {
    localStorage.setItem('chronos_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addToCart = (watch: Watch) => {
    setCart(prev => {
      const existing = prev.find(item => item.watch.id === watch.id);
      if (existing) {
        return prev.map(item => item.watch.id === watch.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { watch, quantity: 1 }];
    });
  };

  const removeFromCart = (watchId: string) => setCart(prev => prev.filter(item => item.watch.id !== watchId));
  const updateQuantity = (watchId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(watchId);
    setCart(prev => prev.map(item => item.watch.id === watchId ? { ...item, quantity } : item));
  };
  const clearCart = () => setCart([]);
  
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const placeOrder = async (customer: Order['customer']): Promise<boolean> => {
    if (cart.length === 0) return false;
    const total = cart.reduce((acc, item) => acc + item.watch.price * item.quantity, 0);
    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
    const newOrder = { id: orderId, date: new Date().toISOString(), items: cart, total, status: 'Pending', customer, user_id: user?.id || null };
    const { error } = await supabase.from('orders').insert([newOrder]);
    if (!error) {
      setOrders(prev => [newOrder as any, ...prev]);
      clearCart();
      return true;
    }
    return false;
  };

  const submitMessage = async (data: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
    const { error } = await supabase.from('messages').insert([data]);
    return !error;
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      return true;
    }
    return false;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } else {
      console.error("Update Order Error:", error);
      alert(`Status Sync Error: ${error.message}`);
    }
  };

  const addWatch = async (w: Watch) => {
    const { id, name, brand_id, brand_name, price, description, images, specifications, stock, category, featured } = w;
    const payload = { id, name, brand_id, brand_name, price, description, images, specifications, stock, category, featured };
    const { error } = await supabase.from('watches').insert([payload]);
    if (!error) {
      localStorage.setItem('chronos_db_initialized', 'true');
      await fetchWatches();
    } else {
      console.error("Add Watch Error:", error);
      alert(`Registry Sync Error: ${error.message}`);
    }
  };

  const updateWatch = async (w: Watch) => {
    const { id, name, brand_id, brand_name, price, description, images, specifications, stock, category, featured } = w;
    const payload = { id, name, brand_id, brand_name, price, description, images, specifications, stock, category, featured };
    const { error } = await supabase.from('watches').upsert([payload]);
    if (!error) {
      localStorage.setItem('chronos_db_initialized', 'true');
      await fetchWatches();
    } else {
      console.error("Update Watch Error:", error);
      alert(`Registry Update Error: ${error.message}`);
    }
  };

  const deleteWatch = async (id: string) => {
    const { error } = await supabase.from('watches').delete().eq('id', id);
    if (!error) {
      setWatches(prev => prev.filter(item => item.id !== id));
    } else {
      console.error("Delete Watch Error:", error);
    }
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    const { error } = await supabase.from('site_settings').upsert({ id: 1, ...settings });
    if (!error) {
      setSiteSettings(settings);
    } else {
      console.error("Settings Update Error:", error);
      alert(`Config Sync Error: ${error.message}`);
    }
  };

  return (
    <ShopContext.Provider value={{ 
      watches, cart, orders, inquiries, theme, siteSettings, loading, initialLoadComplete, toggleTheme, addToCart, removeFromCart, updateQuantity, 
      clearCart, placeOrder, cancelOrder, updateOrderStatus, updateWatch, deleteWatch, addWatch, updateSiteSettings, submitMessage, fetchInquiries
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
