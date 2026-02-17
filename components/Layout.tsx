
import React from 'react';
import { User } from '../types';
import AyurBot from './AyurBot';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'checker', label: 'Safety', icon: '🛡️' },
    { id: 'food', label: 'Scan', icon: '🥗' },
    { id: 'advisory', label: 'Guide', icon: '🌿' },
    { id: 'explorer', label: 'Herbs', icon: '🔍' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFCF7]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#739072]/10 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-[#739072] rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-emerald-100">
            🛡️
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">AyurShield</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-[#739072] text-white shadow-lg shadow-emerald-100'
                  : 'text-slate-500 hover:bg-slate-50 font-medium'
                }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-bold">{tab.id === 'checker' ? 'Safety Audit' : tab.label}</span>
            </button>
          ))}
        </nav>

        {user && (
          <div
            className={`mt-auto p-4 rounded-3xl border transition-all cursor-pointer group ${activeTab === 'profile' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 shadow-sm'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl bg-slate-50 p-1 group-hover:scale-110 transition-transform" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-[#739072] font-black uppercase tracking-widest">{user.dosha}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Unified Mobile Top Navigation */}
      <div className="md:hidden sticky-top-header mobile-top-nav-container">
        {/* Branding Row */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#739072] rounded-xl flex items-center justify-center text-white shadow-lg">
              🛡️
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight italic">AyurShield</h1>
              <p className="text-[8px] font-black uppercase text-[#739072] tracking-[0.2em]">Full Sanctuary Access</p>
            </div>
          </div>
          {user && (
            <button onClick={() => setActiveTab('profile')} className="w-9 h-9 rounded-full border border-[#739072]/20 p-0.5">
              <img src={user.avatar} className="w-full h-full object-cover rounded-full" />
            </button>
          )}
        </div>

        {/* Categories / Tabs Row - NOW SCROLLABLE TO COVER ALL FEATURES */}
        <nav className="mobile-nav-scroll flex px-4 pb-2 border-t border-slate-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-none pr-8 py-3 flex items-center gap-2 tap-active group"
            >
              <span className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 drop-shadow-md' : 'opacity-40 grayscale'}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${activeTab === tab.id ? 'text-[#739072]' : 'text-slate-300'
                }`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="w-1 h-1 bg-[#739072] rounded-full mt-0.5 shadow-sm" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 main-content p-5 md:p-12 overflow-x-hidden">
        <div className="max-w-5xl mx-auto animate-slide-up">
          {children}
        </div>
      </main>

      {/* Floating AyurBot */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[1001]">
        <AyurBot />
      </div>
    </div>
  );
};

export default Layout;
