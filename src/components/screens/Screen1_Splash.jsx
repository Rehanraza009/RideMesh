// ==============================================================================
// SCREEN 1: RIDEMESH REAL PRODUCTION SPLASH SCREEN
// Exactly matches brand guidelines and reference mockup:
// Centered Logo + Taglines + Scenic Highway + 3 Eco Badges + Progress Line
// ==============================================================================
import React, { useEffect, useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { RideMeshLogo } from '../common/RideMeshLogo';
import { Leaf, Users, Globe2 } from 'lucide-react';

export const Screen1_Splash = () => {
  const { goToScreen, role, user, authInitialized } = useRideMesh();
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Smooth progress fill
    const progressInterval = setInterval(() => {
      setProgress(p => (p < 95 ? p + 15 : 95));
    }, 200);

    // Auto navigate once initialized
    const timer = setTimeout(() => {
      const hasCompletedOnboarding = localStorage.getItem('ridemesh_onboarded') === 'true';
      const isUserAuthenticated = Boolean(user && user.uid);

      if (isUserAuthenticated) {
        goToScreen(role === 'driver' ? 22 : 8);
      } else if (hasCompletedOnboarding) {
        goToScreen(5); // Login Screen
      } else {
        goToScreen(2); // Onboarding 1
      }
    }, 2200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [goToScreen, role, user, authInitialized]);

  const handleManualSkip = () => {
    const hasCompletedOnboarding = localStorage.getItem('ridemesh_onboarded') === 'true';
    if (user && user.uid) {
      goToScreen(role === 'driver' ? 22 : 8);
    } else if (hasCompletedOnboarding) {
      goToScreen(5);
    } else {
      goToScreen(2);
    }
  };

  return (
    <div
      onClick={handleManualSkip}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: '#0B2519',
        color: '#FFFFFF',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      {/* Background Scenic Road Photo */}
      <img
        src="/assets/images/splash_scenic_road.jpg"
        alt="Ride Together"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
          zIndex: 1
        }}
      />

      {/* Subtle Top & Bottom Gradient Overlays for optimal readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(240, 253, 244, 0.96) 0%, rgba(240, 253, 244, 0.88) 28%, rgba(6, 78, 59, 0.25) 55%, rgba(6, 40, 28, 0.92) 82%, #052618 100%)',
          zIndex: 2
        }}
      />

      {/* Android System Status Bar */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <AndroidStatusBar />
      </div>

      {/* Header Brand Section */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Emblem with glow */}
        <div style={{ marginBottom: 8, filter: 'drop-shadow(0 8px 24px rgba(5, 150, 105, 0.35))' }}>
          <RideMeshLogo variant="emblem" size="lg" />
        </div>

        <h1
          style={{
            fontFamily: 'var(--rm-font-display)',
            fontSize: '2.1rem',
            fontWeight: '800',
            color: '#064E3B',
            letterSpacing: '-0.03em',
            margin: '0 0 2px 0',
            lineHeight: 1.1
          }}
        >
          RideMesh
        </h1>

        <p
          style={{
            fontSize: '0.88rem',
            fontWeight: '600',
            color: '#047857',
            letterSpacing: '-0.01em',
            margin: '0 0 14px 0'
          }}
        >
          Match Smarter. Ride Together.
        </p>

        {/* Script / Calligraphic Subtitle */}
        <div
          style={{
            fontFamily: 'cursive, var(--rm-font-sans)',
            fontStyle: 'italic',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#059669',
            letterSpacing: '0.02em',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
          }}
        >
          Same Roads.
          <br />
          <span style={{ fontSize: '1.25rem', color: '#047857' }}>A Better Tomorrow.</span>
        </div>
      </div>

      {/* Spacer to push controls to bottom */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10 }} />

      {/* Bottom Mobility Impact Section */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 20px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* 3 Eco Metric Badges in Frosted Pill */}
        <div
          style={{
            width: '100%',
            maxWidth: 340,
            background: 'rgba(11, 37, 25, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderRadius: 30,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 20,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Leaf size={16} color="#34D399" />
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#E2E8F0' }}>Less Traffic</span>
          </div>

          <div style={{ width: 1, height: 28, background: 'rgba(255, 255, 255, 0.12)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={16} color="#34D399" />
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#E2E8F0' }}>More People</span>
          </div>

          <div style={{ width: 1, height: 28, background: 'rgba(255, 255, 255, 0.12)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Globe2 size={16} color="#34D399" />
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#E2E8F0' }}>Greener Planet</span>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div
          style={{
            width: 140,
            height: 4,
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 2,
            overflow: 'hidden',
            marginBottom: 12
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
              borderRadius: 2,
              transition: 'width 0.2s ease-out'
            }}
          />
        </div>

        {/* Micro Tagline */}
        <p
          style={{
            fontSize: '0.68rem',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '0.01em',
            margin: 0
          }}
        >
          Powered by People. Driven by a Greener Tomorrow.
        </p>
      </div>
    </div>
  );
};
