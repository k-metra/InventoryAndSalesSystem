import api from "./../axios/api";
import formatCurrency from "./formatCurrency";

type dashboardResources = Record<string, number | string>;

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


// const fetchDashboardResources = new Promise<dashboardResources>(async (resolve, _) => {
//     console.log("Fetching dashboard resources...");
//     const { totalProducts, totalInventoryValue } = 
//         await api.get('/products/all')
//         .then(res => res.data)
//         .catch((err) => {
//             console.log("Error fetching product count", err);
//             return 0;
//         });

//     resolve(
//         {
//             productCount: totalProducts,
//             totalInventoryValue: formatCurrency(totalInventoryValue),
//             totalSales: 127,
//             totalCustomers: 12
//         }
//     );
// });

export default fetchDashboardResources;