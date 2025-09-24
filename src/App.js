import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import Modal from './components/Modal';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { useBudget } from './utils';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedThreshold, setSelectedThreshold] = useState(null);
  const [budget, setBudget] = useState(null);

  useBudget(setBudget);

  useEffect(() => {
    console.log(budget)
  }, [budget])

  const openModal = (cardTitle, currentValue, id) => {
    setSelectedCard(cardTitle);
    setSelectedThreshold(currentValue);
    setSelectedCardId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setSelectedThreshold(null);
    setSelectedCardId(null);
  };

  return (
    <div className="App">
      <Toaster />
      <div className="card-container">
        {budget && budget.map((item, index) => (
          <Card 
            key={item.id || index}
            title={item.name} 
            threshold={item.thresholdValue}
            current={item.currentValue || 0}
            onClick={() => openModal(item.name, item.currentValue, item.id)}
          />
        ))}
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedCard}
        budget={budget}
        setBudget={setBudget}
        id={selectedCardId}
      />
    </div>
  );
}

export default App;
