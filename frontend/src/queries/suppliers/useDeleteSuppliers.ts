import { useMutation } from '@tanstack/react-query';
import { useToast } from '../../contexts/ToastContext';
import api from '../../axios/api';
import { useConfirmation } from '../../contexts/ConfirmationContext';

export default async function useDeleteSuppliers(id: number | string) {
    const { confirm } = useConfirmation();
    const { addToast } = useToast();

    if (!id) throw new Error("Supplier ID is missing for useDeleteSuppliers.");

    if (!(await confirm(`Are you sure you want to delete Supplier ${id}? This action cannot be undone.`))) {
        return;
    }

    useMutation({
        mutationFn: async (id: number | string) => {
            const res = await api.delete(`/suppliers/${id}`);

            return res.data;
        },

        onError: (error) => {
            console.error("Error deleting supplier:", error);
            addToast('Ran into an error deleting that supplier.', 'error', 9000);
        },

        onSuccess: () => {
            addToast('Supplier deleted successfully.', 'success', 5000);
        }
    }).mutate(id);
}