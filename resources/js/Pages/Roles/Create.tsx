import React ,{useState, FormEventHandler} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm } from "@inertiajs/react";
import {PageProps} from '@/types'
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
// Shadcn Card
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from  '@/Components/ui/label';
import {Textarea } from '@/Components/ui/textarea';
const breadcrumbs = [
    { name: "Dashboard", href: route('dashboard') },
    { name: "Roles", href: route('role.index') },
    { name: "Create", href: null }
];

interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}
export default function RoleCreate() {
    const { props } = usePage<ExtendedPageProps>();
        const { flash } = props;
        const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);

     const { data, setData, post, errors, processing } = useForm({
            name: '',
            description: ''
        });
    const submit: FormEventHandler = (e) => {
            e.preventDefault();
            post(route('role.store'));
        };
    return (
        <AuthenticatedLayout>
            <Head title="Create Role" />
            <div className="space-y-6">
                {flashMessage && (
                    <div className="mb-4">
                        <FlashMessage
                            type={flashMessage.type}
                            message={flashMessage.message}
                        />
                    </div>
                )}
                <BreadcrumbComponent breadcrumbs={breadcrumbs} />
                <Card>
                    <CardHeader>
                        <CardTitle>Create Role</CardTitle>
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
                                        placeholder="Role description"
                                    />
                                    {errors.description && <span className="text-red-500">{errors.description}</span>}
                                </div>
                                <div className="flex justify-start">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </CardContent>

                </Card>
            </div>

        </AuthenticatedLayout>
    )
}
