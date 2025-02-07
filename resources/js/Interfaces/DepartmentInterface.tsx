import { PaginationLink } from "@/Interfaces/PaginationLinkInterface";
export interface Department {
    id: number;
    name: string;
    max_patients: number;

    visitDays: {
        id: number;
        day: string;

    }[];
}


export interface Departments {

    data: Department[] | null;
    meta: {
               links: Array<PaginationLink>;
               current_page: number;
               last_page: number;

           };
    }
