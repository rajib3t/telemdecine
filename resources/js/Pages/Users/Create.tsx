import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { FlashMessage } from '@/Components/FlashMessage';
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import { Head, usePage, useForm } from '@inertiajs/react';
import {RoleListInterface} from '@/Interfaces/RoleInterface'
import BreadcrumbComponent from '@/Components/Breadcrumb';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from  '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/Components/ui/select"
interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };

}

interface CreateUserProps {
    roles: RoleListInterface;
    filters: any;
}
export default function CreateUser({roles}:CreateUserProps){
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


     const { data, setData, post, errors, processing } = useForm({
                name: '',
                email: '',
                password:'',
                password_confirmation:"",
                role:'',
            });
    const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                post(route('user.store'));
            };

    const breadcrumbs = [
        { name: "Dashboard", href: route('dashboard') },
        { name: "Users", href: route('user.index') },
        { name: "Create", href: null }
    ];

    return (
        <AuthenticatedLayout>
            <Head title='Create User' />
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
                        <CardTitle>User Create</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor='name' className='block text-sm font-medium text-gray-700' >Name</Label>
                                    <Input
                                        id='name'
                                        name='name'
                                        placeholder='Type name..'
                                        className={errors.name ? 'border-red-500' : ''}
                                        required
                                        value={data.name}
                                        onChange={(e)=>setData('name', e.target.value)}
                                        />
                                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                                </div>

                                <div>
                                    <Label htmlFor='email' className='block text-sm font-medium text-gray-700' >Email</Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        name='email'
                                        placeholder='Type email..'
                                        className={errors.email ? 'border-red-500' : ''}
                                        value={data.email}
                                        required
                                        onChange={(e)=>setData('email', e.target.value)}
                                        />
                                        {errors.email && <span className="text-red-500">{errors.email}</span>}
                                </div>
                                <div>
                                    <Label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</Label>
                                    <Input
                                        id='password'
                                        type='password'
                                        name='password'
                                        placeholder='Type password..'
                                        className={errors.password ? 'border-red-500' : ''}
                                        required
                                        onChange={(e)=>setData('password', e.target.value)}
                                    />
                                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                                </div>

                                <div>
                                    <Label htmlFor='password_confirmation' className='block text-sm font-medium text-gray-700'>Confirm Password</Label>
                                    <Input
                                        id='password_confirmation'
                                        type='password'
                                        name='password_confirmation'
                                        placeholder='Confirm password..'
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                        required
                                        onChange={(e)=>setData('password_confirmation', e.target.value)}
                                    />
                                    {errors.password_confirmation && <span className="text-red-500">{errors.password_confirmation}</span>}
                                </div>
                                <div>
                                <Label htmlFor='role' className='block text-sm font-medium text-gray-700' >Role</Label>
                                <Select
                                    required
                                    onValueChange={(value) => setData('role', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.data.map((role) => (
                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                </div>

                                <Button
                                    type="submit"
                                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                                    disabled={processing}
                                    >
                                    {processing ? 'Creating...' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </AuthenticatedLayout>
    )
}
