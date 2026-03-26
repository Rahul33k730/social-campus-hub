import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, ShieldCheck, User, Mail, School, Hash, Calendar } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '', // This will be email for students
    password: '',
    full_name: '',
    email: '',
    branch: 'CSE',
    student_code: '',
    year: '1'
  });

  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Enforce @pcu.edu.in for students
    if (role === 'student') {
      const emailToCheck = isRegistering ? formData.email : formData.username;
      if (!emailToCheck.endsWith('@pcu.edu.in')) {
        setError('Invalid email. Please use your official college email ending with @pcu.edu.in');
        setIsLoading(false);
        return;
      }
    }

    if (isForgotPassword) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.username, role })
        });
        const data = await response.json();
        if (data.success) {
          setSuccess(data.message);
          setIsForgotPassword(false);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Connection to server failed');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    let body;
    if (isRegistering) {
      body = { ...formData, role };
    } else {
      body = { username: formData.username, password: formData.password, role };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        if (isRegistering) {
          setIsRegistering(false);
          setError('Registration successful! Please login.');
        } else {
          // Login success
          login(data.user.role, data.user.name); // You might want to update context to store more data
          localStorage.setItem('token', data.token);
          navigate(`/${role}/dashboard`);
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection to server failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Hero/Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
             src="/images/pcu-hero.webp" 
             alt="PCU Campus" 
             className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-900/50"></div>
        </div>
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl overflow-hidden border border-slate-200">
            <img src="/images/pcu-logo.jpg" alt="PCU" className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome to <br/> <span className="text-sky-400">PCU Campus Hub</span></h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            The official smart digital campus platform for PCU. Access your academic records, attendance, and campus updates in one secure place.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 lg:px-20 xl:px-32 bg-white overflow-y-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 group w-fit">
            <span className="font-bold text-slate-900 text-lg uppercase">PCU CAMPUS HUB</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            {displayRole} {isForgotPassword ? 'Reset Password' : (isRegistering ? 'Registration' : 'Login')}
          </h2>
          <p className="text-slate-500 mb-8">
            {isForgotPassword 
              ? 'Enter your official email to receive reset instructions.' 
              : (isRegistering ? 'Create your account to join the hub.' : 'Please sign in to continue to your dashboard.')}
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {error && (
            <div className="p-4 rounded-md mb-6 bg-red-50 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 rounded-md mb-6 bg-green-50 text-green-700">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isForgotPassword && isRegistering && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input name="full_name" type="text" required value={formData.full_name} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Official Email Address (@pcu.edu.in)</label>
                  <input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2" placeholder="yourname@pcu.edu.in" />
                </div>
                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Student ERP code</label>
                      <input name="student_code" type="text" required value={formData.student_code} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Year</label>
                      <select name="year" value={formData.year} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2">
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Branch</label>
                  <input name="branch" type="text" required value={formData.branch} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
                </div>
              </>
            )}

            {isForgotPassword ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Official Email ID (@pcu.edu.in)</label>
                <input name="username" type="email" required value={formData.username} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2" placeholder="yourname@pcu.edu.in" />
              </div>
            ) : (
              !isRegistering && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    {role === 'student' ? 'Official Email ID (@pcu.edu.in)' : 'Username'}
                  </label>
                  <input 
                    name="username" 
                    type={role === 'student' ? 'email' : 'text'} 
                    required 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2" 
                    placeholder={role === 'student' ? 'yourname@pcu.edu.in' : 'Enter username'}
                  />
                </div>
              )
            )}

            {!isRegistering && !isForgotPassword && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <button 
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs font-semibold text-sky-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input name="password" type="password" required minLength="8" value={formData.password} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : (isRegistering ? 'Register' : 'Sign In'))}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </button>

            <div className="text-center mt-6">
              {isForgotPassword ? (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sky-600 font-semibold hover:underline"
                >
                  Back to Login
                </button>
              ) : (
                role !== 'admin' && role !== 'shopkeeper' && (
                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
                  </button>
                )
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
