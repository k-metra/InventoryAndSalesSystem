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

const fetchProducts = async ({ queryKey }: { queryKey: [string, number | string, string] }) => {
    const [_key, page, search] = queryKey;

    const params = new URLSearchParams({
        page: String(page || 1),
    });

    if (search) params.set('search', search);

    const products = await api.get(`/products?${params.toString()}`);

    console.log(products.data);
    return products.data;
}


export default fetchProducts;