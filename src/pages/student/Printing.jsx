import React, { useState, useEffect } from 'react';
import { Printer, Upload, CheckCircle, Clock, CreditCard, FileText, ChevronRight, RefreshCw, ExternalLink } from 'lucide-react';

const Printing = () => {
  const [activeTab, setActiveTab] = useState('new-order');
  const [formData, setFormData] = useState({
    title: '',
    file_url: '',
    copies: 1,
    color_type: 'BW',
    pages: 1,
    input_type: 'link' // 'link' or 'file'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [price, setPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setShowSuccess] = useState(false);
  
  // My Orders State
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    const pricePerPage = formData.color_type === 'Color' ? 10 : 2;
    setPrice(pricePerPage * formData.pages * formData.copies);
  }, [formData]);

  const fetchMyOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.id) {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/printing/my/${user.id}`);
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-orders') {
      fetchMyOrders();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return alert('Please login first');

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/printing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user.id
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        setFormData({ title: '', file_url: '', copies: 1, color_type: 'BW', pages: 1, input_type: 'link' });
        setSelectedFile(null);
      }
    } catch (err) {
      console.error('Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'printing': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'printing': return <Printer size={14} className="animate-pulse" />;
      default: return <Clock size={14} />;
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6 animate-in zoom-in duration-300">
        <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Order Placed!</h2>
        <p className="text-slate-500 font-medium">Your printing request has been sent to the PCU store. You can track its status in "My Orders".</p>
        <div className="flex gap-4 pt-4">
          <button onClick={() => setShowSuccess(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all">New Order</button>
          <button onClick={() => { setShowSuccess(false); setActiveTab('my-orders'); }} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-600/20 transition-all">Track Status</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header with Tabs */}
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
              <Printer className="text-sky-400" size={40} />
              PCU Printing Hub
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-medium">Place new orders and track your printing status.</p>
          </div>
          
          <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
            <button 
              onClick={() => setActiveTab('new-order')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'new-order' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:text-white'}`}
            >
              New Order
            </button>
            <button 
              onClick={() => setActiveTab('my-orders')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-orders' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:text-white'}`}
            >
              My Orders
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
          <Printer size={240} />
        </div>
      </div>

      {activeTab === 'new-order' ? (
        <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Upload className="text-sky-500" /> Upload Document
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Document Title</label>
                  <input 
                    type="text" 
                    name="title"
                    required 
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Economics Assignment" 
                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" 
                  />
                </div>

                {/* Input Type Selector */}
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, input_type: 'link'})}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${formData.input_type === 'link' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Link
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, input_type: 'file'})}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${formData.input_type === 'file' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Upload PDF
                  </button>
                </div>

                {formData.input_type === 'link' ? (
                  <div className="animate-in slide-in-from-left duration-300">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Document Link (Google Drive/OneDrive)</label>
                    <input 
                      type="text" 
                      name="file_url"
                      required 
                      value={formData.file_url}
                      onChange={handleInputChange}
                      placeholder="https://..." 
                      className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" 
                    />
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-right duration-300">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Upload PDF File</label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-sky-500 transition-colors cursor-pointer group">
                      <input 
                        type="file" 
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.type !== 'application/pdf') {
                              alert("Only PDF files are allowed!");
                              e.target.value = null;
                              setSelectedFile(null);
                            } else {
                              setSelectedFile(file);
                              setFormData({ ...formData, file_url: `File: ${file.name}` });
                            }
                          }
                        }}
                      />
                      <div className="flex flex-col items-center">
                        <Upload className={`h-8 w-8 mb-2 ${selectedFile ? 'text-emerald-500' : 'text-slate-300 group-hover:text-sky-500'}`} />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          {selectedFile ? selectedFile.name : 'Click to Upload PDF'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pages</label>
                    <input 
                      type="number" 
                      name="pages"
                      min="1" 
                      required 
                      value={formData.pages}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Copies</label>
                    <input 
                      type="number" 
                      name="copies"
                      min="1" 
                      required 
                      value={formData.copies}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Color Type</label>
                    <select 
                      name="color_type"
                      value={formData.color_type}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 appearance-none bg-white transition-all"
                    >
                      <option value="BW">B/W (₹2)</option>
                      <option value="Color">Color (₹10)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <span className="font-bold text-slate-600">Total Price</span>
                </div>
                <span className="text-3xl font-black text-sky-600">₹{price}</span>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[2rem] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Processing...' : 'Submit Printing Order'}
                {!isSubmitting && <ChevronRight size={20} />}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-sky-50 border border-sky-100 p-8 rounded-[2.5rem]">
              <h3 className="font-bold text-sky-900 mb-4 flex items-center gap-2 text-lg">
                <FileText size={20} className="text-sky-600" />
                Pricing Guide
              </h3>
              <ul className="space-y-4 text-sm font-medium text-sky-700">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                  <span>Black & White</span>
                  <span className="font-black">₹2 / page</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                  <span>Full Color</span>
                  <span className="font-black">₹10 / page</span>
                </li>
              </ul>
              <p className="text-[10px] mt-6 text-sky-600 font-bold uppercase tracking-widest text-center">Price = (Rate × Pages) × Copies</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem]">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                <Clock size={20} className="text-slate-500" />
                Service Hours
              </h3>
              <div className="space-y-2 text-sm font-medium text-slate-600">
                <p className="flex justify-between"><span>Mon - Fri</span> <span className="text-slate-900 font-bold">9:00 - 18:00</span></p>
                <p className="flex justify-between"><span>Saturday</span> <span className="text-slate-900 font-bold">10:00 - 14:00</span></p>
                <p className="flex justify-between text-rose-500"><span>Sunday</span> <span className="font-bold">Closed</span></p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {isLoadingOrders ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-48 rounded-[2rem] animate-pulse border border-slate-100 shadow-sm" />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map(order => (
                <div key={order.order_id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                      <span className="text-lg font-black text-slate-900">₹{order.price}</span>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-sky-600 transition-colors">
                      {order.file_url.split('/').pop() || 'Document'}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Copies</p>
                        <p className="font-bold text-slate-700">{order.copies}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Type</p>
                        <p className="font-bold text-slate-700">{order.color_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pt-2">
                      <Clock size={14} />
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <a 
                    href={order.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-sky-600 font-bold hover:bg-sky-50 transition-all text-sm"
                  >
                    <ExternalLink size={16} /> View Document
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white py-20 text-center rounded-[3rem] border border-slate-200 shadow-sm">
              <Printer className="mx-auto h-20 w-20 text-slate-100 mb-6" />
              <h2 className="text-2xl font-bold text-slate-900">No Orders Yet</h2>
              <p className="text-slate-500 mt-2 mb-8">Ready to print something? Get started below.</p>
              <button 
                onClick={() => setActiveTab('new-order')}
                className="bg-sky-600 hover:bg-sky-500 text-white font-black px-10 py-4 rounded-2xl shadow-lg shadow-sky-600/20 transition-all"
              >
                Place New Order
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Printing;
