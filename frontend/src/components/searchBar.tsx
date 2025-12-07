type SearchBarProps = {
    placeholder?: string;
    handleSearch: () => void;
    handleClear: () => void;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder, handleSearch, handleClear, value, onChange }: SearchBarProps ) {
    return (
        <label className="relative">
            <input
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                className="bg-secondary text-text px-4 py-2 rounded-md w-full outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 ease-in"
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Search..."}
            />
        </label>
    )
}