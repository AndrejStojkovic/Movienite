import { createMemo, createSignal } from "solid-js";

export const usePagination = <T>(
    items: () => T[],
    itemsPerPage: number = 20
) => {
    const [currentPage, setCurrentPage] = createSignal(1);

    const totalPages = createMemo(() => Math.ceil(items().length / itemsPerPage));

    const paginatedItems = createMemo(() => {
        if(!itemsPerPage || itemsPerPage == 0)
            return items();
        const start = (currentPage() - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items().slice(start, end);
    });

    const goToPage = (page: number) => {
        const maxPage = totalPages();
        if(page >= 1 && page <= maxPage) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => goToPage(currentPage() + 1);
    const previousPage = () => goToPage(currentPage() - 1);
    const reset = () => setCurrentPage(1);

    return {
        paginatedItems,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        previousPage,
        reset
    };
};