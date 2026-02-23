import { app } from 'firebase-admin';
export declare class AppService {
    #private;
    private firebaseApp;
    constructor(firebaseApp: app.App);
    getData(): Promise<{
        id: string;
    }[]>;
}
