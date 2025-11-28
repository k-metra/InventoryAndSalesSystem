import ChartCard from "../../components/chartCard";
import InventoryTrends from "../../components/charts/inventoryTrends";
import SalesOverTime from "../../components/charts/salesOverTime";
import KpiCard from "../../components/kpiCard";

import { use } from 'react';
import fetchDashboardResources from "../../utils/fetchDashboardResources";

export default function DashboardHome() {
    const { 
        productCount, 
        totalInventoryValue, 
        totalSales, 
        totalCustomers } = use(fetchDashboardResources);

    return (
        <div id="container" className="p-4 mb-8 pb-8 w-full h-full flex flex-col gap-4">
            <h3 className="font-bold text-text">Dashboard</h3>
            <div className="grid grid-cols-4 gap-4 w-full">
                <KpiCard title="Total Products" value={productCount} subtitle={"Total amount in inventory"} />
                <KpiCard title="Total Inventory Value" value={totalInventoryValue} subtitle={"Current value of all products"} />
                <KpiCard title="Total Sales" value={totalSales} subtitle={"This month"} />
                <KpiCard title="Total Customers" value={totalCustomers} subtitle="Active Customers"/>
            </div>
            <div className="w-full grid grid-cols-4 gap-4">
                <ChartCard title="Sales Over Time">
                    <SalesOverTime data={[
                    { date: 'Jan', sales: 30 },
                    { date: 'Feb', sales: 45 },
                    { date: 'Mar', sales: 60 },
                    { date: 'Apr', sales: 120 },
                    { date: 'May', sales: 80 },
                    { date: 'Jun', sales: 150 },
                    { date: 'Jul', sales: 200 },
                ]} />
                </ChartCard>
                <ChartCard title="Inventory Trends">
                    <InventoryTrends data={[
                    { date: 'Jan', inventory: 500 },
                    { date: 'Feb', inventory: 480 },
                    { date: 'Mar', inventory: 450 },
                    { date: 'Apr', inventory: 400 },
                    { date: 'May', inventory: 420 },
                    { date: 'Jun', inventory: 390 },
                    { date: 'Jul', inventory: 350 },
                    ]}
                    />
                </ChartCard>
                    
            </div>
        </div>
    )
}