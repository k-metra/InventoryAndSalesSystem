export default function KpiCard({ title, value, subtitle="" }: { title : string; value: string | number; subtitle?: string }) {
    return (
        <div className="md:col-span-1 p-4 bg-secondary border border-black/25 rounded-md flex flex-col justify-start">
            <small className="text-text/80 font-semibold text-sm mb-5">{title}</small>
            <h3 className="font-bold text-text">{value}</h3>
            <span className="text-muted text-[12px]">{subtitle}</span>
        </div>
    )
}