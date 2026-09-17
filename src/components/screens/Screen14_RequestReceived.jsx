// ==============================================================================
// SCREEN 14: DRIVER RIDE REQUESTS & PASSENGER MATCHING
// Meets Section 22 requirements:
// - Driver receives: "New Ride Request"
//   Passenger: Aakash, Pickup, Drop, Time, Detour, Match %
// - Explicit Buttons: [Accept] and [Decline]
// - The driver must manually choose. Do not auto-accept.
// - Confirmation dialog before accepting.
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { MapPin, Navigation, Sparkles, Check, X, ShieldCheck, UserCheck, ArrowRight, Clock } from 'lucide-react';

export const Screen14_RequestReceived = () => {
  const { goToScreen, setHasActiveRide, setConfirmedRide } = useRideMesh();
  const [acceptedIds, setAcceptedIds] = useState([]);
  const [declinedIds, setDeclinedIds] = useState([]);
  const [pendingAcceptCommuter, setPendingAcceptCommuter] = useState(null);

  const initialCommuters = [
    {
      id: 'c1',
      name: 'Aakash Verma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      matchScore: 95,
      pickup: 'Pari Chowk Gate 2',
      drop: 'Noida Sector 62',
      time: '09:00 AM',
      detourKm: 0.4,
      contribution: 85,
      rating: 4.9,
      aiReason: 'Route compatibility 96%. Minimal 0.4 km detour along the Expressway.'
    },
    {
      id: 'c2',
      name: 'Sneha Roy',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      matchScore: 91,
      pickup: 'Knowledge Park II',
      drop: 'Noida Sector 18',
      time: '09:05 AM',
      detourKm: 0.8,
      contribution: 75,
      rating: 4.8,
      aiReason: 'Pickup is directly on highway ramp with only 0.8 km detour.'
    },
    {
      id: 'c3',
      name: 'Vikram Seth',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      matchScore: 88,
      pickup: 'Alpha 1 Commercial',
      drop: 'Mayur Vihar',
      time: '09:10 AM',
      detourKm: 1.1,
      contribution: 90,
      rating: 4.7,
      aiReason: 'High contribution share with minor highway detour.'
    }
  ];

  const commuters = initialCommuters.filter(c => !declinedIds.includes(c.id));

  const handleConfirmAccept = () => {
    if (!pendingAcceptCommuter) return;
    setAcceptedIds(prev => [...prev, pendingAcceptCommuter.id]);
    setHasActiveRide(true);
    setConfirmedRide({
      from: pendingAcceptCommuter.pickup,
      to: pendingAcceptCommuter.drop,
      time: pendingAcceptCommuter.time,
      seats: '3 / 4 seats filled',
      price: pendingAcceptCommuter.contribution + 335
    });
    setPendingAcceptCommuter(null);
  };

  const handleDecline = (id) => {
    setDeclinedIds(prev => [...prev, id]);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
        <AndroidStatusBar />
        <ScreenHeader
          title="New Ride Requests"
          showBack={true}
          onBack={() => goToScreen(22)}
        />

        {/* Route Corridor Banner */}
        <div
          style={{
            margin: '8px 20px 14px 20px',
            padding: '10px 14px',
            background: 'var(--rm-surface)',
            border: '1px solid var(--rm-border)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--rm-shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
            <span>Greater Noida</span>
            <span style={{ color: '#059669' }}>→</span>
            <span>Delhi (Expressway)</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '700' }}>
            09:00 AM
          </span>
        </div>

        {/* Passenger Matches List */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {commuters.map((commuter) => {
            const isAccepted = acceptedIds.includes(commuter.id);

            return (
              <div
                key={commuter.id}
                className="rm-card"
                style={{
                  padding: '16px',
                  border: isAccepted ? '2px solid #059669' : '1px solid var(--rm-border)'
                }}
              >
                {/* Header: Match Score + Contribution */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div className="rm-match-badge" style={{ fontSize: '0.76rem', padding: '3px 9px' }}>
                    <Sparkles size={12} />
                    <span>{commuter.matchScore}% Match</span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669', lineHeight: 1 }}>
                      +₹{commuter.contribution}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                      fare contribution
                    </div>
                  </div>
                </div>

                {/* Passenger Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img
                    src={commuter.avatar}
                    alt={commuter.name}
                    style={{ width: 46, height: 46, borderRadius: 14, objectFit: 'cover', border: '1.5px solid #059669' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--rm-text-primary)', margin: 0 }}>
                        {commuter.name}
                      </h3>
                      <ShieldCheck size={15} color="#059669" />
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                      ⭐ {commuter.rating} • Verified Passenger
                    </div>
                  </div>
                </div>

                {/* Pickup & Drop Points (Section 22) */}
                <div style={{ background: 'var(--rm-surface-subtle)', borderRadius: 12, padding: '10px 12px', border: '1px solid var(--rm-border)', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--rm-text-secondary)' }}>
                    <MapPin size={13} color="#059669" />
                    <span>Pickup: <strong style={{ color: 'var(--rm-text-primary)' }}>{commuter.pickup}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--rm-text-secondary)' }}>
                    <Navigation size={13} color="#DC2626" />
                    <span>Drop: <strong style={{ color: 'var(--rm-text-primary)' }}>{commuter.drop}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--rm-text-secondary)' }}>
                    <Clock size={13} color="#059669" />
                    <span>Time: <strong style={{ color: 'var(--rm-text-primary)' }}>{commuter.time}</strong></span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)', borderTop: '1px solid var(--rm-border-subtle)', paddingTop: 6 }}>
                    Driver Detour: <strong style={{ color: 'var(--rm-text-primary)' }}>{commuter.detourKm} km</strong>
                  </div>
                </div>

                {/* AI Explanation Strip */}
                <div style={{ background: '#ECFDF5', borderRadius: 10, padding: '8px 12px', border: '1px solid #A7F3D0', fontSize: '0.74rem', color: '#064E3B', marginBottom: 12 }}>
                  💡 {commuter.aiReason}
                </div>

                {/* Actions: Accept or Decline (Section 22: Driver must manually choose) */}
                {!isAccepted ? (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="rm-btn rm-btn-secondary"
                      onClick={() => handleDecline(commuter.id)}
                      style={{ flex: 1, height: 42, fontSize: '0.86rem', fontWeight: '700', color: '#64748B' }}
                    >
                      <X size={16} />
                      <span>Decline</span>
                    </button>

                    <button
                      className="rm-btn rm-btn-primary"
                      onClick={() => setPendingAcceptCommuter(commuter)}
                      style={{ flex: 1.4, height: 42, fontSize: '0.86rem', fontWeight: '800' }}
                    >
                      <Check size={16} strokeWidth={2.5} />
                      <span>Accept</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div
                      style={{
                        flex: 1,
                        background: '#ECFDF5',
                        border: '1.5px solid #059669',
                        borderRadius: 14,
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        color: '#059669',
                        fontSize: '0.84rem',
                        fontWeight: '800'
                      }}
                    >
                      <UserCheck size={18} />
                      <span>Accepted</span>
                    </div>

                    <button
                      className="rm-btn rm-btn-primary"
                      onClick={() => goToScreen(22)} // Return to Driver Dashboard with ready ride
                      style={{ flex: 1, height: 42, fontSize: '0.84rem', fontWeight: '800' }}
                    >
                      <span>Driver Home</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {commuters.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
              <p style={{ fontSize: '0.94rem', fontWeight: '700', margin: '0 0 6px 0' }}>No more pending requests</p>
              <button className="rm-btn rm-btn-primary" onClick={() => goToScreen(22)} style={{ marginTop: 12 }}>
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog: Accept Ride Request */}
      {pendingAcceptCommuter && (
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
          onClick={() => setPendingAcceptCommuter(null)}
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
              <UserCheck size={26} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: 6 }}>
              Accept ride for {pendingAcceptCommuter.name}?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.45, marginBottom: 18 }}>
              Pickup at <strong>{pendingAcceptCommuter.pickup}</strong> with a {pendingAcceptCommuter.detourKm} km detour.
              Estimated passenger contribution: ₹{pendingAcceptCommuter.contribution}.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => setPendingAcceptCommuter(null)}
                style={{ flex: 1, height: 46, fontSize: '0.9rem', fontWeight: '700' }}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={handleConfirmAccept}
                style={{ flex: 1.4, height: 46, fontSize: '0.94rem', fontWeight: '800' }}
              >
                Confirm Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
