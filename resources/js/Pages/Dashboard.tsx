import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Visits, Visit} from '@/Interfaces/VisitInterface';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import {VISIT_CLASS} from '@/Constants/VisitStatus'
/**
 * Import UI card components from the custom components library
 * @module Components/ui/card
 * @description These components are used to create structured card layouts:
 * - Card: The main container component
 * - CardHeader: Header section of the card
 * - CardTitle: Title element for the card
 * - CardContent: Main content area of the card
 */
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
/**
 * Import UI table components from the custom components library
 * @module Components/ui/table
 * @description These components are used to create structured table layouts:
 * - Table: The main container component for tabular data
 * - TableBody: Container for table rows
 * - TableRow: Individual row component
 * - TableCell: Individual cell component
 * - TableHeader: Header section of the table
 * - TableHead: Header cell component
 */
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    TableHead,
} from '@/Components/ui/table';
import { Patient } from '@/Interfaces/PatientInterface';
/**
 * Props interface for the Dashboard component.
 * @interface DashboardProps
 * @property {Object} visits - Container object for visit data
 * @property {Visits} visits.data - The actual visits data structure
 */
interface DashboardProps {
    visits: Visits
}


/**
 * Array of breadcrumb items for navigation
 * @constant {Array<{name: string, href: string | null}>} breadcrumbs
 * @property {string} name - Display name for the breadcrumb item
 * @property {string|null} href - URL for the breadcrumb link, null if not clickable
 */
const breadcrumbs = [
    { name: "Dashboard", href: null }
]
export default function Dashboard({visits} : DashboardProps) {


    return (
        <AuthenticatedLayout

        >
            <Head title="Dashboard" />
            <div className="space-y-6">
                <BreadcrumbComponent breadcrumbs={breadcrumbs} />
                {visits?.data?.length ? (
                    visits.data.map((visit: Visit) => (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <h2>Patients list of {visit.date}</h2>
                                    <p className='mt-3'>
                                        Department : {visit.department.name}
                                    </p>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
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
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {visit.patients?.map((patient: Patient) => (
                                            <TableRow key={patient.id}>
                                                <TableCell>{patient.hospital_id}</TableCell>
                                                <TableCell>{patient.name}</TableCell>
                                                <TableCell>{patient.phone}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded text-white ${VISIT_CLASS[patient.visit_status  as keyof typeof VISIT_CLASS] ?? ''}`}>
                                                        {patient.visit_status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>

                                                </TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))

                ):(
                    <></>
                )
            }

            </div>

        </AuthenticatedLayout>
    );
}
