import ChartCard from "../../components/chartCard";
import InventoryTrends from "../../components/charts/inventoryTrends";
import SalesOverTime from "../../components/charts/salesOverTime";
import KpiCard from "../../components/kpiCard";
import useDashboard from "../../queries/dashboard/useDashboard";
import fetchDashboardResources from "../../utils/fetchDashboardResources";
import LoadingScreen from "../loadingScreen";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from 'react';

import { AiOutlineReload } from "react-icons/ai";

export default function DashboardHome() {
    // const queryClient = useQueryClient();
    const [shouldRefetch, setShouldRefetch] = useState(true);

    const { data, isPending, isError, refetch } = useDashboard();

    const totalProducts = useMemo(() => data?.total_products?? 0, [data]);
    const totalSalesToday = useMemo(() => data?.total_sales_today ?? 0, [data]);
    const totalCustomers = useMemo(() => data?.total_customers ?? 0, [data]);
    const totalSalesThisMonth = useMemo(() => data?.total_sales_this_month ?? 0, [data]);
    const lowStockCount = useMemo(() => data?.low_stock_count ?? 0, [data]);
    const recentSales = useMemo(() => data?.recent_sales ?? [], [data]);
    const salesChartData = useMemo(() => data?.total_chart_data ?? [], [data]);


    if (isPending) return <LoadingScreen />;
    if (isError) return <div className="p-4 w-full h-full text-red-500 flex items-center justify-center">
        <p>Ran into an error loading the dashboard data.</p>
    </div>

    return (
        <div id="container" className="custom-scrollbar p-4 overflow-y-auto overflow-x-hidden w-full h-full flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
                <h3 className="font-bold text-text">Dashboard</h3>

                <label className="relative group">
                    <button onClick={() => refetch()} className="to-blue-600 from-blue-500 bg-linear-to-r hover:to-blue-700 hover:from-blue-600 text-white px-4 pr-9 py-2 rounded-md transition-colors duration-300 cursor-pointer">
                        Refresh
                    </button>
                    <AiOutlineReload 
                        size={15}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white group-hover:animate-spin transition-transform duration-500 ease-out"
                    />
                </label>
            </div>
            <div className="grid grid-cols-4 gap-4 w-full">
                <KpiCard title="Total Products" value={totalProducts} subtitle={"Total amount in inventory"} />
                <KpiCard title="Total Sales" value={totalSalesToday} subtitle={"This day"} />
                <KpiCard title="Total Sales" value={totalSalesThisMonth} subtitle={"This month"} />
                <KpiCard title="Total Customers" value={totalCustomers} subtitle="Active Customers"/>
            </div>
            <div className="w-full grid grid-cols-4 gap-4">
                <ChartCard title="Sales in the Last 30 Days">
                    <div className="w-full h-80">
                        <SalesOverTime data={salesChartData} />
                    </div>
                    
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