import { useQuery } from '@tanstack/react-query';
import api from '../../axios/api';


export default function useProducts(searchQuery: string) {
    return useQuery({
        queryKey: ['products', searchQuery],
        queryFn: async ({ queryKey }) => {
            const [_key, query] = queryKey;
            return await api.get('/products').then(res => res.data);
        }
    });
}