
import React, { useState, useEffect } from 'react';
import { getWeatherData, RituData } from '../../services/weatherService';
import { WeatherData } from '../../types';

const SeasonalPreview: React.FC = () => {
    const [weather, setWeather] = useState<(WeatherData & { ritu: RituData }) | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    const data = await getWeatherData(pos.coords.latitude, pos.coords.longitude);
                    setWeather(data);
                } catch (err) {
                    console.error(err);
                }
            });
        }
    }, []);

    const data = weather?.ritu || {
        season: 'Summer',
        dominantDosha: 'Pitta',
        avoidProperty: 'Heating',
        message: 'Stay cool and hydrated.',
        icon: '☀️'
    };

    return (
        <section className="px-8 py-32 relative z-10">
            <div className="max-w-4xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="text-8xl animate-bounce duration-[3000ms]">
                        {data.icon}
                    </div>
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-block px-4 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            Live Environment Sync
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif">
                            It is currently <span className="text-emerald-400">{data.season}</span> in your sanctuary.
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Dominant Dosha</p>
                                <p className="text-xl font-bold">{data.dominantDosha}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Avoid Property</p>
                                <p className="text-xl font-bold">{data.avoidProperty}</p>
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium italic">"{data.message}"</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SeasonalPreview;
