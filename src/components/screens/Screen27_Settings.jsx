import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import {
  Bell,
  MapPin,
  Moon,
  Globe,
  Lock,
  FileText,
  Info,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { authService } from '../../services/authService';

export const Screen27_Settings = () => {
  const { theme, toggleTheme, goToScreen } = useRideMesh();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', justifyContent: 'space-between' }}>
      <div>
        <AndroidStatusBar />
        <ScreenHeader title="Settings" showBack={true} onBack={() => goToScreen(26)} />

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* System Switches Group */}
          <div className="rm-card" style={{ padding: '8px 14px' }}>
            {/* Notifications switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--rm-border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Bell size={18} color="var(--rm-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--rm-text-primary)' }}>Notifications</span>
              </div>
              <div
                onClick={() => setNotifications(!notifications)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: notifications ? 'var(--rm-primary)' : 'var(--rm-border)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: notifications ? 23 : 3, transition: 'all 0.2s' }} />
              </div>
            </div>

            {/* Location switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--rm-border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <MapPin size={18} color="var(--rm-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--rm-text-primary)' }}>Location</span>
              </div>
              <div
                onClick={() => setLocation(!location)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: location ? 'var(--rm-primary)' : 'var(--rm-border)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: location ? 23 : 3, transition: 'all 0.2s' }} />
              </div>
            </div>

            {/* Dark Mode switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Moon size={18} color="var(--rm-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--rm-text-primary)' }}>Dark Mode</span>
              </div>
              <div
                onClick={toggleTheme}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: theme === 'dark' ? 'var(--rm-primary)' : 'var(--rm-border)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: theme === 'dark' ? 23 : 3, transition: 'all 0.2s' }} />
              </div>
            </div>
          </div>

          {/* Links Group */}
          <div className="rm-card" style={{ padding: '8px 14px' }}>
            {/* Language */}
            <div
              onClick={() => alert('Current Language: English')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--rm-border-subtle)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Globe size={18} color="var(--rm-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--rm-text-primary)' }}>Language</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--rm-text-muted)' }}>English &gt;</span>
            </div>

            {/* Privacy */}
            <div
              onClick={() => alert('RideMesh Privacy Policy: End-to-end telemetry encryption enabled.')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--rm-border-subtle)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Lock size={18} color="var(--rm-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--rm-text-primary)' }}>Privacy</span>
              </div>
              <ChevronRight size={16} color="var(--rm-text-muted)" />
            </div>

            {/* Terms & Conditions */}
            <div
              onClick={() => alert('RideMesh Mobility Terms & Community Guidelines.')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--rm-border-subtle)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FileText size={18} color="var(--rm-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--rm-text-primary)' }}>Terms & Conditions</span>
              </div>
              <ChevronRight size={16} color="var(--rm-text-muted)" />
            </div>

            {/* About */}
            <div
              onClick={() => alert('RideMesh v1.0.0 — AI Carpooling Mobility System')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Info size={18} color="var(--rm-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--rm-text-primary)' }}>About</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--rm-text-muted)' }}>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '20px' }}>
        <button
          className="rm-btn rm-btn-danger-outline"
          onClick={async () => {
            await authService.logout();
            goToScreen(5);
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
