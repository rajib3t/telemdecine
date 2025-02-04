import { PaginationLink } from "@/Interfaces/PaginationLinkInterface";

export interface UserInterface {
    id: number;
    name: string;
    email: string;
    roles:[]

}



export interface  UserListInterface {
    data: UserInterface[];
    meta: {
        links: Array<PaginationLink>;
        current_page: number;
        last_page: number;

    };
}
