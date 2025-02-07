import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FlashMessage } from '@/Components/FlashMessage';
import RenderPaginationItem from '@/Components/RenderPaginationItem';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { FlashMessageState } from '@/Interfaces/FlashMessageState';
import { Departments, Department } from '@/Interfaces/DepartmentInterface';
import { Edit, Search, RotateCcw } from 'lucide-react';
import DeleteDepartmentButton from '@/Components/DeleteDepartmentButton'
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
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

interface SearchParams {
    name: string;
}

interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface IndexProps {
    departments: Departments;
    filters: {
        name?: string;
    };
}

const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard') },
    { name: "Departments", href: null }
];

export default function DepartmentList({ departments, filters }: IndexProps) {
    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    const [searchParams, setSearchParams] = useState({
        name: filters?.name || '',
    });

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const type = flash.success ? "success" : "error";
            const message = flash.success || flash.error || "";
            setFlashMessage({ type, message });

            const timer = setTimeout(() => setFlashMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('department.index'),
            searchParams,
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearchParams({ name: '' });
        router.get(
            route('department.index'),
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

    const handleEdit = (departmentId: number) => {
        router.visit(route('department.edit', departmentId));
    };

    const renderDays = (department: Department) => {


        if (!department.visitDays?.length) {
            return <span className="text-xs text-gray-500">No days assigned</span>;
        }

        return (
            <div className="flex gap-2 flex-wrap">
                {department.visitDays.map((day) => (
                    <span
                        key={day.id}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                        {day.day}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Department List" />
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
                        <CardTitle>Department List</CardTitle>
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
                                    <TableHead className="w-1/4">Name</TableHead>
                                    <TableHead className="w-1/4">Days</TableHead>
                                    <TableHead className="w-1/4">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments?.data?.length ? (
                                    departments.data.map((department: Department) => (
                                        <TableRow key={department.id}>
                                            <TableCell>{department.name}</TableCell>
                                            <TableCell>{renderDays(department)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(department.id)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <DeleteDepartmentButton department={department} departmentName={department.name} page={departments.meta.current_page}/>

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                            No departments found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
