import ChartCard from "../../components/chartCard";
import InventoryTrends from "../../components/charts/inventoryTrends";
import SalesOverTime from "../../components/charts/salesOverTime";
import KpiCard from "../../components/kpiCard";
import fetchDashboardResources from "../../utils/fetchDashboardResources";
import LoadingScreen from "../loadingScreen";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from 'react';

import { AiOutlineReload } from "react-icons/ai";


type DashboardData = {
    productCount: number | string;
    totalInventoryValue: number | string;
    totalSales: number | string;
    totalCustomers: number | string;
}

export default function DashboardHome() {
    // const queryClient = useQueryClient();
    const [shouldRefetch, setShouldRefetch] = useState(true);

    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['dashboardResources'],
        queryFn: async () => {
            const resources = await fetchDashboardResources();
            return resources;
        }
    });

    const {
        productCount,
        totalInventoryValue,
        totalSales,
        totalCustomers
    } = data as DashboardData || {
        productCount: 0,
        totalInventoryValue: 0,
        totalSales: 0,
        totalCustomers: 0
    };

    useEffect(() => {

        if (shouldRefetch && !isFetching) refetch();

        setShouldRefetch(false);

        return () => setShouldRefetch(true);
    }, [])

    if (isFetching) return <LoadingScreen />;
    if (isError) return <div className="w-full h-full text-red-500 flex items-center justify-center">
        <p>Ran into an error loading the dashboard data.</p>
    </div>

    return (
        <div id="container" className="p-4 mb-8 pb-8 w-full h-full flex flex-col gap-4">
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