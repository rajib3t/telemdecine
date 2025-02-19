import React, {useState, useEffect}  from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head , usePage} from '@inertiajs/react'
import { PageProps } from "@/types";
import { Visit } from "@/Interfaces/VisitInterface";
import { FlashMessage } from '@/Components/FlashMessage';
import { FlashMessageState } from '@/Interfaces/FlashMessageState';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { VISIT_CLASS } from "@/Constants/VisitStatus";
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
import { Patient } from "@/Interfaces/PatientInterface";
import ConfirmPatient from "@/Components/ConfirmPatient";

interface PatientListPageProps {
    visit:{
        data:Visit
    }
}

// Interface extending PageProps to include flash message properties
interface ExtendedPageProps extends PageProps {
    // Optional flash property containing success and error messages
    flash?: {
        success?: string;  // Optional success message string
        error?: string;    // Optional error message string
    };
}

/**
 * Array of breadcrumb items for navigation
 * @constant {Array<{name: string, href: string | null}>} breadcrumbs
 * @property {string} name - Display name for the breadcrumb item
 * @property {string|null} href - URL for the breadcrumb link, null if not clickable
 */
const breadcrumbs = [
    { name: "Dashboard", href: route("dashboard.index") },
    { name : "Confirmation Appointment", href:route('confirm.appointment.index')},
    { name:'Patient List', href: null}
]
export default function PatientList({visit}:PatientListPageProps){
    console.log(visit);
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
    return(
        <AuthenticatedLayout>
            <Head title="Patient List for confirmation" />

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
                            Patient List
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableHead>
                                    Hospital ID
                                </TableHead>
                                <TableHead>
                                    Name
                                </TableHead>
                                <TableHead>
                                    Phone
                                </TableHead>
                                <TableHead>
                                    Status
                                </TableHead>
                                <TableHead>
                                    Action
                                </TableHead>
                            </TableHeader>
                            <TableBody>
                                {visit?.data?.patients?.length ? (
                                   visit.data.patients.map((patient : Patient)=>(
                                    <TableRow>
                                        <TableCell>
                                            {patient.hospital_id}
                                        </TableCell>
                                        <TableCell>
                                            {patient.name}
                                        </TableCell>
                                        <TableCell>
                                            {patient.phone}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-white ${VISIT_CLASS[patient.visit_status  as keyof typeof VISIT_CLASS] ?? ''}`}>
                                                {patient.visit_status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <ConfirmPatient visit={visit.data} patient={patient} />
                                        </TableCell>
                                    </TableRow>
                                   ))
                                ):(
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No patients
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
