// ==============================================================================
// SCREEN 5: REAL PRODUCTION FIREBASE LOGIN SCREEN
// Matches reference mockup:
// Centered Logo + "Welcome Back!" + Email/Phone + Password + Remember Me
// + Forgot Password + Green Pill Login + Social Providers + Sign Up Footer
// ==============================================================================
import React, { useState, useEffect } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { RideMeshLogo } from '../common/RideMeshLogo';
import { Mail, Lock, Eye, EyeOff, CheckSquare, Square, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

export const Screen5_Login = () => {
  const { goToScreen, role, setIsGooglePickerOpen } = useRideMesh();

  // Remembered session identifier
  const [identifier, setIdentifier] = useState(() => {
    return localStorage.getItem('ridemesh_remembered_email') || 'rehan@ridemesh.ai';
  });
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or phone number.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (rememberMe) {
        localStorage.setItem('ridemesh_remembered_email', identifier.trim());
      } else {
        localStorage.removeItem('ridemesh_remembered_email');
      }

      const res = await authService.login(identifier.trim(), password);
      if (res.success) {
        localStorage.setItem('ridemesh_onboarded', 'true');
        // Route to home based on role
        goToScreen(role === 'driver' ? 22 : 8);
      } else {
        setErrorMsg(res.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err) {
      setErrorMsg('Unable to sign in. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGooglePickerOpen(true);
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authService.loginWithApple();
      if (res.success) {
        localStorage.setItem('ridemesh_onboarded', 'true');
        goToScreen(role === 'driver' ? 22 : 8);
      } else {
        setErrorMsg(res.error || 'Apple Sign-In is unavailable on this platform.');
      }
    } catch {
      setErrorMsg('Apple sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!identifier.trim() || !identifier.includes('@')) {
      setErrorMsg('Please enter a valid email address in the field above to reset password.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(identifier.trim());
      if (res.success) {
        setSuccessMsg('Password reset link sent to your email.');
        setErrorMsg('');
      } else {
        setErrorMsg(res.error || 'Failed to send reset link.');
      }
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

      {/* Main Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 24px 20px 24px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Centered Brand Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <RideMeshLogo variant="full" size="md" />
        </div>

        {/* Welcome Back Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: 'var(--rm-font-display)',
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#0F172A',
              margin: '0 0 4px 0',
              letterSpacing: '-0.02em'
            }}
          >
            Welcome Back!
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#64748B',
              margin: 0
            }}
          >
            Glad to see you again.
          </p>
        </div>

        {/* Alert Feedback Messages */}
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

        {successMsg && (
          <div
            style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#059669',
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
            <CheckCircle2 size={18} flexShrink={0} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Email or Phone */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14,
              padding: '0 14px',
              height: 52,
              transition: 'border-color 0.2s ease'
            }}
          >
            <Mail size={19} color="#94A3B8" style={{ flexShrink: 0, marginRight: 10 }} />
            <input
              type="text"
              placeholder="Email or Phone"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              autoComplete="username"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.94rem',
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
              height: 52,
              position: 'relative'
            }}
          >
            <Lock size={19} color="#94A3B8" style={{ flexShrink: 0, marginRight: 10 }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.94rem',
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

          {/* Row: Remember me + Forgot Password */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '2px 0 6px 0'
            }}
          >
            <div
              onClick={() => setRememberMe(!rememberMe)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {rememberMe ? (
                <CheckSquare size={18} color="#059669" />
              ) : (
                <Square size={18} color="#94A3B8" />
              )}
              <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: '500' }}>
                Remember me
              </span>
            </div>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                background: 'none',
                border: 'none',
                color: '#059669',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Green Pill Login Button */}
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
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        {/* OR Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '20px 0 16px 0'
          }}
        >
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '700' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        {/* Social Authentication Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 24,
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              color: '#1E293B',
              fontSize: '0.88rem',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Continue with Apple */}
          <button
            type="button"
            onClick={handleAppleLogin}
            disabled={loading}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 24,
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              color: '#1E293B',
              fontSize: '0.88rem',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.6-1.03.95-2.33.8-3.64-1.12.05-2.47.75-3.13 1.77-.58.88-.93 2.2-.78 3.53 1.25.1 2.51-.63 3.11-1.66z"/>
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>
      </div>

      {/* Footer Switch to Sign Up */}
      <div
        style={{
          padding: '16px 24px',
          textAlign: 'center',
          borderTop: '1px solid #F1F5F9',
          background: '#FFFFFF'
        }}
      >
        <span style={{ fontSize: '0.86rem', color: '#64748B' }}>
          Don't have an account?{' '}
        </span>
        <button
          onClick={() => goToScreen(6)}
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
          Sign Up
        </button>
      </div>
    </div>
  );
};
