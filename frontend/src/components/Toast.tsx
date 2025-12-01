import { FaInfo, FaCheck, FaExclamation } from "react-icons/fa";
import { MdNearbyError } from "react-icons/md";


type ToastProps = {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}


export default function Toast({ type, message }: ToastProps) {

    function capitalize(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }



    return (
        <div className={`border border-black/25 border-l-4 bg-[#FEFEEE] relative min-w-[250px] max-w-md px-2 py-4 animate-toast-fade-left overflow-hidden flex justify-between items-center gap-4 rounded shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] text-text
            ${type === 'success' ? 'border-l-green-500' : ''}
            ${type === 'error' ? 'border-l-red-500' : ''}
            ${type === 'info' ? 'border-l-blue-500' : ''}
            ${type === 'warning' ? 'border-l-yellow-500' : ''}`}>

            <div className={`flex items-center justify-center rounded-full w-8 h-8
                ${type === 'success' ? 'text-green-100 bg-green-600' : ''}
                ${type === 'error' ? 'text-red-100 bg-red-600' : ''}
                ${type === 'info' ? 'text-blue-100 bg-blue-600' : ''}
                ${type === 'warning' ? 'text-yellow-100 bg-yellow-600' : ''}`}>

                {type === 'success' && <FaCheck size={16} />}
                {type === 'error' && <MdNearbyError size={16} />}
                {type === 'info' && <FaInfo size={16} />}
                {type === 'warning' && <FaExclamation size={16} />}
            </div>

            <div className="flex-1 flex flex-col">
                <span className="font-semibold text-[14px]">{capitalize(type)}</span>
                <span className="text-[12px] text-text/80">{message}</span>
            </div>
        </div>
    )
}