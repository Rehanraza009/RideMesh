// ==============================================================================
// SCREEN 26: PROFESSIONAL USER PROFILE
// Meets Section 15 requirements:
// Profile Photo + Name + Rating + Verified Badge + Trips Completed +
// List Sections: Personal Information, Vehicle, Preferences, Saved Places, Payment,
// Notifications, Privacy & Security, Help & Support, Terms, Logout + 5-Tab Nav
// ==============================================================================
import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { AndroidBottomNav } from '../common/AndroidBottomNav';
import {
  User,
  Car,
  Sliders,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Star,
  ShieldCheck,
  CheckCircle2,
  Repeat
} from 'lucide-react';

export const Screen26_Profile = () => {
  const { user, role, setRole, activeMode, toggleActiveMode, logout, goToScreen, setIsNotificationOpen } = useRideMesh();

  const handleLogout = async () => {
    await logout();
  };

  const displayName = user?.name || 'Mohd Rehan';
  const displayAvatar = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
  const displayRating = user?.rating || 4.8;
  const tripsCompleted = user?.totalRides || user?.rides || 24;

  const profileSections = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: <User size={18} color="#059669" />,
      detail: user?.email || 'rehan@ridemesh.ai',
      action: () => alert(`Name: ${displayName}\nEmail: ${user?.email || 'rehan@ridemesh.ai'}\nPhone: ${user?.phone || '+91 98765 43210'}`)
    },
    {
      id: 'vehicle',
      label: 'Vehicle',
      icon: <Car size={18} color="#059669" />,
      detail: role === 'driver' ? 'Tata Nexon EV (UP16AB****)' : 'Add vehicle to become driver',
      action: () => goToScreen(23)
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: <Sliders size={18} color="#059669" />,
      detail: 'AC, Music, Detour settings',
      action: () => goToScreen(9)
    },
    {
      id: 'saved_places',
      label: 'Saved Places',
      icon: <MapPin size={18} color="#059669" />,
      detail: 'Work, College, Home',
      action: () => goToScreen(8)
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: <CreditCard size={18} color="#059669" />,
      detail: 'UPI & RideMesh Balance',
      action: () => alert('RideMesh Wallet Balance: ₹420\nUPI: Linked to Verified Bank')
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={18} color="#059669" />,
      detail: 'Push & Trip alerts active',
      action: () => setIsNotificationOpen(true)
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: <Shield size={18} color="#059669" />,
      detail: 'Masked numbers, SOS contacts',
      action: () => goToScreen(17)
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle size={18} color="#059669" />,
      detail: '24/7 dedicated assistance',
      action: () => alert('RideMesh Support 24/7: support@ridemesh.ai\nHelpline: 1800-RIDE-MESH')
    },
    {
      id: 'terms',
      label: 'Terms & Conditions',
      icon: <FileText size={18} color="#059669" />,
      detail: 'Privacy policy & carpool guidelines',
      action: () => alert('RideMesh Carpool Terms v2.4 (2026)\nCompliant with Indian Motor Vehicles Carpool Rules.')
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
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
        <AndroidStatusBar />

        {/* Profile Card Header */}
        <div
          style={{
            padding: '16px 20px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{ position: 'relative', width: 84, height: 84, marginBottom: 12 }}>
            <img
              src={displayAvatar}
              alt={displayName}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 28,
                objectFit: 'cover',
                border: '3px solid #059669',
                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.25)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                background: '#059669',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: 4,
                display: 'flex',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}
            >
              <ShieldCheck size={16} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h2
              style={{
                fontFamily: 'var(--rm-font-display)',
                fontSize: '1.35rem',
                fontWeight: '800',
                color: 'var(--rm-text-primary)',
                margin: 0
              }}
            >
              {displayName}
            </h2>
            <CheckCircle2 size={16} color="#059669" />
          </div>

          {/* Rating + Trips Completed Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.86rem', fontWeight: '800', color: '#B45309' }}>
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              <span>{displayRating}</span>
            </div>
            <span style={{ color: 'var(--rm-text-muted)' }}>•</span>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#059669' }}>
              Verified Profile
            </span>
            <span style={{ color: 'var(--rm-text-muted)' }}>•</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--rm-text-secondary)', fontWeight: '600' }}>
              {tripsCompleted} Trips Completed
            </span>
          </div>

          {/* Section 1 & 30: Switch Mode Card */}
          <div style={{ width: '100%', marginTop: 16 }}>
            <div
              onClick={toggleActiveMode}
              style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
                border: '1.5px solid #A7F3D0',
                borderRadius: 16,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: '#059669',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Repeat size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    SWITCH MODE
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: '800', color: '#064E3B' }}>
                    Currently: {activeMode === 'driver' ? 'Driver Mode 🛺' : 'Passenger Mode 🚗'}
                  </div>
                </div>
              </div>

              <span
                style={{
                  background: '#059669',
                  color: 'white',
                  borderRadius: 20,
                  padding: '6px 12px',
                  fontSize: '0.74rem',
                  fontWeight: '700'
                }}
              >
                Switch to {activeMode === 'driver' ? 'Passenger' : 'Driver'}
              </span>
            </div>
          </div>
        </div>

        {/* List of Sections with Icons */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="rm-card" style={{ padding: '4px 6px', overflow: 'hidden' }}>
            {profileSections.map((item, index) => (
              <div
                key={item.id}
                onClick={item.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 12px',
                  cursor: 'pointer',
                  borderBottom: index < profileSections.length - 1 ? '1px solid var(--rm-border-subtle)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: 'rgba(5, 150, 105, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--rm-text-primary)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--rm-text-muted)' }}>
                      {item.detail}
                    </div>
                  </div>
                </div>

                <ChevronRight size={16} color="var(--rm-text-muted)" />
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              padding: '14px',
              borderRadius: 16,
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: '#DC2626',
              fontSize: '0.92rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.08)'
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 5-Tab Universal Bottom Navigation */}
      <AndroidBottomNav />
    </div>
  );
};
