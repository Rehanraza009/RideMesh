import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar = ({ darkContent = false }) => {
  return (
    <div className={`rm-android-statusbar ${darkContent ? 'dark-content' : ''}`}>
      <span style={{ fontSize: '0.82rem', fontWeight: '700', letterSpacing: '-0.01em' }}>9:41</span>
      <div className="rm-statusbar-camera"></div>
      <div className="rm-statusbar-icons">
        <Signal size={13} strokeWidth={2.4} />
        <Wifi size={13} strokeWidth={2.4} />
        <BatteryMedium size={16} strokeWidth={2.4} />
      </div>
    </div>
  );
};
