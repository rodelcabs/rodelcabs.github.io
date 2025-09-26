import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const apiUrl = 'https://6142e744c8700e00178cffc9.mockapi.io/api/v1/Budget'

export const getBudget = async () => {
    const response = await axios.get(apiUrl);
    return response.data;
}

export const updateBudget = async (id, budget) => {
    try {
        const response = await axios.put(`${apiUrl}/${id}`, budget);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to update budget');
        }
    } catch (error) {
        console.error('Error updating budget:', error);
        toast.error('Failed to update budget');
        throw error;
    }
}

export const useBudget = (setBudget) => {
    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const response = await axios.get(apiUrl);
                
                // Ensure response.data is an array and filter out invalid items
                const budgetData = Array.isArray(response.data) ? response.data : [];
                const validBudgetData = budgetData.filter(item => 
                    item && 
                    typeof item === 'object' && 
                    item.id && 
                    item.name && 
                    typeof item.thresholdValue !== 'undefined'
                );
                
                setBudget(validBudgetData);
            } catch (error) {
                console.error('Failed to fetch budget data:', error);
                toast.error('Failed to load budget data');
                setBudget([]); // Set empty array on error
            }
        }
        fetchBudget();
    }, [setBudget]);
}

export const addBudget = async (budget) => {
    try {
        const response = await axios.post(apiUrl, budget);
        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error('Failed to add budget');
        }
    } catch (error) {
        console.error('Error adding budget:', error);
        toast.error('Failed to add budget');
        throw error;
    }
}

export const deleteBudget = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/${id}`);
        if (response.status === 200 || response.status === 204) {
            return true;
        } else {
            throw new Error('Failed to delete budget');
        }
    } catch (error) {
        console.error('Error deleting budget:', error);
        throw error;
    }
}