export interface User {
    callerfirstname: string;
    callerlastname: string;
    address: string;
    callerWorkPhone?: string;
    callerEmail: string;
    requestType: string[];
    callerComments?: string;
}
