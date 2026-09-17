// ==============================================================================
// LOCATION PERMISSION & DEMO GEOLOCATION MODAL
// Meets Section 5 & 39 requirements:
// - Friendly explanation: "RideMesh uses your location to find nearby rides and calculate the best pickup point."
// - Options: [Allow] and [Don't Allow]
// - Friendly denied state: "Location access is off. Enable location access to find rides near you."
// - Developer-only "Set Demo Location" option so emulators never pretend fake GPS is real.
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { Navigation, MapPin, ShieldAlert, CheckCircle2, X, Compass, AlertCircle } from 'lucide-react';
import { VERIFIED_PLACES } from '../../config/maps';

export const LocationPermissionModal = () => {
  const {
    isLocationPermissionModalOpen,
    setIsLocationPermissionModalOpen,
    deviceLocation,
    setDeviceLocation,
    setSearchParams
  } = useRideMesh();

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  if (!isLocationPermissionModalOpen) return null;

  const handleAllow = () => {
    setRequesting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setRequesting(false);
          const newLoc = {
            latitude: Number(pos.coords.latitude.toFixed(5)),
            longitude: Number(pos.coords.longitude.toFixed(5)),
            accuracy: Math.round(pos.coords.accuracy),
            permissionGranted: true,
            isDemo: false
          };
          setDeviceLocation(newLoc);
          setSearchParams(prev => ({
            ...prev,
            from: `Current Location (${newLoc.latitude}, ${newLoc.longitude})`
          }));
          setIsLocationPermissionModalOpen(false);
        },
        (err) => {
          setRequesting(false);
          console.warn('[RideMesh] Geolocation denied or unavailable:', err.message);
          setPermissionDenied(true);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setRequesting(false);
      setPermissionDenied(true);
    }
  };

  const handleDontAllow = () => {
    setPermissionDenied(true);
  };

  const handlePickDemoLocation = (place) => {
    setDeviceLocation({
      latitude: place.lat,
      longitude: place.lng,
      accuracy: 5,
      permissionGranted: true,
      isDemo: true,
      placeName: place.name
    });
    setSearchParams(prev => ({
      ...prev,
      from: `${place.name} (Demo GPS)`
    }));
    setShowDemoSelector(false);
    setIsLocationPermissionModalOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'rmFadeIn 0.2s ease-out'
      }}
      onClick={() => setIsLocationPermissionModalOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsLocationPermissionModalOpen(false)}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {!permissionDenied ? (
          /* Normal Permission Prompt */
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#ECFDF5',
                border: '2px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#059669'
              }}
            >
              <Navigation size={32} />
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: '#0F172A',
                marginBottom: 8,
                fontFamily: 'var(--rm-font-display)'
              }}
            >
              Enable Location Access
            </h3>

            <p
              style={{
                fontSize: '0.88rem',
                color: '#64748B',
                lineHeight: 1.5,
                marginBottom: 24
              }}
            >
              RideMesh uses your location to find nearby rides and calculate the best pickup point.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="rm-btn rm-btn-primary"
                onClick={handleAllow}
                disabled={requesting}
                style={{ height: 48, fontSize: '0.96rem', fontWeight: '800' }}
              >
                {requesting ? 'Detecting Location...' : 'Allow Location Access'}
              </button>

              <button
                className="rm-btn rm-btn-secondary"
                onClick={handleDontAllow}
                style={{ height: 44, fontSize: '0.9rem', fontWeight: '700' }}
              >
                Don't Allow
              </button>
            </div>
          </div>
        ) : (
          /* Friendly Denied / Off State (Section 5) */
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#FEF2F2',
                border: '2px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#DC2626'
              }}
            >
              <ShieldAlert size={32} />
            </div>

            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: '#0F172A',
                marginBottom: 6,
                fontFamily: 'var(--rm-font-display)'
              }}
            >
              Location access is off
            </h3>

            <p
              style={{
                fontSize: '0.86rem',
                color: '#64748B',
                lineHeight: 1.45,
                marginBottom: 20
              }}
            >
              Enable location access to find rides near you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="rm-btn rm-btn-primary"
                onClick={handleAllow}
                style={{ height: 46, fontSize: '0.94rem', fontWeight: '800' }}
              >
                Enable Location
              </button>

              {/* Developer Demo Location Option (Section 39) */}
              <button
                type="button"
                onClick={() => setShowDemoSelector(prev => !prev)}
                style={{
                  background: '#F8FAFC',
                  border: '1px dashed #CBD5E1',
                  borderRadius: 12,
                  padding: '10px 12px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Compass size={14} color="#059669" />
                <span>Developer Option: Set Demo Location</span>
              </button>
            </div>

            {/* List of Developer Demo Locations */}
            {showDemoSelector && (
              <div
                style={{
                  marginTop: 14,
                  textAlign: 'left',
                  maxHeight: 180,
                  overflowY: 'auto',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  padding: '8px'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6, paddingLeft: 6 }}>
                  Choose Emulator Test Point:
                </div>
                {VERIFIED_PLACES.slice(0, 4).map(place => (
                  <div
                    key={place.id}
                    onClick={() => handlePickDemoLocation(place)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: '#0F172A',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                      background: '#F8FAFC'
                    }}
                  >
                    <span>{place.name}</span>
                    <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '700' }}>Select</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
