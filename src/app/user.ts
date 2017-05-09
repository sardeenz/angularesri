export interface User {
    firstname: string;
    lastname: string;
    address: string;
    phone?: string;
    email: string;
    requestType?: string[];
    comments?: string;
}
