export interface RoleInterface {
    id?: number;

    name: string;


}




export interface RoleListInterface {

    roles?:RoleInterface[],
    meta?:{
        links?:{

        }
    }
}
