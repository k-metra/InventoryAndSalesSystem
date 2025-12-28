import { type Item } from "@typings/objects";

export type SalesBody = {
    customer_id: number | null;
    payment_method: "cash" | "card" | "mobile" | "",
    subtotal: number;
    amount_received: number;
    discount_amount: number;
    vat_rate: number;
    vat_amount: number;
    total: number;
    items: Item[];
}