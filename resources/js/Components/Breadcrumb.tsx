import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb"

interface BreadcrumbProps {
    breadcrumbs: {
        name: string;
        href?: string | null;
    }[];
    key?: string
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ breadcrumbs, key }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList key={key}>
                {breadcrumbs.map((item, index) => (

                    <>

                        <BreadcrumbItem key={index}>
                            {item.href ? (
                                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {/* Add separator between items, but not after the last item */}
                        {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadcrumbComponent;
