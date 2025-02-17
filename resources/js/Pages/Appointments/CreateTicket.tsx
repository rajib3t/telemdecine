import React ,{useState, FormEventHandler, useEffect, useCallback} from "react";
import _ from 'lodash';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm, router } from "@inertiajs/react";
import {PageProps} from '@/types';
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
import { Visit, Visits } from "@/Interfaces/VisitInterface";
import axios from "axios";
import {Patient} from '@/Interfaces/PatientInterface';
import CreateNewPatient from '@/Components/CreateNewPatient'
import {VISIT_CLASS} from '@/Constants/VisitStatus'
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
// Import custom UI input component for form fields
import { Input } from '@/Components/ui/input';
// Import custom UI label component for form field labels
import { Label } from  '@/Components/ui/label';
import { Button } from '@/Components/ui/button'
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
    { name: "Appointments", href: route('appointment.index') },
    { name: "Create Ticket", href: null}                    // Current page (no link)
];

// Define the props interface for the Create Ticket component
interface CreateTicketProps {
    // visit: Contains the visit data for the ticket being created
    visit: {
        data: Visit
    };
}



export default function CreateTicket({visit}: CreateTicketProps){



    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { data, setData, post, errors, processing } = useForm({
        patientId: '',
        hospitalId: '',
        patientName: '',
        phone:'',
        address:'',
        district:''
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
    // Debounced search function with API call
  const debouncedSearch = useCallback(
    _.debounce(async (searchValue: string) => {
      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(route('patient.get'), {
          params: {
            search: searchValue,
          },
          // Add any necessary headers
          headers: {
            'Accept': 'application/json',
            // Add authorization if needed
            // 'Authorization': `Bearer ${token}`
          }
        });
        if(response.data.status === true){
            setSuggestions(response.data.patients);
            setData('patientId','');
            setData('hospitalId', '');
            setData('patientName', '');
            setData('phone', '');
            setData('address', '');
            setData('district', '');
        }else{
            setError(response.data.message);
            setData('patientId','');
            setData('hospitalId', '');
            setData('patientName', '');
            setData('phone', '');
            setData('address', '');
            setData('district', '');
            setSuggestions([]);
        }




      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch results');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length >= 2) {
          debouncedSearch(value);
        } else {
          setSuggestions([]);
        }
      };

      const handlePatientSelect = (patient: Patient) => {
        setData('patientId',patient.id);
        setData('hospitalId', patient.hospital_id);
        setData('patientName', patient.name);
        setData('phone', patient.phone);
        setData('address', patient.address);
        setData('district', patient.district);
        setSearchTerm(patient.name);
        setSuggestions([]);

      };


      const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            post(route('appointment.add.into.visit', visit.data.id));
        };

    return(
        <AuthenticatedLayout>
            <Head title="Create Ticket" />
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
                        <CardTitle>Add Patient in Visit -{'>'}{visit.data.date}  -{'>'} Department -{'>'} {visit.data.department.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Search / Add Patient</CardTitle>
                            </CardHeader>
                            <CardContent>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="relative w-full">
                                                <div className="relative">
                                                    <Label htmlFor="search">Search Patient</Label>
                                                    <Input
                                                        id="search"
                                                        type="text"
                                                        placeholder="Enter patient name, phone or ID..."
                                                        className="mt-1"
                                                        value={searchTerm}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                {isLoading && (
                                                    <div className="absolute w-full mt-1 p-2 bg-white border rounded-md shadow-lg">
                                                    Loading...
                                                    </div>
                                                )}
                                                {error && (
                                                    <div className="absolute w-full mt-1 p-2 bg-red-50 border border-red-200 rounded-md shadow-lg">
                                                    <span className="text-red-600">{error}</span>
                                                    </div>
                                                )}
                                                {!isLoading && suggestions.length > 0 && (
                                                    <ul className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                                    {suggestions.map((patient: Patient) => (
                                                        <li

                                                        key={patient.id}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handlePatientSelect(patient)}
                                                        >
                                                        <div className="font-medium">{patient.name}</div>
                                                        <div className="text-sm text-gray-600">
                                                            Hospital ID: {patient.hospital_id} • Phone: {patient.phone}
                                                        </div>
                                                        </li>
                                                    ))}
                                                    </ul>
                                                )}
                                                 {/* {!isLoading && !error && searchTerm.length >= 2 && suggestions.length === 0 && (
                                                    <div className="absolute w-full mt-1 p-2 bg-white border rounded-md shadow-lg">
                                                    <span className="text-gray-500">No results found</span>
                                                    </div>
                                                )} */}
                                            </div>
                                        </div>
                                        <div className="flex items-end">
                                            <CreateNewPatient
                                                    onPatientCreated={(patient) => {
                                                        setData('patientId', patient.patientId.toString())
                                                        setData('hospitalId', patient.hospital_id);
                                                        setData('patientName', patient.name);
                                                        setData('phone', patient.phone);
                                                        setData('address', patient.address);
                                                        setData('district', patient.district);
                                                        setSearchTerm(patient.hospital_id);
                                                    }}
                                            />
                                        </div>
                                    </div>
                            </CardContent>
                        </Card>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-sm">Search Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="hospitalId">Hospital ID</Label>
                                        <Input
                                            id="hospitalId"
                                            type="text"
                                            disabled
                                            className="mt-1"
                                            value={data.hospitalId}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="patientName">Patient Name</Label>
                                        <Input
                                            id="patientName"
                                            type="text"
                                            disabled
                                            className="mt-1"
                                            value={data.patientName}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            disabled
                                            className="mt-1"
                                            value={data.phone}

                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            disabled
                                            className="mt-1"
                                            value={data.address}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="district">District</Label>
                                        <Input
                                            id="district"
                                            type="text"
                                            disabled
                                            className="mt-1"
                                            value={data.district}
                                        />
                                    </div>


                                </div>
                                <div className="mt-4 flex items-end">
                                        <Button
                                            type="submit"
                                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                                            disabled={processing}
                                            >
                                            {processing ? 'Add...' : 'Add'}
                                        </Button>
                                    </div>
                                </form>

                            </CardContent>
                        </Card>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Book Patient List
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-2/12 font-bold">Hospital ID</TableHead>
                                            <TableHead className="w-2/12 font-bold">Name</TableHead>
                                            <TableHead className="w-2/12 font-bold">Gender</TableHead>
                                            <TableHead className="w-2/12 font-bold">Phone</TableHead>
                                            <TableHead className="w-2/12 font-bold">Status</TableHead>
                                            <TableHead className="w-2/12 font-bold">Action</TableHead>
                                        </TableRow>

                                    </TableHeader>
                                    <TableBody>
                                        {visit.data.patients.length ? (
                                            visit.data.patients.map((patient : Patient)=>(
                                                <TableRow key={patient.id}>
                                                    <TableCell>
                                                        {patient.hospital_id}
                                                    </TableCell>
                                                    <TableCell>
                                                        {patient.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {patient.gender}
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

                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            ):(
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                    No patients
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
