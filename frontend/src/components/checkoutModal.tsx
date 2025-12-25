import { type Item, type Discount } from '@typings/objects';
import { useEffect, useRef } from 'react';

type CheckoutModalProps = {
    subtotal: string;
    vat_amount: string;
    vat_rate: string;
    total: string;
    items: Item[];
    discounts: Discount[];
    close: () => void;
}

export default function CheckoutModal( {
    subtotal,
    vat_amount,
    vat_rate,
    total,
    items,
    discounts,
    close
}: CheckoutModalProps) {
    const modalRef = useRef<HTMLDivElement | null>(null);

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
        <div className="z-9999 fixed w-screen h-screen top-0 left-0 bg-black/50 flex items-center justify-center">
            <div ref={modalRef} className="animate-modal-fade-in bg-white p-6 rounded-lg">
                <h5 className="text-text font-medium">Order Summary</h5>

            </div>
        </div>
    )
}