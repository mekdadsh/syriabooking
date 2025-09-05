// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://syriabooking.onrender.com/api'
  : 'http://localhost:8800/api';

export default API_BASE_URL;
