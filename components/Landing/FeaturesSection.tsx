
import React from 'react';

const FeaturesSection: React.FC = () => {
    const features = [
        {
            title: 'Drug-Herb Safety Scanner',
            desc: 'Instant toxicity & interaction checks between modern meds & herbs.',
            icon: '🛡️',
            color: 'bg-emerald-50'
        },
        {
            title: 'Seasonal Intelligence',
            desc: 'Live Ritu adaptation based on your local micro-climate data.',
            icon: '🌦️',
            color: 'bg-amber-50'
        },
        {
            title: 'Vikriti Personalization',
            desc: 'AI-driven meal & lifestyle audits tailored to your unique body type.',
            icon: '👤',
            color: 'bg-rose-50'
        }
    ];

    return (
        <section className="px-8 py-32 max-w-7xl mx-auto relative z-10">
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="group relative bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-4 transition-all duration-500"
                    >
                        <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-125 transition-transform duration-500 shadow-inner italic`}>
                            {f.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">{f.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                        <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                            Learn More <span className="text-xs">→</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
