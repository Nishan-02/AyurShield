
import React, { useState } from 'react';
import { HERBS, MEDICINES } from '../constants';
import { Herb } from '../types';

const HerbExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);

  const filteredHerbs = HERBS.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (h.sanskrit_name && h.sanskrit_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Materia Medica</h2>
          <p className="text-slate-500 mt-1">Explore the Ayurvedic profile and safety guidelines of major herbs.</p>
        </div>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search name or Sanskrit..." 
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-64 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHerbs.map(herb => (
          <div 
            key={herb.id} 
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
            onClick={() => setSelectedHerb(herb)}
          >
            <div className="h-48 overflow-hidden relative bg-slate-100">
              {herb.image ? (
                <img src={herb.image} alt={herb.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl">🌿</div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm border border-white/50">
                {herb.property}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800">{herb.name}</h3>
              {herb.sanskrit_name && <p className="text-emerald-600 text-xs font-bold italic mb-3">{herb.sanskrit_name}</p>}
              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                {herb.warning_msg !== "None. Tulsi is generally safe." ? herb.warning_msg : "A highly versatile and safe herb used for general well-being and respiratory health."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedHerb && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedHerb(null)}>
          <div 
            className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-72">
               {selectedHerb.image ? (
                 <img src={selectedHerb.image} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-7xl">🌿</div>
               )}
              <button 
                className="absolute top-6 right-6 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full text-white font-bold hover:bg-white/50 transition-colors"
                onClick={() => setSelectedHerb(null)}
              >
                ✕
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-4xl font-bold text-slate-900">{selectedHerb.name}</h3>
                  {selectedHerb.sanskrit_name && <p className="text-xl text-emerald-600 font-medium italic mt-1">{selectedHerb.sanskrit_name}</p>}
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest ${
                    selectedHerb.property === 'Heating' ? 'bg-orange-100 text-orange-700' :
                    selectedHerb.property === 'Cooling' ? 'bg-cyan-100 text-cyan-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedHerb.property} Property
                  </div>
              </div>

              <div className="space-y-6">
                <section className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span>⚠️</span> Clinical Advisory
                  </h4>
                  <p className="text-rose-900 font-bold text-lg leading-tight">{selectedHerb.warning_msg}</p>
                </section>

                <section className="grid md:grid-cols-2 gap-6">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Conflict Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHerb.conflicts_with_tags.length > 0 ? (
                          selectedHerb.conflicts_with_tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase">
                              {tag.replace('_', ' ')}
                            </span>
                          ))
                        ) : <span className="text-xs text-slate-400 italic">No specific tag-based conflicts.</span>}
                      </div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Seasonal Interaction</h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {selectedHerb.season_conflict.length > 0 
                          ? `Avoid or reduce usage during: ${selectedHerb.season_conflict.join(', ')}.` 
                          : "Generally suitable for all seasons under normal conditions."}
                      </p>
                   </div>
                </section>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl text-sm"
                  onClick={() => setSelectedHerb(null)}
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HerbExplorer;
