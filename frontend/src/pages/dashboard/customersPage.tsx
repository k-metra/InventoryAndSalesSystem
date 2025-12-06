import { FaSpinner } from "react-icons/fa";
import useCustomers from "../../queries/customers/useCustomers";
import DataTable from "../../components/DataTable";
import { useToast } from "../../contexts/ToastContext";
import { useConfirmation } from "../../contexts/ConfirmationContext";
import type { Field } from "../../types/fields";
import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import useDeleteCustomers from "../../queries/customers/useDeleteCustomers";
import EditElementModal from "../../components/editElementModal";

const customerFields: Field[] = [
    { label: 'ID', key: 'id', type: 'readonly' },
    { label: 'Name', key: 'name', type: 'text' },
    { label: 'Email', key: 'email', type: 'text' },
    { label: 'Phone', key: 'phone', type: 'text' },
];

export default function CustomersPage() {
    const { addToast } = useToast();
    const { confirm } = useConfirmation();

    const [searchParams, setSearchParams] = useSearchParams();

    const [editId, setEditId] = useState<number | null>(searchParams.get('edit') ? parseInt(searchParams.get('edit') as string) : null);

    const { 
        data: Customers, 
        isLoading: isCustomersLoading, 
        isError: isCustomersError }
         = useCustomers();

    const deleteCustomer = useDeleteCustomers();
    const customerAmount = useMemo(() => {
        return Customers ? Customers.length : 0;
    }, [Customers]);

    const handleEdit = useCallback((customerId?: string | number | undefined) => {
        setEditId(customerId ? (typeof customerId === 'string' ? parseInt(customerId) : customerId) : null);
        searchParams.delete('edit');

        if (customerId) searchParams.set('edit', customerId.toString());

        setSearchParams(searchParams);

    }, [editId, searchParams]);

    const handleDelete = useCallback(async (customerId: number | string | undefined) => {
        if (!customerId) return;

        const confirmed = await confirm('Are you sure you want to delete this customer? This cannot be undone.');

        if (confirmed) {
            deleteCustomer.mutate(
                customerId as number,
                {
                    onSuccess: () => {
                        addToast('Customer deleted successfully.', 'success');
                    },

                    onError: (err) => {
                        addToast('Ran into an error deleting customer. Please check the console for more information.', 'error');
                        console.error(err);
                    }
                }
            );
        }
    }, [confirm, addToast, deleteCustomer]);
    
    if (isCustomersError) return <div className="w-full h-full p-6 text-lg text-red-500">Ran into an error loading customers.</div>;

    if (isCustomersLoading) return (
        <div className="w-full h-full p-6 flex items-center justify-center text-md text-text">
            Loading Customers...
            <FaSpinner className="inline-block ml-2 animate-spin" />
        </div>
    )

    return (
        <>
            <div className="w-full h-full p-4">
                <h4 className="font-bold mb-4 text-text">All Customers ({customerAmount})</h4>

                <DataTable
                    data={Customers}
                    columns={customerFields}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {editId !== null && (
                <EditElementModal
                    editId={String(editId)}
                    application="customers"
                    fields={customerFields}
                    onClose={() => handleEdit()}
                />
            )}
        </>
    )
}