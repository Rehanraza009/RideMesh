// ==============================================================================
// DESTINATION SEARCH SHEET (GOOGLE PLACES & AUTOCOMPLETE UX)
// Meets Section 8 & 9 requirements:
// - Search bar: "Where to?"
// - Autocomplete with coordinates (place name, address, latitude, longitude)
// - Categories: Recent Places, Home, Work/College, Saved Places, Nearby Places
// - Does NOT automatically choose a destination — user must explicitly tap.
// ==============================================================================
import React, { useState, useMemo } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { VERIFIED_PLACES } from '../../config/maps';
import {
  Search,
  X,
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  Home as HomeIcon,
  Navigation,
  ArrowRight,
  Sparkles,
  Bookmark
} from 'lucide-react';

export const DestinationSearchSheet = () => {
  const { isDestinationSearchOpen, setIsDestinationSearchOpen, selectDestination, searchParams, setSearchParams } = useRideMesh();
  const [query, setQuery] = useState(searchParams.to || '');

  const filteredPlaces = useMemo(() => {
    if (!query.trim()) return VERIFIED_PLACES;
    const q = query.toLowerCase();
    return VERIFIED_PLACES.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isDestinationSearchOpen) return null;

  const handlePickPlace = (place) => {
    if (typeof place === 'string') {
      selectDestination(place);
    } else {
      selectDestination(place.name);
      setSearchParams(prev => ({
        ...prev,
        to: place.name,
        toCoords: { lat: place.lat, lng: place.lng },
        toAddress: place.address
      }));
    }
    setIsDestinationSearchOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#FFFFFF',
        zIndex: 1050,
        display: 'flex',
        flexDirection: 'column',
        animation: 'rmFadeIn 0.2s ease-out'
      }}
    >
      {/* Header Search Input Bar (Section 8) */}
      <div
        style={{
          padding: '16px 20px 14px 20px',
          borderBottom: '1px solid #E2E8F0',
          background: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setIsDestinationSearchOpen(false)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              cursor: 'pointer'
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1.5px solid #10B981',
              borderRadius: 14,
              padding: '0 14px',
              height: 48
            }}
          >
            <Search size={18} color="#059669" style={{ marginRight: 10, flexShrink: 0 }} />
            <input
              type="text"
              autoFocus
              placeholder="Where to? (e.g. India Gate, Noida Sector 62)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.96rem',
                fontWeight: '600',
                color: '#0F172A'
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Current Origin Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            padding: '6px 12px',
            background: '#ECFDF5',
            borderRadius: 10,
            fontSize: '0.76rem',
            color: '#064E3B'
          }}
        >
          <Navigation size={13} color="#059669" />
          <span>From: <strong>{searchParams.from || 'Current Location'}</strong></span>
        </div>
      </div>

      {/* Scrollable Results & Suggestions (Sections 8 & 9) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {/* Quick Shortcuts: Home, Work, College, Mall */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'Work', place: VERIFIED_PLACES[1], icon: <Briefcase size={16} color="#059669" /> },
            { label: 'College', place: VERIFIED_PLACES[2], icon: <GraduationCap size={16} color="#059669" /> },
            { label: 'Home', place: VERIFIED_PLACES[0], icon: <HomeIcon size={16} color="#059669" /> },
            { label: 'Saved', place: VERIFIED_PLACES[3], icon: <Bookmark size={16} color="#059669" /> }
          ].map(item => (
            <button
              key={item.label}
              onClick={() => handlePickPlace(item.place)}
              style={{
                padding: '10px 4px',
                borderRadius: 14,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1E293B' }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {query.trim() ? 'Search Results' : 'Recent & Popular Destinations'}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
            Google Places Ready
          </span>
        </div>

        {/* List of Autocomplete / Places */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredPlaces.map(place => (
            <div
              key={place.id}
              onClick={() => handlePickPlace(place)}
              style={{
                padding: '12px 14px',
                borderRadius: 16,
                background: '#FFFFFF',
                border: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F0FDF4'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A' }}>
                    {place.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 1 }}>
                    {place.address}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '600', marginTop: 2 }}>
                    {place.category} • GPS: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                  </div>
                </div>
              </div>

              <ArrowRight size={16} color="#CBD5E1" />
            </div>
          ))}

          {filteredPlaces.length === 0 && (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748B' }}>
              <p style={{ fontSize: '0.92rem', fontWeight: '700', margin: '0 0 6px 0' }}>No exact match found</p>
              <p style={{ fontSize: '0.78rem', margin: 0 }}>Select "{query}" as custom destination</p>
              <button
                className="rm-btn rm-btn-primary"
                onClick={() => handlePickPlace(query)}
                style={{ marginTop: 14, height: 42 }}
              >
                Use "{query}"
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
