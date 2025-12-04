import api from '../../axios/api';
import { useQuery } from '@tanstack/react-query';

export default function useSuppliers() {
    return useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => {
            const res = await api.get('/suppliers');
            return res.data;
        },
    });
}