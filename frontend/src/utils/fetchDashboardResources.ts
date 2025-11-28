import api from "./../axios/api";

type dashboardResources = Record<string, number>;

const fetchDashboardResources = new Promise<dashboardResources>(async (resolve, _) => {
    const productCount: number = 
        await api.get('/products/all')
        .then(res => res.data.count)
        .catch((err) => {
            console.log("Error fetching product count", err);
            return 0;
        });

    resolve(
        {
            productCount: productCount,
            totalInventoryValue: 7500,
            totalSales: 127,
            totalCustomers: 12
        }
    );
})

export default fetchDashboardResources;