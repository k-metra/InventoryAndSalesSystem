import { formatCurrency } from "@utils/formatNumbers";
import { type Item } from "@typings/objects"; 

type CartItemProps = {
    item: Item;
    onUpdateQuantity: (itemId: number, newQuantity: number) => void;
    onRemoveItem: (itemId: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps ) {
    return (
        <div className="flex justify-between items-center border-b pb-2">
            <div className="flex flex-col gap-1">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-muted">{formatCurrency(item.price)}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-2 border rounded"
                >   
                    +
                </button>

                <span>{item.quantity}</span>

                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-2 border rounded"
                >
                    -
                </button>
            </div>
        </div>
    )
}