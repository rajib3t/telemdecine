import React ,{useState, FormEventHandler, useEffect} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm, router } from "@inertiajs/react";
import {PageProps} from '@/types';
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
import { Visit, Visits } from "@/Interfaces/VisitInterface";
import {BookUser, Plus, Eye }from  'lucide-react';
import {Departments, Department} from '@/Interfaces/DepartmentInterface';
import {STATUS_CLASS} from '@/Constants/Status';
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

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/Components/ui/tooltip"
import { Button } from '@/Components/ui/button';
// Define the props interface for the Visit List component
interface IndexProps {
    // visits: Contains paginated visit data and metadata
    visits: Visits;

}

// Interface extending PageProps to include flash message properties
interface ExtendedPageProps extends PageProps {
    // Optional flash property containing success and error messages
    flash?: {
        success?: string;  // Optional success message string
        error?: string;    // Optional error message string
    };
}
// Define the navigation breadcrumbs array
// Each breadcrumb has a name and href property
// href can be null for the current/last item in the navigation
const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard.index') }, // Link to the dashboard page
    { name: "Appointments", href: null }                    // Current page (no link)
];
export default function ListAppointment({visits}: IndexProps){


    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
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

    const handleAddPatient = (visitID: number) => {
                router.visit(route('appointment.add.patient', visitID));
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
            <Head title="Appointments" />
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
                        <CardTitle>Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-2/12 font-bold">Date</TableHead>
                                    <TableHead className="w-2/12 font-bold">Department</TableHead>
                                    <TableHead className="w-2/12 font-bold">Hospital</TableHead>
                                    <TableHead className="w-2/12 font-bold">Days</TableHead>
                                    <TableHead className="w-2/12 font-bold">Max Patients</TableHead>
                                    <TableHead className="w-1/12 font-bold">Booked Patients </TableHead>
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
                                            <TableCell>{visit.patients.length}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAddPatient(visit.id)}
                                                                >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                            <p>Add Patient</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            No open visit found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}
