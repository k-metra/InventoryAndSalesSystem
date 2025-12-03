import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CiSearch } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { useSearchParams } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import CreateElementModal from '../../components/createElementModal';
import api from '../../axios/api';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin2Line } from 'react-icons/ri';
import type { Field } from '../../types/fields';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import EditElementModal from '../../components/editElementModal';

type Category = {
    id: number | string;
    name: string;
    description: string;
    products_count: number;
}

const categoryFields: Field[] = [
    { label: "Name", key: "name", type: "text" }, 
    { label: "Description", key: "description", type: "textarea"}
]

export default function CategoriesPage() {
    const { confirm } = useConfirmation();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const [searchParams, setSearchParams] = useSearchParams();

    const [activeSearch, setActiveSearch] = useState(searchParams.get("search") || "");
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [editId, setEditId] = useState<string | null>(searchParams.get("edit") || null);

    const [createOpen, setCreateOpen] = useState(false);

    const handleCreate = useCallback((open: boolean) => {
        setCreateOpen(open);
    }, []);

    const { data: categoryList, isPending: isCategoryListPending, isError: isCategoryListError } = useQuery({
        queryKey: ['categories', activeSearch],
        queryFn: async ({ queryKey }) => {
            const [_key, search] = queryKey;

            const params = new URLSearchParams();

            if (search) params.set('search', String(search));

            const resp =
                await api.get('/categories?' + params.toString())
                .then(res => res.data)
                .catch((err) => {
                    console.log("Error fetching categories", err);
                    return [];
                });

            return resp;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number | string) => {
            await api.delete(`/categories/${id}`)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ['categories']});
                addToast("Category deleted successfully.", "success");
            })
            .catch((err) => {
                console.log("Error deleting category", err);
                addToast(err.response?.data?.error ?? "An error occurred while deleting the category.", "error");
            })
        }
    });

    const handleDelete = useCallback(async (id: number) => {
        if (await confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
            deleteMutation.mutate(id);
        }
    }, []);

    return (
        <div className="w-full h-full p-4">
            <h3 className="font-bold text-text">Categories</h3>

            <div className="flex flex-row gap-4 w-full mt-4">
                <label className="relative w-1/3">
                    <input
                    type="text"
                    placeholder={"Search"}
                    className="h-full w-full focus:outline-blue-500 border border-black/25 rounded-md px-3 py-3 pr-18 bg-secondary text-text"
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    />

                    {(activeSearch !== search || activeSearch === '') ? (
                        <button
                    onClick={() => {
                        setActiveSearch(search);
                        if (search.trim() === "") {
                            searchParams.delete("search");
                            setSearchParams(searchParams);
                        } else {
                            setSearchParams({ search: search });
                        }
                    }}
                    className="absolute inline-block right-3 top-1/2 -translate-y-1/2 text-white p-2 cursor-pointer rounded-full hover:bg-black/10 transition-colors duration-200"
                    >
                        <CiSearch size={18} className="text-text" />
                    </button>
                    ): (
                        <button
                    onClick={() => {
                        setActiveSearch("");
                        setSearch("");
                        searchParams.delete("search");
                        setSearchParams(searchParams);
                    }}
                    className="absolute inline-block right-3 top-1/2 -translate-y-1/2 text-white p-2 cursor-pointer rounded-full hover:bg-black/10 transition-colors duration-200"
                    >
                        <MdClear size={18} className="text-text" />
                    </button>
                    )}  
                </label>

                    <button
                        onClick={() => handleCreate(true)}
                        className="relative to-blue-500 group from-blue-400 bg-linear-to-r hover:to-blue-600 hover:from-blue-500 text-white p-2 h-10 w-10 self-center rounded-md transition-colors duration-300 cursor-pointer"
                    >
                        <div  className="z-20 text-sm text-black w-28 bg-background border border-black/25 p-1 absolute top-0 -translate-y-9 rounded-md left-1/2 -translate-x-1/2 hidden pointer-events-none group-hover:inline-block">
                            Add Category
                        </div>
                        <IoMdAdd size={24} className="inline-block" />
                    </button>
            </div>
            <hr className="border-t border-t-black/25 my-4" />

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isCategoryListPending && (
                    <p className="text-text">Loading categories...</p>
                )}

                {isCategoryListError && (
                    <p className="text-red-500">Error loading categories.</p>
                )}

                {categoryList && categoryList.length === 0 && (
                    <p className="text-text">No categories found.</p>
                )}

                {(categoryList && categoryList.length > 0) && categoryList.map((cat: Category) => (
                    <div key={cat.id} className="p-4 bg-secondary border border-black/25 rounded-md shadow-sm flex flex-col gap-2 relative">
                        <div className="flex justify-between items-center">
                            <h6 className="font-bold text-text">{cat.name}</h6>
                            <span className="text-[0.79rem]  px-2 py-1 rounded-full text-text/70">{cat.products_count || 0} Products</span>
                        </div>
                        <span className="text-text/80 text-sm line-clamp-2">{cat.description || "No description provided."}</span>
                        <div className="mt-auto flex justify-end gap-1 items-center">
                            <button
                                onClick={() => {
                                    setEditId(String(cat.id));
                                    searchParams.set("edit", String(cat.id));
                                    setSearchParams(searchParams);
                                }}
                                className="to-blue-600 from-blue-500 bg-linear-to-r hover:to-blue-700 hover:from-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
                            >
                                <FaRegEdit />
                            </button>

                            <button
                                onClick={() => handleDelete(Number(cat.id))}
                                disabled={cat.products_count > 0}
                                className="relative disabled:to-red-500/50 disabled:from-red-400/50 group disabled:cursor-not-allowed to-red-500 from-red-400 bg-linear-to-r hover:to-red-700 hover:from-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
                            >
                                <RiDeleteBin2Line />
                                {cat.products_count >0 && (
                                    <div className="opacity-100 z-30 text-[12px] text-text max-w-30 min-w-25 bg-secondary border border-black/25 p-1 absolute top-0 -translate-y-12 rounded-md left-1/2 -translate-x-1/2 hidden pointer-events-none group-hover:inline-block">
                                        Category has products.
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {createOpen && (
                <CreateElementModal fields={categoryFields} application={"categories"} onClose={() => handleCreate(false)} />
            )}

            {editId && (
                <EditElementModal
                    fields={categoryFields}
                    application="categories"
                    editId={editId}
                    onClose={() => {
                        setEditId(null);
                        searchParams.delete("edit");
                        setSearchParams(searchParams);
                    }}
                />
            )}
        </div>
    )
}