import React, { useState, FormEventHandler, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm } from "@inertiajs/react";
import { PageProps } from '@/types'
import { FlashMessageState } from '@/Interfaces/FlashMessageState';
import { FlashMessage } from '@/Components/FlashMessage';
import { DatePicker } from '@/Components/DatePicker'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/Components/ui/select"
import { Departments } from "@/Interfaces/DepartmentInterface";
import { log } from "console";

const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard') },
    { name: "Visit", href: route('visit.index') },
    { name: "Create", href: null}
];

interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}
interface CreateVisitProps {
    departments :{
        data:Departments
    },
    days:number[]
}
export default function VisitCreate({departments, days}:CreateVisitProps) {



    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);

    // Initialize the form with proper date typing
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        department_id: '',
        hospital_name: '',
        slot_number: ''
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setFlashMessage({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setFlashMessage({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleDateChange = (date: Date | undefined) => {
        // Convert the Date object to a string format your backend expects
        // Assuming your backend expects "YYYY-MM-DD" format
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        const formattedDate1 = date ? date.toString().split('T')[0] : '';
        console.log(date,formattedDate, formattedDate1);

        setData('date', formattedDate);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('visit.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Visit" />
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
                        <CardTitle>Create Visit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <div>
                                <DatePicker
                                    value={data.date ? new Date(data.date) : undefined}
                                    onChange={handleDateChange}
                                    maxFutureDays={60}
                                    dateFormat="dd/MM/yyyy"
                                    allowedDays={days}
                                />
                                </div>

                                {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                            </div>

                            <div>
                                <Label htmlFor="department_id">Department ID</Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(value) => setData('department_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(departments).map(([id, name]) => (
                                            <SelectItem
                                                key={id}
                                                value={id}
                                            >
                                                {name.toString()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <p className="text-sm text-red-600">{errors.department_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="hospital_name">Hospital Name</Label>
                                <Input
                                    id="hospital_name"
                                    type="text"
                                    value={data.hospital_name}
                                    onChange={e => setData('hospital_name', e.target.value)}
                                />
                                {errors.hospital_name && <p className="text-sm text-red-600">{errors.hospital_name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="slot_number">Slot Number</Label>
                                <Input
                                    id="slot_number"
                                    type="number"
                                    value={data.slot_number}
                                    onChange={e => setData('slot_number', e.target.value)}
                                />
                                {errors.slot_number && <p className="text-sm text-red-600">{errors.slot_number}</p>}
                            </div>

                            <Button type="submit" disabled={processing}>
                                Create Visit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
