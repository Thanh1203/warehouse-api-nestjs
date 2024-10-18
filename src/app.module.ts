import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProducersModule } from './producers/producers.module';
import { CategoriesModule } from './categories/categories.module';
import { ClassifiesModule } from './classifies/classifies.module';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
@Module({
  imports: [AuthModule, PrismaModule, ProducersModule, CategoriesModule, ClassifiesModule, ProductsModule, WarehousesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
