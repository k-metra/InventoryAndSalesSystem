import type { ReactNode } from "react";

export default function ChartCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="col-span-3 md:col-span-2 p-4 bg-secondary border border-black/25 rounded-md h-72 md:h-96 flex flex-col gap-4 justify-center items-center">
            <small className="text-text/80 font-semibold self-start">{title}</small>
            { children }
        </div>
    )
}