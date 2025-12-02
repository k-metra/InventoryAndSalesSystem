type Category = {
    id: number;
    name: string;
    description: string;
}

type Supplier = {
    id: number;
    name: string;
    email: string;
    contact_person: string;
    phone: string;
    address: string;
}

export { type Category, type Supplier };