import { useQuery } from '@tanstack/react-query';
import api from '../../axios/api';


export default function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            return await api.get('/products').then(res => res.data);
        }
    });
}