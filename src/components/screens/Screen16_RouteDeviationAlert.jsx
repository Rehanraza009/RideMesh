import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { InteractiveMap } from '../common/InteractiveMap';
import { AlertTriangle, Phone, Map, ShieldAlert, X } from 'lucide-react';

export const Screen16_RouteDeviationAlert = () => {
  const { goToScreen } = useRideMesh();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0F172A', position: 'relative' }}>
      <AndroidStatusBar darkContent={false} />

      {/* Map showing Route Deviation with red dashed detour */}
      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
        <InteractiveMap mode="deviation" showDeviation={true} height="100%" />

        {/* Top Dismiss Button */}
        <button
          onClick={() => goToScreen(15)}
          style={{
            position: 'absolute',
            top: 48,
            right: 18,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Red Route Deviation Emergency Alert Bottom Sheet */}
      <div
        style={{
          background: 'var(--rm-surface)',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          boxShadow: '0 -10px 30px rgba(239, 68, 68, 0.25)',
          padding: '24px 20px',
          zIndex: 30,
          borderTop: '3px solid #EF4444'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444'
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#DC2626' }}>
              Route Deviation Detected
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--rm-text-secondary)' }}>
              The driver seems to be off the expected route.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          <button
            className="rm-btn rm-btn-secondary"
            onClick={() => alert('Calling Rahul Sharma at +91 98765 12345')}
            style={{ fontSize: '0.88rem', padding: '12px' }}
          >
            <Phone size={16} color="var(--rm-primary)" />
            <span>Contact Driver</span>
          </button>

          <button
            className="rm-btn rm-btn-secondary"
            onClick={() => goToScreen(15)}
            style={{ fontSize: '0.88rem', padding: '12px' }}
          >
            <Map size={16} color="var(--rm-text-secondary)" />
            <span>View on Map</span>
          </button>

          <button
            className="rm-btn rm-btn-danger-outline"
            onClick={() => alert('Emergency SMS with live GPS location dispatched to your emergency contacts.')}
            style={{ fontSize: '0.88rem', padding: '12px' }}
          >
            <ShieldAlert size={16} />
            <span>Notify Emergency Contact</span>
          </button>

          {/* Big SOS Button */}
          <button
            className="rm-btn rm-btn-danger"
            onClick={() => goToScreen(17)}
            style={{ fontSize: '1rem', fontWeight: '800', padding: '14px', marginTop: 4 }}
          >
            SOS
          </button>
        </div>
      </div>
    </div>
  );
};
