import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Phone, PhoneOff, User, RefreshCw, X, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { useAuth } from '../../context/AuthContext';

const SOCKET_SERVER = import.meta.env.DEV 
  ? 'http://localhost:5000' 
  : window.location.origin;

const StudentFun = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('idle'); // idle, searching, incoming, in_call
  const [caller, setCaller] = useState(null);
  const [timer, setTimer] = useState(0);
  const [stream, setStream] = useState(null);
  const [offerSignal, setOfferSignal] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  
  const socketRef = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const partnerIdRef = useRef();
  
  const CALL_DURATION_LIMIT = 180; // 3 minutes limit (180 seconds)

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER);

    socketRef.current.on('match_found', ({ partnerId, partnerData, initiator }) => {
      console.log('Match found:', partnerId, partnerData, initiator);
      setCaller(partnerData);
      partnerIdRef.current = partnerId;
      
      if (initiator) {
        setStatus('in_call');
        initiateCall(partnerId);
      } else {
        setStatus('incoming');
      }
    });

    socketRef.current.on('signal', ({ from, signal }) => {
      if (peerRef.current) {
        peerRef.current.signal(signal);
      } else if (signal.type === 'offer') {
        setOfferSignal(signal);
      }
    });

    socketRef.current.on('call_ended', () => {
      endCall();
    });

    return () => {
      socketRef.current.disconnect();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (stream && userVideo.current) {
      userVideo.current.srcObject = stream;
    }
  }, [stream]);

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

  const startSearching = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(currentStream);
      
      setStatus('searching');
      socketRef.current.emit('find_match', {
        name: user?.name || 'Anonymous Student',
        dept: 'PCU Student',
        year: 'Any Year'
      });
    } catch (err) {
      console.error('Failed to get user media:', err);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const createPeer = (partnerId, initiator) => {
    const peer = new Peer({
      initiator,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('signal', { to: partnerId, signal: data });
    });

    peer.on('stream', (partnerStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = partnerStream;
      }
    });

    peer.on('connect', () => {
      console.log('Peer connection established');
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
      endCall();
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
      endCall();
    });

    return peer;
  };

  const initiateCall = (partnerId) => {
    peerRef.current = createPeer(partnerId, true);
  };

  const acceptCall = () => {
    setStatus('in_call');
    peerRef.current = createPeer(partnerIdRef.current, false);
    if (offerSignal) {
      peerRef.current.signal(offerSignal);
      setOfferSignal(null);
    }
  };

  const skipCall = () => {
    setStatus('idle');
    setCaller(null);
    setOfferSignal(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const endCall = () => {
    if (socketRef.current && partnerIdRef.current) {
      socketRef.current.emit('end_call', { to: partnerIdRef.current });
    }
    
    if (peerRef.current) {
      peerRef.current.removeAllListeners();
      peerRef.current.destroy();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    setStatus('idle');
    setCaller(null);
    setOfferSignal(null);
    partnerIdRef.current = null;
    peerRef.current = null;
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicMuted(!audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = CALL_DURATION_LIMIT - timer;

  return (
    <div className="max-w-5xl mx-auto min-h-[calc(100vh-12rem)] flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Campus Fun</h1>
        <p className="text-slate-500 text-sm">Connect randomly with fellow students on campus!</p>
      </div>

      <div className="flex-1 bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border-4 border-slate-800 min-h-[500px]">
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
            <div className="relative mb-8 h-48 w-64 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700">
              <video 
                ref={userVideo} 
                autoPlay 
                muted 
                playsInline 
                className="h-full w-full object-cover mirror"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span className="text-xs font-bold text-white/80">Connecting camera...</span>
              </div>
            </div>
            <RefreshCw className="h-12 w-12 text-sky-400 animate-spin mb-4" />
            <p className="text-lg font-medium animate-pulse">Finding someone on campus...</p>
            <button 
              onClick={skipCall}
              className="mt-8 text-slate-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Cancel Search
            </button>
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
            {/* Remote Video */}
            <div className="flex-1 bg-slate-800 relative overflow-hidden">
              <video 
                ref={partnerVideo} 
                autoPlay 
                playsInline 
                className="h-full w-full object-cover"
              />
              
              {!partnerVideo.current?.srcObject && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                  <User size={120} />
                  <p className="mt-4 font-bold text-slate-500">Connecting to Partner...</p>
                </div>
              )}
              
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className={`h-2 w-2 rounded-full animate-pulse ${remainingTime <= 10 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                <span className="text-white text-sm font-bold">{caller?.name}</span>
                <span className={`text-xs font-mono ${remainingTime <= 10 ? 'text-red-400 font-bold' : 'text-white/60'}`}>
                  Ends in: {formatTime(remainingTime)}
                </span>
              </div>

              {/* Local Video Overlay */}
              <div className="absolute bottom-6 right-6 h-40 w-28 bg-slate-700 rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl z-10">
                {isCameraOff ? (
                  <div className="h-full w-full flex items-center justify-center text-slate-500">
                    <CameraOff size={24} />
                  </div>
                ) : (
                  <video 
                    ref={userVideo} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="h-full w-full object-cover mirror"
                  />
                )}
                <div className="absolute bottom-2 left-2 text-[10px] text-white font-bold bg-black/40 px-1.5 py-0.5 rounded">You</div>
              </div>
            </div>

            {/* Controls */}
            <div className="h-24 bg-slate-900 flex items-center justify-center gap-6 border-t border-slate-800">
              <button 
                onClick={toggleMic}
                className={`h-12 w-12 rounded-full flex items-center justify-center text-white transition-colors ${isMicMuted ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <button 
                onClick={toggleCamera}
                className={`h-12 w-12 rounded-full flex items-center justify-center text-white transition-colors ${isCameraOff ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
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
      
      <div className="mt-6 bg-sky-50 border border-sky-100 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sky-900 font-bold text-xs mb-1 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-sky-500 rounded-full animate-pulse"></span>
          Community Guidelines & Purpose
        </h3>
        <p className="text-sky-800 text-[10px] leading-relaxed">
          Welcome to the Fun Zone! This space is dedicated to <span className="font-bold">learning and practicing your English communication skills</span> in a friendly environment. 
          As members of the PCU family, we treat everyone with utmost respect and kindness.
          <span className="text-red-500 font-bold uppercase mx-2">Important:</span> 
          Strict zero-tolerance policy for abusive language or disrespectful behavior. Violations will result in an immediate and permanent account block. Let's grow together politely!
        </p>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Secure • Private • PCU Campus Hub Only</p>
      </div>
      
      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default StudentFun;
