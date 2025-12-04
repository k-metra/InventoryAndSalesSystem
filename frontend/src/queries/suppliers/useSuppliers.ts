import api from '../../axios/api';
import { useQuery } from '@tanstack/react-query';

export default function useSuppliers(search: string = '') {
    return useQuery({
        queryKey: ['suppliers', search],
        queryFn: async ({ queryKey }) => {
            const [_key, search] = queryKey;

            const params = new URLSearchParams();
            if (search && search.length > 0) params.set('search', search);

            const res = await api.get(`/suppliers?${params.toString()}`);
            return res.data;
        },
    });
}