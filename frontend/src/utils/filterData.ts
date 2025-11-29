import getNestedValue from "./getNestedValue";

export default function filterData(query: string, data: any[], keys: string[]): any[] {
    if (query.trim() === "") return data;

    query = query.toLowerCase();

    return data.filter(item => {
        return keys.some(key => {
            const value = getNestedValue(item, key);
            if (value && typeof value === 'string') {
                return value.toLowerCase().includes(query);
            }
        })
    })
}