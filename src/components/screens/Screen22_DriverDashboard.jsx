// ==============================================================================
// SCREEN 22: DRIVER HOME (MAP-FIRST DRIVER DASHBOARD)
// Meets Section 14 & 24 requirements:
// - Map-first layout + Header: Good morning, [Name] 👋
// - Mode switcher pill (for Both accounts: Driver Mode ↔ Passenger Mode)
// - Map: Current driver location, Driver route, Nearby potential passengers (GoogleMapView)
// - Bottom sheet logic:
//   * If confirmed ride exists:
//     "Your next ride", Greater Noida → Delhi, 09:00 AM, 3/4 seats, ₹420
//     Primary CTA: "Start Ride"
//     Tapping "Start Ride" opens confirmation dialog: "Start this ride? [Cancel] [Start Ride]"
//     Only after Confirm does it begin active tracking (Screen 15).
//   * If NO ride exists:
//     Show "No active ride", Button: "+ Create a Ride" (navigates to Screen 23).
//     DO NOT show "Start Ride" when there is no active ride.
// - AI passenger matches strip (Screen 14)
// - Universal 5-Tab Driver Navigation
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { AndroidBottomNav } from '../common/AndroidBottomNav';
import { GoogleMapView } from '../common/GoogleMapView';
import {
  Bell,
  Navigation,
  Users,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Repeat,
  ShieldCheck,
  MapPin,
  Clock,
  Car,
  AlertCircle,
  Play
} from 'lucide-react';

