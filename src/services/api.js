import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (walletAddress) => {
    const response = await api.post('/auth/login', { wallet_address: walletAddress });
    return response.data;
  },

  verifyToken: async (token) => {
    const response = await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

// Donations API
export const donationsAPI = {
  getAll: async (skip = 0, limit = 10) => {
    const response = await api.get(`/donations/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getByCause: async (cause) => {
    const response = await api.get(`/donations/by-cause/${encodeURIComponent(cause)}`);
    return response.data;
  },

  getByDonor: async (donorAddress) => {
    const response = await api.get(`/donations/by-donor/${donorAddress}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/donations/statistics/summary');
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
};

// Blockchain API
export const blockchainAPI = {
  getContractAddresses: async () => {
    const response = await api.get('/blockchain/contracts/addresses');
    return response.data;
  },

  getTransaction: async (txHash) => {
    const response = await api.get(`/blockchain/transaction/${txHash}`);
    return response.data;
  },

  getLatestBlock: async () => {
    const response = await api.get('/blockchain/block/latest');
    return response.data;
  },
};

export default api;
