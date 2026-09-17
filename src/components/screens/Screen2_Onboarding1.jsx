// ==============================================================================
// SCREEN 2: RIDEMESH ONBOARDING 1 - "People Going Your Way"
// Matches reference mockup: Commuters Visual + Elongated Dot + Circular Next
// ==============================================================================
import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ArrowRight } from 'lucide-react';

export const Screen2_Onboarding1 = () => {
  const { goToScreen } = useRideMesh();

  const handleSkip = () => {
    localStorage.setItem('ridemesh_onboarded', 'true');
    goToScreen(5); // Go directly to Login
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <AndroidStatusBar />

      {/* Top Bar with Skip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '10px 24px 0 24px'
        }}
      >
        <button
          onClick={handleSkip}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: '0.92rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          Skip
        </button>
      </div>

      {/* Title & Subtitle */}
      <div
        style={{
          textAlign: 'center',
          padding: '12px 24px 0 24px'
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--rm-font-display)',
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: 8,
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          People Going<br />Your Way
        </h2>
        <p
          style={{
            fontSize: '0.92rem',
            color: '#64748B',
            lineHeight: 1.45,
            maxWidth: 280,
            margin: '0 auto'
          }}
        >
          Share rides, save money and make a greener planet.
        </p>
      </div>

      {/* Center Commuters Visual */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 20px',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 320,
            height: '100%',
            maxHeight: 330,
            borderRadius: 28,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <img
            src="/assets/images/onboarding_commuters.jpg"
            alt="People Going Your Way"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>

      {/* Bottom Pagination & Circular Next Button */}
      <div
        style={{
          padding: '0 24px 28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}
      >
        {/* 3 Pagination Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 22,
              height: 7,
              borderRadius: 4,
              background: '#059669',
              transition: 'all 0.3s ease'
            }}
          />
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#CBD5E1'
            }}
          />
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#CBD5E1'
            }}
          />
        </div>

        {/* Circular Next Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => goToScreen(3)}
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 10px 22px rgba(5, 150, 105, 0.35)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            aria-label="Next"
          >
            <ArrowRight size={24} strokeWidth={2.5} />
          </button>
          <span style={{ fontSize: '0.84rem', fontWeight: '600', color: '#475569' }}>Next</span>
        </div>
      </div>
    </div>
  );
};
