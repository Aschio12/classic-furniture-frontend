import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// 1. Create Axios Instance
const apiClient = axios.create({
    baseURL: 'https://classic-furniture-backend.onrender.com/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor (Inject Token)
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor (Handle 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;
        
        // If 401 Unauthorized (Token missing/expired)
        if (response && response.status === 401) {
             console.warn("Session expired. Logging out.");
             const logout = useAuthStore.getState().logout;
             
             // Clear local state & storage
             logout(); 
             
             // Redirect handled in logout, or we can force it here just in case
             // window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;