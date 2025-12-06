import { useQuery } from "@tanstack/react-query";
import api from '../../axios/api';

export default function useCustomers(currentPage: number = 1) {
    return useQuery({
        queryKey: ['customers', currentPage],
        queryFn: async() => {
            const params = new URLSearchParams();

            params.set('page', currentPage.toString());

            const res = await api.get(`/customers?${params.toString()}`);
            return res.data;
        }
    });
}