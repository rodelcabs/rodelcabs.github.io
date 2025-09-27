import React, { useEffect, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import Card from './components/Card';
import { SpendModal, AddBudgetModal } from './components/Modal';
import { Toaster, useToasterStore } from 'react-hot-toast';
import toast from 'react-hot-toast';
import './App.css';
import { useBudget, updateBudget, deleteBudget } from './utils';

library.add(fas, far, fab)

function App() {
  const [isSpendModalOpen, setIsSpendModalOpen] = useState(false);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [budget, setBudget] = useState([]);
  const [onSelectMode, setOnSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const { toasts } = useToasterStore();
  const TOAST_LIMIT = 1

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts]);

  useBudget(setBudget);

  // Efficient array update functions
  const updateBudgetItem = useCallback((id, updatesOrFunction) => {
    setBudget(prevBudget => 
      prevBudget.map(item => {
        if (item.id === id) {
          if (typeof updatesOrFunction === 'function') {
            return updatesOrFunction(item);
          }
          return { ...item, ...updatesOrFunction };
        }
        return item;
      })
    );
  }, []);

  const addBudgetItem = useCallback((newItem) => {
    setBudget(prevBudget => [...prevBudget, newItem]);
  }, []);

  const deleteBudgetItem = useCallback((id) => {
    setBudget(prevBudget => prevBudget.filter(item => item.id !== id));
  }, []);

  const handleRefreshBudget = useCallback(async () => {
    if (selectedCards.size === 0) {
      toast.error('No cards selected for refresh');
      return;
    }

    const selectedIds = Array.from(selectedCards);
    
    // Optimistic update: set currentValue to 0 for selected cards
    selectedIds.forEach(id => {
      updateBudgetItem(id, { currentValue: 0 });
    });

    toast.success(`Refreshing ${selectedIds.length} card${selectedIds.length > 1 ? 's' : ''}...`);

    // Update each selected card on the server
    try {
      const updatePromises = selectedIds.map(async (id) => {
        const budgetItem = budget.find(item => item.id === id);
        if (budgetItem) {
          await updateBudget(id, { 
            ...budgetItem, 
            currentValue: 0 
          });
        }
      });

      await Promise.all(updatePromises);
      toast.success('Cards refreshed successfully!');
      
      // Clear selection and exit select mode
      setSelectedCards(new Set());
      setOnSelectMode(false);
    } catch (error) {
      console.error('Error refreshing cards:', error);
      toast.error('Some cards failed to refresh');
      // Revert optimistic updates on error
      // Note: In a real app, you might want to fetch fresh data here
    }
  }, [selectedCards, budget, updateBudgetItem]);

  // Memoized handlers
  const handleCardClick = useCallback((item) => {
    if (!item || !item.name || !item.id) {
      console.error('Invalid item clicked:', item);
      return;
    }
    setSelectedCard(item.name);
    setSelectedCardId(item.id);
    setIsSpendModalOpen(true);
  }, []);

  const handleCloseSpendModal = useCallback(() => {
    setIsSpendModalOpen(false);
    setSelectedCard(null);
    setSelectedCardId(null);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddBudgetModalOpen(false);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setIsAddBudgetModalOpen(true);
  }, []);

  const handleOnSelectMode = useCallback(() => {
    setOnSelectMode(prev => {
      if (prev) {
        // Exiting select mode, clear selections
        setSelectedCards(new Set());
      }
      return !prev;
    });
  }, []);

  const handleCardCheckboxChange = useCallback((cardId, isChecked) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(cardId);
      } else {
        newSet.delete(cardId);
      }
      return newSet;
    });
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedCards.size === 0) {
      toast.error('No cards selected for deletion');
      return;
    }

    const selectedIds = Array.from(selectedCards);
    
    // Optimistic update: remove selected cards from UI
    selectedIds.forEach(id => {
      deleteBudgetItem(id);
    });

    toast.success(`Deleting ${selectedIds.length} card${selectedIds.length > 1 ? 's' : ''}...`);

    // Delete each selected card from the server
    try {
      const deletePromises = selectedIds.map(id => deleteBudget(id));
      await Promise.all(deletePromises);
      toast.success('Cards deleted successfully!');
      
      // Clear selection and exit select mode
      setSelectedCards(new Set());
      setOnSelectMode(false);
    } catch (error) {
      console.error('Error deleting cards:', error);
      toast.error('Some cards failed to delete');
      // In a real app, you might want to revert optimistic updates or fetch fresh data
    }
  }, [selectedCards, deleteBudgetItem]);

  const handleAddOrDelete = useCallback(() => {
    if (onSelectMode) {
      handleDeleteSelected();
    } else {
      handleOpenAddModal();
    }
  }, [onSelectMode, handleDeleteSelected, handleOpenAddModal]);

  // Memoized budget cards to prevent unnecessary re-renders
  const budgetCards = useMemo(() => 
    budget
      .filter(item => item && item.id && item.name) // Filter out invalid items
      .map((item) => (
        <Card 
          key={item.id}
          title={item.name} 
          threshold={item.thresholdValue || 0}
          current={item.currentValue || 0}
          onClick={() => 
            onSelectMode 
              ? handleCardCheckboxChange(item.id, !selectedCards.has(item.id))
              : handleCardClick(item)
          }
          className={classNames({
            'select-card': onSelectMode,
          })}
          onCheckboxChange={(isChecked) => handleCardCheckboxChange(item.id, isChecked)}
          isChecked={selectedCards.has(item.id)}
          isSelectMode={onSelectMode}
        />
      )), [budget, handleCardClick, onSelectMode, selectedCards, handleCardCheckboxChange]
  );

  return (
    <div className="App">
      <Toaster 
      toastOptions={{
        style: {
          marginTop: '60px',
        }
      }}/>
      <div className="card-container">
        {budgetCards}
      </div>
      
      <SpendModal
        isOpen={isSpendModalOpen}
        onClose={handleCloseSpendModal}
        title={selectedCard}
        id={selectedCardId}
        updateBudgetItem={updateBudgetItem}
      />
      <AddBudgetModal
        isOpen={isAddBudgetModalOpen}
        onClose={handleCloseAddModal}
        addBudgetItem={addBudgetItem}
      />
      <div className="button-container">
        <button className={`refresh-button ${onSelectMode ? 'show' : ''}`} onClick={handleRefreshBudget}>
          <FontAwesomeIcon icon="fa-solid fa-refresh" />
        </button>
        <button className="add-button" onClick={handleAddOrDelete}>
          {
            onSelectMode ? <FontAwesomeIcon icon="fa-solid fa-minus" /> : <FontAwesomeIcon icon="fa-solid fa-plus" />
          }
        </button>
        <button className="select-button" onClick={handleOnSelectMode}>
          {
            onSelectMode ? <FontAwesomeIcon icon="fa-solid fa-x" /> : <FontAwesomeIcon icon="fa-solid fa-pen" />
          }
        </button>
      </div>
    </div>
  );
}

export default App;
