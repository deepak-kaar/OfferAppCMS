import { JwtService } from '@nestjs/jwt';
import { app } from 'firebase-admin';
import { Admin } from '../interfaces/admin.interface';
export declare class AdminService {
    #private;
    private firebaseApp;
    private readonly jwtService;
    constructor(firebaseApp: app.App, jwtService: JwtService);
    /**
     * Register a new admin (or update name for an existing one).
     *
     * Stores only networkId, name and role in the "admins" collection.
     */
    register(networkId: string, name: string): Promise<Admin>;
    /**
     * Simple sample login.
     *
     * - Accepts networkId and a fixed password "admin@123"
     * - Does NOT store password in the database
     * - Requires the admin to be pre-registered
     */
    login(networkId: string, password: string): Promise<{
        admin: Admin;
        token: string;
    }>;
}
