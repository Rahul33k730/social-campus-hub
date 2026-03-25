import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

const RoleSelection = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-6 sm:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 mb-2">
          Access Your Campus Portal
        </h2>
        <p className="text-center text-slate-600 mb-12">Select your role to continue to the secure login.</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <RoleCard 
            to="/login?role=student"
            icon={<GraduationCap className="h-10 w-10 text-sky-600" />}
            title="Student Portal"
            description="Attendance, Updates, Clubs, AI Assistant"
          />
          <RoleCard 
            to="/login?role=faculty"
            icon={<BookOpen className="h-10 w-10 text-emerald-600" />}
            title="Faculty Portal"
            description="Assignments, Notices, Attendance"
          />
          <RoleCard 
            to="/login?role=shopkeeper"
            icon={<ShieldCheck className="h-10 w-10 text-amber-600" />}
            title="Shopkeeper Portal"
            description="Manage Printing Queue & Orders"
          />
          <RoleCard 
            to="/login?role=admin"
            icon={<ShieldCheck className="h-10 w-10 text-indigo-600" />}
            title="Admin Portal"
            description="Emergency Alerts, Analytics, System Control"
          />
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/" className="text-slate-500 hover:text-slate-900 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ to, icon, title, description }) => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
    <div className="p-8 flex-grow flex flex-col items-center text-center">
      <div className="bg-slate-50 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{description}</p>
    </div>
    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
      <Link 
        to={to}
        className="block w-full text-center bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 hover:text-white hover:border-transparent transition-all"
      >
        Login
      </Link>
    </div>
  </div>
);

export default RoleSelection;
