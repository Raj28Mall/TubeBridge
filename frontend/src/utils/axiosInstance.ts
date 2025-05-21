// services/api.ts (or utils/axiosInstance.ts)
"use client";
import axios from 'axios';
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const { idToken } = useAuthStore.getState(); // Gets the current state from the store
        if (idToken) {
        config.headers['Authorization'] = `Bearer ${idToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        toast.error("Unauthorized: Your session has expired. Please log in again.");
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
        }
        return Promise.reject(error);
    }
);

export default api;