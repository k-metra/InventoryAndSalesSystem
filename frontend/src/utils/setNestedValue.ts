export default function setNeestedValue(obj: any, key: string, value: any) {
    const keys = key.split('.');

    const lastKey = keys.pop() as string;
    let temp = obj;

    for (const k of keys) {
        if (!temp[k]) temp[k] = {};
        temp = temp[k];
    }

    temp[lastKey] = value;

    temp[lastKey] = value;
}