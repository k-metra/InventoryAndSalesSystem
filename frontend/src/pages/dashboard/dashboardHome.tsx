import { useNavigate } from "react-router-dom";
import ChartCard from "../../components/chartCard";
import InventoryTrends from "../../components/charts/inventoryTrends";
import SalesOverTime from "../../components/charts/salesOverTime";
import KpiCard from "../../components/kpiCard";
import useDashboard from "../../queries/dashboard/useDashboard";
import LoadingScreen from "../loadingScreen";

import { useMemo } from 'react';

import { AiOutlineReload } from "react-icons/ai";

export default function DashboardHome() {
    // const queryClient = useQueryClient();
    const navigate = useNavigate();

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
                <div className="flex justify-center items-center gap-4">
                    <h3 className="font-bold text-text">Dashboard</h3>
                    {lowStockCount > 0 && (
                        <span 
                            onClick={
                                () => {
                                    navigate('/dashboard/products?sortBy=Lower+Stock');
                                }
                            }
                            className="cursor-pointer  text-red-500 border border-red-500 bg-red-500/5 font-semibold text-[12px] px-2 py-1 rounded-full shadow-[0px_0px_10px_2px_rgba(255,0,0,0.1)] hover:shadow-[0px_0px_10px_4px_rgba(255,0,0,0.2)] hover:bg-red-500/10 hover:font-bold transition-shadow-colors duration-500 ease-out">
                            {lowStockCount} items are low on stock!
                        </span>
                    )}
                </div>

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
            <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                <KpiCard title="Total Products" value={totalProducts} subtitle={"Total amount in inventory"} />
                <KpiCard title="Sales Today" value={totalSalesToday} subtitle={"Total sales for today"} />
                <KpiCard title="Sales This Month" value={totalSalesThisMonth} subtitle={"Total sales for this month"} />
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