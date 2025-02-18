import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from '@inertiajs/react';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Visits, Visit} from '@/Interfaces/VisitInterface';
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
export default function ConfirmationList({visits}: ConfirmationProps) {
    console.log(visits);

    return (
        <AuthenticatedLayout>
            <Head title="Confirmations" />
            <BreadcrumbComponent breadcrumbs={breadcrumbs} />
            <div className="space-y-6">

            </div>

        </AuthenticatedLayout>
    )
}
