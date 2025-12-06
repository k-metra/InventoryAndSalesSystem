import { useMutation } from "@tanstack/react-query";
import api from "../../axios/api";

export default function useDeleteCustomers() {
    return useMutation({
        mutationFn: async (customerId: number) => {
            const res = await api.delete(`/customers/${customerId}`);
            return res.data;
        }
    });
}