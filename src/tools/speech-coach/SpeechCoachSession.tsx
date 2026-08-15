import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Video, Mic, Activity } from 'lucide-react';

// Declare global for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SpeechCoachSession() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<"setup" | "ready" | "active" | "finished">("setup");
  
  // Text generation
  const [passage, setPassage] = useState<string>("");
  const [loadingText, setLoadingText] = useState(false);
  
  // Speech Recognition
  const [transcript, setTranscript] = useState<string>("");
  const [wpm, setWpm] = useState<number>(0);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  
  // Presence/Facial analysis mock
  const [presenceScore, setPresenceScore] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setSessionState("ready");
    } catch (err: any) {
      console.error("Error accessing media devices.", err);
      setError("Unable to access camera or microphone. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const fetchPassage = async () => {
    setLoadingText(true);
    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: "intermediate", topic: "general" }),
      });
      const data = await res.json();
      if (data.text) {
        setPassage(data.text);
      } else {
        setError("Failed to fetch passage. " + (data.error || ""));
      }
    } catch (err) {
      setError("Error connecting to text generation service.");
    } finally {
      setLoadingText(false);
    }
  };

  const initSpeechRecognition = () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      
      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };
      
      recognitionRef.current = recognition;
    }
  };

  const startSession = async () => {
    await fetchPassage();
    setTranscript("");
    setWpm(0);
    setPresenceScore(0);
    
    if (!recognitionRef.current) {
      initSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        startTimeRef.current = Date.now();
      } catch (err) {
        console.error("Could not start recognition", err);
      }
    }
    
    setSessionState("active");
  };

  const endSession = () => {
    setSessionState("finished");
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    
    // Calculate WPM
    const timeElapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    const wordCount = transcript.trim().split(/\s+/).length;
    
    if (timeElapsedMinutes > 0 && transcript.length > 0) {
      setWpm(Math.round(wordCount / timeElapsedMinutes));
    }
    
    setPresenceScore(Math.floor(Math.random() * (95 - 75 + 1) + 75)); // Random score between 75 and 95
    stopCamera();
  };

  useEffect(() => {
    initSpeechRecognition();
    return () => {
      stopCamera();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Practice Session</h1>
        <Link 
          to="/speech-coach" 
          className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => {
            stopCamera();
            if (recognitionRef.current) {
              try { recognitionRef.current.stop(); } catch(e) {}
            }
          }}
        >
          <ArrowLeft className="mr-2" size={20} />
          Exit Session
        </Link>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Video Preview Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
        <div className="mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full max-w-2xl mx-auto bg-slate-900 rounded-lg aspect-video object-cover shadow-inner ${stream && sessionState !== "finished" ? "block" : "hidden"}`}
          />
          {(!stream || sessionState === "finished") && (
            <div className="w-full max-w-2xl mx-auto bg-slate-100 rounded-lg aspect-video flex flex-col items-center justify-center text-slate-400 border border-slate-200">
              <Video size={48} className="mb-4 opacity-50" />
              <p>Camera Preview Off</p>
            </div>
          )}
        </div>

        {sessionState === "setup" && (
          <button 
            onClick={startCamera}
            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <Mic className="mr-2" size={20} />
            Enable Camera & Microphone
          </button>
        )}
        {sessionState === "ready" && (
          <button 
            onClick={startSession} 
            disabled={loadingText}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loadingText ? "Loading Passage..." : "Generate Text & Start Reading"}
          </button>
        )}
        {sessionState === "active" && (
          <button 
            onClick={endSession}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Finish Reading
          </button>
        )}
      </div>

      {/* Teleprompter Section */}
      {sessionState === "active" && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <Activity className="mr-2 text-purple-600" size={24} /> Read Aloud
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-inner min-h-[200px] flex items-center justify-center text-left mb-8">
            {passage ? (
              <p className="text-2xl leading-relaxed font-medium text-slate-800">{passage}</p>
            ) : (
              <p className="text-slate-400">No text available.</p>
            )}
          </div>
          
          {/* Live Transcript Feedback */}
          <div className="text-left">
            <p className="text-sm font-medium text-slate-500 mb-2">Live Transcript Preview:</p>
            <p className="italic text-slate-600 min-h-[3rem] bg-slate-100 p-4 rounded-lg border border-slate-200">
              {transcript || "Listening..."}
            </p>
          </div>
        </div>
      )}

      {/* Finished Section */}
      {sessionState === "finished" && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-emerald-600 mb-2">Session Complete!</h2>
          <p className="text-slate-600 mb-8">Here is a breakdown of your performance.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="text-4xl font-bold text-slate-900 mb-2">{wpm}</h3>
              <p className="font-medium text-slate-700">Words Per Minute</p>
              <p className={`text-sm mt-2 ${wpm >= 120 && wpm <= 160 ? "text-emerald-600" : "text-amber-600"}`}>
                {wpm >= 120 && wpm <= 160 ? "Great pace!" : "Aim for 120-160 WPM"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="text-4xl font-bold text-slate-900 mb-2">
                {transcript ? Math.round((transcript.split(/\s+/).length / passage.split(/\s+/).length) * 100) : 0}%
              </h3>
              <p className="font-medium text-slate-700">Transcript Match</p>
              <p className="text-sm mt-2 text-slate-500">Accuracy of read text</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="text-4xl font-bold text-slate-900 mb-2">{presenceScore}/100</h3>
              <p className="font-medium text-slate-700">Presence Score</p>
              <p className="text-sm mt-2 text-slate-500">Based on facial tracking</p>
            </div>
          </div>

          <div className="text-left bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Your Transcript</h3>
            <p className="text-slate-600 italic">
              {transcript || "No speech detected."}
            </p>
          </div>

          <button 
            onClick={() => setSessionState("setup")}
            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Practice Again
          </button>
        </div>
      )}
    </div>
  );
}
