import api from './../axios/api'; 

const fetchProducts = async ({ queryKey }: { queryKey: [string, number | string, string, string, string, string] }) => {
    const [_key, page, search, category, supplier, sort] = queryKey;

    const params = new URLSearchParams({
        page: String(page || 1),
    });

    if (search) params.set('search', search);

    if (category) params.set('category', category);

    if (sort) params.set('sortBy', sort);

    if (supplier) params.set('supplier', supplier);
    const products = await api.get(`/products?${params.toString()}`);

    console.log(products.data);
    return products.data;
}


export default fetchProducts;