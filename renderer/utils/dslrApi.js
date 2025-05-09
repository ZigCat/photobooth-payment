import axios from 'axios';
import config from '../config/config';

const dslrApi = {
  async request(method, endpoint, params = {}) {
    try {
      const requestParams = { ...params, password: config.dslrPassword };

      const response = await axios({
        method,
        url: `${config.dslrBaseUrl}${endpoint}`,
        params: requestParams
      });

      if (!response.data.IsSuccessful) {
        throw new Error(response.data.ErrorMessage || 'dslrBooth API request failed');
      }

      return response.data;
    } catch (error) {
      console.error(`dslrBooth API Error [${method} ${endpoint}]:`, error.response?.data || error.message);
      throw error;
    }
  },

  startPhotoSession: () => dslrApi.request('get', '/api/start', { mode: 'print' }),
  
  printCopies: (count) => dslrApi.request('get', '/api/print', { count })
};

export default dslrApi;