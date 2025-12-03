type Commons = {
    label: string;
    key: string;
}

type BaseField = Commons & {
    type: "text" | "readonly";
}

type OptionField = Commons & {
    type: "options";
    fetchOptions?: () => Promise<{ id: string | number; name: string }[]>;
}

type PriceField = Commons & {
    type: "number";
    format?: (value: number) => string;
}

type Field = BaseField | OptionField | PriceField;

export type { Field, BaseField, OptionField, PriceField };