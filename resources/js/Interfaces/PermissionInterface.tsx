import { PaginationLink } from "@/Interfaces/PaginationLinkInterface";


export interface PermissionInterface {
    id: number;
    name: string;
    description: string;
}



export interface PermissionsListInterface {
    data:PermissionInterface[];
    meta: {
        links: Array<PaginationLink>;
        current_page: number;
        last_page: number;

    };
}



export interface PermissionGroupInterface {
    id: number;
    name: string;
    description: string;
    permissions: PermissionInterface[];
}


export interface PermissionGroupsListInterface {
    data:PermissionGroupInterface[];
    meta: {
        links: Array<PaginationLink>;
        current_page: number;
        last_page: number;

    };
}
