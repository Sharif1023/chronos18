
import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Watch, Order } from '../types';
import { BRANDS } from '../constants';

const AdminDashboard: React.FC = () => {
  const { watches, orders, inquiries, siteSettings, deleteWatch, updateWatch, addWatch, updateSiteSettings, updateOrderStatus } = useShop();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'inquiries'>('products');
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tempSettings, setTempSettings] = useState(siteSettings);
  const [isSyncing, setIsSyncing] = useState(false);

  const categories: Watch['category'][] = ['Classic', 'Sport', 'Dive', 'Aviator'];

  const stats = {
    revenue: orders.reduce((acc, o) => acc + o.total, 0),
    orderCount: orders.length,
    watchCount: watches.length,
    messageCount: inquiries.length
  };

  const handleEditClick = (watch: Watch) => {
    setEditingWatch({ ...watch });
    setIsNew(false);
  };

  const handleAddNewClick = () => {
    const newWatch: Watch = {
      id: `w-${Date.now()}`,
      name: '',
      brand_id: BRANDS[0].id,
      brand_name: BRANDS[0].name,
      price: 0,
      description: '',
      images: [''],
      specifications: { case: '', movement: '', waterResistance: '', strap: '' },
      stock: 10,
      category: 'Classic',
      featured: false
    };
    setEditingWatch(newWatch);
    setIsNew(true);
  };

  const handleSaveWatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWatch) {
      setIsSyncing(true);
      try {
        const cleanedImages = editingWatch.images.filter(img => img && img.trim() !== '');
        const watchToSave = {
            ...editingWatch,
            images: cleanedImages.length > 0 ? cleanedImages : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30']
        };

        if (isNew) {
          await addWatch(watchToSave);
        } else {
          await updateWatch(watchToSave);
        }
        setEditingWatch(null);
      } catch (err) {
        console.error("Registry Sync Failure:", err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await updateSiteSettings(tempSettings);
      alert("Public environment configurations have been synchronized.");
    } catch (err) {
      console.error("Settings Save Failure:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const addImageField = () => {
    if (editingWatch) {
      setEditingWatch({ ...editingWatch, images: [...editingWatch.images, ''] });
    }
  };

  const removeImageField = (index: number) => {
    if (editingWatch) {
      const newImages = [...editingWatch.images];
      newImages.splice(index, 1);
      setEditingWatch({ ...editingWatch, images: newImages });
    }
  };

  const updateImageField = (index: number, value: string) => {
    if (editingWatch) {
      const newImages = [...editingWatch.images];
      newImages[index] = value;
      setEditingWatch({ ...editingWatch, images: newImages });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-10 md:py-20 animate-reveal min-h-screen font-sans text-obsidian dark:text-champagne">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-10 mb-10 md:mb-16">
        <div>
          <span className="text-gold uppercase tracking-[0.4em] text-[7px] md:text-[9px] font-black block mb-2">Internal Management</span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight">Atelier Dashboard</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-6">
          <div className="flex bg-gold/5 dark:bg-white/5 p-1 border border-gold/10 rounded-lg w-full sm:w-auto">
            {(['products', 'orders', 'inquiries', 'settings'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-3 md:px-6 py-1.5 md:py-2.5 rounded-md text-[7px] md:text-[9px] uppercase font-black tracking-widest transition-all ${activeTab === tab ? 'bg-gold text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
              >
                {tab === 'products' ? 'Gallery' : tab === 'orders' ? 'Sales' : tab === 'inquiries' ? 'Inquiries' : 'CMS'}
              </button>
            ))}
          </div>
          {activeTab === 'products' && (
            <button onClick={handleAddNewClick} className="w-full sm:w-auto bg-gold text-obsidian px-5 md:px-7 py-2.5 md:py-3 rounded-lg text-[7px] md:text-[9px] uppercase font-black tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
              + New Artifact
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16">
        {[
          { label: 'Valuation', value: `$${stats.revenue.toLocaleString()}`, color: 'text-gold' },
          { label: 'Sales', value: stats.orderCount, color: 'text-current' },
          { label: 'Registry', value: stats.watchCount, color: 'text-current' },
          { label: 'Inquiries', value: stats.messageCount, color: 'text-gold' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-white/5 p-4 md:p-8 rounded-xl border border-gold/10 shadow-sm">
            <span className="text-[6px] md:text-[8px] opacity-40 uppercase tracking-[0.2em] font-black block mb-1 md:mb-4">{stat.label}</span>
            <p className={`text-md md:text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gold/10 shadow-2xl overflow-hidden">
        {activeTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gold/5 dark:bg-black/40 border-b border-gold/10 text-[7px] md:text-[9px] uppercase font-black tracking-[0.2em] opacity-40">
                  <th className="px-4 md:px-10 py-3 md:py-6">Identity</th>
                  <th className="hidden sm:table-cell px-4 md:px-10 py-3 md:py-6">Maison</th>
                  <th className="px-4 md:px-10 py-3 md:py-6">Value</th>
                  <th className="hidden md:table-cell px-4 md:px-10 py-3 md:py-6">Inventory</th>
                  <th className="px-4 md:px-10 py-3 md:py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {watches.map(watch => (
                  <tr key={watch.id} className="hover:bg-gold/[0.02] transition-colors group">
                    <td className="px-4 md:px-10 py-3 md:py-6">
                      <div className="flex items-center gap-3 md:gap-6">
                        <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg overflow-hidden border border-gold/10 shrink-0 bg-black/5">
                          <img src={watch.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        </div>
                        <div>
                          <p className="font-black uppercase text-[10px] md:text-sm tracking-tight">{watch.name}</p>
                          {watch.featured && <span className="text-[5px] md:text-[7px] text-gold font-black uppercase tracking-widest bg-gold/10 px-2 py-0.5 rounded-full">Museum</span>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 md:px-10 py-3 md:py-6">
                      <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-60">{watch.brand_name}</span>
                    </td>
                    <td className="px-4 md:px-10 py-3 md:py-6">
                      <span className="text-xs md:text-md font-black text-gold">${watch.price.toLocaleString()}</span>
                    </td>
                    <td className="hidden md:table-cell px-4 md:px-10 py-3 md:py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${watch.stock < 3 ? 'bg-red-500 animate-pulse' : 'bg-gold'}`}></div>
                        <span className={`text-[8px] md:text-[10px] font-black uppercase ${watch.stock < 3 ? 'text-red-500' : 'opacity-60'}`}>{watch.stock} Units</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-10 py-3 md:py-6 text-right">
                      <div className="flex justify-end gap-3 md:gap-6">
                        <button onClick={() => handleEditClick(watch)} className="text-gold font-black text-[7px] md:text-[9px] uppercase hover:underline underline-offset-4">Refine</button>
                        <button onClick={() => { if(window.confirm('Retract this artifact?')) deleteWatch(watch.id)}} className="text-red-500/40 hover:text-red-500 font-black text-[7px] md:text-[9px] uppercase transition-colors">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gold/5 dark:bg-black/40 border-b border-gold/10 text-[7px] md:text-[9px] uppercase font-black tracking-[0.2em] opacity-40">
                  <th className="px-4 md:px-10 py-3 md:py-6">Ref ID</th>
                  <th className="px-4 md:px-10 py-3 md:py-6">Acquirer</th>
                  <th className="px-4 md:px-10 py-3 md:py-6">Total</th>
                  <th className="hidden sm:table-cell px-4 md:px-10 py-3 md:py-6">Date</th>
                  <th className="px-4 md:px-10 py-3 md:py-6 text-right">Status Manifest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gold/[0.02] transition-colors">
                    <td className="px-4 md:px-10 py-3 md:py-6">
                      <span className="font-mono text-[7px] md:text-[10px] opacity-40 font-bold">{order.id}</span>
                    </td>
                    <td className="px-4 md:px-10 py-3 md:py-6">
                      <p className="font-black uppercase text-[9px] md:text-xs tracking-tight">{order.customer.name}</p>
                      <p className="text-[7px] md:text-[8px] opacity-40 truncate max-w-[100px]">{order.customer.email}</p>
                    </td>
                    <td className="px-4 md:px-10 py-3 md:py-6">
                      <span className="text-[10px] md:text-md font-black text-gold">${order.total.toLocaleString()}</span>
                    </td>
                    <td className="hidden sm:table-cell px-4 md:px-10 py-3 md:py-6 text-[7px] md:text-[10px] opacity-40 font-bold">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-10 py-3 md:py-6 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="bg-gold/10 text-gold text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-lg px-3 py-1.5 outline-none border-none cursor-pointer hover:bg-gold/20 transition-all appearance-none text-center"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
              <thead>
                <tr className="bg-gold/5 dark:bg-black/40 border-b border-gold/10 text-[7px] md:text-[9px] uppercase font-black tracking-[0.2em] opacity-40">
                  <th className="px-4 md:px-10 py-3 md:py-6">Client</th>
                  <th className="px-4 md:px-10 py-3 md:py-6">Subject</th>
                  <th className="hidden sm:table-cell px-4 md:px-10 py-3 md:py-6">Message Preview</th>
                  <th className="px-4 md:px-10 py-3 md:py-6 text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {inquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-gold/[0.02] transition-colors group">
                    <td className="px-4 md:px-10 py-3 md:py-6">
                      <p className="font-black uppercase text-[9px] md:text-xs tracking-tight">{inq.name}</p>
                      <p className="text-[7px] md:text-[8px] opacity-40">{inq.email}</p>
                    </td>
                    <td className="px-4 md:px-10 py-3 md:py-6">
                      <span className="text-[9px] md:text-xs font-bold uppercase text-gold">{inq.subject}</span>
                    </td>
                    <td className="hidden sm:table-cell px-4 md:px-10 py-3 md:py-6">
                      <p className="text-[8px] md:text-[10px] opacity-60 line-clamp-1 max-w-xs">{inq.message}</p>
                    </td>
                    <td className="px-4 md:px-10 py-3 md:py-6 text-right">
                      <span className="text-[7px] md:text-[9px] opacity-40 uppercase font-bold">{new Date(inq.created_at).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 md:p-16 max-w-5xl mx-auto space-y-20">
            <form onSubmit={handleSaveSettings} className="space-y-24">
              <div className="space-y-12">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-gold border-b border-gold/20 pb-4">Hero Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-2">
                    <label className="text-[7px] md:text-[9px] uppercase font-black opacity-40 tracking-widest">Tagline</label>
                    <input type="text" value={tempSettings.hero_tag} onChange={e => setTempSettings({...tempSettings, hero_tag: e.target.value})} className="w-full bg-transparent border-b border-gold/20 py-2 outline-none font-bold text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[7px] md:text-[9px] uppercase font-black opacity-40 tracking-widest">Headline</label>
                    <input type="text" value={tempSettings.hero_title} onChange={e => setTempSettings({...tempSettings, hero_title: e.target.value})} className="w-full bg-transparent border-b border-gold/20 py-2 outline-none font-bold text-sm" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[7px] md:text-[9px] uppercase font-black opacity-40 tracking-widest">Sub-Headline (Narrative)</label>
                    <input type="text" value={tempSettings.hero_subtitle} onChange={e => setTempSettings({...tempSettings, hero_subtitle: e.target.value})} className="w-full bg-transparent border-b border-gold/20 py-2 outline-none font-bold text-sm" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[7px] md:text-[9px] uppercase font-black opacity-40 tracking-widest">Hero Backdrop URL</label>
                    <input type="text" value={tempSettings.hero_image_url} onChange={e => setTempSettings({...tempSettings, hero_image_url: e.target.value})} className="w-full bg-transparent border-b border-gold/20 py-2 outline-none font-mono text-[10px]" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSyncing}
                className="w-full bg-gold text-obsidian py-4 md:py-6 rounded-xl text-[9px] md:text-[11px] uppercase font-black tracking-[0.4em] shadow-xl hover:-translate-y-1 transition-all"
              >
                {isSyncing ? 'Synchronizing Environment...' : 'Commit Public Manifest'}
              </button>
            </form>
          </div>
        )}
      </div>

      {editingWatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/80 backdrop-blur-3xl p-4 md:p-10">
          <div className="bg-champagne dark:bg-obsidian w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] md:rounded-3xl overflow-hidden shadow-4xl flex flex-col border border-gold/20">
            <header className="px-6 py-4 md:px-10 md:py-8 border-b border-gold/10 flex justify-between items-center bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-20">
              <div>
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight">{isNew ? 'New Archive Entry' : 'Refine Artifact'}</h2>
                <p className="text-[6px] md:text-[8px] opacity-40 uppercase font-black tracking-widest">Registry Protocol v3.0</p>
              </div>
              <button onClick={() => setEditingWatch(null)} className="p-3 opacity-40 hover:opacity-100 transition-all hover:rotate-90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>

            <form onSubmit={handleSaveWatch} className="flex-grow overflow-y-auto no-scrollbar p-6 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
                <div className="lg:col-span-2 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-1.5">
                      <label className="text-[7px] md:text-[9px] uppercase font-black text-gold tracking-widest">Designation Name</label>
                      <input required type="text" value={editingWatch.name} onChange={e => setEditingWatch({...editingWatch, name: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-gold/20 rounded-lg px-4 py-3 outline-none font-bold uppercase text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[7px] md:text-[9px] uppercase font-black text-gold tracking-widest">Maison (Brand)</label>
                      <select value={editingWatch.brand_name} onChange={e => {
                        const b = BRANDS.find(brand => brand.name === e.target.value);
                        if(b) setEditingWatch({...editingWatch, brand_name: b.name, brand_id: b.id});
                      }} className="w-full bg-white dark:bg-white/5 border border-gold/20 rounded-lg px-4 py-3 outline-none font-bold uppercase text-sm appearance-none">
                        {BRANDS.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[7px] md:text-[9px] uppercase font-black text-gold tracking-widest">Series (Category)</label>
                      <select value={editingWatch.category} onChange={e => setEditingWatch({...editingWatch, category: e.target.value as any})} className="w-full bg-white dark:bg-white/5 border border-gold/20 rounded-lg px-4 py-3 outline-none font-bold uppercase text-sm appearance-none">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[7px] md:text-[9px] uppercase font-black text-gold tracking-widest">Historical Context (Description)</label>
                    <textarea rows={4} value={editingWatch.description} onChange={e => setEditingWatch({...editingWatch, description: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-gold/20 rounded-xl px-4 py-4 outline-none font-medium text-sm" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pt-10 border-t border-gold/10">
                    <div className="space-y-1.5">
                      <label className="text-[7px] md:text-[9px] uppercase font-black text-gold tracking-widest">Exoskeleton (Case)</label>
                      <input type="text" value={editingWatch.specifications.case} onChange={e => setEditingWatch({...editingWatch, specifications: {...editingWatch.specifications, case: e.target.value}})} className="w-full bg-transparent border-b border-gold/20 py-2 outline-none font-bold text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[7px] md:text-[9px] uppercase font-black text-gold tracking-widest">The Pulse (Movement)</label>
                      <input type="text" value={editingWatch.specifications.movement} onChange={e => setEditingWatch({...editingWatch, specifications: {...editingWatch.specifications, movement: e.target.value}})} className="w-full bg-transparent border-b border-gold/20 py-2 outline-none font-bold text-xs" />
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="bg-gold/[0.03] p-6 md:p-8 rounded-2xl border border-gold/10 space-y-8">
                    <div className="space-y-1">
                      <label className="text-[6px] md:text-[8px] uppercase font-black opacity-40">Valuation ($)</label>
                      <input required type="number" value={editingWatch.price} onChange={e => setEditingWatch({...editingWatch, price: parseInt(e.target.value) || 0})} className="w-full bg-transparent border-b-2 border-gold/20 py-1 text-2xl md:text-3xl font-black text-gold outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[6px] md:text-[8px] uppercase font-black opacity-40">Archive Stock</label>
                      <input required type="number" value={editingWatch.stock} onChange={e => setEditingWatch({...editingWatch, stock: parseInt(e.target.value) || 0})} className="w-full bg-transparent border-b border-gold/20 py-1 text-xl font-bold outline-none" />
                    </div>
                    <div className="flex items-center gap-4 py-2">
                       <input 
                        type="checkbox" 
                        id="featured-toggle"
                        checked={editingWatch.featured} 
                        onChange={e => setEditingWatch({...editingWatch, featured: e.target.checked})} 
                        className="w-4 h-4 accent-gold"
                      />
                      <label htmlFor="featured-toggle" className="text-[9px] uppercase font-black tracking-widest cursor-pointer">Exhibit on Home Showcase</label>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">Visual Portfolio</h3>
                      <button type="button" onClick={addImageField} className="text-[6px] md:text-[8px] font-black uppercase tracking-widest bg-gold/10 text-gold px-3 py-1 rounded-full hover:bg-gold hover:text-white transition-all">+ Add Angle</button>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                      {editingWatch.images.map((img, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-gold/10 group">
                          <div className="w-12 h-12 shrink-0 bg-black/5 rounded-lg overflow-hidden border border-gold/10 flex items-center justify-center">
                            {img ? (
                              <img src={img} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <span className="text-[6px] opacity-20 uppercase font-black">No Img</span>
                            )}
                          </div>
                          <input 
                            type="text" 
                            value={img} 
                            onChange={e => updateImageField(idx, e.target.value)} 
                            className="w-full bg-transparent border-b border-gold/10 py-1 outline-none text-[8px] md:text-[10px] font-mono" 
                            placeholder="Image URL..." 
                          />
                          <button type="button" onClick={() => removeImageField(idx)} className="text-red-500/40 hover:text-red-500 p-2 transition-colors font-bold uppercase text-[8px]">Del</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 md:mt-20 pt-8 border-t border-gold/10 flex flex-row gap-4 md:gap-8 sticky bottom-0 bg-champagne/95 dark:bg-obsidian/95 py-4 backdrop-blur-md">
                <button type="submit" disabled={isSyncing} className="flex-grow bg-gold text-obsidian py-4 md:py-6 rounded-xl text-[9px] md:text-[11px] uppercase font-black tracking-[0.4em] shadow-xl transition-all hover:-translate-y-1">
                  {isSyncing ? 'Synchronizing Archive...' : 'Seal Registry Entry'}
                </button>
                <button type="button" onClick={() => setEditingWatch(null)} className="px-8 md:px-16 border border-gold/20 text-gold py-4 md:py-6 rounded-xl text-[8px] md:text-[10px] uppercase font-black tracking-widest hover:bg-gold/5 transition-all">Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
