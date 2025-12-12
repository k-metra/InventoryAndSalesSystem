import { AiOutlineProduct } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import SearchBar from "../../components/searchBar";
import useProducts from "../../queries/products/useProducts";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function POSPage() {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeSearch, setActiveSearch] = useState<string | null>(searchParams.get("search"));
    const [search, setSearch] = useState(activeSearch || "");
    const [sort, setSort] = useState<string | null>(searchParams.get("sort"));
    const [supplier, setSupplier] = useState<string | null>(searchParams.get("supplier"));
    const [category, setCategory] = useState<string | null>(searchParams.get("category"));

    const {
        data: products,
        isPending: isProductsLoading,
        isError: isProductError,
        refetch: refetchProducts
    } = useProducts(activeSearch || "");

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