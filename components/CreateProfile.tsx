
import React, { useState } from 'react';
import { User } from '../types';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface CreateProfileProps {
    onProfileCreated: (user: User) => void;
    onSwitchToLogin: () => void;
}

const CreateProfile: React.FC<CreateProfileProps> = ({ onProfileCreated, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [dosha, setDosha] = useState('Vata');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const age = calculateAge(dob);
        if (age < 0) {
            setError("Invalid Date of Birth");
            setLoading(false);
            return;
        }

        try {
            // 1. Create User in Firebase Auth
            console.log("Step 1: Creating Firebase Auth user...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Auth user created successfully:", user.uid);

            const newUser: User = {
                id: user.uid,
                name: name,
                email: email,
                dosha: dosha,
                dob: dob,
                age: age,
                phone: phone,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                medications: [],
                reports: [],
                weight: 70, // Default placeholders
                height: 170,
                bloodGroup: 'O+',
                gender: 'Prefer not to say'
            };

            // 2. Store Extra Details in Firestore
            console.log("Step 2: Syncing user details to Firestore...");
            setSuccess(true);

            try {
                // We await the write but with a 5s limit
                const fsWrite = setDoc(doc(db, "users", user.uid), {
                    ...newUser,
                    createdAt: serverTimestamp()
                });

                await Promise.race([
                    fsWrite,
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore sync timeout")), 5000))
                ]);
                console.log("Firestore sync completed successfully.");
            } catch (fsErr: any) {
                console.error("Firestore Sync Warning (Proceeding):", fsErr);
                // We still proceed because Auth succeeded, but user might have to fix profile later
            }

            console.log("Registration process complete. Redirecting soon...");

            // Wait for 2 seconds to show success message before redirecting
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);

        } catch (err: any) {
            console.error("Firebase Registration Error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Please sign in instead.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password is too weak. Please use at least 6 characters.");
            } else {
                setError(err.message || "Failed to create account. Please check your credentials.");
            }
        } finally {
            setLoading(false);
        }
    };

    const doshaTypes = [
        { id: 'Vata', icon: '🌬️', desc: 'Creative & Energetic' },
        { id: 'Pitta', icon: '🔥', desc: 'Powerful & Focused' },
        { id: 'Kapha', icon: '🌱', desc: 'Calm & Steady' },
        { id: 'Vata-Pitta', icon: '🌬️🔥', desc: 'Mixed' },
        { id: 'Pitta-Kapha', icon: '🔥🌱', desc: 'Mixed' },
        { id: 'Vata-Kapha', icon: '🌬️🌱', desc: 'Mixed' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 border-2 border-emerald-100">
            <div className="max-w-xl w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex w-16 h-16 bg-emerald-600 rounded-2xl items-center justify-center text-white text-3xl shadow-xl shadow-emerald-200 mb-6">
                        🛡️
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join Ayur-Shield</h1>
                    <p className="text-slate-500 mt-2 tracking-wide font-medium">Personalize your journey into ancient health science</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-emerald-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                    <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                        <span className="text-emerald-600">✦</span> Create Your Health Profile
                    </h2>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <span className="text-xl">⚠️</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-8 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-center">
                            <span className="text-xl">✅</span> Registration Successful! Redirecting to login...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-medium text-slate-700"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading || success}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-medium text-slate-700"
                                    placeholder="+91 9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={loading || success}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Date of Birth</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-medium text-slate-700 pointer-events-auto"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    disabled={loading || success}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-medium text-slate-700"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading || success}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Security Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-medium text-slate-700"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading || success}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Select Your Biological Nature (Dosha)</label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {doshaTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setDosha(type.id)}
                                        disabled={loading || success}
                                        className={`p-5 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${dosha === type.id
                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100'
                                            : 'bg-white border-slate-100 hover:border-emerald-200 text-slate-700'
                                            }`}
                                    >
                                        <span className="text-3xl mb-3 block group-hover:scale-125 transition-transform duration-500">{type.icon}</span>
                                        <p className={`font-black text-sm ${dosha === type.id ? 'text-white' : 'text-slate-800'}`}>{type.id}</p>
                                        <p className={`text-[10px] font-bold ${dosha === type.id ? 'text-emerald-100' : 'text-slate-400'}`}>{type.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full group relative bg-slate-900 text-white font-black py-5 rounded-[1.5rem] transition-all overflow-hidden shadow-2xl hover:shadow-emerald-200 mt-6 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 flex items-center justify-center gap-3 tracking-widest uppercase text-xs">
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Synchronizing Profile...
                                    </>
                                ) : success ? (
                                    'Redirecting...'
                                ) : 'Initialize My Sanctuary'}
                            </span>
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Already have a nature? <button onClick={onSwitchToLogin} className="text-emerald-600 font-black hover:underline underline-offset-4" disabled={loading || success}>Sign In Here</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProfile;
