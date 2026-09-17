import React, { useState } from 'react';
import { useRideMesh } from '../../context/RideMeshContext';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { ScreenHeader } from '../common/ScreenHeader';
import { Star, CheckCircle2 } from 'lucide-react';
import { ratingService } from '../../services/ratingService';

export const Screen20_RatingScreen = () => {
  const { selectedDriver, user, goToScreen } = useRideMesh();
  const [rating, setRating] = useState(0); // Section 31: Do not automatically give 5-star rating
  const [selectedTags, setSelectedTags] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const driver = selectedDriver || {};

  const tags = [
    'On time',
    'Safe driving',
    'Clean vehicle',
    'Good communication',
    'Polite driver',
    'Smooth ride'
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await ratingService.submitRating({
        rideId: driver.id || 'ride_1',
        authorId: user?.uid || 'user_default',
        driverId: driver.driverId || 'driver_default',
        rating,
        tags: selectedTags,
        feedback
      });
    } catch {}
    setLoading(false);
    goToScreen(21); // Ride History
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--rm-bg)', justifyContent: 'space-between' }}>
      <div>
        <AndroidStatusBar />
        <ScreenHeader title="Rate Your Ride" showBack={true} onBack={() => goToScreen(8)} />

        <div style={{ padding: '20px 24px 0 24px', textAlign: 'center' }}>
          {/* Driver Avatar */}
          <div style={{ position: 'relative', width: 76, height: 76, margin: '0 auto 12px auto' }}>
            <img
              src={driver.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'}
              alt={driver.driverName}
              style={{ width: '100%', height: '100%', borderRadius: 24, objectFit: 'cover', border: '2.5px solid var(--rm-primary)' }}
            />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--rm-text-primary)' }}>
            {driver.driverName || 'Rahul Sharma'}
          </h3>
          <div style={{ fontSize: '0.84rem', color: 'var(--rm-text-muted)', marginTop: 2 }}>
            ⭐ {driver.rating || '4.8'}
          </div>

          {/* Interactive Star Rating */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '22px 0' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <Star
                  size={34}
                  fill={star <= rating ? '#F59E0B' : 'transparent'}
                  color={star <= rating ? '#F59E0B' : 'var(--rm-border)'}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {/* Prompt */}
          <p style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--rm-text-primary)', marginBottom: 14 }}>
            How was your experience?
          </p>

          {/* Compliment Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {tags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rm-chip ${isSelected ? 'active' : ''}`}
                  style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                >
                  {isSelected && <CheckCircle2 size={13} />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>

          {/* Text feedback field */}
          <div className="rm-card" style={{ padding: '12px' }}>
            <textarea
              rows="3"
              placeholder="Any additional feedback? (Optional)"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none', resize: 'none', fontSize: '0.86rem', color: 'var(--rm-text-primary)', fontFamily: 'var(--rm-font)' }}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ padding: '20px 24px 34px 24px' }}>
        <button
          className="rm-btn rm-btn-primary"
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
          style={{ opacity: rating === 0 ? 0.6 : 1, cursor: rating === 0 ? 'not-allowed' : 'pointer' }}
        >
          {rating === 0 ? 'Select a Star Rating to Submit' : (loading ? 'Submitting...' : 'Submit Rating')}
        </button>
      </div>
    </div>
  );
};
