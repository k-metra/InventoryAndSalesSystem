import { AiOutlineProduct } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import SearchBar from "../../components/searchBar";
import useProducts from "../../queries/products/useProducts";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import Dropdown from "../../components/dropdown";
import useSuppliers from "../../queries/suppliers/useSuppliers";
import type { Category, Supplier } from "../../types/objects";
import useCategories from "../../queries/categories/useCategories";
import type { Product } from "../../utils/fetchProducts";
import Pagination from "../../components/pagination";

export default function POSPage() {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeSearch, setActiveSearch] = useState<string>(searchParams.get("search") || "");
    const [search, setSearch] = useState(activeSearch || "");
    const [sort, setSort] = useState<string>(searchParams.get("sort") || "");
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);
    const [supplier, setSupplier] = useState<string>(searchParams.get("supplier") || "");
    const [category, setCategory] = useState<string>(searchParams.get("category") || "");
    const [sortOpen, setSortOpen] = useState(false);
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    const sortRef = useRef<HTMLDivElement | null>(null);
    const supplierRef = useRef<HTMLDivElement | null>(null);
    const categoryRef = useRef<HTMLDivElement | null>(null);

    const onSortClick = useCallback(() => setSortOpen(prev => !prev), [setSortOpen]);
    const onSupplierClick = useCallback(() => setSupplierOpen(prev => !prev), [setSupplierOpen]);
    const onCategoryClick = useCallback(() => setCategoryOpen(prev => !prev), [setCategoryOpen]);

    const {
        data: supplierList,
        isPending: isSuppliersPending,
        isError: isSuppliersError,
    } = useSuppliers();

    const {
        data: categoryList,
        isPending: isCategoriesPending,
        isError: isCategoriesError,
    } = useCategories();
    

    const sortingOptions = useMemo(() => {
        return [
            { label: "Name: A to Z", value: "A-Z" },
            { label: "Name: Z to A", value: "Z-A" },
            { label: "Price: Low to High", value: "Lower Price" },
            { label: "Price: High to Low", value: "Higher Price" },
            { label: "Stock: Low to High", value: "Lower Stock" },
            { label: "Stock: High to Low", value: "Greater Stock" },
            { label: "Cost: Low to High", value: "Lower Cost" },
            { label: "Cost: High to Low", value: "Greater Cost" },
        ];
    }, []);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
        updateParam("page", page.toString());
    }, []);


    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
            setSortOpen(false);
        }

        if (supplierRef.current && !supplierRef.current.contains(e.target as Node)) {
            setSupplierOpen(false);
        }

        if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
            setCategoryOpen(false);
        }
        
    }, [sortRef, supplierRef, categoryRef]);

    const updateParam = useCallback((param: string, value: string | null) => {
        const newParams = new URLSearchParams(searchParams);

        if (value) newParams.set(param, value);
        else newParams.delete(param);

        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const handleSearch = useCallback((searchQuery: string | null) => {
        if (searchQuery && searchQuery.trim()) {
            setActiveSearch(searchQuery.trim());
            updateParam("search", searchQuery.trim())
        } else {
            setActiveSearch("");
            updateParam("search", null);
        }
    }, [setActiveSearch, updateParam]);

    const {
        data: products,
        isPending: isProductsLoading,
        isError: isProductError,
        refetch: refetchProducts
    } = useProducts(activeSearch, sort, supplier, category, currentPage, false);

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        }
    }, [handleClickOutside]);

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="shadow-md bg-background border border-black/25 rounded-md p-4 mb-4">
                <h4 className="text-text text-lg  font-semibold mb-2">
                    Product List
                    <AiOutlineProduct className="inline-block ml-2" size={35} />

                    
                </h4>
                <hr className="border-t border-black/25 my-4" />
                <SearchBar 
                    placeholder="Product name or SKU..."
                    handleSearch={() => handleSearch(search)}
                    handleClear={() => {}}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    value={search}

                    searchParams={searchParams}
                />
                
                <div className="flex gap-2 my-2 items-start">

                    <Dropdown 
                        onOptionClick={(option?: string | null) => {
                            updateParam("sort", option || "");
                            setSort(option || "");
                            setSortOpen(false);
                        }}
                        ref={sortRef}
                        onClick={onSortClick}
                        options={sortingOptions}
                        label="Sort by"
                        value={sort || undefined}
                        isOpen={sortOpen}
                    />



                    <Dropdown
                        onOptionClick={(option?: string | null) => {
                            updateParam("supplier", option || "");
                            setSupplier(option || "");
                            setSupplierOpen(false);
                        }}
                        ref={supplierRef}
                        onClick={onSupplierClick}
                        options={(supplierList && supplierList.map((supplier: Supplier) => ({ label: supplier.name, value: supplier.id }))) || []}
                        label="Supplier"
                        value={supplier || undefined}
                        isOpen={supplierOpen}
                    />


                    <Dropdown
                        options={(categoryList && categoryList.map((category: Category) => ({ label: category.name, value: category.id }))) || []}
                        onOptionClick={(option?: string | null) => {
                            updateParam("category", option || "");
                            setCategory(option || "");
                            setCategoryOpen(false);
                        }}
                        ref={categoryRef}
                        onClick={onCategoryClick}
                        label="Category"
                        isOpen={categoryOpen}
                        value={category || undefined} 
                    />

                </div>

                <div className="flex justify-end mt-1 mb-2">
                    <Pagination
                        key={"paginationTop"}
                        page={currentPage}
                        lastPage={products?.last_page || 1}
                        setPage={setPage}
                    />
                </div>

                
                <hr className="border-t border-black/25 my-4" />

                {isProductsLoading ? (
                    <p className="text-text text-center">Loading products...</p>
                ) : isProductError ? (
                    <p className="text-red-500">Ran into an error loading products.</p>
                ) : (
                    <div className="flex flex-col flex-wrap gap-4 w-full">
                        {(products && products?.data?.length > 0) ? (products?.data?.map((product: Product) => (
                            <div key={product.id} className="w-full border border-black/25 rounded-md p-3 hover:shadow-lg transition-shadow duration-300 ease-out cursor-pointer">
                                <h6 className="font-semibold text-text text-left">{product.name}</h6>
                            </div>
                        )) 

                    ) : (
                            <p className="text-text text-center w-full">No products found.</p>
                        )}
                    </div>  
                )}
                
                <div className="flex justify-end my-2">
                    <Pagination
                        key={"paginationBottom"}
                        page={currentPage}
                        lastPage={products?.last_page || 1}
                        setPage={setPage}
                    />
                </div>
            </div>
            <div className="shadow-md bg-background border border-black/25 rounded-md p-4 mb-4">
                <h4 className="text-lg font-semibold mb-2 text-text">
                    Cart
                    <TiShoppingCart className="inline-block ml-2" size={35} />
                </h4>
            </div>
        </div>
    )

  }