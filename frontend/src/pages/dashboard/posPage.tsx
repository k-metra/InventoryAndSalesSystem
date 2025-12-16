import { AiOutlineProduct } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import SearchBar from "../../components/searchBar";
import useProducts from "../../queries/products/useProducts";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import Dropdown from "../../components/dropdown";
import useSuppliers from "../../queries/suppliers/useSuppliers";
import type { Supplier } from "../../types/objects";

export default function POSPage() {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeSearch, setActiveSearch] = useState<string | null>(searchParams.get("search"));
    const [search, setSearch] = useState(activeSearch || "");
    const [sort, setSort] = useState<string | null>(searchParams.get("sort"));
    const [supplier, setSupplier] = useState<string | null>(searchParams.get("supplier"));
    const [category, setCategory] = useState<string | null>(searchParams.get("category"));

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
        data: products,
        isPending: isProductsLoading,
        isError: isProductError,
        refetch: refetchProducts
    } = useProducts(activeSearch || "");

    const {
        data: supplierList,
        isPending: isSuppliersPending,
        isError: isSuppliersError,
    } = useSuppliers();
    

    const sortingOptions = useMemo(() => {
        return [
            'A-Z',
            'Z-A',
            'Higher Price',
            'Lower Price',
            'Greater Stock',
            'Lower Stock',
            'Greater Cost',
            'Lower Cost',
        ];
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
        } else {
            setActiveSearch(null);
            updateParam("search", null);
        }
    }, [setActiveSearch, updateParam]);

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        }
    }, [handleClickOutside]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (params.get("search") !== activeSearch) {
            if (activeSearch) {
                params.set("search", activeSearch);
                
            } else {
                params.delete("search");
            }

            setSearchParams(params);
        }
    }, [searchParams, activeSearch])

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
                <div className="flex gap-2 my-2">
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
                        options={(supplierList && supplierList.map((supplier: Supplier) => supplier.name)) || []}
                        label="Supplier"
                        value={supplier || undefined}
                        isOpen={supplierOpen}
                    />

                </div>

                
                <hr className="border-t border-black/25 my-4" />

                {isProductsLoading ? (
                    <p className="text-text text-center">Loading products...</p>
                ) : isProductError ? (
                    <p className="text-red-500">Ran into an error loading products.</p>
                ) : (
                    <div className="flex flex-row flex-wrap gap-4">
                        
                    </div>
                )}
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