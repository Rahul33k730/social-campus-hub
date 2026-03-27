import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { AlertTriangle, Users, Activity, Database, ShieldAlert, XCircle, Search, Eye, ArrowLeft, Megaphone, FileText, Briefcase, GraduationCap, CheckCircle, Plus, Printer } from 'lucide-react';

const AdminDashboard = () => {
  const { isEmergency, triggerEmergency, clearEmergency } = useEmergency();
  const [activeAdminTab, setActiveAdminTab] = useState('students');
  const [alertText, setAlertText] = useState("Severe Weather Warning. Campus Closed.");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState(0);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [printOrders, setPrintOrders] = useState([]);
  const [essentialServices, setEssentialServices] = useState([]);
  const [serviceFeedbacks, setServiceFeedbacks] = useState([]);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    name: '', category: 'medical', description: '', phone: '', location: '', timing: '', deliveryTime: ''
  });
  const [ads, setAds] = useState([]);
  const [adFormData, setAdFormData] = useState({
    title: '',
    type: 'image',
    content_url: ''
  });
  const [isAddingAd, setIsAddingAd] = useState(false);

  // Admin states for new features
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Grand Tech Symposium 2024", message: "Registration starts today!" },
  ]);
  const [pendingNotes, setPendingNotes] = useState([
    { id: 101, title: "Microprocessors Unit 4", branch: "ECE", author: "Amit K.", date: "Today" }
  ]);

  useEffect(() => {
    fetchStudents();
    fetchVisitorCount();
    fetchPendingEvents();
    fetchAds();
    fetchPrintOrders();
    fetchEssentialServices();
    fetchServiceFeedbacks();
  }, []);

  const fetchEssentialServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/essentials`);
      const data = await response.json();
      setEssentialServices(data);
    } catch (err) {
      console.error('Failed to fetch essential services');
    }
  };

  const fetchServiceFeedbacks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/essentials/feedback`);
      const data = await response.json();
      setServiceFeedbacks(data);
    } catch (err) {
      console.error('Failed to fetch service feedbacks');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setIsAddingService(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/essentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceFormData)
      });
      if (response.ok) {
        alert('Service added successfully!');
        setServiceFormData({ name: '', category: 'medical', description: '', phone: '', location: '', timing: '', deliveryTime: '' });
        fetchEssentialServices();
      }
    } catch (err) {
      console.error('Failed to add service');
    } finally {
      setIsAddingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/essentials/${id}`, { method: 'DELETE' });
      fetchEssentialServices();
    } catch (err) {
      console.error('Failed to delete service');
    }
  };

  const fetchPrintOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/printing`);
      const data = await response.json();
      setPrintOrders(data);
    } catch (err) {
      console.error('Failed to fetch printing orders');
    }
  };

  const handleUpdatePrintStatus = async (id, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/printing/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setPrintOrders(prev => prev.map(o => o.order_id === id ? { ...o, status } : o));
      }
    } catch (err) {
      console.error('Failed to update printing status');
    }
  };

  const fetchAds = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ads`);
      const data = await response.json();
      setAds(data);
    } catch (err) {
      console.error('Failed to fetch ads');
    }
  };

  const handleAddAd = async (e) => {
    e.preventDefault();
    setIsAddingAd(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adFormData)
      });
      const data = await response.json();
      if (data.success) {
        alert('Ad added successfully!');
        setAdFormData({ title: '', type: 'image', content_url: '' });
        fetchAds();
      }
    } catch (err) {
      console.error('Failed to add ad');
    } finally {
      setIsAddingAd(false);
    }
  };

  const handleToggleAd = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ads/${id}/toggle`, { method: 'PUT' });
      fetchAds();
    } catch (err) {
      console.error('Failed to toggle ad');
    }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ads/${id}`, { method: 'DELETE' });
      fetchAds();
    } catch (err) {
      console.error('Failed to delete ad');
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events/pending`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPendingEvents(data);
      } else {
        setPendingEvents([]);
      }
    } catch (err) {
      console.error('Failed to fetch pending events');
      setPendingEvents([]);
    }
  };

  const handleVerifyEvent = async (id, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setPendingEvents(prev => prev.filter(e => e.event_id !== id));
        alert(`Event ${status === 'verified' ? 'Verified' : 'Rejected'}!`);
      } else {
        alert('Failed to update event status: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to verify event');
      alert('Network error while verifying event');
    }
  };

  const fetchVisitorCount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/visitor/count`);
      const data = await response.json();
      if (data.success) {
        setVisitorCount(data.count);
      }
    } catch (err) {
      console.error('Failed to fetch visitor count');
    }
  };

  useEffect(() => {
    if (activeAdminTab === 'events') {
      fetchPendingEvents();
    } else if (activeAdminTab === 'printing') {
      fetchPrintOrders();
    }
  }, [activeAdminTab]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/students`);
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  const viewStudentDetails = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/students/${id}`);
      const data = await response.json();
      setSelectedStudent(data);
    } catch (err) {
      console.error('Failed to fetch student details');
    }
  };

  const handleTrigger = () => {
    triggerEmergency(alertText);
  };

  const approveNote = (id) => {
    setPendingNotes(pendingNotes.filter(n => n.id !== id));
    alert("Note verified and published!");
  };

  if (selectedStudent) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={() => setSelectedStudent(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-sky-600 font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Student List
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white flex justify-between items-end">
            <div>
              <div className="bg-sky-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2 w-fit">Student Profile</div>
              <h2 className="text-3xl font-bold">{selectedStudent.full_name}</h2>
              <p className="text-slate-400">{selectedStudent.email || `@${selectedStudent.username}`}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Status</p>
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                {selectedStudent.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-600" /> Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Student ERP code" value={selectedStudent.Student?.student_code || 'N/A'} />
                <DetailItem label="Branch" value={selectedStudent.branch} />
                <DetailItem label="Current Year" value={`${selectedStudent.Student?.year} Year`} />
                <DetailItem label="Attendance" value={`${selectedStudent.Student?.attendance_percent}%`} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-sky-600" /> System Records
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="User ID" value={`#${selectedStudent.user_id}`} />
                <DetailItem label="Role" value={selectedStudent.role.toUpperCase()} />
                <DetailItem label="Email" value={selectedStudent.email || 'Not Provided'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
        <div className="flex gap-2">
          <div className="bg-slate-900 text-white px-3 py-1 rounded text-xs font-mono">
            System Status: Online
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Users className="h-6 w-6 text-sky-600" />} title="Total Students" value={students.length} subtext="Enrolled students" />
        <StatCard icon={<Eye className="h-6 w-6 text-emerald-600" />} title="Website Visitors" value={visitorCount} subtext="Total site visits" />
        <StatCard icon={<Activity className="h-6 w-6 text-amber-600" />} title="System Status" value="Online" subtext="All systems active" />
        <StatCard icon={<ShieldAlert className="h-6 w-6 text-rose-600" />} title="Security Mode" value={isEmergency ? 'EMERGENCY' : 'NORMAL'} subtext="Campus alert status" />
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveAdminTab('students')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeAdminTab === 'students' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Student Database
        </button>
        <button 
          onClick={() => setActiveAdminTab('content')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeAdminTab === 'content' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Content & Verification
        </button>
        <button 
          onClick={() => setActiveAdminTab('emergency')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeAdminTab === 'emergency' ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Emergency System
        </button>
        <button 
          onClick={() => setActiveAdminTab('events')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeAdminTab === 'events' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Event Verification
        </button>
        <button 
          onClick={() => setActiveAdminTab('ads')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeAdminTab === 'ads' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Ad Management
        </button>
        <button 
          onClick={() => setActiveAdminTab('printing')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeAdminTab === 'printing' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Printing Orders
        </button>
        <button 
          onClick={() => setActiveAdminTab('essentials')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeAdminTab === 'essentials' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Essential Services
        </button>
      </div>

      {activeAdminTab === 'students' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-600" /> Registered Students
            </h2>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by name or ERP code..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-full focus:ring-sky-500 focus:border-sky-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3 border-b border-slate-200">Name / Email</th>
                  <th className="px-6 py-3 border-b border-slate-200">Student ERP code</th>
                  <th className="px-6 py-3 border-b border-slate-200">Branch</th>
                  <th className="px-6 py-3 border-b border-slate-200">Year</th>
                  <th className="px-6 py-3 border-b border-slate-200">Attendance</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Loading student database...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">No students found in system.</td></tr>
                ) : students.map((stu) => (
                  <tr key={stu.user_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{stu.full_name}</div>
                      <div className="text-xs text-slate-500">{stu.email || `@${stu.username}`}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{stu.Student?.student_code || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{stu.branch}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{stu.Student?.year} Year</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stu.Student?.attendance_percent || 0}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{stu.Student?.attendance_percent || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => viewStudentDetails(stu.user_id)}
                        className="text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 p-2 rounded-lg transition-colors inline-flex items-center gap-2 text-xs font-bold"
                      >
                        <Eye className="h-3.5 w-3.5" /> FULL DATA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'content' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Notes Verification */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-600" /> Verify Uploaded Notes
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {pendingNotes.map(note => (
                <div key={note.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{note.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{note.branch} • By {note.author}</p>
                  </div>
                  <button 
                    onClick={() => approveNote(note.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-all"
                  >
                    <CheckCircle size={16} />
                  </button>
                </div>
              ))}
              {pendingNotes.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">No pending notes to verify.</p>}
            </div>
          </div>

          {/* Post New Announcement/Ad */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-sky-600" /> New Campus Deal/Ad
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Ad Title" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Ad Message / Details" rows="3" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none"></textarea>
              <button className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
                <Plus size={16} /> Publish Announcement
              </button>
            </div>
          </div>



          {/* Result & Internship Management */}
          <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-sky-600" /> Upload Results Data
              </h2>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                <Database className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-500">Upload CSV/Excel with Student Scores</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-sky-600" /> Add Internship Opportunity
              </h2>
              <div className="space-y-3">
                <input type="text" placeholder="Company Name" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                <button className="w-full bg-sky-600 text-white font-bold py-2 rounded-lg text-sm">Add Opening</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'emergency' && (
        <div className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-2">
            <ShieldAlert className="text-red-600 h-5 w-5" />
            <h2 className="font-bold text-red-900">Emergency Broadcast System</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              Activating this will display a <span className="font-bold text-red-600">RED BANNER</span> across all student and faculty dashboards immediately.
            </p>
            
            {!isEmergency ? (
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Message</label>
                  <input 
                    type="text" 
                    value={alertText}
                    onChange={(e) => setAlertText(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <button 
                  onClick={handleTrigger}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-bold text-sm shadow-sm transition-colors flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" /> BROADCAST
                </button>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="animate-pulse bg-red-600 h-3 w-3 rounded-full"></div>
                  <span className="font-bold text-red-800">Active Alert: "{alertText}"</span>
                </div>
                <button 
                  onClick={clearEmergency}
                  className="bg-white border border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" /> DEACTIVATE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeAdminTab === 'events' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-600" /> Pending Event Verifications
            </h2>
            <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full font-bold">
              {pendingEvents.length} Pending
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3 border-b border-slate-200">Event Details</th>
                  <th className="px-6 py-3 border-b border-slate-200">Date & Location</th>
                  <th className="px-6 py-3 border-b border-slate-200">Posted By</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pendingEvents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                      No events waiting for verification.
                    </td>
                  </tr>
                ) : pendingEvents.map((event) => (
                  <tr key={event.event_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{event.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{event.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{new Date(event.event_date).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {event.author?.full_name || 'System Admin'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleVerifyEvent(event.event_id, 'verified')}
                        className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold"
                      >
                        VERIFY
                      </button>
                      <button 
                        onClick={() => handleVerifyEvent(event.event_id, 'rejected')}
                        className="text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold"
                      >
                        REJECT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'ads' && (
        <div className="space-y-8">
          {/* Add New Ad Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-sky-600" /> Add New Campus Ad
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddAd} className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ad Title</label>
                  <input 
                    type="text" 
                    required 
                    value={adFormData.title}
                    onChange={(e) => setAdFormData({ ...adFormData, title: e.target.value })}
                    placeholder="e.g. Workshop Poster" 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Content Type</label>
                  <select 
                    value={adFormData.type}
                    onChange={(e) => setAdFormData({ ...adFormData, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="image">Poster (Image URL)</option>
                    <option value="video">Video (URL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Source URL</label>
                  <input 
                    type="text" 
                    required 
                    value={adFormData.content_url}
                    onChange={(e) => setAdFormData({ ...adFormData, content_url: e.target.value })}
                    placeholder="https://..." 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" 
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isAddingAd}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all"
                  >
                    {isAddingAd ? 'Processing...' : 'Launch Ad Panel'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Active Ads List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-900">Current Ad Panels</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-3 border-b border-slate-200">Preview</th>
                    <th className="px-6 py-3 border-b border-slate-200">Title & Type</th>
                    <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ads.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-400">No ads configured yet.</td></tr>
                  ) : ads.map(ad => (
                    <tr key={ad.ad_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        {ad.type === 'image' ? (
                          <img src={ad.content_url} alt={ad.title} className="h-12 w-20 object-cover rounded border" />
                        ) : (
                          <div className="h-12 w-20 bg-slate-900 rounded flex items-center justify-center text-white text-[10px] font-bold">VIDEO</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{ad.title}</div>
                        <div className="text-xs text-slate-500 uppercase">{ad.type}</div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleToggleAd(ad.ad_id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${ad.is_active ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                        >
                          {ad.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                        </button>
                        <button 
                          onClick={() => handleDeleteAd(ad.ad_id)}
                          className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'printing' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Printer className="h-5 w-5 text-sky-600" /> Printing Orders (Shopkeeper View)
            </h2>
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">
              {printOrders.filter(o => o.status !== 'done').length} Active Orders
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3 border-b border-slate-200">Student</th>
                  <th className="px-6 py-3 border-b border-slate-200">Document</th>
                  <th className="px-6 py-3 border-b border-slate-200">Details</th>
                  <th className="px-6 py-3 border-b border-slate-200">Status</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {printOrders.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">No printing orders yet.</td></tr>
                ) : printOrders.map(order => (
                  <tr key={order.order_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{order.user?.full_name}</div>
                      <div className="text-xs text-slate-500">@{order.user?.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={order.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-sky-600 hover:underline flex items-center gap-1"
                      >
                        <FileText size={14} /> View File
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-700">{order.color_type}</div>
                      <div className="text-[10px] text-slate-500">{order.copies} Copies • {order.pages} Pages</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                        order.status === 'printing' ? 'bg-sky-50 text-sky-600 border-sky-200' : 
                        'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdatePrintStatus(order.order_id, 'printing')}
                          className="bg-sky-50 text-sky-600 hover:bg-sky-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          START PRINTING
                        </button>
                      )}
                      {order.status === 'printing' && (
                        <button 
                          onClick={() => handleUpdatePrintStatus(order.order_id, 'completed')}
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          MARK DONE
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <span className="text-xs text-slate-400 font-bold italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeAdminTab === 'essentials' && (
        <div className="space-y-8 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Add Service Form */}
            <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-sky-600" /> Add New Service
                </h2>
              </div>
              <form onSubmit={handleAddService} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Name</label>
                  <input required type="text" value={serviceFormData.name} onChange={(e) => setServiceFormData({...serviceFormData, name: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Campus Pharma" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select value={serviceFormData.category} onChange={(e) => setServiceFormData({...serviceFormData, category: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                    <option value="medical">Medical</option>
                    <option value="hotel">Hotel</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                  <textarea required value={serviceFormData.description} onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20" placeholder="Describe the service..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                    <input type="text" value={serviceFormData.phone} onChange={(e) => setServiceFormData({...serviceFormData, phone: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Contact number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                    <input required type="text" value={serviceFormData.location} onChange={(e) => setServiceFormData({...serviceFormData, location: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Main Gate" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timing</label>
                    <input type="text" value={serviceFormData.timing} onChange={(e) => setServiceFormData({...serviceFormData, timing: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 24/7" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Delivery Time</label>
                    <input type="text" value={serviceFormData.deliveryTime} onChange={(e) => setServiceFormData({...serviceFormData, deliveryTime: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 20 mins" />
                  </div>
                </div>
                <button type="submit" disabled={isAddingService} className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm">
                  {isAddingService ? 'Adding...' : 'Save Service Contract'}
                </button>
              </form>
            </div>

            {/* Service List & Feedbacks */}
            <div className="md:col-span-2 space-y-8">
              {/* Existing Services */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="font-bold text-slate-900">Active Service Contracts</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-3 border-b border-slate-200">Service</th>
                        <th className="px-6 py-3 border-b border-slate-200">Category</th>
                        <th className="px-6 py-3 border-b border-slate-200">Location</th>
                        <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {essentialServices.map(service => (
                        <tr key={service.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{service.name}</div>
                            <div className="text-xs text-slate-500">{service.phone}</div>
                          </td>
                          <td className="px-6 py-4 uppercase text-[10px] font-bold">
                            <span className={`px-2 py-1 rounded-full ${
                              service.category === 'medical' ? 'bg-sky-100 text-sky-700' : 
                              service.category === 'hotel' ? 'bg-emerald-100 text-emerald-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>{service.category}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{service.location}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDeleteService(service.id)} className="text-rose-600 hover:text-rose-700 p-2 rounded-lg bg-rose-50">
                              <XCircle size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {essentialServices.length === 0 && (
                        <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400">No services configured.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Service Feedback Feed */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> Student Feedbacks
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {serviceFeedbacks.map(feedback => (
                    <div key={feedback.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{feedback.user_name}</span>
                          <span className="mx-2 text-slate-300">•</span>
                          <span className="text-xs text-sky-600 font-bold uppercase">{feedback.service_name}</span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(feedback.rating)].map((_, i) => (
                            <Star key={i} size={12} className="text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 italic">"{feedback.comment}"</p>
                      <div className="text-[10px] text-slate-400 mt-2 font-bold">{new Date(feedback.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                  {serviceFeedbacks.length === 0 && (
                    <p className="text-center py-10 text-slate-400 text-sm">No feedbacks received yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
    <div className="p-3 bg-slate-50 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-lg font-bold text-slate-900">{value}</div>
  </div>
);

export default AdminDashboard;
