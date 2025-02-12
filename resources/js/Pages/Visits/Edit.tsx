import React ,{useState, FormEventHandler, useEffect} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm } from "@inertiajs/react";
import {PageProps} from '@/types'
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
import {Departments} from '@/Interfaces/DepartmentInterface';
import { DatePicker } from '@/Components/DatePicker'
import axios from "axios";
// Import UI card components from the custom components library
// These components are used to create a structured card layout in the application
import {
    Card,        // Main card container component
    CardHeader,  // Header section of the card
    CardTitle,   // Title component for the card
    CardContent, // Content section of the card
} from '@/Components/ui/card';


// Import basic form input component
import { Input } from '@/Components/ui/input';

// Import label component for form fields
import { Label } from '@/Components/ui/label';

// Import button component for form submissions
import { Button } from '@/Components/ui/button';

// Import Select components and their sub-components
import {
    Select,        // Main select container component
    SelectContent, // Container for select options
    SelectItem,    // Individual select option
    SelectTrigger, // Clickable trigger element
    SelectValue,   // Component to display selected value
  } from "@/Components/ui/select"
import { Visit } from "@/Interfaces/VisitInterface";


// Interface extending PageProps to include flash message properties
interface ExtendedPageProps extends PageProps {
    // Optional flash property containing success and error messages
    flash?: {
        success?: string;  // Optional success message string
        error?: string;    // Optional error message string
    };
}

interface EditPageProps {
    visit: {
        data:Visit
    };
    departments :{
            data:Departments
        },
}

// Define the navigation breadcrumbs array
// Each breadcrumb has a name and href property
// href can be null for the current/last item in the navigation
const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard') }, // Link to the dashboard page
    { name: "Visit", href: route('visit.index') },
    { name: 'Edit', href:null}                    // Current page (no link)
];

export default function VisitEdit({visit, departments}:EditPageProps){

     function getVisitDays(visit : Visit) {
        // This simulates the Laravel query result
        // In a real application, this would be an API call
        const visitDays = visit.department.visitDays

        // Extract just the 'day' values and convert to array
        const days = visitDays.map(visit => visit.day);

        const week = [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ];

        // Filter week array to only include days that exist in the days array
        const filteredWeek = week.filter(day => days.includes(day));

        // Get the indices of the filtered days
        const dayIndices = filteredWeek.map(day => week.indexOf(day));

        return dayIndices;
    }
    const initDays = getVisitDays(visit.data)



    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    const [allowedDays, setAllowedDays] = useState(initDays)
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

     // Initialize the form with proper date typing
        const { data, setData, patch, processing, errors } = useForm({
            date: visit.data.date,
            department_id: visit.data.department.id.toString(),
            hospital_name: visit.data.hospital_name,
            slot_number: visit.data.slot_number.toString()
        });


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


            setData('date', formattedDate);
        };

        const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
            e.preventDefault();

            // Only proceed with date formatting if date exists and is valid
            if (data.date) {
                try {
                    const dateObj = new Date(data.date);

                    // Check if date is valid
                    if (!isNaN(dateObj.getTime())) {
                        const formattedDate = formatDate(dateObj);
                        setData('date', formattedDate);
                    }
                } catch (error) {
                    console.error('Error formatting date:', error);
                    // Handle the error appropriately - maybe set an error state
                    return;
                }
            }

            // Use patch with the existing form data
            patch(route('visit.update', visit.data.id));
        };

        const changeDepartment = async (value: string) => {
            try{
                const response = await axios.get(route('department.get', value),
                    {
                        headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                        }
                    }
                );
                if (response.status === 200) {
                    setAllowedDays(response.data);
                    setData('department_id', value)
                }


            }catch (error) {

            }

          };


    return (
        <AuthenticatedLayout>
            <Head title="Edit Visit" />

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
                        <CardTitle>Edit Visit : {visit.data.date}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="department_id">Department ID</Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={changeDepartment}
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
                                <Label htmlFor="date">Date</Label>
                                <div>
                                <DatePicker
                                    allowPastDates = {false}
                                    value={data.date ? new Date(data.date) : undefined}
                                    onChange={handleDateChange}
                                    maxFutureDays={60}
                                    dateFormat="dd/MM/yyyy"
                                    allowedDays={allowedDays}


                                />

                                </div>

                                {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
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
                            {processing ? 'Updating...' : 'Update'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
