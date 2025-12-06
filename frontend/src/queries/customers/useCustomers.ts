import { useQuery } from "@tanstack/react-query";
import api from '../../axios/api';

export default function useCustomers() {
    return useQuery({
        queryKey: ['customers'],
        queryFn: async() => {
            const res = await api.get('/customers');
            return res.data;
        }
    });
}