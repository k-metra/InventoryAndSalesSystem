import { use, useMemo, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaChevronUp } from "react-icons/fa";
import fetchProducts from './../../utils/fetchProducts';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from '../loadingScreen';

export default function ProductsPage() {
    // @ts-ignore
    const { data, isFetching, isError } = useQuery({
        queryKey: ['productsPage'],
        queryFn: fetchProducts
    });

    const products = useMemo(() => data || [], [data]);

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className="focus:outline-primary transition-all duration-200 ease-in focus:outline-3 focus:shadow-[0px_2px_10px_4px_rgba(59,130,246,0.35)] border border-black/25 rounded-md p-2 pr-10 bg-secondary text-text w-full"
                />
                    <CiSearch className="z-10 absolute right-4 top-1/2 transform -translate-y-1/2 text-black" />
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
        </div>
    )
}