import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;