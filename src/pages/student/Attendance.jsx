import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const StudentAttendance = () => {
  const subjects = [
    { name: "Data Structures", code: "CS301", attended: 24, total: 35, percent: 68, status: "Critical" },
    { name: "Database Management", code: "CS302", attended: 28, total: 35, percent: 80, status: "Good" },
    { name: "Web Technology", code: "CS303", attended: 32, total: 35, percent: 91, status: "Excellent" },
    { name: "Software Engineering", code: "CS304", attended: 25, total: 35, percent: 71, status: "Warning" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Serious Academic Warning</h2>
          <p className="text-red-700 mb-4">
            Your overall attendance is below the mandatory 75% threshold in 2 subjects. 
            Failure to improve may result in debarment from mid-term examinations.
          </p>
          <div className="bg-white/50 p-4 rounded-md border border-red-100">
            <h4 className="font-bold text-red-800 text-sm mb-2">Corrective Actions Required:</h4>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              <li>Meet Prof. Sharma (Class Coordinator) by Friday.</li>
              <li>Submit medical certificates if applicable.</li>
              <li>Attend all remedial classes scheduled for next week.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Subject-wise Attendance</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {subjects.map((sub) => (
            <div key={sub.code} className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-bold text-slate-900">{sub.name}</h4>
                  <p className="text-xs text-slate-500">{sub.code}</p>
                </div>
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                  sub.percent < 75 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {sub.percent}%
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
                <div 
                  className={`h-2.5 rounded-full ${sub.percent < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${sub.percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Attended: {sub.attended}/{sub.total} Lectures</span>
                <span>Status: {sub.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
