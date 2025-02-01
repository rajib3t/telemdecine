import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import GuestLayout from '@/Layouts/GuestLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';


interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
        <Head title='Login' />
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Welcome back! Please enter your credentials.</CardDescription>
            </CardHeader>

            {status && (
            <Alert className="mb-4 mx-6">
                <AlertDescription>{status}</AlertDescription>
            </Alert>
            )}

            <form onSubmit={handleSubmit}>
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
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                )}
                </div>

                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox
                    id="remember"
                    checked={data.remember}
                    onCheckedChange={(checked: boolean) =>

                        setData('remember', checked as any)
                    }
                    />
                    <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                    </Label>
                </div>

                {canResetPassword && (
                    <Button variant="link" asChild className="px-0">
                    <a href={route('password.request')}>
                        Forgot password?
                    </a>
                    </Button>
                )}
                </div>
            </CardContent>

            <CardFooter>
                <Button
                type="submit"
                className="w-full"
                disabled={processing}
                >
                {processing ? 'Logging in...' : 'Log in'}
                </Button>
            </CardFooter>
            </form>
        </Card>
      </GuestLayout>
  );
}
