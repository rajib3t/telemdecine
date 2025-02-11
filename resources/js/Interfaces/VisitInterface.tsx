import { Department } from "./DepartmentInterface"
import { PaginationLink } from "@/Interfaces/PaginationLinkInterface";
export interface Visit{
    id:number
    date:string
    department:Department
    hospital_name:string
    slot_number:number
    status:string
}


export interface Visits {
    data: Visit[] | null;
    meta: {
            links: Array<PaginationLink>;
            current_page: number;
            last_page: number;

    };
}
