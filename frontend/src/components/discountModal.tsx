import { useEffect, useRef } from "react"

export default function DiscountModal({ showModal, setShowModal }: { showModal: boolean, setShowModal: ( show: boolean ) => void; }) {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        }

        if (showModal ) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [modalRef, showModal]);

    return (
        <div className={`z-9999 fixed w-screen h-screen left-0 top-0 ${showModal ? "bg-black/50 pointer-events-auto" : "pointer-events-none bg-black/0"} transition-colors duration-300 flex justify-center items-center`}>
            <div ref={modalRef} className={`bg-white p-6 rounded-lg w-96 ${showModal ? "transform-y-0 opacity-100" : "-translate-y-8 opacity-0"} transition-all duration-300 ease-in-out`}>
                <h6 className="text-center text-text font-semibold mb-4">Apply Discount</h6>
                <div className="flex gap-2 w-full">
                    <input type="text" placeholder="Discount Name" className="shadow-[0px_0px_5px_rgba(0,0,0,0.1)_inset] p-2 rounded-md border-black/20 border w-full" />
                    <select className="shadow-[0px_0px_5px_rgba(0,0,0,0.1)_inset] p-2 rounded-md border-black/20 border w-full">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount</option>
                    </select>
                </div>

                <input type="number" placeholder="Discount Value" className="no-spinner shadow-[0px_0px_5px_rgba(0,0,0,0.1)_inset] p-2 rounded-md border-black/20 border w-full mt-4" />

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="p-2 px-4 rounded-md text-white border cursor-pointer bg-gray-500 hover:bg-gray-600 transition-colors duration-300"
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowModal(false);  }}
                    >
                        Cancel
                    </button>
                    <button
                        className="p-2 px-4 rounded-md text-white border cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                        onClick={() => {
                            // Handle applying discount logic here
                            setShowModal(false);
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}