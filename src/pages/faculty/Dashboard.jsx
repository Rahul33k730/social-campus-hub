import React from 'react';
import { PenTool, Upload, Users, BarChart2, Bell } from 'lucide-react';

const FacultyDashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty Dashboard</h1>
          <p className="text-slate-500">Welcome, Prof. Sharma</p>
        </div>
        <div className="text-sm bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          Department: <span className="font-semibold">Computer Engineering</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <FacultyActionCard 
          icon={<Bell className="h-6 w-6 text-white" />}
          color="bg-orange-500"
          title="Post Notification"
          desc="Send updates to students"
        />
        <FacultyActionCard 
          icon={<Upload className="h-6 w-6 text-white" />}
          color="bg-sky-600"
          title="Upload Assignment"
          desc="Distribute course materials"
        />
        <FacultyActionCard 
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-emerald-600"
          title="Mark Attendance"
          desc="Daily class tracking"
        />
        <FacultyActionCard 
          icon={<BarChart2 className="h-6 w-6 text-white" />}
          color="bg-indigo-600"
          title="View Performance"
          desc="Analyze student grades"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Recent Submissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Assignment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                <SubmissionRow name="Rahul Das" assignment="Data Struct Lab 1" status="Pending Review" date="Today, 10:00 AM" />
                <SubmissionRow name="Anjali Singh" assignment="Data Struct Lab 1" status="Graded" date="Yesterday" />
                <SubmissionRow name="Vikram Malhotra" assignment="Data Struct Lab 1" status="Late" date="Yesterday" />
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-md text-sm font-medium text-slate-700 transition-colors border border-slate-100">
              Generate Attendance Report
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-md text-sm font-medium text-slate-700 transition-colors border border-slate-100">
              Schedule Extra Class
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-md text-sm font-medium text-slate-700 transition-colors border border-slate-100">
              Email HOD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FacultyActionCard = ({ icon, color, title, desc }) => (
  <button className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all text-left group">
    <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </button>
);

const SubmissionRow = ({ name, assignment, status, date }) => (
  <tr className="border-b border-slate-100 hover:bg-slate-50">
    <td className="px-4 py-3 font-medium text-slate-900">{name}</td>
    <td className="px-4 py-3">{assignment}</td>
    <td className="px-4 py-3">
      <span className={`px-2 py-1 rounded text-xs font-bold ${
        status === 'Graded' ? 'bg-green-100 text-green-700' : 
        status === 'Late' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-4 py-3">{date}</td>
    <td className="px-4 py-3">
      <button className="text-sky-600 hover:text-sky-800 font-medium text-xs">View</button>
    </td>
  </tr>
);

export default FacultyDashboard;
