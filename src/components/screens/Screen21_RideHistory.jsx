// ==============================================================================
// SCREEN 21: TRIPS & RIDE MANAGEMENT
// Meets Section 14 requirements:
// 4 Tabs: Upcoming | Active | Completed | Cancelled +
// Active Trip Card (live route, ETA, driver/rider location, trip status, share trip, SOS, contact) +
// Completed Trip Card (rate driver, review, trip details) + 5-Tab Navigation
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { AndroidBottomNav } from '../common/AndroidBottomNav';
import {
  Calendar,
  Clock,
  Star,
  Navigation,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  MessageSquare,
  Share2,
  ShieldAlert,
  Car,
  RotateCcw
} from 'lucide-react';

export const Screen21_RideHistory = () => {
  const { rideHistory, activeRide, goToScreen } = useRideMesh();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'active' | 'completed' | 'cancelled'

  const cancelledRides = [
    {
      id: 105,
      date: '2 Sep',
      route: 'Noida Sec 18 → Pari Chowk',
      driver: 'Vikram Singh',
      reason: 'Driver cancelled due to route change',
      cost: 70
    }
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--rm-bg)',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        <AndroidStatusBar />
        <ScreenHeader
          title="My Trips"
          showBack={true}
          onBack={() => goToScreen(8)}
        />

        {/* 4 Tabs: Upcoming | Active | Completed | Cancelled */}
        <div
          style={{
            display: 'flex',
            padding: '10px 20px',
            gap: 6,
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'active', label: 'Active', badge: 'LIVE' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 14,
                  border: isSelected ? '1px solid #059669' : '1px solid var(--rm-border)',
                  background: isSelected ? '#059669' : 'var(--rm-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--rm-text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'var(--rm-shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      background: '#DC2626',
                      color: 'white',
                      fontSize: '0.6rem',
                      padding: '1px 5px',
                      borderRadius: 6,
                      fontWeight: '800'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 1. UPCOMING TAB */}
          {activeTab === 'upcoming' && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--rm-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Confirmed Upcoming Trips
              </div>
              {rideHistory.upcoming.map(ride => (
                <div key={ride.id} className="rm-card rm-card-highlight" style={{ padding: '16px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Navigation size={15} color="#059669" />
                      <h4 style={{ fontSize: '0.94rem', fontWeight: '800', color: 'var(--rm-text-primary)', margin: 0 }}>
                        {ride.route}
                      </h4>
                    </div>
                    <div className="rm-chip active" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      <CheckCircle2 size={12} />
                      <span>{ride.status}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--rm-text-secondary)', marginBottom: 12 }}>
                    <span>Departure: <strong>{ride.time} ({ride.date})</strong></span>
                    <span>Driver: <strong>{ride.driver}</strong></span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--rm-border-subtle)', paddingTop: 10 }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#059669' }}>₹{ride.cost}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="rm-btn rm-btn-secondary rm-btn-sm"
                        onClick={() => goToScreen(18)}
                        style={{ padding: '6px 10px', fontSize: '0.76rem' }}
                      >
                        <MessageSquare size={14} color="#059669" />
                        <span>Chat</span>
                      </button>
                      <button
                        className="rm-btn rm-btn-primary rm-btn-sm"
                        onClick={() => goToScreen(15)}
                        style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                      >
                        Track Ride
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. ACTIVE TAB */}
          {activeTab === 'active' && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#059669', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Journey in Progress
              </div>

              <div className="rm-card" style={{ padding: '16px', border: '1.5px solid #10B981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} className="rm-pulse-anim" />
                    <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                      On the Way to Destination
                    </span>
                  </div>
                  <span className="rm-chip active" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    ETA: {activeRide.etaMins} mins
                  </span>
                </div>

                <div style={{ background: 'var(--rm-surface-subtle)', borderRadius: 12, padding: '10px 12px', marginBottom: 14 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--rm-text-primary)', marginBottom: 4 }}>
                    Greater Noida → Noida Sector 62
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-secondary)' }}>
                    Driver: <strong>Rahul Sharma</strong> • Tata Nexon EV (UP16AB****)
                  </div>
                </div>

                {/* Quick In-Trip Action Tools: Track, Contact, Share, SOS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                  <button
                    onClick={() => goToScreen(15)}
                    style={{ padding: '8px 4px', borderRadius: 10, background: 'var(--rm-surface)', border: '1px solid var(--rm-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  >
                    <Navigation size={16} color="#059669" />
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>Live Map</span>
                  </button>

                  <button
                    onClick={() => goToScreen(18)}
                    style={{ padding: '8px 4px', borderRadius: 10, background: 'var(--rm-surface)', border: '1px solid var(--rm-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  >
                    <MessageSquare size={16} color="#059669" />
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>Chat</span>
                  </button>

                  <button
                    onClick={() => alert('Sharing live location tracking link with emergency contacts...')}
                    style={{ padding: '8px 4px', borderRadius: 10, background: 'var(--rm-surface)', border: '1px solid var(--rm-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  >
                    <Share2 size={16} color="#059669" />
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>Share Trip</span>
                  </button>

                  <button
                    onClick={() => goToScreen(17)} // Screen 17: Emergency SOS
                    style={{ padding: '8px 4px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  >
                    <ShieldAlert size={16} color="#DC2626" />
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#DC2626' }}>SOS</span>
                  </button>
                </div>

                <button
                  className="rm-btn rm-btn-primary"
                  onClick={() => goToScreen(15)}
                  style={{ height: 42, fontSize: '0.88rem' }}
                >
                  Open Live Tracking
                </button>
              </div>
            </div>
          )}

          {/* 3. COMPLETED TAB */}
          {activeTab === 'completed' && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--rm-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Completed Trips
              </div>
              {rideHistory.completed.map(ride => (
                <div key={ride.id} className="rm-card" style={{ padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)', fontWeight: '600' }}>{ride.date}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: '700', color: '#B45309' }}>
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <span>{ride.rating}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--rm-text-primary)', marginBottom: 4 }}>
                    {ride.route}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--rm-text-secondary)', marginBottom: 10 }}>
                    <span>Driver: <strong>{ride.driver}</strong></span>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: '#059669' }}>₹{ride.cost}</span>
                  </div>

                  {/* Rate / Review Action */}
                  <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--rm-border-subtle)', paddingTop: 8 }}>
                    <button
                      className="rm-btn rm-btn-secondary rm-btn-sm"
                      onClick={() => goToScreen(20)} // Screen 20: Rating Screen
                      style={{ flex: 1, padding: '5px 10px', fontSize: '0.76rem' }}
                    >
                      <Star size={13} color="#F59E0B" />
                      <span>Rate Driver</span>
                    </button>
                    <button
                      className="rm-btn rm-btn-secondary rm-btn-sm"
                      onClick={() => alert(`Invoice downloaded for Trip ${ride.id}`)}
                      style={{ flex: 1, padding: '5px 10px', fontSize: '0.76rem' }}
                    >
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. CANCELLED TAB */}
          {activeTab === 'cancelled' && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--rm-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Cancelled Trips
              </div>
              {cancelledRides.map(ride => (
                <div key={ride.id} className="rm-card" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)' }}>{ride.date}</span>
                    <span style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: '700', background: '#FEF2F2', padding: '2px 6px', borderRadius: 6 }}>
                      Cancelled
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)', marginBottom: 2 }}>
                    {ride.route}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)', marginBottom: 8 }}>
                    Reason: {ride.reason}
                  </div>

                  <button
                    className="rm-btn rm-btn-secondary rm-btn-sm"
                    onClick={() => goToScreen(10)}
                    style={{ width: '100%', padding: '6px', fontSize: '0.76rem' }}
                  >
                    <RotateCcw size={13} color="#059669" />
                    <span>Search Similar Ride</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5-Tab Universal Bottom Navigation */}
      <AndroidBottomNav />
    </div>
  );
};
