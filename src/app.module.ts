import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ClassifiesModule } from './classifies/classifies.module';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CustomersModule } from './customers/customers.module';
@Module({
  imports: [AuthModule, PrismaModule, CategoriesModule, ClassifiesModule, ProductsModule, WarehousesModule, SuppliersModule, CustomersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
