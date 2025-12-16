import { RiArrowDropDownFill } from "react-icons/ri";

type DropdownProps = {
    ref?: React.Ref<HTMLDivElement>;
    onClick: () => void;
    onOptionClick: (option?: string | null) => void;
    options: string[];
    label: string;
    value?: string;
    isOpen: boolean;
}

export default function Dropdown({ ref, onOptionClick, onClick, options, label, value, isOpen }: DropdownProps) {
   return (
         <div ref={ref} className="relative max-w-30 inline-block">
        <button
            onClick={() => onClick()}
            className="cursor-pointer hover:bg-black/10 transition-colors duration-300 pl-3 p-1 rounded-full text-[12px] bg-secondary border border-black/30 text-text flex truncate items-center justify-center"
        >
            {label}{value && `: ${value}`}
            <RiArrowDropDownFill size={24} className="inline-block" />
        </button>

        <div className={`custom-scrollbar p-1 origin-top flex flex-col gap-2 overflow-y-auto max-h-60 absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max bg-background border border-black/25 transition-transform-opacity-colors duration-300 ease-in-out rounded-md shadow-lg z-10 ${isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-0 pointer-events-none -translate-y-2'}`}>
            <button
                onClick={() => onOptionClick()}
                className={`block w-full cursor-pointer p-1 hover:bg-black/20 transition-colors duration-300 text-center text-[0.85rem] ${value == null && 'font-semibold border-l-4 border-primary'}`}
            >
                    None
            </button>
            {options.map((option, idx) => (
                <button
                    key={idx}
                    onClick={() => onOptionClick(option)}
                    className={`block w-full cursor-pointer p-1 hover:bg-black/20 transition-colors duration-300 text-center text-[0.85rem] ${option === value && 'font-semibold border-l-4 border-primary'}`}
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
   )
}