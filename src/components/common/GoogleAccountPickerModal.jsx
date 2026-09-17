// ==============================================================================
// GOOGLE ACCOUNT PICKER MODAL (DEMO AUTHENTICATION FLOW)
// Zero-friction demo accounts: Passenger, Driver, and Both (Dual Role)
// Clearly marked as Demo Accounts ready for Firebase Authentication
// ==============================================================================
import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const GoogleAccountPickerModal = () => {
  const { isGooglePickerOpen, setIsGooglePickerOpen, loginWithDemo, demoAccounts } = useRideMesh();

  if (!isGooglePickerOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
      onClick={() => setIsGooglePickerOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#FFFFFF',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '24px 20px 32px 20px',
          boxShadow: '0 -12px 36px rgba(0, 0, 0, 0.25)',
          animation: 'rmSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: '#CBD5E1',
            margin: '0 auto 16px auto'
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Google G Logo */}
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Sign in with Google
            </h3>
          </div>

          <button
            onClick={() => setIsGooglePickerOpen(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.4, margin: '0 0 16px 0' }}>
          Select a verified demo account to test the complete RideMesh experience:
        </p>

        {/* Demo Account Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {demoAccounts.map(acc => (
            <div
              key={acc.id}
              onClick={() => loginWithDemo(acc.id)}
              style={{
                padding: '14px 16px',
                borderRadius: 18,
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#059669';
                e.currentTarget.style.background = '#F0FDF4';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.background = '#F8FAFC';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 16,
                    objectFit: 'cover',
                    border: '2px solid #059669'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0F172A' }}>
                      {acc.name}
                    </span>
                    <span
                      style={{
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#059669',
                        fontSize: '0.64rem',
                        fontWeight: '700',
                        padding: '1px 6px',
                        borderRadius: 6
                      }}
                    >
                      {acc.roleLabel}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 1 }}>
                    {acc.email}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600', marginTop: 2 }}>
                    {acc.desc}
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: '#ECFDF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669'
                }}
              >
                <CheckCircle2 size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Demo Notice */}
        <div
          style={{
            background: '#F1F5F9',
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.74rem',
            color: '#475569'
          }}
        >
          <Sparkles size={16} color="#059669" flexShrink={0} />
          <span>
            <strong>Demo Mode:</strong> Logs in instantly with full mock mobility data. Connects cleanly to Firebase Auth when production credentials are configured.
          </span>
        </div>
      </div>
    </div>
  );
};
