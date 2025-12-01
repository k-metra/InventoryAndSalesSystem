import getNestedValue from '../utils/getNestedValue';
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { useState, useEffect, useCallback } from 'react';


type TableProps = {
    onEdit?: (id?: number | string) => void;
    onDelete?: (id?: number | string) => void;
    data: any[];
    columns: { label: string; key: string }[];
    noActions?: boolean;
}



export default function DataTable({ onEdit, onDelete, data, columns, noActions = false }:  TableProps ) {

    const [activeRow, setActiveRow] = useState<number | null>(null);

    const handleClickOutside = useCallback(() => {
        setActiveRow(null);
    }, []);

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        }
    }, [handleClickOutside]);

    if (!noActions && (!onEdit || !onDelete)) {
        throw new Error("onEdit and onDelete functions must be provided if a Data Table has actions enabled. To disable actions, set the noActions prop to true.");
    }


    return (
        <table className="min-w-full divide-y divide-black/20">
            <thead className="bg-gray-50">
                <tr>
                    {columns.map(({ label }, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {label}
                        </th>
                    ))}

                    {!noActions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/20">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100 transition-colors duration-200">
                        {columns.map(({ key }, colIndex) => {
                            const value = getNestedValue(row, key);

                            return (
                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">  
                                    {value}
                                </td>
                            );


                        })}

                        {!noActions && <td className="relative inline-block px-6 py-4 whitespace-nowrap text-sm text-gray-900 group">
                            <button onClick={(e) => { e.stopPropagation(); setActiveRow(rowIndex); }} className="text-text text-center cursor-pointer bg-transparent rounded-full p-2 hover:bg-black/10 transition-colors duration-200">
                                <IoEllipsisHorizontalSharp size={18} />
                            </button>

                            <div className={`${activeRow === rowIndex ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'} transition-opacity-transform duration-300 ease-out origin-bottom z-50 flex flex-col absolute top-0 -translate-y-15 left-1/2 -translate-x-1/2 bg-white border border-black/25 rounded-md shadow-lg *:cursor-pointer`}>
                                <button className="w-full text-center px-4 text-[12px] py-1 hover:bg-black/5">View Details</button>
                                <button onClick={() => {onEdit!(row.id)}} className="w-full text-center px-4 text-[12px] py-1 text-primary hover:bg-black/5">Edit</button>
                                <button onClick={() => {onDelete!(row.id)}} className="w-full text-center px-4 text-[12px] py-1 text-red-500 hover:bg-black/5">Delete</button>
                            </div>
                        </td>}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}