import { useQuery } from "@tanstack/react-query";
import api from '../../axios/api';

export default function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await api.get('/dashboard');
            return response.data;
        }
    });
}