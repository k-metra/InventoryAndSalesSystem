import { formatCurrency } from '@utils/formatNumbers';
import { type Item, type Discount, type Customer } from '@typings/objects';
import { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import useCustomers from '@/queries/customers/useCustomers';
import { Link } from 'react-router-dom';

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

    const { data: customers }: { data: Customer[] | undefined } = useCustomers(false);


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
                <h5 className="text-text font-medium">Order Checkout</h5>

                <div className="mt-2 p-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="payment_method" className="text-muted text-sm">Payment Method</label>

                        <Select name="payment_method" onChange={
                            (newValue) =>
                                setOrder(currentOrder => (
                                    {
                                        ...currentOrder,
                                        payment_method: newValue?.value as "cash" | "card" | "mobile" | ""
                                    }))}

                            className=""
                            placeholder="Select Payment Method"
                            options={[
                                { value: 'cash', label: 'Cash' },
                                { value: 'card', label: 'Card' },
                                { value: 'mobile', label: 'Mobile Payment' }
                            ]}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="customer_id" className="text-muted text-sm">Customer</label>
                         
                        <Select
                            isSearchable
                            placeholder="Select Customer"
                            name="customer_id"
                            options={customers?.map((customer) => ({ value: customer.id, label: customer.name }))}
                            onChange={(newValue) => setOrder(prev => ({ ... prev, customer_id: newValue?.value || null }))}
                        />
                        <span className="text-muted text-right text-[12px]">
                            Don't see them?
                            <Link to="/dashboard/customers?create=true" className="text-primary underline ml-1" onClick={close}>
                                Add new customer
                            </Link>
                            .
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-4 overflow-y-auto max-h-[70%] min-h-[50%] w-full p-3 custom-scrollbar">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar border border-black/25 rounded-sm">
                        <table className="w-full h-full border-collapse border-gray-300">
                            <thead>
                                <tr className="*:uppercase sticky top-0 bg-gray-50 border-b border-gray-300 drop-shadow-sm">
                                    <th className="font-medium border-b border-gray-300 px-4 py-4 text-sm text-muted  text-left">Item</th>
                                    <th className="font-medium border-b border-gray-300 px-4 py-4 text-sm text-muted text-left">Quantity</th>
                                    <th className="font-medium border-b border-gray-300 px-4 py-4 text-sm text-muted text-left">Line Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((item, index) => (
                                    <tr>
                                        <td key={index + crypto.randomUUID()} className="px-4 py-2 border-b border-gray-300">
                                            <span className="text-text font-semibold">{item.name}</span>
                                            
                                        </td>
                                        <td key={index + crypto.randomUUID()} className="px-4 py-2 border-b border-gray-300">
                                            <span className="text-text font-semibold">{item.quantity}</span>
                                            
                                        </td>
                                        <td key={index + crypto.randomUUID()} className="px-4 py-4 border-b border-gray-300">
                                            <span className="text-text font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                                            
                                        </td>
                                    </tr>
                                
                                ))}
                            </tbody>
                        </table>    
                    </div>

                    <div className="mt-6 flex flex-col gap-1">
                        <div className="flex justify-between">
                            <span className="text-text text-sm">Subtotal</span>
                            <span className="text-text text-sm">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text text-sm">Total VATable Sales</span>
                            <span className="text-text text-sm">{formatCurrency(vatables)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text text-sm">VAT-Exempt Sales</span>
                            <span className="text-text text-sm">{formatCurrency(exempted)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text text-sm">Zero-Rated Sales</span>
                            <span className="text-text text-sm">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text text-sm">VAT Amount ({vat_rate})</span>
                            <span className="text-text text-sm">{formatCurrency(vat_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text text-sm">Discounts</span>
                            <span className="text-text text-sm">- {
                            discounts.length > 0 ? formatCurrency(discountAmount) : formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg mt-2">
                            <span className="text-text">Total</span>
                            <span className="text-text">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}