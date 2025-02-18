import React ,{useState, FormEventHandler, useEffect} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm, router } from "@inertiajs/react";
import {PageProps} from '@/types';
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
import { Visit, Visits } from "@/Interfaces/VisitInterface";
import { Department } from "@/Interfaces/DepartmentInterface";
import { Edit, Search, RotateCcw } from 'lucide-react';
import {STATUS_CLASS} from '@/Constants/Status';
import { DatePicker } from '@/Components/DatePicker';
import {Departments} from '@/Interfaces/DepartmentInterface';
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
import { Alert, AlertDescription } from "@/Components/ui/alert";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/Components/ui/select"
import { log } from "console";
// Define the navigation breadcrumbs array
// Each breadcrumb has a name and href property
// href can be null for the current/last item in the navigation
const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard.index') }, // Link to the dashboard page
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

// Define the props interface for the Visit List component
interface IndexProps {
    // visits: Contains paginated visit data and metadata
    visits: Visits;
    // filters: Contains search/filter parameters
    filters: {
        start_date: string,    // Start date for filtering visits
        end_date: string,      // End date for filtering visits
        department: number,     // Department ID for filtering visits
        status: string         // Status for filtering visits
    },
    // departments: Contains department data
    departments: {
        data: Departments      // Department data structure
    },
}


interface ValidationErrors {
    date?: string;
}
export default function VisitList({visits, filters, departments} : IndexProps){
    console.log(visits);

    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    const [searchParams, setSearchParams] = useState({
            start_date: filters?.start_date || '',
            end_date:filters?.end_date || '',
            department:filters?.department || '',
            status: filters?.status || ''
        });
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Validate dates whenever they change
    useEffect(() => {
        validateDates(searchParams.start_date, searchParams.end_date);
    }, [searchParams.start_date, searchParams.end_date]);

    const validateDates = (startDate: string, endDate: string) => {
        setErrors({});


        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            console.log(start, end);
            if (end < start) {
                // Set the error message for the date range
                setErrors({
                    date: "End date cannot be before start date"
                });
                return false;
            }
        }
        return true;
    };
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

        // Validate dates before submitting
        if (!validateDates(searchParams.start_date, searchParams.end_date)) {
            return;
        }

        // Additional validation: if one date is set, both must be set
        if ((searchParams.start_date && !searchParams.end_date) ||
            (!searchParams.start_date && searchParams.end_date)) {
            setErrors({
                date: "Both start and end dates must be set"
            });
            return;
        }

        router.get(
            route('visit.index'),
            searchParams,
            { preserveState: true }
        );
    };

        const handleReset = () => {
            setSearchParams({
                start_date: '',
                end_date:'',
                department:'',
                status: ''
            });
            // Redirect to the base users page without any filters
            router.get(
                route('visit.index'),
                {},
                { preserveState: true }
            );
        };
        const handleDateChange = (field: 'start_date' | 'end_date', date: Date | undefined) => {
            const formattedDate = date ? formatDate(date) : '';

            // If changing end date, validate it's not before start date
            if (field === 'end_date' && searchParams.start_date && formattedDate) {
                validateDates(searchParams.start_date, formattedDate);
            }

            // If changing start date, validate it's not after end date
            if (field === 'start_date' && searchParams.end_date && formattedDate) {
                validateDates(formattedDate, searchParams.end_date);
            }

            setSearchParams(prev => ({
                ...prev,
                [field]: formattedDate
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
            return `${year}-${month}-${day}`;
          };

        const handleFieldChange = async (field: 'status' | 'department', value: string) => {
            setSearchParams(prev => ({
                ...prev,
                [field]: value
            }));
        };
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
                        <Card className="w-full">
                            <CardContent className="pt-6">
                            {errors.date && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {errors.date}
                                    </AlertDescription>
                                </Alert>
                            )}
                                <form onSubmit={handleSearch} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                                        <DatePicker
                                            allowPastDates={true}
                                            value={searchParams.start_date ? new Date(searchParams.start_date) : undefined}
                                            onChange={(date) => handleDateChange('start_date', date)}
                                            dateFormat="dd/MM/yyyy"
                                            placeHolder="Start Date"
                                            className="w-full"
                                        />
                                        </div>

                                        <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">End Date</label>
                                        <DatePicker
                                            allowPastDates={true}
                                            value={searchParams.end_date ? new Date(searchParams.end_date) : undefined}
                                            onChange={(date) => handleDateChange('end_date', date)}
                                            dateFormat="dd/MM/yyyy"
                                            placeHolder="End Date"
                                            className="w-full"
                                        />
                                        </div>

                                        <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Department</label>
                                        <Select
                                            value={searchParams.department.toString()}
                                            onValueChange={(value) => handleFieldChange('department', value.toString())}
                                        >
                                            <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Department" />
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
                                        </div>

                                        <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Status</label>
                                        <Select
                                            value={searchParams.status}
                                            onValueChange={(value) => handleFieldChange('status', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(STATUS_CLASS).map(([id, name]) => (
                                                    <SelectItem key={id} value={id}>
                                                    {id.toString()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                        <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        className="w-full sm:w-auto"
                                        >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                        </Button>
                                        <Button
                                        type="submit"
                                        className="w-full sm:w-auto"
                                        >
                                        <Search className="h-4 w-4 mr-2" />
                                        Search
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
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
