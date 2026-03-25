import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Book, Calendar, ChevronRight, Clock, Search, Users, User, Megaphone, FileText, Briefcase, GraduationCap, Upload, CheckCircle, XCircle, Video, Printer, Plus, HelpCircle } from 'lucide-react';

const StudentDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'events');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [activeAds, setActiveAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: ''
  });
  const [isPostingEvent, setIsPostingEvent] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchActiveAds();
  }, []);

  const fetchActiveAds = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ads/active`);
      const data = await response.json();
      setActiveAds(data);
    } catch (err) {
      console.error('Failed to fetch ads');
    }
  };

  useEffect(() => {
    if (activeAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeAds]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events`);
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events');
    }
  };

  const handleEventInputChange = (e) => {
    setEventFormData({ ...eventFormData, [e.target.name]: e.target.value });
  };

  const handlePostEvent = async (e) => {
    e.preventDefault();
    setIsPostingEvent(true);
    try {
      // Get user_id from local storage (assuming it's stored there after login)
      const token = localStorage.getItem('token');
      // We need user_id, let's decode token or get it from somewhere else.
      // For now, let's assume we have a way to get the logged-in user's ID.
      // In a real app, we'd use the auth header.
      
      const user = JSON.parse(localStorage.getItem('user')); // Assuming user object is stored

      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...eventFormData,
          user_id: user?.id || 1 // Fallback for demo
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Event posted successfully! Waiting for admin verification.');
        setEventFormData({ title: '', description: '', event_date: '', location: '' });
        setShowUploadModal(false);
        fetchEvents(); // Refresh the local list if needed
      }
    } catch (err) {
      console.error('Failed to post event');
    } finally {
      setIsPostingEvent(false);
    }
  };
  
  // Mock data for Admin Ads/Announcements
  const ads = [];

  // Mock data for Previous Year Notes
  const notes = [];

  // Mock data for Internships
  const internships = [];

  // Mock data for External/Campus Ads
  const externalAds = [];

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
           <p className="text-slate-500 mt-1">Welcome back, {user?.name || 'Rahul'} • Semester 5</p>
        </div>
      </div>

      {/* Admin Ads/Announcement Panel */}
      {ads.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {ads.map(ad => (
            <div key={ad.id} className={`${ad.bg} rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-200`}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone size={18} className="opacity-80" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Announcement</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{ad.message}</p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Megaphone size={160} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campus Ads Panel (New) */}
      {externalAds.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {externalAds.map(ead => (
            <div key={ead.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm group hover:shadow-lg transition-all">
              <div className="h-40 overflow-hidden relative">
                <img src={ead.img} alt={ead.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-slate-900 uppercase tracking-widest border border-slate-200">Sponsored</div>
              </div>
              <div className="p-5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">{ead.title}</h4>
                  <p className="text-xs text-sky-600 font-medium">{ead.promo}</p>
                </div>
                <button className="bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-slate-800 transition-colors">View Offer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ad Panel Section */}
      <div className="relative w-full aspect-[21/9] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl group border border-slate-800">
        {activeAds.length > 0 ? (
          <div className="w-full h-full relative">
            {activeAds[currentAdIndex].type === 'image' ? (
              <img 
                src={activeAds[currentAdIndex].content_url} 
                alt={activeAds[currentAdIndex].title}
                className="w-full h-full object-cover animate-in fade-in duration-700"
              />
            ) : (
              <video 
                key={activeAds[currentAdIndex].content_url}
                autoPlay 
                muted 
                loop 
                className="w-full h-full object-cover"
              >
                <source src={activeAds[currentAdIndex].content_url} type="video/mp4" />
              </video>
            )}
            
            {/* Ad Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <h2 className="text-2xl font-bold text-white mb-1">{activeAds[currentAdIndex].title}</h2>
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Campus Spotlight
              </div>
            </div>

            {/* Carousel Indicators */}
            {activeAds.length > 1 && (
              <div className="absolute bottom-8 right-8 flex gap-2">
                {activeAds.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentAdIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === currentAdIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full relative flex flex-col items-center justify-center text-center p-12 overflow-hidden">
            <img 
              src="https://res.cloudinary.com/djv4v6vwy/image/upload/v1711394154/pcu_logo_bg_removed_q1z3q3.png" 
              alt="PCU Logo" 
              className="absolute inset-0 w-full h-full object-contain opacity-10 scale-150 rotate-12 pointer-events-none"
            />
            <div className="relative z-10">
              <div className="h-20 w-20 bg-sky-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-sky-500/20 shadow-xl shadow-sky-500/10">
                <Megaphone size={36} className="text-sky-400 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-3">PCU Campus Spotlight</h2>
              <p className="text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
                Stay tuned for the latest campus announcements, event posters, and student highlights.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Section (Events, Printing, etc moved below or integrated) */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex-1 min-w-[140px] py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'events' ? 'text-sky-600 bg-white shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
          >
            <Calendar size={18} /> PCU Events
          </button>
          <button 
            onClick={() => setActiveTab('internships')}
            className={`flex-1 min-w-[140px] py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'internships' ? 'text-sky-600 bg-white shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
          >
            <Briefcase size={18} /> Internships
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex-1 min-w-[140px] py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'results' ? 'text-sky-600 bg-white shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
          >
            <GraduationCap size={18} /> Check Results
          </button>
        </div>

        <div className="p-8 min-h-[400px]">
          {activeTab === 'events' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">PCU Campus Events</h2>
                  <p className="text-slate-500">Upcoming events and activities around the campus.</p>
                </div>
                <button 
                   onClick={() => setShowUploadModal(true)}
                   className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20 flex items-center gap-2"
                >
                  <Plus size={18} /> Post New Event
                </button>
              </div>

              {/* Event Posting Modal/Form */}
              {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Post a Campus Event</h3>
                      <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                        <XCircle size={24} />
                      </button>
                    </div>
                    <form onSubmit={handlePostEvent} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Event Title</label>
                        <input name="title" type="text" required value={eventFormData.title} onChange={handleEventInputChange} placeholder="e.g. Annual Tech Fest 2024" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                        <textarea name="description" required value={eventFormData.description} onChange={handleEventInputChange} placeholder="Tell us about the event..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all h-24 resize-none"></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date</label>
                          <input name="event_date" type="date" required value={eventFormData.event_date} onChange={handleEventInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Location</label>
                          <input name="location" type="text" value={eventFormData.location} onChange={handleEventInputChange} placeholder="e.g. Auditorium" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all" />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isPostingEvent}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                      >
                        {isPostingEvent ? 'Processing...' : 'Submit for Verification'}
                        {!isPostingEvent && <ChevronRight size={18} />}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {events.length > 0 ? events.map(event => (
                  <div key={event.event_id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-sky-200 hover:bg-white transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-sky-50 transition-colors">
                        <Calendar size={24} className="text-sky-600" />
                      </div>
                      <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 border border-slate-200">
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">{event.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <User size={14} /> Posted by {event.author?.full_name} • {event.location}
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 text-center py-20 text-slate-400 border border-dashed border-slate-200 rounded-3xl">
                    No verified events at the moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'internships' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Opportunities for You</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {internships.length > 0 ? internships.map(intern => (
                  <div key={intern.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                        <Briefcase className="text-slate-400" />
                      </div>
                      <span className="text-[10px] font-bold bg-sky-100 text-sky-600 px-2 py-1 rounded-full uppercase">Full Time</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">{intern.role}</h4>
                    <p className="text-sm text-slate-600 font-medium mb-4">{intern.company}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                      <span className="flex items-center gap-1"><Clock size={12}/> {intern.duration}</span>
                      <span className="flex items-center gap-1 font-bold text-emerald-600"> {intern.stipend}</span>
                    </div>
                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                      Apply Now
                    </button>
                  </div>
                )) : (
                  <div className="col-span-2 text-center py-20 text-slate-400 border border-dashed border-slate-200 rounded-3xl">
                    No active internship opportunities at the moment. Check back soon!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="animate-in fade-in duration-300 text-center py-12">
              <div className="h-20 w-20 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Semester Results</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">Enter your student credentials below to view your academic performance for the current semester.</p>
              <div className="max-w-sm mx-auto space-y-4">
                <input type="text" placeholder="Roll Number" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-50" />
                <button 
                  onClick={() => setShowResultModal(true)}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-600/20"
                >
                  Fetch Result
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Original Quick Stats & Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Campus Quick Links</h3>
            <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full font-bold">New Features</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Link to="/student/notes" className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 transition-all group">
              <FileText className="h-5 w-5 text-sky-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-700">Previous Paper</span>
            </Link>
            <button onClick={() => window.location.href='/student/print'} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 transition-all group">
              <Printer className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-700">PCU Printing</span>
            </button>
            <button onClick={() => setActiveTab('internships')} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-100 transition-all group">
              <Briefcase className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-700">Internships</span>
            </button>
            <button onClick={() => setActiveTab('results')} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-100 transition-all group">
              <GraduationCap className="h-5 w-5 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-700">Check Result</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl shadow-sm text-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white mb-2 tracking-tight flex items-center gap-2">
              <HelpCircle size={18} className="text-sky-400" />
              PCU Helpdesk
            </h3>
            <p className="text-slate-400 text-xs mb-6 font-medium leading-relaxed">Have a problem or need assistance? Report your issue directly to the campus team.</p>
            <Link 
              to="/student/helpdesk"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
            >
              Submit Ticket
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Upload Study Notes</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-slate-500 italic">Your notes will be visible to everyone once <span className="font-bold text-sky-600">verified by the Admin</span>.</p>
              <div className="space-y-4">
                <input type="text" placeholder="Subject / Title" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none" />
                <input 
                  type="text" 
                  placeholder="Branch (e.g. CSE, ME, Civil)" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none" 
                />
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none">
                  <option>Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s}>Semester {s}</option>)}
                </select>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none">
                  <option>Select Content Type</option>
                  <option>Unit 1</option>
                  <option>Unit 2</option>
                  <option>Semester Paper</option>
                </select>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-sky-500 transition-colors cursor-pointer group">
                  <input 
                    type="file" 
                    accept=".pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.type !== 'application/pdf') {
                        alert("Only PDF files are allowed!");
                        e.target.value = null;
                      }
                    }}
                  />
                  <Upload className="mx-auto h-10 w-10 text-slate-300 mb-2 group-hover:text-sky-500 transition-colors" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-sky-600">Click to Upload PDF</p>
                  <p className="text-[10px] text-slate-400 mt-1">Maximum size: 10MB</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-600/20 transition-all active:scale-95"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-emerald-500 text-white">
              <h3 className="text-xl font-bold">Result: Passed</h3>
              <button onClick={() => setShowResultModal(false)} className="text-white/80 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-sm">SGPA</span>
                  <span className="font-bold text-slate-900 text-lg">8.75</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-sm">CGPA</span>
                  <span className="font-bold text-slate-900 text-lg">8.42</span>
                </div>
              </div>
              <button 
                onClick={() => setShowResultModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all"
              >
                Download Marksheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
