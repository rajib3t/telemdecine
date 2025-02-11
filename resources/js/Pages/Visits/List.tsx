import React ,{useState, FormEventHandler, useEffect} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm, router } from "@inertiajs/react";
import {PageProps} from '@/types'
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
import { Visit, Visits } from "@/Interfaces/VisitInterface";
import { Department } from "@/Interfaces/DepartmentInterface";
import { Edit, Search, RotateCcw } from 'lucide-react';
import {STATUS_CLASS} from '@/Constants/Status'
import { DatePicker } from '@/Components/DatePicker'
// Import UI card components from the custom components library
// These components are used to create a structured card layout in the application
import {
    Card,        // Main card container component
    CardHeader,  // Header section of the card
    CardTitle,   // Title component for the card
    CardContent, // Content section of the card
} from '@/Components/ui/card';
// Import UI table components from the custom components library
// These components are used to create structured data tables in the application
import {
    Table,      // Main table container component
    TableBody,  // Container for table rows
    TableRow,   // Individual table row component
    TableCell,  // Individual table cell component
    TableHeader,// Header section of the table
    TableHead,  // Header cell component
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/Components/ui/select"
// Define the navigation breadcrumbs array
// Each breadcrumb has a name and href property
// href can be null for the current/last item in the navigation
const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard') }, // Link to the dashboard page
    { name: "Visit", href: null }                    // Current page (no link)
];

// Interface extending PageProps to include flash message properties
interface ExtendedPageProps extends PageProps {
    // Optional flash property containing success and error messages
    flash?: {
        success?: string;  // Optional success message string
        error?: string;    // Optional error message string
    };
}

interface IndexProps {
    visits: Visits;
    filters: any;
}

export default function VisitList({visits, filters} : IndexProps){

    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    const [searchParams, setSearchParams] = useState({
            date: filters?.date || '',
            status: filters?.status || ''
        });


    // Effect hook to handle flash messages
    useEffect(() => {
        // Check if there's a success or error flash message
        if (flash?.success || flash?.error) {
            // Determine the type of message (success or error)
            const type = flash.success ? "success" : "error";
            // Get the message content
            const message = flash.success || flash.error || "";
            // Set the flash message state
            setFlashMessage({ type, message });

            // Set a timer to automatically clear the flash message after 5 seconds
            const timer = setTimeout(() => setFlashMessage(null), 5000);
            // Cleanup function to clear the timer if component unmounts
            return () => clearTimeout(timer);
        }
    }, [flash]); // Re-run effect when flash prop changes


    const handleEdit = (visitID: number) => {
            router.visit(route('visit.edit', visitID));
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
                date: '',
                status: ''
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
        const formatDate = (date: Date): string => {
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}/${month}/${day}`;
          };
        const handleDateChange = (date: Date | undefined) => {
            // Convert the Date object to a string format your backend expects
            // Assuming your backend expects "YYYY-MM-DD" format
            const formattedDate = date ? formatDate(date) : '';


            //setData('date', formattedDate);
        };
        const changeStatusSearch = async (value:string)=>{
            setSearchParams(prev =>({
                ...prev,
                [status]:value
            }))
        }
    return (
        <AuthenticatedLayout>
            <Head title="Visit List" />
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
                        <CardTitle>
                            Visit List
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <DatePicker
                                        allowPastDates = {true}
                                        value={searchParams.date ? new Date(searchParams.date) : undefined}
                                        onChange={handleDateChange}

                                        dateFormat="dd/MM/yyyy"



                                    />

                                </div>
                                <div className="flex-1">
                                    <Select
                                        value={searchParams.status}
                                        onValueChange={changeStatusSearch}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(STATUS_CLASS).map(([id, name]) => (
                                                <SelectItem
                                                    key={id}
                                                    value={id}
                                                >
                                                    {id.toString()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                    <TableHead className="w-2/12 font-bold">Date</TableHead>
                                    <TableHead className="w-2/12 font-bold">Department</TableHead>
                                    <TableHead className="w-2/12 font-bold">Hospital</TableHead>
                                    <TableHead className="w-2/12 font-bold">Days</TableHead>
                                    <TableHead className="w-2/12 font-bold">Max Patients</TableHead>
                                    <TableHead className="w-1/12 font-bold">Status</TableHead>
                                    <TableHead className="w-2/12 font-bold">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {visits?.data?.length ? (
                                    visits.data.map((visit: Visit) => (
                                        <TableRow key={visit.id}>
                                            <TableCell>{visit.date}</TableCell>
                                            <TableCell>{visit.department.name}</TableCell>
                                            <TableCell>{visit.hospital_name}</TableCell>
                                            <TableCell>{renderDays(visit.department)}</TableCell>
                                            <TableCell>{visit.slot_number}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-white ${STATUS_CLASS[visit.status  as keyof typeof STATUS_CLASS] ?? ''}`}>
                                                    {visit.status}
                                                </span>

                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(visit.id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                 {/* {role.name !== 'Admin' &&(
                                                    <DeleteRoleButton
                                                        role={role}
                                                        roleName={role.name}
                                                        page={roles.meta.current_page}
                                                    />
                                                )} */}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            No visit found
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
