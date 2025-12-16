import { RiArrowDropDownFill } from "react-icons/ri";

type Option = {
    label: string;
    value: string;
}

type DropdownProps = {
    ref?: React.Ref<HTMLDivElement>;
    onClick: () => void;
    onOptionClick: (option?: string | null) => void;
    options: Option[];
    label: string;
    value?: string;
    isOpen: boolean;
}

export default function Dropdown({ ref, onOptionClick, onClick, options, label, value, isOpen }: DropdownProps) {
   return (
         <div ref={ref} className="relative inline-flex max-w-full min-w-0">
        <button
            onClick={() => onClick()}
            className="cursor-pointer hover:bg-black/10 transition-colors duration-300 pl-3 p-1 rounded-full text-[12px] bg-secondary border border-black/30 text-text flex items-center justify-between gap-1"
        >
            <span className="truncate max-w-40">
                {label}{value && `: ${value}`}
            </span>
            <RiArrowDropDownFill size={24} className="inline-block shrink-0" />
        </button>

        <div className={`custom-scrollbar p-1 origin-top flex flex-col gap-2 overflow-y-auto max-h-60 absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max bg-background border border-black/25 transition-transform-opacity-colors duration-300 ease-in-out rounded-md shadow-lg z-10 ${isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-0 pointer-events-none -translate-y-2'}`}>
            <button
                onClick={() => onOptionClick()}
                className={`block w-full cursor-pointer p-1 hover:bg-black/20 transition-colors duration-300 text-center text-[0.85rem] ${value == null && 'font-semibold border-l-4 border-primary'}`}
            >
                    None
            </button>
            {options.map((option: Option, idx) => (
                <button
                    key={idx}
                    onClick={() => onOptionClick(option.value)}
                    className={`block w-full cursor-pointer p-1 hover:bg-black/20 transition-colors duration-300 text-center text-[0.85rem] ${option.value === value && 'font-semibold border-l-4 border-primary'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
   )
}