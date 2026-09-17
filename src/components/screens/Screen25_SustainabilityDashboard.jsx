// ==============================================================================
// SCREEN 25: MODE-AWARE SUSTAINABILITY & DRIVER EARNINGS
// Meets Section 27 (Passenger Impact) & Section 28 (Driver Earnings) requirements:
// In Driver Mode:
// - Header: Earnings
// - ₹2,480 Total earnings
// - Tabs: Weekly | Monthly | Yearly
// - Simple earnings chart
// - Completed rides, Passengers served, Average contribution
// In Passenger Mode:
// - Header: Your Impact
// - 24 Shared Rides, 42.8 kg CO₂ Saved, 18.2 L Fuel Saved, ₹1,240 Money Saved
// - Simple CO₂ reduction chart
// ==============================================================================
import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { AndroidBottomNav } from '../common/AndroidBottomNav';
import {
  Leaf,
  Droplets,
  IndianRupee,
  Car,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';

export const Screen25_SustainabilityDashboard = () => {
  const { sustainabilityData, activeMode, goToScreen } = useRideMesh();
  const [period, setPeriod] = useState('weekly');

  const isDriver = activeMode === 'driver';

  const driverEarnings = {
    total: 2480,
    completedRides: 16,
    passengersServed: 42,
    avgContribution: 155,
    weeklyChart: [
      { day: 'Mon', val: 340 },
      { day: 'Tue', val: 420 },
      { day: 'Wed', val: 510 },
      { day: 'Thu', val: 380 },
      { day: 'Fri', val: 590 },
      { day: 'Sat', val: 240 },
      { day: 'Sun', val: 0 }
    ]
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        <AndroidStatusBar />
        <ScreenHeader
          title={isDriver ? "Driver Earnings" : "Your Impact"}
          showBack={true}
          onBack={() => goToScreen(isDriver ? 22 : 8)}
        />

        {/* Period Selector Tabs: Weekly | Monthly | Yearly */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 20px 14px 20px' }}>
          {['Weekly', 'Monthly', 'Yearly'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p.toLowerCase())}
              className={`rm-chip ${period === p.toLowerCase() ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center', padding: '7px 0', fontSize: '0.78rem', fontWeight: '700' }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* DRIVER MODE: EARNINGS DASHBOARD (Section 28)              */}
        {/* ======================================================== */}
        {isDriver ? (
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Total Earnings Highlight Card */}
            <div
              className="rm-card rm-card-highlight"
              style={{
                padding: '20px',
                border: '1.5px solid #059669',
                background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TOTAL EARNINGS ({period.toUpperCase()})
                </span>
                <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: '700' }}>
                  +18% vs last cycle
                </span>
              </div>

              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1 }}>
                ₹{driverEarnings.total.toLocaleString()}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: 4 }}>
                Automated cost sharing settled to bank via UPI
              </div>
            </div>

            {/* 3 Driver Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div className="rm-card" style={{ padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>
                  {driverEarnings.completedRides}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                  Completed Rides
                </div>
              </div>

              <div className="rm-card" style={{ padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0284C7' }}>
                  {driverEarnings.passengersServed}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                  Passengers Served
                </div>
              </div>

              <div className="rm-card" style={{ padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#B45309' }}>
                  ₹{driverEarnings.avgContribution}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
                  Avg Contribution
                </div>
              </div>
            </div>

            {/* Weekly Earnings Bar Chart */}
            <div className="rm-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                  Earnings Breakdown (₹)
                </span>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                  Avg ₹354 / day
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, padding: '0 4px 6px 4px', borderBottom: '1px solid var(--rm-border)' }}>
                {driverEarnings.weeklyChart.map(bar => {
                  const heightPercent = (bar.val / 650) * 100;
                  return (
                    <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                      <div
                        style={{
                          width: 22,
                          height: `${Math.max(6, heightPercent)}%`,
                          background: bar.val > 0 ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)' : 'var(--rm-border-subtle)',
                          borderRadius: 6,
                          boxShadow: bar.val > 0 ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.66rem', color: 'var(--rm-text-muted)', fontWeight: '600' }}>
                        {bar.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* PASSENGER MODE: SUSTAINABILITY & IMPACT (Section 27)    */
          /* ======================================================== */
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 4 Impact Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Shared Rides */}
              <div className="rm-card" style={{ padding: '16px' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Car size={18} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                  {sustainabilityData.sharedRides || 24}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>Shared Rides</div>
              </div>

              {/* CO2 Saved */}
              <div className="rm-card" style={{ padding: '16px' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Leaf size={18} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669' }}>
                  {sustainabilityData.co2SavedKg || 42.8} kg
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>CO₂ Saved</div>
              </div>

              {/* Fuel Saved */}
              <div className="rm-card" style={{ padding: '16px' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Droplets size={18} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0284C7' }}>
                  {sustainabilityData.fuelSavedL || 18.2} L
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>Fuel Saved</div>
              </div>

              {/* Money Saved */}
              <div className="rm-card" style={{ padding: '16px' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <IndianRupee size={18} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#B45309' }}>
                  ₹{sustainabilityData.moneySavedInr || '1,240'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>Money Saved</div>
              </div>
            </div>

            {/* Weekly Savings Bar Chart */}
            <div className="rm-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
                  CO₂ Reduction (kg)
                </span>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                  +14% this week
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, padding: '0 4px 6px 4px', borderBottom: '1px solid var(--rm-border)' }}>
                {sustainabilityData.weeklyChart.map(bar => {
                  const heightPercent = (bar.val / 12) * 100;
                  return (
                    <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                      <div
                        style={{
                          width: 22,
                          height: `${Math.max(8, heightPercent)}%`,
                          background: bar.val > 0 ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)' : 'var(--rm-border-subtle)',
                          borderRadius: 6,
                          boxShadow: bar.val > 0 ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.66rem', color: 'var(--rm-text-muted)', fontWeight: '600' }}>
                        {bar.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Impact Banner */}
            <div
              className="rm-card rm-card-highlight"
              style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 12, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.86rem', fontWeight: '800', color: '#064E3B', margin: 0 }}>
                  Together for a Greener Tomorrow.
                </h4>
                <p style={{ fontSize: '0.74rem', color: '#047857', margin: '2px 0 0 0' }}>
                  Every shared carpool saves fuel and avoids traffic congestion.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <AndroidBottomNav />
    </div>
  );
};

