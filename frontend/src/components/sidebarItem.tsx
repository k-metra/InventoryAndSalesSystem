import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

type SidebarItemProps = {
    icon: ReactNode;
    label: string;
    href: string;
    collapsed?: boolean;
}


export default function SidebarItem({ icon, label, href, collapsed=false }: SidebarItemProps) {
    const navigate = useNavigate();
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0});

    const handleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({ top: rect.top + (rect.height / 2), left: rect.right });
    }

    return (
        <button onMouseEnter={handleHover} onClick={() => navigate(href)} className="group w-full flex items-center gap-3 p-2 cursor-pointer hover:bg-black/10 bg-black/5 rounded-md">
            {icon}
            {!collapsed && <span className="text-text text-sm">{label}</span>}
            {collapsed && (
                <span style={{ top: tooltipPos.top, left: tooltipPos.left, transform: 'translateY(-50%)' }} className="fixed z-9999 ml-2 px-2 py-1 bg-text text-background text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 whitespace-nowrap">
                    {label}
                </span>
            )}
        </button>
    )
}