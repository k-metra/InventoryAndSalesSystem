import getNestedValue from '../utils/getNestedValue';
import { IoEllipsisHorizontalSharp } from "react-icons/io5";


type TableProps = {
    data: any[];
    columns: { label: string; key: string }[];
    noActions?: boolean;
}



export default function DataTable({ data, columns, noActions = false }:  TableProps ) {


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

                        {!noActions && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button className="text-text text-center cursor-pointer bg-transparent rounded-full p-2 hover:bg-black/10 transition-colors duration-200">
                                <IoEllipsisHorizontalSharp size={18} />
                            </button>
                        </td>}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}