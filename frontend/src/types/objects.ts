type Item = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

type Discount = {
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
}

type Category = {
    id: number;
    name: string;
    description: string;
    products_count?: number;
}

type Supplier = {
    id: number;
    name: string;
    email: string;
    contact_person: string;
    phone: string;
    address: string;
    products_count?: number;
}

export { type Category, type Supplier, type Item, type Discount };