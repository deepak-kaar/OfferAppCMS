import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { fire_store_config } from '../shared/config/config';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { VendorModule } from './vendor/vendor.module';
import { OfferModule } from './offer/offer.module';
import { CategoryModule } from './category/category.module';
import { FirebaseModule } from '../shared/modules/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [fire_store_config],
      isGlobal: true,
    }),
    FirebaseModule,
    AdminModule,
    VendorModule,
    OfferModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
