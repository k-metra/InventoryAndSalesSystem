import { useQueryClient } from "@tanstack/react-query";
import useSuppliers from '../../queries/suppliers/useSuppliers';
import { useSearchParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import type { Supplier } from "../../types/objects";
import { FaPhone } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { FaHouse } from "react-icons/fa6";

export default function SuppliersPage() {
    const queryClient = useQueryClient();

    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [activeSearch, setActiveSearch] = useState(searchParams.get('search') || '');

    const { data, isLoading, isError } = useSuppliers(activeSearch);

    const handleSearch = useCallback(() => {
        setActiveSearch(search);
        if (search.trim() === "") {
            searchParams.delete("search");
            setSearchParams(searchParams);
        } else {
            setSearchParams({ search: search });
        }
    }, [])

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
                                onClick={() => {
                                   
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
                        <div className="w-full m-auto bg-secondary border border-black/25 p-4 rounded-md flex flex-col gap-0" key={supplier.id}>
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
                     ))}
                    </>
                )}
            </div>
        </div>
    )
}