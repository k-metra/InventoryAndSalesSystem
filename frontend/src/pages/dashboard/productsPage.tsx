import { useCallback, useEffect, useRef, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { FaChevronUp } from "react-icons/fa";
import fetchProducts from './../../utils/fetchProducts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingScreen from '../loadingScreen';
import Pagination from '../../components/pagination';
import DataTable from '../../components/DataTable';
import updateURLParams from '../../utils/updateURLParams';
import EditElementModal from '../../components/editElementModal';
import { type Field } from '../../types/fields';
import api from '../../axios/api';
import { IoMdAdd } from "react-icons/io";
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';

type dataProps = {
    current_page: number;
    data: any[];
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    links: any[];
    per_page: number;
    total: number;
}

const productFields: Field[] = [
    { label: "ID", key: "id", type: "readonly" },
    { label: "Name", key: "name", type: "text" },
    { label: "SKU", key: "sku", type: "text" },
    { label: "Stock", key: "stock", type: "number" },
    { label: "Category", 
        key: "category.name", 
        type: "options",
        fetchOptions: async () => {
            const resp = await api.get('/categories');
            return resp.data;
        }
    
    },
    { label: "Supplier", 
        key: "supplier.name", 
        type: "options",
        fetchOptions: async () => {
            const resp = await api.get('/suppliers');
            return resp.data;
        }
    },
];

const productEditFields: Field[] = [
    { label: "ID", key: "id", type: "readonly" },
    { label: "Name", key: "name", type: "text" },
    { label: "SKU", key: "sku", type: "text" },
    { label: "Price", key: "price", type: "number" },
    { label: "Cost", key: "cost", type: "number" },
    { label: "Stock", key: "stock", type: "number" },
    { label: "Category", 
        key: "category_id", 
        type: "options",
        fetchOptions: async () => {
            const resp = await api.get('/categories');
            return resp.data;
        }
    
    },
    { label: "Supplier", 
        key: "supplier_id", 
        type: "options",
        fetchOptions: async () => {
            const resp = await api.get('/suppliers');
            return resp.data;
        }
    },
];

export default function ProductsPage() {
    const queryClient = useQueryClient();

    const { addToast } = useToast();
    const params = new URLSearchParams(window.location.search);

    const { confirm } = useConfirmation();

    const initialPage = parseInt(params.get("page") || "1");
    const initialEditId = params.get("edit") || "";
    const initialSearch = params.get("search") || "";
    const initialCategory = params.get("category") || "";

    const [category, setCategory] = useState(initialCategory);
    const [activeSearch, setActiveSearch] = useState(initialSearch);
    const [editId, setEditId] = useState<string | null>(initialEditId);

    const [page, setPage] = useState<number>(initialPage);
    const [search, setSearch] = useState<string>(initialSearch);

    // @ts-ignore
    const { data, isPending, isError, refetch }: { data: dataProps, isPending: boolean, isError: boolean, refetch: () => void } = useQuery({
        queryKey: ['products', page, activeSearch],
        queryFn: fetchProducts,
        keepPreviousData: true,
    });

    const searchRef = useRef<HTMLInputElement>(null);

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

     const deleteMutation = useMutation({
            mutationFn: (id: number | string) => {
                return api.delete(`/products/${id}`).then(res => res.data);
            },

            onSuccess: () => {
                addToast("Product deleted successfully.", "success");
                queryClient.invalidateQueries({ queryKey: ['products'] })
            }
    })

    const handleSearch = () => {
        if (searchRef.current) {
            const newQuery = searchRef.current.value;
            updateURLParams("search", newQuery);
            setActiveSearch(newQuery);

            if (newQuery.length > 1) {
                updateURLParams("page", "1");
                setPage(1);
            }
        }
    }

    const handleSearchClear = () => {
        if (searchRef.current) setSearch("");
        updateURLParams("search", "");
    }

    const updateSearchBar = () => {
        setSearch(initialSearch);
        setActiveSearch(initialSearch);
    }

    const onEdit = useCallback((id?: number | string) => {
        if (!id) { 
            updateURLParams("edit", ""); 
            setEditId(null);
            return; 
        }

        console.log("Edit product with ID:", id);
        updateURLParams("edit", String(id));
        setEditId(String(id));
    }, []);

    const onDelete = useCallback(async (id?: number | string) => {
        if (!id) return;

        console.log("Delete product with ID:", id);


        const confirmation: boolean = await confirm(
            "Are you sure you want to delete this product? This action cannot be undone."
        );

        if (confirmation) {
            deleteMutation.mutate(id);
        }
        
    }, []);

    useEffect(updateSearchBar, [initialSearch]);

    if (isPending) return <LoadingScreen />;
    if (isError) return <div className="w-full h-full text-red-500 flex items-center justify-center">
        <p>Ran into an error loading the products.</p>
    </div>

    return (
        <>
        <div className="custom-scrollbar w-full h-full p-4 flex flex-col gap-4">
            <h3 className="font-bold text-text">Products</h3>
            
            <div className="custom-scrollbar w-full flex justify-between items-center">
                <div className="w-1/3 gap-4 flex flex-row">
                    <label className="relative w-full">
                    <input
                    ref={searchRef}
                    value={search}
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setSearch(e.currentTarget.value);
                            handleSearch();
                        }
                    }}

                    placeholder="Search"
                    className="focus:outline-primary transition-all duration-200 ease-in focus:outline-3 focus:shadow-[0px_2px_10px_4px_rgba(59,130,246,0.35)] border border-black/25 rounded-md p-2 pr-10 bg-secondary text-text w-full"
                />
                    <button onClick={handleSearchClear} className={`${search.length < 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} bg-transparent transition-colors-opacity duration-400 hover:bg-black/10 p-1 rounded-lg absolute z-10 right-10 top-1/2 -translate-y-1/2 text-black cursor-pointer`}>
                        <MdClear size={16} />
                    </button>

                    <button onClick={handleSearch} className="bg-transparent transition-colors duration-200 hover:bg-black/10 p-1 rounded-lg absolute z-10 right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer">
                        <CiSearch size={16} />
                    </button>
                </label>

                <button
                    onClick={() => addToast("test toast", "success")}
                    className="relative to-blue-500 group from-blue-400 bg-linear-to-r hover:to-blue-600 hover:from-blue-500 text-white p-2 rounded-md transition-colors duration-300 cursor-pointer"
                >
                    <div  className="z-20 text-sm text-black w-28 bg-background border border-black/25 p-1 absolute top-0 -translate-y-9 rounded-md left-1/2 -translate-x-1/2 hidden pointer-events-none group-hover:inline-block">
                        Add Product
                    </div>
                    <IoMdAdd size={24} className="inline-block" />
                </button>
                </div>

                <div className="flex gap-2">
                    <label className="relative">
                        <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="bg-secondary border border-black/25 text-sm hover:bg-secondary/90 cursor-pointer text-text px-4 py-2 pr-10 rounded-md transition-colors duration-200">Category</button>
                        <FaChevronUp 
                            size={12}
                            className={`absolute cursor-pointer text-text right-3 top-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${showCategoryDropdown ? '' : 'rotate-180'}`}
                        />
                    </label>
                </div>
            </div>
            
            <DataTable onDelete={onDelete} onEdit={onEdit} data={data?.data || []} columns={productFields} />
            <div className="my-5 flex justify-end w-full">
                <Pagination 
                page={page} 
                setPage={(newPage: number) => {
                    setPage(newPage);
                    updateURLParams("page", String(newPage));
                }}
                lastPage={data?.last_page}
            />
            </div>
        </div>
        
        {editId && <EditElementModal fields={productEditFields} application='products' editId={editId} onClose={() => onEdit() } />}

        </>
    )
}