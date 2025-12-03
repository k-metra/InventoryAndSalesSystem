import api from "./../axios/api";
import { formatCurrency } from "./formatNumbers";

const fetchDashboardResources = async () => {
    console.log("Fetching dashboard resources...");

    const { totalProducts, 
        totalInventoryValue } = await api.get('/products/all')
    .then(res => res.data)
    .catch((err) => {
        console.log("Error fetching product count", err);
        return {
            totalProducts: 0,
            totalInventoryValue: 0
        };
    });

    return {
        productCount: totalProducts,
        totalInventoryValue: formatCurrency(totalInventoryValue),
        totalSales: 127,
        totalCustomers: 12
    };
}

export default fetchDashboardResources;