import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/Components/ui/card';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
            <CardDescription>
                Reset your password here.
            </CardDescription>
            </CardHeader>

            {status && (
            <Alert className="mb-4 mx-6 w-auto border-0">
                <AlertDescription className="text-success">{status}</AlertDescription>
            </Alert>
            )}

            <form onSubmit={submit}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                    required
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={errors.password ? 'border-red-500' : ''}
                        required
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Confirm Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={errors.password_confirmation ? 'border-red-500' : ''}
                        required
                         autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                    )}
                </div>



                <Button variant="link" asChild className="px-0">
                    <a href={route('login')}>
                        <span className="text-sm">Back to login</span>
                    </a>
                </Button>

            </CardContent>

            <CardFooter>
                <Button
                type="submit"
                className="w-full"
                disabled={processing}
                >
                {processing ? 'Password Resetting...' : 'Reset Password' }
                </Button>
            </CardFooter>
            </form>
        </Card>
        </GuestLayout>
    );
}
