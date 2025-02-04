import React, { useEffect, useState, FormEventHandler } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head , usePage, useForm} from '@inertiajs/react';
import { PageProps} from '@/types';
import {PermissionGroupInterface} from '@/Interfaces/PermissionInterface';
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
// Shadcn  Component Card
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
// Shadcn Form property
import { Input } from '@/Components/ui/input';
import { Label } from  '@/Components/ui/label';
import {Textarea } from '@/Components/ui/textarea';
interface EditProps {
    permissionGroup: {
        data : PermissionGroupInterface
    } ;
}

// Global Page Property
interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function EditPermission({permissionGroup}:EditProps) {

    // Page Props
    const { props } = usePage<ExtendedPageProps>();
    // Extract flash message  from property
    const { flash } = props;
    // Flash Message
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    // Set Flash Message
    useEffect(() => {
        if (flash?.success || flash?.error) {
            const type = flash.success ? "success" : "error";
            const message = flash.success || flash.error || "";
            setFlashMessage({ type, message });

            const timer = setTimeout(() => setFlashMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: permissionGroup.data.name,
            description: permissionGroup.data.description
        });
    const submit: FormEventHandler = (e) => {

            e.preventDefault();
            patch(route('permission.update', permissionGroup.data.id))

        };
    return (
        <AuthenticatedLayout>
            <Head title={`Edit Permission :  ${permissionGroup.data.name} `} />
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
                    <CardTitle>Edit Permission : {permissionGroup.data.name }</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Role name"

                                />
                                {errors.name && <span className="text-red-500">{errors.name}</span>}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Permission description"
                                />
                                {errors.description && <span className="text-red-500">{errors.description}</span>}
                            </div>
                            <div className="flex justify-start">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                                >
                                     {processing ? 'Updating...' : 'Update'}

                                </button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </AuthenticatedLayout>
    );
}
