import KpiCard from "../../components/kpiCard";

export default function DashboardHome() {
    return (
        <div id="container" className="p-4 w-full h-full flex flex-col gap-4">
            <h3 className="font-bold text-text">Dashboard</h3>
            <div className="grid grid-cols-4 gap-4 w-full">
                <KpiCard title="Total Products" value={56} subtitle={"Total amount in inventory"} />
                <KpiCard title="Total Inventory Value" value={"$87,001.00"} subtitle={"Current value of all products"} />
                <KpiCard title="Total Sales" value={127} subtitle={"This month"} />
                <KpiCard title="Total Customers" value={10} subtitle="Active Customers"/>
            </div>
        </div>
    )
}