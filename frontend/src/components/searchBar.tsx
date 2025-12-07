import { IoMdSearch } from "react-icons/io";
import { MdClear } from "react-icons/md";

type SearchBarProps = {
    placeholder?: string;
    handleSearch: () => void;
    handleClear: () => void;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchParams?: URLSearchParams;
}

export default function SearchBar({ placeholder = "Search...", handleSearch, handleClear, value, onChange, searchParams = new URLSearchParams() }: SearchBarProps ) {
    return (
        <label className="relative">
            <input
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                className="bg-secondary border border-black/20 text-text px-4 py-2 pr-10 rounded-md w-full outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 ease-in"
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Search..."}
            />
            {searchParams.get('search') === value && value.trim().length > 0 ? (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-text p-1 rounded-full hover:bg-black/10 transition-colors duration-200 ease-in"
                    title="Clear Search"
                >
                    <MdClear />
                </button>
            ): (
                <button
                    type="button"
                    onClick={handleSearch}
                    className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-text p-1 rounded-full hover:bg-black/10 transition-colors duration-200 ease-in"
                    title="Clear Search"
                >
                    <IoMdSearch />
                </button>
            )}
        </label>
    )
}