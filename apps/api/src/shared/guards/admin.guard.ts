import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string | undefined;

    console.log('AdminGuard - Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('AdminGuard - Missing or invalid Authorization header');
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.slice(7);
    console.log('AdminGuard - Token extracted:', token.substring(0, 20) + '...');

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('AdminGuard - Decoded JWT payload:', payload);

      if (!payload || payload.role !== 'admin') {
        console.log('AdminGuard - Admin role check failed. Role:', payload?.role);
        throw new ForbiddenException('Admin role required');
      }

      // Attach user payload to request for downstream handlers if needed
      request.user = payload;

      console.log('AdminGuard - Authorization successful');
      return true;
    } catch (error) {
      console.log('AdminGuard - Error during verification:', error.message);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
