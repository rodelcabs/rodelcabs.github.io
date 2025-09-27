import React, { memo } from "react";

const Card = memo(function Card ({title, threshold, current = 0, onClick, className, onCheckboxChange, isChecked, isSelectMode}) {
    // Calculate percentage (currentValue / thresholdValue) * 100
    const percentage = threshold > 0 ? Math.min((current / threshold) * 100, 100) : 0;
    const remaining = Math.max(threshold - current, 0);
    
    // Determine color based on percentage
    const getProgressColor = (percent) => {
        if (percent <= 50) return 'var(--progress-green)';
        if (percent <= 80) return 'var(--progress-orange)';
        return 'var(--progress-red)';
    };

    return (
        <div className={`card ${className || ''}`} onClick={onClick}>
            <div className="card-content">
                <div className="card-title">
                    <div className="card-title-container">
                        <div className={`card-title-icon ${isSelectMode ? 'select-mode-checkbox': ''}`}>
                            <input 
                                type="checkbox" 
                                name={`${title}-checkbox`} 
                                id={`${title}-checkbox`}
                                checked={isChecked || false}
                                onChange={(e) => {
                                    e.stopPropagation(); // Prevent card click when directly clicking checkbox
                                    if (onCheckboxChange) {
                                        onCheckboxChange(e.target.checked);
                                    }
                                }}
                            />
                        </div>
                        <div>{title}</div>
                    </div>
                    <div className="progress-percentage">{percentage.toFixed(0)}%</div>
                </div>
                
                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ 
                                width: `${percentage}%`,
                                backgroundColor: getProgressColor(percentage)
                            }}
                        ></div>
                    </div>
                    <div className="progress-info">
                        <span className="progress-text">{current.toLocaleString()} / {threshold.toLocaleString()}</span>
                        <span className="remaining-amount">Remaining: {remaining.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
});

export default Card;