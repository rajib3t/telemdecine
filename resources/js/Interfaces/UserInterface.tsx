export interface UserInterface {
    id: number;
    name: string;
    email: string;

}


export interface  UserListInterface {
    users: UserInterface[];
    meta?:{
        links?:{

        }
    }
}
