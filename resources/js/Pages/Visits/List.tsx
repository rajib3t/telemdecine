import React ,{useState, FormEventHandler, useEffect} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm } from "@inertiajs/react";
import {PageProps} from '@/types'
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';

// Breadcrumb objects
const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard') },
    { name: "Visit", href: null }
];
// Global page property
interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}
export default function VisitList(){
    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    // const [searchParams, setSearchParams] = useState({
    //     name: filters?.name || '',
    // });


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
            </div>
        </AuthenticatedLayout>
    );
}
