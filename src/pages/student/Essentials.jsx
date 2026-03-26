import React, { useState } from 'react';
import { ShoppingBag, Phone, MapPin, Clock, Search, ExternalLink, HeartPulse, Utensils, Truck, Car } from 'lucide-react';

const Essentials = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      id: 1,
      name: "PCU Campus Medics",
      category: "medical",
      description: "Emergency medicines and basic healthcare supplies. Specialized delivery for all campus hostels.",
      phone: "+91 98765 43210",
      location: "Main Gate, Sector 1",
      timing: "24/7",
      deliveryTime: "15-20 mins",
      isOpen: true
    },
    {
      id: 2,
      name: "City Pharma",
      category: "medical",
      description: "Wide range of prescription medicines and personal care products.",
      phone: "+91 87654 32109",
      location: "2km from Campus",
      timing: "9:00 AM - 11:00 PM",
      deliveryTime: "30-40 mins",
      isOpen: true
    },
    {
      id: 3,
      name: "Campus Delight Hotel",
      category: "hotel",
      description: "Healthy home-style meals, snacks, and dinner. Secure delivery to campus blocks.",
      phone: "+91 76543 21098",
      location: "Opposite West Gate",
      timing: "10:00 AM - 10:30 PM",
      deliveryTime: "25-30 mins",
      isOpen: true
    },
    {
      id: 4,
      name: "Green Valley Resto",
      category: "hotel",
      description: "Multi-cuisine restaurant with special student meal combos.",
      phone: "+91 65432 10987",
      location: "Main Road Market",
      timing: "11:00 AM - 11:00 PM",
      deliveryTime: "40-50 mins",
      isOpen: true
    },
    {
      id: 5,
      name: "Campus Auto Stand",
      category: "transport",
      description: "24/7 auto-rickshaw service available right outside the main gate.",
      phone: "N/A",
      location: "Main Gate",
      timing: "24/7",
      deliveryTime: "Immediate",
      isOpen: true
    },
    {
      id: 6,
      name: "City Cab Service",
      category: "transport",
      description: "Book cabs for city travel, airport drops, and station pickups.",
      phone: "+91 99887 76655",
      location: "Service across city",
      timing: "24/7",
      deliveryTime: "10-15 mins wait",
      isOpen: true
    }
  ];

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
                <button className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-2 text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No services found matching your search.</p>
          </div>
        )}
      </div>

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
