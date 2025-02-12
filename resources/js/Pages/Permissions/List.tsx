import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PermissionInterface, PermissionsListInterface, PermissionGroupsListInterface, PermissionGroupInterface} from '@/Interfaces/PermissionInterface'
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import { Head , usePage, router} from '@inertiajs/react';
import {PageProps} from '@/types'
import {FlashMessage} from '@/Components/FlashMessage'
import RenderPaginationItem from '@/Components/RenderPaginationItem';
import BreadcrumbComponent from '@/Components/Breadcrumb';
// Icon import
import { Edit, Search, RotateCcw} from 'lucide-react';
// Shadcn  Component Card
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
// Shadcn Component Table
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    TableHead,
} from '@/Components/ui/table';
// Shadcn Pagination component
import {
    Pagination,
    PaginationContent
} from "@/Components/ui/pagination";
// Shadcn
import { Button } from '@/Components/ui/button';
import {Input} from '@/Components/ui/input';
// Page Popery  Interface
interface IndexProps {
    permissionsGroups: PermissionGroupsListInterface;
    filters: {
        name:string
    };
}
// Global Page Property
interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };

}
export default function PermissionList({permissionsGroups,filters }:IndexProps) {


    // Page Props
    const { props } = usePage<ExtendedPageProps>();
    // Extract flash message  from property
    const { flash } = props;
     // Flash Message
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    // Set Flash Message
    useEffect(() => {
        if (flash?.success || flash?.error) {
            const type = flash.success ? "success" : "error";
            const message = flash.success || flash.error || "";
            setFlashMessage({ type, message });

            const timer = setTimeout(() => setFlashMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const [searchParams, setSearchParams] = useState({
                name: filters?.name || '',

            });
    // Search handle
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('permission.index'),
            searchParams,
            { preserveState: true }
        );
    };
    // Reset search
    const handleReset = () => {
        setSearchParams({
            name: ''

        });
        // Redirect to the base users page without any filters
        router.get(
            route('permission.index'),
            {},
            { preserveState: true }
        );
    };
    // Input change handle
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // Edit Handel
    const handleEdit = (permissionGroupId : number)=>{
        console.log(permissionGroupId);

        let url = route('permission.edit',permissionGroupId)
        window.location.href = url;

    }
    const breadcrumbs = [
        { name: "Dashboard", href: route('dashboard.index') },
        { name: "Permissions", href: null },

    ];
    return (
        <AuthenticatedLayout>
             <Head title="Permissions" />
             <div className="space-y-6">
             <BreadcrumbComponent breadcrumbs={breadcrumbs} />
                <Card>
                    {flashMessage && (
                        <div className="mb-4">
                            <FlashMessage
                                type={flashMessage.type}
                                message={flashMessage.message}
                            />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle>Permission List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Search by name..."
                                        value={searchParams.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" className="w-full sm:w-auto">
                                        <Search className="h-4 w-4 mr-2" />
                                        Search
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        className="w-full sm:w-auto"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/4 font-bold">Name</TableHead>
                                    <TableHead className="w-1/4 font-bold">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissionsGroups?.data?.length ? (
                                    permissionsGroups.data.map((permissionsGroup: PermissionGroupInterface) => (
                                        <TableRow key={permissionsGroup.id}>
                                            <TableCell>{permissionsGroup.name}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(permissionsGroup.id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                            No permission found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {permissionsGroups?.meta.links && permissionsGroups.data.length > 0 && (
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        {permissionsGroups.meta.links.map((link, index) =>
                                                RenderPaginationItem(link,index)
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                            )}
                    </CardContent>
                </Card>
             </div>

        </AuthenticatedLayout>
    );
}
