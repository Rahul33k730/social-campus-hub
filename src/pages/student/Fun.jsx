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
  
  const [partnerStream, setPartnerStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [isRemoteVideoMuted, setIsRemoteVideoMuted] = useState(false);
  const [isRemoteCameraOff, setIsRemoteCameraOff] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const partnerStreamRef = useRef();
  const pendingSignalsRef = useRef([]);
  
  const socketRef = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const partnerIdRef = useRef();
  const streamRef = useRef();
  
  const CALL_DURATION_LIMIT = 180; // 3 minutes limit (180 seconds)

  useEffect(() => {
      socketRef.current = io(SOCKET_SERVER, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        timeout: 10000
      });

    socketRef.current.on('match_found', ({ partnerId, partnerData, initiator }) => {
      console.log('Match found:', partnerId, partnerData, initiator);
      setCaller(partnerData);
      partnerIdRef.current = partnerId;
      setConnectionStatus('Calling...');
      
      if (initiator) {
        setStatus('in_call');
        initiateCall(partnerId);
      } else {
        setStatus('incoming');
      }
    });

    socketRef.current.on('signal', ({ from, signal }) => {
      console.log('Received signal from partner:', signal.type || 'candidate');
      if (peerRef.current) {
        peerRef.current.signal(signal);
      } else {
        console.log('Peer not ready, buffering signal');
        pendingSignalsRef.current.push(signal);
        if (signal.type === 'offer') {
          setOfferSignal(signal);
        }
      }
    });

    socketRef.current.on('call_ended', () => {
      endCall();
    });

    return () => {
      socketRef.current.disconnect();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const attachStreams = () => {
      if (status === 'in_call') {
        if (partnerStreamRef.current && partnerVideo.current) {
          console.log("Attaching partner stream via effect");
          if (partnerVideo.current.srcObject !== partnerStreamRef.current) {
            partnerVideo.current.srcObject = partnerStreamRef.current;
          }
          partnerVideo.current.play().catch(e => console.error("Error playing partner video:", e));
        }
      }
      if (status === 'in_call' || status === 'searching') {
        if (streamRef.current && userVideo.current) {
          if (userVideo.current.srcObject !== streamRef.current) {
            userVideo.current.srcObject = streamRef.current;
          }
        }
      }
    };

    attachStreams();
    // Use an interval to keep trying for a few seconds to ensure attachment
    const interval = setInterval(attachStreams, 1000);
    return () => clearInterval(interval);
  }, [status, partnerStream, stream]);

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
      const currentStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { max: 30 } }, 
        audio: true 
      });
      setStream(currentStream);
      streamRef.current = currentStream;
      
      // Immediately set for preview if possible
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
      
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
    console.log('Creating peer for:', partnerId, 'Initiator:', initiator);
    
    // Use trickle: false for more reliable (but slower) initial connection in restrictive networks
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: streamRef.current,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          { urls: 'stun:stun.services.mozilla.com' },
          { urls: 'stun:stun.stunprotocol.org:3478' },
          { urls: 'stun:stun.voiparound.com:3478' },
          { urls: 'stun:stun.voipbuster.com:3478' },
          { urls: 'stun:stun.voipstunt.com:3478' },
          { urls: 'stun:stun.voxgratia.org:3478' },
          { urls: 'stun:stun.ekiga.net' },
          { urls: 'stun:stun.ideasip.com' },
          { urls: 'stun:stun.schlund.de' },
          { urls: 'stun:stun.softjoys.com' },
          { urls: 'stun:stun.voipcheap.com' },
          { urls: 'stun:stun.voipstunt.com' }
        ],
        iceTransportPolicy: 'all'
      }
    });

    peer.on('signal', (data) => {
      console.log('Generated full signal, sending to partner:', partnerId, 'Signal type:', data.type);
      setConnectionStatus(data.type === 'offer' ? 'Ready to Call' : 'Accepting...');
      socketRef.current.emit('signal', { to: partnerId, signal: data });
    });

    peer.on('stream', (remoteStream) => {
      console.log('Received remote partner stream, tracks:', remoteStream.getTracks().length);
      setConnectionStatus('Stream Received');
      setPartnerStream(remoteStream);
      partnerStreamRef.current = remoteStream;
      
      // Use a timeout to ensure the video element is mounted and ready
      setTimeout(() => {
        if (partnerVideo.current) {
          console.log("Setting srcObject for partner video");
          partnerVideo.current.srcObject = remoteStream;
          partnerVideo.current.play().catch(e => {
            console.error("Error playing remote video:", e);
            // If play fails, try again with muted if it was a permission issue
            if (e.name === 'NotAllowedError') {
              console.log("Attempting to play muted due to permission");
              partnerVideo.current.muted = true;
              partnerVideo.current.play().catch(pErr => console.error("Still failed to play even muted:", pErr));
            }
          });
        } else {
          console.warn("partnerVideo ref not available yet when stream received");
        }
      }, 500);
    });

    peer.on('connect', () => {
      console.log('Peer connection established');
      setConnectionStatus('Secure Connection');
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
      setConnectionStatus('Retrying...');
      // Try to re-signal if possible or just log
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
      setConnectionStatus('Closed');
      endCall();
    });

    // Process any buffered signals that arrived before the peer was ready
    if (pendingSignalsRef.current.length > 0) {
      console.log(`Processing ${pendingSignalsRef.current.length} buffered signals`);
      pendingSignalsRef.current.forEach(signal => {
        try {
          peer.signal(signal);
        } catch (err) {
          console.error("Error signaling buffered signal:", err);
        }
      });
      pendingSignalsRef.current = [];
    }

    return peer;
  };

  const initiateCall = (partnerId) => {
    peerRef.current = createPeer(partnerId, true);
  };

  const acceptCall = () => {
    setStatus('in_call');
    setConnectionStatus('Connecting...');
    peerRef.current = createPeer(partnerIdRef.current, false);
    setOfferSignal(null);
  };

  const reconnectCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setConnectionStatus('Reconnecting...');
    // The initiator will re-create the peer
    if (caller && partnerIdRef.current) {
      peerRef.current = createPeer(partnerIdRef.current, true);
    }
  };

  const skipCall = () => {
    setStatus('idle');
    setCaller(null);
    setOfferSignal(null);
    setPartnerStream(null);
    partnerStreamRef.current = null;
    pendingSignalsRef.current = [];
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);
  };

  const endCall = () => {
    if (socketRef.current && partnerIdRef.current) {
      socketRef.current.emit('end_call', { to: partnerIdRef.current });
    }
    
    if (peerRef.current) {
      peerRef.current.removeAllListeners();
      peerRef.current.destroy();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);

    setStatus('idle');
    setCaller(null);
    setOfferSignal(null);
    setPartnerStream(null);
    partnerStreamRef.current = null;
    partnerIdRef.current = null;
    peerRef.current = null;
    pendingSignalsRef.current = [];
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicMuted(!audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
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
          <div className="absolute inset-0 flex flex-col bg-slate-950 overflow-hidden">
            {/* Full Screen Remote Video */}
            <div className="flex-1 relative group bg-slate-900">
              <video 
                ref={partnerVideo} 
                autoPlay 
                playsInline 
                className={`h-full w-full ${isRemoteCameraOff ? 'hidden' : 'object-cover'}`}
              />
              
              {/* Partner Info Overlay */}
              <div className="absolute top-8 left-8 flex items-center gap-3 z-30">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-white text-xl font-bold drop-shadow-lg">{caller?.name}</h2>
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mt-1">
                    <span className={`text-[10px] font-mono font-bold ${remainingTime <= 30 ? 'text-red-400 animate-pulse' : 'text-white/80'}`}>
                      {formatTime(remainingTime)}
                    </span>
                    <span className="text-white/30 text-[10px]">|</span>
                    <span className="text-[10px] text-white/60 font-medium uppercase tracking-tighter">HD Live</span>
                  </div>
                </div>
              </div>

              {/* Connection Status Indicator */}
              {!partnerStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-20">
                  <div className="relative">
                    <div className="h-32 w-32 bg-slate-800 rounded-full flex items-center justify-center animate-pulse border-2 border-sky-500/30">
                      <User size={64} className="text-slate-600" />
                    </div>
                    <RefreshCw className="absolute bottom-0 right-0 h-10 w-10 text-sky-500 animate-spin bg-slate-900 rounded-full p-2 border-2 border-slate-800" />
                  </div>
                  <h3 className="text-white font-bold text-xl mt-6 tracking-tight">Connecting to {caller?.name}...</h3>
                  <p className="text-sky-400 text-xs mt-2 font-mono font-bold uppercase tracking-[0.2em]">{connectionStatus}</p>
                  
                  <div className="mt-12 flex flex-col items-center gap-4">
                    <p className="text-slate-500 text-[10px] max-w-xs text-center uppercase leading-loose tracking-widest px-8">
                      We're trying a stable connection. If it takes too long, try to reconnect or refresh.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={reconnectCall}
                        className="bg-sky-600 hover:bg-sky-500 text-white text-[10px] px-6 py-2 rounded-full transition-all font-bold uppercase tracking-widest shadow-lg shadow-sky-600/20"
                      >
                        Try Again
                      </button>
                      <button 
                        onClick={() => window.location.reload()}
                        className="bg-white/5 hover:bg-white/10 text-white/60 text-[10px] px-6 py-2 rounded-full border border-white/10 transition-all font-bold uppercase tracking-widest"
                      >
                        Refresh Page
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Local Video Overlay (WhatsApp Style Floating) */}
              <div className="absolute top-8 right-8 w-32 sm:w-40 aspect-[3/4] rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl z-40 transition-all hover:scale-105 group/local">
                {isCameraOff ? (
                  <div className="h-full w-full bg-slate-800 flex items-center justify-center text-slate-500">
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
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="text-[9px] text-white font-bold uppercase tracking-tighter">You</span>
                </div>
              </div>

              {/* Bottom Control Bar Overlay */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 transition-all group-hover:bottom-12">
                <div className="bg-black/40 backdrop-blur-2xl px-6 py-4 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-5">
                  <button 
                    onClick={toggleMic}
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isMicMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 hover:bg-white/20 text-white hover:scale-110'}`}
                  >
                    {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  
                  <button 
                    onClick={endCall}
                    className="h-14 w-14 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-600/40 transition-all hover:scale-110 active:scale-95"
                  >
                    <PhoneOff size={24} strokeWidth={2.5} />
                  </button>
                  
                  <button 
                    onClick={toggleCamera}
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 hover:bg-white/20 text-white hover:scale-110'}`}
                  >
                    {isCameraOff ? <CameraOff size={20} /> : <Camera size={20} />}
                  </button>
                </div>
              </div>
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
        @keyframes pulse-ring {
          0% { transform: scale(.33); opacity: 1; }
          80%, 100% { opacity: 0; }
        }
        @keyframes pulse-dot {
          0% { transform: scale(.8); }
          50% { transform: scale(1); }
          100% { transform: scale(.8); }
        }
      `}</style>
    </div>
  );
};

export default StudentFun;
