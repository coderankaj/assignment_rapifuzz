import axios from 'axios';

// Create an instance of axios for public requests
const publicAxios = axios.create({
    baseURL: 'http://localhost:8000/api', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create an instance of axios for authenticated requests
const privateAxios = axios.create({
    baseURL: 'http://localhost:8000/api', // Same base URL for consistency
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for privateAxios to add token to requests
privateAxios.interceptors.request.use(
    (config) => {
        // Get token from local storage or any state management
        const token = localStorage.getItem('authToken'); // Adjust this based on how you store the token

        if (token) {
            // If token exists, set it in the headers
            config.headers.Authorization = `token ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Exporting the instances
export {publicAxios, privateAxios};
