// ==============================================================================
// ANDROID BOTTOM NAVIGATION (MODE-AWARE 5-TAB NAVIGATION)
// Dynamic tabs depending on activeMode:
// Passenger: Home (8) | Rides (21) | Map (25) | Activity (24) | Profile (26)
// Driver   : Home (22) | My Rides (21) | Map (25) | Earnings (25) | Profile (26)
// ==============================================================================
import React from 'react';
import { Home, Compass, MapPin, Activity, User, TrendingUp, Calendar, Car } from 'lucide-react';
import { useRideMesh } from '../../context/RideMeshContext';

export const AndroidBottomNav = () => {
  const { activeMode, goToScreen, currentScreen } = useRideMesh();

  // Driver Tabs
  if (activeMode === 'driver') {
    const isHome = currentScreen === 22;
    const isRides = currentScreen === 21 || currentScreen === 23;
    const isMap = currentScreen === 12;
    const isEarnings = currentScreen === 25;
    const isProfile = currentScreen === 26 || currentScreen === 27;

    return (
      <nav className="rm-bottom-nav" aria-label="Driver Navigation">
        {/* 1. Home */}
        <button
          className={`rm-nav-item ${isHome ? 'active' : ''}`}
          onClick={() => goToScreen(22)}
          aria-label="Home"
        >
          <div className="rm-nav-icon-wrap">
            <Home size={20} strokeWidth={isHome ? 2.4 : 1.8} />
          </div>
          <span>Home</span>
          {isHome && <div className="rm-nav-dot" />}
        </button>

        {/* 2. My Rides / Offer */}
        <button
          className={`rm-nav-item ${isRides ? 'active' : ''}`}
          onClick={() => goToScreen(21)}
          aria-label="My Rides"
        >
          <div className="rm-nav-icon-wrap">
            <Car size={20} strokeWidth={isRides ? 2.4 : 1.8} />
          </div>
          <span>My Rides</span>
          {isRides && <div className="rm-nav-dot" />}
        </button>

        {/* 3. Map */}
        <button
          className={`rm-nav-item ${isMap ? 'active' : ''}`}
          onClick={() => goToScreen(12)}
          aria-label="Map"
        >
          <div className="rm-nav-icon-wrap">
            <MapPin size={20} strokeWidth={isMap ? 2.4 : 1.8} />
          </div>
          <span>Map</span>
          {isMap && <div className="rm-nav-dot" />}
        </button>

        {/* 4. Earnings */}
        <button
          className={`rm-nav-item ${isEarnings ? 'active' : ''}`}
          onClick={() => goToScreen(25)}
          aria-label="Earnings"
        >
          <div className="rm-nav-icon-wrap">
            <TrendingUp size={20} strokeWidth={isEarnings ? 2.4 : 1.8} />
          </div>
          <span>Earnings</span>
          {isEarnings && <div className="rm-nav-dot" />}
        </button>

        {/* 5. Profile */}
        <button
          className={`rm-nav-item ${isProfile ? 'active' : ''}`}
          onClick={() => goToScreen(26)}
          aria-label="Profile"
        >
          <div className="rm-nav-icon-wrap">
            <User size={20} strokeWidth={isProfile ? 2.4 : 1.8} />
          </div>
          <span>Profile</span>
          {isProfile && <div className="rm-nav-dot" />}
        </button>
      </nav>
    );
  }

  // Default: Passenger Mode Tabs
  const isHome = currentScreen === 8;
  const isRides = currentScreen === 21;
  const isMap = currentScreen === 12;
  const isActivity = currentScreen === 24;
  const isProfile = currentScreen === 26 || currentScreen === 27;

  return (
    <nav className="rm-bottom-nav" aria-label="Passenger Navigation">
      {/* 1. Home */}
      <button
        className={`rm-nav-item ${isHome ? 'active' : ''}`}
        onClick={() => goToScreen(8)}
        aria-label="Home"
      >
        <div className="rm-nav-icon-wrap">
          <Home size={20} strokeWidth={isHome ? 2.4 : 1.8} />
        </div>
        <span>Home</span>
        {isHome && <div className="rm-nav-dot" />}
      </button>

      {/* 2. Rides */}
      <button
        className={`rm-nav-item ${isRides ? 'active' : ''}`}
        onClick={() => goToScreen(21)}
        aria-label="Rides"
      >
        <div className="rm-nav-icon-wrap">
          <Calendar size={20} strokeWidth={isRides ? 2.4 : 1.8} />
        </div>
        <span>Rides</span>
        {isRides && <div className="rm-nav-dot" />}
      </button>

      {/* 3. Map */}
      <button
        className={`rm-nav-item ${isMap ? 'active' : ''}`}
        onClick={() => goToScreen(12)}
        aria-label="Map"
      >
        <div className="rm-nav-icon-wrap">
          <MapPin size={20} strokeWidth={isMap ? 2.4 : 1.8} />
        </div>
        <span>Map</span>
        {isMap && <div className="rm-nav-dot" />}
      </button>

      {/* 4. Activity */}
      <button
        className={`rm-nav-item ${isActivity ? 'active' : ''}`}
        onClick={() => goToScreen(24)}
        aria-label="Activity"
      >
        <div className="rm-nav-icon-wrap">
          <Activity size={20} strokeWidth={isActivity ? 2.4 : 1.8} />
        </div>
        <span>Activity</span>
        {isActivity && <div className="rm-nav-dot" />}
      </button>

      {/* 5. Profile */}
      <button
        className={`rm-nav-item ${isProfile ? 'active' : ''}`}
        onClick={() => goToScreen(26)}
        aria-label="Profile"
      >
        <div className="rm-nav-icon-wrap">
          <User size={20} strokeWidth={isProfile ? 2.4 : 1.8} />
        </div>
        <span>Profile</span>
        {isProfile && <div className="rm-nav-dot" />}
      </button>
    </nav>
  );
};