export const Screen22_DriverDashboard = () => {
  const {
    driverData,
    user,
    role,
    activeMode,
    toggleActiveMode,
    goToScreen,
    setIsNotificationOpen,
    hasActiveRide,
    setHasActiveRide,
    confirmedRide,
    deviceLocation
  } = useRideMesh();

  const [showStartConfirm, setShowStartConfirm] = useState(false);

  const driverName = user?.name ? (user.name.split(' ')[1] || user.name.split(' ')[0]) : 'Rahul';
  const displayAvatar = user?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150';

  const handleStartRideConfirmed = () => {
    setShowStartConfirm(false);
    goToScreen(15); // Screen 15: Active Tracking
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--rm-bg)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <AndroidStatusBar />

      {/* Floating Top Header Over Map */}
      <div
        style={{
          position: 'absolute',
          top: 38,
          left: 16,
          right: 16,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          padding: '10px 14px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => goToScreen(26)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              border: '2px solid #059669',
              padding: 0,
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'none'
            }}
            aria-label="Driver Profile"
          >
            <img
              src={displayAvatar}
              alt="Driver"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--rm-text-muted)', fontWeight: '700', letterSpacing: '0.04em' }}>
              DRIVER MODE
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
              Good morning, {driverName} 👋
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Mode Switcher Pill if User has 'Both' Role (Section 13 & 36) */}
          {role === 'both' && (
            <button
              onClick={toggleActiveMode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 20,
                padding: '6px 12px',
                color: '#059669',
                fontSize: '0.74rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              title="Switch to Passenger Mode"
            >
              <Repeat size={13} />
              <span>Driver</span>
            </button>
          )}

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'var(--rm-surface)',
              border: '1px solid var(--rm-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--rm-text-secondary)',
              cursor: 'pointer',
              position: 'relative'
            }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', position: 'absolute', top: 9, right: 9 }} />
          </button>
        </div>
      </div>

      {/* Dominant Interactive Google Map Area */}
      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
        <GoogleMapView
          mode="home-driver"
          center={deviceLocation?.latitude ? { lat: deviceLocation.latitude, lng: deviceLocation.longitude } : undefined}
          height="100%"
        />

        {/* Floating Quick Action: Offer / Create Ride */}
        <button
          onClick={() => goToScreen(23)}
          style={{
            position: 'absolute',
            top: 104,
            right: 16,
            zIndex: 20,
            background: '#FFFFFF',
            border: '1.5px solid #10B981',
            borderRadius: 24,
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#059669',
            fontSize: '0.78rem',
            fontWeight: '800',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={16} />
          <span>+ Create Ride</span>
        </button>
      </div>

      {/* Driver Bottom Sheet (Section 14) */}
      <div
        style={{
          background: 'var(--rm-surface)',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.1)',
          padding: '16px 20px 14px 20px',
          zIndex: 25,
          borderTop: '1px solid var(--rm-border)'
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--rm-border)', margin: '0 auto 12px auto' }} />

        {/* CONDITION: Actual confirmed ride exists vs No active ride */}
        {hasActiveRide ? (
          /* STATE A: Confirmed Ride Exists -> Show "Your next ride" & "Start Ride" with confirmation */
          <div
            className="rm-card rm-card-highlight"
            style={{ padding: '16px', marginBottom: 12, border: '1.5px solid #059669' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Your Next Ride
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                {confirmedRide?.time || '09:00 AM'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.05rem', fontWeight: '800', color: 'var(--rm-text-primary)', marginBottom: 10 }}>
              <Navigation size={17} color="#059669" />
              <span>{confirmedRide?.from || 'Greater Noida'} → {confirmedRide?.to || 'Delhi'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--rm-text-secondary)', marginBottom: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={15} color="#059669" />
                <strong>{confirmedRide?.seats || '3 / 4 seats filled'}</strong>
              </span>
              <span>
                Contribution: <strong style={{ color: '#059669', fontSize: '1.05rem' }}>₹{confirmedRide?.price || 420}</strong>
              </span>
            </div>

            {/* Primary Action Button: Start Ride (opens confirmation modal) */}
            <button
              className="rm-btn rm-btn-primary"
              onClick={() => setShowStartConfirm(true)}
              style={{ height: 46, fontSize: '0.96rem', fontWeight: '800' }}
            >
              <Play size={17} fill="currentColor" />
              <span>Start Ride</span>
            </button>
          </div>
        ) : (
          /* STATE B: No active ride -> Show "No active ride" & "+ Create a Ride" (Section 14) */
          <div
            style={{
              padding: '18px 16px',
              borderRadius: 18,
              background: '#F8FAFC',
              border: '1.5px dashed #CBD5E1',
              marginBottom: 12,
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#E2E8F0',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto'
              }}
            >
              <Car size={22} />
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>
              No active ride
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 14px 0' }}>
              You don't have any scheduled rides right now. Create a ride to connect with commuters.
            </p>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="rm-btn rm-btn-primary"
                onClick={() => goToScreen(23)} // Screen 23: Create Ride
                style={{ flex: 1, height: 42, fontSize: '0.88rem', fontWeight: '800' }}
              >
                <PlusCircle size={16} />
                <span>Create a Ride</span>
              </button>

              {/* Developer / Demo Quick Option to Simulate a Scheduled Ride */}
              <button
                type="button"
                onClick={() => setHasActiveRide(true)}
                style={{
                  padding: '0 12px',
                  borderRadius: 12,
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: '#475569',
                  cursor: 'pointer'
                }}
                title="Demo: Load Sample Ride"
              >
                Sample Ride
              </button>
            </div>
          </div>
        )}

        {/* AI Passenger Match Suggestion Strip */}
        <div
          onClick={() => goToScreen(14)} // Screen 14: Driver Passenger Matches
          style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
            border: '1px solid #A7F3D0',
            borderRadius: 14,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#064E3B' }}>
                AI Commuter Suggestion
              </div>
              <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                5 passengers are travelling near your route.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669', fontSize: '0.76rem', fontWeight: '700' }}>
            <span>View</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* START RIDE CONFIRMATION MODAL (Section 24) */}
      {showStartConfirm && (
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
          onClick={() => setShowStartConfirm(false)}
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
              <Navigation size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: 6 }}>
              Start this ride?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.45, marginBottom: 20 }}>
              Live GPS tracking and route guidance will begin. Your passengers will be notified that you are en route.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => setShowStartConfirm(false)}
                style={{ flex: 1, height: 46, fontSize: '0.9rem', fontWeight: '700' }}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={handleStartRideConfirmed}
                style={{ flex: 1.4, height: 46, fontSize: '0.94rem', fontWeight: '800' }}
              >
                Start Ride
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Bottom Navigation */}
      <AndroidBottomNav />
    </div>
  );
};
