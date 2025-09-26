import React from "react";

export default function Card ({title, threshold, current = 0, onClick}) {
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
        <div className="card" onClick={onClick}>
            <div className="card-content">
                <div className="card-title">
                    <div>{title}</div>
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
}