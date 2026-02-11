
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateEmail, updatePassword } = useAuth();
  const { orders, cancelOrder } = useShop();

  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter(o => 
      o.customer && o.customer.email === user.email
    );
  }, [orders, user]);

  const totalSpent = useMemo(() => userOrders.reduce((acc, o) => acc + o.total, 0), [userOrders]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const { error } = await updateEmail(newEmail);
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Verification link sent to both old and new addresses.' });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    const { error } = await updatePassword(newPassword);
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Security credentials updated successfully.' });
      setNewPassword('');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Confirm retraction of this archival piece? This action cannot be undone.")) {
      setLoading(true);
      const success = await cancelOrder(orderId);
      setLoading(false);
      if (success) {
        setStatus({ type: 'success', message: 'Acquisition registry updated. Order retracted.' });
      } else {
        setStatus({ type: 'error', message: 'Unable to retract. Please contact the concierge.' });
      }
    }
  };

  const isCancellable = (orderDate: string, status: string) => {
    if (status !== 'Pending') return false;
    const placed = new Date(orderDate).getTime();
    const now = new Date().getTime();
    const diffHours = (now - placed) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-gold/10 text-gold border-gold/20';
      case 'Shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 md:py-20 animate-reveal font-sans text-obsidian dark:text-champagne">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
        <div>
          <span className="text-gold uppercase tracking-[0.5em] text-[10px] font-black block mb-3">Collector Registry</span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Private Atelier</h1>
          <p className="mt-2 opacity-40 uppercase text-[9px] tracking-widest font-bold">Client Reference: {user?.email}</p>
        </div>
        <div className="flex gap-4 md:gap-6">
           <div className="text-right">
             <span className="text-[8px] uppercase font-black text-gold tracking-widest block opacity-60">Status</span>
             <span className="text-sm md:text-base font-black uppercase tracking-widest">Grand Collector</span>
           </div>
           <div className="w-px h-8 bg-gold/20"></div>
           <div className="text-right">
             <span className="text-[8px] uppercase font-black text-gold tracking-widest block opacity-60">Registry Value</span>
             <span className="text-sm md:text-base font-black text-gold">${totalSpent.toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
        <div className="space-y-10">
          <section className="bg-white dark:bg-white/5 border border-gold/10 p-6 md:p-8 rounded-2xl shadow-4xl">
            <h3 className="text-[10px] uppercase font-black text-gold tracking-[0.4em] mb-6 border-b border-gold/10 pb-3">Identity Security</h3>
            
            {status && (
              <div className={`mb-6 p-3 text-[10px] uppercase font-black tracking-widest text-center rounded-lg border ${status.type === 'success' ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[8px] uppercase font-black text-gold tracking-widest">Update Email</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-gold/20 py-1.5 text-xs focus:border-gold outline-none transition-all font-medium"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || newEmail === user?.email}
                className="w-full py-3 border border-gold/20 rounded-xl text-[9px] uppercase font-black tracking-widest hover:bg-gold/5 transition-all text-gold disabled:opacity-30"
              >
                {loading ? 'Processing...' : 'Sync Email'}
              </button>
            </form>

            <form onSubmit={handleUpdatePassword} className="mt-10 space-y-5 pt-10 border-t border-gold/10">
              <div className="space-y-1">
                <label className="text-[8px] uppercase font-black text-gold tracking-widest">Update Passkey</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-gold/20 py-1.5 text-xs focus:border-gold outline-none transition-all font-medium"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !newPassword}
                className="w-full py-3 bg-obsidian dark:bg-gold text-white dark:text-obsidian rounded-xl text-[9px] uppercase font-black tracking-widest transition-all disabled:opacity-30"
              >
                {loading ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest">Acquisition Manifest</h2>
            <span className="text-[10px] font-black opacity-30 uppercase">{userOrders.length} Artifacts</span>
          </div>

          {userOrders.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-gold/10 rounded-3xl">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30 mb-6">No pieces in your archive yet.</p>
              <Link to="/shop" className="text-gold text-[9px] uppercase font-black tracking-widest border-b border-gold pb-1 hover:opacity-60 transition-all">Visit the Collection</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-white/5 border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all">
                  <div className="p-5 md:p-6 flex flex-col md:row gap-6 items-center md:flex-row">
                    <div className="w-20 h-28 bg-black/10 rounded-xl overflow-hidden shrink-0 border border-gold/10">
                       <img src={order.items[0]?.watch?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-3 text-center md:text-left">
                      <div>
                        <span className="text-[8px] uppercase font-black text-gold tracking-[0.3em]">{order.id}</span>
                        <h4 className="text-base font-black uppercase tracking-tight">
                          {order.items.length === 1 
                            ? `${order.items[0].watch.brand_name} ${order.items[0].watch.name}` 
                            : `${order.items.length} Multiple Artifacts`}
                        </h4>
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[9px] uppercase font-bold opacity-40 tracking-widest">
                        <span>Manifest Date: {new Date(order.date).toLocaleDateString()}</span>
                        <span>Value: ${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center md:items-end gap-2.5">
                      <span className={`px-4 py-1.5 border rounded-full text-[8px] font-black uppercase tracking-[0.2em] transition-all ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      
                      {isCancellable(order.date, order.status) && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={loading}
                          className="text-[8px] uppercase font-black tracking-widest text-red-500/60 hover:text-red-500 transition-all border border-red-500/10 px-3 py-1.5 rounded"
                        >
                          Retract Acquisition
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
