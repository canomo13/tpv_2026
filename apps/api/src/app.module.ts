import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { FloorPlanModule } from './floor-plan/floor-plan.module';
import { OrdersModule } from './orders/orders.module';
import { VeriFactuModule } from './verifactu/verifactu.module';
import { PrismaModule } from './prisma/prisma.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    InventoryModule,
    FloorPlanModule,
    OrdersModule,
    VeriFactuModule,
    SettingsModule,
  ],
})
export class AppModule {}
