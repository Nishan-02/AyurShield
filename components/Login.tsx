
import React, { useState } from 'react';
import { User } from '../types';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log("Submit triggered. Email:", email);

    try {
      // 1. Sign in with Firebase Auth
      console.log("Firebase Auth: Attempting sign-in...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase Auth: Success! UID:", user.uid);

      let finalUserData: User | null = null;

      console.log("Firestore: Fetching profile...");
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Firestore timeout")), 3000)
        );

        const docSnap = await Promise.race([
          getDoc(doc(db, "users", user.uid)),
          timeoutPromise
        ]) as any;

        if (docSnap && docSnap.exists()) {
          finalUserData = docSnap.data() as User;
          console.log("Firestore: Profile fetched successfully.");
        } else {
          console.warn("Firestore: No profile found for this UID.");
        }
      } catch (fsErr) {
        console.error("Firestore: Fetch failed or timed out:", fsErr);
      }

      if (!finalUserData) {
        console.log("Login: Using fallback user data.");
        finalUserData = {
          id: user.uid,
          name: user.displayName || email.split('@')[0],
          email: user.email || email,
          dosha: 'Vata',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          medications: [],
          reports: [],
          dob: '2000-01-01',
          age: 24,
          phone: '',
          weight: 70,
          height: 170,
          bloodGroup: 'O+',
          gender: 'Unspecified'
        };
      }

      console.log("Login: Finalizing success state...");
      setSuccess(true);
      setLoading(false);

      console.log("Login: Calling onLogin redirect callback...");
      onLogin(finalUserData);

    } catch (err: any) {
      console.error("Login: Fatal Error:", err);
      setLoading(false);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Invalid sanctuary credentials. Please check your credentials.");
      } else {
        setError(err.message || "Connection failure. Redirect failed.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF7] p-4 border-2 border-emerald-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-emerald-600 rounded-[1.5rem] items-center justify-center text-white text-3xl shadow-2xl shadow-emerald-200 mb-6 group hover:rotate-12 transition-transform">
            🛡️
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">AyurShield</h1>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Ancient Wisdom. Modern Protection.</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 blur-3xl opacity-50" />

          <h2 className="text-2xl font-black text-slate-800 mb-8">Welcome Back</h2>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-xs font-bold animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-xs font-bold animate-in fade-in slide-in-from-top-1 text-center">
              ✅ Access Granted! Entering Sanctuary...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Email Sanctuary</label>
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-medium text-slate-700"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Secret Key (Password)</label>
              <input
                type="password"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-medium text-slate-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full group relative bg-slate-900 text-white font-black py-5 rounded-2xl transition-all overflow-hidden shadow-2xl hover:shadow-emerald-200 mt-4 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Validating...' : success ? 'Redirecting...' : 'Unlock Dashboard'}
              </span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm font-medium text-slate-500">
              New to the sanctuary? <button onClick={onSwitchToRegister} className="text-emerald-600 font-black hover:underline underline-offset-4" disabled={loading || success}>Create Profile</button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-12 px-10 leading-relaxed">
          Your biological data is encrypted and protected by ancient ethical principles and modern standards.
        </p>
      </div>
    </div>
  );
};

export default Login;
