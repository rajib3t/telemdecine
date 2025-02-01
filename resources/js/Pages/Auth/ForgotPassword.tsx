import InputError from '@/Components/InputError';
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
export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-2xl font-bold">Forget Password</CardTitle>
            <CardDescription>
                Send Password Reset Link to your email address.

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
                {processing ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </CardFooter>
            </form>
        </Card>
        </GuestLayout>
    );
}
