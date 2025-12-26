type Item = {
    id: number;
    name: string;
    price: number;
    vat_exempt: boolean;
    quantity: number;
    maxQuantity: number;
}

type Discount = {
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
}

type Product = {
    id: number;
    name: string;
    sku: string;
    category?: { id: number; name: string; };
    supplier?: { id: number; name: string; };
    price: number;
    vat_exempt: boolean;
    stock: number;
}

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
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

export { type Category, type Supplier, type Item, type Discount, type Product, type Customer };