import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminRegisterDto } from '../dto/admin-register.dto';
import { Admin } from '../interfaces/admin.interface';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Register a new admin (or update name for an existing one).
   *
   * Accepts networkId and name, and stores them with a sample "admin" role.
   * No passwords are stored; login uses a fixed password instead.
   */
  @Post('register')
  @ApiOperation({
    summary: 'Register admin (sample)',
    description:
      'Register a new admin with networkId and name. Intended as a simple sample before SSO integration.',
  })
  @ApiBody({ type: AdminRegisterDto })
  @ApiResponse({ status: 200, description: 'Admin registered successfully' })
  async register(@Body() body: AdminRegisterDto): Promise<Admin> {
    return this.adminService.register(body.networkId, body.name);
  }

  /**
   * Sample admin login.
   *
   * This accepts a networkId and password, does not store the password,
   * and requires that the admin is already registered in the
   * separate Firestore collection called "admins".
   */
  @Post('login')
  @ApiOperation({
    summary: 'Admin login (sample)',
    description:
      'Sample admin login that accepts networkId and a fixed password "admin@123". Intended to be replaced by SSO later.',
  })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully with JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() body: AdminLoginDto,
  ): Promise<{ admin: Admin; token: string }> {
    return this.adminService.login(body.networkId, body.password);
  }
}

