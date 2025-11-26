import axios from 'axios';

const localApi = axios.create({
    baseURL: 'http://localhost:8000/sanctum',
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    withXSRFToken: true,
})

const sanctumApi = localApi;

export default sanctumApi;
// TODO: create localApi and productionApi based on environment variables and set api accordingly