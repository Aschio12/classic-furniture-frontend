import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = "https://classic-furniture-backend.onrender.com";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // Enabled for potential cookie support
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
    try {
        // Hit the root endpoint to wake up the Render instance
        // We use a separate axios call to avoid the /api prefix of the instance
        await axios.get(`${BASE_URL}/`);
        return true;
    } catch {
        // Even if it fails (e.g. 404), if we get a response, it's awake.
        // But if it's a network error, it might be down or sleeping hard.
        console.log("Ping attempt finished"); 
        return true; 
    }
};

export default api;
