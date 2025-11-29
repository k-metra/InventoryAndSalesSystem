import { IoChevronBackOutline } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import { useCallback } from "react";

type PaginationProps = {
    page: number;
    setPage: (page: number) => void;
    lastPage: number;
}

export default function Pagination({ page, setPage, lastPage }: PaginationProps) {

    const MAX_VISIBLE_PAGES = 5;

    const getVisiblePages = useCallback(() => {
        const pages = [];

        if (lastPage <= MAX_VISIBLE_PAGES) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        disabled={i === page}
                        className="px-4 cursor-pointer bg-background border border-black/25 hover:bg-black/5 rounded disabled:opacity-50"
                    >
                        {i}
                    </button>
                )
            }

        } else {
             const half = Math.floor(MAX_VISIBLE_PAGES / 2);

             let start = Math.max(1, page - half);
            let end = Math.min(lastPage, page + half);

            if (page <= half) {
                start = 1;
                end = MAX_VISIBLE_PAGES
            }

            for (let i = start; i <= end; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        disabled={i === page}
                        className="px-4 cursor-pointer bg-background border border-black/25 hover:bg-black/5 rounded disabled:opacity-50"
                    >
                        {i}
                    </button>
                );
            }
        }


        return pages;

    }, [page, lastPage]);

    const pages = getVisiblePages();

    return (
        <div className="flex gap-3 items-center justify-center">
            <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-1 cursor-pointer bg-background border border-black/25 hover:bg-black/5 rounded disabled:opacity-50"
            >
                <IoChevronBackOutline size={20} />
            </button>
            {pages.map((button) => button)}

            <button
                disabled={page === lastPage}
                onClick={() => setPage(page + 1)}
                className="px-4 py-1 cursor-pointer bg-background border border-black/25 hover:bg-black/5 rounded disabled:opacity-50"
            >
                <GrFormNext size={20} />
            </button>
        </div>
    );
}