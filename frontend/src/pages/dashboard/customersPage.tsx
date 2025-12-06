import { FaSpinner } from "react-icons/fa";
import useCustomers from "../../queries/customers/useCustomers";

export default function CustomersPage() {

    const { 
        data: Customers, 
        isLoading: isCustomersLoading, 
        isError: isCustomersError }
         = useCustomers();
    
    if (isCustomersError) return <div className="w-full h-full p-6 text-lg text-red-500">Ran into an error loading customers.</div>;

    if (isCustomersLoading) return (
        <div className="w-full h-full p-6 flex items-center justify-center text-md text-text">
            Loading Customers...
            <FaSpinner className="inline-block ml-2 animate-spin" />
        </div>
    )

    return (
        <div className="w-full h-full p-4">
            <h4 className="font-bold mb-4 text-text">All Customers</h4>
        </div>
    )
}