import axios from 'axios';
import config from '../config/config';

const api = {
    async request(method, endpoint, data = null, params = {}) {
      try {
        const requestParams = { ...params, api_key: config.apiKey };
        
        const response = await axios({
          method,
          url: `${config.baseUrl}${endpoint}`,
          data: data,
          params: requestParams
        });
        
        return response.data;
      } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error.response?.data || error.message);
        throw error;
      }
    },
    createOrder: (orderData) => api.request('post', '/orders/create', orderData),
    getOrder: (orderId) => api.request('get', `/orders/${orderId}`),
    confirmOrder: (orderId) => api.request('post', `/orders/${orderId}/confirm`),
    cancelOrder: (orderId) => api.request('post', `/orders/${orderId}/cancel`)
};

export default api;