// ==============================================================================
// SCREEN 8: PASSENGER HOME (MAP-FIRST MOBILITY EXPERIENCE)
// Meets Section 5 requirements:
// Top: Profile avatar + "Good morning, [Name] 👋" + Notification Icon + Mode Switcher
// Map: Dominant interactive map with current location + 4 nearby moving drivers
// Bottom Sheet:
//   "Where are you going?"
//   From: 📍 Current location
//   To: 📍 Search destination (opens DestinationSearchSheet)
//   Today • 9:00 AM | 1 Passenger
//   Primary CTA: "Find a Ride" (triggers 4-step AI animated loader)
//   AI Suggestion pill: "4 compatible rides found near your route." [View Matches]
// Bottom Navigation: Home | Rides | Map | Activity | Profile
// ==============================================================================
import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { AndroidBottomNav } from '../common/AndroidBottomNav';
import { GoogleMapView } from '../common/GoogleMapView';
import {
  Bell,
  MapPin,
  Calendar,
  Clock,
  Users,
  Navigation,
  Sparkles,
  ArrowRight,
  Repeat,
  Search,
  ChevronRight,
  Edit3
} from 'lucide-react';

export const Screen8_HomePassenger = () => {
  const {
    user,
    role,
    activeMode,
    toggleActiveMode,
    searchParams,
    setIsDestinationSearchOpen,
    setIsLocationPickerOpen,
    setIsLocationPermissionModalOpen,
    triggerAIFindRides,
    goToScreen,
    setIsNotificationOpen,
    deviceLocation,
    setSelectedDriver,
    matchedRides
  } = useRideMesh();

  const displayName = user?.name ? (user.name.split(' ')[1] || user.name.split(' ')[0]) : 'Rehan';
  const displayAvatar = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

  const handleSelectNearbyDriver = (driver) => {
    const match = matchedRides.find(r => r.driverName.includes(driver.name.split(' ')[0])) || matchedRides[0];
    if (match) {
      setSelectedDriver(match);
      goToScreen(11); // Driver Details
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#E8EFEA',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <AndroidStatusBar />

      {/* Floating Top App Bar over Map */}
      <div
        style={{
          position: 'absolute',
          top: 44,
          left: 16,
          right: 16,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20,
          padding: '10px 16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}
      >
        {/* Profile Avatar & Greeting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => goToScreen(26)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              border: '2px solid #059669',
              padding: 0,
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'none',
              flexShrink: 0
            }}
            aria-label="Profile"
          >
            <img
              src={displayAvatar}
              alt={displayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>
              Good morning,
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0F172A' }}>
                {displayName}
              </span>
              <span style={{ fontSize: '0.95rem' }}>👋</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Mode Switcher (if dual role) + Notification Bell */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {role === 'both' && (
            <button
              onClick={toggleActiveMode}
              style={{
                padding: '5px 10px',
                borderRadius: 14,
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#059669',
                fontSize: '0.72rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer'
              }}
              title="Switch to Driver Mode"
            >
              <Repeat size={12} />
              <span>Drive Mode</span>
            </button>
          )}

          {/* Notification Bell with green unread dot */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1E293B',
              cursor: 'pointer',
              position: 'relative'
            }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#059669',
                position: 'absolute',
                top: 8,
                right: 8
              }}
            />
          </button>
        </div>
      </div>

      {/* Dominant Google Map Area with Live Drivers & User Beacon */}
      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
        <GoogleMapView
          mode="home-passenger"
          center={deviceLocation?.latitude ? { lat: deviceLocation.latitude, lng: deviceLocation.longitude } : undefined}
          userLocation={deviceLocation?.latitude ? { lat: deviceLocation.latitude, lng: deviceLocation.longitude } : null}
          height="100%"
        />
      </div>

      {/* Map-First Rounded Bottom Search Sheet */}
      <div
        style={{
          background: '#FFFFFF',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '16px 20px 10px 20px',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.12)',
          zIndex: 25,
          borderTop: '1px solid #F1F5F9'
        }}
      >
        {/* Subtle Drag Indicator */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: '#CBD5E1', margin: '0 auto 12px auto' }} />

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--rm-font-display)',
            fontSize: '1.12rem',
            fontWeight: '800',
            color: '#0F172A',
            margin: '0 0 12px 0'
          }}
        >
          Where are you going?
        </h3>

        {/* Origin / Destination Group (Sections 6, 8, 10) */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: 18,
            padding: '10px 14px',
            marginBottom: 12
          }}
        >
          {/* Origin (Tappable: Opens "Choose pickup location" modal) */}
          <div
            onClick={() => setIsLocationPickerOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingBottom: 8,
              borderBottom: '1px solid #E2E8F0',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                FROM • TAP TO EDIT PICKUP
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0F172A' }}>
                {searchParams.from || 'Current Location'}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: '#059669',
                fontSize: '0.72rem',
                fontWeight: '700',
                background: '#ECFDF5',
                padding: '4px 8px',
                borderRadius: 8
              }}
            >
              <span>Edit</span>
              <ChevronRight size={13} />
            </div>
          </div>

          {/* Destination (Clickable: Opens DestinationSearchSheet) */}
          <div
            onClick={() => setIsDestinationSearchOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8, cursor: 'pointer' }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: '2.5px solid #DC2626', flexShrink: 0 }} />
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                TO
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#059669' }}>
                {searchParams.to || 'Search destination...'}
              </span>
            </div>
            <Search size={16} color="#059669" />
          </div>
        </div>

        {/* Date, Time & Passengers Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F1F5F9', borderRadius: 12, padding: '8px 14px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
            <Calendar size={14} color="#059669" />
            <span>Today • {searchParams.time}</span>
          </div>

          <div style={{ width: 1, height: 16, background: '#CBD5E1' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
            <Users size={14} color="#059669" />
            <span>1 Passenger</span>
          </div>

          <span
            onClick={() => goToScreen(9)}
            style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '700', cursor: 'pointer' }}
          >
            Preferences
          </span>
        </div>

        {/* Primary Action Button: "Find a Ride" */}
        <button
          className="rm-btn rm-btn-primary"
          onClick={() => triggerAIFindRides()}
          style={{
            height: 48,
            fontSize: '1rem',
            fontWeight: '800',
            borderRadius: 24,
            boxShadow: '0 8px 20px rgba(5, 150, 105, 0.35)',
            marginBottom: 10
          }}
        >
          <span>Find a Ride</span>
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>

        {/* Compact AI Suggestion Pill */}
        <div
          onClick={() => triggerAIFindRides()}
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 14,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1rem' }}>🤖</span>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#064E3B' }}>
                AI Suggestion
              </div>
              <div style={{ fontSize: '0.72rem', color: '#047857' }}>
                4 compatible rides found near your route.
              </div>
            </div>
          </div>

          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: 2 }}>
            View Matches <ArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <AndroidBottomNav />
    </div>
  );
};
