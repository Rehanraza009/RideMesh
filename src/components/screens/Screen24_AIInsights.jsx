// ==============================================================================
// SCREEN 24: ACTIVITY TAB & AI COMMUTE ASSISTANT
// Meets Section 24 & 26 requirements:
// Tab 1: Chronological Activity feed (Recent rides, Notifications, Requests, Safety events)
// Tab 2: RideMesh AI Commute Assistant:
// "Here's what we found for your commute."
// Your usual route: Greater Noida → Noida, Typical time: 8:30–9:30 AM
// Tomorrow: 🔥 High demand, 7 compatible commuters
// Recommended departure: 08:55 AM, Potential saving: ₹35–₹60
// CTA: Find Best Ride
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { AndroidBottomNav } from '../common/AndroidBottomNav';
import {
  Sparkles,
  Calendar,
  Clock,
  TrendingUp,
  DollarSign,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Zap,
  Flame
} from 'lucide-react';

export const Screen24_AIInsights = () => {
  const { goToScreen } = useRideMesh();
  const [activeTab, setActiveTab] = useState('insights'); // 'insights' | 'activity'

  const activityEvents = [
    {
      id: 'e1',
      title: 'AI Commute Match Found',
      desc: '4 drivers found on your usual Noida Expressway corridor.',
      time: '10m ago',
      type: 'ai',
      icon: <Sparkles size={16} color="#059669" />,
      bg: '#ECFDF5'
    },
    {
      id: 'e2',
      title: 'Ride Request Confirmed',
      desc: 'Seat confirmed with Rahul Sharma for 09:00 AM departure.',
      time: '2h ago',
      type: 'ride',
      icon: <CheckCircle2 size={16} color="#059669" />,
      bg: '#ECFDF5'
    },
    {
      id: 'e3',
      title: 'Payment & Cost Sharing',
      desc: '₹82 fuel contribution settled via RideMesh AutoSplit.',
      time: 'Yesterday',
      type: 'payment',
      icon: <DollarSign size={16} color="#0284C7" />,
      bg: '#E0F2FE'
    },
    {
      id: 'e4',
      title: 'Safety Shield Active',
      desc: 'Trip telemetry monitored. Arrived at Sector 62 safely.',
      time: 'Yesterday',
      type: 'safety',
      icon: <ShieldCheck size={16} color="#059669" />,
      bg: '#ECFDF5'
    }
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        <AndroidStatusBar />
        <ScreenHeader
          title="Activity & Insights"
          showBack={true}
          onBack={() => goToScreen(8)}
        />

        {/* Tab Switcher: AI Commute Insights vs Activity Feed */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 20px 14px 20px' }}>
          <button
            onClick={() => setActiveTab('insights')}
            className={`rm-chip ${activeTab === 'insights' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center', padding: '9px 0', fontSize: '0.82rem', fontWeight: '700' }}
          >
            <Sparkles size={14} />
            <span>AI Commute</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`rm-chip ${activeTab === 'activity' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center', padding: '9px 0', fontSize: '0.82rem', fontWeight: '700' }}
          >
            <Clock size={14} />
            <span>Recent Activity</span>
          </button>
        </div>

        {/* TAB 1: AI COMMUTE INSIGHTS */}
        {activeTab === 'insights' && (
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Friendly AI Assistant Banner */}
            <div
              className="rm-card"
              style={{
                padding: '18px',
                background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
                border: '1.5px solid #A7F3D0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={17} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#064E3B', margin: 0 }}>
                    RideMesh AI
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                    Smart Commute Assistant
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#047857', fontWeight: '600', margin: '4px 0 14px 0' }}>
                "Here's what we found for your commute tomorrow."
              </p>

              {/* Usual Route Details */}
              <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '12px', border: '1px solid #BBF7D0', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--rm-text-muted)', fontWeight: '700' }}>YOUR USUAL ROUTE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.94rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                  <span>Greater Noida</span>
                  <span style={{ color: '#059669' }}>→</span>
                  <span>Noida</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--rm-text-secondary)' }}>
                  Typical time: <strong>8:30 – 9:30 AM</strong>
                </div>
              </div>

              {/* Tomorrow's AI Prediction Card */}
              <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '12px', border: '1px solid #BBF7D0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#B45309', fontSize: '0.82rem', fontWeight: '800' }}>
                  <Flame size={16} color="#D97706" />
                  <span>Tomorrow: High demand (7 compatible commuters)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--rm-border-subtle)', paddingTop: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--rm-text-muted)' }}>Recommended departure:</span>
                  <strong style={{ fontSize: '0.92rem', color: '#059669' }}>08:55 AM</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--rm-text-muted)' }}>Potential savings:</span>
                  <strong style={{ fontSize: '1rem', color: '#059669', fontWeight: '800' }}>₹35 – ₹60</strong>
                </div>
              </div>
            </div>

            {/* Traffic Congestion Prediction Graph */}
            <div className="rm-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                  Expressway Traffic Forecast
                </span>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                  Low congestion at 8:55
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 75, padding: '10px 0 0 0' }}>
                {[
                  { time: '8:00', load: 45 },
                  { time: '8:30', load: 80 },
                  { time: '8:55', load: 30, optimal: true },
                  { time: '9:15', load: 90 },
                  { time: '9:45', load: 55 }
                ].map(item => (
                  <div key={item.time} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${item.load}%`,
                        borderRadius: 6,
                        background: item.optimal ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)' : item.load > 70 ? '#F87171' : '#CBD5E1',
                        boxShadow: item.optimal ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none'
                      }}
                    />
                    <span style={{ fontSize: '0.64rem', color: item.optimal ? '#059669' : 'var(--rm-text-muted)', fontWeight: item.optimal ? '800' : '500' }}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary CTA: Find Best Ride */}
            <button
              className="rm-btn rm-btn-primary"
              onClick={() => goToScreen(10)}
              style={{ height: 48, fontSize: '0.96rem', fontWeight: '800' }}
            >
              <span>Find Best Ride</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* TAB 2: CHRONOLOGICAL ACTIVITY FEED */}
        {activeTab === 'activity' && (
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activityEvents.map(event => (
              <div
                key={event.id}
                className="rm-card"
                style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 12, background: event.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {event.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--rm-text-primary)', margin: 0 }}>
                      {event.title}
                    </h4>
                    <span style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)' }}>
                      {event.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--rm-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AndroidBottomNav />
    </div>
  );
};

