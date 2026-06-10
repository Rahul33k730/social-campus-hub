import React, { useState, useEffect } from 'react';
import { Printer, CheckCircle, Clock, FileText, ExternalLink, RefreshCw, User, Search } from 'lucide-react';

const AdminPrintOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/printing');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/printing/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setOrders(orders.map(o => o.order_id === id ? { ...o, status } : o));
      }
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Printer className="text-sky-600" />
            Printing Queue Management
          </h1>
          <p className="text-slate-500 font-medium">Manage student print requests and update processing status.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {['all', 'pending', 'printing', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filterStatus === status 
                ? 'bg-white text-sky-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5 border-b border-slate-100">Student Info</th>
                <th className="px-8 py-5 border-b border-slate-100">Order Details</th>
                <th className="px-8 py-5 border-b border-slate-100">Price</th>
                <th className="px-8 py-5 border-b border-slate-100">Status</th>
                <th className="px-8 py-5 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center animate-pulse text-slate-400 font-bold">Loading Queue...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold">No orders found in this category.</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.order_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{order.user?.full_name}</div>
                        <div className="text-[10px] text-slate-400 font-bold">@{order.user?.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <a 
                      href={order.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-sky-600 hover:underline flex items-center gap-1 mb-1"
                    >
                      <FileText size={14} /> {order.file_url.split('/').pop()?.substring(0, 20) || 'Document'}...
                    </a>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {order.color_type} • {order.pages} Pages • {order.copies} Copies
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-lg font-black text-slate-900">₹{order.price}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      order.status === 'printing' ? 'bg-sky-50 text-sky-600 border-sky-100' : 
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.order_id, 'printing')}
                          className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-600/20 transition-all"
                        >
                          Start Printing
                        </button>
                      )}
                      {order.status === 'printing' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.order_id, 'completed')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all"
                        >
                          Complete Order
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase">
                          <CheckCircle size={14} /> Ready for Pickup
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPrintOrders;
