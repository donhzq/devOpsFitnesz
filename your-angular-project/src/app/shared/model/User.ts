export interface User {
    _id : string;
    email: string;
    name: string;
    userName: string;
    password: string;
    isAdmin : boolean;
    isTrainer: boolean;
    description: string;
}