// ==============================================================================
// SCREEN 18: RIDE-SPECIFIC CHAT & MESSAGING
// Meets Section 17 requirements:
// Ride context header + Text messages + Timestamps + Read state (double ticks) +
// Quick replies + Real-time Firestore sync integration
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ArrowLeft, Phone, Send, CheckCheck, Navigation, ShieldCheck } from 'lucide-react';

export const Screen18_Chat = () => {
  const { chatMessages, sendChatMessage, selectedDriver, searchParams, goToScreen, goBack } = useRideMesh();
  const [inputText, setInputText] = useState('');

  const driver = selectedDriver || {
    driverName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    vehicle: 'Tata Nexon EV (UP16AB****)',
    from: searchParams.from || 'Greater Noida',
    to: searchParams.to || 'Noida Sector 62',
    time: '09:00 AM'
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickAction = (text) => {
    sendChatMessage(text);
  };

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
      {/* Top Header */}
      <div>
        <AndroidStatusBar />
        {/* Driver Bar */}
        <div
          style={{
            padding: '10px 16px',
            background: 'var(--rm-surface)',
            borderBottom: '1px solid var(--rm-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => goBack()}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--rm-text-primary)'
              }}
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <img
              src={driver.avatar}
              alt={driver.driverName}
              style={{ width: 40, height: 40, borderRadius: 14, objectFit: 'cover', border: '1.5px solid #059669' }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <h3 style={{ fontSize: '0.94rem', fontWeight: '700', color: 'var(--rm-text-primary)', margin: 0 }}>
                  {driver.driverName}
                </h3>
                <ShieldCheck size={14} color="#059669" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#059669', fontWeight: '600' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                <span>Online • Verified Driver</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(`Calling driver at masked proxy number: +91 80000 12345 (Masked for privacy)`)}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(5, 150, 105, 0.12)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              cursor: 'pointer'
            }}
            aria-label="Call Driver"
          >
            <Phone size={17} />
          </button>
        </div>

        {/* Ride Context Header Strip */}
        <div
          style={{
            background: '#F0FDF4',
            borderBottom: '1px solid #BBF7D0',
            padding: '7px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#064E3B', fontWeight: '600' }}>
            <Navigation size={12} color="#059669" />
            <span>{driver.from} → {driver.to}</span>
          </div>
          <span style={{ color: '#047857', fontWeight: '700' }}>
            Departs {driver.time || '09:00 AM'}
          </span>
        </div>
      </div>

      {/* Message History List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* System Ride Notice */}
        <div style={{ alignSelf: 'center', background: 'var(--rm-surface)', border: '1px solid var(--rm-border)', borderRadius: 12, padding: '6px 12px', fontSize: '0.7rem', color: 'var(--rm-text-muted)', textAlign: 'center' }}>
          🔒 Masked Chat active. Never share OTPs or payment passwords.
        </div>

        {chatMessages.map(msg => {
          const isMe = msg.sender === 'passenger' || msg.senderRole === 'passenger';
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  padding: '9px 14px',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMe ? '#059669' : 'var(--rm-surface)',
                  color: isMe ? '#FFFFFF' : 'var(--rm-text-primary)',
                  fontSize: '0.88rem',
                  lineHeight: 1.4,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  border: isMe ? 'none' : '1px solid var(--rm-border)'
                }}
              >
                {msg.text}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, padding: '0 4px' }}>
                <span style={{ fontSize: '0.64rem', color: 'var(--rm-text-muted)' }}>
                  {msg.timestamp || 'Just now'}
                </span>
                {isMe && <CheckCheck size={12} color="#059669" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Chips & Input Area */}
      <div style={{ background: 'var(--rm-surface)', borderTop: '1px solid var(--rm-border)', padding: '10px 16px 20px 16px' }}>
        {/* Quick action chips (Section 29) */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
          {["I'm here", "5 min away", "Where are you?", "Please wait"].map(chip => (
            <button
              key={chip}
              onClick={() => handleQuickAction(chip)}
              className="rm-chip"
              style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', padding: '5px 10px' }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="text"
            className="rm-input rm-input-noicon"
            placeholder="Type a message..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            style={{ padding: '10px 14px', fontSize: '0.9rem' }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: inputText.trim() ? '#059669' : '#94A3B8',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() ? 'pointer' : 'default',
              boxShadow: inputText.trim() ? '0 4px 12px rgba(5, 150, 105, 0.3)' : 'none'
            }}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
