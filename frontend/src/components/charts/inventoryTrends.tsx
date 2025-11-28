import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function InventoryTrends( { data }: { data: Array<{ date: string; inventory: number }>} ) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart responsive data={data} margin={{ right: 20, left: 0}}>
                <CartesianGrid />
                <Bar dataKey="inventory" fill="var(--color-primary)" />
                <XAxis dataKey="date" />
                <YAxis />
            </BarChart>
        </ResponsiveContainer>
    )
}