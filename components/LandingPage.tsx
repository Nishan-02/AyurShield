
import React, { useState, useEffect } from 'react';
import HeroSection from './Landing/HeroSection';
import FeaturesSection from './Landing/FeaturesSection';
import SeasonalPreview from './Landing/SeasonalPreview';
import LeavesBackground from './Landing/LeavesBackground';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFCF7] text-slate-900 overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
            <LeavesBackground />

            {/* Floating Premium Nav */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 py-4 ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${scrolled ? 'bg-emerald-700' : 'bg-emerald-600'} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-colors`}>
                            🛡️
                        </div>
                        <span className="text-2xl font-serif font-black tracking-tight italic">AyurShield</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Safety', 'Intelligence', 'Community'].map((link) => (
                            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-700 transition-colors">
                                {link}
                            </a>
                        ))}
                        <button
                            onClick={onStart}
                            className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest hover:bg-emerald-800 hover:scale-105 transition-all shadow-xl shadow-slate-200"
                        >
                            ACCESS PORTAL
                        </button>
                    </div>

                    <button
                        onClick={onStart}
                        className="md:hidden w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white"
                    >
                        ⚡
                    </button>
                </div>
            </nav>

            <main className="relative z-10">
                <HeroSection onStart={onStart} />

                <div id="safety">
                    <FeaturesSection />
                </div>

                <div id="intelligence">
                    <SeasonalPreview />
                </div>

                {/* Brand Philosophy Section */}
                <section className="px-8 py-32 text-center max-w-4xl mx-auto space-y-12">
                    <span className="text-8xl">🕌</span>
                    <h2 className="text-5xl md:text-6xl font-serif text-slate-900">
                        Harmonizing Nature and <span className="text-emerald-700">Digital Health.</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        We believe health is not just the absence of disease, but the presence of harmony between your body
                        and the universe. AyurShield provides the bridge.
                    </p>
                </section>
            </main>

            <footer className="relative z-10 bg-white border-t border-slate-100 py-32 px-8 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
                    <div className="col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-700 rounded-2xl flex items-center justify-center text-white text-xl">🛡️</div>
                            <span className="text-2xl font-serif font-black italic">AyurShield</span>
                        </div>
                        <p className="text-slate-400 font-medium max-w-md">
                            A premium data-driven sanctuary protecting your nature using ancient wisdom and modern AI.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Philosophy</h4>
                        <ul className="space-y-4 text-slate-600 font-semibold">
                            <li><a href="#" className="hover:text-emerald-700">Ritucharya</a></li>
                            <li><a href="#" className="hover:text-emerald-700">Dincharya</a></li>
                            <li><a href="#" className="hover:text-emerald-700">Prakriti</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Connect</h4>
                        <ul className="space-y-4 text-slate-600 font-semibold">
                            <li><a href="#" className="hover:text-emerald-700">Practitioners</a></li>
                            <li><a href="#" className="hover:text-emerald-700">Institutions</a></li>
                            <li><a href="#" className="hover:text-emerald-700">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                    <p>© 2026 AyurShield Intelligence • All Rights Reserved</p>
                    <div className="flex gap-8">
                        <span>Privacy</span>
                        <span>Security</span>
                        <span>Terms</span>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-slate-900/90 backdrop-blur-2xl rounded-full px-8 py-4 flex items-center justify-between z-50 shadow-2xl border border-white/20">
                {['🏠', '🛡️', '🌦️', '🔍'].map(icon => (
                    <span key={icon} className="text-2xl opacity-70 hover:opacity-100 transition-opacity">{icon}</span>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
