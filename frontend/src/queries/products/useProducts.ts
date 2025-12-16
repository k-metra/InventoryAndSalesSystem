import { useQuery } from '@tanstack/react-query';
import api from '../../axios/api';



export default function useProducts(searchQuery: string, sort: string, supplier: string, category: string) {
    return useQuery({
        queryKey: ['products', searchQuery, sort, supplier, category],
        queryFn: async ({ queryKey }) => {
            const [_key, query, sortQuery, supplierQuery, categoryQuery] = queryKey;

            const params = new URLSearchParams();

            if (query) params.set("search", query as string);
            if (sortQuery) params.set("sort", sortQuery as string);
            if (supplierQuery) params.set("supplier", supplierQuery as string);
            if (categoryQuery) params.set("category", categoryQuery as string);

            return await api.get(`/products?${params.toString()}`).then(res => res.data);
        }
    });
}