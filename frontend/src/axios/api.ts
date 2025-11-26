import axios from 'axios';

const localApi = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    withXSRFToken: true,
})

const api = localApi;

export default api;
// TODO: create localApi and productionApi based on environment variables and set api accordingly