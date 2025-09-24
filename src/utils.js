import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const apiUrl = 'https://6142e744c8700e00178cffc9.mockapi.io/api/v1/Budget'

export const getBudget = async () => {
    const response = await axios.get(apiUrl);
    return response.data;
}

export const updateBudget = async (id, budget) => {
    const response = await axios.put(`${apiUrl}/${id}`, budget);
    if (response.status === 200) {
        toast.success('Budget updated successfully');
    } else {
        toast.error('Failed to update budget');
    }
}

export const useBudget = (setBudget) => {
    useEffect(() => {
        const fetchBudget = async () => {
            const response = await axios.get(apiUrl);
            setBudget(response.data);
        }
        fetchBudget();
    }, []);
}