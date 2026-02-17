
import React from 'react';

const HeroSection: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 z-10 overflow-hidden">
            <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50/50 backdrop-blur-sm rounded-full border border-emerald-100/50 text-emerald-800 font-bold text-xs uppercase tracking-[0.3em]">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Ancient Wisdom • Modern Protection
                </div>

                <h1 className="text-6xl md:text-8xl font-serif text-slate-900 leading-[1.1] tracking-tight">
                    Your Body Has a Nature. <br />
                    <span className="text-emerald-700 italic">We Protect It.</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    AyurShield intelligently analyzes drug-herb interactions using Ayurvedic principles,
                    seasonal intelligence, and high-precision Gemini AI.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <button
                        onClick={onStart}
                        className="group relative px-10 py-5 bg-emerald-800 text-white rounded-full font-bold text-lg overflow-hidden shadow-2xl hover:shadow-emerald-200 transition-all hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-3">
                            🌿 Check My Safety
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </button>

                    <button className="px-10 py-5 bg-white text-slate-800 rounded-full font-bold text-lg border border-slate-200 hover:border-emerald-200 transition-all hover:shadow-xl">
                        📖 Explore Ayurveda
                    </button>
                </div>
            </div>

            {/* Decorative Parallax Circles */}
            <div className="absolute -z-10 top-1/4 -left-20 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute -z-10 bottom-1/4 -right-20 w-80 h-80 bg-amber-100/30 rounded-full blur-[100px] animate-pulse delay-700" />
        </section>
    );
};

export default HeroSection;
