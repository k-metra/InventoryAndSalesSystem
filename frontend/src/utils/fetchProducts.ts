import api from './../axios/api';

const fetchProducts = async () => {
    console.log("Fetching products...");

    const products = api.get('/products')
    .then(res => res.data)
    .catch((err) => {
        console.log("Error fetching products", err);
        return [];
    });

    return products;
}


export default fetchProducts;