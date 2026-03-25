import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, FileText, Download, Filter, BookOpen, GraduationCap, Clock, User, CheckCircle, Plus, Upload, XCircle, Printer, ShoppingCart, Info, ExternalLink } from 'lucide-react';

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    branch: '',
    sem: '',
    type: '',
    author: ''
  });

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/notices`);
      const data = await response.json();
      setAllNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert('Please login to upload');

    setIsUploading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadData,
          posted_by: user.id
        })
      });
      if (response.ok) {
        setShowUploadModal(false);
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed to upload');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredNotes = allNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || note.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <BookOpen className="text-sky-400" size={32} />
            Previous Year Papers
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Access and Upload Semester Papers & Study Materials</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-sky-600/20 flex items-center gap-2"
          >
            <Upload size={20} /> Upload New Paper
          </button>
        </div>
      </div>

      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by subject or year..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-700 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['All', 'CSE', 'ME', 'ECE', 'Common'].map(branch => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedBranch === branch 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length > 0 ? filteredNotes.map(note => (
            <div key={note.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                    <FileText size={24} />
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                    <CheckCircle size={10} /> Verified
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-2 group-hover:text-sky-600 transition-colors">{note.title}</h3>
                <div className="space-y-2 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-slate-400" />
                    <span>Branch: {note.branch} • Sem {note.sem}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span>Type: {note.type} • {note.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span>Uploaded by {note.author}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                <button className="flex-1 bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 text-slate-700 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm">
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <FileText className="mx-auto h-16 w-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No Papers Found</h3>
              <p className="text-slate-500 mt-2">There are no papers matching your search criteria yet.</p>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-bold rounded-2xl hover:bg-sky-500 transition-all"
              >
                <Upload size={18} /> Upload the First Paper
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal (Resources) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Upload Previous Year Paper</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-slate-500 italic">Your paper will be visible to everyone once <span className="font-bold text-sky-600">verified by the Admin</span>.</p>
              <div className="space-y-4">
                <input type="text" placeholder="Subject Name (e.g. Mathematics)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none" />
                <input type="text" placeholder="Branch Name (e.g. CSE, ME, Civil)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none">
                    <option>Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s}>Semester {s}</option>)}
                  </select>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none">
                    <option>Content Type</option>
                    <option>Unit 1</option>
                    <option>Unit 2</option>
                    <option>Semester Paper</option>
                  </select>
                </div>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-sky-500 transition-colors cursor-pointer group">
                  <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <Upload className="mx-auto h-10 w-10 text-slate-300 mb-2 group-hover:text-sky-500 transition-colors" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-sky-600">Select PDF Only</p>
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
    </div>
  );
};

export default Notes;

