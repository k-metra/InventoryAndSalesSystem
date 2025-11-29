import { type Product } from '../../utils/fetchProducts';
import filterData from '../../utils/filterData';
import getNestedValue from '../../utils/getNestedValue';
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { useState, useEffect } from 'react';

const tableHeaders = [
    "ID",
    "Name",
    "SKU",
    "Stock",
    "Category",
    "Supplier",
    "Actions"
];

const productFields = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "SKU", key: "sku" },
    { label: "Stock", key: "stock" },
    { label: "Category", key: "category.name" },
    { label: "Supplier", key: "supplier.name" },
];

type ProductsTableProps = {
    data: Product[];
    searchQuery?: string;
}



export default function ProductsTable({ data, searchQuery }:  ProductsTableProps ) {
    const [filteredData ,setFilteredData] = useState<Product[]>(data);

    useEffect(() => {
        const result = filterData(searchQuery || "", data, productFields.map(field => field.key));
        setFilteredData(result);

        console.log(result);
    }, [searchQuery, data]);

    return (
        <table className="min-w-full divide-y divide-black/20">
            <thead className="bg-gray-50">
                <tr>
                    {tableHeaders.map((field, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {field}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/20">
                {filteredData.map((product, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100 transition-colors duration-200">
                        {productFields.map(({ key }, colIndex) => {
                            const value = getNestedValue(product, key);
                            return (
                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">  
                                    {value}
                                </td>
                            );
                        })}

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button className="text-text text-center cursor-pointer bg-transparent rounded-full p-2 hover:bg-black/10 transition-colors duration-200">
                                <IoEllipsisHorizontalSharp size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}