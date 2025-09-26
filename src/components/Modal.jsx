import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { updateBudget, addBudget } from '../utils';
export function SpendModal({ isOpen, onClose, title, id, updateBudgetItem }) {
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleSubmit = useCallback(async () => {
    const newSpending = parseFloat(inputValue);
    
    if (isNaN(newSpending) || newSpending <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!id) {
      toast.error('No budget item selected');
      return;
    }

    try {
      // Optimistic update - update local state immediately
      updateBudgetItem(id, (prevItem) => ({
        ...prevItem,
        currentValue: (prevItem.currentValue || 0) + newSpending
      }));
      
      // Update on server
      await updateBudget(id, { currentValue: newSpending });
      toast.success('Spending added successfully');
      onClose();
    } catch (error) {
      // Revert optimistic update by refetching data
      console.error('Update failed:', error);
    }
  }, [inputValue, id, title, updateBudgetItem, onClose]);

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

export function AddBudgetModal({ isOpen, onClose, addBudgetItem }) {
  const [name, setName] = useState('');
  const [threshold, setThreshold] = useState('');
  const [current, setCurrent] = useState('');  

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setThreshold('');
      setCurrent('');
    }
  }, [isOpen]);

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!name.trim()) {
      toast.error('Please enter a budget name');
      return;
    }
    
    const thresholdNum = parseFloat(threshold);
    const currentNum = parseFloat(current);
    
    if (isNaN(thresholdNum) || thresholdNum <= 0) {
      toast.error('Please enter a valid threshold amount');
      return;
    }
    
    if (isNaN(currentNum) || currentNum < 0) {
      toast.error('Please enter a valid current amount');
      return;
    }

    const newBudget = {
      name: name.trim(),
      thresholdValue: thresholdNum,
      currentValue: currentNum,
    };

    try {
      // Add to server first, then update local state with returned data
      const savedBudget = await addBudget(newBudget);
      addBudgetItem(savedBudget);
      toast.success('Budget added successfully');
      onClose();
    } catch (error) {
      console.error('Create failed:', error);
      toast.error('Failed to add budget');
    }
  }, [name, threshold, current, addBudgetItem, onClose]);

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
          <h3 className="modal-title">Add New Budget</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-input-container"> 
            <span>Name</span>
            <input
              type="text"
              className="modal-input"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="modal-input-container">
            <span>Threshold</span>
            <input
            type="number"
            className="modal-input"
            placeholder="Threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
          <div className="modal-input-container">
            <span>Current</span>
            <input
            type="number"
            className="modal-input"
            placeholder="Current"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-button" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
