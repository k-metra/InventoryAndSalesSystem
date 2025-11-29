import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";
import { Outlet, useLocation } from 'react-router-dom'
import AccountModal from "../components/accountModal";

import sidebarLayout from "../config/sidebarLayout";
import SidebarItem from "../components/sidebarItem";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const path = useLocation().pathname;

    return (
        <>
            <AccountModal showModal={showAccountModal} onClose={() => setShowAccountModal(false)} />
            <header className="fixed z-20 bg-secondary border-b border-black/25 w-screen h-16 flex justify-between">
                <div className="flex flex-row items-center justify-center pl-6">
                    <button onClick={() => setSidebarCollapsed(curr => !curr)} className="text-text cursor-pointer bg-transparent rounded-full p-2 transition-colors duration-200 hover:bg-black/10">
                        <GiHamburgerMenu size={25} />
                    </button>

                    <div className="pl-8  px-2 h-full flex items-center">
                        <h4 className="font-bold text-text">Inventory & Sales</h4>
                    </div>

                </div>

                <button onClick={() => setShowAccountModal(curr => !curr)} className="h-full pr-10 flex items-center cursor-pointer text-text">
                    <FaGear size={20} className="hover:rotate-90 transition-transform duration-1000 ease-out"/>
                </button>
            </header>
            <aside id="sidebar" className={`z-9999 overflow-visible bg-secondary border-r border-black/25 h-[calc(100vh-4rem)] fixed top-16 left-0 transition-all duration-500 ease-out`} style={{ width: sidebarCollapsed ? '4rem' : '14rem'}}>
                <div className="px-3 py-4 pb-4 flex flex-col gap-4 overflow-y-auto overflow-x-visible h-full scroll-smooth scroll-m-0.5 scroll-ml-1 custom-scrollbar">
                    {sidebarLayout.map((section) => {
                        const shouldShow =
                            section.adminOnly === true ?
                            user?.role === 'Admin'
                            : true;

                        if (!shouldShow) return null;

                        if (!section.children) {
                            return (
                                <SidebarItem key={section.label} icon={<section.icon size={20} className={`${path === section.href ? 'text-primary' : 'text-text'}`} />} href={section.href} label={section.label} collapsed={sidebarCollapsed} active={path === section.href} />
                            )
                        }

                        return (
                            <div key={section.label} className="flex flex-col gap-2">
                                {!sidebarCollapsed && <small className="text-muted">{section.label}</small>}

                                {section.children.map((child) => (
                                    <SidebarItem key={child.label} icon={<child.icon size={20} className={`${path === child.href ? 'text-primary' : 'text-text'}`} />} href={child.href} label={child.label} collapsed={sidebarCollapsed} active={path === child.href} />
                    ))}
                            </div>
                        );

                })}
                </div>
            </aside>
            <main
                className={`custom-scrollbar absolute p-4 top-16 min-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden transition-all duration-500 ease-out mb-8 ${sidebarCollapsed ? 'left-12 w-[calc(100vw-4rem)]' : 'left-52 w-[calc(100vw-14rem)]'}`}
            >
                <Outlet key={location.pathname + Math.random().toString()} />
            </main>
        </>
    )
}