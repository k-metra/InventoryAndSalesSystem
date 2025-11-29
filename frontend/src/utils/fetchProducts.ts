import api from './../axios/api'; 

export type Product = {
    id: number;
    name: string;
    sku: string;
    category?: { id: number; name: string; };
    supplier?: { id: number; name: string; };
    price: number;
    stock: number;
}

const fetchProducts = async () => {
    console.log("Fetching products...");

    const products = await api.get('/products')
    .then(res => res.data.products)
    .catch((err) => {
        console.log("Error fetching products", err);
        return [];
    });

    console.log(products);
    return products;
}


export default fetchProducts;