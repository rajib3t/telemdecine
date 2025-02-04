import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
const decodeLabel = (label: string): string => {
    return label
        .replace('&laquo;', '«')
        .replace('&raquo;', '»');
};


export default  function RenderPaginationItem (link: {
    url: string | null;
    label: string;
    active: boolean;
}, index: number){
    const decodedLabel = decodeLabel(link.label);

    if (link.label === "&laquo; Previous") {
        return (
            <PaginationItem key="prev">
                <PaginationPrevious
                    href={link.url || '#'}
                    className={!link.url ? 'pointer-events-none opacity-50' : ''}
                />
            </PaginationItem>
        );
    }

    if (link.label === "Next &raquo;") {
        return (
            <PaginationItem key="next">
                <PaginationNext
                    href={link.url || '#'}
                    className={!link.url ? 'pointer-events-none opacity-50' : ''}
                />
            </PaginationItem>
        );
    }

    if (!isNaN(Number(decodedLabel))) {
        return (
            <PaginationItem key={decodedLabel}>
                <PaginationLink
                    href={link.url || '#'}
                    isActive={link.active}
                >
                    {decodedLabel}
                </PaginationLink>
            </PaginationItem>
        );
    }

    if (decodedLabel === "...") {
        return (
            <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
            </PaginationItem>
        );
    }

    return null;
}
