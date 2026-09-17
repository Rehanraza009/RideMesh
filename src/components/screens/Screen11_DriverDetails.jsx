// ==============================================================================
// SCREEN 11: COMPLETE RIDE DETAILS & DRIVER VERIFICATION
// Meets Section 13 requirements:
// Driver Profile + Verified Status + Trip Info (Pickup, Dest, Date, Time, Duration) +
// Vehicle Info (Make/Model, Color, Masked Reg 'UP16AB****') +
// Safety Badges + Actions (Request Ride, Message, Share Trip) + Confirmation Dialog
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import {
  Star,
  ShieldCheck,
  Heart,
  Car,
  Calendar,
  Clock,
  Navigation,
  MapPin,
  MessageSquare,
  Share2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export const Screen11_DriverDetails = () => {
  const { selectedDriver, searchParams, goToScreen } = useRideMesh();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const driver = selectedDriver || {
    driverName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.9,
    reviewCount: 142,
    experience: '2.5 yrs',
    verified: true,
    vehicle: 'Tata Nexon EV',
    color: 'Glacier White',
    plate: 'UP16AB****',
    from: searchParams.from || 'Greater Noida',
    to: searchParams.to || 'Noida Sector 62',
    pickup: 'Pari Chowk Metro Gate 2',
    date: searchParams.date || 'Today',
    time: '09:00 AM',
    etaMins: 35,
    cost: 82,
    about: 'Daily commuter on Noida Expressway. Clean vehicle, punctual, AC on and soft music allowed.'
  };

  const maskedPlate = driver.plate || 'UP16AB****';
  const vehicleColor = driver.color || 'Glacier White';

  const handleShareTrip = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RideMesh Trip with ${driver.driverName}`,
          text: `I'm carpooling with ${driver.driverName} on RideMesh from ${driver.from} to ${driver.to}.`,
          url: window.location.href
        });
      } catch {
        // Fallback
      }
    } else {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleConfirmRequest = () => {
    setShowConfirmModal(false);
    goToScreen(12); // Dynamic Pickup Point & Route Confirmation
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--rm-bg)',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
        <AndroidStatusBar />
        <ScreenHeader
          title="Ride Details"
          showBack={true}
          onBack={() => goToScreen(10)}
          rightAction={
            <button
              onClick={handleShareTrip}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669'
              }}
              aria-label="Share Trip"
            >
              <Share2 size={18} />
            </button>
          }
        />

        {copiedShare && (
          <div
            style={{
              margin: '0 20px 10px 20px',
              padding: '8px 12px',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: 10,
              color: '#059669',
              fontSize: '0.78rem',
              fontWeight: '600',
              textAlign: 'center'
            }}
          >
            Trip link copied to clipboard!
          </div>
        )}

        {/* Driver Profile Summary Card */}
        <div style={{ padding: '0 20px 14px 20px' }}>
          <div className="rm-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={driver.avatar}
                alt={driver.driverName}
                style={{ width: 64, height: 64, borderRadius: 20, objectFit: 'cover', border: '2px solid #059669' }}
              />
              {driver.verified && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    background: '#059669',
                    color: 'white',
                    borderRadius: '50%',
                    padding: 3,
                    display: 'flex'
                  }}
                >
                  <ShieldCheck size={14} />
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h2 style={{ fontFamily: 'var(--rm-font-display)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--rm-text-primary)', margin: 0 }}>
                  {driver.driverName}
                </h2>
                <span className="rm-chip active" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  Verified
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 2px 0' }}>
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>{driver.rating}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--rm-text-muted)' }}>({driver.reviewCount || 120} rides completed)</span>
              </div>

              <span style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)' }}>
                Member since 2024 • ID Verified
              </span>
            </div>
          </div>
        </div>

        {/* Trip Timeline & Route Details */}
        <div style={{ padding: '0 20px 14px 20px' }}>
          <div className="rm-card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--rm-text-primary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Trip Details
            </h4>

            {/* Departure / Arrival Route */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669' }} />
                <div style={{ width: 2, height: 44, background: '#CBD5E1' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2.5px solid #DC2626' }} />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)', fontWeight: '700' }}>PICKUP POINT</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                    {driver.pickup || driver.from}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#059669' }}>Departure: {driver.time}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)', fontWeight: '700' }}>DESTINATION</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                    {driver.to}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)' }}>Estimated Duration: ~{driver.etaMins} mins</div>
                </div>
              </div>
            </div>

            {/* Date & Fare Strip */}
            <div style={{ background: 'var(--rm-surface-subtle)', borderRadius: 12, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--rm-border)' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)' }}>Date & Seats</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                  {driver.date} • 1 Passenger
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)' }}>Total Cost Share</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#059669' }}>₹{driver.cost}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div style={{ padding: '0 20px 14px 20px' }}>
          <div className="rm-card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--rm-text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Vehicle Information
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(5, 150, 105, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669'
                  }}
                >
                  <Car size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                    {driver.vehicle}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)' }}>
                    {vehicleColor} • EV Eco-friendly
                  </div>
                </div>
              </div>

              {/* Masked Registration Plate */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  color: '#1E293B',
                  letterSpacing: '0.06em'
                }}
              >
                {maskedPlate}
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Trust Highlights */}
        <div style={{ padding: '0 20px 14px 20px' }}>
          <div className="rm-card" style={{ padding: '14px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <ShieldCheck size={18} color="#059669" />
              <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#064E3B' }}>
                RideMesh Safety Standard
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#047857', lineHeight: 1.45, margin: 0 }}>
              Live GPS trip tracking, emergency SOS support, and masked contact numbers are active for this ride.
            </p>
          </div>
        </div>

        {/* About Driver */}
        <div style={{ padding: '0 20px' }}>
          <div className="rm-card" style={{ padding: '14px 16px' }}>
            <h4 style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--rm-text-primary)', marginBottom: 6 }}>
              About Driver
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--rm-text-secondary)', lineHeight: 1.45, margin: 0 }}>
              {driver.about}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer: Message Driver + Request Ride */}
      <div
        style={{
          padding: '14px 20px 24px 20px',
          background: 'var(--rm-surface)',
          borderTop: '1px solid var(--rm-border)',
          display: 'flex',
          gap: 12
        }}
      >
        <button
          className="rm-btn rm-btn-secondary"
          onClick={() => goToScreen(18)} // Screen 18: Chat
          style={{ width: 52, height: 48, borderRadius: 14, padding: 0 }}
          aria-label="Message Driver"
        >
          <MessageSquare size={19} color="#059669" />
        </button>

        <button
          className="rm-btn rm-btn-primary"
          onClick={() => setShowConfirmModal(true)}
          style={{ flex: 1, height: 48, fontSize: '0.96rem' }}
        >
          Request Ride • ₹{driver.cost}
        </button>
      </div>

      {/* Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 100
          }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            style={{
              width: '100%',
              background: 'var(--rm-surface)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '24px 20px 32px 20px',
              boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: '#CBD5E1', margin: '0 auto 16px auto' }} />

            <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--rm-text-primary)', marginBottom: 6 }}>
              Confirm Ride Request
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--rm-text-secondary)', marginBottom: 18 }}>
              Send carpool match request to <strong>{driver.driverName}</strong> for ₹{driver.cost}?
            </p>

            <div style={{ background: 'var(--rm-surface-subtle)', borderRadius: 14, padding: '12px', border: '1px solid var(--rm-border)', marginBottom: 20 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--rm-text-secondary)', marginBottom: 4 }}>
                Route: <strong>{driver.from} → {driver.to}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--rm-text-secondary)' }}>
                Departure: <strong>{driver.time}</strong> • Vehicle: <strong>{driver.vehicle} ({maskedPlate})</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => setShowConfirmModal(false)}
                style={{ flex: 1, height: 46 }}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={handleConfirmRequest}
                style={{ flex: 1.4, height: 46 }}
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
