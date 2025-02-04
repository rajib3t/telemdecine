import { PaginationLink } from "@/Interfaces/PaginationLinkInterface";
export interface RoleInterface {
    id: number;

    name: string;

    description?: string;


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
