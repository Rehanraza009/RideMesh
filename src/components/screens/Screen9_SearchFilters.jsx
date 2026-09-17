import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { Wind, Music, CigaretteOff, UserCheck, RotateCcw } from 'lucide-react';

export const Screen9_SearchFilters = () => {
  const { filters, setFilters, goToScreen } = useRideMesh();

  const resetFilters = () => {
    setFilters({
      maxDetour: 5,
      maxWalking: 1,
      timePreference: 30,
      acRequired: true,
      musicAllowed: true,
      noSmoking: true,
      femaleDriverPreferred: false
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', justifyContent: 'space-between' }}>
      <div>
        <AndroidStatusBar />
        <ScreenHeader
          title="Search Filters"
          showBack={true}
          onBack={() => goToScreen(8)}
          rightAction={
            <button
              onClick={resetFilters}
              style={{ background: 'none', border: 'none', color: 'var(--rm-text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', cursor: 'pointer' }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          }
        />

        <div style={{ padding: '16px 20px 0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Max Detour Slider */}
          <div className="rm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                Max Detour
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-primary)' }}>
                {filters.maxDetour} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={filters.maxDetour}
              onChange={e => setFilters({ ...filters, maxDetour: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--rm-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--rm-text-muted)', marginTop: 4 }}>
              <span>1 km</span>
              <span>15 km</span>
            </div>
          </div>

          {/* Max Walking Distance Slider */}
          <div className="rm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                Max Walking Distance
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-primary)' }}>
                {filters.maxWalking} km
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.2"
              value={filters.maxWalking}
              onChange={e => setFilters({ ...filters, maxWalking: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--rm-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--rm-text-muted)', marginTop: 4 }}>
              <span>200 m</span>
              <span>3 km</span>
            </div>
          </div>

          {/* Time Preference Selector */}
          <div className="rm-card">
            <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)', display: 'block', marginBottom: 12 }}>
              Time Flexibility Window
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              {[15, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => setFilters({ ...filters, timePreference: mins })}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 12,
                    background: filters.timePreference === mins ? 'var(--rm-primary)' : 'var(--rm-surface-subtle)',
                    color: filters.timePreference === mins ? 'white' : 'var(--rm-text-secondary)',
                    border: '1px solid var(--rm-border)',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ± {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Ride Preference Toggles */}
          <div className="rm-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
              Preferences
            </span>

            {[
              { id: 'acRequired', label: 'AC Required', icon: <Wind size={16} />, state: filters.acRequired },
              { id: 'musicAllowed', label: 'Music Allowed', icon: <Music size={16} />, state: filters.musicAllowed },
              { id: 'noSmoking', label: 'No Smoking', icon: <CigaretteOff size={16} />, state: filters.noSmoking },
              { id: 'femaleDriverPreferred', label: 'Female Driver Preferred', icon: <UserCheck size={16} />, state: filters.femaleDriverPreferred }
            ].map(pref => (
              <div key={pref.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ color: 'var(--rm-primary)' }}>{pref.icon}</div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--rm-text-primary)' }}>{pref.label}</span>
                </div>
                {/* Switch Component */}
                <div
                  onClick={() => setFilters({ ...filters, [pref.id]: !filters[pref.id] })}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: pref.state ? 'var(--rm-primary)' : 'var(--rm-border)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'white',
                      position: 'absolute',
                      top: 3,
                      left: pref.state ? 23 : 3,
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons: Reset / Apply Filters */}
      <div style={{ padding: '20px', display: 'flex', gap: 12, borderTop: '1px solid var(--rm-border-subtle)' }}>
        <button
          className="rm-btn rm-btn-secondary"
          onClick={() => goToScreen(8)}
          style={{ flex: 1 }}
        >
          Cancel
        </button>
        <button
          className="rm-btn rm-btn-primary"
          onClick={() => goToScreen(10)}
          style={{ flex: 2 }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
