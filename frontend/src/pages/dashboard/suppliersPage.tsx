import { useQueryClient } from "@tanstack/react-query";
import useSuppliers from '../../queries/suppliers/useSuppliers';
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function SuppliersPage() {
    const queryClient = useQueryClient();

    const [params, setParams] = useSearchParams();

    const [activeSearch, setActiveSearch] = useState(params.get('search') || '');


    const { data: suppliers, isLoading, isError } = useSuppliers(activeSearch);

    return (
        <div className="p-4 w-full h-full">
            <h3 className="font-bold text-text mb-4">Suppliers</h3>
            <div className="mb4">
                <input
                    type="text"
                    placeholder="Search suppliers..."
                    className="input-primary w-full max-w-sm"
                    value={activeSearch}
                    onChange={(e) => setActiveSearch(e.target.value)}
                />
            </div>
        </div>
    )
}