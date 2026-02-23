import { Module } from '@nestjs/common';
import { OfferController } from './controller/offer.controller';
import { OfferService } from './services/offer.service';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Module({
  imports: [],
  controllers: [OfferController],
  providers: [OfferService, AdminGuard],
  exports: [OfferService],
})
export class OfferModule {}
