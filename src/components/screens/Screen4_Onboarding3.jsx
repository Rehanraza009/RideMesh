// ==============================================================================
// SCREEN 4: RIDEMESH ONBOARDING 3 - "Track, Travel and Feel Safe"
// Matches reference mockup: Live Map Visual + Safety Chips + Full-width "Get Started →"
// ==============================================================================
import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ArrowRight, Navigation, ShieldAlert, Share2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Screen4_Onboarding3 = () => {
  const { goToScreen } = useRideMesh();

  const handleCompleteOnboarding = () => {
    localStorage.setItem('ridemesh_onboarded', 'true');
    goToScreen(5); // Transition to Login
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
          onClick={handleCompleteOnboarding}
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
          Track, Travel<br />and Feel Safe
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
          Live tracking, ETA and smart safety alerts for every journey.
        </p>
      </div>

      {/* Center Layout: Live Map Visual + Safety Chips */}
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
        {/* Isometric Live Map Mockup */}
        <div
          style={{
            flex: '1 1 52%',
            maxWidth: 190,
            height: 250,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E2E8F0',
            background: '#F8FAFC',
            position: 'relative'
          }}
        >
          <img
            src="/assets/images/onboarding_live_tracking.jpg"
            alt="Live GPS Ride Tracking"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Subtle "You're in safe hands" badge floating over map */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
              background: 'rgba(5, 150, 105, 0.92)',
              backdropFilter: 'blur(6px)',
              borderRadius: 8,
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
          >
            <CheckCircle2 size={12} color="#FFFFFF" />
            <span style={{ fontSize: '0.62rem', fontWeight: '700', color: '#FFFFFF' }}>
              You're in safe hands
            </span>
          </div>
        </div>

        {/* 4 Safety Feature Pills */}
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
              <Navigation size={16} color="#059669" />
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#064E3B' }}>
              Live Tracking
            </span>
          </div>

          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
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
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldAlert size={16} color="#DC2626" />
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#991B1B' }}>
              SOS Support
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
              <Share2 size={16} color="#059669" />
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#064E3B' }}>
              Share Location
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
              <ShieldCheck size={16} color="#059669" />
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#064E3B' }}>
              Trusted Users
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Pagination & Full-Width "Get Started →" Pill */}
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
        </div>

        {/* Full-width "Get Started →" Pill Button */}
        <button
          onClick={handleCompleteOnboarding}
          style={{
            width: '100%',
            height: 52,
            borderRadius: 26,
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: '#FFFFFF',
            fontSize: '1.02rem',
            fontWeight: '700',
            boxShadow: '0 12px 24px rgba(5, 150, 105, 0.35)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
        >
          <span>Get Started</span>
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
