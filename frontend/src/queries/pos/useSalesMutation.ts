import { useMutation } from '@tanstack/react-query';
import { type SalesBody } from "@typings/requests";
import api from '@api/api';

export default function useSalesMutation() {
    return useMutation({
        mutationFn: async (saleData: SalesBody) => {
            console.log(saleData);
            const resp = await api.post('/sales', saleData);

            return resp.data;
        }
    })
}