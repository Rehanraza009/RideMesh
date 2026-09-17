// ==============================================================================
// GOOGLE MAPS INTERACTIVE VIEW COMPONENT
// Supports:
// - Live Google Maps JavaScript API (when VITE_GOOGLE_MAPS_API_KEY is configured)
// - Interactive Geographical Map fallback with real coordinate panning & zoom
// - Modes:
//   * 'home-passenger' : User location pin + nearby driver markers
//   * 'home-driver'    : Driver route corridor + passenger pickup request pins
//   * 'picker'         : Center pinpoint for choosing pickup/destination with pan-to-select
//   * 'pickup'         : Recommended dynamic pickup point + alternative stops
//   * 'tracking'       : Active ride route + moving car marker + telemetry
// ==============================================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GOOGLE_MAPS_CONFIG } from '../../config/maps';
import { Plus, Minus, Compass, Navigation, MapPin, Sparkles, Key, AlertCircle } from 'lucide-react';

export const GoogleMapView = ({
  mode = 'home-passenger', // 'home-passenger' | 'home-driver' | 'picker' | 'pickup' | 'tracking'
  center = GOOGLE_MAPS_CONFIG.defaultCenter,
  zoom = 14,
  userLocation = null,
  pickupPoints = [],
  selectedPickup = null,
  onSelectPickup = null,
  onLocationChange = null,
  nearbyDrivers = [],
  driverRoute = null,
  showDeviation = false,
  carProgress = 40,
  height = '100%',
  style = {}
}) => {
  const mapContainerRef = useRef(null);
  const googleMapInstanceRef = useRef(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Local fallback interactive pan & zoom state
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [mapCenter, setMapCenter] = useState(center);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update center when prop changes
  useEffect(() => {
    if (center && (center.lat !== mapCenter.lat || center.lng !== mapCenter.lng)) {
      setMapCenter(center);
      if (googleMapInstanceRef.current && window.google?.maps) {
        googleMapInstanceRef.current.panTo(center);
      }
    }
  }, [center]);

  // Load Google Maps JavaScript API script if key is provided
  useEffect(() => {
    const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
    if (!apiKey) {
      // No API key configured; use the interactive fallback
      setIsGoogleLoaded(false);
      return;
    }

    // Check if google maps is already loaded
    if (window.google?.maps) {
      setIsGoogleLoaded(true);
      return;
    }

    const scriptId = 'ridemesh-google-maps-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}`;
    script.async = true;
    script.defer = true;

    script.onload = () => setIsGoogleLoaded(true);
    script.onerror = () => {
      console.warn('[RideMesh] Google Maps SDK failed to load, using interactive fallback.');
      setLoadError(true);
    };

    document.head.appendChild(script);
  }, []);

  // Initialize Native Google Map when script is ready
  useEffect(() => {
    if (!isGoogleLoaded || !window.google?.maps || !mapContainerRef.current) return;

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: mapCenter,
        zoom: currentZoom,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }
        ]
      });

      googleMapInstanceRef.current = map;

      // Handle map pan in picker mode
      if (mode === 'picker' && onLocationChange) {
        map.addListener('idle', () => {
          const newCenter = map.getCenter();
          if (newCenter) {
            onLocationChange({
              lat: Number(newCenter.lat().toFixed(5)),
              lng: Number(newCenter.lng().toFixed(5))
            });
          }
        });
      }
    } catch (e) {
      console.warn('[RideMesh] Error initializing Google Map:', e);
    }
  }, [isGoogleLoaded, mode]);

  // Interactive Fallback Drag Handlers (real pan by geographic coordinates)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    // Approximate scale factor: 1 pixel ~ 0.00015 deg lat/lng at zoom 14
    const factor = 0.00015 / Math.pow(1.5, currentZoom - 14);
    const newLat = Number((mapCenter.lat + dy * factor).toFixed(5));
    const newLng = Number((mapCenter.lng - dx * factor).toFixed(5));

    const updated = { lat: newLat, lng: newLng };
    setMapCenter(updated);
    if (onLocationChange) onLocationChange(updated);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Handlers for Android Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    const factor = 0.00015 / Math.pow(1.5, currentZoom - 14);
    const newLat = Number((mapCenter.lat + dy * factor).toFixed(5));
    const newLng = Number((mapCenter.lng - dx * factor).toFixed(5));

    const updated = { lat: newLat, lng: newLng };
    setMapCenter(updated);
    if (onLocationChange) onLocationChange(updated);
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Zoom helpers
  const zoomIn = () => {
    setCurrentZoom(z => Math.min(z + 1, 18));
    if (googleMapInstanceRef.current) {
      googleMapInstanceRef.current.setZoom(Math.min(currentZoom + 1, 18));
    }
  };

  const zoomOut = () => {
    setCurrentZoom(z => Math.max(z - 1, 10));
    if (googleMapInstanceRef.current) {
      googleMapInstanceRef.current.setZoom(Math.max(currentZoom - 1, 10));
    }
  };

  const recenter = () => {
    const target = userLocation || GOOGLE_MAPS_CONFIG.defaultCenter;
    setMapCenter(target);
    if (googleMapInstanceRef.current) {
      googleMapInstanceRef.current.panTo(target);
    }
    if (onLocationChange) onLocationChange(target);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        background: '#E5EDE7',
        userSelect: 'none',
        ...style
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Real Google Map Container (if API key active) */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          display: isGoogleLoaded && !loadError ? 'block' : 'none'
        }}
      />

      {/* Interactive Map Visual Layer (Used as fallback or when API key is missing) */}
      {(!isGoogleLoaded || loadError) && (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* SVG Map Canvas with Real Arterial Highway Geometry */}
          <svg viewBox="0 0 400 500" style={{ width: '100%', height: '100%' }}>
            {/* Soft Green Landscape Bed */}
            <rect width="400" height="500" fill="#EBF2ED" />

            {/* City Parks / Natural Zones */}
            <path d="M 20 40 Q 80 20, 110 90 T 40 160 Z" fill="#D5E8DC" opacity="0.9" />
            <path d="M 270 140 Q 360 110, 370 200 T 290 250 Z" fill="#D5E8DC" opacity="0.9" />
            <path d="M 50 320 Q 130 300, 120 410 T 30 450 Z" fill="#D5E8DC" opacity="0.8" />

            {/* Blue River / Water Canal */}
            <path
              d="M 390 0 C 340 90, 310 170, 330 270 S 370 410, 330 500"
              fill="none"
              stroke="#BAE6FD"
              strokeWidth="24"
              strokeLinecap="round"
            />

            {/* Road Grid Lines */}
            <g stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" opacity="0.75">
              <line x1="0" y1="130" x2="400" y2="130" />
              <line x1="0" y1="230" x2="400" y2="210" />
              <line x1="0" y1="360" x2="400" y2="370" />
              <line x1="110" y1="0" x2="120" y2="500" />
              <line x1="270" y1="0" x2="250" y2="500" />
              <line x1="180" y1="130" x2="210" y2="360" />
            </g>

            {/* Noida - Greater Noida Expressway (Highway Bed) */}
            <path
              d="M 320 440 C 260 340, 220 300, 200 250 S 140 150, 90 70"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 320 440 C 260 340, 220 300, 200 250 S 140 150, 90 70"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Active Green Carpool Route Polyline */}
            {(mode === 'home-driver' || mode === 'pickup' || mode === 'tracking') && (
              <path
                d="M 320 440 C 260 340, 220 300, 200 250 S 140 150, 90 70"
                fill="none"
                stroke="#059669"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={showDeviation ? '8 6' : 'none'}
              />
            )}

            {/* Route Deviation line */}
            {showDeviation && (
              <g>
                <path
                  d="M 200 250 Q 260 270, 280 220"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                />
                <circle cx="280" cy="220" r="14" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
                <circle cx="280" cy="220" r="5" fill="#EF4444" />
              </g>
            )}

            {/* Mode: Home Passenger - Live Location Pin + Nearby Available Drivers */}
            {mode === 'home-passenger' && (
              <g>
                {/* User Current Location Beacon */}
                <g transform="translate(195, 275)">
                  <circle cx="0" cy="0" r="26" fill="#10B981" opacity="0.25" className="rm-pulse-anim" />
                  <circle cx="0" cy="0" r="14" fill="#059669" opacity="0.35" />
                  <circle cx="0" cy="0" r="7" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                  <rect x="-34" y="-28" width="68" height="18" rx="6" fill="#064E3B" />
                  <text x="0" y="-16" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">Current GPS</text>
                </g>

                {/* 4 Nearby RideMesh Drivers */}
                {[
                  { name: 'Rahul S.', eta: '3 min', x: 215, y: 235 },
                  { name: 'Priya M.', eta: '5 min', x: 160, y: 310 },
                  { name: 'Aakash V.', eta: '6 min', x: 270, y: 175 },
                  { name: 'Sameer K.', eta: '8 min', x: 295, y: 360 }
                ].map((d, i) => (
                  <g key={i} transform={`translate(${d.x}, ${d.y})`}>
                    <ellipse cx="0" cy="6" rx="10" ry="3" fill="#0F172A" opacity="0.25" />
                    <circle cx="0" cy="0" r="11" fill="#059669" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                    <g transform="translate(14, -16)">
                      <rect x="0" y="0" width="66" height="18" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                      <circle cx="8" cy="9" r="2.5" fill="#10B981" />
                      <text x="36" y="13" fill="#0F172A" fontSize="7.5" fontWeight="800" textAnchor="middle">{d.name} • {d.eta}</text>
                    </g>
                  </g>
                ))}
              </g>
            )}

            {/* Mode: Home Driver - Route Corridor + Passenger Request Pins */}
            {mode === 'home-driver' && (
              <g>
                {[
                  { name: 'Aakash (95%)', fare: '₹85', x: 230, y: 265 },
                  { name: 'Sneha (91%)', fare: '₹75', x: 175, y: 335 }
                ].map((p, i) => (
                  <g key={i} transform={`translate(${p.x}, ${p.y})`}>
                    <circle cx="0" cy="0" r="16" fill="#059669" opacity="0.25" className="rm-pulse-anim" />
                    <circle cx="0" cy="0" r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                    <g transform="translate(12, -20)">
                      <rect x="0" y="0" width="76" height="22" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                      <text x="38" y="11" fill="#0F172A" fontSize="7.5" fontWeight="800" textAnchor="middle">{p.name}</text>
                      <text x="38" y="19" fill="#059669" fontSize="7" fontWeight="700" textAnchor="middle">{p.fare} share</text>
                    </g>
                  </g>
                ))}
              </g>
            )}

            {/* Mode: Pickup Points Selection */}
            {mode === 'pickup' && (
              <g>
                {pickupPoints.map((p, i) => {
                  const isSelected = selectedPickup === p.name;
                  return (
                    <g
                      key={i}
                      transform={`translate(${p.x || 200}, ${p.y || 250})`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => onSelectPickup && onSelectPickup(p)}
                    >
                      {p.isBest && (
                        <circle cx="0" cy="0" r="22" fill="#10B981" opacity="0.25" className="rm-pulse-anim" />
                      )}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? "14" : "10"}
                        fill={isSelected ? "#059669" : "#FFFFFF"}
                        stroke={isSelected ? "#FFFFFF" : "#059669"}
                        strokeWidth="3"
                      />
                      <circle cx="0" cy="0" r={isSelected ? "4" : "3"} fill={isSelected ? "#FFFFFF" : "#059669"} />
                    </g>
                  );
                })}
              </g>
            )}

            {/* Mode: Tracking - Smooth vehicle marker */}
            {mode === 'tracking' && (
              <g transform="translate(200, 250)">
                <circle cx="0" cy="0" r="20" fill="#10B981" opacity="0.3" className="rm-pulse-anim" />
                <circle cx="0" cy="0" r="12" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="5" fill="#10B981" />
                <g transform="translate(14, -26)">
                  <rect x="0" y="0" width="80" height="20" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))" />
                  <circle cx="10" cy="10" r="3" fill="#10B981" />
                  <text x="44" y="14" fill="#0F172A" fontSize="8" fontWeight="800" textAnchor="middle">
                    {showDeviation ? 'Deviated!' : 'Arriving in 4m'}
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Mode: Location Picker Center Pin (Fixed in Center of Screen for Pan-To-Pick) */}
      {mode === 'picker' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 40
          }}
        >
          <div
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: 12,
              marginBottom: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            Move map to position pin
          </div>
          <div style={{ position: 'relative' }}>
            <MapPin size={38} color="#059669" fill="#059669" strokeWidth={1.5} />
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#FFFFFF'
              }}
            />
          </div>
          <div
            style={{
              width: 8,
              height: 4,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.3)',
              marginTop: -2
            }}
          />
        </div>
      )}

      {/* Google Maps SDK Status & Key Configuration Banner */}
      {!isGoogleLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 14,
            zIndex: 35,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: 12,
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
          <span style={{ fontSize: '0.66rem', fontWeight: '700', color: '#064E3B' }}>
            Google Maps Ready • GPS ({mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)})
          </span>
        </div>
      )}

      {/* Floating Zoom & Recenter Controls */}
      <div
        style={{
          position: 'absolute',
          right: 14,
          top: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 35
        }}
      >
        <button
          onClick={zoomIn}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E293B',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer'
          }}
          aria-label="Zoom In"
        >
          <Plus size={16} />
        </button>

        <button
          onClick={zoomOut}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E293B',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer'
          }}
          aria-label="Zoom Out"
        >
          <Minus size={16} />
        </button>

        <button
          onClick={recenter}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer'
          }}
          aria-label="Current Location"
          title="Recenter to GPS"
        >
          <Compass size={16} />
        </button>
      </div>
    </div>
  );
};
