import { useMutation } from '@tanstack/react-query';
import api from '../../axios/api';

export default function useDeleteSuppliers() {
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await api.delete(`/suppliers/${id}`);

            return res.data;
        }
    });
}