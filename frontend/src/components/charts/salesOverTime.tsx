import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type SalesOverTimeProps = {
    data: Array<{ date: string; sales: number }>;
};


export default function SalesOverTime({ data }: SalesOverTimeProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
        <LineChart responsive data={data} margin={{ right: 20, left: 0}}>
                <CartesianGrid />
                <Line dataKey="sales" stroke="var(--color-primary)" strokeWidth={2} />
                <XAxis dataKey="date" />
                <YAxis />

            </LineChart>
        </ResponsiveContainer>
    )
}