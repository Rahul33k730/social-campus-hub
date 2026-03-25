import React, { useState, useEffect } from 'react';
import { HelpCircle, Send, CheckCircle, Clock, MessageSquare, AlertCircle, ChevronRight, User, Tag } from 'lucide-react';

const Helpdesk = () => {
  const [activeTab, setActiveTab] = useState('new-ticket');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Other',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setShowSuccess] = useState(false);
  
  // My Tickets State
  const [tickets, setTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  const fetchMyTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.id) {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/helpdesk/my/${user.id}`);
        const data = await response.json();
        setTickets(data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets');
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-tickets') {
      fetchMyTickets();
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/helpdesk`, {
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
        setFormData({ subject: '', description: '', category: 'Other', priority: 'medium' });
      }
    } catch (err) {
      console.error('Submission failed');
    } finally {
      setIsSubmitting(false);
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

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6 animate-in zoom-in duration-300">
        <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Ticket Submitted!</h2>
        <p className="text-slate-500 font-medium">Your issue has been logged. Our team will review it shortly. You can track progress in "My Tickets".</p>
        <div className="flex gap-4 pt-4">
          <button onClick={() => setShowSuccess(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all">New Ticket</button>
          <button onClick={() => { setShowSuccess(false); setActiveTab('my-tickets'); }} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-600/20 transition-all">Track Status</button>
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
              <HelpCircle className="text-sky-400" size={40} />
              Campus Helpdesk
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-medium">Report problems and get assistance from the campus team.</p>
          </div>
          
          <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
            <button 
              onClick={() => setActiveTab('new-ticket')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'new-ticket' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:text-white'}`}
            >
              New Ticket
            </button>
            <button 
              onClick={() => setActiveTab('my-tickets')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-tickets' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:text-white'}`}
            >
              My Tickets
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
          <MessageSquare size={240} />
        </div>
      </div>

      {activeTab === 'new-ticket' ? (
        <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Send className="text-sky-500" /> Submit a Problem
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    required 
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the issue" 
                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 appearance-none bg-white transition-all"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Academic">Academic</option>
                      <option value="Facilities">Facilities</option>
                      <option value="Printing">Printing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Priority</label>
                    <select 
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 appearance-none bg-white transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    name="description"
                    required 
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the problem in detail..." 
                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all h-40 resize-none" 
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[2rem] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                {!isSubmitting && <ChevronRight size={20} />}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-sky-50 border border-sky-100 p-8 rounded-[2.5rem]">
              <h3 className="font-bold text-sky-900 mb-4 flex items-center gap-2 text-lg">
                <AlertCircle size={20} className="text-sky-600" />
                Quick Info
              </h3>
              <p className="text-sm text-sky-700 font-medium leading-relaxed">
                Tickets are reviewed within 24 hours. For emergencies, please use the red alert button at the top of the page.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem]">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                <Clock size={20} className="text-slate-500" />
                Support Hours
              </h3>
              <div className="space-y-2 text-sm font-medium text-slate-600">
                <p className="flex justify-between"><span>Mon - Sat</span> <span className="text-slate-900 font-bold">10:00 - 17:00</span></p>
                <p className="flex justify-between text-rose-500"><span>Sunday</span> <span className="font-bold">Closed</span></p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {isLoadingTickets ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-48 rounded-[2rem] animate-pulse border border-slate-100 shadow-sm" />
              ))}
            </div>
          ) : tickets.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map(ticket => (
                <div key={ticket.ticket_id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusStyle(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </div>
                      <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border ${getPriorityStyle(ticket.priority)}`}>
                        {ticket.priority}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-sky-600 transition-colors">
                      {ticket.subject}
                    </h3>
                    
                    <p className="text-sm text-slate-500 line-clamp-2">{ticket.description}</p>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                      <Tag size={12} /> {ticket.category}
                    </div>

                    {ticket.response && (
                      <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Team Response</p>
                        <p className="text-xs text-slate-700 font-medium italic">"{ticket.response}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white py-20 text-center rounded-[3rem] border border-slate-200 shadow-sm">
              <MessageSquare className="mx-auto h-20 w-20 text-slate-100 mb-6" />
              <h2 className="text-2xl font-bold text-slate-900">No Tickets Yet</h2>
              <p className="text-slate-500 mt-2 mb-8">Everything seems to be working fine!</p>
              <button 
                onClick={() => setActiveTab('new-ticket')}
                className="bg-sky-600 hover:bg-sky-500 text-white font-black px-10 py-4 rounded-2xl shadow-lg shadow-sky-600/20 transition-all"
              >
                Submit a Problem
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Helpdesk;
