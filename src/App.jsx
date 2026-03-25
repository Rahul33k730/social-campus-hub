import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EmergencyProvider } from './context/EmergencyContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Student Modules
import StudentBuySell from './pages/student/Updates';
import StudentAttendance from './pages/student/Attendance';
import StudentTalentExchange from './pages/student/Clubs';
import StudentLostFound from './pages/student/LostFound';
import StudentFun from './pages/student/Fun';
import StudentNotes from './pages/student/Notes';
import StudentPrinting from './pages/student/Printing';
import StudentHelpdesk from './pages/student/Helpdesk';

// Admin Modules
import AdminPrintOrders from './pages/admin/PrintOrders';
import AdminHelpdesk from './pages/admin/Helpdesk';

function App() {
  return (
    <AuthProvider>
      <EmergencyProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/roles" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes (Wrapped in Layout) */}
            <Route element={<Layout />}>
              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/updates" element={<StudentBuySell />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/clubs" element={<StudentTalentExchange />} />
              <Route path="/student/lost-found" element={<StudentLostFound />} />
              <Route path="/student/notes" element={<StudentNotes />} />
              <Route path="/student/print" element={<StudentPrinting />} />
              <Route path="/student/helpdesk" element={<StudentHelpdesk />} />
              <Route path="/student/talent" element={<StudentTalentExchange />} />
              <Route path="/student/fun" element={<StudentFun />} />

              {/* Faculty Routes */}
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/print-orders" element={<AdminPrintOrders />} />
              <Route path="/admin/helpdesk" element={<AdminHelpdesk />} />

              {/* Shopkeeper Routes */}
              <Route path="/shopkeeper/dashboard" element={<AdminPrintOrders />} />
              <Route path="/shopkeeper/helpdesk" element={<AdminHelpdesk />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </EmergencyProvider>
    </AuthProvider>
  );
}

export default App;
