
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onUpdate: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newMed, setNewMed] = useState('');
  const [showAddMed, setShowAddMed] = useState(false);

  const [editFields, setEditFields] = useState({
    weight: user.weight || 70,
    height: user.height || 170,
    bloodGroup: user.bloodGroup || 'O+',
    gender: user.gender || 'Unspecified'
  });

  const handleUpdateDosha = async (newDosha: string) => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        dosha: newDosha
      });
      onUpdate({ ...user, dosha: newDosha });
    } catch (error) {
      console.error("Error updating dosha:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateClinical = async () => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.id), editFields);
      onUpdate({ ...user, ...editFields });
    } catch (error) {
      console.error("Error updating clinical info:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.trim()) return;

    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        medications: arrayUnion(newMed.trim())
      });
      onUpdate({
        ...user,
        medications: [...user.medications, newMed.trim()]
      });
      setNewMed('');
      setShowAddMed(false);
    } catch (error) {
      console.error("Error adding medication:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveMedication = async (med: string) => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        medications: arrayRemove(med)
      });
      onUpdate({
        ...user,
        medications: user.medications.filter(m => m !== med)
      });
    } catch (error) {
      console.error("Error removing medication:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const doshaOptions = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha'];

  return (
    <div className="space-y-10 pb-24">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight italic">Sanctuary Profile</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] px-1">Your biological clinical record</p>
      </header>

      <div className="flex flex-col gap-8">
        {/* Profile Card */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-[#739072]/10 shadow-2xl shadow-[#739072]/5 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#739072]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

          <div className="w-32 h-32 bg-emerald-50 rounded-full mb-6 border-8 border-white shadow-xl overflow-hidden relative z-10">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h3>
          <p className="text-slate-400 font-bold text-sm mt-1 mb-8">{user.email}</p>

          <div className="w-full space-y-4 text-left">
            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 transition-all hover:bg-[#739072] group/dosha">
              <span className="text-[10px] font-black text-[#739072] uppercase tracking-widest mb-1 block group-hover/dosha:text-white/70">Prime Bio-Type (Dosha)</span>
              <select
                value={user.dosha}
                onChange={(e) => handleUpdateDosha(e.target.value)}
                disabled={isUpdating}
                className="w-full bg-transparent text-xl font-black text-[#739072] outline-none cursor-pointer group-hover/dosha:text-white appearance-none"
              >
                {doshaOptions.map(opt => <option key={opt} value={opt} className="text-slate-900 bg-white">{opt}</option>)}
              </select>
            </div>

            {/* Metrics */}
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Weight (kg)</label>
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 shadow-sm"
                    value={editFields.weight}
                    onChange={(e) => setEditFields({ ...editFields, weight: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Height (cm)</label>
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 shadow-sm"
                    value={editFields.height}
                    onChange={(e) => setEditFields({ ...editFields, height: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Blood Group</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 shadow-sm uppercase"
                    value={editFields.bloodGroup}
                    onChange={(e) => setEditFields({ ...editFields, bloodGroup: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Biological Sex</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 shadow-sm appearance-none"
                    value={editFields.gender}
                    onChange={(e) => setEditFields({ ...editFields, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Unspecified">Unspecified</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleUpdateClinical}
                disabled={isUpdating}
                className="mobile-btn bg-slate-900 text-white tap-active"
              >
                {isUpdating ? 'Synchronizing...' : 'Update Health Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Medications Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#739072]/10 shadow-2xl shadow-[#739072]/5">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Active Clinical Portfolio</h4>
          <div className="flex flex-col gap-4">
            {user.medications.map((med, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100">💊</div>
                  <span className="font-black text-slate-700">{med}</span>
                </div>
                <button
                  onClick={() => handleRemoveMedication(med)}
                  className="w-8 h-8 rounded-full bg-white text-rose-500 shadow-sm font-bold flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}

            {showAddMed ? (
              <form onSubmit={handleAddMedication} className="p-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-2">
                <input
                  autoFocus
                  placeholder="Drug Name"
                  className="bg-transparent flex-1 font-bold text-[#739072] outline-none px-4"
                  value={newMed}
                  onChange={(e) => setNewMed(e.target.value)}
                />
                <button type="submit" className="bg-[#739072] text-white w-12 h-12 rounded-xl font-black">✓</button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddMed(true)}
                className="mobile-btn border-4 border-dashed border-slate-100 text-slate-300 gap-3"
              >
                <span className="text-2xl">+</span> Add Medication
              </button>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="mobile-btn bg-rose-50 text-rose-600 border border-rose-100 tap-active"
        >
          Terminate Session
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
