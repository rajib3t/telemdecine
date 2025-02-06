import { RoleListInterface } from "@/Interfaces/RoleInterface";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles?: RoleListInterface
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
