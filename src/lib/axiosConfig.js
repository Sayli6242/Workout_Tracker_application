

import axios from 'axios';
import { pb } from '../lib/pocketBase';

const axiosInstance = axios.create({
    // baseURL: 'https://fastapibackend-0kb9.onrender.com/api'  // Add this line
    baseURL: 'http://localhost:8000/api'
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = pb.authStore.token;  // PocketBase token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;






