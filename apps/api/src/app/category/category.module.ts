import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './services/category.service';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService, AdminGuard],
})
export class CategoryModule {}
