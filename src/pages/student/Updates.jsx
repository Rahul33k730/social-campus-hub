import React, { useState } from 'react';
import { Search, Tag, Plus, X, ShoppingBag, Phone, MapPin, DollarSign, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentBuySell = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    category: 'electronics',
    desc: '',
    location: '',
    phone: '',
  });

  const categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'books', name: 'Books' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'other', name: 'Other' }
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      seller: user?.name || 'Anonymous Student',
      date: new Date().toLocaleDateString(),
      image: `https://placehold.co/400x300/e2e8f0/64748b?text=${newItem.title.replace(/\s+/g, '+')}`
    };
    setItems([itemToAdd, ...items]);
    setIsModalOpen(false);
    setNewItem({ title: '', price: '', category: 'electronics', desc: '', location: '', phone: '' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campus Deals</h1>
          <p className="text-slate-500 mt-1">Buy and sell items within the university community</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
        >
          <Plus size={20} /> Post a Deal
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">List an Item for Sale</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePostSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Item Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Lab Coat, Engineering Math Book"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="500"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Hostel A, Canteen"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Enter your contact number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={newItem.phone}
                    onChange={(e) => setNewItem({...newItem, phone: e.target.value})}
                  />
                </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Describe the condition, usage, etc..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  value={newItem.desc}
                  onChange={(e) => setNewItem({...newItem, desc: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                List Item
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm">
                <span className="text-emerald-600 font-black text-lg">₹{item.price}</span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                  {categories.find(c => c.id === item.category)?.name}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-900 text-xl mb-2 leading-tight">{item.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1 italic">
                "{item.desc}"
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <MapPin size={14} className="text-slate-300" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <ShoppingBag size={14} className="text-slate-300" />
                  <span>Seller: {item.seller}</span>
                </div>
              </div>

              <a 
                href={`tel:${item.phone}`}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Phone size={18} /> Contact Seller
              </a>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Tag size={48} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-600">Marketplace is empty</h3>
            <p className="text-slate-400 mt-2">Have something to sell? Be the first to list it!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentBuySell;
