import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";

export default function Dashboard() {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <>
            <header className="bg-secondary border-b border-black/25 w-screen h-16 flex justify-between">
                <div className="flex flex-row items-center justify-center pl-6">
                    <button onClick={() => setSidebarCollapsed(curr => !curr)} className="text-text cursor-pointer bg-transparent rounded-full p-2 transition-colors duration-200 hover:bg-black/10">
                        <GiHamburgerMenu size={25} />
                    </button>

                    <div className="pl-8  px-2 h-full flex items-center">
                        <h4 className="font-bold text-text">Inventory & Sales</h4>
                    </div>

                </div>

                <button className="h-full pr-10 flex items-center cursor-pointer text-text">
                    <FaGear size={20} className="hover:rotate-90 transition-transform duration-1000 ease-out"/>
                </button>
            </header>
            <aside id="sidebar" className="bg-secondary border-r border-black/25 h-full fixed top-16 left-0 transition-all duration-500 ease-out" style={{ width: sidebarCollapsed ? '4rem' : '14rem'}}>
                hello
            </aside>
        </>
    )
}