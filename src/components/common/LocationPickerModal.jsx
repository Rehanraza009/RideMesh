// ==============================================================================
// LOCATION PICKER MODAL (GOOGLE MAPS PICKER & SELECTION SHEET)
// Meets Section 6 & 7 requirements:
// - Header: "Choose Pickup Location"
// - Options:
//   * Use Current Location
//   * Search a location
//   * Choose on map
//   * Saved places
// - Full Google Maps Interactive Picker:
//   * Center pin with pan-to-select
//   * Search bar: "Search this area"
//   * Bottom sheet: Selected location, Address, Coordinates
//   * Button: "Confirm Location"
//   * AI recommends, User confirms (Never auto-confirms)
// ==============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { GoogleMapView } from './GoogleMapView';
import { VERIFIED_PLACES, GOOGLE_MAPS_CONFIG } from '../../config/maps';
import {
  X,
  Search,
  MapPin,
  Navigation,
  Compass,
  Home,
  Briefcase,
  GraduationCap,
  Bookmark,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LocationPickerModal = () => {
  const {
    isLocationPickerOpen,
    setIsLocationPickerOpen,
    searchParams,
    setSearchParams,
    deviceLocation,
    requestDeviceLocation,
    setIsLocationPermissionModalOpen
  } = useRideMesh();

  // Active sub-mode: 'list' | 'map' | 'search'
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'map' | 'search'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected location candidate for confirmation
  const [selectedCandidate, setSelectedCandidate] = useState({
    name: typeof searchParams.from === 'string' ? searchParams.from : 'Pari Chowk Metro Station',
    address: 'Alpha 1, Greater Noida, UP 201310',
    lat: GOOGLE_MAPS_CONFIG.defaultCenter.lat,
    lng: GOOGLE_MAPS_CONFIG.defaultCenter.lng
  });

  // Keep candidate updated when modal opens
  useEffect(() => {
    if (isLocationPickerOpen) {
      if (typeof searchParams.from === 'string') {
        const found = VERIFIED_PLACES.find(p => searchParams.from.toLowerCase().includes(p.name.toLowerCase()));
        if (found) {
          setSelectedCandidate({
            name: found.name,
            address: found.address,
            lat: found.lat,
            lng: found.lng
          });
        } else {
          setSelectedCandidate(prev => ({
            ...prev,
            name: searchParams.from
          }));
        }
      }
    }
  }, [isLocationPickerOpen, searchParams.from]);

  // Autocomplete matching list
  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return VERIFIED_PLACES;
    const q = searchQuery.toLowerCase();
    return VERIFIED_PLACES.filter(
      p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isLocationPickerOpen) return null;

  // Handler: User confirms the selection
  const handleConfirmLocation = (loc = selectedCandidate) => {
    setSearchParams(prev => ({
      ...prev,
      from: loc.name,
      fromCoords: { lat: loc.lat, lng: loc.lng }
    }));
    setIsLocationPickerOpen(false);
  };

  // Handler: User clicks "Use Current Location"
  const handleUseCurrentLocation = () => {
    if (!deviceLocation.permissionGranted) {
      setIsLocationPermissionModalOpen(true);
      return;
    }
    const loc = {
      name: `Current Location (${deviceLocation.latitude.toFixed(4)}, ${deviceLocation.longitude.toFixed(4)})`,
      address: 'Detected via device GPS',
      lat: deviceLocation.latitude,
      lng: deviceLocation.longitude
    };
    setSelectedCandidate(loc);
    handleConfirmLocation(loc);
  };

  // Handler: When map is panned in "Choose on map" mode
  const handleMapPanChange = (newCoords) => {
    // Find closest landmark or display coordinates
    const closest = VERIFIED_PLACES.find(p => {
      const dLat = Math.abs(p.lat - newCoords.lat);
      const dLng = Math.abs(p.lng - newCoords.lng);
      return dLat < 0.008 && dLng < 0.008;
    });

    if (closest) {
      setSelectedCandidate({
        name: closest.name,
        address: closest.address,
        lat: newCoords.lat,
        lng: newCoords.lng
      });
    } else {
      setSelectedCandidate({
        name: `Custom Map Point (${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)})`,
        address: 'Selected by pinpointing on Google Maps',
        lat: newCoords.lat,
        lng: newCoords.lng
      });
    }
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
      {/* Top Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => {
              if (activeTab === 'map' || activeTab === 'search') {
                setActiveTab('list');
              } else {
                setIsLocationPickerOpen(false);
              }
            }}
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
            aria-label="Back"
          >
            <X size={20} />
          </button>

          <div>
            <h2
              style={{
                fontSize: '1.12rem',
                fontWeight: '800',
                color: '#0F172A',
                margin: 0,
                fontFamily: 'var(--rm-font-display)'
              }}
            >
              Choose Pickup Location
            </h2>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>
              Select where you want your ride to pick you up
            </div>
          </div>
        </div>

        {/* Mode Switch Pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: '6px 12px',
              borderRadius: 16,
              background: activeTab === 'list' || activeTab === 'search' ? '#059669' : '#F1F5F9',
              color: activeTab === 'list' || activeTab === 'search' ? '#FFFFFF' : '#475569',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
          <button
            onClick={() => setActiveTab('map')}
            style={{
              padding: '6px 12px',
              borderRadius: 16,
              background: activeTab === 'map' ? '#059669' : '#F1F5F9',
              color: activeTab === 'map' ? '#FFFFFF' : '#475569',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Map
          </button>
        </div>
      </div>

      {/* VIEW 1: MAP LOCATION PICKER MODE (Section 7) */}
      {activeTab === 'map' && (
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* Overlaid Search Area Bar on Top of Map */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 16,
              right: 16,
              zIndex: 30,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 16,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: '1px solid #CBD5E1'
            }}
          >
            <Search size={18} color="#059669" style={{ marginRight: 8 }} />
            <input
              type="text"
              placeholder="Search this area (e.g. Pari Chowk, Sector 62)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setActiveTab('search')}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: '600',
                color: '#0F172A'
              }}
            />
          </div>

          {/* Interactive Google Map with Center Pinpoint */}
          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
            <GoogleMapView
              mode="picker"
              center={{ lat: selectedCandidate.lat, lng: selectedCandidate.lng }}
              zoom={15}
              onLocationChange={handleMapPanChange}
              height="100%"
            />
          </div>

          {/* Bottom Sheet Card with Selected Location & "Confirm Location" Button */}
          <div
            style={{
              background: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.12)',
              padding: '18px 20px 24px 20px',
              borderTop: '1px solid #E2E8F0',
              zIndex: 35
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MapPin size={22} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                  SELECTED PICKUP POINT
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginTop: 2 }}>
                  {selectedCandidate.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                  {selectedCandidate.address}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '700', marginTop: 4 }}>
                  GPS: {selectedCandidate.lat.toFixed(4)}, {selectedCandidate.lng.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Confirm Location Button */}
            <button
              className="rm-btn rm-btn-primary"
              onClick={() => handleConfirmLocation(selectedCandidate)}
              style={{
                width: '100%',
                height: 48,
                fontSize: '1rem',
                fontWeight: '800',
                borderRadius: 24,
                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.35)'
              }}
            >
              <Check size={18} strokeWidth={2.5} />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2 & 3: LIST / SEARCH AUTOCOMPLETE MODE (Section 6) */}
      {(activeTab === 'list' || activeTab === 'search') && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Search Input Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1.5px solid #10B981',
              borderRadius: 16,
              padding: '0 14px',
              height: 48,
              marginBottom: 16
            }}
          >
            <Search size={18} color="#059669" style={{ marginRight: 10, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search pickup location (e.g. Pari Chowk, Sector 62)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setActiveTab('search');
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.94rem',
                fontWeight: '600',
                color: '#0F172A'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Core Options Grid (Section 6) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
            {/* Option 1: Use Current Location */}
            <div
              onClick={handleUseCurrentLocation}
              style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 16,
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'transform 0.15s ease'
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#059669',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Navigation size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#064E3B' }}>
                  Use Current Location
                </div>
                <div style={{ fontSize: '0.7rem', color: '#047857' }}>
                  GPS detected
                </div>
              </div>
            </div>

            {/* Option 2: Choose on map */}
            <div
              onClick={() => setActiveTab('map')}
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 16,
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#10B981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Compass size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#064E3B' }}>
                  Choose on Map
                </div>
                <div style={{ fontSize: '0.7rem', color: '#047857' }}>
                  Pan & pinpoint
                </div>
              </div>
            </div>
          </div>

          {/* Section: Saved Places */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: '800',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 10
              }}
            >
              Saved Places
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'Home', place: VERIFIED_PLACES[0], icon: <Home size={16} color="#059669" /> },
                { label: 'Work', place: VERIFIED_PLACES[1], icon: <Briefcase size={16} color="#059669" /> },
                { label: 'College', place: VERIFIED_PLACES[2], icon: <GraduationCap size={16} color="#059669" /> }
              ].map(item => (
                <div
                  key={item.label}
                  onClick={() => handleConfirmLocation(item.place)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 14,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#1E293B' }}>{item.label}</span>
                  <span style={{ fontSize: '0.66rem', color: '#64748B', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    {item.place.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Search Results / Verified Places */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10
              }}
            >
              <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {searchQuery.trim() ? 'Matching Locations' : 'Nearby Pickup Locations'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                Verified Coordinates
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => handleConfirmLocation(place)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 16,
                    background: '#FFFFFF',
                    border: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
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
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <MapPin size={18} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0F172A' }}>
                        {place.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 1 }}>
                        {place.address}
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={16} color="#CBD5E1" />
                </div>
              ))}

              {filteredPlaces.length === 0 && (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748B' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '700', margin: '0 0 6px 0' }}>No exact match found</p>
                  <p style={{ fontSize: '0.78rem', margin: 0 }}>Use this custom pickup address</p>
                  <button
                    className="rm-btn rm-btn-primary"
                    onClick={() => handleConfirmLocation({
                      name: searchQuery,
                      address: 'Custom user-entered pickup location',
                      lat: GOOGLE_MAPS_CONFIG.defaultCenter.lat,
                      lng: GOOGLE_MAPS_CONFIG.defaultCenter.lng
                    })}
                    style={{ marginTop: 14, height: 42 }}
                  >
                    Select "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
