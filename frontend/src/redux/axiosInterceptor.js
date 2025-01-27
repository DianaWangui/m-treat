/*
 This file sets up an Axios instance for making API requests in the application.
 It configures a base URL for all requests.
 It injects the Redux store to access authentication tokens.
 It adds an interceptor to include the authentication token in request headers if available.
 It also adds a response interceptor to handle API errors.
 If a request fails with a 401 (Unauthorized) error, the user is automatically logged out.
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/'
});

let store = null;
export const injectStore = _store => {
  store = _store;
};

axiosInstance.interceptors.request.use(
  config => {
    if (store) {
      const token = store.getState().user.accessToken || localStorage.getItem('access_token');
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
      }
    }
    return config;

  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log('API Error:', error.response.data);
      if (error.response?.status === 401 && store) {
        const { logout } = require('./userSlice');
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;