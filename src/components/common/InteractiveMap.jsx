// ==============================================================================
// INTERACTIVE MAP COMPONENT (MAP-FIRST MOBILITY BACKDROP)
// Supported modes:
// 'home-passenger' : Current location + nearby moving RideMesh drivers & ETAs
// 'home-driver'    : Today's commute corridor + nearby passenger pickup requests
// 'pickup'         : AI Recommended pickup points & walking distance
// 'tracking'       : Live GPS ride tracking with smooth vehicle progression
// 'deviation'      : Non-blocking smart route deviation alert
// 'explore'        : Dedicated map tab view with filterable carpool corridors
// ==============================================================================
import React, { useState, useEffect } from 'react';
import { Plus, Minus, Compass, Navigation } from 'lucide-react';

export const InteractiveMap = ({
  mode = 'tracking', // 'home-passenger' | 'home-driver' | 'pickup' | 'tracking' | 'deviation' | 'explore'
  carProgress = 40,
  showDeviation = false,
  selectedPickup = 'Pari Chowk Metro',
  onSelectPickup,
  onSelectDriver,
  height = '100%'
}) => {
  const [zoom, setZoom] = useState(1);
  const [animatedProgress, setAnimatedProgress] = useState(carProgress);
  const [carOffset, setCarOffset] = useState(0);

  // Smooth animation for vehicles
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress(prev => (prev >= 98 ? 15 : prev + 0.35));
      setCarOffset(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Route path coordinates (Greater Noida 330,430 -> Pari Chowk 210,260 -> Sector 62 90,70)
  const pickupPoints = [
    { id: 'pari_chowk', name: 'Pari Chowk Metro', x: 210, y: 260, walk: '600 m', detour: '0.3 km', isBest: true },
    { id: 'metro_stn', name: 'Metro Station Gate 2', x: 235, y: 230, walk: '600 m', detour: '0.3 km', isBest: false },
    { id: 'main_road', name: 'Main Road Express Link', x: 170, y: 280, walk: '250 m', detour: '0.7 km', isBest: false },
    { id: 'mall_ent', name: 'Mall Entrance Junction', x: 260, y: 290, walk: '400 m', detour: '1.1 km', isBest: false }
  ];

  // Calculate car position along the curved path
  const progressRatio = animatedProgress / 100;
  const carX = 330 * Math.pow(1 - progressRatio, 3) +
               3 * 270 * Math.pow(1 - progressRatio, 2) * progressRatio +
               3 * 160 * (1 - progressRatio) * Math.pow(progressRatio, 2) +
               90 * Math.pow(progressRatio, 3);
  const carY = 430 * Math.pow(1 - progressRatio, 3) +
               3 * 330 * Math.pow(1 - progressRatio, 2) * progressRatio +
               3 * 180 * (1 - progressRatio) * Math.pow(progressRatio, 2) +
               70 * Math.pow(progressRatio, 3);

  // Deviation position
  const devX = carX + 55;
  const devY = carY - 20;

  // 4 Nearby Live Drivers (Noida / Greater Noida corridor)
  const nearbyDrivers = [
    { id: 'd1', name: 'Rahul S.', eta: '3m', x: 220 + Math.sin(carOffset * 0.03) * 12, y: 240 + Math.cos(carOffset * 0.03) * 10, vehicle: 'Creta', cost: 82 },
    { id: 'd2', name: 'Priya M.', eta: '5m', x: 165 + Math.cos(carOffset * 0.02) * 14, y: 310 + Math.sin(carOffset * 0.02) * 8, vehicle: 'Nexon EV', cost: 78 },
    { id: 'd3', name: 'Aakash V.', eta: '6m', x: 270 + Math.sin(carOffset * 0.025) * 10, y: 180 + Math.cos(carOffset * 0.025) * 12, vehicle: 'Brezza', cost: 95 },
    { id: 'd4', name: 'Sameer K.', eta: '8m', x: 295 + Math.cos(carOffset * 0.015) * 12, y: 360 + Math.sin(carOffset * 0.015) * 10, vehicle: 'Seltos', cost: 85 }
  ];

  // Passenger Pickup Requests (for Driver Mode)
  const passengerRequests = [
    { id: 'p1', name: 'Aakash', fare: '₹85', match: '95%', x: 230, y: 270 },
    { id: 'p2', name: 'Sneha', fare: '₹75', match: '91%', x: 180, y: 340 },
    { id: 'p3', name: 'Vikram', fare: '₹90', match: '88%', x: 290, y: 210 }
  ];

  return (
    <div className="rm-map-container" style={{ position: 'relative', width: '100%', height, overflow: 'hidden', background: '#E8EFEA' }}>
      <svg
        viewBox="0 0 400 500"
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${zoom})`,
          transition: 'transform 0.2s ease-out',
          userSelect: 'none'
        }}
      >
        {/* Background land surface */}
        <rect width="400" height="500" fill="#E8EFEA" />

        {/* Natural Green Belt / Parks */}
        <path d="M 10 30 Q 70 20, 90 80 T 30 140 Z" fill="#D1E7D7" opacity="0.85" />
        <path d="M 280 120 Q 360 100, 380 190 T 310 230 Z" fill="#D1E7D7" opacity="0.85" />
        <path d="M 40 330 Q 120 310, 110 400 T 20 440 Z" fill="#D1E7D7" opacity="0.75" />

        {/* Water Canal / Stream */}
        <path
          d="M 390 0 C 350 80, 310 160, 330 260 S 370 420, 320 500"
          fill="none"
          stroke="#BAE6FD"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* City Street Grid */}
        <g stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" opacity="0.7">
          <line x1="0" y1="120" x2="400" y2="120" />
          <line x1="0" y1="220" x2="400" y2="200" />
          <line x1="0" y1="360" x2="400" y2="370" />
          <line x1="100" y1="0" x2="110" y2="500" />
          <line x1="280" y1="0" x2="260" y2="500" />
          <line x1="180" y1="120" x2="220" y2="360" />
        </g>

        {/* Arterial Expressway (Highway Base Bed) */}
        <path
          d="M 330 430 C 270 340, 220 300, 210 260 S 140 160, 90 70"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 330 430 C 270 340, 220 300, 210 260 S 140 160, 90 70"
          fill="none"
          stroke="#94A3B8"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Planned Route Line (RideMesh Emerald Green) */}
        {(mode === 'tracking' || mode === 'deviation' || mode === 'home-driver' || mode === 'pickup') && (
          <path
            d="M 330 430 C 270 340, 220 300, 210 260 S 140 160, 90 70"
            fill="none"
            stroke="#059669"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={mode === 'deviation' ? '8 6' : 'none'}
          />
        )}

        {/* Route Deviation line */}
        {(showDeviation || mode === 'deviation') && (
          <g>
            <path
              d={`M ${carX} ${carY} Q ${carX + 60} ${carY + 20}, ${devX} ${devY}`}
              fill="none"
              stroke="#EF4444"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
            <circle cx={devX} cy={devY} r="16" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
            <circle cx={devX} cy={devY} r="6" fill="#EF4444" />
          </g>
        )}

        {/* Origin Marker (Greater Noida) */}
        <g transform="translate(330, 430)">
          <circle cx="0" cy="0" r="12" fill="#059669" opacity="0.25" />
          <circle cx="0" cy="0" r="6" fill="#047857" />
          <text x="-40" y="20" fill="#0F172A" fontSize="10" fontWeight="700">Greater Noida</text>
        </g>

        {/* Destination Marker (Noida Sector 62) */}
        <g transform="translate(90, 70)">
          <circle cx="0" cy="0" r="14" fill="#059669" opacity="0.3" />
          <circle cx="0" cy="0" r="8" fill="#059669" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
          <rect x="-6" y="-34" width="76" height="20" rx="6" fill="#1E293B" />
          <text x="32" y="-21" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">Sector 62</text>
        </g>

        {/* ============================================================ */}
        {/* MODE: HOME-PASSENGER (User Location + 4 Moving Nearby Drivers) */}
        {/* ============================================================ */}
        {(mode === 'home-passenger' || mode === 'explore') && (
          <g>
            {/* User GPS Pulsing Location Pin (Pari Chowk area) */}
            <g transform="translate(195, 275)">
              <circle cx="0" cy="0" r="24" fill="#10B981" opacity="0.2" className="rm-pulse-anim" />
              <circle cx="0" cy="0" r="14" fill="#059669" opacity="0.3" />
              <circle cx="0" cy="0" r="7" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
              <rect x="-30" y="-28" width="60" height="18" rx="6" fill="#064E3B" />
              <text x="0" y="-16" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">You are here</text>
            </g>

            {/* 4 Nearby RideMesh Drivers on Road */}
            {nearbyDrivers.map(d => (
              <g
                key={d.id}
                transform={`translate(${d.x}, ${d.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectDriver && onSelectDriver(d)}
              >
                {/* Vehicle shadow and icon */}
                <ellipse cx="0" cy="6" rx="12" ry="4" fill="#0F172A" opacity="0.25" />
                <circle cx="0" cy="0" r="12" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M -5 2 L -3 -3 L 3 -3 L 5 2 Z" fill="#FFFFFF" />
                <circle cx="-3" cy="3" r="1.5" fill="#1E293B" />
                <circle cx="3" cy="3" r="1.5" fill="#1E293B" />

                {/* Driver ETA Speech Bubble */}
                <g transform="translate(14, -18)">
                  <rect x="0" y="0" width="64" height="20" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))" />
                  <circle cx="8" cy="10" r="2.5" fill="#10B981" />
                  <text x="34" y="14" fill="#0F172A" fontSize="8" fontWeight="800" textAnchor="middle">{d.name} • {d.eta}</text>
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ============================================================ */}
        {/* MODE: HOME-DRIVER (Corridor + Nearby Passenger Requests)     */}
        {/* ============================================================ */}
        {mode === 'home-driver' && (
          <g>
            {passengerRequests.map(p => (
              <g key={p.id} transform={`translate(${p.x}, ${p.y})`} style={{ cursor: 'pointer' }}>
                <circle cx="0" cy="0" r="16" fill="#059669" opacity="0.2" className="rm-pulse-anim" />
                <circle cx="0" cy="0" r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                <g transform="translate(12, -20)">
                  <rect x="0" y="0" width="76" height="22" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))" />
                  <text x="38" y="11" fill="#0F172A" fontSize="8" fontWeight="800" textAnchor="middle">{p.name} ({p.match})</text>
                  <text x="38" y="19" fill="#059669" fontSize="7" fontWeight="700" textAnchor="middle">{p.fare} share</text>
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ============================================================ */}
        {/* MODE: PICKUP (Dynamic Pickup Points Selection)              */}
        {/* ============================================================ */}
        {mode === 'pickup' && (
          <g>
            <g transform="translate(180, 290)">
              <circle cx="0" cy="0" r="12" fill="#3B82F6" opacity="0.25" />
              <circle cx="0" cy="0" r="6" fill="#2563EB" />
              <text x="-35" y="18" fill="#1E3A8A" fontSize="9" fontWeight="700">You (Passenger)</text>
              <line x1="0" y1="0" x2="30" y2="-30" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="3 3" />
            </g>

            {pickupPoints.map(p => {
              const isSelected = selectedPickup === p.name;
              return (
                <g
                  key={p.id}
                  transform={`translate(${p.x}, ${p.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectPickup && onSelectPickup(p)}
                >
                  {p.isBest && (
                    <circle cx="0" cy="0" r="22" fill="#10B981" opacity="0.2" className="rm-pulse-anim" />
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
                  {p.isBest && (
                    <g transform="translate(14, -14)">
                      <rect x="0" y="0" width="62" height="16" rx="8" fill="#059669" />
                      <text x="31" y="11" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">94% Match</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* ============================================================ */}
        {/* MODE: TRACKING (Active Journey Moving Vehicle)              */}
        {/* ============================================================ */}
        {mode === 'tracking' && (
          <g transform={`translate(${showDeviation ? devX : carX}, ${showDeviation ? devY : carY})`}>
            <circle cx="0" cy="0" r="18" fill="#10B981" opacity="0.3" className="rm-pulse-anim" />
            <circle cx="0" cy="0" r="11" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="5" fill="#10B981" />
            <g transform="translate(14, -28)">
              <rect x="0" y="0" width="78" height="22" rx="11" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
              <circle cx="10" cy="11" r="3" fill="#10B981" />
              <text x="44" y="15" fill="#0F172A" fontSize="9" fontWeight="700" textAnchor="middle">
                {showDeviation ? 'Deviated!' : 'Arriving in 3m'}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Floating Map Zoom & Recenter Controls */}
      <div
        style={{
          position: 'absolute',
          right: 14,
          top: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 10
        }}
      >
        <button
          onClick={() => setZoom(z => Math.min(z + 0.2, 1.8))}
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
          aria-label="Zoom in"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.2, 0.8))}
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
          aria-label="Zoom out"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => setZoom(1)}
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
          aria-label="Recenter"
        >
          <Compass size={16} />
        </button>
      </div>
    </div>
  );
};
