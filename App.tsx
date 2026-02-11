
import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ShopProvider, useShop } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));

// Utility component to scroll to top only on "PUSH" navigation
// This allows "POP" (back button) to restore scroll position naturally
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
};

const LoadingScreen = () => (
  <div className="h-screen flex items-center justify-center bg-champagne dark:bg-obsidian font-sans">
    <div className="text-center space-y-8 animate-reveal">
      <div className="w-16 h-px bg-gold animate-[scaleX_1.5s_ease-in-out_infinite]"></div>
      <p className="tracking-[1em] text-gold text-[10px] uppercase font-black">Chronos</p>
      <p className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-bold">Synchronizing Archive...</p>
    </div>
  </div>
);

const Confirmation: React.FC = () => {
  const adminEmail = "sharifislam02001@gmail.com";
  
  return (
    <div className="max-w-7xl mx-auto px-8 py-32 md:py-64 text-center animate-reveal bg-champagne dark:bg-obsidian font-sans">
      <div className="w-24 h-24 bg-gold text-obsidian rounded-full flex items-center justify-center mx-auto mb-16 shadow-[0_30px_60px_rgba(197,160,89,0.3)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-4xl md:text-6xl tracking-tight mb-8 uppercase text-obsidian dark:text-champagne font-black">Secured</h1>
      <p className="text-obsidian/50 dark:text-champagne/40 mb-20 max-w-sm mx-auto font-bold uppercase text-[10px] tracking-[0.4em] leading-loose">
        Acquisition registry updated. Our concierge will coordinate your delivery shortly.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <a href="/#/shop" className="w-full sm:w-auto bg-obsidian dark:bg-gold text-champagne dark:text-obsidian px-12 py-6 uppercase tracking-[0.4em] text-[10px] font-black transition-all hover:scale-105 active:scale-95 shadow-2xl">
          Return to Collection
        </a>
        <a 
          href={`mailto:${adminEmail}?subject=Urgent: Order Confirmation Follow-up&body=Hello, I just placed an order on Chronos. Please confirm the acquisition manifest.`}
          className="w-full sm:w-auto border border-gold text-gold px-12 py-6 uppercase tracking-[0.4em] text-[10px] font-black transition-all hover:bg-gold/10"
        >
          Contact Concierge
        </a>
      </div>

      <p className="mt-20 text-[8px] uppercase tracking-[0.3em] opacity-30 font-bold italic">
        A copy of the manifesto has been dispatched to {adminEmail}
      </p>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { loading, initialLoadComplete } = useShop();
  
  // Only show the LoadingScreen on initial app boot
  if (loading && !initialLoadComplete) return <LoadingScreen />;

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute allowAllUsers>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/confirmation" 
              element={
                <ProtectedRoute allowAllUsers>
                  <Confirmation />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowAllUsers>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
