import { useQuery } from "@tanstack/react-query";
import api from '../../axios/api';

export default function useCustomers(byPage: boolean = true, currentPage: number = 1, activeSearch: string = '') {
    return useQuery({
        queryKey: ['customers', currentPage, activeSearch],
        queryFn: async({ queryKey }) => {
            const [_key, page, searchQuery] = queryKey;
            const params = new URLSearchParams();

            if (byPage) params.set('page', page.toString())
            else params.set('all', 'true');

            if (searchQuery && (searchQuery as string).trim().length > 0) {
                params.set('search', searchQuery as string);
            }

            const res = await api.get(`/customers?${params.toString()}`);
            return res.data;
        }
    });
}