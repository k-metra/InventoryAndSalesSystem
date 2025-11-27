import api from "../axios/api";
import type { User } from "../contexts/AuthContext";

// Create a Promise that use() can directly consume
const fetchUserPromise = new Promise<User | null>((resolve, _) => {
    api.get('/me')
    .then(res => {
        resolve(res.data.user);
    })
    .catch(err => {
        console.log("Error fetching user:", err);
        resolve(null);
    })
})

export default fetchUserPromise;
