import axios from 'axios';
import { supabase } from './supabase';

// Create axios instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(async (config) => {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    //check if the request data is a formdata object
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;