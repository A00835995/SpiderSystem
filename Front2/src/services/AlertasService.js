import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

export async function fetchAlertas() {
    try {
        const response = await axiosInstance.get(API_CONFIG.endpoints.getAlertas);
        return response.data;
    } catch (error) {
        console.error('Error fetching alertas:', error);
        throw error;
    }
}