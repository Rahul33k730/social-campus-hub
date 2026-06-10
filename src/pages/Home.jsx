import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, BookOpen, Users, Printer, HelpCircle, Calendar, MessageSquare, Star } from 'lucide-react';

const Home = () => {
  const [feedbackData, setFeedbackData] = React.useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleFeedbackChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      if (response.ok) {
        setSubmitted(true);
        setFeedbackData({ name: '', email: '', message: '', rating: 5 });
      }
    } catch (err) {
      console.error('Feedback failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const incrementVisitor = async () => {
      try {
        await fetch('http://localhost:5000/api/visitor/increment');
      } catch (err) {
        console.error('Failed to increment visitor count:', err);
      }
    };
    incrementVisitor();
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <header className="relative bg-slate-900 text-white pt-32 pb-40 px-6 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/pcu-hero.webp" 
            alt="PCU Campus" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="h-20 w-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center overflow-hidden mb-6 shadow-2xl p-2">
              <img 
                src="/images/pcu-logo.jpg" 
                alt="PCU Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-full w-full bg-sky-600 text-white items-center justify-center font-bold text-3xl">P</div>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Smart Digital Campus
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Social Campus Hub <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              PCU Smart Digital Platform
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            A next-generation digital ecosystem offering smart printing services, instant helpdesk support, verified campus events, and AI-powered assistance for the PCU community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/roles" 
              className="group bg-sky-600 hover:bg-sky-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-sky-500/30 flex items-center justify-center gap-3 transform hover:-translate-y-1"
            >
              Access Portal <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#features" 
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why PCU Needs This Platform</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Empowering the PCU community with a unified digital ecosystem for seamless printing, instant support, and vibrant campus engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-sky-600" />}
              title="Student-Centric Hub"
              description="Personalized dashboards with real-time updates, study materials, and AI-powered assistance."
            />
            <FeatureCard 
              icon={<Printer className="h-8 w-8 text-emerald-600" />}
              title="Smart Printing Hub"
              description="Skip the queue! Upload PDFs or links directly and track your printing orders in real-time."
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-amber-600" />}
              title="Campus Events"
              description="Stay connected with verified campus activities. Post events and get them admin-approved."
            />
            <FeatureCard 
              icon={<HelpCircle className="h-8 w-8 text-rose-600" />}
              title="Digital Helpdesk"
              description="Report campus issues or technical problems and get direct responses from the support team."
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-indigo-600" />}
              title="Admin & Safety"
              description="Centralized control for emergency alerts, user management, and campus-wide spotlights."
            />
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-6 tracking-tight">Share Your Feedback</h2>
                <p className="text-slate-400 mb-8 text-lg font-medium leading-relaxed">
                  We are constantly improving the PCU Social Campus Hub. Tell us what you think!
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20">
                      <MessageSquare className="text-sky-400" />
                    </div>
                    <div>
                      <h4 className="font-bold">Public Feedback</h4>
                      <p className="text-xs text-slate-500">Every voice matters to us.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {submitted ? (
                  <div className="text-center py-10 animate-in zoom-in duration-300">
                    <div className="h-20 w-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                      <Star size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                    <p className="text-slate-400 font-medium mb-6">Your feedback has been received.</p>
                    <button onClick={() => setSubmitted(false)} className="text-sky-400 font-bold hover:underline">Submit another?</button>
                  </div>
                ) : (
                  <form onSubmit={submitFeedback} className="space-y-4">
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Your Name"
                      value={feedbackData.name}
                      onChange={handleFeedbackChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none transition-all"
                    />
                    <textarea 
                      name="message"
                      required
                      placeholder="What can we improve?"
                      value={feedbackData.message}
                      onChange={handleFeedbackChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none transition-all h-32 resize-none"
                    ></textarea>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-sky-600/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Feedback'}
                      {!isSubmitting && <ArrowRight size={18} />}
                    </button>
                  </form>
                )}
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12">
              <MessageSquare size={300} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 font-bold text-white text-xl uppercase tracking-wider">
            <div className="h-10 w-10 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden border border-white/10 group">
              <img 
                src="/images/pcu-logo.jpg" 
                alt="PCU" 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-full w-full bg-sky-600 text-white items-center justify-center font-bold text-xl">P</div>
            </div>
            Social Campus Hub
          </div>
          <p className="text-sm">Shyamji Tech all Rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="bg-sky-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default Home;
