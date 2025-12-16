import { useQuery } from "@tanstack/react-query";
import api from "../../axios/api";

export default function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data;
        }
    });
}