import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";

export default function Dashboard() {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <>
            <header className="bg-secondary border-b border-black/25 w-screen h-16 flex justify-between">
                <div className="flex flex-row items-center justify-center pl-10">
                    <button onClick={() => setSidebarCollapsed(curr => !curr)} className="text-text">
                        <GiHamburgerMenu size={25} />
                    </button>

                    <div className="pl-15  px-2 h-full flex items-center">
                        <h4 className="font-bold text-text">Inventory & Sales</h4>
                    </div>

                </div>

                <button className="h-full pr-10 flex items-center cursor-pointer text-text">
                    <FaGear size={20} className="hover:rotate-90 transition-transform duration-1000 ease-out"/>
                </button>
            </header>
        </>
    )
}