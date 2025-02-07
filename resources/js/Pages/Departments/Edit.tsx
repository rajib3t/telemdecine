import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FlashMessage } from '@/Components/FlashMessage';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { FlashMessageState } from '@/Interfaces/FlashMessageState';
import { Department } from '@/Interfaces/DepartmentInterface';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Button } from '@/Components/ui/button';

interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface EditPageProps {
    department: {
        data:Department
    };
}

interface FormData {
    name: string;
    max_patients: number;
    days: string[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard') },
    { name: "Departments", href: route('department.index') },
    { name: 'Edit', href: null }
];

export default function DepartmentEdit({ department }: EditPageProps) {


    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);

    const { data, setData, patch, errors, processing } = useForm({
        name: department.data.name,
        max_patients: department.data.max_patients,
        days: department.data.visitDays?.map(day => day.day) || []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('department.update', department.data.id), {
            onSuccess: () => {
                // Optional: Add success handling
            },
            onError: () => {
                // Optional: Add error handling
            }
        });
    };

    const handleDayToggle = (day: string, checked: boolean) => {
        setData('days', checked
            ? [...data.days, day]
            : data.days.filter(d => d !== day)
        );
    };

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
            <Head title={`Edit Department ${department.data.name}`} />
            <div className="space-y-6">
                <BreadcrumbComponent breadcrumbs={breadcrumbs} />
                {flashMessage && (
                    <div className="mb-4">
                        <FlashMessage
                            type={flashMessage.type}
                            message={flashMessage.message}
                        />
                    </div>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>{`Edit Department : ${department.data.name}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">{errors.name}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="max_patients">Maximum Patients</Label>
                                <Input
                                    id="max_patients"
                                    name="max_patients"
                                    type="number"
                                    min="1"
                                    value={data.max_patients}
                                    onChange={(e) => setData('max_patients', Number(e.target.value))}
                                    required
                                    className={errors.max_patients ? "border-red-500" : ""}
                                />
                                {errors.max_patients && (
                                    <span className="text-red-500 text-sm">{errors.max_patients}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Days of Visit</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                                    {DAYS.map((day) => (
                                        <Label
                                            key={day}
                                            className="flex items-center space-x-2 cursor-pointer"
                                            htmlFor={`day-${day}`}
                                        >
                                            <Checkbox
                                                id={`day-${day}`}
                                                checked={data.days.includes(day)}
                                                onCheckedChange={(checked) =>
                                                    handleDayToggle(day, checked as boolean)
                                                }
                                            />
                                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {day}
                                            </span>
                                        </Label>
                                    ))}
                                </div>
                                {errors.days && (
                                    <span className="text-red-500 text-sm">{errors.days}</span>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                {processing ? 'Saving Changes...' : 'Update Department'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
