import api from './../axios/api';

const fetchProducts = new Promise(async (resolve, _) => {
    const products = await api.get('/products')
    .then(resp => resp.data.products)
    .catch((err) => {
        console.log("Encountered an error fetching products:", err);
        return {};
    })

    resolve(products);
});


export default fetchProducts;