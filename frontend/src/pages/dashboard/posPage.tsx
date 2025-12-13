import { AiOutlineProduct } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import SearchBar from "../../components/searchBar";
import useProducts from "../../queries/products/useProducts";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";

export default function POSPage() {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeSearch, setActiveSearch] = useState<string | null>(searchParams.get("search"));
    const [search, setSearch] = useState(activeSearch || "");
    const [sort, setSort] = useState<string | null>(searchParams.get("sort"));
    const [supplier, setSupplier] = useState<string | null>(searchParams.get("supplier"));
    const [category, setCategory] = useState<string | null>(searchParams.get("category"));

    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement | null>(null);

    const setNewParams = useCallback((param: string, value: string | null) => {
        const currentParams = {
            searchParam: setSearch,
            sortParam: setSort,
            supplierParam: setSupplier,
            categoryParam: setCategory
        };

        value = value || "";

        if (`${param}Param` in currentParams) {
            currentParams[(`${param}Param` as keyof typeof currentParams)]((prev: string | null) => {
                if (prev === value) return prev;

                searchParams.set(param, value);
                return value;
            })
        }

        setSearchParams(searchParams);
    }, [setSort, setSearch, setSupplier, setCategory]);

    const {
        data: products,
        isPending: isProductsLoading,
        isError: isProductError,
        refetch: refetchProducts
    } = useProducts(activeSearch || "");

    const sortingOptions = useMemo(() => {
        return [
            'A-Z',
            'Z-A',
            'Greater Price',
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
        
    }, [sortRef]);

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
                    handleSearch={() => {}}
                    handleClear={() => {}}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    value={search}
                />
                <div className="flex gap-1 my-2">
                    <div ref={sortRef} className="relative inline-block">
                        <button
                            onClick={() => setSortOpen(prev => !prev)}
                            className="cursor-pointer hover:bg-black/10 transition-colors duration-300 px-2 p-1 rounded-full text-[12px] bg-secondary border border-black/30 text-text flex items-center justify-center"
                        >
                            Sort by
                            <RiArrowDropDownFill size={20} className="inline-block" />
                        </button>
                        <div className={`p-1 flex flex-col gap-2 overflow-y-auto absolute top-full left-0 mt-1 w-max bg-background border border-black/25 rounded-md shadow-lg z-10 ${sortOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                            {sortingOptions.map((option, idx) => (
                                <button 
                                    key={idx}
                                    className={`block p-1 hover:bg-black/20 transition-colors duration-300 text-center text-sm ${option === sort && 'font-semibold border-l-4 border-primary'}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
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