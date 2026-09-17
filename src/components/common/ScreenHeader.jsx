import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRideMesh } from '../../context/RideMeshContext';

export const ScreenHeader = ({ title, showBack = true, onBack, rightAction }) => {
  const { goBack } = useRideMesh();

  return (
    <header className="rm-screen-header">
      {showBack ? (
        <button
          className="rm-header-back-btn"
          onClick={onBack || goBack}
          aria-label="Back"
        >
          <ArrowLeft size={18} strokeWidth={2.4} />
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}

      <h1 className="rm-header-title">{title}</h1>

      <div style={{ minWidth: 36, display: 'flex', justifyContent: 'flex-end' }}>
        {rightAction || <div style={{ width: 36 }} />}
      </div>
    </header>
  );
};
