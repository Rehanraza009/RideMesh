// ==============================================================================
// NOTIFICATION CENTER MODAL / BOTTOM SHEET
// ==============================================================================
import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Navigation,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useRideMesh } from '../../context/RideMeshContext';

export const NotificationCenter = ({ isOpen, onClose }) => {
  const { goToScreen } = useRideMesh();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isOpen) return;
    const unsub = notificationService.subscribeNotifications('user_default', (list) => {
      setNotifications(list);
    });
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead('user_default');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = async (notif) => {
    await notificationService.markAsRead(notif.id);
    onClose();
    if (notif.type === 'ride') {
      goToScreen(15); // Active ride or requests
    } else if (notif.type === 'chat') {
      goToScreen(18); // Chat
    } else if (notif.type === 'safety') {
      goToScreen(17); // SOS
    } else if (notif.type === 'ai') {
      goToScreen(24); // AI Insights
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ride':
        return <Navigation size={18} color="#059669" />;
      case 'chat':
        return <MessageSquare size={18} color="#0284C7" />;
      case 'safety':
        return <ShieldAlert size={18} color="#DC2626" />;
      case 'ai':
        return <Sparkles size={18} color="#10B981" />;
      default:
        return <Info size={18} color="#64748B" />;
    }
  };

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--rm-surface)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 20px 14px 20px',
            borderBottom: '1px solid var(--rm-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'var(--rm-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--rm-primary)'
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                Notifications
              </h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)' }}>
                {notifications.filter(n => !n.read).length} unread updates
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleMarkAllRead}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--rm-primary)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              title="Mark all as read"
            >
              <CheckCheck size={16} />
              <span>Mark Read</span>
            </button>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--rm-surface-subtle)',
                border: '1px solid var(--rm-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--rm-text-secondary)'
              }}
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter Categories */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 20px', overflowX: 'auto', borderBottom: '1px solid var(--rm-border-subtle)' }}>
          {['all', 'ride', 'ai', 'safety', 'chat'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rm-chip ${filter === cat ? 'active' : ''}`}
              style={{ textTransform: 'capitalize', fontSize: '0.74rem', padding: '5px 12px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--rm-text-muted)' }}>
              <Bell size={32} style={{ opacity: 0.4, margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>You're all caught up!</div>
              <div style={{ fontSize: '0.78rem', marginTop: 4 }}>No notifications in this category.</div>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  padding: '14px',
                  borderRadius: 16,
                  background: notif.read ? 'var(--rm-surface)' : 'var(--rm-primary-light)',
                  border: `1px solid ${notif.read ? 'var(--rm-border)' : 'var(--rm-primary-border)'}`,
                  display: 'flex',
                  gap: 12,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: 'var(--rm-surface)',
                    border: '1px solid var(--rm-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {getIcon(notif.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: notif.read ? '700' : '800', color: 'var(--rm-text-primary)' }}>
                      {notif.title}
                    </h3>
                    <span style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)' }}>
                      {notif.time || 'Just now'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--rm-text-secondary)', lineHeight: 1.35 }}>
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--rm-primary)',
                      position: 'absolute',
                      top: 14,
                      right: 14
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
