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
import CreateElementModal from '../../components/createElementModal';
import type { AxiosError } from 'axios';
import { type Category, type Supplier } from '../../types/objects';
import { formatCurrency } from '../../utils/formatNumbers';

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
    { label: "Price", key: "price", type: "number", format: formatCurrency },
    { label: "Stock", key: "stock", type: "number", lowThreshold: 15 },
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
    { label: "VAT Exempt", key: "vat_exempt", type: "boolean" },
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

const sortList: string[] = [
    "Greater Stock",
    "Lower Stock",
    "Higher Price",
    "Lower Price",
    "A-Z",
    "Z-A",
    "Greater Cost",
    "Lower Cost",
    "Vat Exempt",
    "Non-Vat Exempt",
];


export default function ProductsPage() {
    const queryClient = useQueryClient();

    const { addToast } = useToast();
    const params = new URLSearchParams(window.location.search);

    const { confirm } = useConfirmation();

    const initialPage = parseInt(params.get("page") || "1");
    const initialSort = params.get("sortBy") || "";
    const initialEditId = params.get("edit") || "";
    const initialSearch = params.get("search") || "";
    const initialCategory = params.get("category") || "";
    const initialSupplier = params.get("supplier") || "";

    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const supplierDropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const [sort, setSort] = useState(initialSort);
    const [category, setCategory] = useState(initialCategory);
    const [supplier, setSupplier] = useState(initialSupplier);
    const [showCreate, setShowCreate] = useState(params.get("create") === "true");
    const [activeSearch, setActiveSearch] = useState(initialSearch);
    const [editId, setEditId] = useState<string | null>(initialEditId);

    const [page, setPage] = useState<number>(initialPage);
    const [search, setSearch] = useState<string>(initialSearch);

    // @ts-ignore
    const { data, isPending, isError, refetch }: { data: dataProps, isPending: boolean, isError: boolean, refetch: () => void } = useQuery({
        queryKey: ['products', page, activeSearch, category, supplier, sort],
        queryFn: fetchProducts,
        keepPreviousData: true,
    });

    const searchRef = useRef<HTMLInputElement>(null);

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const { data: categoryList, isPending: isCategoryPending } = useQuery({
        queryKey: ['categories', 'getCategories'],
        queryFn: async () => {
            const resp = await api.get('/categories');

            return resp.data;
        },
    });

    const { data: supplierList, isPending: isSupplierPending } = useQuery({
        queryKey: ['suppliers', 'getSuppliers'],
        queryFn: async () => {
            return await api.get('/suppliers').then(res => res.data);
        }
    })

    const selectedCategoryName = categoryList?.find((cat: Category) => String(cat.id) === category)?.name || "";
    const selectedSupplierName = supplierList?.find((sup: Supplier) => String(sup.id) === supplier)?.name || "";

     const deleteMutation = useMutation({
            mutationFn: (id: number | string) => {
                return api.delete(`/products/${id}`).then(res => res.data);
            },

            onSuccess: () => {
                addToast("Product deleted successfully.", "success");
                queryClient.invalidateQueries({ queryKey: ['products'] })
            },

            onError: (err: AxiosError) => {
                if (err.status === 404) {
                    addToast("That product could not be found.", "error");
                } else {
                    addToast("An error occurred while deleting the product. Check the console logs for more information.", "error");

                    console.error(err);
                }
            }
    })

    const handleCreate = (open: boolean) => {
        updateURLParams("create", open ? "true" : "false");
        setShowCreate(open);
    }

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }

            if (supplierDropdownRef.current && !supplierDropdownRef.current.contains(event.target as Node)) {
                setShowSupplierDropdown(false);
            }

            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                    onClick={() => handleCreate(true)}
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
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                setShowSortDropdown(!showSortDropdown);
                            }} 
                            className="bg-secondary border border-black/25 text-sm hover:bg-secondary/90 cursor-pointer text-text pr-10 px-4 py-2 rounded-md transition-colors duration-200">{sort !== '' ? `Sort By: ${sort}` : "Sort"}</button>

                        <FaChevronUp 
                            size={12}
                            className={`absolute cursor-pointer text-text right-3 top-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${showSortDropdown ? '' : 'rotate-180'}`}
                        />

                        <div ref={sortDropdownRef} className={`custom-scrollbar absolute z-20 top-12 inline-block left-1/2 -translate-x-1/2 bg-background border border-black/25 rounded-md shadow-lg w-48 max-h-60 overflow-y-auto transition-opacity duration-300 ${showSortDropdown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            <div 
                                onClick={() => {
                                    setSort("");
                                    updateURLParams("sortBy", "");
                                    setShowSortDropdown(false);
                                }}
                                className={`px-4 py-2 hover:bg-black/10 cursor-pointer ${sort === "" ? "border-l-8 font-semibold border-l-primary" : ""}`}
                            >None</div>
                            {sortList.map((sortType: string) => (
                                 <div
                                    key={sortType}
                                    onClick={() => {
                                        setSort(sortType);
                                        updateURLParams("sortBy", sortType);
                                        setShowSortDropdown(false);
                                    }}
                                    className={`px-4 py-2 hover:bg-black/10 cursor-pointer ${sort === sortType ? "border-l-8 font-semibold border-l-primary" : ""}`}
                                >
                                    {sortType}
                                </div>
                            ))}
                            { isSupplierPending && <div className="p-4 text-center text-sm text-black/50">Loading Suppliers...</div> }
                        </div>
                    </label>
                    <label className="relative">
                        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            setShowSupplierDropdown(!showSupplierDropdown);
                        }} className="bg-secondary border border-black/25 text-sm hover:bg-secondary/90 cursor-pointer text-text pr-10 px-4 py-2 rounded-md transition-colors duration-200">{selectedSupplierName !== '' ? `Supplier: ${selectedSupplierName}` : "Suppliers"}</button>

                        <FaChevronUp 
                            size={12}
                            className={`absolute cursor-pointer text-text right-3 top-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${showSupplierDropdown ? '' : 'rotate-180'}`}
                        />

                        <div ref={supplierDropdownRef} className={`custom-scrollbar absolute z-20 top-12 inline-block left-1/2 -translate-x-1/2 bg-background border border-black/25 rounded-md shadow-lg w-48 max-h-60 overflow-y-auto transition-opacity duration-300 ${showSupplierDropdown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            <div 
                                onClick={() => {
                                    setSupplier("");
                                    updateURLParams("supplier", "");
                                    setShowSupplierDropdown(false);
                                }}
                                className={`px-4 py-2 hover:bg-black/10 cursor-pointer ${supplier === "" ? "border-l-8 font-semibold border-l-primary" : ""}`}
                            >   All Suppliers</div>
                            {supplierList && supplierList.map((sup: Supplier) => (
                                 <div
                                    key={sup.id}
                                    onClick={() => {
                                        setSupplier(String(sup.id));
                                        updateURLParams("supplier", String(sup.id));
                                        setShowSupplierDropdown(false);
                                    }}
                                    className={`px-4 py-2 hover:bg-black/10 cursor-pointer ${supplier === String(sup.id) ? "border-l-8 font-semibold border-l-primary" : ""}`}
                                >
                                    {sup.name}
                                </div>
                            ))}
                            { isSupplierPending && <div className="p-4 text-center text-sm text-black/50">Loading Suppliers...</div> }
                        </div>
                    </label>

                    <label className="relative">
                        <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="bg-secondary border border-black/25 text-sm hover:bg-secondary/90 cursor-pointer text-text px-4 py-2 pr-10 rounded-md transition-colors duration-200">{category !== "" ? `Category: ${selectedCategoryName}` : "Category"}</button>
                        <FaChevronUp 
                            size={12}
                            className={`absolute cursor-pointer text-text right-3 top-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${showCategoryDropdown ? '' : 'rotate-180'}`}
                        />

                        <div ref={categoryDropdownRef} className={`custom-scrollbar absolute z-20 top-12 inline-block left-1/2 -translate-x-1/2 bg-background border border-black/25 rounded-md shadow-lg w-48 max-h-60 overflow-y-auto transition-opacity duration-300 ${showCategoryDropdown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            <div 
                                onClick={() => {
                                    setCategory("");
                                    updateURLParams("category", "");
                                    setShowCategoryDropdown(false);
                                }}
                                className={`px-4 py-2 hover:bg-black/10 cursor-pointer ${category === "" ? "border-l-8 font-semibold border-l-primary" : ""}`}
                            >   All Categories</div>
                            {categoryList && categoryList.map((cat: Category) => (
                                 <div
                                    key={cat.id}
                                    onClick={() => {
                                        setCategory(String(cat.id));
                                        updateURLParams("category", String(cat.id));
                                        setShowCategoryDropdown(false);
                                    }}
                                    className={`px-4 py-2 hover:bg-black/10 cursor-pointer ${category === String(cat.id) ? "border-l-8 font-semibold border-l-primary" : ""}`}
                                >
                                    {cat.name}
                                </div>
                            ))}
                            { isCategoryPending && <div className="p-4 text-center text-sm text-black/50">Loading Categories...</div> }
                        </div>
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
        {showCreate && <CreateElementModal fields={productEditFields} application='products' onClose={() => { handleCreate(false) } } />}

        </>
    )
}