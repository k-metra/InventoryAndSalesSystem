import { useQuery } from "@tanstack/react-query";
import api from '../../axios/api';

export default function useCustomers(currentPage: number = 1, activeSearch: string = '') {
    return useQuery({
        queryKey: ['customers', currentPage, activeSearch],
        queryFn: async({ queryKey }) => {
            const [_key, page, searchQuery] = queryKey;
            const params = new URLSearchParams();

            params.set('page', page.toString());

            if (searchQuery && (searchQuery as string).trim().length > 0) {
                params.set('search', searchQuery as string);
            }

            const res = await api.get(`/customers?${params.toString()}`);
            return res.data;
        }
    });
}