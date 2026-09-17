// ==============================================================================
// SCREEN 23: OFFER RIDE (DRIVER FLOW)
// Meets Section 12 requirements:
// From, To, Date, Departure Time, Seats, Vehicle, Price per passenger,
// Pickup flexibility, Notes, Route preview, CTA "Publish Ride",
// Confirmation summary modal, and Success state with ride management options.
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { AndroidBottomNav } from '../common/AndroidBottomNav';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  DollarSign,
  Compass,
  FileText,
  Navigation,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { rideService } from '../../services/rideService';

export const Screen23_CreateRide = () => {
  const { goToScreen, user, setHasActiveRide, setConfirmedRide } = useRideMesh();

  // Form Fields (Section 15)
  const [from, setFrom] = useState('Greater Noida Alpha 1');
  const [to, setTo] = useState('Noida Sector 62');
  const [date, setDate] = useState('Today, 10 Sep');
  const [time, setTime] = useState('09:00 AM');
  const [seats, setSeats] = useState(3);
  const [maxDetour, setMaxDetour] = useState('1.0 km');
  const [vehicle, setVehicle] = useState('Tata Nexon EV (UP16AB****)');
  const [price, setPrice] = useState(85);
  const [preferences, setPreferences] = useState({
    ac: true,
    music: true,
    noSmoking: true
  });
  const [notes, setNotes] = useState('Leaving sharp at 9:00 AM. Clean vehicle.');

  const [showConfirmSummary, setShowConfirmSummary] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePublishRide = async () => {
    setLoading(true);
    try {
      await rideService.createRide({
        driverId: user?.uid || 'driver_default',
        driverName: user?.name || 'Rahul Sharma',
        driverAvatar: user?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        from,
        to,
        date,
        departureTime: time,
        availableSeats: seats,
        vehicle,
        cost: price,
        pricePerPassenger: price,
        maxDetour,
        preferences,
        notes,
        status: 'OPEN'
      });
    } catch {}

    setHasActiveRide(true);
    setConfirmedRide({
      from,
      to,
      date,
      time,
      seats: `${seats} seats`,
      price: price * seats
    });

    setShowConfirmSummary(false);
    setIsPublished(true);
    setLoading(false);
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
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
        <AndroidStatusBar />
        <ScreenHeader
          title="Offer a Ride"
          showBack={true}
          onBack={() => goToScreen(8)}
        />

        {/* Form Container */}
        <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Route Preview Graphic */}
          <div
            style={{
              background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
              borderRadius: 16,
              padding: '14px 16px',
              color: '#FFFFFF',
              boxShadow: '0 8px 20px rgba(5, 150, 105, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#A7F3D0', fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 }}>
              <Navigation size={13} />
              <span>Route Preview • 28 km Expressway</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{from}</span>
              <span style={{ color: '#34D399' }}>→</span>
              <span>{to}</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#D1FAE5', marginTop: 4 }}>
              Estimated ~35 mins travel time with carpool priority
            </div>
          </div>

          {/* Origin & Destination Inputs */}
          <div className="rm-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669' }} />
                <div style={{ width: 2, height: 38, background: '#CBD5E1' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2.5px solid #DC2626' }} />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--rm-text-muted)', fontWeight: '700' }}>FROM (Pickup Area)</div>
                  <input
                    type="text"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}
                  />
                </div>
                <div style={{ height: 1, background: 'var(--rm-border-subtle)' }} />
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--rm-text-muted)', fontWeight: '700' }}>TO (Drop-off Destination)</div>
                  <input
                    type="text"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date & Departure Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="rm-card" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--rm-text-muted)' }}>
                <Calendar size={14} color="#059669" />
                <span>Date</span>
              </div>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)', marginTop: 4 }}
              />
            </div>

            <div className="rm-card" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--rm-text-muted)' }}>
                <Clock size={14} color="#059669" />
                <span>Departure Time</span>
              </div>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)', marginTop: 4 }}
              />
            </div>
          </div>

          {/* Available Seats & Price per Passenger */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="rm-card" style={{ padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)', fontWeight: '600' }}>Available Seats</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--rm-surface-subtle)', border: '1px solid var(--rm-border)', cursor: 'pointer', fontWeight: '800' }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>{seats}</span>
                <button
                  type="button"
                  onClick={() => setSeats(Math.min(6, seats + 1))}
                  style={{ width: 28, height: 28, borderRadius: 8, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '800' }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="rm-card" style={{ padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)', fontWeight: '600' }}>Price / Passenger</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: '1rem', fontWeight: '800', color: '#059669' }}>₹</span>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '1.15rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}
                />
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="rm-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--rm-text-muted)', marginBottom: 4 }}>
              <Car size={14} color="#059669" />
              <span>Vehicle & Plate</span>
            </div>
            <input
              type="text"
              value={vehicle}
              onChange={e => setVehicle(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}
            />
          </div>

          {/* Maximum Detour (Section 15) */}
          <div className="rm-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--rm-text-muted)', marginBottom: 8 }}>
              <Compass size={14} color="#059669" />
              <span>Maximum Detour Flexibility</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['0.5 km', '1.0 km', '2.0 km', '3.0 km'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setMaxDetour(d)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 10,
                    border: `1.5px solid ${maxDetour === d ? '#059669' : 'var(--rm-border)'}`,
                    background: maxDetour === d ? '#ECFDF5' : 'transparent',
                    color: maxDetour === d ? '#059669' : 'var(--rm-text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Ride Preferences (Section 15) */}
          <div className="rm-card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--rm-text-muted)', fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
              Ride Preferences
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { key: 'ac', label: 'AC On' },
                { key: 'music', label: 'Quiet Music' },
                { key: 'noSmoking', label: 'No Smoking' }
              ].map(pref => (
                <button
                  key={pref.key}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 10,
                    border: `1.5px solid ${preferences[pref.key] ? '#059669' : 'var(--rm-border)'}`,
                    background: preferences[pref.key] ? '#ECFDF5' : 'transparent',
                    color: preferences[pref.key] ? '#059669' : 'var(--rm-text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {pref.label} {preferences[pref.key] ? '✓' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Driver Notes */}
          <div className="rm-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--rm-text-muted)', marginBottom: 4 }}>
              <FileText size={14} color="#059669" />
              <span>Notes for Passengers</span>
            </div>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '0.84rem', color: 'var(--rm-text-secondary)' }}
            />
          </div>
        </div>
      </div>

      {/* CTA Button: "Create Ride" (Section 15) */}
      <div style={{ padding: '14px 20px 24px 20px', borderTop: '1px solid var(--rm-border-subtle)', background: 'var(--rm-surface)' }}>
        <button
          className="rm-btn rm-btn-primary"
          onClick={() => setShowConfirmSummary(true)}
          style={{ height: 48, fontSize: '0.98rem' }}
        >
          <span>Create Ride</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Confirmation Dialog: "Create this ride? [Cancel] [Confirm]" (Section 15) */}
      {showConfirmSummary && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 100
          }}
          onClick={() => setShowConfirmSummary(false)}
        >
          <div
            style={{
              width: '100%',
              background: 'var(--rm-surface)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '24px 20px 32px 20px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: '#CBD5E1', margin: '0 auto 16px auto' }} />

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--rm-text-primary)', marginBottom: 6 }}>
              Create this ride?
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--rm-text-secondary)', marginBottom: 18 }}>
              Review the ride route and departure before publishing to nearby carpoolers.
            </p>

            <div style={{ background: 'var(--rm-surface-subtle)', borderRadius: 14, padding: '14px', border: '1px solid var(--rm-border)', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                {from} → {to}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--rm-text-secondary)' }}>
                {date} • {time}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--rm-text-secondary)' }}>
                {seats} Seats • ₹{price} / passenger • Max {maxDetour} detour
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => setShowConfirmSummary(false)}
                style={{ flex: 1, height: 46, fontSize: '0.9rem', fontWeight: '700' }}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={handlePublishRide}
                disabled={loading}
                style={{ flex: 1.4, height: 46, fontSize: '0.94rem', fontWeight: '800' }}
              >
                {loading ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* After Publishing: Success State & Ride Management Options */}
      {isPublished && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 100
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '28px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.2)'
              }}
            >
              <CheckCircle2 size={36} color="#059669" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: 6 }}>
              Ride Published Successfully!
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748B', marginBottom: 22, lineHeight: 1.45 }}>
              Your ride from <strong>{from}</strong> to <strong>{to}</strong> is now live. AI is matching compatible commuters along your route.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="rm-btn rm-btn-primary"
                onClick={() => {
                  setIsPublished(false);
                  goToScreen(22); // Screen 22: Driver Dashboard
                }}
                style={{ height: 46 }}
              >
                Go to Driver Dashboard
              </button>

              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => {
                  setIsPublished(false);
                  goToScreen(8); // Passenger Home
                }}
                style={{ height: 46 }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-Tab Universal Bottom Navigation */}
      <AndroidBottomNav />
    </div>
  );
};
