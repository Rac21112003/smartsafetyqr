// src/api.js
import axios from 'axios';
// const BASE = import.meta.env.VITE_API_URL;
const BASE = 'http://localhost:4000/api';
console.log('API BASE URL:', BASE);
export const createProfile = (data) => axios.post(`${BASE}/profiles`, data);
export const getProfile = (id) => axios.get(`${BASE}/profiles/${id}`);
export const updateProfile = (id, data) => axios.put(`${BASE}/profiles/${id}`, data);