// ==============================================================================
// AI MATCHING LOADER (PREMIUM 4-STEP AI ANIMATED TRANSITION)
// Step 1: Finding your best matches...
// Step 2: Checking route compatibility...
// Step 3: Optimizing pickup points...
// Step 4: Calculating the best ride...
// ==============================================================================
import React from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { Sparkles, Route, MapPin, Calculator, CheckCircle2 } from 'lucide-react';

export const AIMatchingLoader = () => {
  const { isAILoading, aiLoadingStep, searchParams } = useRideMesh();

  if (!isAILoading) return null;

  const steps = [
    { num: 1, text: 'Finding your best matches...', icon: <Sparkles size={18} color="#10B981" /> },
    { num: 2, text: 'Checking route compatibility...', icon: <Route size={18} color="#059669" /> },
    { num: 3, text: 'Optimizing pickup points...', icon: <MapPin size={18} color="#047857" /> },
    { num: 4, text: 'Calculating the best ride...', icon: <Calculator size={18} color="#064E3B" /> }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6, 40, 28, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#FFFFFF',
          borderRadius: 28,
          padding: '28px 24px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          animation: 'rmScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Pulsing AI Emblem */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            border: '2px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}
          className="rm-pulse-anim"
        >
          <Sparkles size={34} color="#059669" />
        </div>

        <h3
          style={{
            fontFamily: 'var(--rm-font-display)',
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#0F172A',
            margin: '0 0 6px 0'
          }}
        >
          RideMesh AI
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 20px 0' }}>
          Searching corridors along <strong>{searchParams.from.split(',')[0]}</strong> → <strong>{searchParams.to.split('(')[0]}</strong>
        </p>

        {/* 4 Step Progress Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 20 }}>
          {steps.map(s => {
            const isCompleted = aiLoadingStep > s.num;
            const isCurrent = aiLoadingStep === s.num;
            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 12px',
                  borderRadius: 12,
                  background: isCurrent ? '#F0FDF4' : isCompleted ? '#F8FAFC' : '#FFFFFF',
                  border: isCurrent ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                  opacity: isCompleted || isCurrent ? 1 : 0.45,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {isCompleted ? (
                    <CheckCircle2 size={18} color="#059669" />
                  ) : (
                    s.icon
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: isCurrent ? '800' : '600',
                    color: isCurrent ? '#064E3B' : isCompleted ? '#1E293B' : '#94A3B8'
                  }}
                >
                  {s.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Progress Line */}
        <div style={{ width: '100%', height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              width: `${(aiLoadingStep / 4) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>
      </div>
    </div>
  );
};
