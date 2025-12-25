import { formatCurrency } from '@utils/formatNumbers';
import { type Item, type Discount } from '@typings/objects';
import { useEffect, useMemo, useRef, useState } from 'react';

type CheckoutModalProps = {
    subtotal: number;
    vat_amount: number;
    vat_rate: string;
    total: number;
    items: Item[];
    discounts: Discount[];
    vatables: number;
    exempted: number;
    close: () => void;
}

type SaleBody = {
    customer_id: number | null;
    payment_method: "cash" | "card" | "mobile" | "",
    subtotal: number;
    discount_amount: number;
    vat_rate: number;
    vat_amount: number;
    total: number;
    items: Item[];
}

export default function CheckoutModal( {
    subtotal,
    vat_amount,
    vat_rate,
    total,
    items,
    discounts,
    vatables,
    exempted,
    close
}: CheckoutModalProps) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const discountAmount = useMemo(() => {
        return discounts.length > 0 ? discounts.reduce((acc, discount) => 
            acc + (discount.type === 'fixed' ? discount.value : (Number(subtotal) * discount.value) / 100), 0) 
            : 0;
    }, [discounts, subtotal]);

    const [order, setOrder] = useState<SaleBody>({
        customer_id: null,
        payment_method: '',
        subtotal: subtotal,
        discount_amount: discountAmount,
        vat_rate: 12.0,
        vat_amount: vat_amount,
        total: total,
        items: items,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                modalRef.current.classList.remove('animate-modal-fade-in');
                modalRef.current.classList.add('animate-modal-fade-out');

                setTimeout(() => close(), 300);
            }
        }

        window.addEventListener('mousedown', handleClickOutside);

        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [close]);
    
    return (
        <div className="z-9999 fixed w-screen h-screen top-0 left-0 bg-black/50 flex items-center justify-center custom-scrollbar">
            <div ref={modalRef} className="animate-modal-fade-in bg-white p-6 rounded-lg min-h-1/2 max-h-11/12 overflow-y-auto w-5/12">
                <h5 className="text-text font-medium">Order Summary</h5>
                <div className="flex flex-col gap-1 mt-4 overflow-y-auto max-h-[70%] min-h-[50%] w-full p-3 custom-scrollbar">
                    {items.map((item, index) => (
                        <div key={index + crypto.randomUUID()} className="flex justify-between border-b border-black/25 py-4">
                            <span className="text-text font-semibold text-lg">{item.name} (x{item.quantity})</span>
                            <span className="text-text font-semibold text-lg">{formatCurrency(item.price)}</span>
                        </div>
                    ))}

                    <div className="mt-6 flex flex-col gap-1">
                        <div className="flex justify-between">
                            <span className="text-text">Subtotal</span>
                            <span className="text-text">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text">Total VATable Sales</span>
                            <span className="text-text">{formatCurrency(vatables)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text">VAT-Exempt Sales</span>
                            <span className="text-text">{formatCurrency(exempted)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text">Zero-Rated Sales</span>
                            <span className="text-text">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text">VAT Amount ({vat_rate})</span>
                            <span className="text-text">{formatCurrency(vat_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text">Discounts</span>
                            <span className="text-text">- {
                            discounts.length > 0 ? formatCurrency(discountAmount) : formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg mt-2">
                            <span className="text-text">Total</span>
                            <span className="text-text">{formatCurrency(total)}</span>
                        </div>

                        <div className="mt-2 p-1 flex flex-wrap">
                            <select onChange={
                                (e: React.ChangeEvent<HTMLSelectElement>) => 
                                    setOrder(currentOrder => (
                                        { ...currentOrder, 
                                            payment_method: e.target.value as "cash" | "card" | "mobile" | "" 
                                        }))} 
                                
                                className="border border-black/25 rounded-md p-2 mr-2">
                                <option value="" disabled selected>Select Payment Method</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="mobile">Mobile Payment</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}