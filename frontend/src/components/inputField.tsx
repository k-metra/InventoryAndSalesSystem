import type { ChangeEvent } from "react";

type InputFieldProps = {
    type: "text" | "number" | "options";
    data?: { id: string | number; name: string }[];
    value?: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function InputField({ type, data, value, onChange }: InputFieldProps) {

    if (type === "options") {
        return (
            <select 
                value={value ?? ""}
                onChange={onChange}
                required 
                className="w-full border border-black/25 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">Select an option</option>
                {data && data.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                ))}
            </select>
        );
    } else if (type === 'text') {
        return (
            <input
                onChange={onChange}
                value={value}
                type="text"
                className="w-full border border-black/25 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
            />
        );
    } else if (type === 'number'){
        return (
            <input
                required
                onChange={onChange}
                value={value}
                type="number"
                className="w-full border border-black/25 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
        )
    }
}