import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { UserInterface, UserListInterface } from '@/Interfaces/UserInterface';
import DeleteUserButton from '@/Components/DeleteUserButton';
import { PageProps } from '@/types';
import { FlashMessage } from '@/Components/FlashMessage';
import { Trash, Edit, Search, RotateCcw } from 'lucide-react';
import RenderPaginationItem from '@/Components/RenderPaginationItem';
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    TableHead,
} from '@/Components/ui/table';
import {
    Pagination,
    PaginationContent
} from "@/Components/ui/pagination";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { RoleInterface } from '@/Interfaces/RoleInterface';


interface IndexProps {
    users: UserListInterface;
    filters?: {
        name?: string;
        email?: string;
    };
}

interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };

}

export default function UserList({ users, filters }: IndexProps) {


    const { props } = usePage<ExtendedPageProps>();
    const { flash, auth } = props;
    const authUser = auth.user;
    const [searchParams, setSearchParams] = useState({
        name: filters?.name || '',
        email: filters?.email || ''
    });

    const handleEdit = (userId: number) => {
        const url = userId === authUser.id
            ? route('profile.edit')
            : `/users/${userId}/edit`;
        window.location.href = url;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('user.index'),
            searchParams,
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearchParams({
            name: '',
            email: ''
        });
        // Redirect to the base users page without any filters
        router.get(
            route('user.index'),
            {},
            { preserveState: true }
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const type = flash.success ? "success" : "error";
            const message = flash.success || flash.error || "";
            setFlashMessage({ type, message });

            const timer = setTimeout(() => setFlashMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const breadcrumbs = [
        { name: "Dashboard", href: route('dashboard.index') },
        { name: "Users", href: null },

    ];

    return (
        <AuthenticatedLayout>
            <Head title="Users" />
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
                        <CardTitle>Users List</CardTitle>
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
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        name="email"
                                        placeholder="Search by email..."
                                        value={searchParams.email}
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
                                    <TableHead className="w-1/4">Name</TableHead>
                                    <TableHead className="w-1/4">Email</TableHead>
                                    <TableHead className="w-1/4">Roles</TableHead>
                                    <TableHead className="w-1/4">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.data?.length ? (
                                    users.data.map((user:UserInterface) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.roles.length > 0 && user.roles.map((role: RoleInterface) => (
                                                    <span key={role.id}>
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(user.id)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {authUser.id !== user.id && (
                                                        <DeleteUserButton
                                                            user={user}
                                                            userName={user.name}
                                                            page={users.meta.current_page}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center h-24 text-muted-foreground"
                                        >
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {users?.meta.links && users.data.length > 0 && (
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        {users.meta.links.map((link, index) =>
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
