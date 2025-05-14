import axios from 'axios';
import config from '../config/config';

const api = {
    async request(method, endpoint, data = JSON.stringify({}), params = {}) {
      try {
        const requestParams = { ...params };
        
        const response = await axios({
          method,
          url: `${config.proxyBaseUrl}/api/payments${endpoint}`,
          data: data,
          params: requestParams,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-proxy-key': config.proxyApiKey,
          }
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