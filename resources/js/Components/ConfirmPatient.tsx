import React, { useState, useEffect } from 'react';
import { PageProps } from '@/types';
import {  usePage} from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/Components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Visit } from '@/Interfaces/VisitInterface';
import { Patient } from '@/Interfaces/PatientInterface';
import { Button } from "@/Components/ui/button";
import { CalendarCheck } from 'lucide-react';
import { UserListInterface, UserInterface } from '@/Interfaces/UserInterface';
import { VisitStatus } from '@/types/status';

interface ConfirmPatientProp {
    visit: Visit;
    patient: Patient;
    users?: UserListInterface;
}

const Status: Record<VisitStatus, string> = {
    PENDING: 'PENDING',
    CONFIRM: 'CONFIRM',
    CANCEL: 'CANCEL',
    ATTENDED: 'ATTENDED'
};

// ConfirmPatient FormData
interface ConfirmPatientFormData {
    status: string;
    createdBy: string;
    notes: string;
}
interface ExtendedPageProps extends PageProps {
    auth:{
        user:{
            id:number;
            email:string;
            name:string;
        }
    }

}
export default function ConfirmPatient({ visit, patient, users }: ConfirmPatientProp) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const [status, setStatus] = useState<string>(patient.visit_status as string || "");

    const [notes, setNotes] = useState<string>("");
    const [createByUsers, setCreateByUsers] = useState<UserInterface[] | null>(null);
     // Page Props
    const { props } = usePage<ExtendedPageProps>();
    const { auth } = props;

    const [formData, setFormData] = useState<ConfirmPatientFormData>({
        status: patient.visit_status as string || "",
        createdBy:auth?.user?.id.toString() || "",
        notes: "",
    });

    const handleSubmit = () => {
        setIsConfirm(true);
        // Add your submission logic here
        setIsConfirm(false);
        setIsOpen(false);
    };

    useEffect(() => {
        initiateCreateByUsers();
    }, []);

    const initiateCreateByUsers = async () => {
        try {
            const response = await fetch(route('user.get'));
            const data = await response.json();
            setCreateByUsers(data);


        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                >
                    <CalendarCheck className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Patient Visit</AlertDialogTitle>
                    <AlertDialogDescription>
                        Update the visit status for {patient.name}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={status}
                            onValueChange={setStatus}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(Status).map((key) => (
                                    <SelectItem key={key} value={key}>
                                        {key}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="user">Assigned To</Label>
                        <Select
                            value={formData.createdBy}
                            onValueChange={(value) =>
                                setFormData({ ...formData, createdBy: value })
                            }
                        >
                            <SelectTrigger id="user">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                {createByUsers?.map((user: UserInterface) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes..."
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isConfirm}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isConfirm || !status}
                        onClick={handleSubmit}
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
