import { PaginationLink } from "@/Interfaces/PaginationLinkInterface";
import {  PermissionInterface} from "./PermissionInterface";
interface PermissionsListInterface extends Array<PermissionInterface> {}
export interface RoleInterface {
    id: number;

    name: string;

    description?: string;
    permissions?:PermissionsListInterface

}




export interface RoleListInterface {

    data:RoleInterface[],
    meta: {
           links: Array<PaginationLink>;
           current_page: number;
           last_page: number;

       };
}

export interface RoleFormInterface {
    name: string;
    description?: string;
}
