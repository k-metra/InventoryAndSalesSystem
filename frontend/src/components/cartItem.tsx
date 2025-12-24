import { formatCurrency } from "@utils/formatNumbers";
import { type Item } from "@typings/objects"; 
import { IoIosAdd, IoIosClose } from "react-icons/io";
import { FiMinus } from "react-icons/fi";

type CartItemProps = {
    item: Item;
    onUpdateQuantity: (itemId: number, newQuantity: number) => void;
    onRemoveItem: (itemId: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps ) {
    return (
        <div className="relative group flex justify-between items-center border-b border-b-black/25 pb-4 py-2">
            <div className="flex flex-col gap-1">
                <span className="font-medium text-text">{item.name}</span>
                <span className="text-sm text-muted">{formatCurrency(item.price)}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onUpdateQuantity(item.id,item.quantity + 1)}
                    className="p-1 rounded-full flex items-center justify-center bg-green-200 text-green-500 hover:bg-green-300 transition-colors duration-200 ease-in-out cursor-pointer"
                >   
                    <IoIosAdd size={20}/>
                </button>

                <input
                    className="no-spinner border border-black/20 text-center rounded-sm shadow-[0_0_4px_rgba(0,0,0,0.1)_inset] w-12 py-0.5 outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in"
                    type="number" value={item.quantity} min="0" max={item.maxQuantity ?? 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateQuantity(item.id, Number(e.target.value)) }
                />

                <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="p-1 rounded-full flex items-center justify-center bg-red-200 text-red-500 hover:bg-red-300 transition-colors duration-200 ease-in-out cursor-pointer"
                >
                    <FiMinus size={20} />
                </button>
            </div>

            <button
                onClick={() => { onRemoveItem(item.id) }}
                title="Remove Item from Cart"
                className="absolute right-0 top-4 -translate-y-full translate-x-3 cursor-pointer text-red-500/60 rounded-full hover:bg-red-300 transition-colors duration-30 ease-in-out"
            >
                <IoIosClose size={25} />
            </button>
        </div>
    )
}