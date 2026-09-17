import React, { useEffect } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { CheckCircle2, Leaf, Car, DollarSign, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Screen19_RideCompleted = () => {
  const { goToScreen } = useRideMesh();

  useEffect(() => {
    // Pop celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399', '#F59E0B']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', justifyContent: 'space-between' }}>
      <div>
        <AndroidStatusBar />

        <div style={{ padding: '30px 24px 0 24px', textAlign: 'center' }}>
          {/* Big Green Success Badge */}
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              border: '3px solid #10B981',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
            }}
          >
            <CheckCircle2 size={48} color="#059669" />
          </div>

          <h2 style={{ fontFamily: 'var(--rm-font-display)', fontSize: '1.75rem', fontWeight: '800', color: 'var(--rm-text-primary)', marginBottom: 4 }}>
            Ride Completed! 🎉
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--rm-text-secondary)', marginBottom: 28 }}>
            You travelled <strong style={{ color: 'var(--rm-text-primary)' }}>18.4 km</strong>
          </p>

          {/* Impact & Contribution Metrics Card */}
          <div className="rm-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Contribution */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <DollarSign size={18} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--rm-text-secondary)', fontWeight: '500' }}>Your Contribution</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--rm-primary)' }}>₹82</span>
            </div>

            <div style={{ height: 1, background: 'var(--rm-border-subtle)' }} />

            {/* CO2 Saved */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <Leaf size={18} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--rm-text-secondary)', fontWeight: '500' }}>CO₂ Saved</span>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>1.7 kg</span>
            </div>

            <div style={{ height: 1, background: 'var(--rm-border-subtle)' }} />

            {/* Vehicles Avoided */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <Car size={18} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--rm-text-secondary)', fontWeight: '500' }}>Vehicles Avoided</span>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Buttons */}
      <div style={{ padding: '24px 20px 34px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="rm-btn rm-btn-primary" onClick={() => goToScreen(20)}>
          <span>Rate Your Ride</span>
          <ArrowRight size={18} />
        </button>

        <button className="rm-btn rm-btn-ghost" onClick={() => goToScreen(8)}>
          Done
        </button>
      </div>
    </div>
  );
};
