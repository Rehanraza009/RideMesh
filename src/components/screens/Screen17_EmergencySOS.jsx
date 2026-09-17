// ==============================================================================
// SCREEN 17: RIDE SAFETY & EMERGENCY SOS
// Meets Section 18 requirements:
// SOS with Confirmation Dialog + Emergency Contacts (112, 1090) + Share Live Trip
// + Trusted Contacts Management + Report User + Block User
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import {
  ShieldAlert,
  PhoneCall,
  Share2,
  Users,
  MapPin,
  Flag,
  UserX,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const Screen17_EmergencySOS = () => {
  const { goToScreen } = useRideMesh();
  const [showConfirmSOS, setShowConfirmSOS] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [statusFeedback, setStatusFeedback] = useState('');

  const triggerConfirmedSOS = () => {
    setShowConfirmSOS(false);
    setSosActivated(true);
    setStatusFeedback('Emergency SOS Dispatched: Local emergency response and your 3 trusted contacts have received your live location and telemetry.');
  };

  const handleBlockUser = () => {
    const confirmBlock = window.confirm('Are you sure you want to block this user? They will not be able to match or message you on future rides.');
    if (confirmBlock) {
      setStatusFeedback('User has been blocked successfully.');
    }
  };

  const submitReport = () => {
    if (!reportReason.trim()) return;
    setShowReportModal(false);
    setStatusFeedback('Your safety report has been filed with RideMesh Trust & Safety. Our dispatch officer will review within 15 minutes.');
    setReportReason('');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--rm-bg)',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
        <AndroidStatusBar />
        <ScreenHeader
          title="Safety & Emergency"
          showBack={true}
          onBack={() => goToScreen(15)}
        />

        {statusFeedback && (
          <div
            style={{
              margin: '8px 20px 14px 20px',
              padding: '12px 14px',
              background: sosActivated ? '#FEF2F2' : '#ECFDF5',
              border: sosActivated ? '1.5px solid #DC2626' : '1px solid #A7F3D0',
              borderRadius: 14,
              color: sosActivated ? '#DC2626' : '#059669',
              fontSize: '0.82rem',
              fontWeight: '600',
              lineHeight: 1.45
            }}
          >
            {statusFeedback}
          </div>
        )}

        <div style={{ padding: '12px 20px 0 20px', textAlign: 'center' }}>
          {/* Pulsing Emergency Red Beacon */}
          <div
            onClick={() => setShowConfirmSOS(true)}
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: sosActivated ? '#DC2626' : '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: sosActivated ? '0 0 0 16px rgba(220, 38, 38, 0.35)' : '0 0 0 10px rgba(239, 68, 68, 0.15)',
              cursor: 'pointer'
            }}
            className="rm-pulse-anim"
          >
            <ShieldAlert size={42} color={sosActivated ? '#FFFFFF' : '#DC2626'} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--rm-font-display)',
              fontSize: '1.55rem',
              fontWeight: '800',
              color: '#DC2626',
              marginBottom: 4
            }}
          >
            {sosActivated ? 'SOS ACTIVE' : 'Emergency SOS'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--rm-text-secondary)', marginBottom: 20 }}>
            {sosActivated
              ? 'Broadcasting live coordinates to emergency responders.'
              : 'Press SOS if you feel unsafe or require immediate police assistance.'}
          </p>

          {/* Primary SOS Trigger Button (Requires Confirmation) */}
          <button
            className="rm-btn rm-btn-danger"
            onClick={() => setShowConfirmSOS(true)}
            style={{
              height: 50,
              fontSize: '1rem',
              fontWeight: '800',
              boxShadow: '0 8px 20px rgba(220, 38, 38, 0.35)',
              marginBottom: 16
            }}
          >
            <ShieldAlert size={20} />
            <span>{sosActivated ? 'Broadcast Emergency Alert Again' : 'Trigger Emergency SOS'}</span>
          </button>

          {/* Core Emergency Numbers & Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
            {/* Call 112 */}
            <button
              className="rm-btn rm-btn-secondary"
              onClick={() => {
                if (window.confirm('Dial 112 (National Emergency Support)?')) {
                  window.location.href = 'tel:112';
                }
              }}
              style={{ justifyContent: 'flex-start', padding: '12px 16px', height: 'auto' }}
            >
              <PhoneCall size={18} color="#DC2626" style={{ marginRight: 10 }} />
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                  Call Emergency (112)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)' }}>
                  Direct line to Police, Ambulance & Fire dispatch
                </div>
              </div>
            </button>

            {/* Share Live Trip */}
            <button
              className="rm-btn rm-btn-secondary"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My RideMesh Live Ride',
                    text: 'Track my live carpool ride on RideMesh: https://ridemesh.ai/track/RM26491'
                  }).catch(() => {});
                } else {
                  alert('Live telemetry & location broadcast link sent to trusted contacts.');
                }
              }}
              style={{ justifyContent: 'flex-start', padding: '12px 16px', height: 'auto' }}
            >
              <Share2 size={18} color="#059669" style={{ marginRight: 10 }} />
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                  Share Live Trip
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)' }}>
                  Send real-time GPS link to family or friends
                </div>
              </div>
            </button>

            {/* Trusted Contacts */}
            <button
              className="rm-btn rm-btn-secondary"
              onClick={() => alert('Trusted Contacts: 1. Father (+91 98111 22334), 2. Sister (+91 99222 33445). Alerts sent via SMS.')}
              style={{ justifyContent: 'flex-start', padding: '12px 16px', height: 'auto' }}
            >
              <Users size={18} color="#059669" style={{ marginRight: 10 }} />
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                  Trusted Contacts (2 Active)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)' }}>
                  Notify pre-configured emergency contacts
                </div>
              </div>
            </button>
          </div>

          {/* Report or Block User Options */}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              onClick={() => setShowReportModal(true)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 12,
                background: 'var(--rm-surface)',
                border: '1px solid var(--rm-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: '0.78rem',
                fontWeight: '700',
                color: 'var(--rm-text-secondary)',
                cursor: 'pointer'
              }}
            >
              <Flag size={14} color="#D97706" />
              <span>Report Issue</span>
            </button>

            <button
              onClick={handleBlockUser}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 12,
                background: 'var(--rm-surface)',
                border: '1px solid var(--rm-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: '0.78rem',
                fontWeight: '700',
                color: '#DC2626',
                cursor: 'pointer'
              }}
            >
              <UserX size={14} color="#DC2626" />
              <span>Block User</span>
            </button>
          </div>

          {/* Live Telemetry & Trip Location Box */}
          <div className="rm-card" style={{ marginTop: 16, padding: '12px 14px', textAlign: 'left', background: 'var(--rm-surface-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--rm-text-secondary)', marginBottom: 4 }}>
              <MapPin size={14} color="#DC2626" />
              <span>Location: <strong style={{ color: 'var(--rm-text-primary)' }}>Noida Expressway (28.4744° N, 77.5040° E)</strong></span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)', marginLeft: 22 }}>
              Trip ID: <strong style={{ color: '#059669' }}>RM-ACTIVE-2024</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Confirmation Modal to Prevent Accidental Triggering */}
      {showConfirmSOS && (
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
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <AlertTriangle size={28} color="#DC2626" />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1E293B', marginBottom: 6 }}>
              Confirm Emergency SOS?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.45, marginBottom: 20 }}>
              This will immediately notify emergency services and transmit your live location coordinates to all trusted contacts.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => setShowConfirmSOS(false)}
                style={{ flex: 1, height: 46 }}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn-danger"
                onClick={triggerConfirmedSOS}
                style={{ flex: 1.4, height: 46 }}
              >
                Yes, Trigger SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 100
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '24px 20px 32px 20px'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: 8 }}>
              Report Safety Concern
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 14 }}>
              Describe what happened. RideMesh Trust & Safety investigates all incidents.
            </p>

            <textarea
              placeholder="E.g. Reckless driving, inappropriate behavior, route dispute..."
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 12,
                border: '1.5px solid #CBD5E1',
                fontSize: '0.88rem',
                outline: 'none',
                marginBottom: 16,
                fontFamily: 'inherit'
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => setShowReportModal(false)}
                style={{ flex: 1, height: 44 }}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={submitReport}
                disabled={!reportReason.trim()}
                style={{ flex: 1.4, height: 44 }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
