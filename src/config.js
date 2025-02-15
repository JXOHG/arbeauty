const isDevelopment = import.meta.env.DEV; // Vite provides this boolean

export const API_URL = isDevelopment 
  ? 'http://localhost:8080'  // Local development server
  : 'https://backend-api-10136972538.northamerica-northeast2.run.app'; // Production server