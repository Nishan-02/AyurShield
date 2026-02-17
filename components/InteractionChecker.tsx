
import React, { useState } from 'react';
import { MEDICINES, HERBS } from '../constants';
import { db } from '../services/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { User, InteractionStatus, InteractionResult, InteractionReport } from '../types';
import { getAIInteractionAnalysis } from '../services/geminiService';

interface InteractionCheckerProps {
  user: User;
  onUpdate: (user: User) => void;
}

const InteractionChecker: React.FC<InteractionCheckerProps> = ({ user, onUpdate }) => {
  const [selectedMedId, setSelectedMedId] = useState('');
  const [selectedHerbId, setSelectedHerbId] = useState('');
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!selectedMedId || !selectedHerbId) return;

    setLoading(true);
    const medicine = MEDICINES.find(m => m.id === selectedMedId)!;
    const herb = HERBS.find(h => h.id === selectedHerbId)!;

    let status = InteractionStatus.SAFE;
    let message = "No known primary interaction found based on current database tags.";

    const hasConflict = herb.conflicts_with_tags.some(tag => medicine.tags.includes(tag));

    if (hasConflict) {
      status = InteractionStatus.CONFLICT;
      message = herb.warning_msg;
    } else if (herb.conflicts_with_tags.length > 0) {
      status = InteractionStatus.CAUTION;
      message = "Exercise caution. While no direct tag match was found, this herb has recorded sensitivities.";
    }

    try {
      const aiAnalysis = await getAIInteractionAnalysis(medicine.name, herb.name, status);

      const newResult: InteractionResult = {
        status,
        message,
        details: aiAnalysis
      };

      setResult(newResult);

      const newReport: InteractionReport = {
        id: Date.now().toString(),
        label: `${medicine.name} + ${herb.name}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: status,
        details: aiAnalysis
      };

      await updateDoc(doc(db, "users", user.id), {
        reports: arrayUnion(newReport)
      });

      onUpdate({
        ...user,
        reports: [...user.reports, newReport]
      });

    } catch (err) {
      console.error("Interaction analysis/save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: InteractionStatus) => {
    switch (status) {
      case InteractionStatus.SAFE: return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case InteractionStatus.CAUTION: return 'bg-amber-50 text-amber-800 border-amber-100';
      case InteractionStatus.CONFLICT: return 'bg-rose-50 text-rose-800 border-rose-100';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Safety Audit</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Clinical Interaction Analyzer</p>
      </header>

      <div className="flex flex-col gap-6">
        {/* Input Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-[#739072]/5 border border-[#739072]/10 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-3">Modern Pharmaceutical</label>
              <select
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#739072]/20 focus:outline-none transition-all font-bold text-slate-700 appearance-none shadow-sm"
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
                disabled={loading}
              >
                <option value="">Select medicine...</option>
                {MEDICINES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-3">Ayurvedic Biological</label>
              <select
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#739072]/20 focus:outline-none transition-all font-bold text-slate-700 appearance-none shadow-sm"
                value={selectedHerbId}
                onChange={(e) => setSelectedHerbId(e.target.value)}
                disabled={loading}
              >
                <option value="">Select herb...</option>
                {HERBS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={!selectedMedId || !selectedHerbId || loading}
            className="mobile-btn bg-[#739072] text-white shadow-xl shadow-[#739072]/20 disabled:opacity-40 tap-active"
          >
            {loading ? 'Consulting Gemini...' : 'Analyze Safety ⚡'}
          </button>
        </div>

        {/* Result Area */}
        <div className="space-y-4">
          {result ? (
            <div className={`p-10 rounded-[2.5rem] border-2 transition-all ${getStatusColor(result.status)} shadow-2xl animate-slide-up relative overflow-hidden text-center`}>
              <div className="flex flex-col items-center gap-4 mb-6">
                <span className="text-4xl">{result.status === InteractionStatus.SAFE ? '🟢' : result.status === InteractionStatus.CAUTION ? '🟡' : '🔴'}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Safety Audit Status</span>
              </div>

              <h3 className="text-2xl font-black mb-6 tracking-tight italic leading-tight">{result.message}</h3>

              <div className="mt-8 pt-8 border-t border-black/5 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-[10px] text-white">𝝙</div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">AI Clinical Analysis</p>
                </div>
                <p className="italic leading-relaxed text-sm font-medium opacity-80">"{result.details}"</p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-[#739072] uppercase tracking-widest">
                <span>✓</span> Persistent Cloud Record Created
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center p-8 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300 text-center">
              <span className="text-6xl mb-6 opacity-40">🔬</span>
              <p className="font-black text-[10px] uppercase tracking-widest leading-relaxed">
                Analyze drug combinations<br />for clinical safety.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 flex items-start gap-5">
        <span className="text-2xl mt-1">🩺</span>
        <div>
          <h4 className="font-black text-emerald-800 text-[10px] uppercase tracking-widest mb-1">Clinic Disclaimer</h4>
          <p className="text-emerald-700/80 text-xs font-medium leading-relaxed">
            Safety analysis is based on established interaction tags. Always consult your primary physician before protocol changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractionChecker;
