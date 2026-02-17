
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InteractionChecker from './components/InteractionChecker';
import SeasonalAdvisory from './components/SeasonalAdvisory';
import HerbExplorer from './components/HerbExplorer';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import FoodAnalyzer from './components/FoodAnalyzer';
import LandingPage from './components/LandingPage';
import CreateProfile from './components/CreateProfile';
import { User } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (userData: User) => {
    console.log("App: handleLogin called with user:", userData.email);
    setUser(userData);
    setActiveTab('dashboard');
    setIsRegistering(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  if (!user) {
    if (isRegistering) {
      return (
        <CreateProfile
          onProfileCreated={handleLogin}
          onSwitchToLogin={() => {
            console.log("App: Redirecting from Register to Login...");
            setIsRegistering(false);
          }}
        />
      );
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} user={user} />;
      case 'checker':
        return <InteractionChecker user={user} onUpdate={handleUpdateUser} />;
      case 'food':
        return <FoodAnalyzer user={user} />;
      case 'advisory':
        return <SeasonalAdvisory />;
      case 'explorer':
        return <HerbExplorer />;
      case 'profile':
        return <UserProfile user={user} onLogout={handleLogout} onUpdate={handleUpdateUser} />;
      default:
        return <Dashboard onNavigate={setActiveTab} user={user} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
      {renderContent()}
    </Layout>
  );
};

export default App;
