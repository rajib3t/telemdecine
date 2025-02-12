import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FlashMessage } from '@/Components/FlashMessage';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { FlashMessageState } from '@/Interfaces/FlashMessageState';

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

export default function DepartmentCreate() {
    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);

    const { data, setData, post, errors, processing } = useForm({
        name: '',
        max_patients: '',
        days: [] as string[]
    });

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

    const breadcrumbs = [
        { name: "Dashboard", href: route('dashboard.index') },
        { name: "Departments", href: route('department.index') },
        { name: 'Create', href: null }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('department.store'));
    };

    const handleDayToggle = (day: string, checked: boolean) => {
        setData('days', checked
            ? [...data.days, day]
            : data.days.filter(d => d !== day)
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title='Create Department' />
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
                        <CardTitle>Create Department</CardTitle>
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
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="max_patients">Maximum Patients</Label>
                                <Input
                                    id="max_patients"
                                    name="max_patients"
                                    type="number"
                                    min="1"
                                    value={data.max_patients}
                                    onChange={(e) => setData('max_patients', e.target.value)}
                                    required
                                />
                                {errors.max_patients && <span className="text-red-500 text-sm">{errors.max_patients}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Days of Visit</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <Label
                                            key={day}
                                            className="flex items-center space-x-2 cursor-pointer"
                                            htmlFor={`day-${day}`}
                                        >
                                            <Checkbox
                                                id={`day-${day}`}
                                                checked={data.days.includes(day)}
                                                onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                                            />
                                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {day}
                                            </span>
                                        </Label>
                                    ))}
                                </div>
                                {errors.days && <span className="text-red-500 text-sm">{errors.days}</span>}
                            </div>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Creating...' : 'Create Department'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
