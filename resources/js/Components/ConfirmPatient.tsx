import React, { useState } from 'react';
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
import {UserListInterface, UserInterface} from '@/Interfaces/UserInterface';
import {VisitStatus } from '@/types/status';
interface ConfirmPatientProp {
    visit: Visit;
    patient: Patient;
    users?: UserListInterface
}

const Status : Record<VisitStatus, string >  = {
    PENDING: 'PENDING',
    CONFIRM: 'CONFIRM',
    CANCEL: 'CANCEL',
    ATTENDED: 'ATTENDED'
};
export default function ConfirmPatient({ visit, patient, users }: ConfirmPatientProp) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    console.log(users);

    const handleSubmit = () => {
        setIsConfirm(true);
        // Add your submission logic here
        setIsConfirm(false);
        setIsOpen(false);
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
                            value={patient.visit_status}
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
                            value={selectedUser}
                            onValueChange={setSelectedUser}
                        >
                            <SelectTrigger id="user">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                               {users?.data.map((user: UserInterface) => (
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
