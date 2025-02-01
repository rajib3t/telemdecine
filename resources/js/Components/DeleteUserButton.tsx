import React, { useState, MouseEvent } from 'react';
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
import { Button } from "@/Components/ui/button";
import { router } from '@inertiajs/react';
import { Trash } from 'lucide-react'
import { UserInterface } from '@/Interfaces/UserInterface';
interface DeleteUserProps {
    user: UserInterface;
    userName: string;
    page: number;
}

export default function DeleteUserButton({ user, userName, page }: DeleteUserProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDelete = () => {
        setIsDeleting(true);
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        formData.append('page', page.toString());

        router.post(route('user.delete', {user:user}), formData, {
            onSuccess: () => {
                setIsOpen(false);
                setIsDeleting(false);
            },
            onError: (errors) => {
                console.error('Delete failed', errors);
                setIsDeleting(false);
            }
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        user <span className="font-bold">{userName}</span> from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction

                        onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete User'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
