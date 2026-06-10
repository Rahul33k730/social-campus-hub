import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, AlertCircle, Calendar, CheckCircle, Printer, HelpCircle, FileText } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am the PCU Smart Assistant. I can help you with Printing, Events, Helpdesk, and more. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate response
    setTimeout(() => {
      let responseText = "I'm not sure about that. Try asking about Printing, Events, or the Helpdesk!";
      const lowerInput = inputText.toLowerCase();
      
      if (lowerInput.includes('print')) {
        responseText = "PCU Printing Hub: You can upload PDFs or paste document links. Rates: ₹2 for B/W and ₹10 for Color. Track status in 'My Orders' on the printing page.";
      } else if (lowerInput.includes('event')) {
        responseText = "Campus Events: You can post events from your dashboard. Once verified by an admin, they will appear in the Events tab for everyone.";
      } else if (lowerInput.includes('help') || lowerInput.includes('problem') || lowerInput.includes('issue') || lowerInput.includes('ticket')) {
        responseText = "PCU Helpdesk: If you have any problems (Technical, Academic, etc.), submit a ticket through the Helpdesk section. Our team will respond to you there.";
      } else if (lowerInput.includes('paper') || lowerInput.includes('note')) {
        responseText = "Previous Year Papers: You can find and upload study materials in the 'Previous Paper' section of your dashboard.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        responseText = "Greetings! I'm your PCU Assistant. Ask me about campus services like Printing, Events, or the Helpdesk.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: responseText }]);
    }, 800);
  };

  const handleQuickAction = (action) => {
    const userMsg = { id: Date.now(), type: 'user', text: action };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let responseText = "";
      switch (action) {
        case "Printing Rates":
          responseText = "Printing Rates: ₹2 per page for Black & White, and ₹10 per page for Full Color. We support both PDF uploads and external links.";
          break;
        case "Post Event":
          responseText = "To post an event, go to your Dashboard, click 'Post New Event', and fill in the details. Admin verification is required before it goes live.";
          break;
        case "Need Help?":
          responseText = "For any issues, use the PCU Helpdesk to submit a ticket. You can track our team's response directly in the 'My Tickets' tab.";
          break;
        case "Previous Papers":
          responseText = "Access 'Previous Year Papers' from the Quick Links on your dashboard to download or upload study materials.";
          break;
        default:
          responseText = "How else can I assist you today?";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: responseText }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-50 flex items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="h-6 w-6 text-sky-400" />
        <span className="font-medium hidden md:inline">PCU Assistant</span>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-sky-500/20 rounded-full flex items-center justify-center border border-sky-500/30">
                <MessageSquare className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">PCU Smart Assistant</h3>
                <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">Always Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-slate-50 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm font-medium ${
                    msg.type === 'user'
                      ? 'bg-sky-600 text-white rounded-br-none shadow-lg shadow-sky-600/20'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
            <QuickBtn icon={<Printer size={14}/>} label="Printing Rates" onClick={() => handleQuickAction("Printing Rates")} />
            <QuickBtn icon={<Calendar size={14}/>} label="Post Event" onClick={() => handleQuickAction("Post Event")} />
            <QuickBtn icon={<HelpCircle size={14}/>} label="Need Help?" onClick={() => handleQuickAction("Need Help?")} />
            <QuickBtn icon={<FileText size={14}/>} label="Previous Papers" onClick={() => handleQuickAction("Previous Papers")} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-all font-medium"
            />
            <button
              onClick={handleSend}
              className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-900/10"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const QuickBtn = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border border-slate-200"
  >
    {icon} {label}
  </button>
);

export default Chatbot;
