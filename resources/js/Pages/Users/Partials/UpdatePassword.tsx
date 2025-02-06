import React, { FormEventHandler } from "react";
import { UserInterface } from "@/Interfaces/UserInterface";
import { useForm } from "@inertiajs/react";
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';


interface UserPasswordUpdataProp {
    user: UserInterface;

}

export default function UpdatePassword({ user}: UserPasswordUpdataProp){
    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    return (


            <form className="space-y-6">
                <div>
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                        id="current_password"
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                    />
                    {errors.current_password && <span className="text-red-500">{errors.current_password}</span>}
                </div>

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
                    <Button type="submit" disabled={processing}>Save</Button>
                    {recentlySuccessful && (
                        <p className="text-sm text-green-600">Saved.</p>
                    )}
                </div>
            </form>

    )
}
