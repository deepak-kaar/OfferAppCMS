import { AdminService } from '../services/admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminRegisterDto } from '../dto/admin-register.dto';
import { Admin } from '../interfaces/admin.interface';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    /**
     * Register a new admin (or update name for an existing one).
     *
     * Accepts networkId and name, and stores them with a sample "admin" role.
     * No passwords are stored; login uses a fixed password instead.
     */
    register(body: AdminRegisterDto): Promise<Admin>;
    /**
     * Sample admin login.
     *
     * This accepts a networkId and password, does not store the password,
     * and requires that the admin is already registered in the
     * separate Firestore collection called "admins".
     */
    login(body: AdminLoginDto): Promise<{
        admin: Admin;
        token: string;
    }>;
}
