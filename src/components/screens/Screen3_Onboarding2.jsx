// ==============================================================================
// SCREEN 3: RIDEMESH ONBOARDING 2 - "AI Finds Your Best Match"
// Matches reference mockup: 3D Phone Map Visual + 4 AI Feature Chips + Circular Next
// ==============================================================================
import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ArrowRight, Cpu, Route, Clock, Leaf } from 'lucide-react';

export const Screen3_Onboarding2 = () => {
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
          padding: '8px 24px 0 24px'
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--rm-font-display)',
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: 6,
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          AI Finds<br />Your Best Match
        </h2>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#64748B',
            lineHeight: 1.45,
            maxWidth: 300,
            margin: '0 auto'
          }}
        >
          We analyze route, time, traffic and preferences to suggest the perfect ride.
        </p>
      </div>

      {/* Center Layout: Phone Visual + 4 Feature Cards */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 16px',
          gap: 12
        }}
      >
        {/* Angled Phone Graphic */}
        <div
          style={{
            flex: '1 1 52%',
            maxWidth: 190,
            height: 250,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E2E8F0',
            background: '#F8FAFC'
          }}
        >
          <img
            src="/assets/images/onboarding_ai_map.jpg"
            alt="AI Route Matching"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* 4 AI Feature Pills */}
        <div
          style={{
            flex: '1 1 48%',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 14,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cpu size={16} color="#059669" />
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#064E3B' }}>
              Smarter Matching
            </span>
          </div>

          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 14,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Route size={16} color="#059669" />
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#064E3B' }}>
              Optimized Routes
            </span>
          </div>

          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 14,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={16} color="#059669" />
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#064E3B' }}>
              Save Time & Money
            </span>
          </div>

          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 14,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Leaf size={16} color="#059669" />
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#064E3B' }}>
              Lower Emissions
            </span>
          </div>
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
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#CBD5E1'
            }}
          />
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
        </div>

        {/* Circular Next Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => goToScreen(4)}
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
