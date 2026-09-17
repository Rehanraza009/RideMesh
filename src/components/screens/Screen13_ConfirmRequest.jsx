// ==============================================================================
// SCREEN 13: CONFIRM RIDE REQUEST & WAITING STATE
// Meets Section 12 requirements:
// Driver: Rahul Sharma ⭐ 4.8, Hyundai Creta
// Route: Greater Noida → Noida Sector 62
// Pickup: Pari Chowk Metro, Time: 09:00 AM
// Estimated contribution: ₹82
// Primary: Send Request
// After sending: Request sent, Status: Waiting for driver confirmation...
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { MapPin, Calendar, Clock, ShieldCheck, Car, AlertCircle, Sparkles, CheckCircle2, X, ArrowRight, UserCheck } from 'lucide-react';
import { rideRequestService } from '../../services/rideRequestService';

export const Screen13_ConfirmRequest = () => {
  const { selectedDriver, selectedPickup, searchParams, user, goToScreen } = useRideMesh();
  const driver = selectedDriver || {};

  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const req = await rideRequestService.sendRequest({
        rideId: driver.id || 'ride_1',
        passengerId: user?.uid || 'passenger_default',
        passengerName: user?.name || 'Mohd Rehan',
        passengerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        driverId: driver.driverId || 'driver_default',
        driverName: driver.driverName || 'Rahul Sharma',
        pickupPoint: selectedPickup.name || 'Pari Chowk Metro',
        destination: searchParams.to || 'Noida Sector 62',
        matchScore: driver.matchScore || 94,
        routeMatch: driver.routeMatch || 96,
        timeMatch: driver.timeMatch || 92,
        detour: driver.detourKm || 0.4,
        estimatedCost: driver.cost || 82
      });

      setRequestId(req.id);
      setIsSent(true);
    } catch {
      setIsSent(true); // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (requestId) {
      await rideRequestService.cancelRequest(requestId);
    }
    setIsSent(false);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AndroidStatusBar />
        <ScreenHeader
          title={isSent ? "Ride Request Status" : "Confirm Ride Request"}
          showBack={true}
          onBack={() => goToScreen(12)}
        />

        <div style={{ padding: '16px 20px 24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isSent ? (
            /* Post-Send: Waiting for Driver Confirmation */
            <div className="rm-card rm-card-highlight" style={{ padding: '28px 20px', textAlign: 'center', border: '1.5px solid #059669' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  border: '2.5px solid #059669',
                  boxShadow: '0 8px 24px rgba(5, 150, 105, 0.2)'
                }}
                className="rm-pulse-anim"
              >
                <Clock size={36} />
              </div>

              <div className="rm-match-badge" style={{ display: 'inline-flex', marginBottom: 10 }}>
                <Sparkles size={12} />
                <span>94% Route Match</span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--rm-text-primary)', marginBottom: 4 }}>
                Request Sent!
              </h2>

              <div style={{ fontSize: '0.86rem', color: '#059669', fontWeight: '700', marginBottom: 6 }}>
                Status: Waiting for driver confirmation...
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--rm-text-secondary)', marginBottom: 20, lineHeight: 1.45 }}>
                We've notified <strong>{driver.driverName || 'Rahul Sharma'}</strong>. You'll receive instant notification as soon as your seat is confirmed.
              </p>

              {/* Trip Snapshot */}
              <div style={{ background: 'var(--rm-surface)', borderRadius: 14, padding: '14px', border: '1px solid var(--rm-border)', marginBottom: 20, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--rm-text-muted)' }}>Pickup:</span>
                  <strong style={{ color: 'var(--rm-text-primary)' }}>{selectedPickup.name || 'Pari Chowk Metro'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--rm-text-muted)' }}>Destination:</span>
                  <strong style={{ color: 'var(--rm-text-primary)' }}>{searchParams.to || 'Noida Sector 62'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--rm-text-muted)' }}>Estimated Share:</span>
                  <strong style={{ color: '#059669', fontSize: '0.95rem' }}>₹{driver.cost || 82}</strong>
                </div>
              </div>

              {/* Action Simulation: Driver Accepts (Instant Flow to Live Tracking) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="rm-btn rm-btn-primary"
                  onClick={() => goToScreen(15)} // Screen 15: Live Active Ride Tracking
                  style={{ height: 46, fontSize: '0.9rem', fontWeight: '800' }}
                >
                  <UserCheck size={18} />
                  <span>Simulate Driver Acceptance → Start Trip</span>
                </button>

                <button
                  className="rm-btn rm-btn-secondary"
                  onClick={() => goToScreen(14)} // Screen 14: Driver's incoming prompt
                  style={{ height: 44, fontSize: '0.82rem' }}
                >
                  View Driver Request Prompt (Screen 14)
                </button>
              </div>
            </div>
          ) : (
            /* Confirmation Bottom Sheet Card */
            <div className="rm-card" style={{ padding: '20px', border: '1px solid var(--rm-border)' }}>
              {/* Header Route */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--rm-border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    CARPOOL TRIP CONFIRMATION
                  </span>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: 'var(--rm-text-primary)', margin: '4px 0 0 0' }}>
                    {searchParams.from || 'Greater Noida'} → {searchParams.to || 'Noida Sector 62'}
                  </h3>
                </div>
                <div className="rm-match-badge">
                  <Sparkles size={11} />
                  <span>{driver.matchScore || 94}%</span>
                </div>
              </div>

              {/* Driver Details Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--rm-border-subtle)' }}>
                <img
                  src={driver.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'}
                  alt={driver.driverName || 'Driver'}
                  style={{ width: 48, height: 48, borderRadius: 16, objectFit: 'cover', border: '1.5px solid #059669' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                      {driver.driverName || 'Rahul Sharma'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#059669', fontSize: '0.7rem', fontWeight: '700' }}>
                      <ShieldCheck size={14} />
                      <span>Verified</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                    <span style={{ color: '#B45309', fontWeight: '700' }}>⭐ {driver.rating || '4.8'}</span>
                    <span>• {driver.vehicle || 'Hyundai Creta'}</span>
                  </div>
                </div>
              </div>

              {/* Route & Pickup Timeline */}
              <div style={{ padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px solid var(--rm-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <MapPin size={17} color="#059669" style={{ marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--rm-text-muted)', fontWeight: '700' }}>PICKUP POINT</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                      {selectedPickup.name || 'Pari Chowk Metro'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#059669' }}>
                      Departure: {driver.time || '09:00 AM'} • {selectedPickup.passengerWalk || '600 m'} walk
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <MapPin size={17} color="#DC2626" style={{ marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--rm-text-muted)', fontWeight: '700' }}>DESTINATION</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                      {searchParams.to || 'Noida Sector 62'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Split Summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)', fontWeight: '700' }}>ESTIMATED CONTRIBUTION</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-secondary)' }}>Automated fair fuel & toll split</div>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669' }}>
                  ₹{driver.cost || 82}
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Notice */}
          {!isSent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'var(--rm-surface-subtle)', borderRadius: 12, border: '1px solid var(--rm-border)' }}>
              <AlertCircle size={16} color="var(--rm-text-muted)" />
              <span style={{ fontSize: '0.76rem', color: 'var(--rm-text-secondary)' }}>
                Free cancellation up to 10 minutes before pickup departure.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer (Section 21) */}
      <div style={{ padding: '16px 20px 24px 20px', borderTop: '1px solid var(--rm-border-subtle)', background: 'var(--rm-surface)' }}>
        {isSent ? (
          <button
            className="rm-btn rm-btn-secondary"
            onClick={handleCancelRequest}
            style={{ width: '100%', height: 46, fontWeight: '700' }}
          >
            <X size={18} />
            <span>Cancel Request</span>
          </button>
        ) : (
          <button
            className="rm-btn rm-btn-primary"
            onClick={() => setShowConfirmModal(true)}
            disabled={loading}
            style={{ width: '100%', height: 48, fontSize: '0.96rem', fontWeight: '800' }}
          >
            <span>{loading ? 'Sending Request...' : 'Send Ride Request'}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>

      {/* Confirmation Dialog: "Send this request to Rahul?" (Section 21) */}
      {showConfirmModal && (
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
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                border: '2px solid #A7F3D0'
              }}
            >
              <Car size={26} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: 6 }}>
              Send this request to {driver.driverName || 'Rahul'}?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.45, marginBottom: 16 }}>
              {driver.driverName || 'Rahul'} will receive your pickup request at <strong>{selectedPickup.name || 'Pari Chowk Metro'}</strong> for ₹{driver.cost || 82}.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => setShowConfirmModal(false)}
                style={{ flex: 1, height: 46, fontSize: '0.9rem', fontWeight: '700' }}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSendRequest();
                }}
                style={{ flex: 1.4, height: 46, fontSize: '0.94rem', fontWeight: '800' }}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

