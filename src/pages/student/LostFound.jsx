import React, { useState } from 'react';
import { Search, MapPin, Calendar, Plus, X, Upload, MessageSquare, Phone, User } from 'lucide-react';

const StudentLostFound = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');

  const [newItem, setNewItem] = useState({
    title: '',
    desc: '',
    type: 'lost',
    location: '',
    phone: '',
    image: null
  });

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      date: "Today",
      image: newItem.image || "https://placehold.co/100x100/e2e8f0/64748b?text=New+Item"
    };
    setItems([itemToAdd, ...items]);
    setIsModalOpen(false);
    setNewItem({ title: '', desc: '', type: 'lost', location: '', phone: '', image: null });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;
    const feedbackToAdd = {
      id: Date.now(),
      text: newFeedback,
      date: new Date().toLocaleString()
    };
    setFeedbacks([feedbackToAdd, ...feedbacks]);
    setNewFeedback('');
  };

  const filteredItems = items.filter(item => item.type === activeTab);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Lost & Found Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Lost & Found</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={18} /> Report New Item
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Report Item</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleReportSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Laptop, Wallet"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                    value={newItem.type}
                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Library, Room 102"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. +91 9876543210"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                    value={newItem.phone}
                    onChange={(e) => setNewItem({...newItem, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                  <textarea 
                    required
                    rows="3"
                    placeholder="Provide more details..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500 resize-none"
                    value={newItem.desc}
                    onChange={(e) => setNewItem({...newItem, desc: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload Photo</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-sky-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500">Click to upload or drag and drop</p>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-lg transition-colors"
                >
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="flex border-b border-slate-200">
            <button 
              className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${activeTab === 'lost' ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('lost')}
            >
              Lost Items
            </button>
            <button 
              className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${activeTab === 'found' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('found')}
            >
              Found Items
            </button>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input type="text" placeholder="Search items..." className="w-full border border-slate-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              </div>
            </div>

            <div className="space-y-4">
              {filteredItems.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors group">
                  <div className="w-24 h-24 flex-shrink-0 bg-slate-100 rounded-md overflow-hidden border border-slate-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800">{item.title}</h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={12}/> {item.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 mb-3 line-clamp-2">{item.desc}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><MapPin size={12}/> {item.location}</span>
                    </div>
                    <a href={`tel:${item.phone}`} className="text-sky-600 text-sm font-bold hover:text-sky-700 transition-colors inline-flex items-center gap-1">
                      Contact {activeTab === 'lost' ? 'Owner' : 'Finder'}
                    </a>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No items found in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Feedback Corner</h2>
            <p className="text-sm text-slate-500">Help us improve your campus experience</p>
          </div>
        </div>

        <form onSubmit={handleFeedbackSubmit} className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <textarea
            required
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full min-h-[100px] border-none focus:ring-0 text-sm placeholder:text-slate-400 resize-none"
          ></textarea>
          <div className="flex justify-end pt-2 border-t border-slate-50">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Post Feedback
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Campus Member</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{fb.date}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{fb.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white/50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">No feedback yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentLostFound;
