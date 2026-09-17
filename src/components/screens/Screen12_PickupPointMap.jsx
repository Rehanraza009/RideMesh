// ==============================================================================
// SCREEN 12: DYNAMIC PICKUP POINT SELECTION (MAP + BOTTOM SHEET)
// Meets Section 11 requirements:
// Full-screen map + Bottom sheet + Title: "Choose Pickup Point"
// + Recommended: 📍 Pari Chowk Metro (AI optimized, Passenger walking: 600 m, Driver detour: 0.3 km, Time saved: 6 min)
// + Alternative pickup points: Metro Station, Main Road, Mall Entrance
// + Primary CTA: Confirm Pickup (highlighted recommended point)
// ==============================================================================
import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { GoogleMapView } from '../common/GoogleMapView';
import { MapPin, Sparkles, Navigation, CheckCircle2, Footprints, Clock, ArrowRight } from 'lucide-react';

export const Screen12_PickupPointMap = () => {
  const { selectedPickup, setSelectedPickup, pickupOptions, goToScreen } = useRideMesh();

  const handleSelectPickup = (option) => {
    setSelectedPickup({
      name: option.name,
      passengerWalk: option.walk,
      driverDetour: option.detour,
      timeSaved: '6 min',
      matchScore: option.recommended ? 94 : 88
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', position: 'relative' }}>
      <AndroidStatusBar />
      <ScreenHeader
        title="Choose Pickup Point"
        showBack={true}
        onBack={() => goToScreen(10)}
      />

      {/* Map takes dominant upper space */}
      <div style={{ flex: '1 1 50%', width: '100%', minHeight: '280px', position: 'relative' }}>
        <GoogleMapView
          mode="pickup"
          selectedPickup={selectedPickup.name}
          onSelectPickup={handleSelectPickup}
          pickupPoints={[
            { name: 'Pari Chowk Metro', walk: '600 m', detour: '0.3 km', isBest: true, x: 200, y: 250 },
            { name: 'Main Road Ramp', walk: '900 m', detour: '0.5 km', x: 250, y: 210 },
            { name: 'Mall Entrance', walk: '1.2 km', detour: '0.8 km', x: 150, y: 290 }
          ]}
          height="100%"
        />
      </div>

      {/* Bottom Sheet for AI Pickup Recommendation & Alternatives */}
      <div
        style={{
          background: 'var(--rm-surface)',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.12)',
          padding: '18px 20px 24px 20px',
          zIndex: 20,
          borderTop: '1px solid var(--rm-border)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '52%',
          overflowY: 'auto'
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--rm-border)', margin: '0 auto 12px auto' }} />

        {/* AI Recommended Meeting Point Card */}
        <div
          className="rm-card rm-card-highlight"
          style={{ padding: '16px', marginBottom: 14, border: '1.5px solid #059669' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={13} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                AI Optimized Pickup
              </span>
            </div>
            <div className="rm-match-badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              Recommended
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 10px 0' }}>
            <MapPin size={18} color="#059669" />
            <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: 'var(--rm-text-primary)', margin: 0 }}>
              {selectedPickup.name || 'Pari Chowk Metro'}
            </h3>
          </div>

          {/* Metrics comparison: Walking distance, Driver detour, Time saved */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', background: '#FFFFFF', padding: '10px 8px', borderRadius: 12, border: '1px solid #A7F3D0' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)', fontWeight: '600' }}>Passenger Walk</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>{selectedPickup.passengerWalk || '600 m'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)', fontWeight: '600' }}>Driver Detour</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#059669' }}>{selectedPickup.driverDetour || '0.3 km'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)', fontWeight: '600' }}>Time Saved</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#047857' }}>{selectedPickup.timeSaved || '6 min'}</div>
            </div>
          </div>
        </div>

        {/* Alternative Pickup Options */}
        <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--rm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
          Alternative Pickup Points
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {pickupOptions.map(opt => {
            const isSelected = selectedPickup.name === opt.name;
            return (
              <div
                key={opt.name}
                onClick={() => handleSelectPickup(opt)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: isSelected ? '#ECFDF5' : 'var(--rm-surface)',
                  border: `1.5px solid ${isSelected ? '#059669' : 'var(--rm-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin size={16} color={isSelected ? '#059669' : '#64748B'} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                      {opt.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                      {opt.walk} walk • {opt.detour} driver detour
                    </div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 size={18} color="#059669" />}
              </div>
            );
          })}
        </div>

        {/* Primary Action Button: Confirm Pickup */}
        <button
          className="rm-btn rm-btn-primary"
          onClick={() => goToScreen(13)}
          style={{ height: 48, fontSize: '0.96rem', fontWeight: '800' }}
        >
          <span>Confirm Pickup</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

