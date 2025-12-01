import { createContext, useContext, useState } from "react";

type ConfirmationOptions = {
    message: string;
    resolve: (value: boolean) => void;
}

const ConfirmationContext = createContext<{
    confirm: (message: string) => Promise<boolean>;
} | null>(null);

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
    const [options, setOptions] = useState<ConfirmationOptions | null>(null);

    const confirm = (message: string) => {
        return new Promise<boolean>((resolve) => {
            setOptions({ message, resolve });
        });
    };

    const handleConfirm = () => {
        options?.resolve(true);
        setOptions(null);
    }

    const handleCancel = () => {
        options?.resolve(false);
        setOptions(null);
    }

    return (
        <ConfirmationContext.Provider value={{ confirm }}>
            {children}

            {options && (
                <div className="fixed inset-0 bg-black/50 w-screen h-screen flex items-center justify-center z-9999">
                    <div className="bg-white p-6 rounded shadow-md max-w-[24rem]">
                        <span className="text-[16px] font-semibold text-text">Confirmation</span>
                        <hr className="border-t border-black/25 w-full my-2 mb-6"/>
                        <span className="mb-4 text-text text-sm">{options.message}</span>
                        <div className="mt-8 flex justify-end gap-4">
                            <button onClick={handleConfirm} className="cursor-pointer text-sm from-[#EA453A] to-[#DD4438] bg-linear-to-r hover:from-red-500 hover:to-red-600 transition-colors duration-300 ease-out text-white px-4 py-2 rounded">Confirm</button>
                            <button onClick={handleCancel} className="text-sm cursor-pointer hover:bg-gray-400 transition-colors duration-300 ease-out bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmationContext.Provider>
    )
}

export default ConfirmationContext;

export function useConfirmation() {
    const ctx = useContext(ConfirmationContext);

    if (!ctx) throw new Error("useConfirmation must be used within a ConfirmationProvider");

    return ctx;
}