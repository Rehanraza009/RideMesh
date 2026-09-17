// ==============================================================================
// SCREEN 15: REAL-TIME ACTIVE RIDE TRACKING (GOOGLE MAPS TRACKING)
// Meets Section 23, 25, 27, 28, & 30 requirements:
// - Top: Back + Trip in Progress + SOS button (Section 28)
// - Map: GoogleMapView in 'tracking' mode with smooth vehicle progress (Section 23 & 25)
// - Bottom sheet: Driver snapshot, Rating, Vehicle, Live ETA, Remaining distance
// - Action Buttons: Chat, Call, Share, and End Ride
// - Route Deviation non-blocking alert with threshold (Section 27)
// - Ride Completion Confirmation Dialog (Section 30):
//   "End this ride? [Cancel] [End Ride]" -> Only on confirmation navigate to Ride Completed.
// ==============================================================================
import React, { useState, useEffect } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { GoogleMapView } from '../common/GoogleMapView';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Share2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  Star,
  Navigation,
  X,
  Flag
} from 'lucide-react';
import { rideService, RIDE_STATUS } from '../../services/rideService';

export const Screen15_ActiveRideTracking = () => {
  const { selectedDriver, goToScreen, role, activeMode, setHasActiveRide } = useRideMesh();
  const driver = selectedDriver || {};

  const [etaMins, setEtaMins] = useState(8);
  const [distanceKm, setDistanceKm] = useState(4.2);
  const [isDeviated, setIsDeviated] = useState(false);
  const [carProgress, setCarProgress] = useState(35);
  const [showEndRideConfirm, setShowEndRideConfirm] = useState(false);

  // Smooth live GPS telemetry countdown without whole screen reloads (Section 25)
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaMins(prev => (prev > 1 ? prev - 1 : 1));
      setDistanceKm(prev => (prev > 0.4 ? Number((prev - 0.3).toFixed(1)) : 0.4));
      setCarProgress(prev => (prev < 90 ? prev + 3 : prev));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Ride Completion Handlers (Section 30)
  const handleConfirmEndRide = async () => {
    setShowEndRideConfirm(false);
    try {
      await rideService.updateRideStatus(driver.id || 'ride_1', RIDE_STATUS.COMPLETED);
    } catch {}
    setHasActiveRide(false);
    goToScreen(19); // Screen 19: Ride Completed
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', position: 'relative', overflow: 'hidden' }}>
      <AndroidStatusBar />

      {/* Top Floating App Bar over Google Map (Section 23) */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 16,
          right: 16,
          zIndex: 35,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          borderRadius: 18,
          padding: '8px 14px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => goToScreen(activeMode === 'driver' ? 22 : 8)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'var(--rm-surface)',
              border: '1px solid var(--rm-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--rm-text-primary)'
            }}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} className="rm-pulse-anim" />
            <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
              Trip in Progress
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Test Route Deviation Toggle Button */}
          <button
            onClick={() => setIsDeviated(prev => !prev)}
            style={{
              background: isDeviated ? '#FEF2F2' : '#F8FAFC',
              border: `1px solid ${isDeviated ? '#FECACA' : '#E2E8F0'}`,
              borderRadius: 14,
              padding: '5px 8px',
              fontSize: '0.68rem',
              fontWeight: '700',
              color: isDeviated ? '#DC2626' : '#64748B',
              cursor: 'pointer'
            }}
            title="Simulate Route Deviation"
          >
            {isDeviated ? 'Normal Route' : 'Test Detour'}
          </button>

          {/* SOS Emergency Button (Section 28) */}
          <button
            onClick={() => goToScreen(17)} // Screen 17: Emergency SOS
            style={{
              background: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: 18,
              padding: '7px 14px',
              fontSize: '0.78rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(220, 38, 38, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            aria-label="Emergency SOS"
          >
            <ShieldAlert size={14} />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Non-Blocking Smart Route Deviation Alert (Section 27) */}
      {isDeviated && (
        <div
          style={{
            position: 'absolute',
            top: 96,
            left: 16,
            right: 16,
            zIndex: 35,
            background: 'rgba(254, 242, 242, 0.96)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #F87171',
            borderRadius: 16,
            padding: '12px 14px',
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={17} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#991B1B' }}>
                  ⚠️ Route Deviation Detected
                </div>
                <div style={{ fontSize: '0.74rem', color: '#B91C1C' }}>
                  Vehicle path differs from planned expressway route.
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsDeviated(false)}
              style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', padding: 2 }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
            <button
              onClick={() => goToScreen(16)} // Screen 16: Deviation details map
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 8,
                background: '#FFFFFF',
                border: '1px solid #FECACA',
                color: '#991B1B',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              View Route
            </button>
            <button
              onClick={() => alert(`Calling driver at masked number: +91 98765 12345`)}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 8,
                background: '#FFFFFF',
                border: '1px solid #FECACA',
                color: '#991B1B',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Contact Driver
            </button>
            <button
              onClick={() => goToScreen(17)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: '#DC2626',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              SOS
            </button>
          </div>
        </div>
      )}

      {/* Dominant Live Google Maps Area (Section 23 & 25) */}
      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
        <GoogleMapView
          mode="tracking"
          carProgress={carProgress}
          showDeviation={isDeviated}
          height="100%"
        />
      </div>

      {/* Trip Information Bottom Sheet */}
      <div
        style={{
          background: 'var(--rm-surface)',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.1)',
          padding: '16px 20px 20px 20px',
          zIndex: 30,
          borderTop: '1px solid var(--rm-border)'
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--rm-border)', margin: '0 auto 12px auto' }} />

        {/* Driver / Trip Snapshot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={driver.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'}
              alt={driver.driverName || 'Driver'}
              style={{ width: 48, height: 48, borderRadius: 16, objectFit: 'cover', border: '2px solid #059669' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--rm-text-primary)', margin: 0 }}>
                  {driver.driverName || 'Rahul Sharma'}
                </h3>
                <ShieldCheck size={16} color="#059669" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                <span style={{ color: '#B45309', fontWeight: '700' }}>⭐ {driver.rating || '4.8'}</span>
                <span>• {driver.vehicle || 'Hyundai Creta'}</span>
              </div>
            </div>
          </div>

          {/* Live ETA & Distance (Section 26) */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#059669', lineHeight: 1 }}>
              {etaMins} min
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)', marginTop: 3 }}>
              {distanceKm} km remaining
            </div>
          </div>
        </div>

        {/* Action Row: Chat, Call, Share, End Ride (Section 23 & 30) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <button
            onClick={() => goToScreen(18)} // Chat (Section 29)
            style={{
              padding: '10px 4px',
              borderRadius: 14,
              background: 'var(--rm-surface-subtle)',
              border: '1px solid var(--rm-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: 'var(--rm-text-primary)',
              fontSize: '0.74rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={18} color="#059669" />
            <span>Chat</span>
          </button>

          <button
            onClick={() => alert(`Calling driver at masked number: +91 98765 12345`)}
            style={{
              padding: '10px 4px',
              borderRadius: 14,
              background: 'var(--rm-surface-subtle)',
              border: '1px solid var(--rm-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: 'var(--rm-text-primary)',
              fontSize: '0.74rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Phone size={18} color="#059669" />
            <span>Call</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'RideMesh Live Trip', text: 'Track my live RideMesh commute', url: window.location.href });
              } else {
                alert('Live tracking link copied to clipboard.');
              }
            }}
            style={{
              padding: '10px 4px',
              borderRadius: 14,
              background: 'var(--rm-surface-subtle)',
              border: '1px solid var(--rm-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: 'var(--rm-text-primary)',
              fontSize: '0.74rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Share2 size={18} color="var(--rm-text-secondary)" />
            <span>Share</span>
          </button>

          {/* End Ride Button (Section 30: Requires confirmation, never auto-completes) */}
          <button
            onClick={() => setShowEndRideConfirm(true)}
            style={{
              padding: '10px 4px',
              borderRadius: 14,
              background: '#ECFDF5',
              border: '1.5px solid #A7F3D0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: '#059669',
              fontSize: '0.74rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <CheckCircle2 size={18} color="#059669" />
            <span>End Ride</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog: "End this ride? [Cancel] [End Ride]" (Section 30) */}
      {showEndRideConfirm && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 100
          }}
          onClick={() => setShowEndRideConfirm(false)}
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '26px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
                border: '2px solid #A7F3D0'
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: 6 }}>
              End this ride?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.45, marginBottom: 20 }}>
              Confirm trip completion to finalize passenger fare contribution and display environmental savings.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => setShowEndRideConfirm(false)}
                style={{ flex: 1, height: 46, fontSize: '0.9rem', fontWeight: '700' }}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={handleConfirmEndRide}
                style={{ flex: 1.4, height: 46, fontSize: '0.94rem', fontWeight: '800' }}
              >
                End Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
