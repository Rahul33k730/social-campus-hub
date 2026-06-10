import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, Clock, MessageSquare, AlertCircle, User, Tag, Send, ChevronRight, Search } from 'lucide-react';

const AdminHelpdesk = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAllTickets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/helpdesk`);
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleUpdateTicket = async (id, status, response) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/helpdesk/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, response })
      });
      const data = await res.json();
      if (data.success) {
        setTickets(tickets.map(t => t.ticket_id === id ? { ...t, status: status || t.status, response: response || t.response } : t));
        setSelectedTicket(null);
        setResponseMsg('');
      }
    } catch (err) {
      console.error('Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in_progress': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'closed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const filteredTickets = tickets.filter(t => filterStatus === 'all' || t.status === filterStatus);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <HelpCircle className="text-sky-600" />
            Helpdesk Ticket Management
          </h1>
          <p className="text-slate-500 font-medium">Review and respond to campus issues submitted by users.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {['all', 'open', 'in_progress', 'resolved'].map(status => (
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

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="bg-white py-20 text-center rounded-[3rem] border border-slate-200 shadow-sm animate-pulse text-slate-400 font-bold">
              Loading Tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-white py-20 text-center rounded-[3rem] border border-slate-200 shadow-sm text-slate-400 font-bold">
              No tickets found in this category.
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <div 
                key={ticket.ticket_id} 
                onClick={() => setSelectedTicket(ticket)}
                className={`bg-white p-6 rounded-[2rem] border transition-all cursor-pointer hover:shadow-lg ${selectedTicket?.ticket_id === ticket.ticket_id ? 'border-sky-500 shadow-md ring-4 ring-sky-500/10' : 'border-slate-200'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{ticket.User?.full_name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{ticket.User?.role} • @{ticket.User?.username}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg mb-2">{ticket.subject}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{ticket.description}</p>
                
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
                  <span className="flex items-center gap-1"><Tag size={12}/> {ticket.category}</span>
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          {selectedTicket ? (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-24 animate-in slide-in-from-right duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MessageSquare className="text-sky-500" /> Ticket Response
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Update Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['in_progress', 'resolved', 'closed'].map(s => (
                      <button
                        key={s}
                        onClick={() => handleUpdateTicket(selectedTicket.ticket_id, s, null)}
                        className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedTicket.status === s ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-500'}`}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Internal Response</label>
                  <textarea 
                    value={responseMsg || selectedTicket.response || ''}
                    onChange={(e) => setResponseMsg(e.target.value)}
                    placeholder="Write a response to the student..." 
                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all h-40 resize-none"
                  ></textarea>
                </div>

                <button 
                  onClick={() => handleUpdateTicket(selectedTicket.ticket_id, null, responseMsg)}
                  disabled={isUpdating || !responseMsg}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {isUpdating ? 'Updating...' : 'Send Response'}
                  <Send size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100/50 p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <AlertCircle size={48} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-400">Select a Ticket</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">Click on a ticket from the list to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHelpdesk;
