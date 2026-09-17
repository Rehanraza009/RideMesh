// ==============================================================================
// RIDEMESH BRAND LOGO & CIRCULAR MOBILITY EMBLEM
// Matches exact brand guidelines: Emerald Green + Mobility Pin + Clean Electric Car
// ==============================================================================
import React from 'react';

export const RideMeshLogo = ({
  variant = 'full', // 'emblem' | 'full' | 'horizontal'
  size = 'md',      // 'sm' (32px) | 'md' (52px) | 'lg' (76px) | 'xl' (92px)
  className = '',
  showTagline = true,
  textColor = 'var(--rm-text-primary)'
}) => {
  const sizeMap = {
    sm: 32,
    md: 52,
    lg: 76,
    xl: 92
  };

  const px = sizeMap[size] || 52;

  // The circular mobility emblem: Soft mint background, green leaf/road contour ring, electric car & location pin
  const EmblemSVG = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, filter: 'drop-shadow(0 6px 16px rgba(5, 150, 105, 0.25))' }}
    >
      <defs>
        <linearGradient id="rmRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="rmBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>
      </defs>

      {/* Outer Circle Background */}
      <circle cx="50" cy="50" r="48" fill="url(#rmBgGrad)" />

      {/* Decorative Outer Road & Leaf Swirls */}
      <circle cx="50" cy="50" r="45" stroke="url(#rmRingGrad)" strokeWidth="3" strokeDasharray="80 12 25 12" strokeLinecap="round" />
      <path d="M 22 55 C 22 30, 42 16, 68 18" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
      <path d="M 78 45 C 80 65, 62 82, 38 82" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

      {/* Central Map Pin sitting at upper right */}
      <g transform="translate(48, 14)">
        <path
          d="M8 0 C3.6 0 0 3.6 0 8 C0 14 8 22 8 22 C8 22 16 14 16 8 C16 3.6 12.4 0 8 0 Z"
          fill="#059669"
        />
        <circle cx="8" cy="8" r="3.5" fill="#FFFFFF" />
      </g>

      {/* Stylized Modern Electric Car (Crisp White with Green Accents) */}
      <g transform="translate(20, 42)">
        {/* Car Ground Shadow */}
        <ellipse cx="30" cy="38" rx="26" ry="4" fill="#064E3B" opacity="0.2" />

        {/* Car Body Outer Shell (White) */}
        <path
          d="M 8 24 
             C 8 19, 13 13, 18 11 
             C 22 9, 38 9, 42 11 
             C 47 13, 52 19, 52 24 
             L 55 26 
             C 58 27.5, 59 30, 59 33 
             L 59 36 
             C 59 37.5, 57.5 38, 55 38 
             L 5 38 
             C 2.5 38, 1 37.5, 1 36 
             L 1 33 
             C 1 30, 2 27.5, 5 26 
             Z"
          fill="#FFFFFF"
          stroke="#059669"
          strokeWidth="2"
        />

        {/* Windshield & Cabin Glass (Vibrant Green Mint) */}
        <path
          d="M 16 13 
             C 19 11, 41 11, 44 13 
             C 47 15, 49 20, 49 23 
             L 11 23 
             C 11 20, 13 15, 16 13 Z"
          fill="#D1FAE5"
          stroke="#059669"
          strokeWidth="1.5"
        />

        {/* Front & Side Window divider */}
        <line x1="30" y1="12" x2="30" y2="23" stroke="#059669" strokeWidth="1.5" />

        {/* Headlights (Cyan/Yellow Glow) */}
        <circle cx="5" cy="31" r="2.5" fill="#10B981" />
        <circle cx="55" cy="31" r="2.5" fill="#10B981" />

        {/* Wheels */}
        <circle cx="13" cy="38" r="6" fill="#064E3B" />
        <circle cx="13" cy="38" r="2.5" fill="#E2E8F0" />
        <circle cx="47" cy="38" r="6" fill="#064E3B" />
        <circle cx="47" cy="38" r="2.5" fill="#E2E8F0" />
      </g>
    </svg>
  );

  if (variant === 'emblem') {
    return <div className={`rm-logo-emblem ${className}`}>{EmblemSVG}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`rm-logo-horizontal ${className}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {EmblemSVG}
        <div>
          <div
            style={{
              fontFamily: 'var(--rm-font-display)',
              fontSize: px >= 52 ? '1.25rem' : '1.05rem',
              fontWeight: '800',
              color: textColor,
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}
          >
            RideMesh
          </div>
          {showTagline && (
            <div
              style={{
                fontSize: px >= 52 ? '0.74rem' : '0.65rem',
                color: 'var(--rm-primary)',
                fontWeight: '600',
                letterSpacing: '-0.01em',
                marginTop: 2
              }}
            >
              Match Smarter. Ride Together.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: 'full' (Vertical Centered Branding)
  return (
    <div
      className={`rm-logo-full ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {EmblemSVG}
      <h1
        style={{
          fontFamily: 'var(--rm-font-display)',
          fontSize: size === 'xl' ? '2.1rem' : size === 'lg' ? '1.75rem' : '1.4rem',
          fontWeight: '800',
          color: textColor,
          letterSpacing: '-0.03em',
          marginTop: size === 'sm' ? 6 : 10,
          marginBottom: 2
        }}
      >
        RideMesh
      </h1>
      {showTagline && (
        <p
          style={{
            fontSize: size === 'xl' ? '0.94rem' : size === 'lg' ? '0.86rem' : '0.78rem',
            color: 'var(--rm-primary)',
            fontWeight: '600',
            letterSpacing: '-0.01em'
          }}
        >
          Match Smarter. Ride Together.
        </p>
      )}
    </div>
  );
};
