import { Module } from '@nestjs/common';
import { VendorController } from './controller/vendor.controller';
import { VendorService } from './services/vendor.service';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Module({
  imports: [],
  controllers: [VendorController],
  providers: [VendorService, AdminGuard],
})
export class VendorModule {}
