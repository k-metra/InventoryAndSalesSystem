import { useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser } from "react-icons/fa";
import { FaUserAltSlash } from "react-icons/fa";

export default function AccountModal({ showModal, onClose }: { showModal: boolean, onClose: () => void}) {
    const { user } = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);

    const displayName = useMemo(() => {
        if (!user) return 'N/A';
        return user.username;
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            console.log("Clicked");
            if (!modalRef.current) return;

            if (!modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [modalRef]);

    return (
        <div ref={modalRef} className={`absolute right-2 origin-top top-12 ${!showModal ? 'opacity-0 scale-y-0 scale-x-0 pointer-events-none' : 'opacity-100 scale-x-100 scale-y-100 pointer-events-auto'} p-3 flex flex-col gap-0 bg-secondary border border-black/25 rounded-md shadow-lg min-w-50 transition-transform-opacity duration-300 ease-out`}>
            <div className={`flex flex-row w-full items-center justify-between ${showModal ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-out`}>
                {user !== null ? <FaUser size={40} className="text-text ml-3" /> : <FaUserAltSlash size={40} className="text-text/60 ml-3" /> }
                <div className="self-end">
                    <span className="text-muted text-[12px] text-right m-0">Logged in as</span>
                    <h5 className="font-bold text-text text-right">{displayName}</h5>
                </div>
            </div>
            <hr className="border-t border-black/25 mt-2 mb-4" />
            <div className="w-full flex flex-col gap-2">
                <button className="text-center w-full px-3 py-2 rounded-md text-text bg-black/10 hover:bg-black/20 font-semibold transition-colors duration-200 text-sm">Account Settings</button>
                <button className="text-center w-full px-3 py-2 rounded-md text-red-500 bg-black/10 hover:bg-black/20 font-semibold transition-colors duration-200 text-sm">Logout</button>
            </div>
        </div>
    )
}