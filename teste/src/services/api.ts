import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://SEU_IP:8000', // ex: http://192.168.1.105:8000
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});