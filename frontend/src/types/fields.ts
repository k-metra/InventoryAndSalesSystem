type BaseField = {
    label: string;
    key: string;
    type: "text" | "number" | "readonly" | "options";
}

type OptionField = BaseField & {
    type: "options";
    fetchOptions?: () => Promise<{ id: string | number; name: string }[]>;
}

type PriceField = BaseField & {
    type: "number";
    format: (value: number) => string;
}

type Field = BaseField | OptionField | PriceField;

export type { Field, BaseField, OptionField, PriceField };