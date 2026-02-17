
import React, { useState, useEffect } from 'react';
import { SEASONAL_DATA } from '../constants';
import { getWeatherData, RituData } from '../services/weatherService';
import { WeatherData } from '../types';

const SeasonalAdvisory: React.FC = () => {
  const [weather, setWeather] = useState<(WeatherData & { ritu: RituData }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const data = await getWeatherData(pos.coords.latitude, pos.coords.longitude);
          setWeather(data);
        } catch (err) {
          console.error("Weather Error", err);
        } finally {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const currentRitu = weather?.ritu || {
    season: 'Summer',
    dominantDosha: 'Pitta',
    avoidProperty: 'Heating',
    message: 'Maintaining balance. Stay hydrated and use cooling properties.',
    icon: '☀️'
  };

  const protocol = SEASONAL_DATA[currentRitu.season];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-[#739072] border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing with Cosmos...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight italic">Ritucharya Guide</h2>
        <p className="text-slate-400 font-bold text-[10px] md:text-lg uppercase tracking-[0.2em] mt-2 px-6 md:px-0 leading-relaxed">
          Synchronizing your biology with the Earth's seasonal cycles.
        </p>
      </header>

      {/* Mobile-First Protocol Card */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-[#739072]/10 shadow-2xl shadow-emerald-900/5 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-100 via-[#739072] to-emerald-100" />

        {/* Large Centered Icon */}
        <div className="w-32 h-32 md:w-48 md:h-48 bg-emerald-50 rounded-full flex items-center justify-center text-6xl md:text-8xl shadow-inner mb-6 animate-slide-up">
          {currentRitu.icon}
        </div>

        <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter italic mb-2">
          {currentRitu.season}
        </h1>

        {/* Dosha Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#739072] text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-xl shadow-emerald-200">
          Dominant Force: {currentRitu.dominantDosha}
        </div>

        <div className="w-full grid md:grid-cols-2 gap-10 text-left">
          {/* Recommendations Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Recommended Elements</h4>
            <div className="flex flex-wrap gap-3">
              {protocol.recommendations.map((item, i) => (
                <div key={i} className="px-5 py-3 bg-emerald-50 text-[#739072] border border-emerald-100 rounded-2xl text-xs md:text-sm font-black tracking-tight flex items-center gap-2 shadow-sm">
                  <span>✨</span> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Avoidance Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-rose-300 uppercase tracking-widest px-2">Avoid (Excessive Risk)</h4>
            <div className="flex flex-wrap gap-3">
              {protocol.avoid_properties.map((item, i) => (
                <div key={i} className="px-5 py-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl text-xs md:text-sm font-black tracking-tight shadow-sm">
                  🚫 {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Advisory Box */}
        <div className="mt-12 w-full p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full -mr-16 -mt-16 blur-3xl opacity-20" />
          <div className="relative z-10 text-left">
            <h3 className="text-xl font-black mb-3 italic tracking-tight flex items-center gap-3">
              <span className="text-emerald-400">🛡️</span> Sanctuary Warning
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              {currentRitu.message} {weather ? `Detected ${weather.temp}°C climate in ${weather.city}.` : ''}
            </p>
            <div className="mt-6 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400 text-center">
              Climate Status: Harmonized
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalAdvisory;
