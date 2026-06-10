import React, { useState } from 'react';
import { Search, Star, Plus, X, User, MessageSquare, Briefcase, Code, Music, Palette, Video, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentTalentExchange = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [talents, setTalents] = useState([]);

  const [newTalent, setNewTalent] = useState({
    title: '',
    category: 'tech',
    desc: '',
    phone: '',
  });

  const categories = [
    { id: 'tech', name: 'Tech & Code', icon: <Code size={16} /> },
    { id: 'hackathon', name: 'Hackathon Team', icon: <Users size={16} /> },
    { id: 'music', name: 'Music & Arts', icon: <Music size={16} /> },
    { id: 'design', name: 'Design', icon: <Palette size={16} /> },
    { id: 'video', name: 'Video & Media', icon: <Video size={16} /> },
    { id: 'other', name: 'Other', icon: <Briefcase size={16} /> }
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const talentToAdd = {
      ...newTalent,
      id: Date.now(),
      name: user?.name || 'Anonymous Student',
      date: new Date().toLocaleDateString()
    };
    setTalents([talentToAdd, ...talents]);
    setIsModalOpen(false);
    setNewTalent({ title: '', category: 'tech', desc: '', phone: '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Talent Hub</h1>
          <p className="text-slate-500 mt-1">Showcase your skills or find a Hackathon partner</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20 active:scale-95"
        >
          <Plus size={20} /> Post Your Talent
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Post Your Talent</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePostSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Talent Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. React Developer, Guitarist"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  value={newTalent.title}
                  onChange={(e) => setNewTalent({...newTalent, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none"
                  value={newTalent.category}
                  onChange={(e) => setNewTalent({...newTalent, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. +91 9876543210"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  value={newTalent.phone}
                  onChange={(e) => setNewTalent({...newTalent, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description / Bio</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Tell us about your skills and what you're looking for..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                  value={newTalent.desc}
                  onChange={(e) => setNewTalent({...newTalent, desc: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-sky-600/20 active:scale-95"
              >
                Post Talent
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {talents.map(talent => (
          <div key={talent.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                  {categories.find(c => c.id === talent.category)?.icon || <Star size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{talent.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{talent.name} • {talent.date}</p>
                </div>
              </div>
              <div className="bg-sky-50 text-sky-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {categories.find(c => c.id === talent.category)?.name}
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {talent.desc}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <a 
                href={`tel:${talent.phone}`}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-bold text-sm transition-colors"
              >
                <MessageSquare size={16} /> Contact Me
              </a>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-700">New Talent</span>
              </div>
            </div>
          </div>
        ))}
        {talents.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Star size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-600">No talents posted yet</h3>
            <p className="text-slate-400 text-sm">Be the first to showcase your talent on campus!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTalentExchange;
