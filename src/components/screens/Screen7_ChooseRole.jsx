// ==============================================================================
// SCREEN 7: ROLE SELECTION (ONE APP — TWO MODES)
// Meets Section 3 requirements:
// "How will you use RideMesh?" + 3 Large Cards:
// 🚗 Passenger ("Find and join rides")
// 🛺 Driver ("Offer rides and share your seats")
// 🔄 Both ("Ride and drive flexibly")
// Primary CTA: "Continue"
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const Screen7_ChooseRole = () => {
  const { goToScreen, role, setRole, setActiveMode } = useRideMesh();
  const [selected, setSelected] = useState(role || 'passenger');

  const roleOptions = [
    {
      id: 'passenger',
      title: 'Passenger',
      emoji: '🚗',
      desc: 'Find and join rides with verified commuters heading your way.',
      badge: 'Most Popular'
    },
    {
      id: 'driver',
      title: 'Driver',
      emoji: '🛺',
      desc: 'Offer rides, share your empty seats and split daily fuel costs.',
      badge: 'Earn Daily'
    },
    {
      id: 'both',
      title: 'Both',
      emoji: '🔄',
      desc: 'Ride and drive flexibly. Switch modes anytime from your dashboard.',
      badge: 'Full Flexibility'
    }
  ];

  const handleContinue = () => {
    setRole(selected);
    const initialMode = selected === 'driver' ? 'driver' : 'passenger';
    setActiveMode(initialMode);
    localStorage.setItem('ridemesh_role', selected);
    localStorage.setItem('ridemesh_active_mode', initialMode);
    localStorage.setItem('ridemesh_onboarded', 'true');

    if (selected === 'driver') {
      goToScreen(22); // Driver Home
    } else {
      goToScreen(8); // Passenger Home
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div>
        <AndroidStatusBar />
        <ScreenHeader title="" showBack={true} onBack={() => goToScreen(5)} />

        <div style={{ padding: '8px 24px 0 24px' }}>
          <h2
            style={{
              fontFamily: 'var(--rm-font-display)',
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: 6,
              letterSpacing: '-0.02em'
            }}
          >
            How will you use RideMesh?
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#64748B',
              lineHeight: 1.45,
              marginBottom: 24
            }}
          >
            Select your initial preference. You can easily switch between modes anytime.
          </p>

          {/* 3 Large Role Selection Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {roleOptions.map(r => {
              const isSelected = selected === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  style={{
                    padding: '18px 18px',
                    borderRadius: 22,
                    background: isSelected ? '#F0FDF4' : '#F8FAFC',
                    border: `2px solid ${isSelected ? '#059669' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 8px 24px rgba(5, 150, 105, 0.18)' : '0 2px 6px rgba(0,0,0,0.03)',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 18,
                        background: isSelected ? '#FFFFFF' : '#FFFFFF',
                        border: `1.5px solid ${isSelected ? '#A7F3D0' : '#E2E8F0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                        flexShrink: 0
                      }}
                    >
                      {r.emoji}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: '800',
                            color: isSelected ? '#064E3B' : '#0F172A',
                            margin: 0
                          }}
                        >
                          {r.title}
                        </h3>
                        <span
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: '700',
                            background: isSelected ? '#D1FAE5' : '#E2E8F0',
                            color: isSelected ? '#059669' : '#475569',
                            padding: '2px 8px',
                            borderRadius: 10
                          }}
                        >
                          {r.badge}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: '#64748B',
                          lineHeight: 1.4,
                          margin: 0,
                          maxWidth: '220px'
                        }}
                      >
                        {r.desc}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#059669' : '#CBD5E1'}`,
                      background: isSelected ? '#059669' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected && <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Continue CTA */}
      <div style={{ padding: '20px 24px 34px 24px', background: '#FFFFFF' }}>
        <button
          className="rm-btn rm-btn-primary"
          onClick={handleContinue}
          style={{
            height: 52,
            fontSize: '1.02rem',
            fontWeight: '700',
            borderRadius: 26,
            boxShadow: '0 10px 22px rgba(5, 150, 105, 0.35)'
          }}
        >
          <span>Continue</span>
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
