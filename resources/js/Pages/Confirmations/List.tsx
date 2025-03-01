import React, {useEffect, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from '@inertiajs/react';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Visits, Visit} from '@/Interfaces/VisitInterface';
import { PageProps } from "@/types";
import { FlashMessage } from '@/Components/FlashMessage';
import { FlashMessageState } from '@/Interfaces/FlashMessageState';
import {SquareUserRound} from 'lucide-react';
// Import UI card components from the custom components library
// These components are used to create a structured card layout in the application
import {
    Card,        // Main card container component
    CardHeader,  // Header section of the card
    CardTitle,   // Title component for the card
    CardContent, // Content section of the card
} from '@/Components/ui/card';

// Import table-related components from the custom UI library
import {
    Table,      // Main table container component
    TableBody,  // Container for table rows
    TableRow,   // Individual table row component
    TableCell,  // Individual table cell component
    TableHeader,// Header section of the table
    TableHead,  // Header cell component
} from '@/Components/ui/table';
// Import Button component from the custom UI library
// This component provides styled button functionality with various variants and sizes
import { Button } from '@/Components/ui/button';
/**
 * Array of breadcrumb items for navigation
 * @constant {Array<{name: string, href: string | null}>} breadcrumbs
 * @property {string} name - Display name for the breadcrumb item
 * @property {string|null} href - URL for the breadcrumb link, null if not clickable
 */
const breadcrumbs = [
    { name: "Dashboard", href: route("dashboard.index") },
    { name:'Confirmations', href: null}
]


/**
 * Props interface for the Dashboard component.
 * @interface DashboardProps
 * @property {Object} visits - Container object for visit data
 * @property {Visits} visits.data - The actual visits data structure
 */
interface ConfirmationProps {
    visits: Visits
}


// Interface extending PageProps to include flash message properties
interface ExtendedPageProps extends PageProps {
    // Optional flash property containing success and error messages
    flash?: {
        success?: string;  // Optional success message string
        error?: string;    // Optional error message string
    };
}
export default function ConfirmationList({visits}: ConfirmationProps) {
    console.log(visits);
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


    // Edit Handel
    const handleEdit = (visitId : number)=>{
        let url = route('confirm.appointment.patient.list',visitId)
        window.location.href = url;

    }
    return (
        <AuthenticatedLayout>
            <Head title="Confirmations" />

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
                        <CardTitle>
                            Appointment Confirmation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Date
                                    </TableHead>
                                    <TableHead>
                                        Department
                                    </TableHead>
                                    <TableHead>
                                        Booked Patients
                                    </TableHead>
                                    <TableHead>
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visits?.data?.length  ? (
                                   visits?.data?.map((visit: Visit) => (
                                    <TableRow>
                                        <TableCell>
                                            {visit.date}
                                        </TableCell>
                                        <TableCell>
                                            {visit.department.name}
                                        </TableCell>
                                        <TableCell>
                                            {visit.patients.length}
                                        </TableCell>
                                        <TableCell>
                                        <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(visit.id)}
                                                >
                                                    <SquareUserRound className="h-4 w-4" />
                                                </Button>
                                        </div>
                                        </TableCell>
                                    </TableRow>
                                   ))
                                ):(
                                    <></>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

        </AuthenticatedLayout>
    )
}
