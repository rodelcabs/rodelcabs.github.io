import React, { useEffect, useState, useCallback, useMemo } from 'react';
import SwipeableCard from './components/SwipeableCard';
import { SpendModal, AddBudgetModal } from './components/Modal';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import './App.css';
import { useBudget, deleteBudget, updateBudget } from './utils';

function App() {
  const [isSpendModalOpen, setIsSpendModalOpen] = useState(false);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [budget, setBudget] = useState([]);

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

  const deleteBudgetItem = useCallback(async (id) => {
    try {
      // Optimistic update - remove from UI immediately
      setBudget(prevBudget => prevBudget.filter(item => item.id !== id));
      
      // Delete from server
      await deleteBudget(id);
      
      toast.success('Budget item deleted successfully');
    } catch (error) {
      // Revert optimistic update by refetching data
      console.error('Delete failed:', error);
      toast.error('Failed to delete budget item');
      // Re-fetch to restore state
      window.location.reload();
    }
  }, []);

  const refreshBudgetItem = useCallback(async (id) => {
    try {
      // Find the item to get current data
      const item = budget.find(item => item.id === id);
      if (!item) return;

      // Optimistic update - reset currentValue to 0
      updateBudgetItem(id, { currentValue: 0 });
      
      // Update on server
      await updateBudget(id, { ...item, currentValue: 0 });
      
      toast.success('Budget reset successfully');
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Failed to reset budget');
      // Revert by refetching
      window.location.reload();
    }
  }, [budget, updateBudgetItem]);

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

  // Memoized budget cards to prevent unnecessary re-renders
  const budgetCards = useMemo(() => 
    budget
      .filter(item => item && item.id && item.name) // Filter out invalid items
      .map((item) => (
        <SwipeableCard 
          key={item.id}
          id={item.id}
          title={item.name} 
          threshold={item.thresholdValue || 0}
          current={item.currentValue || 0}
          onClick={() => handleCardClick(item)}
          onDelete={deleteBudgetItem}
          onRefresh={refreshBudgetItem}
        />
      )), [budget, handleCardClick, deleteBudgetItem, refreshBudgetItem]
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
      <button className="add-button" onClick={handleOpenAddModal}>
        +
      </button>
    </div>
  );
}

export default App;
