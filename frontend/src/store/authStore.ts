// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
    idToken: string | null;
    setIdToken: (token: string | null) => void;
    logout: () => void;
    initialized: boolean;
    setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    idToken: null, 
    initialized: false, 

    setIdToken: (token) => {
        set({ idToken: token });
        if (typeof window !== 'undefined') { // Ensure we are in a browser environment
        if (token) {
            localStorage.setItem('id_token', token);
        } else {
            localStorage.removeItem('id_token');
        }
    }
},

    logout: () => {
        set({ idToken: null });
        if (typeof window !== 'undefined') { 
            localStorage.removeItem('id_token');
        }
    },

    setInitialized: (value) => set({ initialized: value }),
}));

export const initializeAuthStore = () => {
if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('id_token');
    if (storedToken) {
        useAuthStore.setState({ idToken: storedToken });
    }
    useAuthStore.setState({ initialized: true });
}
};

if (typeof window !== 'undefined') {
    initializeAuthStore();
}