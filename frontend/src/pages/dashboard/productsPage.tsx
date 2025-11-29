import { use, useEffect, useMemo, useRef, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { FaChevronUp } from "react-icons/fa";
import fetchProducts from './../../utils/fetchProducts';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from '../loadingScreen';
import ProductsTable from '../../components/productsPage/productsTable';

export default function ProductsPage() {
    // @ts-ignore
    const { data, isFetching, isError } = useQuery({
        queryKey: ['productsPage'],
        queryFn: fetchProducts
    });

    const searchRef = useRef<HTMLInputElement>(null);

    const products = useMemo(() => data || [], [data]);

    const [category, setCategory] = useState("All");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || "";

    const [search, setSearch] = useState(query);
    const [activeQuery, setActiveQuery] = useState(query);

    const updateURLParams = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);

        if (value.length > 0) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${params.toString()}`
        );
    }

    const handleSearch = () => {
        if (searchRef.current) {
            const newQuery = searchRef.current.value;
            setActiveQuery(newQuery);
            updateURLParams("search", newQuery);

        }
    }

    const handleSearchClear = () => {
        if (searchRef.current) setSearch("");
        setActiveQuery("");
        updateURLParams("search", "");
    }

    const updateSearchBar = () => {
        setSearch(query);
        setActiveQuery(query);
    }

    useEffect(updateSearchBar, [query]);

    if (isFetching) return <LoadingScreen />;
    if (isError) return <div className="w-full h-full text-red-500 flex items-center justify-center">
        <p>Ran into an error loading the products.</p>
    </div>

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4">
            <h3 className="font-bold text-text">Products</h3>
            
            <div className="w-full flex justify-between items-center">
                <label className="relative w-1/3">
                    <input
                    ref={searchRef}
                    value={search}
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
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
            
            <ProductsTable data={products} searchQuery={activeQuery} />
            
        </div>
    )
}