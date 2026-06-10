import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, MapPin, Clock, Search, ExternalLink, HeartPulse, Utensils, Truck, Car, Star, Send, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Essentials = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Feedback Form State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/essentials`);
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit feedback');
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/essentials/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || 1,
          user_name: user.name || 'Student',
          service_name: selectedService.name,
          rating: feedbackData.rating,
          comment: feedbackData.comment
        })
      });
      if (response.ok) {
        alert('Feedback submitted successfully! Thank you.');
        setShowFeedbackModal(false);
        setFeedbackData({ rating: 5, comment: '' });
      }
    } catch (err) {
      console.error('Failed to submit feedback');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Campus Essentials • Coming Soon
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Essential Services & Delivery</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Quick access to medical shops, local hotels, and transport providing secure delivery directly to your campus location. Dedicated service for all students living in boys and girls hostels.
            <br />
            <span className="text-sky-400 font-bold">This services will be available soon.</span>
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
          <Truck size={400} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeCategory === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            All Services
          </button>
          <button 
            onClick={() => setActiveCategory('medical')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeCategory === 'medical' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <HeartPulse size={16} /> Medical
          </button>
          <button 
            onClick={() => setActiveCategory('hotel')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeCategory === 'hotel' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Utensils size={16} /> Hotels
          </button>
          <button 
            onClick={() => setActiveCategory('transport')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeCategory === 'transport' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Car size={16} /> Transport
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search for service..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredServices.length > 0 ? filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${service.category === 'medical' ? 'bg-sky-50 text-sky-600' : service.category === 'hotel' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {service.category === 'medical' ? <HeartPulse size={28} /> : service.category === 'hotel' ? <Utensils size={28} /> : <Car size={28} />}
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${service.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {service.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-bold">{service.timing}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{service.description}</p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <MapPin size={16} />
                  </div>
                  {service.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Truck size={16} />
                  </div>
                  {service.category === 'transport' ? 'Availability' : 'Delivery in'} <span className="font-bold text-slate-900">{service.deliveryTime}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href={`tel:${service.phone}`}
                  className={`flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 ${service.phone === 'N/A' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => service.phone === 'N/A' && e.preventDefault()}
                >
                  <Phone size={18} /> Call Now
                </a>
                <button 
                  onClick={() => {
                    setSelectedService(service);
                    setShowFeedbackModal(true);
                  }}
                  className="px-4 py-3.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-xl transition-all flex items-center gap-2 font-bold text-sm"
                >
                  <Star size={18} /> Feedback
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-2 text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">{isLoading ? 'Loading services...' : 'No services found matching your search.'}</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Service Feedback</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Rate your experience with {selectedService?.name}</p>
              </div>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                      className={`p-2 rounded-lg transition-all ${feedbackData.rating >= star ? 'text-amber-400 bg-amber-50' : 'text-slate-300 bg-slate-50'}`}
                    >
                      <Star size={24} fill={feedbackData.rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Comments</label>
                <textarea 
                  required
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                  placeholder="How was the service? Any issues with delivery?"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all h-32 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-sky-50 border border-sky-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="h-16 w-16 bg-sky-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-600/20 shrink-0">
          <Truck size={32} />
        </div>
        <div>
          <h4 className="text-xl font-bold text-sky-900 mb-1">Campus Delivery & Transport</h4>
          <p className="text-sky-700/80 leading-relaxed">
            For girls living in campus hostels, all deliveries are verified at the gate. Please ensure you share your block and room number clearly with the delivery partner. Transport services are available at the main gate.
            <br />
            <span className="font-bold text-sky-600">This services will be available soon.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Essentials;
