import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const BASE_URL='http://127.0.0.1:5000/api';

interface Manager{
    name:string,
    email:string,
}

export const getManagers = async () => {
    const response = await axiosInstance.get(`${BASE_URL}/managers`);
    return response.data;
};

export const addManager = async (manager: Manager) => {
    const response = await axios.post(`${BASE_URL}/managers`, manager);
    return response.data;
};

export const deleteManager = async (id: number) => {
    const response = await axios.delete(`${BASE_URL}/managers/${id}`);
    return response.data;
};