import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head , usePage} from '@inertiajs/react';
import { UserInterface, UserListInterface } from '@/Interfaces/UserInterface';
import DeleteUserButton  from '@/Components/DeleteUserButton';
import { PageProps } from '@/types';
import {FlashMessage} from '@/Components/FlashMessage'
import {
    Trash,
    Edit
} from 'lucide-react'
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
} from '@/Components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { Button } from "@/Components/ui/button";



interface IndexProps {
    users?: UserListInterface
}

interface ExtendedPageProps extends PageProps {

    flash?: {
        success?: string;
        error?: string;
    };
}


export default function List({ users }: IndexProps) {
    const { props } = usePage<ExtendedPageProps>();
    const { flash, auth } = props;
    console.log(props);

    const authUser = auth.user



    const handleEdit = (userId  : number) => {
        if(userId == authUser.id){
            window.location.href = route('profile.edit');
        }else{
            window.location.href = `/users/${userId}/edit`;
        }

    };

    const [flashMessage, setFlashMessage] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
            if (flash?.success || flash?.error) {
                const type = flash.success ? "success" : "error";
                const message = flash.success || flash.error || "";
                setFlashMessage({ type, message });
                const timer = setTimeout(() => setFlashMessage(null), 5000);
                return () => clearTimeout(timer);
            }
        }, [flash]);

    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            <Card>
                {/* Flash message */}
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell className="w-1/4 font-bold">Name</TableCell>
                                <TableCell className="w-1/4 font-bold">Email</TableCell>
                                <TableCell className="w-1/4 font-bold">Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users && users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(user.id)}
                                                >
                                                    <Edit />
                                                </Button>
                                                { authUser.id !== user.id && (
                                                    <DeleteUserButton
                                                        user={user}
                                                        userName={user.name}
                                                        page={users.meta.current_page}
                                                    />
                                                )

                                                }

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
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
                                    {users.meta.links.map((link, index) => {
                                        // Decode HTML entities
                                        const decodedLabel = link.label
                                            .replace('&laquo;', '«')
                                            .replace('&raquo;', '»');

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

                                        // Check if label is a number
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
                                                <PaginationItem key="ellipsis">
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }

                                        return null;
                                    })}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>

    );
}
