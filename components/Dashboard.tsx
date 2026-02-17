
import React, { useState, useEffect } from 'react';
import { HERBS, MEDICINES, SEASONAL_DATA } from '../constants';
import { getWeatherData, RituData } from '../services/weatherService';
import { User, WeatherData } from '../types';

const Dashboard: React.FC<{ onNavigate: (tab: string) => void, user: User }> = ({ onNavigate, user }) => {
  const [weather, setWeather] = useState<(WeatherData & { ritu: RituData }) | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const data = await getWeatherData(pos.coords.latitude, pos.coords.longitude);
          setWeather(data);
        } catch (err) {
          console.error("Dashboard Weather Error", err);
        }
      });
    }
  }, []);

  const currentRitu = weather?.ritu || {
    season: 'Summer',
    dominantDosha: 'Pitta',
    avoidProperty: 'Heating',
    message: 'Maintaining balance. Stay hydrated and use cooling properties.',
    icon: '☀️'
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight italic">
          Salutations, <span className="text-[#739072]">{user.name.split(' ')[0]}</span>
        </h2>
        <p className="text-slate-400 font-bold text-sm md:text-xl uppercase tracking-widest px-1">Sanctuary Monitoring: Active</p>
      </header>

      {/* Stats - Horizontal Scroll on Tablet/Desktop, Grid on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Cloud Bio-Data', value: `${user.reports.length || 0} Reports`, color: 'bg-[#739072]', icon: '🧬' },
          { label: 'Active Risks', value: '0 Conflicts', color: 'bg-rose-500', icon: '🛡️' },
          { label: 'Prime Vitality', value: user.dosha, color: 'bg-amber-500', icon: '☀️' }
        ].map((stat, i) => (
          <div key={i} className="glass-card full-width-card p-6 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-black/5`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-slate-900 text-lg font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hub Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#739072]/10 shadow-xl shadow-[#739072]/5 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">AyurShield Hub</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Access core clinical tools</p>

            <div className="space-y-4">
              {[
                { id: 'advisory', label: 'Seasonal Protocol', sub: 'Live Climate Logic', icon: currentRitu.icon },
                { id: 'explorer', label: 'Materia Medica', sub: 'Biological Library', icon: '🌿' }
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(tool.id)}
                  className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-[#739072] rounded-2xl transition-all group tap-active"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">{tool.icon}</div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 group-hover:text-white transition-colors">{tool.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-white/60">{tool.sub}</p>
                    </div>
                  </div>
                  <span className="text-slate-200 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Protocol Card */}
        <div className="bg-[#739072] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-end shadow-2xl shadow-[#739072]/20 min-h-[300px]">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <span className="text-[12rem] font-bold">{currentRitu.icon}</span>
          </div>
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6 border border-white/20">
              Active Protocol: {currentRitu.season}
            </span>
            <h3 className="text-4xl font-black mb-4 tracking-tighter italic leading-none">Ritu Mode</h3>
            <p className="text-emerald-50 text-base leading-relaxed mb-8 font-medium">
              {currentRitu.message} {weather ? `Based on ${weather.temp}°C in ${weather.city}.` : ''}
            </p>
            <button
              onClick={() => onNavigate('advisory')}
              className="w-full md:w-auto bg-white text-[#739072] px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 tap-active"
            >
              Analyze Full Advisory
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Button for Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => onNavigate('checker')}
          className="mobile-btn bg-[#739072] text-white shadow-2xl shadow-emerald-200"
        >
          Initialize Safety Audit ⚡
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
