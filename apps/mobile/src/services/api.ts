import axios from 'axios';
import { DEVELOPMENT_CONFIG } from '../config/development';

// adding /api to the end of the baseurl of the backend server to be able to call the apis
const API_BASE_URL = `${DEVELOPMENT_CONFIG.backendBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;