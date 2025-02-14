import { PaginationLink } from "@/Interfaces/PaginationLinkInterface";
export interface Patient {
    id: string;
    hospital_id: string;
    name: string;
    phone: string;
    gender:string;
    address:string;
    city:string
    district:string;
    state:string;
    pin_code:string;
  }


  export interface Patients {
     data: Patient[] | null;
        meta: {
            links: Array<PaginationLink>;
            current_page: number;
            last_page: number;

        };
  }
