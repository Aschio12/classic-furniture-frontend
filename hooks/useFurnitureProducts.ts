import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  images?: string[];
  imageUrl?: string;
  stock?: number;
  [key: string]: any;
}

export const useFurnitureProducts = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an axios instance specifically for fetching products
    const api = axios.create({
      baseURL: "https://classic-furniture-backend.onrender.com/api",
    });

    // Interceptor to attach the JWT token from Zustand
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("/products");
        // Support common backend response structures (data arrays or native arrays)
        const productsData = Array.isArray(response.data?.data) 
          ? response.data.data 
          : Array.isArray(response.data) 
            ? response.data 
            : [];
            
        setData(productsData);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message || 
          axiosError.message || 
          "Failed to fetch products"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // Cleanup the interceptor on unmount to prevent memory leaks
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return { data, isLoading, error };
};
