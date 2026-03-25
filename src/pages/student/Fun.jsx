import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Phone, PhoneOff, User, RefreshCw, X, Mic, MicOff, Camera, CameraOff } from 'lucide-react';

const StudentFun = () => {
  const [status, setStatus] = useState('idle'); // idle, searching, incoming, in_call
  const [caller, setCaller] = useState(null);
  const [timer, setTimer] = useState(0);
  const CALL_DURATION_LIMIT = 180; // 3 minutes limit (180 seconds)

  const potentialCallers = [
    { name: "Siddharth M.", dept: "Computer Science", year: "3rd Year" },
    { name: "Ananya R.", dept: "Design", year: "2nd Year" },
    { name: "Prateek S.", dept: "Engineering", year: "4th Year" },
    { name: "Isha G.", dept: "Management", year: "1st Year" }
  ];

  useEffect(() => {
    let interval;
    if (status === 'in_call') {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev + 1 >= CALL_DURATION_LIMIT) {
            endCall();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startSearching = () => {
    console.log("Starting random call search...");
    setStatus('searching');
    setTimeout(() => {
      const randomCaller = potentialCallers[Math.floor(Math.random() * potentialCallers.length)];
      console.log("Matched with caller:", randomCaller);
      setCaller(randomCaller);
      setStatus('incoming');
    }, 2000);
  };

  const acceptCall = () => {
    console.log("Call accepted.");
    setStatus('in_call');
  };
  const skipCall = () => {
    console.log("Call skipped.");
    setStatus('idle');
    setCaller(null);
  };
  const endCall = () => {
    console.log("Call ended.");
    setStatus('idle');
    setCaller(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = CALL_DURATION_LIMIT - timer;

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Campus Fun</h1>
        <p className="text-slate-500">Connect randomly with fellow students on campus!</p>
      </div>

      <div className="flex-1 bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border-4 border-slate-800">
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <div className="h-24 w-24 bg-sky-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Video className="h-10 w-10 text-sky-400" />
            </div>
            <h2 className="text-xl font-bold mb-4">Ready for some fun?</h2>
            <button 
              onClick={startSearching}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-sky-500/30 transform hover:-translate-y-1"
            >
              Start Random Video Call
            </button>
          </div>
        )}

        {status === 'searching' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <RefreshCw className="h-12 w-12 text-sky-400 animate-spin mb-4" />
            <p className="text-lg font-medium animate-pulse">Finding someone on campus...</p>
          </div>
        )}

        {status === 'incoming' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900/90 backdrop-blur-md">
            <div className="h-24 w-24 bg-slate-700 rounded-full flex items-center justify-center mb-6 relative">
              <User className="h-12 w-12 text-slate-400" />
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-4 border-slate-900 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{caller?.name}</h2>
            <p className="text-slate-400 mb-12">{caller?.dept} • {caller?.year}</p>
            
            <div className="flex gap-8">
              <button 
                onClick={skipCall}
                className="h-16 w-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-110"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
              <button 
                onClick={acceptCall}
                className="h-16 w-16 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-110 animate-bounce"
              >
                <Phone className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-8 text-xs text-slate-500 font-bold uppercase tracking-widest">Incoming Call...</p>
          </div>
        )}

        {status === 'in_call' && (
          <div className="absolute inset-0 flex flex-col">
            {/* Remote Video (Simulated) */}
            <div className="flex-1 bg-slate-800 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <User size={120} />
                <p className="mt-4 font-bold text-slate-500">Simulating Video Stream...</p>
              </div>
              
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className={`h-2 w-2 rounded-full animate-pulse ${remainingTime <= 10 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                <span className="text-white text-sm font-bold">{caller?.name}</span>
                <span className={`text-xs font-mono ${remainingTime <= 10 ? 'text-red-400 font-bold' : 'text-white/60'}`}>
                  Ends in: {formatTime(remainingTime)}
                </span>
              </div>

              {/* Local Video (Simulated) */}
              <div className="absolute bottom-6 right-6 h-40 w-28 bg-slate-700 rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                  <User size={30} />
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] text-white font-bold bg-black/40 px-1.5 py-0.5 rounded">You</div>
              </div>
            </div>

            {/* Controls */}
            <div className="h-24 bg-slate-900 flex items-center justify-center gap-6 border-t border-slate-800">
              <button className="h-12 w-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors">
                <Mic className="h-5 w-5" />
              </button>
              <button className="h-12 w-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors">
                <Camera className="h-5 w-5" />
              </button>
              <button 
                onClick={endCall}
                className="h-14 w-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition-all hover:scale-105"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400 font-medium">Calls are private and limited to PCU Campus Hub members only.</p>
      </div>
    </div>
  );
};

export default StudentFun;
