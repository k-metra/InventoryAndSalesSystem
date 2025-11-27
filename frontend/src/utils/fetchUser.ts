import api from "../axios/api";

// Create a Promise that use() can directly consume
const fetchUserPromise = api
    .get('/me')
    .then(res => res.data.user)
    .catch(() => null);

export default fetchUserPromise;