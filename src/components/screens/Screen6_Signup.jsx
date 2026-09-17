// ==============================================================================
// SCREEN 6: REAL PRODUCTION FIREBASE SIGN UP SCREEN
// Matches reference mockup:
// Back Arrow + "Create Your Account" + 5 Input Fields (Full Name, Email, Phone,
// Password, Confirm Password) + Terms Checkbox + Green Pill + Login Link
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

export const Screen6_Signup = () => {
  const { goToScreen, goBack } = useRideMesh();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateAccount = async (e) => {
    if (e) e.preventDefault();

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.register(
        email.trim(),
        password,
        fullName.trim(),
        phoneNumber.trim(),
        'passenger'
      );

      if (res.success) {
        localStorage.setItem('ridemesh_onboarded', 'true');
        // Route to Role Selection or Home
        goToScreen(7); // Screen 7: Choose Role (Driver vs Passenger)
      } else {
        setErrorMsg(res.error || 'Failed to create account. Please try again.');
      }
    } catch {
      setErrorMsg('Unable to register. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <AndroidStatusBar />

      {/* Main Scrollable View */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 24px 20px 24px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Back Arrow */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => goToScreen(5)}
            style={{
              background: 'none',
              border: 'none',
              padding: 6,
              marginLeft: -6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#0F172A'
            }}
            aria-label="Back to login"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontFamily: 'var(--rm-font-display)',
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#0F172A',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            Create Your Account
          </h2>
          <p
            style={{
              fontSize: '0.88rem',
              color: '#64748B',
              lineHeight: 1.4,
              margin: 0
            }}
          >
            Join RideMesh and be a part of a cleaner, smarter tomorrow.
          </p>
        </div>

        {/* Inline Error Message */}
        {errorMsg && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              borderRadius: 14,
              padding: '10px 14px',
              fontSize: '0.82rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16
            }}
          >
            <AlertCircle size={18} flexShrink={0} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Full Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14,
              padding: '0 14px',
              height: 50
            }}
          >
            <User size={19} color="#94A3B8" style={{ flexShrink: 0, marginRight: 10 }} />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              autoComplete="name"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.92rem',
                color: '#0F172A',
                fontWeight: '500'
              }}
            />
          </div>

          {/* Email */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14,
              padding: '0 14px',
              height: 50
            }}
          >
            <Mail size={19} color="#94A3B8" style={{ flexShrink: 0, marginRight: 10 }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.92rem',
                color: '#0F172A',
                fontWeight: '500'
              }}
            />
          </div>

          {/* Phone Number */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14,
              padding: '0 14px',
              height: 50
            }}
          >
            <Phone size={19} color="#94A3B8" style={{ flexShrink: 0, marginRight: 10 }} />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              autoComplete="tel"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.92rem',
                color: '#0F172A',
                fontWeight: '500'
              }}
            />
          </div>

          {/* Password */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14,
              padding: '0 14px',
              height: 50,
              position: 'relative'
            }}
          >
            <Lock size={19} color="#94A3B8" style={{ flexShrink: 0, marginRight: 10 }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.92rem',
                color: '#0F172A',
                fontWeight: '500',
                paddingRight: 32
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 14,
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14,
              padding: '0 14px',
              height: 50,
              position: 'relative'
            }}
          >
            <Lock size={19} color="#94A3B8" style={{ flexShrink: 0, marginRight: 10 }} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.92rem',
                color: '#0F172A',
                fontWeight: '500',
                paddingRight: 32
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: 14,
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Terms Agreement Checkbox */}
          <div
            onClick={() => setAgreeTerms(!agreeTerms)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              cursor: 'pointer',
              userSelect: 'none',
              margin: '4px 0 8px 0'
            }}
          >
            <div style={{ paddingTop: 2 }}>
              {agreeTerms ? (
                <CheckSquare size={18} color="#059669" />
              ) : (
                <Square size={18} color="#94A3B8" />
              )}
            </div>
            <span style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
              I agree to the{' '}
              <strong style={{ color: '#059669', fontWeight: '700' }}>Terms & Conditions</strong>
              {' '}and{' '}
              <strong style={{ color: '#059669', fontWeight: '700' }}>Privacy Policy</strong>
            </span>
          </div>

          {/* Green Pill Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 26,
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '1.02rem',
              fontWeight: '700',
              boxShadow: '0 10px 22px rgba(5, 150, 105, 0.35)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
              transition: 'opacity 0.2s ease'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>

      {/* Footer Switch to Login */}
      <div
        style={{
          padding: '16px 24px',
          textAlign: 'center',
          borderTop: '1px solid #F1F5F9',
          background: '#FFFFFF'
        }}
      >
        <span style={{ fontSize: '0.86rem', color: '#64748B' }}>
          Already have an account?{' '}
        </span>
        <button
          onClick={() => goToScreen(5)}
          style={{
            background: 'none',
            border: 'none',
            color: '#059669',
            fontWeight: '700',
            fontSize: '0.86rem',
            cursor: 'pointer',
            padding: 0
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};
