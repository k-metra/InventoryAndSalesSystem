type BaseField = {
    label: string;
    key: string;
    type: "text" | "number" | "readonly";
}

type OptionField = {
    label: string;
    key: string;
    type: "options";
    fetchOptions?: () => Promise<{ id: string | number; name: string }[]>;
}

type Field = BaseField | OptionField;

export type { Field, BaseField, OptionField };