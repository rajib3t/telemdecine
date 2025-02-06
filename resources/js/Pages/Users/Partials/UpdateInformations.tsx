import React, { FormEventHandler } from "react";
import { UserInterface } from "@/Interfaces/UserInterface";
import { useForm } from "@inertiajs/react";
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { RoleListInterface } from "@/Interfaces/RoleInterface";

interface RoleInterface {
    id: number;
    name: string;
}

interface FormData {
    name: string;
    email: string;
    role: string;
}

interface UpdateUserInfoProps {
    user: UserInterface & {
        roles: RoleInterface[];
    };
    roles: {
        data: RoleInterface[];
    };
}

export default function UpdateUserInfo({ user, roles }: UpdateUserInfoProps) {
    // Get the initial role ID safely


    const [firstRole = { id: "" }] = user.roles || [];
    const initialRoleId = firstRole.id.toString();

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name || "",
        email: user.email || "",
        role: initialRoleId
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('user.update', user.id), {
            onSuccess: () => {
                // Handle success if needed
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Type name.."
                        className={errors.name ? "border-red-500" : ""}
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Type email.."
                        className={errors.email ? "border-red-500" : ""}
                        value={data.email}
                        required
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                        required
                        value={data.role}
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
                    {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                </div>

                <Button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                    disabled={processing}
                >
                    {processing ? 'Updating...' : 'Update User'}
                </Button>
            </div>
        </form>
    );
}
