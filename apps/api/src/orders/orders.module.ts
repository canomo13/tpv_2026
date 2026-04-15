import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { KitchenGateway } from './kitchen.gateway';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [OrdersController],
  providers: [OrdersService, KitchenGateway],
  exports: [OrdersService],
})
export class OrdersModule {}

