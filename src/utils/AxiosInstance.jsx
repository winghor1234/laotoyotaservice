// utils/axiosInstance.js
import axios from "axios";
import useToyotaStore from "../store/ToyotaStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Request interceptor (แค่แนบ token ถ้ามี)
axiosInstance.interceptors.request.use(
  (config) => {
    const store = useToyotaStore.getState();
    const token = store.token; // ดึง token ตรง ๆ

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (ถ้า token หมดอายุ → redirect login)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const store = useToyotaStore.getState();
      store.removeToken(); // ล้าง token ออกจาก state/localStorage
      window.location.href = "/"; // redirect ไปหน้า login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
