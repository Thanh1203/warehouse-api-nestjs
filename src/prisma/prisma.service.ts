import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { env } from 'process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: env.DATABASE_URL,
        }
      }
    });
  }

  async onModuleInit() {
    await this.$connect();

    // middleware to update the updatedAt field in purchase_order table when pruchase_order_detail is updated
    this.$use(async (params, next) => {
      if (params.model === 'Purchase_Order_Details' && params.action === 'update' || params.action === 'updateMany' || params.action === 'delete') {
        const result = await next(params);
        // get the id from the params
        const id = params.args.where.PurchaseOrderId;
        // update the updatedAt field in the purchase_order table
        await this.purchase_Orders.update({
          where: { Id: id },
          data: { UpdateAt: new Date() }
        });

        return result;
      }
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
