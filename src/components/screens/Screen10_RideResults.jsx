// ==============================================================================
// SCREEN 10: AI MATCH RESULTS
// Meets Section 9 & 46 requirements:
// Best rides for you header + Signature 94% Top Match (Rahul Sharma, Creta, 09:00 AM)
// + Compact metrics (Pickup, ETA, Estimated ₹82, Detour)
// + Collapsible "Why this match?" (Route Match 96%, Time Match 92%, Low Detour, Good Rating)
// + Primary CTA: Request Ride (goes to Pickup selection)
// + Secondary CTA: View Details (goes to Driver Profile)
// + Progressive disclosure (one obvious action, not overwhelming)
// ==============================================================================
import React, { useState, useMemo } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { AndroidBottomNav } from '../common/AndroidBottomNav';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Navigation,
  SlidersHorizontal,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Car
} from 'lucide-react';

export const Screen10_RideResults = () => {
  const { matchedRides, setSelectedDriver, searchParams, goToScreen } = useRideMesh();
  const [sortMode, setSortMode] = useState('best'); // 'best' | 'cheapest' | 'earliest' | 'rated'
  const [expandedMatchId, setExpandedMatchId] = useState(1); // Top match expanded by default

  const handleRequestRide = (driver) => {
    setSelectedDriver(driver);
    goToScreen(12); // Screen 12: Dynamic Pickup Point
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    goToScreen(11); // Screen 11: Driver Profile
  };

  const toggleExpand = (id) => {
    setExpandedMatchId(prev => (prev === id ? null : id));
  };

  // Sort rides based on selected sorting mode
  const sortedRides = useMemo(() => {
    const list = [...matchedRides];
    if (sortMode === 'cheapest') {
      return list.sort((a, b) => a.cost - b.cost);
    } else if (sortMode === 'earliest') {
      return list.sort((a, b) => a.time.localeCompare(b.time));
    } else if (sortMode === 'rated') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    // Default: 'best' (Highest AI match score)
    return list.sort((a, b) => b.matchScore - a.matchScore);
  }, [matchedRides, sortMode]);

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
          title="Best rides for you"
          showBack={true}
          onBack={() => goToScreen(8)}
          rightAction={
            <button
              onClick={() => goToScreen(9)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--rm-surface)',
                border: '1px solid var(--rm-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                cursor: 'pointer'
              }}
              aria-label="Filter"
            >
              <SlidersHorizontal size={17} />
            </button>
          }
        />

        {/* Route Summary Pill */}
        <div
          style={{
            margin: '8px 20px 12px 20px',
            padding: '10px 14px',
            background: 'var(--rm-surface)',
            border: '1px solid var(--rm-border)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--rm-shadow-sm)'
          }}
          onClick={() => goToScreen(8)}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
              <span>{searchParams.from || 'Greater Noida'}</span>
              <span style={{ color: '#059669' }}>→</span>
              <span>{searchParams.to || 'Noida'}</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
              {searchParams.date || 'Today'} • {searchParams.time || '09:00 AM'} • {searchParams.passengers || 1} Passenger
            </div>
          </div>

          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#059669',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
        </div>

        {/* 4 Sorting Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: '0 20px 12px 20px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          {[
            { id: 'best', label: 'Best Match', icon: <Sparkles size={12} /> },
            { id: 'cheapest', label: 'Cheapest' },
            { id: 'earliest', label: 'Earliest' },
            { id: 'rated', label: 'Highest Rated' }
          ].map(tab => {
            const active = sortMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSortMode(tab.id)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 20,
                  border: active ? '1.5px solid #059669' : '1px solid var(--rm-border)',
                  background: active ? '#ECFDF5' : 'var(--rm-surface)',
                  color: active ? '#059669' : 'var(--rm-text-secondary)',
                  fontSize: '0.76rem',
                  fontWeight: active ? '700' : '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Counter & AI Status */}
        <div style={{ padding: '0 20px 8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--rm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {sortedRides.length} MATCHES FOUND
          </span>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={11} /> AI Route Optimized
          </span>
        </div>

        {/* Ride Cards List */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sortedRides.map((ride, idx) => {
            const isTop = idx === 0;
            const isExpanded = expandedMatchId === ride.id;

            return (
              <div
                key={ride.id}
                className={`rm-card ${isTop ? 'rm-card-highlight' : ''}`}
                style={{
                  padding: '16px',
                  position: 'relative',
                  border: isTop ? '1.5px solid #059669' : '1px solid var(--rm-border)'
                }}
              >
                {/* Header: Match Score + Price */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div className="rm-match-badge" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                    <Sparkles size={12} />
                    <span>{ride.matchScore}% Match</span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#059669', lineHeight: 1 }}>
                      ₹{ride.cost}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                      estimated share
                    </div>
                  </div>
                </div>

                {/* Driver Info: Photo, Name, Rating, Verification, Vehicle, Route */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img
                    src={ride.avatar}
                    alt={ride.driverName}
                    style={{ width: 48, height: 48, borderRadius: 16, objectFit: 'cover', border: '1.5px solid #059669' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <h3 style={{ fontSize: '1.02rem', fontWeight: '800', color: 'var(--rm-text-primary)', margin: 0 }}>
                        {ride.driverName}
                      </h3>
                      {ride.verified && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#059669', fontSize: '0.7rem', fontWeight: '700' }}>
                          <ShieldCheck size={14} />
                          <span>Verified Driver</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.8rem', fontWeight: '800', color: '#B45309' }}>
                        <Star size={12} fill="#F59E0B" color="#F59E0B" /> {ride.rating}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--rm-text-muted)' }}>
                        • {ride.vehicle}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-secondary)', marginTop: 2, fontWeight: '600' }}>
                      {ride.from} → {ride.to} • {ride.time} • {ride.seatsLeft} seats left
                    </div>
                  </div>
                </div>

                {/* Key Metrics: Pickup, ETA, Estimated Cost, Detour */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 8,
                    background: 'var(--rm-surface-subtle)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    border: '1px solid var(--rm-border)',
                    marginBottom: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--rm-text-secondary)' }}>
                    <MapPin size={14} color="#059669" />
                    <span>Pickup: <strong style={{ color: 'var(--rm-text-primary)' }}>{ride.pickup}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--rm-text-secondary)' }}>
                    <Clock size={14} color="#059669" />
                    <span>ETA: <strong style={{ color: 'var(--rm-text-primary)' }}>{ride.etaMins} min</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--rm-text-secondary)' }}>
                    <Car size={14} color="#059669" />
                    <span>Detour: <strong style={{ color: 'var(--rm-text-primary)' }}>{ride.detourKm} km</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--rm-text-secondary)' }}>
                    <Sparkles size={14} color="#059669" />
                    <span>Route Match: <strong style={{ color: '#059669' }}>{ride.routeMatch || 96}%</strong></span>
                  </div>
                </div>

                {/* Collapsible Section: "Why this match?" */}
                <div style={{ marginBottom: 14 }}>
                  <button
                    onClick={() => toggleExpand(ride.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: '#059669',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Why this match?</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '10px 12px',
                        background: '#ECFDF5',
                        borderRadius: 10,
                        border: '1px solid #A7F3D0',
                        fontSize: '0.76rem',
                        color: '#064E3B',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Route Compatibility</span>
                        <strong>{ride.routeMatch || 96}%</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Departure Timing Match</span>
                        <strong>{ride.timeMatch || 92}%</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Driver Extra Detour</span>
                        <strong>Only {ride.detourKm} km</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Driver Safety Rating</span>
                        <strong>{ride.rating} ★ (Top Tier)</strong>
                      </div>
                      <div style={{ marginTop: 4, fontSize: '0.72rem', color: '#047857', borderTop: '1px solid #A7F3D0', paddingTop: 6 }}>
                        Best match because route and departure time overlap with minimal detour for both commuters.
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary CTA: Request Ride | Secondary CTA: View Details */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="rm-btn rm-btn-secondary"
                    onClick={() => handleViewDetails(ride)}
                    style={{ flex: 1, height: 42, fontSize: '0.84rem', fontWeight: '700' }}
                  >
                    View Details
                  </button>

                  <button
                    className="rm-btn rm-btn-primary"
                    onClick={() => handleRequestRide(ride)}
                    style={{ flex: 1.4, height: 42, fontSize: '0.88rem', fontWeight: '800' }}
                  >
                    <span>Request Ride</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Tab Universal Bottom Navigation */}
      <AndroidBottomNav />
    </div>
  );
};

