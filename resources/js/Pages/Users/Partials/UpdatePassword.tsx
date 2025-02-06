import React, { FormEventHandler, useRef} from "react";
import { UserInterface } from "@/Interfaces/UserInterface";
import { useForm } from "@inertiajs/react";
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';


interface UserPasswordUpdataProp {
    user: UserInterface;

}

export default function UpdatePassword({ user}: UserPasswordUpdataProp){
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const {
        data,
        setData,
        errors,
        patch,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({

        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('user.password.update', user.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }


            },
        });
    };
    return (


            <form className="space-y-6" onSubmit={updatePassword}>


                <div>
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                    />
                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                </div>

                <div>
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}> {processing ? 'Updating...' : 'Update Password'}</Button>
                    {recentlySuccessful && (
                        <p className="text-sm text-green-600">Saved.</p>
                    )}
                </div>
            </form>

    )
}
