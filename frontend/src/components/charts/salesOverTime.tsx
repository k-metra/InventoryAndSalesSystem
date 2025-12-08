import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../utils/formatNumbers";

type SalesOverTimeProps = {
    data: Array<{ date: string; total: number }>;
};


export default function SalesOverTime({ data }: SalesOverTimeProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
        <LineChart responsive data={data} margin={{ right: 20, left: 0}}>
                <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    }}
                />
                <Line dataKey="total" stroke="var(--color-primary)" strokeWidth={3} />
                <XAxis 
                    dataKey="date"
                    tickFormatter={(value) => {
                        const date = new Date(value);

                        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }}
                />
                <YAxis />

            </LineChart>
        </ResponsiveContainer>
    )
}