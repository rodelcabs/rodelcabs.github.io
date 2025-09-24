import React, { useState, useEffect } from 'react';
import { updateBudget } from '../utils';

export default function Modal({ isOpen, onClose, title, budget, setBudget, id }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const newSpending = parseFloat(inputValue);
    if (!isNaN(newSpending) && budget && title) {
      // Update the budget item with the new threshold
      const updatedBudget = budget.map(item => 
        item.name === title 
          ? { ...item, currentValue: item.currentValue + newSpending }
          : item
      );
      setBudget(updatedBudget);
      updateBudget(id, updatedBudget.find(item => item.name === title && item.id === id));
    }
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <input
            type="number"
            className="modal-input"
            placeholder="Enter new spending amount"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-footer">
          <button className="modal-button" onClick={handleSubmit}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
