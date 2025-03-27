import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role/role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    HttpModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, AuthGuard, RolesGuard],
  exports: [ProductService],
})
export class ProductModule {}
