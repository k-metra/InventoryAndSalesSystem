
import useSuppliers from '../../queries/suppliers/useSuppliers';
import { useSearchParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdClear, MdEdit } from "react-icons/md";
import type { Supplier } from "../../types/objects";
import { FaPhone } from "react-icons/fa";
import { IoMdAdd, IoMdPerson } from "react-icons/io";
import { FaHouse } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import EditElementModal from "../../components/editElementModal";
import type { Field } from "../../types/fields";
import useDeleteSuppliers from '../../queries/suppliers/useDeleteSuppliers';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import { useQueryClient } from '@tanstack/react-query';
import CreateElementModal from '../../components/createElementModal';

const supplierFields: Field[] = [
    {
        label: "Name",
        key: "name",
        type: "text",
    },
    {
        label: 'E-mail',
        key: 'email',
        type: 'text',
    },
    {
        label: 'Contact Person',
        type: 'text',
        key: 'contact_person',
    },
    {
        label: 'Phone Number',
        type: 'text',
        key: 'phone',
    },
    {
        label: 'Address',
        type: 'textarea',
        key: 'address',
    }

];

export default function SuppliersPage() {

    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToast } = useToast();
    const { confirm } = useConfirmation();

    const [editId, setEditId] = useState<number | null>(searchParams.get('edit') ? parseInt(searchParams.get('edit')!) : null);
    const [create, setCreate] = useState<boolean>(searchParams.get('create') === 'true');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [activeSearch, setActiveSearch] = useState(searchParams.get('search') || '');

    const { data, isLoading, isError } = useSuppliers(activeSearch);
    const deleteSuppliers = useDeleteSuppliers();

    const handleCreate = useCallback((open: boolean) => {
        searchParams.delete('edit');
        searchParams.delete('create');

        if (open) {
            searchParams.set('create', 'true');
        }

        setSearchParams(searchParams);
        setCreate(open);
    }, [searchParams, setSearchParams]);

    const handleSearch = useCallback(() => {
        setActiveSearch(search);

        searchParams.delete("search");

        if (search.trim() !== '') {
            searchParams.set("search", search);
        }

        setSearchParams(searchParams);
    }, [search, searchParams])

    const handleEdit = useCallback((id: number | null) => {
        searchParams.delete("edit");

        if (id !== null) {
            searchParams.set("edit", id.toString());
        }

        setSearchParams(searchParams);
        setEditId(id);
    }, []);

    const handleDelete = useCallback(async (id: number | string) => {
        if (!id) return;

        const confirmation = await confirm("Are you sure you want to delete this supplier? This CANNOT be undone.");

        if (!confirmation) {
            return;
        }

        deleteSuppliers.mutate(id, {
            onSuccess: () => {
                addToast("Supplier deleted successfully", "success");
                queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            },

            onError: (err) => {
                addToast("Ran into an error deleting that supplier.", "error");
                console.error(err);
            }
        });
    }, []);

    return (
        <div className="p-4 w-full h-full">
            <h3 className="font-bold text-text mb-4">Suppliers</h3>
            <div className="mb-4">
                <label className="relative">
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        className="bg-secondary border p-2 rounded-md transition-colors duration-300 ease-in border-black/25 outline-none focus:outline-blue-500 focus:border-blue-500 focus:shadow-[0_0_10px_-2px_var(--color-blue-500)] w-full max-w-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                          {(activeSearch !== search || activeSearch === '') ? (
                            <button
                                onClick={() => handleSearch()}
                                className="absolute inline-block right-3 top-1/2 -translate-y-1/2 text-white p-2 cursor-pointer rounded-full hover:bg-black/10 transition-colors duration-200"
                                        >
                                <CiSearch size={18} className="text-text" />
                            </button>
                        ): (
                            <button
                                onClick={() => { setSearch(''); setActiveSearch(''); searchParams.delete('search'); setSearchParams(searchParams);  }}
                                className="absolute inline-block right-3 top-1/2 -translate-y-1/2 text-white p-2 cursor-pointer rounded-full hover:bg-black/10 transition-colors duration-200"
                            >
                                <MdClear size={18} className="text-text" />
                            </button>
                        )}  
                </label>

                 <button
                    onClick={() => handleCreate(true)}
                        className="ml-4 relative to-blue-500 group from-blue-400 bg-linear-to-r hover:to-blue-600 hover:from-blue-500 text-white p-2 h-10 w-10 self-center rounded-md transition-colors duration-300 cursor-pointer"
                    >
                        <div  className="z-20 text-sm text-black w-28 bg-background border border-black/25 p-1 absolute top-0 -translate-y-9 rounded-md left-1/2 -translate-x-1/2 hidden pointer-events-none group-hover:inline-block">
                            Add Supplier
                        </div>

                        <IoMdAdd size={24} className="inline-block" />
                </button>
            </div>
            <div className="w-full h-full overflow-y-auto custom-scrollbar grid grid-cols-2 gap-4">
                {isLoading ? (
                    <p className="text-text">Loading suppliers...</p>
                ) : isError ? (
                    <p className="text-red-500">Error loading suppliers.</p>
                ) : data?.length === 0 ? (
                    <p className="text-text">No suppliers found.</p>
                ) : (
                    <>
                     {data?.map((supplier: Supplier) => (
                        <div className="w-full m-auto bg-secondary border border-black/25 p-4 rounded-md flex flex-row gap-0" key={supplier.id}>
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <h6 className="text-text font-semibold">{supplier.name}</h6>
                                    <span className="text-[12px] text-muted">{supplier.products_count} Product{(supplier.products_count! > 1 || supplier.products_count! < 1) && 's'}</span>
                                </div>

                                <span className="text-[14px] text-text/90 mb-1 line-clamp-1">
                                    <FaPhone className="inline-block mr-2" />
                                    {supplier.phone}
                                </span>
                                <span className="text-[14px] text-text/90 mb-1 line-clamp-1">
                                    <IoMdPerson className="inline-block mr-2" /> 
                                    {supplier.contact_person}
                                </span>
                                <span className="text-[14px] text-text/90 mb-1 line-clamp-1">
                                    <FaHouse className="inline-block mr-2" />
                                    {supplier.address}
                                </span>
                            </div>

                            <div className="flex flex-col max-w-1/4 ml-4 gap-1 items-center">
                                <button
                                    onClick={() => handleEdit(supplier.id)}
                                    className="from-blue-500 to-blue-600 bg-linear-to-r p-2 py-4 rounded-md text-white hover:from-blue-600 hover:to-blue-700 transition-colors duration-300 ease-in cursor-pointer"
                                >
                                    <MdEdit size={20} />

                                </button>

                                <button
                                    onClick={() => handleDelete(supplier.id)}
                                    disabled={supplier.products_count! > 0}
                                    title={supplier.products_count! > 0 ? "Cannot delete supplier with 1 or more products" : "Delete Supplier" }
                                    className="bg-transparent border border-red-500 p-2 py-4 rounded-md text-white hover:bg-red-500 group transition-colors duration-100 ease-in cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <AiFillDelete className="text-red-500 group-hover:text-background" size={20} />

                                </button>
                            </div>
                            
                        </div>
                     ))}

                     {editId !== null && (
                        <EditElementModal editId={String(editId)} fields={supplierFields} application={"suppliers"} onClose={() => handleEdit(null)}/>
                     )}

                     {create && (
                        <CreateElementModal onClose={() => handleCreate(false)} fields={supplierFields} application="suppliers"/>
                     )}
                    </>
                )}
            </div>
        </div>
    )
}