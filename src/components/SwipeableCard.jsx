import React, { useState, useRef, memo } from 'react';
import Card from './Card';

const SwipeableCard = memo(function SwipeableCard({ 
  title, 
  threshold, 
  current, 
  onClick, 
  onDelete,
  onRefresh,
  id 
}) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 120; // Minimum distance to trigger action
  const MAX_SWIPE = 200; // Maximum swipe distance

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const diffX = currentX.current - startX.current;
    
    // Allow both left (-) and right (+) swipes, but limit the distance
    const newTranslateX = Math.max(-MAX_SWIPE, Math.min(diffX, MAX_SWIPE));
    setTranslateX(newTranslateX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const diffX = currentX.current - startX.current;
    
    if (diffX < -SWIPE_THRESHOLD) {
      // Left swipe - delete
      handleDelete();
    } else if (diffX > SWIPE_THRESHOLD) {
      // Right swipe - refresh (reset to 0)
      handleRefresh();
    } else {
      // Snap back to original position
      setTranslateX(0);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setTranslateX(-MAX_SWIPE);
    
    // Wait for animation to complete before calling delete
    setTimeout(() => {
      if (onDelete && id) {
        onDelete(id);
      }
    }, 300);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTranslateX(MAX_SWIPE);
    
    // Wait for animation to complete before calling refresh
    setTimeout(() => {
      if (onRefresh && id) {
        onRefresh(id);
      }
      // Reset position after refresh
      setTimeout(() => {
        setIsRefreshing(false);
        setTranslateX(0);
      }, 200);
    }, 300);
  };

  const handleMouseDown = (e) => {
    // Prevent mouse events from interfering with click
    if (e.type === 'mousedown') return;
  };

  const handleClick = (e) => {
    // Only trigger click if not dragging and not in action state
    if (translateX === 0 && !isDragging && !isDeleting && !isRefreshing && onClick) {
      onClick();
    }
  };

  const swipeProgress = Math.abs(translateX) / SWIPE_THRESHOLD;
  const isLeftSwipe = translateX < 0;
  const isRightSwipe = translateX > 0;
  const showLeftAction = Math.abs(translateX) > 50 && isLeftSwipe;
  const showRightAction = Math.abs(translateX) > 50 && isRightSwipe;

  return (
    <div className="swipeable-card-container">
      {/* Left Action Background (Delete) */}
      <div 
        className="delete-background"
        style={{ 
          opacity: isLeftSwipe ? Math.min(swipeProgress, 1) : 0,
          transform: `translateX(${Math.min(0, translateX + 120)}px)`
        }}
      >
        <div className="delete-icon">
          <span>🗑️</span>
          <span className="delete-text">Delete</span>
        </div>
      </div>

      {/* Right Action Background (Refresh) */}
      <div 
        className="refresh-background"
        style={{ 
          opacity: isRightSwipe ? Math.min(swipeProgress, 1) : 0,
          transform: `translateX(${Math.max(0, translateX - 120)}px)`
        }}
      >
        <div className="refresh-icon">
          <span>🔄</span>
          <span className="refresh-text">Reset</span>
        </div>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className={`swipeable-card ${isDragging ? 'dragging' : ''} ${isDeleting ? 'deleting' : ''} ${isRefreshing ? 'refreshing' : ''}`}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
          boxShadow: isDragging 
            ? `${isLeftSwipe ? 'var(--accent-color-2)' : 'var(--progress-orange)'} ${Math.abs(translateX) * 0.05}px ${Math.abs(translateX) * 0.05}px`
            : 'var(--accent-color-2) -5px 5px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <Card
          title={title}
          threshold={threshold}
          current={current}
          onClick={handleClick}
        />
      </div>

      {/* Left Swipe Indicator */}
      {showLeftAction && !isDeleting && (
        <div className="swipe-indicator left">
          <span>Swipe left to delete →</span>
        </div>
      )}

      {/* Right Swipe Indicator */}
      {showRightAction && !isRefreshing && (
        <div className="swipe-indicator right">
          <span>← Swipe right to reset</span>
        </div>
      )}
    </div>
  );
});

export default SwipeableCard;
