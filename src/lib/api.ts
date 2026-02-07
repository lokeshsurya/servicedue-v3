// API client for backend
import axios from 'axios';
import { logger } from './logger';

// Use environment variable for API URL (required for production deployment)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Log API configuration in development
logger.debug('API Base URL:', API_BASE_URL);

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const login = async (credentials: any) => {
    const response = await apiClient.post('/auth/signin', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const signup = async (userData: any) => {
    const response = await apiClient.post('/auth/signup', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const verifyToken = async (token: string) => {
    const response = await apiClient.get(`/auth/verify?token=${token}`);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const uploadExcel = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};



export const launchCampaign = async (
    leadIds: string[],
    segment: string,
    channel: 'whatsapp' | 'voice' | 'mix',
    templateId: string
) => {
    const response = await apiClient.post('/campaigns/launch', {
        lead_ids: leadIds,
        segment,
        channel,
        template_id: templateId,
    });
    return response.data;
};

export const getDashboardMetrics = async (dealerId: string = '00000000-0000-0000-0000-000000000001') => {
    const response = await apiClient.get(`/dashboard/metrics?dealer_id=${dealerId}`);
    return response.data;
};

export const getTabCustomers = async (
    tab: 'warranty' | 'routine' | 'winback',
    limit: number = 40,
    dealerId: string = '00000000-0000-0000-0000-000000000001'
) => {
    const response = await apiClient.get(`/dashboard/tab/${tab}?limit=${limit}&dealer_id=${dealerId}`);
    return response.data;
};

// Customers API
export const getCustomers = async (params: {
    search?: string;
    segment?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: string;
}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.segment) queryParams.append('segment', params.segment);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.order) queryParams.append('order', params.order);

    const response = await apiClient.get(`/customers?${queryParams.toString()}`);
    return response.data;
};

export const getCustomerStats = async () => {
    const response = await apiClient.get('/customers/stats');
    return response.data;
};

export const getCampaignHistory = async (dealerId: string = '00000000-0000-0000-0000-000000000001') => {
    const response = await apiClient.get(`/campaigns/history?dealer_id=${dealerId}`);
    return response.data;
};

export const getDailyActions = async (dealerId: string = '00000000-0000-0000-0000-000000000001') => {
    const response = await apiClient.get(`/dashboard/daily-actions?dealer_id=${dealerId}`);
    return response.data;
};

// Export both as default and named export
export { apiClient };
export default apiClient;
