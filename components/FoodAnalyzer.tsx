
import React, { useState, useEffect, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { getWeatherData } from '../services/weatherService';
import { User, WeatherData } from '../types';

const FoodAnalyzer: React.FC<{ user: User }> = ({ user }) => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("Detecting...");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
          const weatherData = await getWeatherData(lat, lon);
          setWeather(weatherData);
        },
        () => setLocation("Unknown Location")
      );
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setAnalysis(null);
        setImage(null);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl.split(',')[1]);
        setMimeType('image/jpeg');
        stopCamera();
      }
    }
  };

  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 8) return 'Monsoon';
    return 'Winter';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage(base64String);
        setIsCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    const context = {
      season: weather?.season || getSeason(),
      time: new Date().toLocaleTimeString(),
      location: weather ? `${weather.city} (${weather.temp}°C)` : location,
      userDosha: user.dosha
    };
    const res = await analyzeFoodImage(image, mimeType, context);
    setAnalysis(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Live Food Integrity Scanner</h2>
        <p className="text-slate-500 mt-2">Scan your meal in real-time for an instant Ayurvedic health audit.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl h-80 flex flex-col items-center justify-center overflow-hidden relative group shadow-inner">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : image ? (
              <img src={`data:${mimeType};base64,${image}`} className="w-full h-full object-cover" alt="Food preview" />
            ) : (
              <div className="text-center p-6">
                <span className="text-6xl mb-4 block">📸</span>
                <p className="text-slate-400 font-medium">Camera preview inactive</p>
                <button
                  onClick={startCamera}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  Enable Camera
                </button>
              </div>
            )}

            {isCameraActive && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white border-4 border-emerald-500 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute top-4 right-4 w-10 h-10 opacity-0 cursor-pointer z-20"
              title="Upload from gallery"
            />
            {!isCameraActive && !image && (
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-none border border-white/30">
                📁
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Weather & Season</p>
              <p className="font-bold text-emerald-900">{weather ? `${weather.temp}°C - ${weather.season}` : getSeason()}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">City</p>
              <p className="font-bold text-emerald-900 truncate">{weather?.city || 'Detecting...'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            {image && (
              <button
                onClick={startCamera}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all"
              >
                Retake
              </button>
            )}
            <button
              onClick={runAnalysis}
              disabled={!image || loading}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all"
            >
              {loading ? 'Analyzing Ingredients...' : 'Scan Meal Integrity'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {analysis ? (
            <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-xl prose prose-slate max-h-[500px] overflow-y-auto">
              <h3 className="text-emerald-800 font-bold text-xl mb-4 flex items-center gap-2 sticky top-0 bg-white py-2">
                <span>🛡️</span> Analysis Report
              </h3>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-center">
              <span className="text-6xl mb-6">🥗</span>
              <p className="text-lg font-medium">Capture your meal to see how it aligns with your Dosha and the current environment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;
