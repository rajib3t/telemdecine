import React, { useState, FormEventHandler, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { RoleListInterface } from "@/Interfaces/RoleInterface";
import { PageProps } from '@/types';
import { UserInterface } from "@/Interfaces/UserInterface";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { FlashMessageState } from '@/Interfaces/FlashMessageState';
import { FlashMessage } from '@/Components/FlashMessage';
import UpdataUserInfo from "./Partials/UpdateInformations";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
import UpdatePassword from "./Partials/UpdatePassword";

interface EditUserProps {
    roles: RoleListInterface;
    user:{
        data:UserInterface
    }

}

interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard.index') },
    { name: "Users", href: route('user.index') },
    { name: "Edit", href: null }
];

export default function EditUser({ roles, user }: EditUserProps) {
    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const type = flash.success ? "success" : "error";
            const message = flash.success || flash.error || "";
            setFlashMessage({ type, message });

            const timer = setTimeout(() => setFlashMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout>
            <Head title={`Edit User: ${user.data.name}`} />
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
                            {`Edit User : ${user.data.name}`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                       Update User Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                        <UpdataUserInfo user={user.data} roles={roles}  />

                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Update Password
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <UpdatePassword user={user.data} />
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}
