import { createContext, useState, useCallback, useContext } from 'react';
import Toast from '../components/Toast';

type ToastObjectType = {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
}

type ToastContextType = {
    addToast: (
        message: string, 
        type?: ToastType,
        duration?: number
    ) => void;
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider = ({ children } : {children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastObjectType[]>([]);

    const addToast = (message: string, type: ToastType = 'info', duration: number = 4000) => {
        const toastId = crypto.randomUUID();
        console.log('Adding toast:', { id: toastId, type, message, duration });
        setToasts((prevToasts) => [{ id: toastId, type: type, message: message, duration: duration }, ...prevToasts]);

        setTimeout(() => {
            removeToast(toastId);
        }, duration);
    };

    const removeToast = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return <ToastContext.Provider value={{ addToast }}>
        { children }

        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-2000">
            {toasts.map((toast) => (
                <Toast 
                    key={toast.id} 
                    type={toast.type}
                    message={toast.message}
                />
            ))}
        </div>
    </ToastContext.Provider>
}

const useToast = () => {
    const context = useContext(ToastContext);

    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}

export { ToastProvider, useToast };