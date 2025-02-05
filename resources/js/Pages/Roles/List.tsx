import React, { useEffect, useState } from 'react';
import {FlashMessage} from '@/Components/FlashMessage';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { RoleInterface, RoleListInterface } from '@/Interfaces/RoleInterface';
import { PageProps } from '@/types';
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import RenderPaginationItem from '@/Components/RenderPaginationItem';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import DeleteRoleButton from '@/Components/DeleteRoleButton'
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
// Shadcn Component Button
import { Button } from '@/Components/ui/button';
import {Input} from '@/Components/ui/input';
import { url } from 'inspector';
// Page Popery  Interface
interface IndexProps {
    roles: RoleListInterface;
    filters: any;
}

// Global Page Property
interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };

}
// Role List function
export default function RoleList({ roles, filters }: IndexProps) {
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
    // Edit Handel
    const handleEdit = (roleId : number)=>{
        let url = route('role.edit',roleId)
        window.location.href = url;

    }
    const [searchParams, setSearchParams] = useState({
            name: filters?.name || '',

        });
    // Search handle
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('role.index'),
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
            route('role.index'),
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
    const breadcrumbs = [
        { name: "Dashboard", href: route('dashboard') },
        { name: "Roles", href: null },

    ];
    return (
        <AuthenticatedLayout>
            <Head title="Roles" />
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
                        <CardTitle>Role List</CardTitle>
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
                            {roles?.data?.length ? (
                                    roles.data.map((role: RoleInterface) => (
                                        <TableRow key={role.id}>
                                            <TableCell>{role.name}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(role.id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                 {role.name !== 'Admin' &&(
                                                    <DeleteRoleButton
                                                        role={role}
                                                        roleName={role.name}
                                                        page={roles.meta.current_page}
                                                    />
                                                )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                            No roles found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {roles?.meta.links && roles.data.length > 0 && (
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        {roles.meta.links.map((link, index) =>
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
