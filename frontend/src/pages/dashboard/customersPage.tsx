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
import Pagination from "../../components/pagination";
import SearchBar from "../../components/searchBar";
import { IoMdAdd } from "react-icons/io";
import CreateElementModal from "../../components/createElementModal";

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
    const [currentPage, setCurrentPage] = useState<number>(searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1);
    const [create, setCreate] = useState<boolean>(searchParams.get('create') === 'true');
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');
    const [activeSearch, setActiveSearch] = useState<string>(searchParams.get('search') || '');

    const [editId, setEditId] = useState<number | null>(searchParams.get('edit') ? parseInt(searchParams.get('edit') as string) : null);

    const { 
        data: Customers, 
        isLoading: isCustomersLoading, 
        isError: isCustomersError }
         = useCustomers(currentPage, activeSearch);

    const deleteCustomer = useDeleteCustomers();
    const customerAmount = useMemo(() => {
        return Customers?.total || 0;
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

    const handleCreate = useCallback((open: boolean) => {
        if (open) {
            setEditId(null);
            searchParams.delete('edit');

            setCreate(true);
            searchParams.set('create', 'true');
        } else {
            setCreate(false);
            searchParams.delete('create');
        }

        setSearchParams(searchParams);
    }, [create, searchParams]);

    const setPage = useCallback((page: number = 1) => {
        searchParams.set('page', page.toString());
        setSearchParams(searchParams);

        setCurrentPage(page);
    }, [searchParams, currentPage]);
    
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

                <div className="max-w-md mb-4 flex flex-row items-center gap-1">
                    <SearchBar
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearch(e.target.value);
                    }}
                    value={search}
                    handleSearch={() => {
                        searchParams.delete('search');
                        setActiveSearch(search);

                        if (search.trim().length > 0) {
                            searchParams.set('search', search);
                        }

                        setSearchParams(searchParams);
                        setPage(1);
                    }}
                    handleClear={() => {
                        setActiveSearch('');
                        setSearch('');
                        searchParams.delete('search');
                        setSearchParams(searchParams);
                        setPage(1);
                    }}
                    searchParams={searchParams}
                    placeholder="Search for a customer..."
                />

                    <button
                        onClick={() => handleCreate(true)}
                        className="ml-2 relative to-blue-500 group from-blue-400 bg-linear-to-r hover:to-blue-600 hover:from-blue-500 text-white p-2 h-10 w-10 self-center rounded-md transition-colors duration-300 cursor-pointer"
                        >
                            <div  className="z-20 text-sm text-black w-28 bg-background border border-black/25 p-1 absolute top-0 -translate-y-9 rounded-md left-1/2 -translate-x-1/2 hidden pointer-events-none group-hover:inline-block">
                                Add Customer
                            </div>
                    
                            <IoMdAdd size={24} className="inline-block" />
                    </button>
                </div>

                <DataTable
                    data={Customers?.data}
                    columns={customerFields}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <Pagination 
                    page={currentPage}
                    setPage={setPage}
                    lastPage={Customers?.last_page || 1}
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

            {create && (
                <CreateElementModal
                    application="customers"
                    fields={customerFields}
                    onClose={() => handleCreate(false)}
                />
            )}
        </>
    )
}