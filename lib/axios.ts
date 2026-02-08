import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useServerStore } from "@/store/useServerStore";

const BASE_URL = "https://classic-furniture-backend.onrender.com";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const wakeUpServer = async () => {
    const { setIsServerWaking } = useServerStore.getState();
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 5000; // 5 seconds

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // Hit the root endpoint to wake up the Render instance
            await axios.get(`${BASE_URL}/`, {
                timeout: 5000 // Timeout for the ping itself
            });
            
            // If successful, we are done
            setIsServerWaking(false);
            return true;
        } catch (error) {
            const err = error as AxiosError;
            console.log(`Wake-up attempt ${i + 1}/${MAX_RETRIES} failed.`);
            
            // If it's a network error (connection closed) or 503 (Service Unavailable/Starting)
            if (!err.response || err.response.status === 503 || err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") {
                setIsServerWaking(true); // Show loading overlay
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                continue; // Try again
            } else {
                // If it's another error (like 404, 500 but connected), consider it awake enough to try requests
                setIsServerWaking(false);
                return false; 
            }
        }
    }
    
    // If we run out of retries
    setIsServerWaking(false); 
    return false;
};

export default api;
